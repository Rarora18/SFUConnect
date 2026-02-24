import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import { MantineProvider } from '@mantine/core'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'

const savedTheme = (() => {
  try {
    return localStorage.getItem('huddled-theme') || 'light'
  } catch {
    return 'light'
  }
})()
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={{ fontFamily: "Orbitron, sans-serif" }}>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
)

