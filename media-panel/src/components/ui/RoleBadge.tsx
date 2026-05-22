import type { Role } from '../../types/media.types'
import { ROLE_META } from '../../utils/media-constants'
import { Shield } from 'lucide-react'

export function RoleBadge({ role }: { role: Role }) {
  const meta = ROLE_META[role]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${meta.badge}`}>
      {role === 'Admin' && <Shield className="w-2.5 h-2.5" />}
      {meta.label}
    </span>
  )
}
