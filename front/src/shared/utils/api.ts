import type { ApiErrorResponse } from '@/shared/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export class ApiError extends Error {
  errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const xsrfToken = getCookie('XSRF-TOKEN');
  if (xsrfToken && !headers.has('X-XSRF-TOKEN')) {
    headers.set('X-XSRF-TOKEN', xsrfToken);
  }

  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = data as ApiErrorResponse | null;
    const message = error?.message ?? 'Une erreur est survenue';
    const fieldError = error?.errors
      ? Object.values(error.errors).flat()[0]
      : undefined;

    throw new ApiError(fieldError ?? message, error?.errors);
  }

  return data as T;
}

export async function registerUser(payload: {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  await ensureCsrfCookie();
  return apiFetch<{ user: import('@/shared/types/auth').AuthUser; message: string }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function loginUser(payload: {
  email: string;
  password: string;
  remember?: boolean;
}) {
  await ensureCsrfCookie();
  return apiFetch<{ user: import('@/shared/types/auth').AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logoutUser(): Promise<void> {
  await ensureCsrfCookie();
  await apiFetch<void>('/auth/logout', { method: 'POST' });
}

export async function fetchCurrentUser(): Promise<import('@/shared/types/auth').AuthUser | null> {
  try {
    return await apiFetch<import('@/shared/types/auth').AuthUser>('/auth/user');
  } catch {
    return null;
  }
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  await ensureCsrfCookie();
  return apiFetch<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(payload: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<{ message: string }> {
  await ensureCsrfCookie();
  return apiFetch<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteAccount(password: string): Promise<void> {
  await ensureCsrfCookie();
  await apiFetch<void>('/auth/user', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
}
