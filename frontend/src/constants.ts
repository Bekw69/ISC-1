export interface Service {
  id: number
  title: string
  description: string
  price: number
  category: string
  seller_id: number
  seller_name: string
  created_at: string
}

export interface Order {
  id: number
  service_id: number
  service_title: string
  price: number
  requirements: string
  status: 'pending' | 'accepted' | 'completed' | 'rejected'
  created_at: string
  buyer_name?: string
  seller_name?: string
}

export const CATEGORIES = [
  { name: 'Веб-разработка', icon: '💻', value: 'Web Development' },
  { name: 'Дизайн',         icon: '🎨', value: 'Design' },
  { name: 'Копирайтинг',    icon: '✍️', value: 'Writing' },
  { name: 'Маркетинг',      icon: '📈', value: 'Marketing' },
  { name: 'Видеомонтаж',    icon: '🎬', value: 'Video' },
  { name: 'Другое',         icon: '🔧', value: 'Other' },
]

export const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  accepted:  'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  rejected:  'bg-red-100 text-red-700',
}

export const INPUT_CLASS = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-400'
