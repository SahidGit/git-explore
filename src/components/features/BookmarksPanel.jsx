import React, { useState, useEffect } from 'react';
import { Search, Trash2, ExternalLink, FileText } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { formatNumber } from '../../utils/formatters';

const BookmarksPanel = ({ onRepoClick, onBookmarkToggle }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadBookmarks();
    }, []);

    const loadBookmarks = () => {
        setBookmarks(storageService.getBookmarks());
    };

    const handleRemove = (e, repo) => {
        e.stopPropagation();
        onBookmarkToggle(repo);
        // Refresh local state immediately
        setBookmarks(prev => prev.filter(b => b.id !== repo.id));
    };

    const filteredBookmarks = bookmarks.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (bookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-slate-800/50 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No bookmarks yet</h3>
                <p className="text-slate-400 max-w-md">
                    Start exploring and bookmark repositories to save them here for later access.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-white">Your Bookmarks ({bookmarks.length})</h2>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search bookmarks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarks.map((repo) => {
                    const note = storageService.getNote(repo.id);

                    return (
                        <div
                            key={repo.id}
                            className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/60 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                            onClick={() => onRepoClick(repo)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={repo.owner.avatar_url}
                                        alt={repo.owner.login}
                                        className="w-10 h-10 rounded-full border border-slate-600"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-blue-400 group-hover:text-blue-300 truncate max-w-[160px]">
                                            {repo.name}
                                        </h3>
                                        <p className="text-xs text-slate-400">{repo.owner.login}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleRemove(e, repo)}
                                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                    title="Remove bookmark"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-slate-300 text-sm mb-4 line-clamp-2 flex-grow">
                                {repo.description || 'No description available'}
                            </p>

                            {note && (
                                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <div className="flex items-center gap-2 text-xs text-yellow-500 font-medium mb-1">
                                        <FileText className="w-3 h-3" />
                                        Note
                                    </div>
                                    <p className="text-xs text-slate-300 line-clamp-2 italic">"{note}"</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-700/50 mt-auto">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                        {repo.language || 'Unknown'}
                                    </span>
                                    <span>{formatNumber(repo.stargazers_count)} stars</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BookmarksPanel;
