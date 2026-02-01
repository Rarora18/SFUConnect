import { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiMessageSquare, FiUser, FiSettings, FiLogOut } from 'react-icons/fi'
import { auth } from './firebase'
import './Navigation.css'

export default function Navigation() {
  const navigate = useNavigate()
  const [active, setActive] = useState('Home')
  const [pfp, setPfp] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('selectedPfp') || ''
    setPfp(stored || auth.currentUser?.photoURL || '')
  }, [])

  const items = [
    { icon: FiHome, label: 'Home' },
    { icon: FiMessageSquare, label: 'Chat' },
    { icon: FiSettings, label: 'Settings' },
    { icon: FiLogOut, label: 'Logout' },
  ]

  const handleClick = async (item) => {
    setActive(item.label)
    if (item.label === 'Settings') {
      navigate('/settings')
    } else if (item.label === 'Logout') {
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
        <li className="rail-li">
          <div className="rail-pfp">
            {pfp ? <img src={pfp} alt="pfp" /> : <FiUser className="rail-ico" aria-hidden="true" />}
          </div>
        </li>

        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.label} className="rail-li">
              <button
                className={`rail-btn ${active === item.label ? 'active' : ''}`}
                onClick={() => handleClick(item)}
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="rail-ico" aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
