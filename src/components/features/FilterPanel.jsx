import React from 'react';
import { Search, Filter, Calendar, Star, Code, GitFork, ChevronDown } from 'lucide-react';

const LANGUAGES = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go',
    'Rust', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin'
];

const FilterPanel = ({ filters, onFilterChange }) => {
    const [openDropdown, setOpenDropdown] = React.useState(null);
    const [showAllLanguages, setShowAllLanguages] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const displayedLanguages = showAllLanguages ? LANGUAGES : LANGUAGES.slice(0, 8);

    return (
        <div className="relative z-20 bg-slate-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-8 shadow-2xl shadow-black/20" ref={dropdownRef}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search */}
                <div className="md:col-span-5 relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        value={filters.query}
                        onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
                        className="relative w-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500 hover:bg-slate-900/60 hover:border-white/20"
                    />
                </div>

                {/* Language Filter */}
                <div className="md:col-span-3 relative group">
                    <div
                        onClick={() => toggleDropdown('language')}
                        className={`relative w-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white cursor-pointer flex items-center justify-between transition-all hover:bg-slate-900/60 hover:border-white/20 ${openDropdown === 'language' ? 'border-blue-500/50 ring-1 ring-blue-500/50 bg-slate-900/60' : ''}`}
                    >
                        <div className="flex items-center gap-2 truncate">
                            <Code className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${openDropdown === 'language' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <span className={!filters.language ? 'text-slate-400' : ''}>
                                {filters.language || 'All Languages'}
                            </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${openDropdown === 'language' ? 'rotate-180 text-blue-400' : ''}`} />
                    </div>

                    {openDropdown === 'language' && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0D1117]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                                <button
                                    onClick={() => {
                                        onFilterChange({ ...filters, language: '' });
                                        setOpenDropdown(null);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${!filters.language ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                                >
                                    All Languages
                                </button>
                                {displayedLanguages.map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => {
                                            onFilterChange({ ...filters, language: lang });
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${filters.language === lang ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                                {!showAllLanguages && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAllLanguages(true);
                                        }}
                                        className="w-full mt-2 py-2 px-3 rounded-lg text-xs text-center text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/20 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <span>View All Languages</span>
                                        <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sort Filter */}
                <div className="md:col-span-2 relative group">
                    <div
                        onClick={() => toggleDropdown('sort')}
                        className={`relative w-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white cursor-pointer flex items-center justify-between transition-all hover:bg-slate-900/60 hover:border-white/20 ${openDropdown === 'sort' ? 'border-blue-500/50 ring-1 ring-blue-500/50 bg-slate-900/60' : ''}`}
                    >
                        <div className="flex items-center gap-2 truncate">
                            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${openDropdown === 'sort' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <span>
                                {filters.sort === 'stars' ? 'Most Stars' : filters.sort === 'forks' ? 'Most Forks' : 'Recently Updated'}
                            </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${openDropdown === 'sort' ? 'rotate-180 text-blue-400' : ''}`} />
                    </div>

                    {openDropdown === 'sort' && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0D1117]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-2">
                                {[
                                    { value: 'stars', label: 'Most Stars' },
                                    { value: 'forks', label: 'Most Forks' },
                                    { value: 'updated', label: 'Recently Updated' }
                                ].map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onFilterChange({ ...filters, sort: option.value });
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${filters.sort === option.value ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Time Range */}
                <div className="md:col-span-2 relative group">
                    <div
                        onClick={() => !filters.query && toggleDropdown('since')}
                        className={`relative w-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white flex items-center justify-between transition-all ${filters.query ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-900/60 hover:border-white/20'} ${openDropdown === 'since' ? 'border-blue-500/50 ring-1 ring-blue-500/50 bg-slate-900/60' : ''}`}
                    >
                        <div className="flex items-center gap-2 truncate">
                            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${openDropdown === 'since' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <span>
                                {filters.since === 'daily' ? 'Today' : filters.since === 'weekly' ? 'This Week' : 'This Month'}
                            </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${openDropdown === 'since' ? 'rotate-180 text-blue-400' : ''}`} />
                    </div>

                    {openDropdown === 'since' && !filters.query && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0D1117]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-2">
                                {[
                                    { value: 'daily', label: 'Today' },
                                    { value: 'weekly', label: 'This Week' },
                                    { value: 'monthly', label: 'This Month' }
                                ].map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onFilterChange({ ...filters, since: option.value });
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${filters.since === option.value ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
