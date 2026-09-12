import React from 'react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="container-main py-10 md:py-20 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="font-integral text-3xl md:text-5xl font-bold mb-4">Sign Up</h1>
      <p className="text-gray-600 text-lg mb-6">Signup functionality is coming soon!</p>
      <Link href="/" className="bg-primary text-white font-medium rounded-pill px-8 py-3 hover:opacity-80 transition-opacity">
        Back to Home
      </Link>
    </main>
  );
}
