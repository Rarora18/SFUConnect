import { Badge, Button, Card, Group, Image, SimpleGrid, Text } from '@mantine/core'
import { auth } from './firebase'
import badgeCardClasses from './BadgeCard.module.css'
import classes from './CarouselCard.module.css'

const categoryLabels = {
  'Maggie Benston Center': 'Maggie Benston Center',
  'Student Union Building (SUB)': 'Student Union Building',
  'West Mall Center': 'West Mall Center',
  'Reacreational Activity': 'Recreation',
  Library: 'Library',
}

function PostCard({ image, title, category, ownerName, ownerMeta, onMessageClick, isOwnPost }) {
  const locationLabel = categoryLabels[category] ?? category
  const metaLine = ownerMeta && (ownerMeta.major || ownerMeta.year || ownerMeta.gender)
    ? [ownerMeta.major, ownerMeta.year, ownerMeta.gender].filter(Boolean).join(' • ')
    : null

  const features = [
    ...(ownerName ? [{ emoji: '👤', label: `Posted by ${ownerName}` }] : []),
    ...(metaLine ? [{ emoji: '🎓', label: metaLine }] : []),
  ]

  const cardClassName = `${badgeCardClasses.card} ${classes.card}${isOwnPost ? ` ${badgeCardClasses.cardOwn}` : ''}`

  return (
    <Card withBorder radius="md" p="sm" className={cardClassName}>
      <Card.Section>
        <div className={badgeCardClasses.imageWrapper}>
          <Image
            src={image || undefined}
            alt={title}
            fallbackSrc="https://placehold.co/600x180/1f2937/9ca3af?text=No+image"
            className={badgeCardClasses.image}
            style={image ? {} : { background: 'linear-gradient(135deg, #1f2937, #111827)' }}
          />
        </div>
      </Card.Section>

      <Card.Section className={`${badgeCardClasses.section} ${badgeCardClasses.cardBody}`} mt="xs">
        <Group justify="center" mb="xs">
          <Badge size="sm" variant="light" color="red" className="card-badge">
            {locationLabel}
          </Badge>
        </Group>
        <Text fz="sm" className={badgeCardClasses.description} lineClamp={3}>
          {title}
        </Text>
      </Card.Section>

      <Card.Section className={`${badgeCardClasses.section} ${badgeCardClasses.cardFooter}`}>
        <div className={badgeCardClasses.meetupDetailsBlock}>
          <Group gap={7} mt={5}>
            {features.map((badge) => (
              <Badge key={badge.label} variant="light" color="red" leftSection={badge.emoji} className="card-badge">
                {badge.label}
              </Badge>
            ))}
          </Group>
        </div>
        <Group mt="sm" className={badgeCardClasses.messageRow}>
        {onMessageClick ? (
          <Button
            radius="md"
            className="card-message-btn"
            style={{ flex: 1, backgroundColor: '#7a2d2d' }}
            onClick={onMessageClick}
          >
            Message
          </Button>
        ) : null}
        </Group>
      </Card.Section>
    </Card>
  )
}

export default function CardsCarousel({ items, onMessage }) {
  const currentUid = auth.currentUser?.uid

  const postItems =
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

  const buildCardProps = (item, index) => {
    const ownerUid =
      item.owner?.uid ??
      (typeof item.owner === 'string' ? item.owner : null) ??
      item.userId ??
      item.ownerId ??
      null
    const ownerName =
      item.owner?.displayName ??
      item.owner?.name ??
      item.displayName ??
      'User'
    const ownerPhoto = item.owner?.photoURL ?? item.owner?.photo ?? ''
    const canMessage =
      typeof onMessage === 'function' &&
      ownerUid &&
      ownerUid !== currentUid
    const isOwnPost = !!ownerUid && ownerUid === currentUid
    return {
      ...item,
      ownerName,
      ownerMeta: item.owner,
      isOwnPost,
      onMessageClick: canMessage
        ? () =>
            onMessage({
              uid: ownerUid,
              displayName: ownerName,
              photoURL: ownerPhoto,
            })
        : undefined,
    }
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl" className={classes.grid}>
      {postItems.map((item, index) => (
        <PostCard key={item.id ?? `post-${index}`} {...buildCardProps(item, index)} />
      ))}
    </SimpleGrid>
  )
}
