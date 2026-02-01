import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, SimpleGrid, Image, Button, TextInput, Select, Stack } from '@mantine/core';
import pfp1 from './assets/pfp_1.png';
import pfp2 from './assets/pfp_2.png';
import pfp3 from './assets/pfp_3.png';
import pfp4 from './assets/pfp_4.png';

const PFPS = [pfp1, pfp2, pfp3, pfp4];

export default function Profile() {
  const [selected, setSelected] = useState(() => localStorage.getItem('selectedPfp') || '');
  const [major, setMajor] = useState(() => localStorage.getItem('userMajor') || '');
  const [year, setYear] = useState(() => localStorage.getItem('userYear') || '');
  const [gender, setGender] = useState(() => localStorage.getItem('userGender') || '');
  const navigate = useNavigate();

  useEffect(() => {
    // sync selected state with localStorage
    const stored = localStorage.getItem('selectedPfp') || '';
    setSelected(stored);
    setMajor(localStorage.getItem('userMajor') || '');
    setYear(localStorage.getItem('userYear') || '');
    setGender(localStorage.getItem('userGender') || '');
  }, []);

  function choose(pfp) {
    localStorage.setItem('selectedPfp', pfp);
    setSelected(pfp);
  }

  function saveProfile() {
    localStorage.setItem('userMajor', major.trim());
    localStorage.setItem('userYear', year);
    localStorage.setItem('userGender', gender);
  }

  function done() {
    saveProfile();
    navigate('/');
  }

  return (
    <div style={{ padding: 24 }}>
      <Title order={2}>Choose profile picture</Title>
      <Stack gap="sm" style={{ maxWidth: 420, marginTop: 16 }}>
        <TextInput
          label="Major"
          placeholder="e.g. Computer Science"
          value={major}
          onChange={(event) => setMajor(event.currentTarget.value)}
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
      </Stack>
      <SimpleGrid cols={4} spacing="md" style={{ marginTop: 18 }}>
        {PFPS.map((p) => (
          <div key={p} style={{ textAlign: 'center' }}>
            <Image
              src={p}
              alt="pfp"
              width={80}
              height={80}
              style={{ borderRadius: 12, cursor: 'pointer', border: selected === p ? '3px solid #4F46E5' : '3px solid transparent' }}
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
