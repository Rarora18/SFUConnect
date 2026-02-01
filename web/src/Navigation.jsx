import { useState } from 'react'
import { signOut } from "firebase/auth"
import { auth } from "./firebase"
import { useNavigate } from "react-router-dom"
import './Navigation.css'

export default function Navigation() {
  const navigate = useNavigate()
  const user = auth.currentUser
  const pfp = user?.photoURL   // ⭐ FIX: define pfp safely

  const items = [
    { icon: '🏠', label: 'Home' },
    { icon: '💬', label: 'Chat' },
    { icon: '👤', label: 'Account' },
    { icon: '⚙️', label: 'Settings' },
    { icon: '🚪', label: 'Logout' },
  ]

  const [active, setActive] = useState('Home')

  const handleClick = async (label) => {
    setActive(label)
    if (label === 'Account') {
      navigate('/profile')
    } else if (label === 'Settings') {
      navigate('/settings')
    } else if (label === 'Logout') {
      try {
        await signOut(auth)
        navigate('/login')
      } catch (err) {
        console.error('Logout failed:', err)
      }
    }
  }

  return (
    <nav className="rail" aria-label="Primary navigation">
      <ul className="rail-list">

        {/* Profile picture above Home */}
        <li className="rail-li">
          <div className="rail-pfp">
            {pfp
              ? <img src={pfp} alt="pfp" />
              : <span className="rail-ico">👤</span>
            }
          </div>
        </li>

        {items.map((item) => (
          <li key={item.label} className="rail-li">
            <button
              className={`rail-btn ${active === item.label ? 'active' : ''}`}
              onClick={() => handleClick(item.label)}
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
