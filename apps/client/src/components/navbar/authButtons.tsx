'use client';
import Link from 'next/link';

export const AuthButtons = () => {
  return (
    <>
      <Link
        href={`/api/identity/login?source=${document.location.href}`}
        className="text-sm"
      >
        Login
      </Link>
      <Link href="/register?ref=clientHeader" className="text-sm">
        Register
      </Link>
    </>
  );
};
