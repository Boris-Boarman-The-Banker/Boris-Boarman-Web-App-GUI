import { db } from './db';

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const {
    data: { session },
    error,
  } = await db.auth.getSession();

  if (error || !session) {
    throw new Error('Not authenticated');
  }

  const headers = {
    ...init.headers,
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };

  const res = await fetch(input, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    console.warn('Token expired. Attempting refresh…');

    const {
      data: refreshedSession,
      error: refreshError,
    } = await db.auth.refreshSession();

    if (refreshError || !refreshedSession.session) {
      console.error('Session refresh failed:', refreshError);
      throw new Error('Session expired. Please log in again.');
    }

    const retryHeaders = {
      ...init.headers,
      Authorization: `Bearer ${refreshedSession.session.access_token}`,
      'Content-Type': 'application/json',
    };

    return fetch(input, {
      ...init,
      headers: retryHeaders,
    });
  }

  return res;
}