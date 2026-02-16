import { useState } from 'react'
import { useForm } from '@mantine/form'
import { useToggle } from '@mantine/hooks'

import { auth } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import logo from './assets/logo_1.png'

// Verification link in email must point to the live site, not localhost (Vite inlines import.meta.env at build time)
const PRODUCTION_VERIFY_URL = 'https://sfu-connect.vercel.app/verify'

function getVerifyRedirectUrl() {
  const fromEnv = import.meta.env?.VITE_VERIFY_ORIGIN?.replace?.(/\/$/, '')
  if (fromEnv) return `${fromEnv}/verify`
  // In production build always use live site so the email link never points to localhost
  if (import.meta.env.PROD) return PRODUCTION_VERIFY_URL
  return typeof window !== 'undefined' ? `${window.location.origin}/verify` : PRODUCTION_VERIFY_URL
}

export function AuthenticationForm() {
  const [type, toggle] = useToggle(['login', 'register'])
  const [showResend, setShowResend] = useState(false)
  const [unverifiedUser, setUnverifiedUser] = useState(null)

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

  async function handleSubmit(e) {
    e.preventDefault()
    const values = form.values
    const validation = form.validate()
    if (validation.hasErrors) return

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
          url: getVerifyRedirectUrl(),
          handleCodeInApp: true,
        })

        alert(
          'Account created! Check your email to verify your account. If you don\'t see it, check your spam/junk folder and your SFU inbox filters.'
        )
        window.location.href = '/'
      } else {
        const userCred = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        )

        await userCred.user.reload()

        if (!userCred.user.emailVerified) {
          setUnverifiedUser(userCred.user)
          setShowResend(true)
          alert(
            'Please verify your email before logging in. Check spam/junk, or use "Resend verification email" below.'
          )
          return
        }

        setShowResend(false)
        setUnverifiedUser(null)
        window.location.href = '/app'
      }
    } catch (err) {
      setShowResend(false)
      setUnverifiedUser(null)
      alert(err.message)
    }
  }

  async function handleResendVerification() {
    if (!unverifiedUser) return
    try {
      await sendEmailVerification(unverifiedUser, {
        url: getVerifyRedirectUrl(),
        handleCodeInApp: true,
      })
      alert('Verification email sent again. Check your inbox and spam folder.')
    } catch (err) {
      alert(err.message || 'Failed to resend. Try again in a few minutes.')
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col justify-center overflow-auto px-6 py-12 lg:px-8"
      style={{
        backgroundColor: '#1a1512',
        paddingLeft: 'max(24px, env(safe-area-inset-left))',
        paddingRight: 'max(24px, env(safe-area-inset-right))',
        paddingTop: 'max(48px, env(safe-area-inset-top))',
        paddingBottom: 'max(48px, env(safe-area-inset-bottom))',
      }}
    >
      <div className="auth-box">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src={logo}
            alt="SFUconnect"
            className="mx-auto h-28 w-auto sm:h-36"
          />
          <p
            className="mt-3 text-center text-xl font-bold tracking-tight text-white sm:text-2xl"
            style={{ lineHeight: 1.25 }}
          >
            SFUconnect
          </p>
          <h2
            className="mt-8 text-center text-2xl font-bold tracking-tight text-white"
            style={{ lineHeight: 2.25 }}
          >
            {type === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm auth-form">
        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-100"
                style={{ lineHeight: 1.5 }}
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={type === 'register'}
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.values.name}
                  onChange={(e) => form.setFieldValue('name', e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm"
                  style={{
                    lineHeight: 1.5,
                    ['--tw-outline-color']: '#7a2d2d',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-100"
              style={{ lineHeight: 1.5 }}
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="yourname@sfu.ca"
                value={form.values.email}
                onChange={(e) => form.setFieldValue('email', e.target.value)}
                onBlur={() => form.validateField('email')}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm"
                style={{
                  lineHeight: 1.5,
                  ['--tw-outline-color']: '#7a2d2d',
                }}
              />
              {form.errors.email && (
                <p className="mt-1 text-sm text-red-400">{form.errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-100"
              style={{ lineHeight: 1.5 }}
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={type === 'register' ? 'new-password' : 'current-password'}
                placeholder="Your password"
                value={form.values.password}
                onChange={(e) => form.setFieldValue('password', e.target.value)}
                onBlur={() => form.validateField('password')}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm"
                style={{
                  lineHeight: 1.5,
                  ['--tw-outline-color']: '#7a2d2d',
                }}
              />
              {form.errors.password && (
                <p className="mt-1 text-sm text-red-400">{form.errors.password}</p>
              )}
            </div>
          </div>

          {type === 'register' && (
            <div className="flex items-center gap-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={form.values.terms}
                onChange={(e) => form.setFieldValue('terms', e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#7a2d2d] focus:ring-[#7a2d2d]"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I accept the terms and conditions
              </label>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a2d2d]"
              style={{
                lineHeight: 1.5,
                backgroundColor: '#7a2d2d',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#8a3d3d'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#7a2d2d'
              }}
            >
              {type === 'login' ? 'Sign in' : 'Register'}
            </button>
          </div>
        </form>

        {showResend && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-sm font-semibold text-[#b85c5c] hover:text-[#d07070] underline"
            >
              Resend verification email
            </button>
          </div>
        )}

        <p
          className="mt-10 text-center text-sm text-gray-400"
          style={{ lineHeight: 1.5 }}
        >
          {type === 'login' ? (
            <>
              Not a member?{' '}
              <button
                type="button"
                onClick={() => toggle()}
                className="font-semibold text-[#b85c5c] hover:text-[#d07070]"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => toggle()}
                className="font-semibold text-[#b85c5c] hover:text-[#d07070]"
              >
                Sign in
              </button>
            </>
          )}
        </p>
        </div>
      </div>
    </div>
  )
}
