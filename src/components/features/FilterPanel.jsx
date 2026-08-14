import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Search, ChevronDown, Code, SlidersHorizontal, CalendarDays, Star, X
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
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 select-none whitespace-nowrap ${
                    disabled
                        ? 'opacity-40 cursor-not-allowed bg-[#121215] border-white/[0.06] text-zinc-500'
                        : open
                        ? 'bg-[#16161A] border-white/20 text-white'
                        : 'bg-[#121215] border-white/[0.08] text-zinc-300 hover:border-white/20 hover:text-white'
                }`}
            >
                {Icon && <Icon className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" strokeWidth={1.5} />}
                <span className={selected ? 'text-white' : ''}>{displayLabel}</span>
                <ChevronDown
                    className={`w-3 h-3 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    className="absolute top-full left-0 mt-2 min-w-[160px] bg-[#16161A] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden py-1"
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
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-left transition-colors duration-150 ${
                                value === opt.value
                                    ? 'text-white bg-white/[0.06]'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            {opt.icon && (
                                <span className="text-zinc-500 font-mono text-[11px] w-4 text-center">
                                    {opt.icon}
                                </span>
                            )}
                            {opt.label}
                            {value === opt.value && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
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
    const hasActiveFilters = filters.language || filters.sort !== 'stars' || filters.since !== 'daily';

    return (
        <div className="mb-6 space-y-3">
            {/* ── Search bar ── */}
            <div className="relative group">
                <Search
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 pointer-events-none ${
                        focused ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                />
                <input
                    id="repo-search"
                    type="text"
                    placeholder="Search repositories..."
                    value={filters.query}
                    onChange={(e) => setFilter('query', e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="Search repositories"
                    className={`w-full bg-[#121215]/80 backdrop-blur-md border rounded-xl pl-10 pr-20 py-3 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-200 ${
                        focused
                            ? 'border-white/25 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]'
                            : 'border-white/[0.08] hover:border-white/15'
                    }`}
                />
                {/* Right-side decorators */}
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {filters.query ? (
                        <button
                            onClick={clearSearch}
                            className="p-0.5 text-zinc-500 hover:text-white transition-colors duration-150 rounded"
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

            {/* ── Filter pills row ── */}
            <div className="flex flex-wrap items-center gap-2">
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

                {/* Active filter count badge */}
                {hasActiveFilters && (
                    <button
                        onClick={() =>
                            onFilterChange({ ...filters, language: '', sort: 'stars', since: 'daily' })
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[11px] font-mono text-zinc-500 hover:text-white hover:border-white/20 transition-all duration-200"
                        aria-label="Reset filters"
                    >
                        <X className="w-3 h-3" />
                        Reset
                    </button>
                )}

                {/* Results count — injected by parent if needed via slot */}
                <div className="ml-auto hidden sm:flex items-center gap-1.5">
                    {filters.query && (
                        <span className="text-[11px] font-mono text-zinc-600">
                            Searching: <span className="text-zinc-400">&quot;{filters.query}&quot;</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
