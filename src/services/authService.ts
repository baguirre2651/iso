
// import { supabase } from './supabaseClient';
import { User } from '../types';

// --- MOCK AUTH SERVICE (Replacing Supabase for Demo) ---

const MOCK_USER_KEY = 'iso_mock_user';

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function signInWithEmail(email: string, password: string): Promise<User> {
    await delay(800); // Simulate network request
    
    // Mock successful login
    const user: User = {
        id: 'mock-user-123',
        name: email.split('@')[0] || '@user',
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        rating: 4.8,
        specialty: 'Collector',
        trustScore: 85,
        socials: {
            instagram: { handle: '@' + email.split('@')[0], verified: true },
            grailed: { handle: 'grailed.com/' + email.split('@')[0], verified: false }
        }
    };
    
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
    return user;
}

export async function signUpWithEmail(email: string, password: string, username: string): Promise<User> {
    await delay(800);
    
    const user: User = {
        id: 'mock-user-' + Date.now(),
        name: username || '@newuser',
        avatar: `https://i.pravatar.cc/150?u=${email}`, // Default avatar
        rating: 0,
        specialty: 'Member', // Default role
        trustScore: 20, // Start low
        socials: {
            instagram: undefined,
            grailed: undefined,
            ebay: undefined,
            whatsapp: undefined
        }
    };

    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
    return user;
}

export async function updateUserProfile(user: User): Promise<User> {
    await delay(500);
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
    return user;
}

export async function signOut() {
    await delay(400);
    localStorage.removeItem(MOCK_USER_KEY);
}

export async function getCurrentUser(): Promise<User | null> {
    // Check local storage instead of Supabase session
    const stored = localStorage.getItem(MOCK_USER_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return null;
        }
    }
    return null;
}
