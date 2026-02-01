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
  console.log("DEBUG otherUser:", otherUser)
  console.log("DEBUG themUid:", otherUser?.uid)
  console.log("DEBUG themName:", otherUser?.displayName)
  console.log("DEBUG myUid:", auth.currentUser?.uid)

  const user = auth.currentUser

  // ⭐ Only accept valid UID + displayName
  const myUid = user?.uid ?? null
  const myName = user?.displayName ?? 'You'

  const themUid = otherUser?.uid ?? null
  const themName = otherUser?.displayName ?? 'Unknown User'

  // ⭐ Stable deterministic room ID
  const ROOM_ID = useMemo(() => {
    if (!myUid || !themUid) return null
    if (myUid === themUid) return null // prevent self-chat
    return [myUid, themUid].sort().join('_')
  }, [myUid, themUid])
    console.log("DEBUG ROOM_ID:", ROOM_ID)

  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)

  // ⭐ Ensure room exists
  useEffect(() => {
    if (!ROOM_ID) return

    setDoc(
      doc(db, 'rooms', ROOM_ID),
      {
        participants: [myUid, themUid],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  }, [ROOM_ID, myUid, themUid])

  // ⭐ Real-time listener
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

  // ⭐ Send message
  async function send(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !myUid || !ROOM_ID) return

    try {
      const msgsRef = collection(db, 'rooms', ROOM_ID, 'messages')

      await addDoc(msgsRef, {
        text,
        senderId: myUid,
        senderName: myName,
        createdAt: serverTimestamp(),
      })

      // Update room metadata
      await setDoc(
        doc(db, 'rooms', ROOM_ID),
        {
          lastMessage: text,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      setDraft('')
    } catch (err) {
      console.error('Send failed:', err)
      alert(err.message)
    }
  }

  // ⭐ Not logged in
  if (!myUid) {
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

  // ⭐ No recipient
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
            </header>

            <main className="cp-body">
              <div style={{ padding: 12, color: 'rgba(0,0,0,0.6)' }}>
                This chat needs a valid <b>otherUser.uid</b>.
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
          </header>

          <main className="cp-body">
            {messages.map((m) => {
              const fromMe = m.senderId === myUid
              const senderName = m.senderName || 'User'

              return (
                <div key={m.id} className={`cp-row ${fromMe ? 'me' : 'them'}`}>
                  {!fromMe && (
                    <div className="cp-leftIcon" title={senderName}>
                      <Initials name={senderName} />
                    </div>
                  )}

                  <div className={`cp-bubble ${fromMe ? 'me' : 'them'}`}>
                    <div className="cp-text">{m.text}</div>

                    <div className={`cp-meta ${fromMe ? 'me' : 'them'}`}>
                      <span className="cp-clock">🕒</span>
                      <span>
                        {m.createdAt?.toDate
                          ? m.createdAt.toDate().toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>
                  </div>

                  {fromMe && (
                    <div className="cp-rightAvatar" title={myName}>
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

            <button className="cp-attach" type="button" aria-label="Attach">
              📎
            </button>

            <button className="cp-send" type="submit" disabled={!draft.trim()}>
              ➤
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
