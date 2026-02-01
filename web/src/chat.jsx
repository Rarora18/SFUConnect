import React, { useEffect, useMemo, useRef, useState } from 'react'
import './chat.css'

import Navigation from './Navigation'
import { auth, db } from './firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
} from 'firebase/firestore'

function Initials({ name }) {
  const initials = (name || 'User')
    .split(' ')
    .slice(0, 2)
    .map((p) => (p[0] || '').toUpperCase())
    .join('')
  return <div className="cp-avatar">{initials}</div>
}

export default function Chat({ onBack, otherUser }) {
  const user = auth.currentUser
  const myName = user?.displayName || 'You'

  const themName = otherUser?.displayName || otherUser?.name || 'Jordan'
  const themUid = otherUser?.uid || otherUser?.id || null

  // ✅ stable deterministic room id (same on both accounts)
  const ROOM_ID = useMemo(() => {
    if (!user?.uid || !themUid) return null
    return [user.uid, themUid].sort().join('_')
  }, [user?.uid, themUid])

  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)

  // ✅ (optional but recommended) ensure room doc exists
  useEffect(() => {
    if (!ROOM_ID || !user?.uid || !themUid) return

    setDoc(
      doc(db, 'rooms', ROOM_ID),
      {
        participants: [user.uid, themUid],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  }, [ROOM_ID, user?.uid, themUid])

  // ✅ Real-time listener updates when ROOM_ID changes
  useEffect(() => {
    if (!ROOM_ID) return

    const msgsRef = collection(db, 'rooms', ROOM_ID, 'messages')
    const q = query(msgsRef, orderBy('createdAt', 'asc'))

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setMessages(list)
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    })

    return () => unsub()
  }, [ROOM_ID])

  async function send(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !user || !ROOM_ID) return

    try {
      const msgsRef = collection(db, 'rooms', ROOM_ID, 'messages')
      await addDoc(msgsRef, {
        text,
        senderId: user.uid,
        senderName: myName,
        createdAt: serverTimestamp(),
      })
      setDraft('')
    } catch (err) {
      console.error('Send failed:', err)
      alert(err.message)
    }
  }

  // If room can't be formed yet, show a helpful state
  if (!user) {
    return (
      <>
        <Navigation />
        <div className="cp-page">
          <div className="cp-shell">
            <header className="cp-topbar">
              <button className="cp-menu" type="button" onClick={onBack}>
                ☰
              </button>
              <div className="cp-top-center">
                <div className="cp-title">Chat</div>
                <div className="cp-sub">Sign in to message</div>
              </div>
              <div className="cp-top-right" />
            </header>

            <main className="cp-body">
              <div style={{ padding: 12, color: 'rgba(0,0,0,0.6)' }}>
                You need to be logged in to send messages.
              </div>
            </main>
          </div>
        </div>
      </>
    )
  }

  if (!themUid) {
    return (
      <>
        <Navigation />
        <div className="cp-page">
          <div className="cp-shell">
            <header className="cp-topbar">
              <button className="cp-menu" type="button" onClick={onBack}>
                ☰
              </button>
              <div className="cp-top-center">
                <div className="cp-title">Chat</div>
                <div className="cp-sub">No recipient selected</div>
              </div>
              <div className="cp-top-right" />
            </header>

            <main className="cp-body">
              <div style={{ padding: 12, color: 'rgba(0,0,0,0.6)' }}>
                This chat needs an <b>otherUser.uid</b> passed in (the post owner).
              </div>
            </main>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />

      <div className="cp-page">
        <div className="cp-shell">
          <header className="cp-topbar">
            <button className="cp-menu" type="button" onClick={onBack} aria-label="Back">
              ☰
            </button>

            <div className="cp-top-center">
              <div className="cp-title">{themName}</div>
              <div className="cp-sub">{messages.length} messages</div>
            </div>

            <div className="cp-top-right" />
          </header>

          <main className="cp-body">
            {messages.map((m) => {
              const fromMe = m.senderId === user.uid
              const otherName = m.senderName || 'User'

              return (
                <div key={m.id} className={`cp-row ${fromMe ? 'me' : 'them'}`}>
                  {!fromMe && (
                    <div className="cp-leftIcon" title={otherName} aria-label={otherName}>
                      <Initials name={otherName} />
                    </div>
                  )}

                  <div className={`cp-bubble ${fromMe ? 'me' : 'them'}`}>
                    <div className="cp-text">{m.text}</div>

                    <div className={`cp-meta ${fromMe ? 'me' : 'them'}`}>
                      <span className="cp-clock">🕒</span>
                      <span>
                        {m.createdAt?.toDate
                          ? m.createdAt.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                          : ''}
                      </span>
                    </div>
                  </div>

                  {fromMe && (
                    <div className="cp-rightAvatar" title={myName} aria-label={myName}>
                      <Initials name={myName} />
                    </div>
                  )}
                </div>
              )
            })}

            <div ref={endRef} />
          </main>

          <form className="cp-compose" onSubmit={send}>
            <input
              className="cp-input"
              placeholder={`Message ${themName}...`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />

            <button className="cp-attach" type="button" aria-label="Attach" title="Attach">
              📎
            </button>

            <button className="cp-send" type="submit" aria-label="Send" title="Send" disabled={!draft.trim()}>
              ➤
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
