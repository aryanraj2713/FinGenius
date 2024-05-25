// src/app/dashboard/page.tsx
"use client";
import Assistant from '@/components/assistant/chat';
import { Nav } from '@/components/nav'
import Todo from '@/components/todo';
import React, { useEffect, useState } from 'react'

interface Transaction {
    _id: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    receiver: string;
}

const DashboardPage = () => {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);


    const fetchTransactions = async () => {
        const url = 'http://localhost:8080/api/orders';
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setTransactions(data);
            console.log('Transactions:', JSON.stringify(data));
        } else {
            console.error('Error:', response.statusText);
        }
    }
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
        fetchTransactions();
    }, []); // Removed [user] dependency to prevent infinite loop

    return (
        <div className='py-10'>
            <Nav />
            <div className='flex flex-col items-center justify-center pt-20'>
                <h1 className='text-2xl font-semibold mb-8'>Welcome to the Dashboard</h1>
                <div className='flex justify-evenly w-full px-8 py-10'>
                    <div className='border-2 px-20 py-6 rounded-md border-black'>
                        <div className='text-center text-xl font-semibold'>Monthly Income</div>
                        <div className='text-center font-bold text-2xl'>{user?.income}</div>
                    </div>
                    <div className='border-2 px-20 py-6 rounded-md border-black'>
                        <div className='text-center text-xl font-semibold'>Expenditure</div>
                        <div className='text-center font-bold text-2xl'>{user?.expense}</div>
                    </div>
                    <div className='border-2 px-20 py-6 rounded-md border-black'>
                        <div className='text-center text-xl font-semibold'>Balance</div>
                        <div className='text-center font-bold text-2xl'>{user?.balance}</div>
                    </div>
                </div>
                <div className='text-2xl font-semibold'>Expense Tracker</div>
                <div className='flex justify-evenly px-8 pb-10 w-screen'>
                    <Todo />
                </div>
                <div className="overflow-x-auto w-11/12 px-10">
                    <table className='min-w-full bg-white border border-gray-200 shadow-md rounded-lg'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='px-6 py-3 text-left border-b'>Order ID</th>
                                <th className='px-6 py-3 text-left border-b'>Amount</th>
                                <th className='px-6 py-3 text-left border-b'>Currency</th>
                                <th className='px-6 py-3 text-left border-b'>Receipt</th>
                                <th className='px-6 py-3 text-left border-b'>Receiver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map(transaction => (
                                    <tr key={transaction._id} className='hover:bg-gray-100'>
                                        <td className='px-6 py-4 border-b'>{transaction.orderId}</td>
                                        <td className='px-6 py-4 border-b'>{transaction.amount}</td>
                                        <td className='px-6 py-4 border-b'>{transaction.currency}</td>
                                        <td className='px-6 py-4 border-b'>{transaction.receipt}</td>
                                        <td className='px-6 py-4 border-b'>{transaction.receiver}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className='px-6 py-4 border-b text-center'>No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <div className='text-center text-2xl font-semibold mt-8'>
                    Want to chat with our assistant?
                </div>
                <div className='px-3'>
                    <Assistant />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
