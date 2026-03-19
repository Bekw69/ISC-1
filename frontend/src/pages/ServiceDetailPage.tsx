import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import { CATEGORIES, type Service } from '../constants'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const [service, setService] = useState<Service | null>(null)
  const [requirements, setRequirements] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' })

  useEffect(() => {
    api.get(`/services/${id}`).then(r => {
      setService(r.data)
      const s = r.data
      setForm({ title: s.title, description: s.description, price: s.price, category: s.category })
    })
  }, [id])

  const hire = async () => {
    if (!user) { navigate('/login'); return }
    setLoading(true)
    try {
      await api.post('/orders', { service_id: id, requirements })
      toast.success('Hire request sent!')
      navigate('/my-orders')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error')
    } finally { setLoading(false) }
  }

  const update = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await api.put(`/services/${id}`, form)
      setService({ ...service, ...data })
      setEditing(false)
      toast.success('Service updated!')
    } catch { toast.error('Error') }
  }

  const remove = async () => {
    if (!confirm('Delete this service?')) return
    await api.delete(`/services/${id}`)
    toast.success('Deleted')
    navigate('/')
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value })

  if (!service) return <div className="text-center py-16 text-gray-400">Loading...</div>

  const isOwner = user?.id === service.seller_id

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline mb-4 block">← Back</button>
      <div className="bg-white rounded-xl shadow p-8">
        {editing ? (
          <form onSubmit={update} className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Edit Service</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input className="w-full border rounded px-3 py-2" value={form.title} onChange={set('title')} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full border rounded px-3 py-2" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea className="w-full border rounded px-3 py-2 h-28" value={form.description} onChange={set('description')} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input className="w-full border rounded px-3 py-2" type="number" min="1" value={form.price} onChange={set('price')} required />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="flex-1 border py-2 rounded hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="text-sm text-indigo-600 font-medium mb-2">{service.category}</div>
            <h1 className="text-2xl font-bold mb-2">{service.title}</h1>
            <p className="text-gray-500 text-sm mb-4">by {service.seller_name}</p>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{service.description}</p>
            <div className="text-3xl font-bold text-indigo-600 mb-6">${service.price}</div>

            {isOwner && (
              <div className="flex gap-3 mb-6">
                <button onClick={() => setEditing(true)} className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded hover:bg-indigo-50">Edit</button>
                <button onClick={remove} className="flex-1 border border-red-500 text-red-500 py-2 rounded hover:bg-red-50">Delete</button>
              </div>
            )}

            {user?.role === 'client' && (
              <div className="border-t pt-6">
                <h2 className="font-semibold mb-3">Send Hire Request</h2>
                <textarea className="w-full border rounded px-3 py-2 mb-3 h-24" placeholder="Describe your requirements..."
                  value={requirements} onChange={e => setRequirements(e.target.value)} />
                <button onClick={hire} disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-full">
                  {loading ? 'Sending...' : 'Hire Now'}
                </button>
              </div>
            )}
            {!user && (
              <button onClick={() => navigate('/login')} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-full">
                Login to Hire
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
