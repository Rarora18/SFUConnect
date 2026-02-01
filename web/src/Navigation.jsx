import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
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
  const [pfp, setPfp] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('selectedPfp') || ''
    setPfp(stored)
  }, [])

  function handleClick(item) {
    setActive(item.label)
    if (item.label === 'Account') {
      navigate('/profile')
    } else if (item.label === 'Settings') {
      navigate('/settings')
    } else if (item.label === 'Logout') {
      signOut(auth).then(() => navigate('/login'))
    }
  }

  return (
    <nav className="rail" aria-label="Primary navigation">
      <ul className="rail-list">
        {/* pfp above home */}
        <li className="rail-li">
          <div className="rail-pfp">
            {pfp ? <img src={pfp} alt="pfp" /> : <span className="rail-ico">👤</span>}
          </div>
        </li>

        {items.map((item) => (
          <li key={item.label} className="rail-li">
            <button
              className={`rail-btn ${active === item.label ? 'active' : ''}`}
              onClick={() => handleClick(item)}
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
