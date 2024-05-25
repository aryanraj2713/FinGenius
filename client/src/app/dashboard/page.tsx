// src/app/dashboard/page.tsx
"use client";
import Assistant from '@/components/assistant/chat';
import { Nav } from '@/components/nav'
import React, { useEffect } from 'react'

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

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className='py-10'>
            <Nav />
            <div className='flex flex-col items-center justify-center pt-20'>
                <h1 className='text-2xl font-semibold mb-8'>Welcome to the Dashboard</h1>
                <div className="overflow-x-auto w-full px-8">
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
                <div className='text-center text-2xl font-semibold my-8'>
                    Want to chat with our assistant?
                </div>
                <Assistant />
            </div>
        </div>
    )
}

export default DashboardPage
