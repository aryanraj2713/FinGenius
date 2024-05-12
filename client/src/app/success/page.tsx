"use client";
import React from 'react'
import { Player } from "@lottiefiles/react-lottie-player";
import { Nav } from '@/components/nav';

const Success = () => {
    return (
        <div>
            <Nav />
            <div className='flex justify-center items-center min-h-screen flex-col'>
                <h1 className='text-2xl font-semibold'>Payment Successful</h1>
                <Player
                    src="https://lottie.host/be80b83b-a760-406a-a878-5f3a4fc56d90/b8XPSjnqBM.json"
                    className="player w-[200px] h-[200px]"
                    loop
                    autoplay
                />
            </div>
        </div>
    )
}

export default Success