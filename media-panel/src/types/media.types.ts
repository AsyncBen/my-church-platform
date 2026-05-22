export type Screen =
  | 'login'
  | 'dashboard'
  | 'live'
  | 'sermons'
  | 'announcements'
  | 'monitoring'
  | 'giving'

export type Role = 'Media' | 'Pastor' | 'Secretary' | 'Admin'

export interface Scripture {
  id: string
  ref: string
  text: string
  favorite?: boolean
}

export interface QueueItem {
  id: string
  ref: string
  text: string
  active?: boolean
  broadcast?: boolean
}

export interface ActivityItem {
  id: string
  type: 'scripture' | 'announcement' | 'service' | 'sync'
  message: string
  time: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  category: 'General' | 'Event' | 'Emergency' | 'Prayer' | 'Offering'
  sent?: boolean
  time?: string
  scheduled?: string
}

export interface GivingRecord {
  id: string
  name: string
  amount: number
  ref: string
  service: string
  date: string
  type: 'tithe' | 'offering' | 'special'
}

export interface Sermon {
  id: string
  title: string
  series: string
  pastor: string
  date: string
  scriptures: string[]
  status: 'draft' | 'ready' | 'delivered'
}
