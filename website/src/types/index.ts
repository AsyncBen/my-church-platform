// Add your TypeScript types here
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
}
