import { useState } from 'react'
import './Navigation.css'

export default function Navigation() {
  const items = [
    { icon: '🏠', label: 'Home' },
    { icon: '💬', label: 'Chat' },
    { icon: '👤', label: 'Account' },
    { icon: '⚙️', label: 'Settings' },
    { icon: '🚪', label: 'Logout' },
  ]

  const [active, setActive] = useState('Home')

  return (
    <nav className="rail" aria-label="Primary navigation">
      <ul className="rail-list">
        {items.map((item) => (
          <li key={item.label} className="rail-li">
            <button
              className={`rail-btn ${active === item.label ? 'active' : ''}`}
              onClick={() => setActive(item.label)}
              aria-label={item.label}
              title={item.label}
            >
              <span className="rail-ico" aria-hidden="true">
                {item.icon}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
