import './App.css'
import Carousel from './Carousel'
import Navigation from './Navigation'
import AppHeader from './AppHeader'
import UploadButton from './UploadButton'
import VerifyEmail from "./Verifyemail";

function App() {
  return (
    <>
      <Navigation />
      <div className="page-content">
        <div className="carousel-wrapper">
          <AppHeader />
          <UploadButton onSubmit={(post) => console.log('Posted:', post)} />
          <Carousel />
          <button className="btn btn-outline btn-primary carousel-cta">
            Message
          </button>
        </div>
      </div>
    </>
  )
}

export default App
