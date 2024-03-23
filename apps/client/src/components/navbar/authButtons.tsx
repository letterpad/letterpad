'use client';
import Link from 'next/link';

export const AuthButtons = () => {
  const location = typeof window !== 'undefined' ? document.location.href : '';
  return (
    <>
      <Link href={`/api/identity/login?source=${location}`} className="text-sm">
        Login
      </Link>
      <Link href="/register?ref=clientHeader" className="text-sm">
        Register
      </Link>
    </>
  );
};
