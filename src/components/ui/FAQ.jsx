import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    {
        question: 'Is ExploreGit free to use?',
        answer:
            'Completely free. Open source, always. Every feature ships without a paywall — no tiers, no trials, no tracking.',
    },
    {
        question: 'Do I need a GitHub account or login?',
        answer:
            'No. Browse and search repositories without signing in. You can also connect a personal access token for Power User Mode (5,000 requests/hour with zero cloud proxies).',
    },
    {
        question: 'How is trending velocity calculated?',
        answer:
            'Directly from GitHub\'s public registry. We index repositories ranked by actual star velocity across daily, weekly, and monthly windows — prioritizing active shipping over all-time vanity metrics.',
    },
    {
        question: 'How does Power User Mode work?',
        answer:
            'Unlock 5,000 req/hr with direct client-side GitHub authentication. Your token is stored exclusively in your browser\'s local storage and talks straight to GitHub. Zero proxies, zero middleware.',
    },
    {
        question: 'Can I bookmark projects and save notes?',
        answer:
            'Yes. ExploreGit uses your browser\'s localStorage to persist your curated collections and evaluation notes. Zero cloud dependencies, zero telemetry.',
    },
];

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
    return (
        <div className="border-b border-white/10 last:border-0">
            <button
                type="button"
                className="w-full py-5 sm:py-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg group cursor-pointer"
                onClick={onClick}
                id={`faq-btn-${index}`}
                aria-controls={`faq-answer-${index}`}
                aria-expanded={isOpen}
            >
                <span
                    className={`text-base sm:text-lg font-medium transition-colors ${
                        isOpen ? 'text-[var(--accent)] font-semibold' : 'text-zinc-200 group-hover:text-white'
                    }`}
                >
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-300 ml-4 ${
                        isOpen ? 'rotate-180 text-[var(--accent)]' : 'text-zinc-400 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                />
            </button>
            <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-btn-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-60 opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}
            >
                <p className="text-[#94A3B8] leading-relaxed text-sm sm:text-base max-w-[65ch]">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section
            id="faq"
            className="bg-[#0A0A0C] py-20 sm:py-24 border-b border-white/10"
            aria-label="Frequently asked questions"
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-12 sm:mb-16 space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-base text-[#94A3B8] max-w-xl mx-auto font-sans">
                        Clear answers. No marketing fluff.
                    </p>
                </div>

                {/* Single Card Container with Clean Divider Rows */}
                <div className="bg-[#121316] rounded-xl border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
                    {FAQS.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={index === openIndex}
                            onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
