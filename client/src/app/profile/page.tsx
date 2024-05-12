"use client"
import { Nav } from '@/components/nav';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { name: 'Twitter', url: 'https://twitter.com/' },
];

const Profile = () => {
    const [isInvestor, setIsInvestor] = useState(false);
    const [user, setUser] = useState<any>();
    useEffect(() => {
        const url = `http://localhost:8080/api/user`;
        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, []); // Removed [user] dependency to prevent infinite loop

    return (
        <div>
            <Nav />
            <div className="flex justify-center min-h-screen items-center space-x-10">
                <div>
                    <div className="flex justify-center mt-5">
                        <div className="flex flex-col items-center">
                            <h2 className="text-md">{user?.name}</h2>
                            <h2 className="text-md">{user?.email}</h2>
                        </div>
                    </div>
                </div>
                {/* <div className="">
                    <Image
                        src="https://www.github.com/divyanshu1810.png"
                        alt="Image"
                        width={200}
                        height={200}
                        className='border-4 border-black rounded-lg'
                        priority
                    />
                </div> */}
            </div>
        </div>
    );
};

export default Profile;