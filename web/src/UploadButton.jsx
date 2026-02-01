import { useState } from 'react'
import { Button, Modal, Select, Textarea, Stack, Text } from '@mantine/core'
import mbcImage from './assets/MBC.jpg'
import subImage from './assets/SUB.jpg'
import wmcImage from './assets/WMC.jpg'
import recImage from './assets/Recreationsp.avif'
import libraryImage from './assets/Library.jpeg'

const locationOptions = [
  { value: 'Maggie Benston Center', label: 'Maggie Benston Center' },
  { value: 'Student Union Building (SUB)', label: 'Student Union Building (SUB)' },
  { value: 'West Mall Center', label: 'West Mall Center' },
  { value: 'Reacreational Activity', label: 'Reacreational Activity' },
  { value: 'Library', label: 'Library' },
]

const locationImages = {
  'Maggie Benston Center': mbcImage,
  'Student Union Building (SUB)': subImage,
  'West Mall Center': wmcImage,
  'Reacreational Activity': recImage,
  Library: libraryImage,
}

export default function UploadButton({ onSubmit, onClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      location,
      description,
      image: locationImages[location] ?? null,
    }

    if (onSubmit) {
      onSubmit(payload)
    } else if (onClick) {
      onClick(payload)
    } else {
      console.log('Upload submit:', payload)
    }

    setIsOpen(false)
  }

  return (
    <div style={{ margin: '12px 0', display: 'inline-block' }}>
      <Button
        variant="filled"
        size="md"
        radius="md"
        style={{ backgroundColor: '#7a4b2d', color: '#fff', minWidth: 180 }}
        onClick={() => setIsOpen(true)}
      >
        Post
      </Button>

      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create a meetup"
        centered
        radius="lg"
        zIndex={3000}
        withCloseButton
        withinPortal
        overlayProps={{ blur: 6, opacity: 0.55 }}
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <Text size="sm" c="dimmed">
              Pick a location and add a quick description.
            </Text>
            <Select
              label="Location"
              placeholder="Select a location"
              data={locationOptions}
              value={location}
              onChange={(value) => setLocation(value ?? '')}
              required
              searchable
              radius="md"
              comboboxProps={{ withinPortal: false }}
            />
            <Textarea
              label="Description"
              placeholder="What do you want to do there?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              minRows={3}
              autosize
              radius="md"
            />
            <Button
              type="submit"
              radius="md"
              style={{ backgroundColor: '#7a2d2d', color: '#fff' }}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>
    </div>
  )
}
