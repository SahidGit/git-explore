import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    {
        question: 'Is GitExplorer free to use?',
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
            'Yes. GitExplorer uses your browser\'s localStorage to persist your curated collections and evaluation notes. Zero cloud dependencies, zero telemetry.',
    },
];

const FAQItem = ({ question, answer, isOpen, onToggle, index }) => {
    return (
        <div className="border-t border-white/[0.08] first:border-t-0">
            <button
                id={`faq-btn-${index}`}
                className="w-full flex items-start justify-between gap-6 py-6 text-left focus:outline-none group"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
            >
                <span
                    className={`text-base md:text-lg font-semibold leading-snug tracking-[-0.01em] transition-colors duration-200 ${
                        isOpen ? 'text-white' : 'text-white/80 group-hover:text-white'
                    }`}
                >
                    {question}
                </span>

                <ChevronDown
                    className={`w-5 h-5 text-[#71717A] flex-shrink-0 mt-0.5 transition-transform duration-200 ease-in-out ${
                        isOpen ? 'rotate-180 text-white' : 'group-hover:text-[#A1A1AA]'
                    }`}
                    aria-hidden="true"
                />
            </button>

            <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-btn-${index}`}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: isOpen ? '200px' : '0px',
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <p className="text-[#A1A1AA] leading-relaxed pb-6 text-base">
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
            className="bg-[#0A0A0C] py-24"
            aria-label="Frequently asked questions"
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section header */}
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">03</span>
                        <span className="w-6 h-px bg-white/20" />
                        <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">FAQ</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                        Questions from the terminal.
                    </h2>
                    <p className="text-base text-[#71717A]">
                        Clear answers. No marketing fluff.
                    </p>
                </div>

                {/* Accordion list */}
                <div role="list">
                    {FAQS.map((faq, index) => (
                        <div key={index} role="listitem">
                            <FAQItem
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={index === openIndex}
                                onToggle={() => setOpenIndex(index === openIndex ? -1 : index)}
                                index={index}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
