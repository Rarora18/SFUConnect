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
import { getImageForLocation } from './locationImages'

function App() {
  const [page, setPage] = useState('home')
  const [otherUser, setOtherUser] = useState(null)

  const [pendingUser, setPendingUser] = useState(null) // ✅ ADD (who you clicked "Message" on)

  const [posts, setPosts] = useState([])
  const [postsError, setPostsError] = useState('')
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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
          photoURL: user.photoURL || '',
          ...profileMeta,
        },
      })
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post. Check console for details.')
    }
  }

  // Resolve images from location so they work in production (stored URLs can be dev-only paths)
  const carouselItems = posts
    .map((post) => ({
      ...post,
      image: getImageForLocation(post.category ?? post.location) ?? post.image,
    }))
    .filter((post) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.trim().toLowerCase()
      const title = (post.title ?? '').toLowerCase()
      const category = (post.category ?? post.location ?? '').toLowerCase()
      const ownerName = (post.owner?.displayName ?? post.owner?.name ?? '').toLowerCase()
      return title.includes(q) || category.includes(q) || ownerName.includes(q)
    })

  const handleNav = (next) => {
    if (next === 'home') {
      setOtherUser(null)
      setPendingUser(null)
      setPage('home')
    }
    if (next === 'inbox') {
      setOtherUser(null)
      setPage('inbox')
    }
  }

  // ✅ Inbox page (choose which chat to open)
  if (page === 'inbox') {
    return (
      <>
        <Navigation onNavigate={handleNav} />
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
        <Navigation onNavigate={handleNav} />
        <Chat onBack={() => setPage('inbox')} otherUser={otherUser} />
      </>
    )
  }

  return (
    <>
      <Navigation onNavigate={handleNav} />

      <div className="page-content">
        <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} onPostSubmit={handlePostSubmit} />
        <div className="board">
          <div className="board-main">
            <div className="carousel-wrapper">
              {postsError && (
                <p style={{ marginBottom: '12px', color: '#e03131' }}>
                  Failed to load posts (error: {postsError}).
                </p>
              )}

              {isLoadingPosts && (
                <div className="flex items-center justify-center gap-3 py-8" style={{ marginBottom: '12px' }}>
                  <span className="loading loading-spinner text-error" />
                  <span style={{ color: '#868e96' }}>Loading posts...</span>
                </div>
              )}

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
        </div>
      </div>
    </>
  )
}

export default App

