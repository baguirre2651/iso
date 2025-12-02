
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Feed from './components/Feed';
import DetailView from './components/DetailView';
import Dashboard from './components/Dashboard';
import HowItWorks from './components/HowItWorks';
import ProfileView from './components/ProfileView';
import MessagesView from './components/MessagesView';
import CreateIsoModal from './components/CreateIsoModal';
import AiAssistant from './components/AiAssistant';
import AuthModal from './components/AuthModal';
import OnboardingModal from './components/OnboardingModal';
import { IsoItem, User, Comment } from './types';
import { isoData as initialIsoData } from './data';
import { getCurrentUser, signOut, updateUserProfile } from './services/authService';

const ISO_DATA_KEY = 'iso_data_v1';

const App: React.FC = () => {
    // Navigation State
    const [activeView, setActiveView] = useState('landing-view');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [authInitialized, setAuthInitialized] = useState(false);

    // Data State
    const [isoData, setIsoData] = useState<IsoItem[]>(() => {
        // Load from local storage if available, otherwise use initial mock data
        const saved = localStorage.getItem(ISO_DATA_KEY);
        return saved ? JSON.parse(saved) : initialIsoData;
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Persist Data Changes
    useEffect(() => {
        localStorage.setItem(ISO_DATA_KEY, JSON.stringify(isoData));
    }, [isoData]);

    // Initialize Auth
    useEffect(() => {
        getCurrentUser().then(u => {
            setUser(u);
            setAuthInitialized(true);
        });
    }, []);

    // --- Actions ---

    const handleNavigate = (view: string, category: string = 'All') => {
        if (view === 'create-iso') {
            handleCreateClick();
            return;
        }
        
        // Protect private routes
        if ((view === 'my-iso-view' || view === 'profile-view' || view === 'messages-view') && !user) {
            setShowAuthModal(true);
            return;
        }

        window.scrollTo(0, 0);
        setActiveView(view);
        setSelectedCategory(category);
    };

    const handleCreateClick = () => {
        if (!user) {
            setShowAuthModal(true);
        } else {
            setIsCreateModalOpen(true);
        }
    };

    const handleViewDetails = (id: number) => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        setSelectedItemId(id);
        setActiveView('detail-view');
        window.scrollTo(0, 0);
    };

    const handleCreateIso = (newItem: IsoItem) => {
        if (user) newItem.user = user;
        setIsoData([newItem, ...isoData]);
        setActiveView('main-content');
    };

    // --- Interaction Handlers ---

    const handleCoSign = (id: number) => {
        setIsoData(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, upvotes: item.upvotes + 1 };
            }
            return item;
        }));
    };

    const handleAddComment = (itemId: number, text: string) => {
        if (!user) return;
        const newComment: Comment = {
            id: Date.now().toString(),
            user: user,
            text: text,
            timestamp: Date.now()
        };

        setIsoData(prev => prev.map(item => {
            if (item.id === itemId) {
                return { 
                    ...item, 
                    commentsList: [...item.commentsList, newComment],
                    comments: item.comments + 1
                };
            }
            return item;
        }));
    };

    const handleDeleteIso = (id: number) => {
        setIsoData(prev => prev.filter(item => item.id !== id));
        setActiveView('main-content'); 
    };

    const handleEditIso = (id: number, newTopOffer: number) => {
        setIsoData(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, topOffer: newTopOffer };
            }
            return item;
        }));
    };

    // --- Auth Handlers ---

    const handleLoginSuccess = (loggedInUser: User, isNewUser?: boolean) => {
        setUser(loggedInUser);
        setShowAuthModal(false);
        if (isNewUser) {
            setShowOnboarding(true);
        }
    };

    const handleOnboardingComplete = (updatedUser: User) => {
        updateUserProfile(updatedUser).then((savedUser) => {
            setUser(savedUser);
            setShowOnboarding(false);
        });
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setActiveView('landing-view');
    };

    if (!authInitialized) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="loader"></div></div>;
    }

    return (
        <div className="min-h-screen flex flex-col relative">
            
            <Header 
                activeView={activeView} 
                onNavigate={handleNavigate} 
                onCreateClick={handleCreateClick}
                user={user}
                onLoginClick={() => setShowAuthModal(true)}
                onLogoutClick={handleLogout}
            />

            {/* View Routing */}
            {activeView === 'landing-view' ? (
                <LandingPage onNavigate={handleNavigate} />
            ) : (
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                    
                    {activeView === 'main-content' && (
                        <Feed 
                            items={isoData} 
                            activeCategory={selectedCategory} 
                            onViewDetails={handleViewDetails}
                            onCoSign={handleCoSign}
                        />
                    )}

                    {activeView === 'detail-view' && selectedItemId && (
                        <DetailView 
                            itemId={selectedItemId} 
                            items={isoData} 
                            currentUser={user}
                            onBack={() => setActiveView('main-content')}
                            onNavigate={handleNavigate}
                            onCoSign={handleCoSign}
                            onAddComment={handleAddComment}
                            onDelete={handleDeleteIso}
                            onEdit={handleEditIso}
                        />
                    )}

                    {activeView === 'my-iso-view' && (
                        <Dashboard items={isoData} onViewDetails={handleViewDetails} />
                    )}

                    {activeView === 'messages-view' && user && (
                        <MessagesView currentUser={user} />
                    )}

                    {activeView === 'profile-view' && user && (
                        <ProfileView user={user} onLogout={handleLogout} />
                    )}

                    {activeView === 'how-it-works-view' && (
                        <HowItWorks />
                    )}
                </main>
            )}

            {/* Modals & Overlays */}
            
            {showAuthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
                    <div className="relative z-10 w-full max-w-md">
                        <AuthModal 
                            onClose={() => setShowAuthModal(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    </div>
                </div>
            )}

            {showOnboarding && user && (
                <OnboardingModal 
                    user={user} 
                    onComplete={handleOnboardingComplete} 
                />
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="relative z-10 w-full max-w-lg">
                        <CreateIsoModal 
                            onClose={() => setIsCreateModalOpen(false)} 
                            onCreate={handleCreateIso} 
                        />
                    </div>
                </div>
            )}

            <AiAssistant />
        </div>
    );
};

export default App;
