import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },

    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/pages/stamping')).default,
        }),
      },
    ],
  },
])

export default router