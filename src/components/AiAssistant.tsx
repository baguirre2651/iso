
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Maximize2, Minimize2, Zap } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

// --- Markdown Rendering Logic ---

const FormatInline = ({ text }: { text: string }) => {
    // Split by bold (**), italic (*), and code (`)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
                if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic">{part.slice(1, -1)}</em>;
                if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="bg-gray-100 text-indigo-600 px-1 py-0.5 rounded text-[0.9em] font-mono border border-gray-200 break-all">{part.slice(1, -1)}</code>;
                return part;
            })}
        </>
    );
};

const BlockRenderer: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    const sections: any[] = [];
    let currentList: string[] = [];
    let isOrdered = false;

    const flushList = () => {
        if (currentList.length > 0) {
            sections.push({ type: isOrdered ? 'ol' : 'ul', items: [...currentList] });
            currentList = [];
        }
    };

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) {
            flushList();
            return;
        }

        const isBullet = /^[-*]\s/.test(trimmed);
        const isNumber = /^\d+\.\s/.test(trimmed);

        if (isBullet || isNumber) {
            // Check if we need to switch list types
            if (currentList.length > 0) {
                if ((isOrdered && !isNumber) || (!isOrdered && isNumber)) {
                    flushList();
                }
            }
            
            isOrdered = isNumber;
            // Remove the bullet/number marker
            const cleanLine = trimmed.replace(/^([-*]|\d+\.)\s+/, '');
            currentList.push(cleanLine);
        } else {
            flushList();
            sections.push({ type: 'p', text: trimmed });
        }
    });

    flushList();

    return (
        <div className="space-y-2">
            {sections.map((section, idx) => {
                if (section.type === 'p') {
                    return <p key={idx}><FormatInline text={section.text} /></p>;
                }
                if (section.type === 'ul' || section.type === 'ol') {
                    const Tag = section.type;
                    return (
                        <Tag key={idx} className={`pl-5 space-y-1 ${section.type === 'ul' ? 'list-disc' : 'list-decimal'} ml-1`}>
                            {section.items.map((item: string, i: number) => (
                                <li key={i}><FormatInline text={item} /></li>
                            ))}
                        </Tag>
                    );
                }
                return null;
            })}
        </div>
    );
};

const MarkdownRenderer: React.FC<{ content: string, isUser: boolean }> = ({ content, isUser }) => {
    if (isUser) {
        return <div className="whitespace-pre-wrap font-medium break-words">{content}</div>;
    }

    // Split by Code Blocks first (```)
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="text-sm leading-relaxed space-y-3 break-words">
            {parts.map((part, index) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                    const codeContent = part.replace(/^```.*\n?/, '').replace(/```$/, '');
                    return (
                        <div key={index} className="bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto font-mono text-xs my-2 border border-gray-700 shadow-sm">
                            <pre>{codeContent}</pre>
                        </div>
                    );
                }
                return <BlockRenderer key={index} text={part} />;
            })}
        </div>
    );
};

// --- Main Component ---

const AiAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'model', text: "Hi! I'm your ISO Guide. How can I help you find something today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const MAX_CHARS = 500;

    const suggestions = [
        "How do I verify a seller?",
        "Help me find a Rolex",
        "Safe payment tips",
        "How does the platform work?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await chatWithAssistant(textToSend);
            const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat error", error);
            const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: "I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center gap-2 group"
            >
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold pl-0 group-hover:pl-2">Ask AI</span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col transition-all duration-300 ${isExpanded ? 'w-[90vw] h-[80vh] md:w-[600px] md:h-[700px]' : 'w-[90vw] h-[500px] max-w-[380px]'}`}>
            {/* Header */}
            <div className="p-4 bg-indigo-600 text-white rounded-t-2xl flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm font-swiss">ISO Guide</h3>
                        <p className="text-xs text-indigo-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                            Gemini 2.5 Flash
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors">
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar min-h-0">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                            max-w-[85%] rounded-2xl p-3.5 break-words
                            ${msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'}
                        `}>
                            <MarkdownRenderer content={msg.text} isUser={msg.role === 'user'} />
                        </div>
                    </div>
                ))}
                
                {messages.length === 1 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {suggestions.map((s, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleSend(s)}
                                className="text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 p-2 rounded-xl text-left transition-colors font-medium flex items-center gap-1"
                            >
                                <Zap className="w-3 h-3" /> {s}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                            <span className="text-xs text-gray-500 font-medium">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 rounded-b-2xl shrink-0">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask anything..."
                        maxLength={MAX_CHARS}
                        rows={isExpanded ? 2 : 1}
                        className="w-full pl-4 pr-12 py-3 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl text-sm transition-all outline-none font-medium text-gray-900 resize-none custom-scrollbar max-h-32"
                    />
                    <button 
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-right mt-1">
                    <span className={`text-[10px] font-medium ${input.length >= MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
                        {input.length}/{MAX_CHARS}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AiAssistant;
