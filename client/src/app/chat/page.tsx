'use client';
import { Chat } from '@/components/chat/chat';
import { Nav } from '@/components/nav';
import React, { useEffect, useState } from 'react';

const ChatPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener('resize', checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  return (
    <div>
      <div className="py-10">
        <Nav />
      </div>
      <main className="flex flex-col items-center justify-center">
        <div className="z-10 border rounded-lg min-h-screen text-sm lg:flex w-full max-w-4xl">
          <Chat isMobile={isMobile} />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
