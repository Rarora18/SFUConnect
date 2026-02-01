import { useState } from 'react'
import './App.css'
import Carousel, { defaultCarouselData } from './Carousel'
import Navigation from './Navigation'
import UploadButton from './UploadButton'

function App() {
  const [posts, setPosts] = useState([])

  const handlePostSubmit = (post) => {
    const title = post.description?.trim() || post.location
    const nextPost = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      image: post.image,
      title,
      category: post.location,
    }

    setPosts((current) => [nextPost, ...current])
  }

  const carouselItems = [...posts, ...defaultCarouselData]

  return (
    <>
      <Navigation />
      <div className="page-content">
        <div className="carousel-wrapper">
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
