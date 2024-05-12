"use client";
import { Nav } from '@/components/nav'
import React from 'react'

const DashboardPage = () => {
    return (
        <div>
            <Nav />
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <h1 className='text-2xl'>Welcome to the Dashboard!</h1>
            </div>
        </div>
    )
}

export default DashboardPage