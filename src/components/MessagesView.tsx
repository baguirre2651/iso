
import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Paperclip, Send, Archive, Trash2, Inbox, RotateCcw, AlertTriangle, Shield, Star, ScanLine, X, Lock } from 'lucide-react';
import { User } from '../types';
import { getThreads, saveThread, updateThreadStatus, Thread, Message } from '../services/chatService';

interface MessagesViewProps {
    currentUser: User;
    initialItemName?: string | null;
}

const MessagesView: React.FC<MessagesViewProps> = ({ currentUser, initialItemName }) => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [folder, setFolder] = useState<'active' | 'archived' | 'deleted'>('active');
    
    // Profile Modal State
    const [viewingProfile, setViewingProfile] = useState<Thread['user'] | null>(null);

    // Load threads
    useEffect(() => {
        const loadedThreads = getThreads();
        setThreads(loadedThreads);

        // Auto-select chat based on prop if provided
        if (initialItemName) {
            const targetThread = loadedThreads.find(t => t.item === initialItemName);
            if (targetThread) {
                setActiveChat(targetThread.id);
                // Ensure we are in the right folder to see it
                setFolder(targetThread.status); 
            }
        }
    }, [initialItemName]);

    // Filter threads by current folder
    const visibleThreads = threads.filter(t => t.status === folder);
    const activeThread = threads.find(t => t.id === activeChat);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !activeThread) return;

        const newMessage: Message = { 
            id: Date.now(), 
            sender: 'me', 
            text: input, 
            time: 'Just now' 
        };

        const updatedThreads = threads.map(t => {
            if (t.id === activeChat) {
                return {
                    ...t,
                    messages: [...t.messages, newMessage],
                    lastMessage: input,
                    time: 'Just now',
                    status: 'active' as const // Moving a chat moves it back to active if it was archived
                };
            }
            return t;
        });

        setThreads(updatedThreads);
        saveThread(updatedThreads);
        setInput('');
    };

    const handleAction = (action: 'archive' | 'delete' | 'restore' | 'destroy') => {
        if (!activeChat) return;
        
        let newStatus: 'active' | 'archived' | 'deleted' | 'destroyed';
        
        switch (action) {
            case 'archive': newStatus = 'archived'; break;
            case 'delete': newStatus = 'deleted'; break;
            case 'restore': newStatus = 'active'; break;
            case 'destroy': newStatus = 'destroyed'; break;
        }

        const updated = updateThreadStatus(activeChat, newStatus);
        setThreads(updated);
        setActiveChat(null); // Deselect after action
    };

    // --- Profile Modal (Read Only Passport) ---
    const ProfileModal = ({ user, onClose }: { user: Thread['user'], onClose: () => void }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#fdfbf7] w-full max-w-md rounded-[20px] shadow-2xl relative overflow-hidden border border-gray-200">
                {/* Security Background */}
                <div className="absolute inset-0 z-0 opacity-60 pointer-events-none" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(99, 102, 241, 0.03) 10px, rgba(99, 102, 241, 0.03) 11px)`
                }}></div>
                
                {/* Header */}
                <div className="relative z-10 px-6 py-4 bg-[#0B1E3D] text-white border-b-[3px] border-[#D4AF37] flex justify-between items-center">
                    <div>
                        <h3 className="font-serif text-lg font-bold tracking-[0.1em]">IDENTITY CHECK</h3>
                        <p className="font-mono text-[9px] text-[#D4AF37] tracking-widest uppercase">Verified Credential</p>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-white/70 hover:text-white" /></button>
                </div>

                <div className="p-6 relative z-10">
                    {/* Trust Stamp */}
                    <div className="absolute right-6 top-6 z-30 transform rotate-[-12deg] mix-blend-multiply opacity-90">
                        <div className={`w-20 h-20 rounded-full border-4 border-double flex flex-col items-center justify-center ${
                             (user.trustScore || 0) >= 80 ? 'border-emerald-600 text-emerald-700 bg-emerald-100/20' : 'border-amber-600 text-amber-700 bg-amber-100/20'
                        }`}>
                            <p className="text-[7px] font-black uppercase">Verified</p>
                            <p className="text-2xl font-black font-mono">{user.trustScore || 50}</p>
                            <p className="text-[6px] font-bold uppercase">Trust Score</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-24 h-32 bg-gray-200 rounded border-2 border-white shadow-md relative overflow-hidden shrink-0">
                            <img src={user.avatar} className="w-full h-full object-cover grayscale contrast-125" />
                            <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
                            <div className="absolute bottom-1 right-1 text-white/80"><ScanLine className="w-4 h-4" /></div>
                        </div>
                        <div className="flex-1 pt-1 space-y-3">
                            <div className="border-b border-gray-200 pb-1">
                                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Handle</p>
                                <p className="font-serif text-lg font-bold text-slate-900">{user.name}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-1">
                                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Role</p>
                                <p className="font-mono text-xs font-bold text-slate-700 uppercase">{user.role}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-1">
                                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Status</p>
                                <p className="font-mono text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                    {user.status}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Warning/Info */}
                    <div className="mt-6 bg-indigo-50 border border-indigo-100 p-3 rounded text-center">
                        <p className="text-[9px] text-indigo-800 font-mono uppercase tracking-wide">
                            Always verify ownership before payment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] bg-white border border-gray-200 flex animate-fade-in overflow-hidden shadow-sm relative font-swiss">
            
            {viewingProfile && <ProfileModal user={viewingProfile} onClose={() => setViewingProfile(null)} />}

            {/* Sidebar */}
            <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-white shrink-0">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Messages</h2>
                    
                    {/* Folder Tabs */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-4">
                        <button 
                            onClick={() => { setFolder('active'); setActiveChat(null); }}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1 ${folder === 'active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            <Inbox className="w-3 h-3" /> Inbox
                        </button>
                        <button 
                            onClick={() => { setFolder('archived'); setActiveChat(null); }}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1 ${folder === 'archived' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            <Archive className="w-3 h-3" /> Archive
                        </button>
                        <button 
                            onClick={() => { setFolder('deleted'); setActiveChat(null); }}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1 ${folder === 'deleted' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            <Trash2 className="w-3 h-3" /> Trash
                        </button>
                    </div>

                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search threads..." 
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-sm outline-none focus:border-indigo-600 transition-all placeholder:text-gray-400 rounded-none" 
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">
                    {visibleThreads.length > 0 ? (
                        visibleThreads.map(thread => (
                            <div 
                                key={thread.id}
                                onClick={() => setActiveChat(thread.id)}
                                className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${activeChat === thread.id ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="relative shrink-0">
                                    <img src={thread.user.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm truncate">{thread.user.name}</h4>
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase">{thread.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <p className="text-xs font-bold text-indigo-600 truncate font-mono uppercase tracking-wide">{thread.item}</p>
                                    </div>
                                    <p className={`text-sm truncate ${thread.unread > 0 ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'}`}>
                                        {thread.lastMessage}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 px-4">
                            <p className="text-xs text-gray-400 font-mono uppercase">Folder Empty</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {activeThread ? (
                <div className="hidden md:flex flex-1 flex-col bg-white">
                    {/* Header with Profile Link & Actions */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
                        <div 
                            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setViewingProfile(activeThread.user)}
                        >
                            <img src={activeThread.user.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                            <div>
                                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                    {activeThread.user.name}
                                    {activeThread.user.trustScore && activeThread.user.trustScore > 80 && (
                                        <Shield className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                                    )}
                                </h3>
                                <p className="text-xs text-indigo-600 font-mono uppercase tracking-wide font-bold">View Identity Passport</p>
                            </div>
                        </div>

                        {/* Context Actions */}
                        <div className="flex items-center gap-2">
                            {folder === 'active' && (
                                <>
                                    <button onClick={() => handleAction('archive')} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Archive Chat">
                                        <Archive className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleAction('delete')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Move to Trash">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                            {folder === 'archived' && (
                                <button onClick={() => handleAction('restore')} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Unarchive">
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            )}
                            {folder === 'deleted' && (
                                <>
                                    <button onClick={() => handleAction('restore')} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Restore">
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleAction('destroy')} className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors" title="Permanently Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Safety Disclaimer Banner */}
                    <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center gap-3 justify-center">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide font-mono">
                            Safety Alert: Never share passwords or credit card details directly in chat.
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
                        {activeThread.messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-1' : 'order-2'}`}>
                                    <div className={`p-4 text-sm font-medium leading-relaxed shadow-sm border whitespace-pre-wrap ${
                                        msg.sender === 'me' 
                                            ? 'bg-gray-900 text-white border-gray-900 rounded-2xl rounded-tr-none' 
                                            : 'bg-white text-gray-900 border-gray-200 rounded-2xl rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                    <p className={`text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-wider ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input - Disabled if in Trash/Archive */}
                    {folder === 'active' ? (
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                <button type="button" className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-none focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 transition-all">
                                    <textarea 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                                        placeholder="Type your message..." 
                                        className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 text-sm font-medium resize-none max-h-32 placeholder:text-gray-400"
                                        rows={1}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={!input.trim()}
                                    className="p-3 bg-indigo-600 text-white rounded-none hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
                            <p className="text-xs text-gray-500 font-mono uppercase">
                                This conversation is {folder}. Restore it to continue chatting.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 text-center p-8">
                    <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Inbox className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-swiss">Select a conversation</h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                        Choose a thread from the sidebar. You can access archived and deleted messages from the tabs above.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MessagesView;
