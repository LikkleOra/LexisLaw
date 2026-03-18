'use client';

import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export function AuthButtons() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  if (userId) {
    return <UserButton />;
  }

  return (
    <div className="flex gap-4">
      <SignInButton mode="modal">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}
