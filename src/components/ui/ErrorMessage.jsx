import React from 'react';

import { MdRefresh } from 'react-icons/md';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center mx-4 my-8 relative">
            {/* Centered Overlay with Pulse Effect */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#7C3AED]/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-[#161B22] rounded-2xl p-4 border border-[#30363D] shadow-2xl">
                    <img
                        src="/duck_walking.gif"
                        alt="Lost Duck Family"
                        className="w-80 h-80 object-contain"
                    />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-[#F0F6FC] mb-2 font-sans">Connection Lost</h3>
            <p className="text-[#8B949E] mb-8 max-w-md text-lg">
                {message || 'Oops! It seems like the ducks have wandered off with the connection.'}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-full transition-all hover:scale-105 font-medium shadow-lg hover:shadow-[#238636]/40"
                >
                    <MdRefresh className="w-5 h-5" />
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
