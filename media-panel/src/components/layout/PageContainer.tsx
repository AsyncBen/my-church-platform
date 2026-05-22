import type { ReactNode } from 'react'

export function PageContainer({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="page-container">
      <h2>{title}</h2>
      <div className="page-content">{children}</div>
    </section>
  )
}
