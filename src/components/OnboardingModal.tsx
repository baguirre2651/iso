
import React, { useState } from 'react';
import { Camera, ChevronRight, CheckCircle, Loader2, Upload, User, Briefcase, Archive, Eye, ShoppingBag, ShieldCheck, ScanLine, Fingerprint, Lock, Globe } from 'lucide-react';
import { User as UserType } from '../types';
import { uploadImage } from '../services/storageService';

interface OnboardingModalProps {
    user: UserType;
    onComplete: (updatedUser: UserType) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form Data
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [dob, setDob] = useState('');
    const [origin, setOrigin] = useState('');
    const [sex, setSex] = useState('');
    const [role, setRole] = useState<string>('');

    // Issuance Animation State
    const [issuanceProgress, setIssuanceProgress] = useState(0);
    const [terminalLog, setTerminalLog] = useState<string[]>([]);

    const addLog = (msg: string) => setTerminalLog(prev => [...prev.slice(-4), msg]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsLoading(true);
            try {
                const url = await uploadImage(e.target.files[0]);
                setAvatarUrl(url);
            } catch (err) {
                console.error("Upload error", err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const startIssuance = () => {
        setStep(4);
        let progress = 0;
        addLog("INITIATING HANDSHAKE...");
        
        const interval = setInterval(() => {
            progress += 2;
            setIssuanceProgress(progress);
            
            if (progress === 20) addLog("ENCRYPTING BIOMETRICS...");
            if (progress === 50) addLog("ASSIGNING NETWORK ID...");
            if (progress === 80) addLog("MINTING PASSPORT...");
            
            if (progress >= 100) {
                clearInterval(interval);
                addLog("COMPLETE.");
                setTimeout(finalize, 800);
            }
        }, 60);
    };

    const finalize = () => {
        const updatedUser: UserType = {
            ...user,
            avatar: avatarUrl || user.avatar,
            specialty: role || 'Member',
            passportData: {
                dob,
                origin: origin.toUpperCase(),
                sex
            }
        };
        onComplete(updatedUser);
    };

    const isPersonalDataValid = dob && origin && sex;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm font-swiss">
            <div className="w-full max-w-[480px] bg-[#f8fafc] rounded-lg shadow-2xl overflow-hidden relative border border-gray-300 flex flex-col max-h-[90vh]">
                
                {/* --- TECHNICAL HEADER --- */}
                <div className="bg-[#0f172a] text-white px-6 py-4 flex justify-between items-center shrink-0 border-b border-gray-900">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-mono text-emerald-400">Secure Terminal</h2>
                        </div>
                        <p className="text-sm font-bold text-white tracking-wide">IDENTITY ISSUANCE PROTOCOL</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-mono">SYS.VER.4.0</p>
                        <p className="text-[10px] text-gray-400 font-mono">ID: {user.id.slice(0,6).toUpperCase()}</p>
                    </div>
                </div>

                {/* --- PROGRESS BAR --- */}
                <div className="h-1 w-full bg-gray-200 flex">
                    <div className={`h-full bg-indigo-600 transition-all duration-500`} style={{ width: `${(step / 4) * 100}%` }}></div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    {/* STEP 1: BIOMETRIC CAPTURE */}
                    {step === 1 && (
                        <div className="relative z-10 animate-fade-in">
                            <div className="flex justify-between items-end border-b border-gray-300 pb-4 mb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono mb-1">Step 01 // 04</p>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Biometric Scan</h3>
                                </div>
                                <Camera className="w-6 h-6 text-gray-300" />
                            </div>

                            {/* Scanner Frame */}
                            <div className="bg-white p-4 border border-gray-200 shadow-sm mb-6">
                                <div className="text-[10px] font-mono text-gray-400 mb-2 flex justify-between">
                                    <span>REF: IMG-CAPTURE</span>
                                    <span>ASPECT: 2:3</span>
                                </div>
                                <div className="relative group cursor-pointer mx-auto w-40 h-52">
                                    {/* Corner Brackets */}
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900"></div>
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900"></div>
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900"></div>
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900"></div>

                                    <div className="absolute inset-2 bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <ScanLine className="w-8 h-8 text-gray-300 mb-2" />
                                                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Upload Portrait</span>
                                            </>
                                        )}
                                        
                                        {/* Loading */}
                                        {isLoading && (
                                            <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                                </div>
                                <p className="text-center text-[10px] text-gray-400 mt-3 font-mono">
                                    {avatarUrl ? "IMAGE_LOCK_CONFIRMED" : "WAITING FOR INPUT..."}
                                </p>
                            </div>

                            <button 
                                onClick={() => setStep(2)}
                                disabled={!avatarUrl}
                                className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-black disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <span>Initialize Data</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: PERSONAL DATA */}
                    {step === 2 && (
                        <div className="relative z-10 animate-fade-in">
                            <div className="flex justify-between items-end border-b border-gray-300 pb-4 mb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono mb-1">Step 02 // 04</p>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Subject Data</h3>
                                </div>
                                <Fingerprint className="w-6 h-6 text-gray-300" />
                            </div>

                            <div className="bg-white border border-gray-200 shadow-sm p-6 space-y-6 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Place of Origin</label>
                                        <div className="flex items-center border-b-2 border-gray-200 focus-within:border-indigo-600 transition-colors">
                                            <Globe className="w-4 h-4 text-gray-400 mr-2" />
                                            <input 
                                                type="text" 
                                                placeholder="CITY, COUNTRY"
                                                value={origin}
                                                onChange={(e) => setOrigin(e.target.value)}
                                                className="w-full py-2 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300 uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Date of Birth</label>
                                        <input 
                                            type="date" 
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="w-full py-2 bg-transparent border-b-2 border-gray-200 focus:border-indigo-600 outline-none transition-colors font-mono text-sm text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Sex</label>
                                        <div className="flex gap-2">
                                            {['M', 'F', 'X'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setSex(s)}
                                                    className={`flex-1 py-1.5 text-xs font-bold border ${sex === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'} transition-all`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setStep(3)}
                                disabled={!isPersonalDataValid}
                                className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-black disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <span>Proceed</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* STEP 3: DESIGNATION */}
                    {step === 3 && (
                        <div className="relative z-10 animate-fade-in">
                             <div className="flex justify-between items-end border-b border-gray-300 pb-4 mb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono mb-1">Step 03 // 04</p>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Classification</h3>
                                </div>
                                <Briefcase className="w-6 h-6 text-gray-300" />
                            </div>

                            <div className="grid grid-cols-1 gap-px bg-gray-200 border border-gray-200 mb-8">
                                {[
                                    { id: 'Collector', icon: Archive, desc: 'ACQUISITION & STORAGE' },
                                    { id: 'Finder', icon: Eye, desc: 'SEARCH & RECOVERY' },
                                    { id: 'Dealer', icon: Briefcase, desc: 'COMMERCIAL OPERATIONS' },
                                    { id: 'Enthusiast', icon: ShoppingBag, desc: 'OBSERVER CLASS' },
                                ].map((r) => (
                                    <div 
                                        key={r.id}
                                        onClick={() => setRole(r.id)}
                                        className={`p-4 cursor-pointer transition-all flex items-center gap-4 group ${role === r.id ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'}`}
                                    >
                                        <div className={`p-2 border rounded-sm ${role === r.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-200'}`}>
                                            <r.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h3 className={`font-bold text-sm uppercase ${role === r.id ? 'text-indigo-900' : 'text-gray-900'}`}>{r.id}</h3>
                                                {role === r.id && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                                            </div>
                                            <p className="text-[9px] text-gray-500 font-mono tracking-wide">{r.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={startIssuance}
                                disabled={!role}
                                className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-black disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <span>Generate ID</span>
                                <Lock className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {/* STEP 4: ISSUANCE */}
                    {step === 4 && (
                        <div className="h-full flex flex-col justify-center items-center text-center animate-fade-in relative z-10">
                            <div className="relative mb-8">
                                <div className="w-32 h-32 border-2 border-gray-200 rounded-full flex items-center justify-center relative">
                                    <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin"></div>
                                    <ShieldCheck className="w-12 h-12 text-indigo-600" />
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Minting Credentials</h3>
                            
                            {/* Terminal Log */}
                            <div className="w-full max-w-[240px] bg-black text-green-400 p-4 rounded-sm font-mono text-[10px] text-left min-h-[100px] flex flex-col justify-end border border-gray-800 shadow-inner">
                                {terminalLog.map((log, i) => (
                                    <p key={i} className="mb-1">&gt; {log}</p>
                                ))}
                                <span className="animate-pulse">_</span>
                            </div>

                            <div className="mt-6 w-full max-w-[240px] bg-gray-200 h-1">
                                <div className="h-full bg-indigo-600 transition-all duration-100" style={{ width: `${issuanceProgress}%` }}></div>
                            </div>
                        </div>
                    )}

                </div>
                
                {/* --- FOOTER STATUS --- */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex justify-between items-center shrink-0">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">SECURE CONNECTION</p>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 delay-75"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
