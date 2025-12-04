import React from 'react';
import { ArrowLeft } from 'lucide-react';

const InfoPage = ({ title, subtitle, content, onBack }) => {
    return (
        <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-[#30363D]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#8B949E] hover:text-[#58A6FF] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#58A6FF] to-[#BC8CFF]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xl text-slate-400 font-light">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div
                    className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-blue-300 prose-code:bg-blue-900/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-ul:text-slate-400 prose-li:marker:text-slate-600"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </main>
        </div>
    );
};

export default InfoPage;
