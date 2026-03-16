import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function IncomingOrdersPage() {
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get('/orders/incoming').then(r => setOrders(r.data)).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: number, status: string) => {
    await api.patch(`/orders/${id}/status`, { status })
    setOrders(orders.map(o => o.id === id ? {...o, status} : o))
    toast.success(`Order ${status}`)
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Incoming Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No incoming orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">{o.service_title}</h2>
                  <p className="text-sm text-gray-500 mt-1">from {o.buyer_name}</p>
                  {o.requirements && <p className="text-sm text-gray-600 mt-2 italic">"{o.requirements}"</p>}
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-600">${o.price}</div>
                  <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                    {o.status}
                  </span>
                </div>
              </div>
              {o.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => updateStatus(o.id, 'accepted')}
                    className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700">Accept</button>
                  <button onClick={() => updateStatus(o.id, 'rejected')}
                    className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600">Reject</button>
                </div>
              )}
              {o.status === 'accepted' && (
                <button onClick={() => updateStatus(o.id, 'completed')}
                  className="mt-3 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">Mark Complete</button>
              )}
              <p className="text-xs text-gray-400 mt-3">{new Date(o.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
