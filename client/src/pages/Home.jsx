import React from 'react';
import BubblesBackground from '../styles/BubblesBackground';
import '../styles/DefaultBubbles.css';

export default function Home() {
    return (
        <div className='bubbles-background-container'>
            <BubblesBackground />
            <div className='content-container'>
                <p className='text p-3 my-5 mx-2 rounded-lg font-semibold'>
                    Home
                </p>
            </div>
        </div>
    );
}
