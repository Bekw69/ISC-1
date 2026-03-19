import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/client'
import { useAuthStore } from '../../store/authStore'
import { INPUT_CLASS as inp } from '../../constants'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth(data.token, data.user)
      navigate('/')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Қате деректер')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600">StudyGig</h1>
          <p className="text-gray-500 text-sm mt-1">Кіру</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Почта</label>
            <input className={inp} type="email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Құпия сөз</label>
            <input className={inp} type="password" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button className="w-full bg-indigo-600 text-white py-2.5 rounded text-sm font-medium hover:bg-indigo-700 mt-2" disabled={loading}>
            {loading ? 'Жүктелуде...' : 'Кіру'}
          </button>
        </form>
        <p className="text-center text-xs mt-4 text-gray-500">
          Аккаунтыңыз жоқ па?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">Тіркелу</Link>
        </p>
      </div>
    </div>
  )
}
