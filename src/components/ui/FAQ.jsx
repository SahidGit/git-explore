import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    {
        question: 'Is ExploreGit completely free to use?',
        answer:
            'Yes. ExploreGit is open-source and released under the MIT license. Every feature — from repository discovery to contributor velocity metrics — is accessible with no paywalls, subscriptions, or credit card requirements.',
    },
    {
        question: 'Do I need a GitHub account to browse repositories?',
        answer:
            'No account is required. You can search, filter, and inspect trending repositories anonymously. If you need higher API rate limits, you can connect a Personal Access Token directly from your browser.',
    },
    {
        question: 'How is repository star velocity calculated?',
        answer:
            'Velocity is computed from GitHub public activity metrics across 24-hour, 7-day, and 30-day windows. We prioritize sustained shipping pace and genuine developer momentum over raw vanity star counts.',
    },
    {
        question: 'Where is my data and token stored?',
        answer:
            'Everything runs 100% client-side. Your access tokens, bookmarked repositories, and research notes are stored exclusively in your browser’s localStorage. Zero data is sent to external database servers.',
    },
    {
        question: 'Which languages and frameworks are supported?',
        answer:
            'ExploreGit indexes all public repositories across popular programming languages including TypeScript, Python, Rust, Go, Zig, C++, and more, with dedicated ecosystem filtering.',
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
                                className="btn-saas-secondary text-xs h-[38px] px-4 gap-2"
                            >
                                <span>Documentation</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
