import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import heartIcon from '../assets/heart.png';

const Footer = ({ onNavigate }) => {
    return (
        <footer className="bg-[#0D1117] border-t border-[#30363D] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#58A6FF]/10 flex items-center justify-center border border-[#58A6FF]/20">
                                <FaGithub className="w-5 h-5 text-[#58A6FF]" />
                            </div>
                            <span className="text-xl font-bold text-[#F0F6FC]">
                                GitExplorer
                            </span>
                        </div>
                        <p className="text-[#8B949E] text-sm leading-relaxed">
                            Discover, analyze, and manage open source projects with a powerful, modern dashboard designed for developers.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors">
                                <FaGithub className="w-5 h-5" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#8B949E] hover:text-[#58A6FF] transition-colors">
                                <FaTwitter className="w-5 h-5" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#8B949E] hover:text-[#58A6FF] transition-colors">
                                <FaLinkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-[#F0F6FC] font-semibold mb-6 font-sans">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <button onClick={() => onNavigate('features')} className="text-[#8B949E] hover:text-[#58A6FF] transition-colors text-sm text-left">Features</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('dashboard')} className="text-[#8B949E] hover:text-[#58A6FF] transition-colors text-sm text-left">Trending</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('bookmarks')} className="text-[#8B949E] hover:text-[#58A6FF] transition-colors text-sm text-left">Bookmarks</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('changelog')} className="text-[#8B949E] hover:text-[#58A6FF] transition-colors text-sm text-left">Changelog</button>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="text-[#F0F6FC] font-semibold mb-6 font-sans">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <button onClick={() => onNavigate('docs')} className="text-[#8B949E] hover:text-[#58A6FF] transition-colors text-sm text-left">Documentation</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('api')} className="text-[#8B949E] hover:text-[#58A6FF] transition-colors text-sm text-left">API Reference</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('community')} className="text-[#8B949E] hover:text-[#58A6FF] transition-colors text-sm text-left">Community</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('blog')} className="text-[#8B949E] hover:text-[#58A6FF] transition-colors text-sm text-left">Blog</button>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-[#F0F6FC] font-semibold mb-6 font-sans">Stay Updated</h3>
                        <p className="text-[#8B949E] text-sm mb-4">
                            Subscribe to our newsletter for the latest updates and features.
                        </p>
                        <form className="space-y-3" onSubmit={(e) => {
                            e.preventDefault();
                            // TODO: Trigger n8n webhook here
                            // fetch('https://your-n8n-instance.com/webhook/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
                            console.log('Newsletter subscription submitted');
                        }}>
                            <div className="relative">
                                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-[#161B22] border border-[#30363D] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#F0F6FC] placeholder:text-[#8B949E] focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all"
                                />
                            </div>
                            <button className="w-full py-2.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium transition-colors border border-[#3fb950]">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-[#30363D] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[#8B949E] text-sm">
                        © 2025 Developers. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-[#8B949E] text-sm">
                        <span>Made with</span>
                        <img src={heartIcon} alt="Heart" className="w-12 h-12" />
                        <span>for developers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
