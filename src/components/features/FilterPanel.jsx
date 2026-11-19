import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Search, ChevronDown, Code, SlidersHorizontal, CalendarDays, Star, X,
    Layers, Bot, Flame, Globe, Wrench, Cpu, Zap, Sparkles,
    Code2, Clock, Calendar, Filter
} from 'lucide-react';

// ─── Constants ─────────────────────────────────────────
// ─── Quick Filter Tags (Synchronized with Hero) ──────────
const QUICK_TAGS = [
  {
    id: 'ai',
    label: 'AI',
    type: 'topic',
    group: 'tech',
    query: 'topic:ai',
    color: '#C084FC',
    icon: Sparkles,
    activeClasses: 'bg-purple-500/20 text-purple-200 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.35)]',
    hoverBorder: 'hover:border-purple-500/40',
  },
  {
    id: 'python',
    label: 'Python',
    type: 'lang',
    group: 'tech',
    lang: 'Python',
    color: '#38BDF8',
    icon: Code2,
    activeClasses: 'bg-blue-500/20 text-blue-200 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.35)]',
    hoverBorder: 'hover:border-blue-500/40',
  },
  {
    id: 'rust',
    label: 'Rust',
    type: 'lang',
    group: 'tech',
    lang: 'Rust',
    color: '#FB923C',
    icon: Code2,
    activeClasses: 'bg-orange-500/20 text-orange-200 border-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.35)]',
    hoverBorder: 'hover:border-orange-500/40',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    type: 'lang',
    group: 'tech',
    lang: 'TypeScript',
    color: '#60A5FA',
    icon: Code2,
    activeClasses: 'bg-sky-500/20 text-sky-200 border-sky-500/60 shadow-[0_0_12px_rgba(14,165,233,0.35)]',
    hoverBorder: 'hover:border-sky-500/40',
  },
  {
    id: 'go',
    label: 'Go',
    type: 'lang',
    group: 'tech',
    lang: 'Go',
    color: '#22D3EE',
    icon: Code2,
    activeClasses: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.35)]',
    hoverBorder: 'hover:border-cyan-500/40',
  },
  {
    id: 'today',
    label: 'Today',
    type: 'timeframe',
    group: 'time',
    since: 'daily',
    color: '#FB7185',
    icon: Flame,
    activeClasses: 'bg-rose-500/20 text-rose-200 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]',
    hoverBorder: 'hover:border-rose-500/40',
  },
  {
    id: 'this-week',
    label: 'This Week',
    type: 'timeframe',
    group: 'time',
    since: 'weekly',
    color: '#FBBF24',
    icon: Clock,
    activeClasses: 'bg-amber-500/20 text-amber-200 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.35)]',
    hoverBorder: 'hover:border-amber-500/40',
  },
  {
    id: 'this-month',
    label: 'This Month',
    type: 'timeframe',
    group: 'time',
    since: 'monthly',
    color: '#818CF8',
    icon: Calendar,
    activeClasses: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.35)]',
    hoverBorder: 'hover:border-indigo-500/40',
  },
];

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
        id: 'good-first-issues',
        label: '🌱 Good First Issues',
        shortLabel: 'Good First Issues',
        query: 'topic:good-first-issue',
        description: 'Beginner-friendly repositories actively seeking new open-source contributors',
        icon: Sparkles
    },
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
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
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

    const handleQuickTagClick = (tag) => {
        if (tag.type === 'lang') {
            const isCurrentlySelected = (filters.language || '').toLowerCase() === tag.lang.toLowerCase();
            setFilter('language', isCurrentlySelected ? '' : tag.lang);
        } else if (tag.type === 'timeframe') {
            const isCurrentlySelected = filters.since === tag.since;
            setFilter('since', isCurrentlySelected ? 'daily' : tag.since);
        } else if (tag.type === 'topic') {
            const isCurrentlySelected = filters.query === tag.query;
            setFilter('query', isCurrentlySelected ? '' : tag.query);
        }
    };

    const isTagActive = (tag) => {
        if (tag.type === 'lang') {
            return (filters.language || '').toLowerCase() === tag.lang.toLowerCase();
        }
        if (tag.type === 'timeframe') {
            return filters.since === tag.since;
        }
        if (tag.type === 'topic') {
            return filters.query === tag.query;
        }
        return false;
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

            {/* ── Quick Tags Strip Below Search Bar (Modern Single-Line Responsive) ── */}
            <div className="relative w-full overflow-hidden pt-0.5 pb-0.5">
                {/* Edge fade indicators for touch scroll on small devices */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#0A0A0C] to-transparent z-10 sm:hidden" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0A0A0C] to-transparent z-10 sm:hidden" />

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap py-1 px-0.5 select-none touch-pan-x">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1 font-semibold pr-1">
                        <Filter className="w-3 h-3 text-zinc-400" />
                        <span>Quick:</span>
                    </span>

                    {QUICK_TAGS.map((tag, idx) => {
                        const active = isTagActive(tag);
                        const Icon = tag.icon;
                        const isFirstTimeframe = tag.group === 'time' && QUICK_TAGS[idx - 1]?.group !== 'time';

                        return (
                            <React.Fragment key={tag.id}>
                                {isFirstTimeframe && (
                                    <div className="h-3.5 w-px bg-white/15 shrink-0 mx-1" aria-hidden="true" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleQuickTagClick(tag)}
                                    aria-pressed={active}
                                    aria-label={`Filter by ${tag.label}`}
                                    className={`group inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-mono font-medium transition-all duration-200 shrink-0 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 border backdrop-blur-md ${
                                        active
                                            ? tag.activeClasses
                                            : `bg-[#121215] hover:bg-white/[0.08] border-white/[0.08] ${tag.hoverBorder} text-zinc-300 hover:text-white shadow-xs`
                                    }`}
                                >
                                    {Icon ? (
                                        <Icon
                                            className={`w-3 h-3 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                                active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                                            }`}
                                            style={{ color: tag.color }}
                                        />
                                    ) : (
                                        <span
                                            className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200"
                                            style={{
                                                backgroundColor: tag.color,
                                                boxShadow: active ? `0 0 8px ${tag.color}` : 'none',
                                            }}
                                        />
                                    )}
                                    <span>{tag.label}</span>
                                    {active && <X className="w-3 h-3 opacity-70 hover:opacity-100 ml-0.5" />}
                                </button>
                            </React.Fragment>
                        );
                    })}

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={() => onFilterChange({ query: '', language: '', sort: 'stars', since: 'daily' })}
                            className="text-[11px] font-mono text-zinc-400 hover:text-white underline ml-auto shrink-0 transition-colors pl-2 cursor-pointer"
                        >
                            Reset
                        </button>
                    )}
                </div>
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
