
import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, CheckCircle, ArrowUpCircle, Sparkles, Share2, Link as LinkIcon, X, Globe, ExternalLink, AlertCircle, CheckSquare, Shield, Flame, MessageSquare, Send, Clock, Save, Lock, Fingerprint, ChevronRight, Wallet, UserCheck, AlertTriangle, Printer } from 'lucide-react';
import { IsoItem, Bid, User } from '../types';
import { getMarketInsights, MarketInsightResult } from '../services/geminiService';
import { startConversation } from '../services/chatService';

interface DetailViewProps {
    itemId: number;
    items: IsoItem[];
    currentUser: User | null;
    onBack: () => void;
    onNavigate: (view: string) => void;
    onCoSign: (id: number) => void;
    onAddComment: (id: number, text: string) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, newTopOffer: number) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ itemId, items, currentUser, onBack, onNavigate, onCoSign, onAddComment, onDelete, onEdit }) => {
    const item = items.find(i => i.id === itemId);
    const [insights, setInsights] = useState<MarketInsightResult | null>(null);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    
    // Flow States
    const [connectionSuccess, setConnectionSuccess] = useState<Bid | null>(null);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [proposalSentSuccess, setProposalSentSuccess] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Form State
    const [offerPrice, setOfferPrice] = useState('');
    const [offerMessage, setOfferMessage] = useState('');
    
    // Comment State
    const [newComment, setNewComment] = useState('');
    
    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editOffer, setEditOffer] = useState(item ? item.topOffer.toString() : '');

    // Seriousness Checks
    const [checkPossession, setCheckPossession] = useState(false);
    const [checkOffPlatform, setCheckOffPlatform] = useState(false);
    const [checkIdentity, setCheckIdentity] = useState(false);

    if (!item) return <div>Item not found</div>;

    const isOwner = currentUser?.id === item.user.id;
    const canSubmit = offerPrice && offerMessage && checkPossession && checkOffPlatform && checkIdentity;
    const checksCompleted = [checkPossession, checkOffPlatform, checkIdentity].filter(Boolean).length;

    const daysLeft = Math.ceil((item.createdAt + (item.duration * 86400000) - Date.now()) / 86400000);
    const isExpired = daysLeft <= 0;

    const handleGetInsights = async () => {
        setIsLoadingInsights(true);
        const data = await getMarketInsights(item.name);
        setInsights(data);
        setIsLoadingInsights(false);
    };

    const handleConnect = (bid: Bid) => {
        setConnectionSuccess(bid);
    };

    const handleSubmitProposal = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser || !canSubmit) return;

        // Construct the message
        const fullMessage = `OFFICIAL PROPOSAL: $${offerPrice}\n\n${offerMessage}\n\n[x] Verified Possession/Funds\n[x] Accepted Off-Platform Terms`;

        // Send to Chat Service
        startConversation(item, currentUser, item.user, fullMessage);

        // UX: Show success state ON PAGE instead of redirecting
        setShowProposalModal(false);
        setProposalSentSuccess(true);
        
        // Reset form
        setOfferPrice('');
        setOfferMessage('');
        setCheckPossession(false);
        setCheckOffPlatform(false);
        setCheckIdentity(false);
    };

    const handleShare = () => {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
    };

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if(newComment.trim()) {
            onAddComment(item.id, newComment);
            setNewComment('');
        }
    };

    const handleSaveEdit = () => {
        onEdit(item.id, parseInt(editOffer) || 0);
        setIsEditing(false);
    }

    return (
        <div className="animate-fade-in pb-20 relative font-swiss">
            {/* Share Toast */}
            {showShareToast && (
                <div className="fixed top-24 right-6 bg-gray-900 text-white px-6 py-4 rounded-none shadow-xl z-50 animate-fade-in flex items-center gap-3">
                    <LinkIcon className="w-4 h-4" />
                    <p className="font-bold text-sm uppercase tracking-wider">Link Copied</p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm border-2 border-red-100 shadow-2xl p-6 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 uppercase font-swiss mb-2">Delete ISO?</h3>
                        <p className="text-gray-500 mb-8 text-sm">
                            This action cannot be undone. This hunt will be permanently removed from the bulletin board.
                        </p>
                        <div className="space-y-3">
                            <button 
                                onClick={() => onDelete(item.id)} 
                                className="w-full py-3 bg-red-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-colors"
                            >
                                Yes, Delete It
                            </button>
                            <button 
                                onClick={() => setShowDeleteConfirm(false)} 
                                className="w-full py-3 bg-white border border-gray-200 text-gray-900 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Proposal Success Modal */}
            {proposalSentSuccess && (
                <div className="fixed inset-0 z-50 bg-indigo-900/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm border border-gray-200 shadow-2xl p-8 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 uppercase font-swiss mb-2">Proposal Transmitted</h3>
                        <p className="text-gray-500 mb-8 text-sm">Your offer has been sent to {item.user.name}. You will be notified when they reply.</p>
                        <div className="space-y-3">
                            <button onClick={() => onNavigate('messages-view')} className="w-full py-3 bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-indigo-700 transition-colors">
                                Go to Inbox
                            </button>
                            <button onClick={() => setProposalSentSuccess(false)} className="w-full py-3 bg-white border border-gray-200 text-gray-900 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Nav */}
            <div className="flex justify-between items-center mb-8 pt-4 border-b border-gray-100 pb-4">
                <button onClick={onBack} className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 font-bold uppercase tracking-wider text-xs group transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><span>Back to Catalog</span>
                </button>
                
                <div className="flex items-center space-x-4">
                    <button onClick={handleShare} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Share">
                        <Share2 className="w-4 h-4" />
                    </button>
                    {isOwner && (
                        <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
                            <button onClick={() => setIsEditing(!isEditing)} className="text-gray-400 hover:text-gray-900 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                                <Edit className="w-4 h-4" /> Edit
                            </button>
                            <button onClick={() => setShowDeleteConfirm(true)} className="text-gray-400 hover:text-red-600 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Image Section (Lot View) */}
                <div className="lg:col-span-7">
                    <div className="bg-gray-50 border border-gray-200 p-8 flex items-center justify-center relative min-h-[500px]">
                         {/* Expiration Visual */}
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
                             <div className={`px-3 py-1.5 border flex items-center gap-2 ${isExpired ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600'}`}>
                                <Clock className="w-3 h-3" />
                                <span className="text-[10px] font-bold font-mono uppercase tracking-widest">
                                    {isExpired ? 'Expired' : `${daysLeft} Days Left`}
                                </span>
                             </div>
                        </div>

                        <img src={item.imageUrl} alt={item.name} className={`max-h-[500px] w-full object-contain ${isExpired ? 'grayscale opacity-50' : ''}`} />
                    </div>
                    
                    {/* Gemini Insights - Raw Style */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        {!insights ? (
                            <button 
                                onClick={handleGetInsights}
                                disabled={isLoadingInsights}
                                className="w-full py-4 border border-dashed border-indigo-200 text-indigo-600 font-bold uppercase tracking-wider text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Printer className={`w-4 h-4 ${isLoadingInsights ? 'animate-pulse' : ''}`} />
                                <span>{isLoadingInsights ? 'Analyzing Market Data...' : 'Print Market Report'}</span>
                            </button>
                        ) : (
                            <div className="bg-indigo-50/50 border border-indigo-100 p-6">
                                <h4 className="font-bold text-indigo-900 flex items-center gap-2 mb-4 text-xs uppercase tracking-widest font-mono">
                                    <Globe className="w-3 h-3" /> Market Analysis
                                </h4>
                                <p className="text-sm text-gray-800 leading-relaxed font-serif">{insights.text}</p>
                                
                                {insights.sources && insights.sources.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-indigo-100/50 flex flex-wrap gap-3">
                                        {insights.sources.map((source, idx) => (
                                            <a 
                                                key={idx} 
                                                href={source.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-600 hover:text-indigo-800 border-b border-indigo-200 hover:border-indigo-600 transition-colors pb-0.5"
                                            >
                                                <ExternalLink className="w-3 h-3" /> {source.title}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Community Intel (Comments) */}
                    <div className="mt-12">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-6 text-sm uppercase tracking-widest font-mono border-b border-gray-200 pb-2">
                            <MessageSquare className="w-4 h-4" /> Community Intel ({item.commentsList.length})
                        </h4>
                        
                        <div className="space-y-6">
                            {item.commentsList.length > 0 ? (
                                item.commentsList.map(comment => (
                                    <div key={comment.id} className="flex gap-4">
                                        <img src={comment.user.avatar} className="w-8 h-8 rounded-none border border-gray-200" />
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-xs text-gray-900 uppercase tracking-wide">{comment.user.name}</span>
                                                <span className="text-[10px] text-gray-400 font-mono">{new Date(comment.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 font-medium">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm italic">No intelligence gathered yet.</p>
                            )}
                        </div>

                        {/* Add Comment */}
                        <form onSubmit={handlePostComment} className="mt-8 flex gap-4">
                            <img src={currentUser?.avatar || 'https://via.placeholder.com/32'} className="w-8 h-8 rounded-none border border-gray-200 opacity-50" />
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add intelligence (e.g. 'Seen at NYC Pop-up', 'Watch out for fakes')..." 
                                    className="w-full bg-gray-50 border-b border-gray-300 px-0 py-2 text-sm focus:outline-none focus:border-indigo-600 transition-colors placeholder:text-gray-400 placeholder:italic"
                                />
                                <div className="flex justify-end mt-2">
                                    <button disabled={!newComment.trim()} type="submit" className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 disabled:opacity-0 transition-all">
                                        Post Intel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info Section (Spec Sheet) */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-6">
                            <img src={item.user.avatar} className="w-12 h-12 rounded-full border border-gray-200 p-0.5" />
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Requested By</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 text-lg">{item.user.name}</span>
                                </div>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase leading-[0.9] tracking-tight mb-8">{item.name}</h1>
                        
                        {/* Data Table */}
                        <div className="border border-gray-200">
                            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                                <div className="p-4">
                                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-1">Target Price</p>
                                    {isEditing ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 font-mono text-lg">$</span>
                                            <input 
                                                type="number" 
                                                value={editOffer} 
                                                onChange={(e) => setEditOffer(e.target.value)}
                                                className="w-full border-b border-indigo-600 font-mono text-xl font-bold focus:outline-none"
                                            />
                                            <button onClick={handleSaveEdit}><Save className="w-4 h-4 text-green-600" /></button>
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-mono font-bold text-gray-900">${item.topOffer.toLocaleString()}</p>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col justify-between">
                                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-1">Demand Signal</p>
                                    <button 
                                        onClick={() => onCoSign(item.id)}
                                        className="flex items-center gap-2 group hover:opacity-80 transition-opacity w-fit"
                                    >
                                        <Flame className={`w-5 h-5 ${item.upvotes > 0 ? 'text-indigo-600 fill-indigo-600' : 'text-gray-300'}`} />
                                        <span className="text-xl font-mono font-bold text-gray-900">{item.upvotes}</span>
                                        <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 ml-2 group-hover:bg-indigo-100 transition-colors">Co-Sign</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-1">User Status</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${item.fundsVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <span className="text-sm font-bold text-gray-900 uppercase">
                                        {item.fundsVerified ? 'Identity Verified' : 'Unverified User'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 font-mono border-l-2 border-indigo-600 pl-3">Specifications</h3>
                        <p className="text-gray-600 leading-relaxed font-serif text-lg">{item.details}</p>
                    </div>

                    {/* Action Area */}
                    <div className="pt-4">
                        {isOwner ? (
                            <div className="border border-indigo-100 bg-white p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-4">Messages</h3>
                                {item.bids && item.bids.length > 0 ? (
                                    <div className="space-y-3">
                                        {item.bids.map((bid) => (
                                            <div key={bid.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden"><img src={bid.user.avatar} /></div>
                                                    <div>
                                                        <p className="font-bold text-sm">{bid.user.name}</p>
                                                        <p className="font-mono text-xs text-green-600 font-bold">${bid.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleConnect(bid)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-700">Reply</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-400 text-xs uppercase font-mono">
                                        No messages yet...
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <button 
                                    disabled={isExpired}
                                    onClick={() => setShowProposalModal(true)}
                                    className="w-full py-4 bg-indigo-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-indigo-500 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {isExpired ? 'Listing Expired' : 'Submit Official Proposal'}
                                </button>
                                {!isExpired && (
                                    <div className="flex items-center gap-2 justify-center text-gray-400">
                                        <AlertCircle className="w-4 h-4" />
                                        <p className="text-center text-[10px] font-mono uppercase">
                                            Transactions occur off-platform
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Proposal Form Modal - REDESIGNED */}
            {showProposalModal && (
                <div className="fixed inset-0 z-50 bg-[#0f172a]/95 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg shadow-[0_0_50px_rgba(79,70,229,0.2)] animate-fade-in relative overflow-hidden flex flex-col max-h-[90vh]">
                        
                        {/* Technical Header */}
                        <div className="bg-indigo-900 text-white p-5 shrink-0 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 text-indigo-300 mb-1">
                                    <Lock className="w-3 h-3" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest">Secure Transmission</span>
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight font-swiss">Submit Official Offer</h3>
                            </div>
                            <button onClick={() => setShowProposalModal(false)} className="text-indigo-300 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitProposal} className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-6 space-y-8">
                                {/* Section 1: The Offer */}
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[9px]">1</span> Financials
                                    </h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-900 mb-2">Offer Amount ($)</label>
                                            <input 
                                                type="number" 
                                                required 
                                                value={offerPrice}
                                                onChange={(e) => setOfferPrice(e.target.value)}
                                                className="w-full pb-2 bg-transparent border-b-2 border-gray-200 focus:border-indigo-600 outline-none font-mono text-xl font-bold text-gray-900 placeholder:text-gray-300 transition-colors rounded-none" 
                                                placeholder="0.00" 
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-900 mb-2">Condition / Spec</label>
                                            <input 
                                                type="text" 
                                                required 
                                                className="w-full pb-2 bg-transparent border-b-2 border-gray-200 focus:border-indigo-600 outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300 transition-colors rounded-none" 
                                                placeholder="e.g. Size 10, Box Included" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: The Message */}
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[9px]">2</span> Private Message
                                    </h4>
                                    <textarea 
                                        rows={3} 
                                        required 
                                        value={offerMessage}
                                        onChange={(e) => setOfferMessage(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-indigo-600 focus:bg-white outline-none text-sm text-gray-900 placeholder:text-gray-400 transition-colors rounded-none resize-none" 
                                        placeholder="I have verified this item. I am ready to transact via..."
                                    ></textarea>
                                </div>

                                {/* Section 3: Compliance - REDESIGNED */}
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[9px]">3</span> Verification Protocol
                                    </h4>
                                    
                                    <div className="grid gap-3">
                                        <div 
                                            onClick={() => setCheckPossession(!checkPossession)}
                                            className={`p-4 border cursor-pointer transition-all flex items-start gap-3 group ${checkPossession ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className={`mt-0.5 shrink-0 transition-colors ${checkPossession ? 'text-indigo-600' : 'text-gray-300'}`}>
                                                <Wallet className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold uppercase mb-1 transition-colors ${checkPossession ? 'text-indigo-900' : 'text-gray-900'}`}>Proof of Readiness</p>
                                                <p className="text-[10px] text-gray-500 leading-relaxed">I have the item in hand (or funds ready) and can prove it immediately.</p>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 border rounded-sm flex items-center justify-center ${checkPossession ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                                {checkPossession && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => setCheckOffPlatform(!checkOffPlatform)}
                                            className={`p-4 border cursor-pointer transition-all flex items-start gap-3 group ${checkOffPlatform ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className={`mt-0.5 shrink-0 transition-colors ${checkOffPlatform ? 'text-indigo-600' : 'text-gray-300'}`}>
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold uppercase mb-1 transition-colors ${checkOffPlatform ? 'text-indigo-900' : 'text-gray-900'}`}>Platform Agnostic</p>
                                                <p className="text-[10px] text-gray-500 leading-relaxed">I understand ISO connects us, but the deal happens off-app (PayPal, Grailed, etc).</p>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 border rounded-sm flex items-center justify-center ${checkOffPlatform ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                                {checkOffPlatform && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => setCheckIdentity(!checkIdentity)}
                                            className={`p-4 border cursor-pointer transition-all flex items-start gap-3 group ${checkIdentity ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className={`mt-0.5 shrink-0 transition-colors ${checkIdentity ? 'text-indigo-600' : 'text-gray-300'}`}>
                                                <UserCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold uppercase mb-1 transition-colors ${checkIdentity ? 'text-indigo-900' : 'text-gray-900'}`}>Identity Check</p>
                                                <p className="text-[10px] text-gray-500 leading-relaxed">I agree to a FaceTime or ID check if requested by the other party.</p>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 border rounded-sm flex items-center justify-center ${checkIdentity ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                                {checkIdentity && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <button 
                                    type="submit" 
                                    disabled={!canSubmit}
                                    className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-500 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none border border-black flex items-center justify-center gap-3"
                                >
                                    <span>{canSubmit ? 'Transmit Proposal' : `${checksCompleted}/3 Checks Completed`}</span>
                                    {canSubmit && <ChevronRight className="w-4 h-4" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailView;
