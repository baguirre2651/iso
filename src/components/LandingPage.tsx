
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, PlusCircle, Search, ShoppingBag, ScanEye, MessageSquare, ArrowUpRight, ScanLine, Globe, Unlock, Share2, Twitter, Instagram, Mail } from 'lucide-react';

interface LandingPageProps {
    onNavigate: (view: string, category?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const heroRef = useRef<HTMLDivElement>(null);
    const [typedText1, setTypedText1] = useState('');
    const [typedText2, setTypedText2] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    const fullText1 = "POST THE ";
    const fullText2 = "HUNT.";

    useEffect(() => {
        // Animation Trigger for Fade-ins
        setTimeout(() => {
            if (heroRef.current) {
                heroRef.current.classList.add('start-animation');
            }
        }, 100);

        // Typewriter Logic
        let timeout1: ReturnType<typeof setTimeout>;
        let timeout2: ReturnType<typeof setTimeout>;

        // Start typing part 1 after delay
        const startTyping = () => {
            let currentIndex1 = 0;
            const typePart1 = () => {
                if (currentIndex1 < fullText1.length) {
                    setTypedText1(fullText1.slice(0, currentIndex1 + 1));
                    currentIndex1++;
                    timeout1 = setTimeout(typePart1, 50); // Faster speed (was 100)
                } else {
                    // Part 1 done, start Part 2
                    setTimeout(() => {
                        let currentIndex2 = 0;
                        const typePart2 = () => {
                            if (currentIndex2 < fullText2.length) {
                                setTypedText2(fullText2.slice(0, currentIndex2 + 1));
                                currentIndex2++;
                                timeout2 = setTimeout(typePart2, 80); // Faster speed (was 150)
                            }
                        };
                        typePart2();
                    }, 200); // Shorter pause between lines
                }
            };
            typePart1();
        };

        const initialDelay = setTimeout(startTyping, 300);

        return () => {
            clearTimeout(initialDelay);
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, []);

    // Blinking cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    const categories = [
        { name: "Sneakers", img: "images/jordan1.png", count: "124 Active" },
        { name: "Archival Fashion", img: "images/raf.png", count: "89 Active" },
        { name: "Watches", img: "images/rolexdaytona.png", count: "56 Active" },
        { name: "Collectibles", img: "images/kaws.png", count: "32 Active" }
    ];

    return (
        <div className="landing-view bg-white">
            {/* Editorial Hero Section - Compacted High-Impact */}
            <div className="relative bg-[#0f172a] text-white overflow-hidden -mt-px pt-12 pb-16 md:pt-24 md:pb-24 border-b border-indigo-900/30">
                
                <div ref={heroRef} className="relative max-w-7xl mx-auto px-6 flex flex-col items-center text-center hero-animate-in z-10">
                    
                    <div className="mb-6 font-mono text-[10px] md:text-xs text-indigo-300 tracking-[0.2em] uppercase border border-indigo-500/30 px-3 py-1 rounded-sm bg-indigo-900/20 backdrop-blur-sm">
                        Est. 2025 — The Reverse Marketplace
                    </div>
                    
                    <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.95] text-white mix-blend-screen font-swiss min-h-[1.9em] md:min-h-[auto] flex flex-col md:block items-center">
                        <span>{typedText1}</span>
                        <span className="md:hidden h-0 block"></span> {/* Mobile Break */}
                        <span className="text-indigo-500 whitespace-nowrap">
                            {typedText2}
                            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} ml-1 inline-block w-[3px] md:w-[6px] h-[0.8em] bg-indigo-500 align-baseline transition-opacity duration-100`}></span>
                        </span>
                    </h1>
                    
                    <p className="hero-subtitle text-base md:text-lg text-indigo-100/80 max-w-xl mx-auto mb-10 font-light leading-relaxed">
                        Stop refreshing listing pages. Create an ISO (In Search Of) post, name your price, and let sellers bring the items directly to you.
                    </p>
                    
                    <div className="hero-buttons flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <button 
                            onClick={() => onNavigate('create-iso')}
                            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-sm text-base transition-all flex items-center justify-center gap-2 border border-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] uppercase tracking-wide"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>Start Your Search</span>
                        </button>
                        <button 
                            onClick={() => onNavigate('main-content')}
                            className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white font-bold rounded-sm text-base border border-indigo-400/50 hover:bg-white/5 hover:border-white transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                        >
                            <Search className="w-5 h-5" />
                            <span>Browse Catalog</span>
                        </button>
                    </div>
                </div>

                {/* Hero Footer Strip - Bulletin Board Vibe */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-indigo-900/50 bg-[#0f172a]/80 backdrop-blur-sm py-3">
                    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] md:text-xs font-mono text-indigo-300 uppercase tracking-widest">
                        <span className="hidden md:block">/// GLOBAL BULLETIN BOARD</span>
                        <div className="flex gap-6 mx-auto md:mx-0">
                            <span className="flex items-center gap-2">● Direct Chat</span>
                            <span className="flex items-center gap-2">● Open Network</span>
                            <span className="flex items-center gap-2">● Niche Finds</span>
                        </div>
                        <span className="hidden md:block">DECENTRALIZED ///</span>
                    </div>
                </div>
            </div>

            {/* Raw Grid - Process Section */}
            <div className="border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 max-w-7xl mx-auto">
                    {[
                        { num: "01", title: "Defined Demand", desc: "You post the exact item and your target price. No scrolling.", icon: ShoppingBag },
                        { num: "02", title: "Private Sourcing", desc: "Finders see your request and check their inventory.", icon: ScanEye },
                        { num: "03", title: "Direct Connect", desc: "Receive a DM. Verify the item. Move off-app to close.", icon: MessageSquare }
                    ].map((step, idx) => (
                        <div key={idx} className="group p-8 md:p-12 bg-white hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-6">
                                <span className="font-mono text-3xl text-indigo-600 font-light">{step.num}</span>
                                <step.icon className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 font-swiss uppercase tracking-tight">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="pt-20 pb-20 max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 font-swiss tracking-tight mb-2">EXPLORE CATEGORIES</h2>
                        <p className="font-mono text-gray-500 text-xs uppercase tracking-wider">Browse Active Requests</p>
                    </div>
                    <button onClick={() => onNavigate('main-content')} className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors text-sm">
                        VIEW ALL <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200 mb-8">
                    {categories.map((cat) => (
                        <div 
                            key={cat.name}
                            onClick={() => onNavigate('main-content', cat.name)}
                            // Changed aspect ratio for mobile: aspect-[3/2] (wider/standard photo) -> aspect-[3/4] (tall) on desktop
                            // This fixes the 'zoomed in' look on mobile
                            className="group relative bg-white aspect-[3/2] md:aspect-[3/4] overflow-hidden cursor-pointer"
                        >
                            <img 
                                src={cat.img} 
                                alt={cat.name} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors"></div>
                            
                            {/* Overlay Info */}
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <div className="border-l-2 border-indigo-500 pl-3">
                                    <h3 className="text-xl font-bold text-white uppercase font-swiss leading-none">{cat.name}</h3>
                                    <p className="text-indigo-200 font-mono text-[10px] mt-2">{cat.count}</p>
                                </div>
                            </div>

                            {/* Corner Icon */}
                            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Capabilities (Tech Spec) */}
            <div className="py-20 bg-gray-50 border-t border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-4">
                            <h2 className="text-3xl font-black text-gray-900 font-swiss mb-6 leading-tight">SYSTEM<br/>CAPABILITIES</h2>
                            <div className="w-12 h-1 bg-indigo-600 mb-6"></div>
                            <p className="text-gray-500 text-base leading-relaxed font-serif">
                                Powered by Gemini 2.5 neural analysis. We provide the handshake; you choose the venue.
                            </p>
                        </div>
                        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                             {/* Feature 1: AI */}
                             <div className="group">
                                 <div className="mb-4 text-indigo-600 p-2.5 bg-indigo-50 inline-block rounded-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-indigo-100 group-hover:border-indigo-600"><ScanLine className="w-5 h-5" /></div>
                                 <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-2 font-mono">Neural Identification</h3>
                                 <p className="text-gray-600 text-sm leading-relaxed">
                                     Upload a photo or describe an item. Our Gemini-powered engine extracts reference numbers, colorways, and years to match you with exact inventory.
                                 </p>
                             </div>
                             {/* Feature 2: Network */}
                             <div className="group">
                                 <div className="mb-4 text-indigo-600 p-2.5 bg-indigo-50 inline-block rounded-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-indigo-100 group-hover:border-indigo-600"><Globe className="w-5 h-5" /></div>
                                 <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-2 font-mono">Global Signal</h3>
                                 <p className="text-gray-600 text-sm leading-relaxed">
                                     Your request is indexed immediately by our decentralized worldwide network of independent finders and private collectors.
                                 </p>
                             </div>
                             {/* Feature 3: Sharing */}
                             <div className="group">
                                 <div className="mb-4 text-indigo-600 p-2.5 bg-indigo-50 inline-block rounded-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-indigo-100 group-hover:border-indigo-600"><Share2 className="w-5 h-5" /></div>
                                 <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-2 font-mono">Bounty Sharing</h3>
                                 <p className="text-gray-600 text-sm leading-relaxed">
                                     Don't have the item? No problem. Share the ISO link with a dealer or collector who does. Connect the buyer to the source.
                                 </p>
                             </div>
                             {/* Feature 4: Platform Agnostic */}
                             <div className="group">
                                 <div className="mb-4 text-indigo-600 p-2.5 bg-indigo-50 inline-block rounded-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-indigo-100 group-hover:border-indigo-600"><Unlock className="w-5 h-5" /></div>
                                 <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-2 font-mono">Platform Agnostic</h3>
                                 <p className="text-gray-600 text-sm leading-relaxed">
                                     We don't trap you. Connect here, then move to Instagram, Grailed, eBay, or WhatsApp to settle the deal on your terms.
                                 </p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="py-24 text-center bg-white border-t border-transparent">
                <button
                    onClick={() => onNavigate('create-iso')}
                    className="px-12 py-5 bg-indigo-600 text-white font-black rounded-sm text-lg shadow-xl hover:bg-indigo-500 hover:-translate-y-1 transition-all uppercase tracking-widest border border-indigo-500"
                >
                    Create an ISO
                </button>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white border-t border-gray-800 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <h2 className="text-2xl font-black font-swiss tracking-tight mb-4">IN SEARCH OF</h2>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                                The decentralized reverse marketplace for archival fashion, luxury timepieces, and rare collectibles.
                            </p>
                            <div className="flex gap-4 mt-6">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-gray-500 mb-4">Platform</h3>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li><button onClick={() => onNavigate('main-content')} className="hover:text-white transition-colors">Browse</button></li>
                                <li><button onClick={() => onNavigate('create-iso')} className="hover:text-white transition-colors">Create ISO</button></li>
                                <li><a href="#" className="hover:text-white transition-colors">Finders Network</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Verification</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-gray-500 mb-4">Legal & Support</h3>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-gray-500 font-mono">© 2025 ISO Network. All rights reserved.</p>
                        <p className="text-[10px] text-gray-600">San Francisco • Tokyo • New York</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
