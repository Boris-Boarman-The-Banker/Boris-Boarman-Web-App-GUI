'use client';

import { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';

export default function ProjectsLayout({ children }: PropsWithChildren) {
  const router = useRouter();

  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    router.push('/login');
  }

  return (
    <>
      {children}
    </>
  );
}