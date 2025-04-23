'use client';

import { db } from '@/lib/db';
import { Button } from 'flowbite-react';

export const GoogleLogoutButton = () => {
  const handleLogout = async () => {
    await db.auth.getSession();

    const { error } = await db.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
    } else {
      window.location.href = '/login';
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