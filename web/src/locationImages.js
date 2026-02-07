// Central map of location -> image. Use these for display so carousel images
// work in production (we resolve by location instead of relying on stored URLs).
import mbcImage from './assets/MBC.jpg'
import subImage from './assets/SUB.jpg'
import wmcImage from './assets/WMC.jpg'
import recImage from './assets/Recreationsp.avif'
import libraryImage from './assets/Library.jpeg'

export const locationImages = {
  'Maggie Benston Center': mbcImage,
  'Student Union Building (SUB)': subImage,
  'West Mall Center': wmcImage,
  'Reacreational Activity': recImage,
  Library: libraryImage,
}

export function getImageForLocation(location) {
  return locationImages[location] ?? null
}
