import React, { useRef, useEffect } from 'react'
import { Title, Text } from '@mantine/core'
import logo from './assets/logo_1.png'

export default function AppHeader() {
  const renderCount = useRef(0)
  renderCount.current += 1

  useEffect(() => {
    // Logs to the browser console — open devtools to see how often this component renders
    console.log('AppHeader render count:', renderCount.current)
  })

  return (
    <header className="top-nav">
      <div className="top-nav__content">
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
    </header>
  )
}
