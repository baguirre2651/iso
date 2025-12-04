
import { User } from '../types';

// --- MOCK AUTH SERVICE (In-Memory Only) ---

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let currentUser: User | null = null;

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
    
    currentUser = user;
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

    currentUser = user;
    return user;
}

export async function updateUserProfile(user: User): Promise<User> {
    await delay(500);
    currentUser = user;
    return user;
}

export async function signOut() {
    await delay(400);
    currentUser = null;
}

export async function getCurrentUser(): Promise<User | null> {
    // In-Memory: Returns null on refresh
    return currentUser;
}
