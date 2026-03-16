import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

const CATEGORIES = ['Web Development', 'Design', 'Writing', 'Marketing', 'Video', 'Other']

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    {children}
  </div>
)

export default function PostServicePage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Web Development' })
  const [loading, setLoading] = useState(false)

  if (!user || user.role !== 'student')
    return <div className="text-center py-16 text-gray-500">Only students can post services.</div>

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/services', form)
      toast.success('Service posted!')
      navigate('/')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Post a Service</h1>
      <div className="bg-white rounded-xl shadow p-8">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Title">
            <input className="w-full border rounded px-3 py-2" placeholder="e.g. I will build your website"
              value={form.title} onChange={set('title')} required />
          </Field>
          <Field label="Category">
            <select className="w-full border rounded px-3 py-2" value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Description">
            <textarea className="w-full border rounded px-3 py-2 h-28" placeholder="Describe what you offer..."
              value={form.description} onChange={set('description')} required />
          </Field>
          <Field label="Price ($)">
            <input className="w-full border rounded px-3 py-2" type="number" min="1" placeholder="50"
              value={form.price} onChange={set('price')} required />
          </Field>
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" disabled={loading}>
            {loading ? 'Posting...' : 'Post Service'}
          </button>
        </form>
      </div>
    </div>
  )
}
