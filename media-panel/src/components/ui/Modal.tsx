import type { ReactNode } from 'react'

export function Modal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  )
}
