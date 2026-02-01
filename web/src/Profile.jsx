import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, SimpleGrid, Image, Button } from '@mantine/core';
import pfp1 from './assets/pfp_1.png';
import pfp2 from './assets/pfp_2.png';
import pfp3 from './assets/pfp_3.png';
import pfp4 from './assets/pfp_4.png';

const PFPS = [pfp1, pfp2, pfp3, pfp4];

export default function Profile() {
  const [selected, setSelected] = useState(() => localStorage.getItem('selectedPfp') || '');
  const navigate = useNavigate();

  useEffect(() => {
    // sync selected state with localStorage
    const stored = localStorage.getItem('selectedPfp') || '';
    setSelected(stored);
  }, []);

  function choose(pfp) {
    localStorage.setItem('selectedPfp', pfp);
    setSelected(pfp);
  }

  function done() {
    navigate('/');
  }

  return (
    <div style={{ padding: 24 }}>
      <Title order={2}>Choose profile picture</Title>
      <SimpleGrid cols={4} spacing="md" style={{ marginTop: 18 }}>
        {PFPS.map((p) => (
          <div key={p} style={{ textAlign: 'center' }}>
            <Image
              src={p}
              alt="pfp"
              width={40}
              height={40}
              style={{ borderRadius: 12, cursor: 'pointer', border: selected === p ? '3px solid red' : '3px solid transparent' }}
              onClick={() => choose(p)}
            />
          </div>
        ))}
      </SimpleGrid>

      <div style={{ marginTop: 18 }}>
        <Button onClick={done} variant="outline">Done</Button>
      </div>
    </div>
  );
}
