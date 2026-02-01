import { useEffect, useMemo, useState } from 'react'
import { auth, db } from './firebase'
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore'
import './chat.css'

function Initials({ name }) {
  const initials = (name || 'User')
    .split(' ')
    .slice(0, 2)
    .map((p) => (p[0] || '').toUpperCase())
    .join('')
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        fontWeight: 800,
        background: 'rgba(0,0,0,0.08)',
      }}
    >
      {initials}
    </div>
  )
}

function Avatar({ name, photo }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        style={{ width: 42, height: 42, borderRadius: 999, objectFit: 'cover' }}
      />
    )
  }
  return <Initials name={name} />
}

export default function Inbox({ onBack, onOpenChat, pendingUser }) {
  const me = auth.currentUser
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    if (!me?.uid) return

    const q = query(
      collection(db, 'rooms'),
      where('participants', 'array-contains', me.uid),
      orderBy('updatedAt', 'desc'),
      limit(5) // ✅ always fetch 5 max
    )

    const unsub = onSnapshot(q, (snap) => {
      setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })

    return () => unsub()
  }, [me?.uid])

  // Convert room docs into "chat list items"
  const chatItems = useMemo(() => {
    if (!me?.uid) return []

    const items = rooms
      .map((r) => {
        const otherUid = r.participants?.find((u) => u !== me.uid)
        const otherName = r.participantNames?.[otherUid] || 'User'
        const otherPhoto = r.participantPhotos?.[otherUid] || ''

        return {
          uid: otherUid,
          displayName: otherName,
          photoURL: otherPhoto,
          lastMessage: r.lastMessage || 'No messages yet',
        }
      })
      .filter((x) => !!x.uid)

    // If user clicked "Message" on a post, ensure that person appears in list
    if (pendingUser?.uid) {
      const already = items.some((x) => x.uid === pendingUser.uid)
      if (!already) {
        // put pending user at top, keep max 5 by dropping the last item
        const pendingItem = {
          uid: pendingUser.uid,
          displayName: pendingUser.displayName || pendingUser.name || 'User',
          photoURL: pendingUser.photoURL || '',
          lastMessage: 'Tap to start chatting',
          pending: true,
        }
        return [pendingItem, ...items].slice(0, 5)
      }
    }

    // otherwise normal list (max 5 already)
    return items.slice(0, 5)
  }, [rooms, me?.uid, pendingUser])

  return (
    <div className="cp-page">
      <div className="cp-shell">
        <header className="cp-topbar">
          <button className="cp-menu" type="button" onClick={onBack} aria-label="Back">
            ☰
          </button>

          <div className="cp-top-center">
            <div className="cp-title">Meet on the Mountain</div>
            <div className="cp-sub">Pick a friend! (max 5)</div>
          </div>

          <div className="cp-top-right" />
        </header>

        <main className="cp-body">
          {!me && <div style={{ padding: 12, opacity: 0.7 }}>Sign in to see messages.</div>}

          {me && chatItems.length === 0 && (
            <div style={{ padding: 12, opacity: 0.7 }}>No chats yet.</div>
          )}

          {chatItems.map((c) => (
            <button
              key={c.uid}
              onClick={() => onOpenChat({ uid: c.uid, displayName: c.displayName, photoURL: c.photoURL })}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: 14,
                border: c.pending ? '2px solid rgba(0,0,0,0.18)' : '1px solid rgba(0,0,0,0.08)',
                background: 'white',
                cursor: 'pointer',
                marginBottom: 10,
                textAlign: 'left',
              }}
              title={`Open chat with ${c.displayName}`}
            >
              <Avatar name={c.displayName} photo={c.photoURL} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800 }}>{c.displayName}</div>
                <div
                  style={{
                    opacity: 0.7,
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {c.lastMessage}
                </div>
              </div>

              <div style={{ opacity: 0.6, fontSize: 18 }}>›</div>
            </button>
          ))}
        </main>
      </div>
    </div>
  )
}
