import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/client'
import { useAuthStore } from '../../store/authStore'

const inp = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-400'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' })
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      setAuth(data.token, data.user)
      navigate('/')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Тіркелу сәтсіз')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600">StudyGig</h1>
          <p className="text-gray-500 text-sm mt-1">Тіркелу</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Толық аты-жөні</label>
            <input className={inp} value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Поштa</label>
            <input className={inp} type="email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Құпия сөз</label>
            <input className={inp} type="password" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Мен...</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'client',  label: 'Клиент',  icon: '🏢' },
                { value: 'student', label: 'Студент', icon: '🎓' },
              ] as const).map(r => (
                <label key={r.value}
                  className={`border-2 rounded-lg p-3 text-center cursor-pointer transition
                    ${form.role === r.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" className="sr-only" value={r.value} checked={form.role === r.value}
                    onChange={() => setForm({...form, role: r.value})} />
                  <div className="text-xl mb-1">{r.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{r.label}</div>
                </label>
              ))}
            </div>
          </div>
          <button className="w-full bg-indigo-600 text-white py-2.5 rounded text-sm font-medium hover:bg-indigo-700" disabled={loading}>
            {loading ? 'Жүктелуде...' : 'Аккаунт тіркеу'}
          </button>
        </form>
        <p className="text-center text-xs mt-4 text-gray-500">
          Аккаунтыңыз бар ма?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">Кіру</Link>
        </p>
      </div>
    </div>
  )
}
