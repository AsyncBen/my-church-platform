import type { ComponentType } from 'react'
import { BookOpen, Heart, LayoutDashboard, Megaphone, Monitor, Radio, Rss } from 'lucide-react'
import type { Role, Screen } from '../types/media.types'

export const ROLE_SCREENS: Record<Role, Screen[]> = {
  Media: ['dashboard', 'live', 'monitoring'],
  Pastor: ['dashboard', 'live', 'sermons', 'announcements', 'feed', 'monitoring', 'giving'],
  Secretary: ['dashboard', 'announcements', 'feed', 'giving', 'monitoring'],
  Admin: ['dashboard', 'live', 'sermons', 'announcements', 'feed', 'monitoring', 'giving'],
}

export const ROLE_META: Record<Role, { label: string; description: string; color: string; badge: string }> = {
  Media: {
    label: 'Media Team',
    description: 'Live service & broadcasting',
    color: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/25',
  },
  Pastor: {
    label: 'Pastor',
    description: 'Sermon & congregation lead',
    color: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/25',
  },
  Secretary: {
    label: 'Secretary',
    description: 'Administration & records',
    color: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/25',
  },
  Admin: {
    label: 'Admin',
    description: 'Full platform access',
    color: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/25',
  },
}

export const ALL_NAV: { id: Screen; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live', label: 'Live Control', icon: Radio },
  { id: 'sermons', label: 'Sermons', icon: BookOpen },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'feed', label: 'Feed', icon: Rss },
  { id: 'monitoring', label: 'Monitoring', icon: Monitor },
  { id: 'giving', label: 'Giving Reports', icon: Heart },
]

export const categoryColors: Record<string, string> = {
  General: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Event: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Emergency: 'bg-red-500/20 text-red-300 border-red-500/30',
  Prayer: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Offering: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
}
