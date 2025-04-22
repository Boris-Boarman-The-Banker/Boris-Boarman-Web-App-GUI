'use client';

import { db } from '@/lib/db';
import { Button } from 'flowbite-react';
import Image from 'next/image';

export const GoogleLoginButton = () => {
  const handleLogin = async () => {
    const { error } = await db.auth.signInWithOAuth({
      provider: 'google'
    });
    if (error) console.error('Google login error:', error.message);
  };

  return (
    <Button
      fullSized
      onClick={handleLogin}
      color="outlineprimary"
    >
      <Image width={28} height={28} src="/images/logos/google.svg" alt="logo"/>
      Google
    </Button>
  );
};
