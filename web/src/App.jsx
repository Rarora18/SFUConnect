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
import { db, auth } from './firebase'

function App() {
  const [page, setPage] = useState('home')
  const [otherUser, setOtherUser] = useState(null)
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
      alert("You must be logged in to post.")
      return
    }
    console.log("DISPLAY NAME:", auth.currentUser.displayName);

    // ⭐ IMPORTANT: refresh user so displayName is NOT null
    await user.reload()

    const title = post.description?.trim() || post.location

    try {
      await addDoc(collection(db, "posts"), {
        image: post.image,
        title,
        category: post.location,
        createdAt: serverTimestamp(),
        owner: {
          uid: user.uid,
          displayName: user.displayName || "Anonymous",
        },
      })
    } catch (error) {
      console.error("Failed to save post:", error)
      alert("Failed to save post. Check console for details.")
    }
  }

  const carouselItems = posts

  // Chat page
  if (page === 'chat' && otherUser) {
    return <Chat onBack={() => setPage('home')} otherUser={otherUser} />
  }

  return (
    <>
      <Navigation />

      <div className="page-content">
        <div className="carousel-wrapper">
          <AppHeader />
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
