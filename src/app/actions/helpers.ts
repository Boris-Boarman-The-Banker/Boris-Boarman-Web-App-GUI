import { db } from '@/lib/db';

export const getUser = async () => {
  const {
    data: { user },
    error: userError,
  } = await db.auth.getUser();

  if (userError || !user) {
    throw new Error('Not authenticated');
  }

  return user;
};