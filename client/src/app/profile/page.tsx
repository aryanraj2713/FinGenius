"use client"
import { Nav } from '@/components/nav';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';


const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { name: 'Twitter', url: 'https://twitter.com/' },
];


const Profile = () => {

    const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

    const handleSubmit = async () => {
        const url = `http://localhost:8080/api/income`;
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ income: monthlyIncome }),
        });
        if (response.ok) {
            console.log('Monthly Income updated successfully');
            toast.success('Monthly Income updated successfully');
        } else {
            console.error('Error updating monthly income:', response.statusText);
        }
    };

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
            <div className="flex flex-col items-center justify-center min-h-screen space-y-10">
                <div>
                    <div className="flex justify-center mt-5">
                        <div className="flex flex-col items-center">
                            <h2 className="text-md">{user?.name}</h2>
                            <h2 className="text-md">{user?.email}</h2>
                            <h2 className="text-md">Income: {user?.income}</h2>
                            <h2 className="text-md">Expense: {user?.expense}</h2>
                            <h2 className="text-md">Balance: {user?.balance}</h2>
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
                <div className="border-2 p-2 rounded-md border-black">
                    <Dialog>
                        <DialogTrigger>Update Income</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Please Update your Monthly Income?</DialogTitle>
                                <Input type="number" placeholder="Enter your Monthly Income" onChange={(e) => setMonthlyIncome(parseInt(e.target.value))} />
                                <DialogDescription>
                                    <Button onClick={handleSubmit}>Submit</Button>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>

            </div>
        </div>
    );
};

export default Profile;