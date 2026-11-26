'use client';
import { signOutClient } from '@/lib/utils/clientSso';

export const Logout = () => (
  <button type="button" onClick={() => void signOutClient()}>Logout</button>
);
