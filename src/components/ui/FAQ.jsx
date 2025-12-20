import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        question: 'Is GitExplorer free to use?',
        answer: 'Yes, GitExplorer is completely free and open source. You can use all features without any cost.'
    },
    {
        question: 'Do I need a GitHub account?',
        answer: 'You can browse and search repositories without an account. However, to star projects and sync your data, a GitHub account is recommended.'
    },
    {
        question: 'How is the "Trending" data calculated?',
        answer: 'We use GitHub\'s public API to fetch repositories with the most stars over specific time periods (daily, weekly, monthly).'
    },
    {
        question: 'Can I bookmark repositories locally?',
        answer: 'Yes! GitExplorer uses local storage to save your bookmarks, so you can access them even without logging in.'
    },
    {
        question: 'Is there a limit to how many repos I can view?',
        answer: 'GitHub\'s API has rate limits. If you hit a limit, adding your personal access token in the settings will increase your quota.'
    }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-800 last:border-0">
            <button
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                onClick={onClick}
            >
                <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-indigo-400' : 'text-slate-200 group-hover:text-white'}`}>
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-indigo-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-slate-400 leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-24 bg-slate-950/30">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-slate-400">
                        Got questions? We've got answers.
                    </p>
                </div>

                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 md:p-8 backdrop-blur-sm">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={index === openIndex}
                            onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
