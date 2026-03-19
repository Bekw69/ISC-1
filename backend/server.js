require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Pool } = require('pg')

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET

const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })
  try { req.user = jwt.verify(token, JWT_SECRET); next() }
  catch { res.status(401).json({ message: 'Invalid token' }) }
}

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body
  if (!email || !password || !name) return res.status(400).json({ message: 'All fields required' })
  try {
    const hash = await bcrypt.hash(password, 10)
    const { rows } = await db.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1,$2,$3,$4) RETURNING id, email, name, role',
      [email, hash, name, role || 'client']
    )
    const user = rows[0]
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user })
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ message: 'Email already exists' })
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email=$1', [email])
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' })
    const user = rows[0]
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.get('/api/services', async (req, res) => {
  const { category, search } = req.query
  let query = 'SELECT s.*, u.name AS seller_name FROM services s JOIN users u ON s.seller_id = u.id WHERE 1=1'
  const params = []
  if (category) { params.push(category); query += ` AND s.category=$${params.length}` }
  if (search) { params.push(`%${search}%`); query += ` AND (s.title ILIKE $${params.length} OR s.description ILIKE $${params.length})` }
  query += ' ORDER BY s.created_at DESC'
  try {
    const { rows } = await db.query(query, params)
    res.json(rows)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.get('/api/services/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT s.*, u.name AS seller_name FROM services s JOIN users u ON s.seller_id=u.id WHERE s.id=$1',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Not found' })
    res.json(rows[0])
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.post('/api/services', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can post services' })
  const { title, description, price, category } = req.body
  if (!title || !description || !price) return res.status(400).json({ message: 'All fields required' })
  try {
    const { rows } = await db.query(
      'INSERT INTO services (title, description, price, category, seller_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [title, description, price, category || 'Other', req.user.id]
    )
    res.status(201).json(rows[0])
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.put('/api/services/:id', auth, async (req, res) => {
  const { title, description, price, category } = req.body
  try {
    const { rows } = await db.query(
      'UPDATE services SET title=$1, description=$2, price=$3, category=$4 WHERE id=$5 AND seller_id=$6 RETURNING *',
      [title, description, price, category, req.params.id, req.user.id]
    )
    if (!rows.length) return res.status(403).json({ message: 'Not allowed' })
    res.json(rows[0])
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.delete('/api/services/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM services WHERE id=$1 AND seller_id=$2', [req.params.id, req.user.id])
    res.json({ message: 'Deleted' })
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.delete('/api/orders/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM orders WHERE id=$1 AND buyer_id=$2', [req.params.id, req.user.id])
    res.json({ message: 'Deleted' })
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.post('/api/orders', auth, async (req, res) => {
  const { service_id, requirements } = req.body
  if (!service_id) return res.status(400).json({ message: 'service_id required' })
  try {
    const { rows } = await db.query(
      'INSERT INTO orders (service_id, buyer_id, requirements) VALUES ($1,$2,$3) RETURNING *',
      [service_id, req.user.id, requirements || '']
    )
    res.status(201).json(rows[0])
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.get('/api/orders', auth, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT o.*, s.title AS service_title, s.price, u.name AS seller_name
      FROM orders o JOIN services s ON o.service_id=s.id JOIN users u ON s.seller_id=u.id
      WHERE o.buyer_id=$1 ORDER BY o.created_at DESC
    `, [req.user.id])
    res.json(rows)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.get('/api/orders/incoming', auth, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT o.*, s.title AS service_title, s.price, u.name AS buyer_name
      FROM orders o JOIN services s ON o.service_id=s.id JOIN users u ON o.buyer_id=u.id
      WHERE s.seller_id=$1 ORDER BY o.created_at DESC
    `, [req.user.id])
    res.json(rows)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.patch('/api/orders/:id/status', auth, async (req, res) => {
  try {
    await db.query('UPDATE orders SET status=$1 WHERE id=$2', [req.body.status, req.params.id])
    res.json({ message: 'Updated' })
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.get('/api/admin/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
  try {
    const { rows } = await db.query('SELECT id, email, name, role FROM users ORDER BY id')
    res.json(rows)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.get('/api/admin/orders', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
  try {
    const { rows } = await db.query(`
      SELECT o.id, o.requirements, o.status, o.created_at,
             s.title AS service_title, s.price,
             buyer.name AS buyer_name, seller.name AS seller_name
      FROM orders o
      JOIN services s ON o.service_id = s.id
      JOIN users buyer ON o.buyer_id = buyer.id
      JOIN users seller ON s.seller_id = seller.id
      ORDER BY o.created_at DESC
    `)
    res.json(rows)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.get('/api/me', auth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, email, name, role FROM users WHERE id=$1', [req.user.id])
    res.json(rows[0])
  } catch { res.status(500).json({ message: 'Server error' }) }
})

app.listen(PORT, () => console.log(`StudyGig API running on http://localhost:${PORT}`))
