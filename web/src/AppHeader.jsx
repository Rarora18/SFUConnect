import React from 'react'
import { Title, Text } from '@mantine/core'
import logo from './assets/logo_1.png'
import UploadButton from './UploadButton'

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="currentColor" className="top-nav__search-icon" aria-hidden>
    <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
  </svg>
)

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export default function AppHeader({ searchQuery = '', onSearchChange, onPostSubmit, theme = 'light', onThemeToggle }) {
  return (
    <header className="top-nav">
      <div className="top-nav__content">
        <div className="top-nav__brand">
          <img className="top-nav__logo" src={logo} alt="SFU Connect logo" />
          <div className="top-nav__text">
            <Title order={2} c="white" className="top-nav__title">
              SFU Connect
            </Title>
            <Text size="xs" c="white" className="top-nav__subtitle">
              Create and share meetups on campus
            </Text>
          </div>
        </div>

        <div className="top-nav__search-wrap">
          <div className="top-nav__search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search meetups"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="top-nav__search-input"
              aria-label="Search meetups"
            />
          </div>
        </div>

        <div className="top-nav__actions">
          {onThemeToggle && (
            <button
              type="button"
              onClick={onThemeToggle}
              className="top-nav__theme-btn"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          )}
          {onPostSubmit && (
            <UploadButton onSubmit={onPostSubmit} />
          )}
        </div>
      </div>
    </header>
  )
}