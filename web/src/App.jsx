import { useState } from 'react'
import './App.css'
import Carousel from './Carousel'
import Navigation from './Navigation'
import UploadButton from './UploadButton'
import VerifyEmail from './Verifyemail'
import Chat from './chat'

function App() {
  const [page, setPage] = useState('home')
  const [otherUser, setOtherUser] = useState(null)

  // Chat page
  if (page === 'chat' && otherUser) {
    return <Chat onBack={() => setPage('home')} otherUser={otherUser} />
  }

  // Home page
  return (
    <>
      <Navigation />

      <div className="page-content">
        <div className="carousel-wrapper">
          <UploadButton onSubmit={(post) => console.log('Posted:', post)} />

          {/* ✅ Carousel must call onMessage with the post owner */}
          <Carousel
            onMessage={(owner) => {
              // owner should be: { uid, displayName }
              setOtherUser(owner)
              setPage('chat')
            }}
          />
        </div>
      </div>
    </>
  )
}

export default App
