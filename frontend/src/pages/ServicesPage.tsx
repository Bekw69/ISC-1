import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/client'
import { CATEGORIES, type Service } from '../constants'

const FILTER_CATEGORIES = [
  { label: 'Барлық санаттар', value: '' },
  ...CATEGORIES.map(c => ({ label: c.name, value: c.value })),
]

export default function ServicesPage() {
  const [searchParams] = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    api.get(`/services?${params}`).then(r => setServices(r.data)).finally(() => setLoading(false))
  }, [search, category])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">

        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 font-semibold text-gray-700 mb-4">
              <span>⚙</span> Filters
            </div>

            {/* Search */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 font-medium mb-2">Қызметтер</p>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Қызметтерді іздеу..."
                  className="w-full border border-gray-200 rounded px-2 pl-6 py-1.5 text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">Категория</p>
              <div className="space-y-1">
                {FILTER_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`block w-full text-left text-xs px-2 py-1.5 rounded transition
                      ${category === cat.value
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{services.length} нәтиже</p>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Жүктелуде...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Қызметтер табылмады</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(s => (
                <Link key={s.id} to={`/services/${s.id}`}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition p-5 flex flex-col gap-2">
                  <div className="text-xs text-indigo-600 font-medium">{s.category}</div>
                  <h2 className="font-semibold text-gray-900 text-sm line-clamp-2">{s.title}</h2>
                  <p className="text-xs text-gray-500 line-clamp-3 flex-1">{s.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{s.seller_name}</span>
                    <span className="font-bold text-indigo-600">${s.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
