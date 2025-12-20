import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center p-12">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-700 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
