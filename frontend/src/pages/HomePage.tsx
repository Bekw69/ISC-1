import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import { CATEGORIES, type Service } from '../constants'

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.slice(0, 8))).catch(() => {})
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/services?search=${encodeURIComponent(search)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Студент фрилансерлерді табыңыз</h1>
          <p className="text-indigo-200 mb-8 text-sm">Жобаларыңызды үздік сәт жеткізген болашақ таланты студенттерге жалдаңыз</p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Қызметтерді іздеу..."
                className="w-full pl-9 pr-4 py-3 rounded text-gray-900 text-sm focus:outline-none"
              />
            </div>
            <button type="submit" className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded hover:bg-indigo-50 transition text-sm">
              Іздеу
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">Танымал санаттар</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {CATEGORIES.map(cat => (
              <button key={cat.value}
                onClick={() => navigate(`/services?category=${encodeURIComponent(cat.value)}`)}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-indigo-400 hover:shadow-sm transition cursor-pointer">
                <div className="text-2xl mb-1">{cat.icon}</div>
                <p className="text-xs font-medium text-gray-600">{cat.name}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Featured services */}
        {services.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Танымал қызметтер</h2>
              <Link to="/services" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Барлығын көру →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map(s => (
                <Link key={s.id} to={`/services/${s.id}`}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition p-4 flex flex-col gap-2">
                  <div className="text-xs text-indigo-600 font-medium">{s.category}</div>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{s.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 flex-1">{s.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{s.seller_name}</span>
                    <span className="font-bold text-indigo-600 text-sm">${s.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
