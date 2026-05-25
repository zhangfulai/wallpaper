export interface User {
  id: number
  username: string
  role: string
}

export interface Category {
  id: number
  name: string
  description?: string
  sort: number
  createdAt: string
  updatedAt: string
  _count?: { wallpapers: number }
}

export interface Wallpaper {
  id: number
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  categoryId?: number
  tags: string[]
  status: 'ACTIVE' | 'DISABLED'
  createdAt: string
  updatedAt: string
  category?: Category
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
