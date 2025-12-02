
import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, CheckCircle, RotateCcw, Filter, User, Flame, SearchX, Star, ShieldCheck, Clock, Share2 } from 'lucide-react';
import { IsoItem } from '../types';

interface FeedProps {
    items: IsoItem[];
    activeCategory: string;
    onViewDetails: (id: number) => void;
    onCoSign: (id: number) => void;
}

const Feed: React.FC<FeedProps> = ({ items, activeCategory, onViewDetails, onCoSign }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('Priority'); // Default to Trust Priority
    const [filters, setFilters] = useState({
        category: activeCategory,
        minBudget: '',
        maxBudget: '',
        fundsVerified: false,
        finderAssigned: false
    });

    useEffect(() => {
        setFilters(prev => ({ ...prev, category: activeCategory }));
    }, [activeCategory]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleResetFilters = () => {
        setFilters({
            category: 'All',
            minBudget: '',
            maxBudget: '',
            fundsVerified: false,
            finderAssigned: false
        });
        setSearchTerm('');
        setSortOption('Priority');
    };

    // 1. Filtering Logic
    const filteredItems = items.filter(item => {
        const matchesCategory = filters.category === 'All' || item.category === filters.category;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBudget = (!filters.minBudget || item.topOffer >= parseInt(filters.minBudget)) &&
                            (!filters.maxBudget || item.topOffer <= parseInt(filters.maxBudget));
        const matchesFunds = !filters.fundsVerified || item.fundsVerified;
        const matchesFinder = !filters.finderAssigned || item.finder !== null;

        return matchesCategory && matchesSearch && matchesBudget && matchesFunds && matchesFinder;
    });

    // 2. Sorting Logic (Trust Score Priority)
    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortOption) {
            case 'Priority': // Trust Score Descending
                return (b.user.trustScore || 0) - (a.user.trustScore || 0);
            case 'Recent':
                return b.createdAt - a.createdAt;
            case 'Price: High':
                return b.topOffer - a.topOffer;
            case 'Price: Low':
                return a.topOffer - b.topOffer;
            case 'Popular':
                return b.upvotes - a.upvotes;
            default:
                return 0;
        }
    });

    const getDaysLeft = (createdAt: number, duration: number) => {
        const expirationDate = createdAt + (duration * 24 * 60 * 60 * 1000);
        const diff = expirationDate - Date.now();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    const handleShare = (e: React.MouseEvent, item: IsoItem) => {
        e.stopPropagation();
        // In a real app, this would copy to clipboard
        alert(`Link copied: iso.app/item/${item.id}`);
    };

    return (
        <div className="flex flex-col md:flex-row md:gap-8 pt-4">
            {/* Sidebar Filters */}
            <aside className="w-64 flex-shrink-0 hidden md:block font-filter sticky top-24 h-fit">
                <div className="space-y-8 pr-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2 font-mono">
                            <Filter className="w-3 h-3" /> Filters
                        </h3>
                        <button 
                            onClick={handleResetFilters}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center gap-1 group"
                        >
                            <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500" /> Reset
                        </button>
                    </div>
                    
                    {/* Categories */}
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">Sector</h4>
                        <div className="space-y-px bg-gray-100 border border-gray-100">
                            {['All', 'Sneakers', 'Archival Fashion', 'Collectibles', 'Watches'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleFilterChange('category', cat)}
                                    className={`w-full text-left text-xs font-bold uppercase py-2.5 px-3 transition-all flex items-center justify-between bg-white hover:bg-gray-50
                                        ${filters.category === cat 
                                            ? 'text-indigo-600 border-l-2 border-indigo-600' 
                                            : 'text-gray-500 border-l-2 border-transparent'}`}
                                >
                                    <span>{cat}</span>
                                    {filters.category === cat && <span className="text-indigo-600">●</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Budget */}
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">Budget Range</h4>
                        <div className="flex gap-2">
                            <div className="relative w-1/2">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono">$</span>
                                <input 
                                    type="number" 
                                    placeholder="MIN" 
                                    value={filters.minBudget}
                                    className="w-full bg-white border border-gray-200 focus:border-indigo-600 text-gray-900 py-2 pl-5 pr-2 text-xs font-mono outline-none rounded-none placeholder:text-gray-300"
                                    onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                                />
                            </div>
                            <div className="relative w-1/2">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono">$</span>
                                <input 
                                    type="number" 
                                    placeholder="MAX" 
                                    value={filters.maxBudget}
                                    className="w-full bg-white border border-gray-200 focus:border-indigo-600 text-gray-900 py-2 pl-5 pr-2 text-xs font-mono outline-none rounded-none placeholder:text-gray-300"
                                    onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">Verification</h4>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.fundsVerified ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                    {filters.fundsVerified && <CheckCircle className="w-3 h-3 text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={filters.fundsVerified}
                                    onChange={(e) => handleFilterChange('fundsVerified', e.target.checked)}
                                />
                                <span className="text-xs font-bold text-gray-600 uppercase">Funds Verified</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.finderAssigned ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                    {filters.finderAssigned && <CheckCircle className="w-3 h-3 text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={filters.finderAssigned}
                                    onChange={(e) => handleFilterChange('finderAssigned', e.target.checked)}
                                />
                                <span className="text-xs font-bold text-gray-600 uppercase">Finder Assigned</span>
                            </label>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Feed */}
            <div className="flex-1 min-w-0">
                {/* Search & Sort Bar */}
                <div className="flex items-center gap-0 border border-gray-200 mb-8 bg-white">
                    <div className="flex items-center justify-center pl-4 text-gray-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <input 
                        type="search" 
                        placeholder="SEARCH CATALOG (NAME, REFERENCE, ID)..." 
                        className="w-full px-4 py-3 bg-transparent text-sm font-bold placeholder:text-gray-300 focus:outline-none uppercase tracking-wide"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="border-l border-gray-200 px-4 py-3 bg-gray-50/50">
                        <select 
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-transparent text-xs font-bold text-gray-900 outline-none uppercase cursor-pointer"
                        >
                            <option value="Priority">Trust Priority</option>
                            <option value="Recent">Recent</option>
                            <option value="Price: High">Price: High</option>
                            <option value="Price: Low">Price: Low</option>
                            <option value="Popular">Popular</option>
                        </select>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                        Query Results: {filteredItems.length}
                    </p>
                    <div className="flex items-center gap-2">
                         {sortOption === 'Priority' && (
                             <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono flex items-center gap-1">
                                 <Star className="w-3 h-3 fill-amber-600" /> Trust Sorted
                             </span>
                         )}
                    </div>
                </div>

                {/* Grid */}
                {sortedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 pb-20">
                        {sortedItems.map(item => {
                            const daysLeft = getDaysLeft(item.createdAt, item.duration);
                            const isHighTrust = (item.user.trustScore || 0) > 85;

                            return (
                                <div 
                                    key={item.id} 
                                    onClick={() => onViewDetails(item.id)}
                                    className={`group cursor-pointer flex flex-col relative bg-white border border-gray-200 hover:border-indigo-600 transition-colors duration-300 ${isHighTrust ? 'order-first' : ''}`}
                                >
                                    {/* --- 1. Image Area (Gallery Look) --- */}
                                    <div 
                                        className="aspect-square bg-white relative overflow-hidden border-b border-gray-100 p-6 flex items-center justify-center group-hover:bg-gray-50 transition-colors"
                                    >
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.name} 
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        />
                                        
                                        {/* Avatar Stamp (Top Left) */}
                                        <div className="absolute top-3 left-3 z-20">
                                            <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden shadow-sm bg-gray-50 group-hover:border-indigo-600 transition-colors">
                                                <img src={item.user.avatar} className="w-full h-full object-cover" />
                                            </div>
                                        </div>

                                        {/* Verified Badge (Top Right) */}
                                        {isHighTrust && (
                                            <div className="absolute top-3 right-3 z-20">
                                                <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm px-2 py-1 flex items-center gap-1.5 rounded-sm">
                                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                    <span className="text-[9px] font-bold text-gray-900 uppercase tracking-wide">Trusted</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* --- 2. Details --- */}
                                    <div className="flex flex-col flex-1">
                                        {/* Header */}
                                        <div className="p-4 bg-white flex flex-col gap-1">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{item.category}</p>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-gray-900 text-sm leading-snug font-swiss uppercase tracking-tight">
                                                    {item.name}
                                                </h3>
                                                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                                            </div>
                                        </div>

                                        {/* Structured Data Grid */}
                                        <div className="grid grid-cols-2 border-t border-gray-100 divide-x divide-gray-100">
                                            {/* Price Cell */}
                                            <div className="p-3 bg-gray-50/50">
                                                <p className="text-[9px] text-gray-400 font-mono uppercase tracking-wider mb-0.5">Top Offer</p>
                                                <p className="text-sm font-mono font-bold text-gray-900">${item.topOffer.toLocaleString()}</p>
                                            </div>
                                            
                                            {/* Expiration Cell (Moved here) */}
                                            <div className="p-3 bg-gray-50/50">
                                                <p className="text-[9px] text-gray-400 font-mono uppercase tracking-wider mb-0.5">Expires In</p>
                                                <div className={`text-sm font-mono font-bold flex items-center gap-1.5 ${daysLeft <= 3 ? 'text-red-600' : 'text-gray-900'}`}>
                                                    <Clock className="w-3 h-3" />
                                                    {daysLeft <= 0 ? 'Closed' : `${daysLeft} Days`}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center justify-between text-[10px] font-mono uppercase tracking-wide mt-auto">
                                            <span className="text-gray-900 font-extrabold truncate max-w-[100px]">{item.user.name}</span>
                                            
                                            <div className="flex items-center gap-3">
                                                {/* Share Button */}
                                                <button 
                                                    onClick={(e) => handleShare(e, item)}
                                                    className="flex items-center gap-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                                    title="Share"
                                                >
                                                    <Share2 className="w-3.5 h-3.5" />
                                                </button>

                                                {/* Co-Sign Button */}
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onCoSign(item.id); }}
                                                    className="flex items-center gap-1 group/cosign"
                                                    title="Co-Sign (Upvote)"
                                                >
                                                    <Flame className={`w-3.5 h-3.5 ${item.upvotes > 0 ? 'text-indigo-600 fill-indigo-600' : 'text-gray-300 group-hover/cosign:text-indigo-600'}`} />
                                                    <span className={`font-bold ${item.upvotes > 0 ? 'text-indigo-600' : 'text-gray-400 group-hover/cosign:text-indigo-600'}`}>{item.upvotes}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 px-4 bg-gray-50 border border-dashed border-gray-200 text-center">
                        <SearchX className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-swiss uppercase">No Listings Found</h3>
                        <button 
                            onClick={handleResetFilters}
                            className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all"
                        >
                            Reset Catalog
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
