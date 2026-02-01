import { useEffect, useState } from 'react'
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import './App.css'
import Carousel, { defaultCarouselData } from './Carousel'
import Navigation from './Navigation'
import UploadButton from './UploadButton'
import { db } from './firebase'

function App() {
  const [posts, setPosts] = useState([])
  const [postsError, setPostsError] = useState('')
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)

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

  const handlePostSubmit = async (post) => {
    const title = post.description?.trim() || post.location
    const nextPost = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      image: post.image,
      title,
      category: post.location,
    }

    try {
      await addDoc(collection(db, 'posts'), {
        image: nextPost.image,
        title: nextPost.title,
        category: nextPost.category,
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post. Check console for details.')
      setPosts((current) => [nextPost, ...current])
    }
  }

  const carouselItems = [...posts, ...defaultCarouselData]

  return (
    <>
      <Navigation />
      <div className="page-content">
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
          <Carousel items={carouselItems} />
          <button className="btn btn-outline btn-primary carousel-cta">
            Message
          </button>
        </div>
      </div>
    </>
  )
}

export default App
