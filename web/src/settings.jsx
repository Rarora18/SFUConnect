import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Title,
  Text,
  Button,
  Card,
  Image,
  Modal,
  TextInput,
  Stack,
  Divider,
  Box,
  Select,
  SimpleGrid,
} from '@mantine/core'
import pfp1 from './assets/pfp_1.png'
import pfp2 from './assets/pfp_2.png'
import pfp3 from './assets/pfp_3.png'
import pfp4 from './assets/pfp_4.png'

const PFPS = [pfp1, pfp2, pfp3, pfp4]
import { auth, db } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'

export default function Settings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [pfp, setPfp] = useState('')
  const [loading, setLoading] = useState(true)

  const [usernameModalOpen, setUsernameModalOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [major, setMajor] = useState('')
  const [year, setYear] = useState('')
  const [gender, setGender] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)

  useEffect(() => {
    const storedPfp = localStorage.getItem('selectedPfp') || ''
    setPfp(storedPfp)
    setMajor(localStorage.getItem('userMajor') || '')
    setYear(localStorage.getItem('userYear') || '')
    setGender(localStorage.getItem('userGender') || '')
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setUsername('')
        setLoading(false)
        return
      }
      setUser(firebaseUser)
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        setUsername(userDoc.exists() ? userDoc.data().username || '' : '')
      } catch {
        setUsername('')
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  async function handleUpdateUsername() {
    setError('')
    if (!newUsername.trim()) {
      setError('Username cannot be empty.')
      return
    }
    if (!user) return
    setSubmitting(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), { username: newUsername.trim() })
      await updateProfile(user, { displayName: newUsername.trim() })
      setUsername(newUsername.trim())
      setUsernameModalOpen(false)
      setNewUsername('')
    } catch (err) {
      setError(err.message || 'Failed to update username.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdatePassword() {
    setError('')
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }
    if (!currentPassword) {
      setError('Enter your current password.')
      return
    }
    if (!user?.email) return
    setSubmitting(true)
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      setPasswordModalOpen(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        setError('Current password is incorrect.')
      } else if (err.code === 'auth/requires-recent-login') {
        setError('Please log out and log back in, then try again.')
      } else {
        setError(err.message || 'Failed to update password.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleLogout() {
    signOut(auth).then(() => navigate('/'))
  }

  function handleSaveProfileDetails() {
    localStorage.setItem('userMajor', major.trim())
    localStorage.setItem('userYear', year)
    localStorage.setItem('userGender', gender)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 1500)
  }

  function choosePfp(selected) {
    localStorage.setItem('selectedPfp', selected)
    setPfp(selected)
  }

  if (loading) {
    return (
      <Box p="xl" className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <span className="loading loading-spinner text-error" />
        <Text c="dimmed">Loading...</Text>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box p="xl">
        <Text c="dimmed">You must be logged in to view settings.</Text>
        <Button variant="light" mt="md" onClick={() => navigate('/')}>
          Go to Login
        </Button>
      </Box>
    )
  }

  return (
    <Box p="xl" maw={480} mx="auto">
      <Button variant="subtle" size="sm" mb="md" color="#7a2d2d" onClick={() => navigate('/app')}>
        ← Back to home
      </Button>
      <Title order={2} mb="lg">
        Settings
      </Title>

      <Card withBorder radius="md" padding="lg" mb="lg">
        <Stack gap="sm" align="center" style={{ textAlign: 'center' }}>
          {pfp ? (
            <Image
              src={pfp}
              alt="Profile"
              w={56}
              h={56}
              radius="md"
              fit="cover"
            />
          ) : (
            <Box
              w={56}
              h={56}
              style={{
                borderRadius: 8,
                background: 'var(--mantine-color-gray-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}
            >
              👤
            </Box>
          )}
          <div>
            <Text fw={600}>{username || 'No username set'}</Text>
            <Text size="sm" c="dimmed">
              {user.email}
            </Text>
          </div>
          <div style={{ width: '100%', marginTop: 8 }}>
            <Text size="sm" fw={500} mb={6}>Choose profile picture</Text>
            <SimpleGrid cols={4} spacing="xs" style={{ maxWidth: 160, margin: '0 auto' }}>
              {PFPS.map((p) => (
                <Box key={p} style={{ textAlign: 'center' }}>
                  <Image
                    src={p}
                    alt=""
                    w={40}
                    h={40}
                    style={{
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: pfp === p ? '2px solid var(--mantine-color-red-6)' : '2px solid transparent',
                    }}
                    onClick={() => choosePfp(p)}
                  />
                </Box>
              ))}
            </SimpleGrid>
          </div>
        </Stack>
      </Card>

      <Card withBorder radius="md" padding="lg" mb="lg">
        <Title order={4} mb="md">
          Profile details
        </Title>
        <Stack gap="sm">
          <TextInput
            label="Major"
            placeholder="e.g. Computer Science"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          />
          <Select
            label="Year"
            placeholder="Select year"
            data={['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Alumni']}
            value={year}
            onChange={(value) => setYear(value || '')}
          />
          <Select
            label="Gender"
            placeholder="Select gender"
            data={['Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Other']}
            value={gender}
            onChange={(value) => setGender(value || '')}
          />
          <Button onClick={handleSaveProfileDetails} color="#7a2d2d">
            {profileSaved ? 'Saved!' : 'Save profile details'}
          </Button>
        </Stack>
      </Card>

      <Card withBorder radius="md" padding="lg">
        <Title order={4} mb="md">
          Account
        </Title>
        <Stack gap="sm">
          <Button
            variant="filled"
            fullWidth
            style={{ backgroundColor: '#7a2d2d', color: '#fff' }}
            onClick={() => {
              setNewUsername(username)
              setError('')
              setUsernameModalOpen(true)
            }}
          >
            Change username
          </Button>
          <Button
            variant="filled"
            fullWidth
            style={{ backgroundColor: '#7a2d2d', color: '#fff' }}
            onClick={() => {
              setError('')
              setPasswordModalOpen(true)
            }}
          >
            Change password
          </Button>
          <Divider my="xs" />
          <Button variant="subtle" color="red" fullWidth onClick={handleLogout}>
            Log out
          </Button>
        </Stack>
      </Card>

      <Modal
        opened={usernameModalOpen}
        onClose={() => {
          setUsernameModalOpen(false)
          setError('')
          setNewUsername('')
        }}
        title="Change username"
      >
        <Stack gap="sm">
          <TextInput
            label="New username"
            placeholder="Enter new username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          {error && (
            <Text size="sm" c="red">
              {error}
            </Text>
          )}
          <Button onClick={handleUpdateUsername} loading={submitting} color="#7a2d2d">
            Save
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false)
          setError('')
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        }}
        title="Change password"
      >
        <Stack gap="sm">
          <TextInput
            type="password"
            label="Current password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextInput
            type="password"
            label="New password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextInput
            type="password"
            label="Confirm new password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <Text size="sm" c="red">
              {error}
            </Text>
          )}
          <Button onClick={handleUpdatePassword} loading={submitting} color="#7a2d2d">
            Update password
          </Button>
        </Stack>
      </Modal>
    </Box>
  )
}
