import { ActionIcon, Badge, Button, Card, Group, Image, SimpleGrid, Text } from '@mantine/core'
import { FiHeart } from 'react-icons/fi'
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

function PostCard({ image, title, category, ownerName, ownerMeta, onMessageClick }) {
  const locationLabel = categoryLabels[category] ?? category
  const metaLine = ownerMeta && (ownerMeta.major || ownerMeta.year || ownerMeta.gender)
    ? [ownerMeta.major, ownerMeta.year, ownerMeta.gender].filter(Boolean).join(' • ')
    : null

  const features = [
    { emoji: '📍', label: locationLabel },
    ...(ownerName ? [{ emoji: '👤', label: `Posted by ${ownerName}` }] : []),
    ...(metaLine ? [{ emoji: '🎓', label: metaLine }] : []),
  ]

  return (
    <Card withBorder radius="md" p="md" className={`${badgeCardClasses.card} ${classes.card}`}>
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

      <Card.Section className={`${badgeCardClasses.section} ${badgeCardClasses.cardBody}`} mt="md">
        <Group justify="center" mb="xs">
          <Badge size="sm" variant="light" color="red">
            {locationLabel}
          </Badge>
        </Group>
        <Text fz="sm" className={badgeCardClasses.description} lineClamp={4}>
          {title}
        </Text>
      </Card.Section>

      <Card.Section className={`${badgeCardClasses.section} ${badgeCardClasses.cardFooter}`}>
        <div className={badgeCardClasses.meetupDetailsBlock}>
          <Text mt="md" className={badgeCardClasses.label} c="dimmed">
            Meetup details
          </Text>
          <Group gap={7} mt={5}>
            {features.map((badge) => (
              <Badge key={badge.label} variant="light" color="red" leftSection={badge.emoji}>
                {badge.label}
              </Badge>
            ))}
          </Group>
        </div>
        <Group mt="md">
        {onMessageClick ? (
          <Button
            radius="md"
            style={{ flex: 1, backgroundColor: '#7a2d2d' }}
            onClick={onMessageClick}
          >
            Message
          </Button>
        ) : (
          <Button radius="md" variant="light" color="gray" style={{ flex: 1 }} disabled>
            Your post
          </Button>
        )}
        <ActionIcon variant="default" radius="md" size={36} aria-label="Like">
          <FiHeart className={badgeCardClasses.like} stroke={1.5} size={18} />
        </ActionIcon>
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
    return {
      ...item,
      ownerName,
      ownerMeta: item.owner,
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
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" className={classes.grid}>
      {postItems.map((item, index) => (
        <PostCard key={item.id ?? `post-${index}`} {...buildCardProps(item, index)} />
      ))}
    </SimpleGrid>
  )
}
