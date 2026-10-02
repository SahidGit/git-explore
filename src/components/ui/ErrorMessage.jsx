import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="max-w-md mx-auto my-12 p-8 text-center space-y-4 font-sans">
            <h3 className="text-xl font-semibold text-white">
                Connection Interrupted
            </h3>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
                {message || 'Unable to establish connection with GitHub REST API endpoint. Verify network status or token quota.'}
            </p>
            {onRetry && (
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-block rounded bg-neutral-900 px-6 py-2.5 font-normal text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 hover:dark:bg-neutral-200 cursor-pointer shadow-sm text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
};

export default ErrorMessage;
