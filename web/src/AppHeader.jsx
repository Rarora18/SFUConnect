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
    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <img src={logo} alt="SFU Connect logo" style={{ width: 200, height: 200, borderRadius: 8 }} />
      <div style={{ textAlign: 'left' }}>
        <Title order={2} c="#AA4A44" style={{ margin: 0, fontSize: 60, lineHeight: 1}}>{'SFU Connect'}</Title>
        <Text size="xs" color="dimmed" style={{ marginTop: 4}}>Create and share meetups on campus</Text>
      </div>
    </div>
  )
}
