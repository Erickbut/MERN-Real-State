import React from 'react'
import './bubbles.scss'

const BubblesBackground = () => {
    const bubblesCount = 50;

    const bubbles = Array.from({ length: bubblesCount }, (_, i) => (
        <div key={i} className="bubble"></div>
    ));

    return (
        <div className="bubbles">
            {bubbles}
        </div>
    );
}

export default BubblesBackground;