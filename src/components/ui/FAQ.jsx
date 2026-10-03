import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';

const FAQS = [
    {
        question: 'Is ExploreGit completely free to use?',
        answer:
            'Yes. ExploreGit is open-source and released under the MIT license. Every feature — from repository discovery, Hidden Gems, and AI ecosystem intelligence to contributor heatmaps — is 100% free with no paywalls, subscriptions, or credit card requirements.',
    },
    {
        question: 'What is the Hidden Gems & Tools registry?',
        answer:
            'The Gems directory spotlights high-momentum, under-the-radar open-source repositories (<2,500 stars) alongside timeless legendary software (VLC, 7-Zip, LocalSend, ShareX, Entire.io). Each gem includes verified install commands, platform compatibility, and direct official store links.',
    },
    {
        question: 'Do I need a GitHub account to browse repositories and gems?',
        answer:
            'No account is required. You can search, filter, and inspect repositories and gems anonymously. If you need higher API rate limits (5,000 req/hr), you can connect a Personal Access Token directly from your browser in one click.',
    },
    {
        question: 'How are trending repositories and gems surfaced?',
        answer:
            'ExploreGit continuously aggregates GitHub Search API data across daily, weekly, and monthly intervals. Algorithms analyze star velocity, fork acceleration, and recent commit cadences to surface genuine emerging open-source momentum.',
    },
    {
        question: 'Where is my data and token stored?',
        answer:
            'Everything runs client-side. Your Personal Access Token is kept safely in sessionStorage (cleared upon closing your browser), while bookmarks, search history, and research notes reside locally in your browser’s localStorage with zero cloud tracking.',
    },
    {
        question: 'Which languages, platforms, and frameworks are supported?',
        answer:
            'ExploreGit indexes public repositories across TypeScript, Python, Rust, Go, Zig, C++, and more, with platform filtering across macOS, Linux, Windows, Android, and iOS across developer tools and software gems.',
    },
];

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
    return (
        <div className="border-b border-white/[0.08]">
            <button
                type="button"
                className="w-full py-3.5 sm:py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0C] rounded-lg group cursor-pointer"
                onClick={onClick}
                id={`faq-btn-${index}`}
                aria-controls={`faq-answer-${index}`}
                aria-expanded={isOpen}
            >
                <span className="text-sm sm:text-[15px] font-medium text-white group-hover:text-zinc-200 transition-colors font-sans pr-4 leading-snug">
                    {question}
                </span>
                <ChevronDown
                    className={`w-4 h-4 shrink-0 text-zinc-400 group-hover:text-white transition-transform duration-200 ease-out ml-2 ${
                        isOpen ? 'rotate-180 text-white' : ''
                    }`}
                    aria-hidden="true"
                />
            </button>
            <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-btn-${index}`}
                className={`overflow-hidden transition-all duration-200 ease-out ${
                    isOpen ? 'max-h-80 opacity-100 pb-4' : 'max-h-0 opacity-0'
                }`}
            >
                <p className="text-zinc-400 font-sans leading-relaxed text-xs sm:text-sm max-w-[60ch]">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section
            id="faq"
            className="bg-[#0A0A0C] py-14 sm:py-18 lg:py-20 border-b border-white/10"
            aria-label="Frequently asked questions"
        >
            <div className="max-w-[1040px] mx-auto px-6 sm:px-8">
                {/* Top Section Label and Heading */}
                <div className="mb-8 sm:mb-10">
                    <span className="text-zinc-500 font-sans text-xs font-semibold uppercase tracking-wider block mb-2">
                        Support
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-white tracking-tight font-heading">
                        Frequently asked questions
                    </h2>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: FAQ Accordion */}
                    <div className="lg:col-span-7 divide-y divide-white/[0.08] border-t border-white/[0.08]">
                        {FAQS.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={index === openIndex}
                                onClick={() => setOpenIndex(index === openIndex ? null : index)}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Right Column: Documentation Support Sidebar */}
                    <div className="lg:col-span-5 lg:pl-2 flex flex-col justify-start pt-1 lg:pt-3 space-y-4">
                        <p className="text-zinc-400 font-sans text-xs sm:text-sm leading-relaxed max-w-sm">
                            Can’t find the answers you’re looking for? Explore our complete guides and API specifications in Documentation.
                        </p>
                        <div>
                            <Link
                                to="/docs"
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                            >
                                <span>Documentation</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
