import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function MyOrdersPage() {
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get('/orders').then(r => setOrders(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-16 text-gray-400">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No orders yet. <a href="/" className="text-indigo-600 hover:underline">Browse services</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">{o.service_title}</h2>
                  <p className="text-sm text-gray-500 mt-1">by {o.seller_name}</p>
                  {o.requirements && <p className="text-sm text-gray-600 mt-2">"{o.requirements}"</p>}
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-600">${o.price}</div>
                  <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                    {o.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                {o.status === 'pending' && (
                  <button onClick={async () => {
                    if (!confirm('Cancel this order?')) return
                    await api.delete(`/orders/${o.id}`)
                    setOrders(orders.filter(x => x.id !== o.id))
                  }} className="text-xs text-red-500 hover:underline">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
