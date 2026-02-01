import { Carousel } from '@mantine/carousel'
import { Button, Paper, Text, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { auth } from './firebase'
import classes from './CarouselCard.module.css'

const categoryLabels = {
  'Maggie Benston Center': 'Maggie Benston Center',
  'Student Union Building (SUB)': 'Student Union Building',
  'West Mall Center': 'West Mall Center',
  'Reacreational Activity': 'Recreation',
  Library: 'Library',
}

// ⭐ Your Card component MUST be here
function Card({ image, title, category, ownerName, ownerMeta, onMessageClick }) {
  const cardStyle = image
    ? { backgroundImage: `url(${image})` }
    : { background: 'linear-gradient(135deg, #1f2937, #111827)' }

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={cardStyle}
      className={classes.card}
    >
      <div className={classes.cardContent}>
        <Text className={classes.category} size="xs">
          {categoryLabels[category] ?? category}
        </Text>

        <Title order={3} className={classes.title}>
          {title}
        </Title>

        {ownerName && (
          <Text size="sm" mt={8} style={{ color: 'rgba(255,255,255,0.85)' }}>
            Posted by {ownerName}
          </Text>
        )}
        {ownerMeta && (ownerMeta.major || ownerMeta.year || ownerMeta.gender) && (
          <Text size="xs" mt={6} style={{ color: 'rgba(255,255,255,0.75)' }}>
            {[ownerMeta.major, ownerMeta.year, ownerMeta.gender]
              .filter(Boolean)
              .join(' • ')}
          </Text>
        )}
      </div>

      {onMessageClick && (
        <Button variant="filled" color="#7a2d2d" onClick={onMessageClick}>
          Message
        </Button>
      )}
    </Paper>
  )
}

export default function CardsCarousel({ items, onMessage }) {
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  const currentUid = auth.currentUser?.uid

  const carouselItems =
    items && items.length > 0
      ? items
      : [
          {
            id: 'placeholder',
            image: '',
            title: 'No posts yet',
            category: 'Be the first to post!',
          },
        ]

  const slides = carouselItems.map((item, index) => {
    const ownerUid = item.owner?.uid
    const ownerName = item.owner?.displayName

    const canMessage =
      typeof onMessage === 'function' &&
      ownerUid &&
      ownerUid !== currentUid

    return (
      <Carousel.Slide key={item.id ?? `${item.title}-${index}`}>
        <Card
          {...item}
          ownerName={ownerName}
          ownerMeta={item.owner}
          onMessageClick={
            canMessage
              ? () => onMessage({ uid: ownerUid, displayName: ownerName })
              : undefined
          }
        />
      </Carousel.Slide>
    )
  })

  return (
    <Carousel
      slideSize="100%"
      slideGap={2}
      emblaOptions={{ align: 'start', slidesToScroll: 1 }}
      nextControlProps={{ 'aria-label': 'Next slide' }}
      previousControlProps={{ 'aria-label': 'Previous slide' }}
    >
      {slides}
    </Carousel>
  )
}
