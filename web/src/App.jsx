import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Carousel from './Carousel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="carousel-wrapper">
      <Carousel />
    </div>
  )
}

export default App
