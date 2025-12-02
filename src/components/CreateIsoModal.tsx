
import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, ArrowUp, Sparkles, Image as ImageIcon, ArrowRight, MessageSquare, RefreshCcw } from 'lucide-react';
import { IsoItem } from '../types';
import { uploadImage } from '../services/storageService';
import { chatForIsoCreation } from '../services/geminiService';

interface CreateIsoModalProps {
    onClose: () => void;
    onCreate: (item: IsoItem) => void;
}

interface Message {
    role: 'user' | 'model';
    text: string;
    image?: string;
}

const CreateIsoModal: React.FC<CreateIsoModalProps> = ({ onClose, onCreate }) => {
    // Mode: 'manual' (default) or 'chat' (AI assist)
    const [mode, setMode] = useState<'manual' | 'chat'>('manual');
    
    // Form State
    const [formData, setFormData] = useState<Partial<IsoItem>>({
        name: '',
        category: 'Sneakers',
        details: '',
        topOffer: 0,
        imageUrl: ''
    });
    const [manualImageFile, setManualImageFile] = useState<File | null>(null);

    // Chat State
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hi! I'm your Listing Agent. What are you hunting for today? You can describe it or upload a photo." }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [chatImage, setChatImage] = useState<string | null>(null); // Base64 for AI
    
    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const lastUploadedImageRef = useRef<string | null>(null); // Tracks last image seen in chat

    // --- Effects ---
    useEffect(() => {
        if (mode === 'chat') {
            scrollToBottom();
        }
    }, [messages, mode, isThinking]);

    const scrollToBottom = () => {
        // Immediate scroll attempt
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        // Backup timeout for layout shifts
        setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    // --- Actions: Chat ---

    const handleChatFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setChatImage(result);
                // Update ref immediately so we don't lose it if user sends text only next
                lastUploadedImageRef.current = result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = async () => {
        if ((!input.trim() && !chatImage) || isThinking) return;

        // Capture image before clearing state
        const currentImage = chatImage;
        if (currentImage) {
            lastUploadedImageRef.current = currentImage;
        }

        // 1. Add User Message
        const userMsg: Message = { role: 'user', text: input, image: currentImage || undefined };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setChatImage(null);
        
        // Immediate scrolling to show user message
        scrollToBottom(); 
        
        setIsThinking(true);

        try {
            // 2. Format History for Gemini API (exclude local-only props if needed, mostly just map roles)
            const apiHistory = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            // 3. Call AI
            const result = await chatForIsoCreation(apiHistory, userMsg.text, userMsg.image);

            // 4. Handle Response
            if (result.draft) {
                // AI is done, fill form
                setFormData(prev => ({
                    ...prev,
                    name: result.draft?.name,
                    category: result.draft?.category,
                    details: result.draft?.details,
                    topOffer: result.draft?.estimatedValue,
                    // Use the most recent image tracked by our Ref
                    imageUrl: lastUploadedImageRef.current || prev.imageUrl 
                }));
                setMode('manual'); // Switch back to form
            } else if (result.text) {
                setMessages(prev => [...prev, { role: 'model', text: result.text || "" }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I ran into an error. Please try manual entry." }]);
        } finally {
            setIsThinking(false);
            scrollToBottom();
        }
    };

    // --- Actions: Manual Form ---

    const handleManualImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setManualImageFile(file);
            // Show local preview immediately
            setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
            
            // In background, upload to real storage
            try {
                const url = await uploadImage(file);
                setFormData(prev => ({ ...prev, imageUrl: url }));
            } catch (err) {
                console.error("Upload failed", err);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem: IsoItem = {
            id: Date.now(),
            seekers: 1,
            joined: true,
            name: formData.name || "Untitled Hunt",
            details: formData.details || "No details provided",
            category: formData.category || "General",
            topOffer: Number(formData.topOffer) || 0,
            upvotes: 0,
            comments: 0,
            commentsList: [],
            imageUrl: formData.imageUrl || "https://placehold.co/600x400?text=No+Image",
            user: { id: 'me', name: '@currentUser', avatar: 'https://i.pravatar.cc/150?u=me' },
            fundsVerified: true,
            privateBids: 0,
            duration: 30,
            createdAt: Date.now(),
            finder: null
        };
        onCreate(newItem);
        onClose();
    };

    return (
        // Fixed max height relative to viewport to ensure internal scrolling always works
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col h-[600px] md:h-[650px] max-h-[85vh] animate-fade-in relative">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                <h3 className="font-bold text-gray-900 font-swiss">
                    {mode === 'chat' ? 'AI Listing Assistant' : 'Create New Hunt'}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
            </div>

            {/* --- MODE: CHAT --- */}
            {mode === 'chat' && (
                <div className="flex-1 flex flex-col bg-slate-50 min-h-0">
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scroll-smooth">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                }`}>
                                    {msg.image && (
                                        <img src={msg.image} className="w-full rounded-lg mb-2 max-h-48 object-cover border border-white/20" />
                                    )}
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        
                        {/* Real Typing Indicator Bubble */}
                        {isThinking && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-tl-none p-4 shadow-sm w-fit">
                                    <div className="typing-indicator flex gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                        {chatImage && (
                             <div className="mb-2 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                                <ImageIcon className="w-3 h-3" /> Image attached <button onClick={() => setChatImage(null)}><X className="w-3 h-3 hover:text-red-500" /></button>
                             </div>
                        )}
                        <div className="relative flex gap-2">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200"
                            >
                                <ImageIcon className="w-5 h-5" />
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleChatFileSelect} 
                            />
                            
                            <div className="flex-1 relative">
                                <input 
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm font-medium transition-all outline-none"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() && !chatImage}
                                    className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <button onClick={() => setMode('manual')} className="w-full mt-3 text-xs font-bold text-gray-400 hover:text-gray-600 py-2">
                            Switch to Manual Entry
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODE: MANUAL FORM --- */}
            {mode === 'manual' && (
                <div className="flex-1 flex flex-col bg-white overflow-hidden min-h-0">
                    {/* AI Callout */}
                    <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Sparkles className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-indigo-900">Want help filling this out?</p>
                                <p className="text-xs text-indigo-600">Chat with our AI to auto-fill details.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setMode('chat')}
                            className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            Start Chat
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Item Photo</label>
                            <div className="flex items-center gap-4">
                                <div className={`w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50 overflow-hidden relative group hover:border-indigo-400 transition-colors cursor-pointer`}>
                                    {formData.imageUrl && !formData.imageUrl.includes('placehold') ? (
                                        <>
                                            <img src={formData.imageUrl} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                                <RefreshCcw className="w-5 h-5 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <Upload className="w-6 h-6" />
                                    )}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleManualImageUpload} />
                                </div>
                                <div className="text-xs text-gray-500">
                                    <p className="font-bold text-gray-900 mb-1">Upload a reference photo</p>
                                    <p>Helps Finders identify the exact item.</p>
                                </div>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Item Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium transition-all"
                                    placeholder="e.g. Rolex Submariner 124060"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Max Offer ($)</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={formData.topOffer || ''} 
                                        onChange={(e) => setFormData({...formData, topOffer: parseInt(e.target.value)})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                                        placeholder="10000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                                    <select 
                                        value={formData.category} 
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                                    >
                                        <option>Sneakers</option>
                                        <option>Watches</option>
                                        <option>Archival Fashion</option>
                                        <option>Collectibles</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Details & Condition</label>
                                <textarea 
                                    rows={4}
                                    required
                                    value={formData.details} 
                                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all text-sm leading-relaxed"
                                    placeholder="Specify condition (e.g. New/Used), size, year, and box/papers requirements."
                                ></textarea>
                            </div>
                        </div>
                    </form>

                    <div className="p-4 border-t border-gray-100 shrink-0">
                        <button onClick={handleSubmit} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2">
                            Post Hunt <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateIsoModal;
