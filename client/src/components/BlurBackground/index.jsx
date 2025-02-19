import React from 'react';
const BlurBackground = ({ isActive, onClick, ...props }) => {
    return (
        <div
            onClick={() => onClick()}
            className={`${
                isActive ? 'block' : 'hidden'
            } fixed z-20 inset-0 opacity-25 min-w-full min-h-screen bg-gray-500`}
            {...props}
        ></div>
    );
};

export default BlurBackground;
