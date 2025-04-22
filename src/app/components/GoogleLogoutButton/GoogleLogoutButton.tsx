'use client';

import { db } from '@/lib/db';
import { Button } from 'flowbite-react';

export const GoogleLogoutButton = () => {
  const handleLogout = async () => {
    const { error } = await db.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
    } else {
      window.location.href = '/auth/login';
    }
  };

  return <Button
    onClick={handleLogout}
    color="primary"
    fullSized
  >
    Logout
  </Button>;
};