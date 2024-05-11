import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4 min-h-screen">
      <div className="font-bold text-5xl md:text-8xl">FinGenius</div>
      <div className="w-full md:max-w-lg">
        <p className="text-center text-lg">
          Revolutionizing transactions with seamless digital payments, our app simplifies money management for the modern era, ensuring convenience and security.
        </p>
      </div>
      <div className="space-x-6 flex pt-6">
        <Link href="/login">
          <Button variant="outline">Login to your account</Button>
        </Link>
      </div>
      <div>
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Home;