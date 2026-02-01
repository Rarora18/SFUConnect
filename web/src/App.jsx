import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import './App.css'
import Carousel from './Carousel'
import Navigation from './Navigation'
import AppHeader from './AppHeader'
import UploadButton from './UploadButton'
import Chat from './chat'
import Inbox from './inbox' // ✅ ADD
import { db, auth } from './firebase'
import gymImage from './assets/decorations/gym.jpeg'
import mackenzieImage from './assets/decorations/mackenzie.jpg'
import sryeImage from './assets/decorations/srye.jpg'
import starbucksImage from './assets/decorations/starbucks.jpg'
import subintImage from './assets/decorations/subint.jpg'
import timsImage from './assets/decorations/tims.webp'

function App() {
  const [page, setPage] = useState('home')
  const [otherUser, setOtherUser] = useState(null)

  const [pendingUser, setPendingUser] = useState(null) // ✅ ADD (who you clicked "Message" on)

  const [posts, setPosts] = useState([])
  const [postsError, setPostsError] = useState('')
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)

  // Load posts
  useEffect(() => {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(25)
    )

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const nextPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPosts(nextPosts)
        setPostsError('')
        setIsLoadingPosts(false)
      },
      (error) => {
        console.error('Failed to load posts:', error)
        setPostsError(error?.code || 'unknown')
        setIsLoadingPosts(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Handle new post submission
  const handlePostSubmit = async (post) => {
    const user = auth.currentUser
    if (!user) {
      alert('You must be logged in to post.')
      return
    }
    console.log('DISPLAY NAME:', auth.currentUser.displayName)

    // ⭐ IMPORTANT: refresh user so displayName is NOT null
    await user.reload()

    const title = post.description?.trim() || post.location
    const profileMeta = {
      major: localStorage.getItem('userMajor') || '',
      year: localStorage.getItem('userYear') || '',
      gender: localStorage.getItem('userGender') || '',
    }

    try {
      await addDoc(collection(db, 'posts'), {
        image: post.image,
        title,
        category: post.location,
        createdAt: serverTimestamp(),
        owner: {
          uid: user.uid,
          displayName: user.displayName || 'Anonymous',
          photoURL: user.photoURL || '', // ✅ OPTIONAL (helps inbox show avatars)
          ...profileMeta,
        },
      })
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post. Check console for details.')
    }
  }

  const carouselItems = posts

  // ✅ Inbox page (choose which chat to open)
  if (page === 'inbox') {
    return (
      <>
        <Navigation />
        <Inbox
          onBack={() => {
            setPendingUser(null)
            setPage('home')
          }}
          onOpenChat={(u) => {
            setOtherUser(u)
            setPendingUser(null)
            setPage('chat')
          }}
          pendingUser={pendingUser}
        />
      </>
    )
  }

  // Chat page
  if (page === 'chat' && otherUser) {
    return (
      <>
        <Navigation />
        <Chat onBack={() => setPage('inbox')} otherUser={otherUser} />
      </>
    )
  }

  return (
    <>
      <Navigation />

      <div className="page-content">
        <AppHeader />
        <div className="board">
          <aside className="board-notes board-notes--left" aria-label="Pinned photos left">
            <div className="photo-note photo-note--tilt">
              <div className="photo-note__pin" />
              <img src={mackenzieImage} alt="Mackenzie Cafe" />
            </div>
            <div className="photo-note photo-note--tilt3">
              <div className="photo-note__pin" />
              <img src={gymImage} alt="Campus gym" />
            </div>
            <div className="photo-note photo-note--tilt2">
              <div className="photo-note__pin" />
              <img src={timsImage} alt="Tim Hortons" />
            </div>
          </aside>
          <div className="board-main">
            <div className="carousel-wrapper">
              {postsError && (
                <p style={{ marginBottom: '12px', color: '#e03131' }}>
                  Failed to load posts (error: {postsError}).
                </p>
              )}

              {isLoadingPosts && (
                <p style={{ marginBottom: '12px', color: '#868e96' }}>
                  Loading posts...
                </p>
              )}

              <UploadButton onSubmit={handlePostSubmit} />

              <Carousel
                items={carouselItems}
                onMessage={(owner) => {
                  // ✅ CHANGE: go to inbox list first, not straight into chat
                  // owner is expected like: { uid, displayName, photoURL? }
                  setPendingUser({
                    uid: owner?.uid,
                    displayName: owner?.displayName || owner?.name || 'User',
                    photoURL: owner?.photoURL || '',
                  })
                  setPage('inbox')
                }}
              />
            </div>
          </div>
          <aside className="board-notes board-notes--right" aria-label="Pinned photos right">
            <div className="photo-note photo-note--tilt2">
              <div className="photo-note__pin" />
              <img src={subintImage} alt="SUB interior" />
            </div>
            <div className="photo-note photo-note--tilt4">
              <div className="photo-note__pin" />
              <img src={starbucksImage} alt="Starbucks" />
            </div>
            <div className="photo-note photo-note--tilt5">
              <div className="photo-note__pin" />
              <img src={sryeImage} alt="Srye building" />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

export default App

