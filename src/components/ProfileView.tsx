
import React, { useState } from 'react';
import { LogOut, Instagram, Globe, ShoppingBag, Smartphone, Loader2, X, CheckCircle, ScanLine, Star, Fingerprint } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileViewProps {
    user: UserType;
    onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
    // Simulated Backend State
    const [socials, setSocials] = useState({
        instagram: user.socials?.instagram?.handle || '',
        grailed: user.socials?.grailed?.handle || '',
        ebay: user.socials?.ebay?.handle || '',
        whatsapp: user.socials?.whatsapp?.handle || ''
    });

    const [verifiedState, setVerifiedState] = useState({
        instagram: user.socials?.instagram?.verified || false,
        grailed: user.socials?.grailed?.verified || false,
        ebay: user.socials?.ebay?.verified || false,
        whatsapp: user.socials?.whatsapp?.verified || false
    });

    const [verifying, setVerifying] = useState<string | null>(null);
    const [connectModal, setConnectModal] = useState<string | null>(null);

    // Calculate dynamic trust score
    const verifiedCount = Object.values(verifiedState).filter(Boolean).length;
    const trustScore = Math.min(100, 20 + (verifiedCount * 20));

    // Generate stable mock data for the ID if missing
    const mockNetworkId = user.id.replace(/[^0-9]/g, '').slice(0, 9).padEnd(9, '0');

    // Passport Details (Fallbacks to mock if not present)
    const passportOrigin = user.passportData?.origin || "CALIFORNIA, USA";
    const passportSex = user.passportData?.sex || "M";
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return "01 JAN 95";
        const date = new Date(dateString);
        // Format: 01 JAN 95
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
        const year = date.getFullYear().toString().slice(-2);
        return `${day} ${month} ${year}`;
    };
    
    const passportDOB = formatDate(user.passportData?.dob);

    const handleConnectClick = (platform: string) => {
        setConnectModal(platform);
    };

    const confirmConnection = (platform: keyof typeof verifiedState) => {
        setConnectModal(null);
        setVerifying(platform);
        
        // Simulate API verification delay
        setTimeout(() => {
            setVerifying(null);
            setVerifiedState(prev => ({ ...prev, [platform]: true }));
        }, 2000);
    };

    // Helper to generate MRZ (Machine Readable Zone)
    // Format: P<USA[USERNAME]<<<<<<<<<<<
    const generateMRZ = () => {
        // Clean name 
        const cleanName = user.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 39);
        
        // Line 1: Type (P) + Country (USA) + Username as Primary Identifier
        // Standard: P<USAIDENTIFIER<<<<<<<<<<<<<<<<<<<<<<
        const line1Base = `P<USA${cleanName}`;
        const line1 = line1Base.padEnd(44, '<');

        // Line 2: ID + Check + Country + DOB + Check + Sex + Exp + Check + Optional + Check
        // Using real/mocked data for generation visual
        
        const line2Base = `${mockNetworkId}4USA${passportDOB.replace(/\s/g, '')}8${passportSex}3010256`;
        const line2 = line2Base.padEnd(44, '<');

        return (
            <div className="font-mono text-[11px] tracking-[1px] leading-relaxed text-slate-800 uppercase mt-5 select-all pt-3 font-bold text-left mix-blend-multiply opacity-80" style={{ fontFamily: '"OCR-B", "Courier New", monospace' }}>
                <p>{line1}</p>
                <p>{line2}</p>
            </div>
        );
    };

    return (
        <div className="max-w-[500px] mx-auto animate-fade-in pb-20 pt-8 font-swiss relative">
            
            {/* Connection Modal */}
            {connectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-xl border border-gray-200 p-6 shadow-2xl animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Add Endorsement</h3>
                            <button onClick={() => setConnectModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Requesting verification for <strong className="text-indigo-600">{connectModal.toUpperCase()}</strong>.
                        </p>
                        
                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Handle / ID</label>
                            <input 
                                type="text" 
                                placeholder={`@username`}
                                value={socials[connectModal as keyof typeof socials]}
                                onChange={(e) => setSocials(prev => ({ ...prev, [connectModal as string]: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-all"
                            />
                        </div>

                        <button 
                            onClick={() => confirmConnection(connectModal as keyof typeof verifiedState)}
                            disabled={!socials[connectModal as keyof typeof socials]}
                            className="w-full py-3 bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg"
                        >
                            Verify Identity
                        </button>
                    </div>
                </div>
            )}

            {/* DIPLOMATIC CREAM PASSPORT CARD */}
            <div className="relative bg-[#fdfbf7] w-full rounded-[8px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] overflow-hidden border border-stone-200 select-none group/card transform transition-transform duration-500">
                
                {/* Physical Texture Layer: Paper Fiber / Guilloche */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]" 
                    style={{
                        backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
                        backgroundSize: 'cover'
                    }}>
                </div>
                
                {/* Security Guilloche Pattern Overlay (Subtle) */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.3]" 
                     style={{
                        backgroundImage: `repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 10px, #e5e7eb 10px, #e5e7eb 11px)`
                     }}>
                </div>
                
                {/* Ghost Portrait (Security Feature) */}
                <div className="absolute right-[-10px] bottom-[-20px] w-64 h-64 opacity-[0.05] mix-blend-multiply pointer-events-none grayscale z-0">
                    <img src={user.avatar} className="w-full h-full object-cover rounded-full" />
                </div>

                {/* Header Band - Navy & Gold (Sovereign Look) */}
                <div className="relative z-10 px-5 py-4 bg-[#1e293b] flex justify-between items-center border-b-[2px] border-[#d4af37] overflow-hidden shadow-sm">
                     {/* Pattern Overlay */}
                     <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 4px)' }}></div>
                     
                     <div className="flex items-center gap-3 relative z-10">
                        {/* Emblem */}
                        <div className="w-8 h-8 rounded-full border border-[#d4af37] flex items-center justify-center bg-[#1e293b] shadow-lg text-[#d4af37]">
                            <Fingerprint className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-serif text-base font-black tracking-[0.05em] text-[#f8fafc] uppercase leading-none mb-0.5">Network of ISO</h1>
                            <p className="font-mono text-[7px] font-bold text-[#d4af37] tracking-[0.2em] uppercase">Digital Identification Passport</p>
                        </div>
                     </div>
                     
                     {/* Chip Icon */}
                     <div className="w-9 h-7 rounded bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-30"></div>
                        <ScanLine className="w-4 h-4 text-[#d4af37]" />
                     </div>
                </div>

                <div className="p-6 relative z-10">
                    
                    {/* The "Wet Ink" Trust Stamp */}
                    <div className="absolute right-6 top-5 z-30 transform rotate-[-8deg] pointer-events-none mix-blend-multiply opacity-85">
                         <div className={`
                            w-20 h-20 rounded-full border-[3px] flex flex-col items-center justify-center backdrop-blur-[1px]
                            ${trustScore >= 80 ? 'border-emerald-700 text-emerald-800' : 'border-amber-700 text-amber-800'}
                        `} style={{ maskImage: 'url("https://www.transparenttextures.com/patterns/grunge-wall.png")' }}>
                            <p className="text-[6px] font-black tracking-widest uppercase mb-0.5">System Verified</p>
                            <p className="text-2xl font-black font-mono tracking-tighter">{trustScore}</p>
                            <p className="text-[5px] font-bold tracking-widest uppercase mt-0.5 border-t border-current pt-0.5 px-2">Trust Score</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Primary Photo with Holographic Transition */}
                        <div className="w-28 shrink-0 flex flex-col gap-2 relative group cursor-help">
                             <div className="w-28 h-36 bg-[#e2e8f0] rounded-[2px] relative overflow-hidden border border-slate-300 shadow-sm">
                                {/* DEFAULT: Monochrome Warm/Sepia Tint (Archival Look) */}
                                <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply z-10 transition-opacity duration-300 group-hover:opacity-0"></div>
                                <img 
                                    src={user.avatar} 
                                    className="w-full h-full object-cover filter grayscale contrast-125 sepia-[0.3] transition-all duration-300 group-hover:grayscale-0 group-hover:contrast-100 group-hover:sepia-0" 
                                />
                                
                                {/* Holographic Overlay - Appears on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay z-20"></div>
                             </div>
                             
                             <div className="flex items-center justify-center gap-1.5 text-center">
                                <ScanLine className="w-3 h-3 text-slate-400 animate-pulse" />
                                <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Hover to Verify</p>
                             </div>
                        </div>

                        {/* ICAO Standard Data Fields */}
                        <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-4 content-start pt-1">
                             
                             {/* Row 1: Username */}
                             <div className="col-span-2 border-b border-slate-300 pb-1">
                                <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Username</p>
                                <p className="font-serif text-lg font-bold text-slate-900 uppercase tracking-wide drop-shadow-sm">
                                    {user.name}
                                </p>
                             </div>

                             {/* Row 2: Nationality / ID */}
                             <div className="border-b border-slate-300 pb-1">
                                <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Nationality</p>
                                <p className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                                    UNITED STATES
                                </p>
                             </div>

                             <div className="border-b border-slate-300 pb-1">
                                <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Network ID</p>
                                <p className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                                    {mockNetworkId}
                                </p>
                             </div>

                             {/* Row 3: DOB / Sex */}
                             <div className="border-b border-slate-300 pb-1">
                                <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Date of Birth</p>
                                <p className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                                    {passportDOB}
                                </p>
                             </div>

                             <div className="border-b border-slate-300 pb-1">
                                <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Sex</p>
                                <p className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                                    {passportSex}
                                </p>
                             </div>

                             {/* Row 4: Place of Birth / Authority */}
                             <div className="border-b border-slate-300 pb-1">
                                <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Place of Birth</p>
                                <p className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                                    {passportOrigin}
                                </p>
                             </div>
                             
                             <div className="border-b border-slate-300 pb-1">
                                <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Authority</p>
                                <p className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                                    ISO NETWORK
                                </p>
                             </div>
                        </div>
                    </div>
                    
                    {generateMRZ()}
                </div>
            </div>

            {/* Endorsements / Visas Section */}
            <div className="mt-8 max-w-[500px] mx-auto px-1">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                    <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center gap-2">
                        <Star className="w-3 h-3" /> External Endorsements
                    </h3>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Social Cards - Paper Style */}
                    {[
                        { id: 'instagram', icon: Instagram, label: 'Instagram', val: verifiedState.instagram, handle: socials.instagram, color: 'text-pink-700' },
                        { id: 'grailed', icon: ShoppingBag, label: 'Grailed', val: verifiedState.grailed, handle: socials.grailed, color: 'text-gray-800' },
                        { id: 'ebay', icon: Globe, label: 'eBay', val: verifiedState.ebay, handle: socials.ebay, color: 'text-blue-700' },
                        { id: 'whatsapp', icon: Smartphone, label: 'WhatsApp', val: verifiedState.whatsapp, handle: socials.whatsapp, color: 'text-green-700' },
                    ].map((item) => (
                        <div key={item.id} className={`p-3 rounded-[4px] border flex items-center justify-between transition-all relative overflow-hidden group ${item.val ? 'bg-[#fffefb] border-stone-300 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                            {item.val && <div className="absolute top-0 left-0 w-1 h-full bg-[#1e293b]"></div>}
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-sm ${item.val ? 'bg-stone-100' : 'bg-white border border-gray-200'}`}>
                                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                                </div>
                                <div>
                                    <p className="font-bold text-[9px] uppercase text-gray-800 tracking-wide">{item.label}</p>
                                    <p className="font-mono text-[8px] text-gray-500">{item.val ? item.handle : 'Not Linked'}</p>
                                </div>
                            </div>
                            {item.val ? (
                                <div className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-sm border border-stone-200">
                                    <CheckCircle className="w-3 h-3 text-stone-600" />
                                    <span className="text-[8px] font-bold text-stone-600 uppercase">Valid</span>
                                </div>
                            ) : verifying === item.id ? (
                                <Loader2 className="w-3 h-3 text-indigo-600 animate-spin" />
                            ) : (
                                <button onClick={() => handleConnectClick(item.id)} className="text-[8px] font-bold text-stone-500 hover:text-indigo-600 uppercase tracking-wide px-3 py-1 bg-white hover:bg-indigo-50 rounded-sm border border-gray-200 hover:border-indigo-200 transition-colors">
                                    Link
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center opacity-0 hover:opacity-100 transition-opacity">
                    <button 
                        onClick={onLogout}
                        className="text-red-400 hover:text-red-600 font-bold uppercase tracking-widest text-[9px] flex items-center gap-2 mx-auto transition-colors"
                    >
                        <LogOut className="w-3 h-3" /> Secure Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
