import React from 'react';
import { Button } from '@mantine/core';

export default function UploadButton({ onClick }) {
  return (
    <Button
      variant="filled"
      size="md"
      radius="md"
      style={{ margin: '12px 0', display: 'inline-block' }}
      onClick={() => (onClick ? onClick() : console.log('Upload button clicked'))}
    >
      Upload / Post
    </Button>
  );
}
