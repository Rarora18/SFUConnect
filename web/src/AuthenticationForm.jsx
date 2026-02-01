import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { upperFirst, useToggle } from '@mantine/hooks'

import { auth } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'

export function AuthenticationForm(props) {
  const [type, toggle] = useToggle(['login', 'register'])

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length < 6 ? 'Password must be at least 6 characters' : null,
    },
  })

  async function handleSubmit(values) {
    try {
      if (type === 'register') {
        const domain = values.email.split('@')[1]
        if (domain !== 'sfu.ca') {
          alert('Only @sfu.ca emails are allowed.')
          return
        }

        const userCred = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        )

        await updateProfile(userCred.user, {
          displayName: values.name,
        })

        await sendEmailVerification(userCred.user, {
          url: "http://localhost:5173/verify",
          handleCodeInApp: true,
        })

        alert('Account created! Check your email to verify your account.')

        // ⭐ Redirect signup → login page
        window.location.href = '/'

      } else {
        const userCred = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        )

        await userCred.user.reload()

        if (!userCred.user.emailVerified) {
          alert("Please verify your email before logging in.")
          return
        }

        // ⭐ Redirect login → /app
        window.location.href = '/app'
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <Paper radius="md" p="lg" withBorder {...props}>
      <Text size="lg" fw={500} c="bright">
        {upperFirst(type)} to your account
      </Text>

      <Divider
        label="Continue with email"
        labelPosition="center"
        my="lg"
        styles={{ label: { color: 'var(--mantine-color-bright)', opacity: 0.85 } }}
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue('name', event.currentTarget.value)
              }
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="yourname@sfu.ca"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
            error={form.errors.email}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={form.errors.password}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue('terms', event.currentTarget.checked)
              }
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="bright"
            opacity={0.85}
            onClick={() => toggle()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>

          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  )
}
