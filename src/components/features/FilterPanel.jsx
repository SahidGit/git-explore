import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Search, ChevronDown, Code, SlidersHorizontal, CalendarDays, Star, X,
    Layers, Bot, Flame, Globe, Wrench, Cpu, Zap
} from 'lucide-react';

// ─── Constants ─────────────────────────────────────────
const LANGUAGES = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go',
    'Rust', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin',
    'Dart', 'Scala', 'Haskell', 'Elixir', 'Zig',
];

const SORT_OPTIONS = [
    { value: 'stars',   label: 'Most Stars',         icon: '★' },
    { value: 'forks',   label: 'Most Forks',          icon: '⑂' },
    { value: 'updated', label: 'Recently Updated',    icon: '◷' },
];

const SINCE_OPTIONS = [
    { value: 'daily',   label: 'Today' },
    { value: 'weekly',  label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
];

const PRESET_CATEGORIES = [
    {
        id: 'ai-skills',
        label: '🤖 AI Skills',
        shortLabel: 'AI Skills',
        query: 'topic:ai',
        description: 'Artificial Intelligence, LLMs & Machine Learning',
        icon: Bot
    },
    {
        id: 'popular-open-source',
        label: '⭐ Popular Open Source',
        shortLabel: 'Popular Open Source',
        query: 'stars:>30000',
        description: 'Top-tier open source projects with high stars',
        icon: Flame
    },
    {
        id: 'web-dev',
        label: '🌐 Web Dev',
        shortLabel: 'Web Dev',
        query: 'topic:web',
        description: 'Web Development frameworks & modern UI tools',
        icon: Globe
    },
    {
        id: 'new-tools',
        label: '🛠️ New Tools',
        shortLabel: 'New Tools',
        query: 'topic:devtools',
        description: 'Developer productivity tools, CLI utilities & workflow helpers',
        icon: Wrench
    },
    {
        id: 'cloud-devops',
        label: '⚡ Cloud & DevOps',
        shortLabel: 'Cloud & DevOps',
        query: 'topic:devops',
        description: 'Infrastructure, containers & automation tools',
        icon: Zap
    },
    {
        id: 'mobile-dev',
        label: '📱 Mobile Dev',
        shortLabel: 'Mobile Dev',
        query: 'topic:mobile',
        description: 'Cross-platform & native mobile application frameworks',
        icon: Cpu
    },
];

const CATEGORY_OPTIONS = [
    { value: '', label: 'All Categories' },
    ...PRESET_CATEGORIES.map(cat => ({
        value: cat.query,
        label: cat.label
    }))
];

// ─── Pill Dropdown ────────────────────────────────────
const PillDropdown = ({ id, label, options, value, onChange, disabled = false, icon: Icon }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = options.find((o) => o.value === value);
    const displayLabel = selected ? selected.label : label;

    return (
        <div ref={ref} className="relative">
            <button
                id={id}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono font-medium transition-all duration-200 select-none whitespace-nowrap cursor-pointer active:scale-[0.98] ${
                    disabled
                        ? 'opacity-40 cursor-not-allowed bg-[#121215] border-white/[0.06] text-zinc-500'
                        : open
                        ? 'bg-white text-black border-white font-bold shadow-lg'
                        : value
                        ? 'bg-white/10 border-white/20 text-white font-semibold'
                        : 'bg-[#121215] border-white/[0.08] text-zinc-300 hover:border-white/20 hover:text-white hover:bg-white/[0.04]'
                }`}
            >
                {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />}
                <span>{displayLabel}</span>
                <ChevronDown
                    className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    className="absolute top-full left-0 mt-2 min-w-[180px] max-h-64 bg-[#16161A] border border-white/15 rounded-xl shadow-2xl z-50 overflow-y-auto py-1 font-mono text-xs"
                    role="listbox"
                >
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            role="option"
                            aria-selected={value === opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-left transition-colors duration-150 cursor-pointer ${
                                value === opt.value
                                    ? 'text-white font-bold bg-white/10'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                            }`}
                        >
                            {opt.icon && (
                                <span className="text-zinc-500 font-mono text-[11px] w-4 text-center">
                                    {opt.icon}
                                </span>
                            )}
                            <span className="truncate">{opt.label}</span>
                            {value === opt.value && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main FilterPanel ─────────────────────────────────
const FilterPanel = ({ filters, onFilterChange }) => {
    const [focused, setFocused] = useState(false);

    const setFilter = useCallback(
        (key, val) => onFilterChange({ ...filters, [key]: val }),
        [filters, onFilterChange]
    );

    const clearSearch = () => setFilter('query', '');

    const handleCategoryClick = (categoryQuery) => {
        if (filters.query === categoryQuery) {
            setFilter('query', '');
        } else {
            setFilter('query', categoryQuery);
        }
    };

    const activeCategory = PRESET_CATEGORIES.find(c => c.query === filters.query);
    const hasActiveFilters = filters.query || filters.language || filters.sort !== 'stars' || filters.since !== 'daily';

    return (
        <div className="mb-6 space-y-3">
            {/* ── Search bar ── */}
            <div className="relative group">
                <Search
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 pointer-events-none ${
                        focused ? 'text-white' : 'text-zinc-500'
                    }`}
                />
                <input
                    id="repo-search"
                    type="text"
                    placeholder="Search repositories, topics (e.g. topic:ai, react, devtools)..."
                    value={filters.query}
                    onChange={(e) => setFilter('query', e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="Search repositories"
                    className={`w-full bg-[#121215]/80 backdrop-blur-md border rounded-xl pl-10 pr-20 py-3 text-xs sm:text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-200 ${
                        focused
                            ? 'border-white/30 shadow-lg'
                            : 'border-white/[0.08] hover:border-white/20'
                    }`}
                />
                {/* Right-side decorators */}
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {filters.query ? (
                        <button
                            onClick={clearSearch}
                            className="p-1 text-zinc-500 hover:text-white transition-colors duration-150 rounded-md cursor-pointer"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <kbd className="text-[10px] font-mono text-zinc-500 bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded select-none hidden sm:inline-flex">
                            /
                        </kbd>
                    )}
                </div>
            </div>

            {/* ── Preset Category Badges / Quick Filters ── */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mr-1 hidden sm:inline-block">
                    Explore:
                </span>
                {PRESET_CATEGORIES.map((cat) => {
                    const isActive = filters.query === cat.query;
                    const IconComp = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryClick(cat.query)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all duration-200 select-none cursor-pointer active:scale-[0.98] ${
                                isActive
                                    ? 'bg-white text-black border-white font-bold shadow-md'
                                    : 'bg-[#121215] border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/[0.04]'
                            }`}
                            title={cat.description}
                        >
                            <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-500'}`} />
                            <span>{cat.shortLabel}</span>
                            {isActive && <X className="w-3 h-3 text-black/70 hover:text-black ml-0.5" />}
                        </button>
                    );
                })}
            </div>

            {/* ── Filter pills row ── */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Category Dropdown */}
                <PillDropdown
                    id="filter-category"
                    label="🏷️ Categories"
                    icon={Layers}
                    value={activeCategory ? activeCategory.query : ''}
                    onChange={(v) => setFilter('query', v)}
                    options={CATEGORY_OPTIONS}
                />

                {/* Language */}
                <PillDropdown
                    id="filter-language"
                    label="<> All Languages"
                    icon={Code}
                    value={filters.language}
                    onChange={(v) => setFilter('language', v)}
                    options={[
                        { value: '', label: 'All Languages' },
                        ...LANGUAGES.map((l) => ({ value: l, label: l })),
                    ]}
                />

                {/* Sort */}
                <PillDropdown
                    id="filter-sort"
                    label="⑂ Sort By"
                    icon={SlidersHorizontal}
                    value={filters.sort}
                    onChange={(v) => setFilter('sort', v)}
                    options={SORT_OPTIONS}
                />

                {/* Timeframe — disabled when searching */}
                <PillDropdown
                    id="filter-since"
                    label="◷ Timeframe"
                    icon={CalendarDays}
                    value={filters.since}
                    onChange={(v) => setFilter('since', v)}
                    options={SINCE_OPTIONS}
                    disabled={!!filters.query}
                />

                {/* Clear all filters button */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() => onFilterChange({ query: '', language: '', sort: 'stars', since: 'daily' })}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Clear All</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterPanel;
