import React from 'react';
import BubblesBackground from '../styles/BubblesBackground';
import '../styles/DefaultBubbles.css';

const About = () => {
    return (
        <div className="bubbles-background-container min-h-screen flex items-center justify-center">
            <BubblesBackground />
            <div className='content-container'>
                <p className='text p-3 my-5 mx-2 rounded-lg font-semibold'>
                    About
                </p>
            </div>
        </div>
    );
};

export default About;
