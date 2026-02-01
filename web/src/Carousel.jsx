import { Carousel } from '@mantine/carousel'
import { Button, Group, Paper, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import classes from './CarouselCard.module.css'

function Card({ image, title, category, ownerName, onMessageClick }) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >
      <Stack justify="space-between" h="100%">
        <div>
          <Text className={classes.category} size="xs">
            {category}
          </Text>

          <Title order={3} className={classes.title}>
            {title}
          </Title>

          <Text size="sm" mt={8} style={{ color: 'rgba(255,255,255,0.85)' }}>
            Posted by {ownerName}
          </Text>
        </div>

        <Group justify="space-between" align="center">
          <Button variant="white" color="dark">
            Read article
          </Button>

          <Button variant="filled" color="blue" onClick={onMessageClick}>
            Message
          </Button>
        </Group>
      </Stack>
    </Paper>
  )
}

/**
 * TEMP demo data.
 * IMPORTANT: Each item needs:
 * - ownerUid: string (the user's auth uid)
 * - ownerName: string (display name)
 *
 * When you switch to Firestore posts, keep those fields.
 */
const data = [
  {
    image:
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=400&q=80',
    title: 'Best forests to visit in North America',
    category: 'nature',
    ownerUid: 'uid_jordan_123',
    ownerName: 'Jordan',
  },
  {
    image:
      'https://images.unsplash.com/photo-1559494007-9f5847c49d94?auto=format&fit=crop&w=400&q=80',
    title: 'Hawaii beaches review: better than you think',
    category: 'beach',
    ownerUid: 'uid_sam_456',
    ownerName: 'Sam',
  },
  {
    image:
      'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?auto=format&fit=crop&w=400&q=80',
    title: 'Mountains at night: 12 best locations to enjoy the view',
    category: 'nature',
    ownerUid: 'uid_jordan_123',
    ownerName: 'Jordan',
  },
]

export default function CardsCarousel({ onMessage }) {
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  const slides = data.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card
        {...item}
        onMessageClick={() => {
          // ✅ this is what App.jsx needs to open Chat with the right user
          onMessage?.({ uid: item.ownerUid, displayName: item.ownerName })
        }}
      />
    </Carousel.Slide>
  ))

  return (
    <Carousel
      slideSize="100%"
      slideGap="md"
      align="start"
      slidesToScroll={1}
      withIndicators
      loop
      dragFree={mobile}
      nextControlProps={{ 'aria-label': 'Next slide' }}
      previousControlProps={{ 'aria-label': 'Previous slide' }}
    >
      {slides}
    </Carousel>
  )
}
