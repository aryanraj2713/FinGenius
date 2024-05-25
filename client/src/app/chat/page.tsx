'use client';
import Analyser from '@/components/assistant/Analyser';
import { Chat } from '@/components/chat/chat';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ChatPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('http://localhost:8000/save-pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Response:', response.data);
        toast.success('File uploaded successfully.');
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      alert('Please upload a file first.');
    }
  };

  return (
    <div>
      <div className="pt-10 pb-20">
        <Nav />
      </div>
      <h1 className="text-xl font-bold text-center">
        Upload your bank statement to get started
      </h1>
      <div className="flex items-center justify-center pb-10">
        <div className="flex items-center justify-center pt-10">
          <Input id="file" type="file" accept="application/pdf" className="max-w-[20vw]" onChange={handleFileChange} />
          <Button className="ml-2" onClick={handleFileUpload}>Upload</Button>
        </div>
      </div>
      <h1 className="text-xl font-bold my-2 pb-10 text-center">
        Talk to our Chat Analyser to get insights on your transactions
      </h1>
      <div className='w-9/12 mx-auto'>
        <Analyser />
      </div>
    </div>
  );
};

export default ChatPage;
