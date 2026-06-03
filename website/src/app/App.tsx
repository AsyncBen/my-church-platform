import { RouterProvider } from 'react-router-dom'
import { FC } from 'react'
import { router } from '../config/routes'

export const App: FC = () => {
  return <RouterProvider router={router} />
}

export default App
