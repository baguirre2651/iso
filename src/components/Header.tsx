
import React, { useState } from 'react';
import { SearchCheck, MessageSquare, PlusCircle, User, Search, LogOut, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
    activeView: string;
    onNavigate: (view: string) => void;
    onCreateClick: () => void;
    user: UserType | null;
    onLoginClick: () => void;
    onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate, onCreateClick, user, onLoginClick, onLogoutClick }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavClick = (view: string) => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3">
                    <button onClick={() => handleNavClick('landing-view')} className="flex items-center space-x-2.5 text-gray-900 font-swiss group">
                        <div className="bg-indigo-600 text-white w-9 h-9 flex items-center justify-center rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                            <SearchCheck className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight group-hover:text-indigo-900 transition-colors">In Search Of</h1>
                    </button>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <button 
                            onClick={() => onNavigate('main-content')} 
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeView === 'main-content' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            Browse
                        </button>
                        
                        {user && (
                            <button 
                                onClick={() => onNavigate('my-iso-view')} 
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeView === 'my-iso-view' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                My ISO
                            </button>
                        )}
                        
                        <button 
                            onClick={() => onNavigate('how-it-works-view')} 
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeView === 'how-it-works-view' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            How It Works
                        </button>
                    </nav>

                    <div className="flex items-center space-x-3 md:space-x-5">
                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-500 hover:text-indigo-600 transition-colors">
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user && (
                                <button 
                                    onClick={() => onNavigate('messages-view')}
                                    className={`text-gray-400 hover:text-indigo-600 transition-colors relative ${activeView === 'messages-view' ? 'text-indigo-600' : ''}`}
                                    title="Messages"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                </button>
                            )}
                            
                            {user ? (
                                <>
                                    <button 
                                        onClick={onCreateClick}
                                        className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all flex items-center space-x-1.5 active:scale-95 transform"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        <span>Create</span>
                                    </button>

                                    <div className="relative">
                                        <button 
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden focus:outline-none ring-2 ring-offset-2 ring-transparent hover:ring-gray-200 transition-all active:scale-95"
                                        >
                                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        </button>
                                        
                                        {isProfileOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                                <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 py-2 overflow-hidden animate-fade-in">
                                                    <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                                                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                                        <p className="text-xs text-gray-500 font-medium">Collector</p>
                                                    </div>
                                                    <div className="p-1">
                                                        <button onClick={() => { onNavigate('profile-view'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors font-medium">
                                                            <User className="w-4 h-4" /> My Profile
                                                        </button>
                                                        <button onClick={() => { onNavigate('my-iso-view'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors font-medium">
                                                            <Search className="w-4 h-4" /> My Hunts
                                                        </button>
                                                        <button onClick={() => { onNavigate('messages-view'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors font-medium">
                                                            <MessageSquare className="w-4 h-4" /> Messages
                                                        </button>
                                                    </div>
                                                    <div className="h-px bg-gray-100 my-1 mx-4"></div>
                                                    <div className="p-1">
                                                        <button onClick={() => { onLogoutClick(); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors font-medium">
                                                            <LogOut className="w-4 h-4" /> Sign Out
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={onCreateClick}
                                        className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2 rounded-full shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all text-sm active:scale-95"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        <span>Create ISO</span>
                                    </button>
                                    <button 
                                        onClick={onLoginClick}
                                        className="text-sm font-bold text-gray-700 hover:text-indigo-600 px-4 py-2 hover:bg-gray-50 rounded-full transition-all"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white shadow-lg absolute w-full animate-fade-in">
                    <div className="px-4 py-4 space-y-2">
                        <button onClick={() => handleNavClick('main-content')} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                            Browse
                        </button>
                        <button onClick={() => handleNavClick('how-it-works-view')} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                            How It Works
                        </button>
                        
                        {user ? (
                            <>
                                <div className="h-px bg-gray-100 my-2"></div>
                                <button onClick={() => handleNavClick('my-iso-view')} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                                    My ISO Hub
                                </button>
                                <button onClick={() => handleNavClick('messages-view')} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                                    Messages
                                </button>
                                <button onClick={() => handleNavClick('profile-view')} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                                    My Profile
                                </button>
                                <button onClick={() => { onCreateClick(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
                                    + Create ISO
                                </button>
                                <button onClick={() => { onLogoutClick(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Fixed Conflict: Removed 'text-left' so 'text-center' works properly */}
                                <button onClick={() => { onCreateClick(); setIsMobileMenuOpen(false); }} className="block w-full px-4 py-3 rounded-xl text-base font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 mt-4 text-center transition-all">
                                    Create ISO
                                </button>
                                <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="block w-full px-4 py-3 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md mt-2 text-center transition-all">
                                    Sign In
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
