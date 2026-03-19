import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  return (
    <nav className="bg-white border-b px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-lg font-bold text-indigo-600">StudyGig</Link>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-indigo-600">Басты бет</Link>
          <Link to="/services" className="hover:text-indigo-600">Қызметтер</Link>
          {user?.role === 'student' && <Link to="/post-service" className="hover:text-indigo-600">Қызмет қосу</Link>}
          {user?.role === 'student' && <Link to="/incoming-orders" className="hover:text-indigo-600">Тапсырыстар</Link>}
          {user?.role === 'client' && <Link to="/my-orders" className="hover:text-indigo-600">Менің тапсырыстарым</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="hover:text-indigo-600">Админ</Link>}
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 border rounded px-2 py-1">
          🌐 <span>KZ</span>
        </button>
        {user ? (
          <>
            <span className="text-gray-500">{user.name}</span>
            <button onClick={() => { logout(); navigate('/') }}
              className="border border-gray-300 text-gray-600 px-4 py-1.5 rounded hover:bg-gray-50">
              Шығу
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-1.5">Кіру</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700">Тіркелу</Link>
          </>
        )}
      </div>
    </nav>
  )
}
