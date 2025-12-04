
import { User } from '../types';

export interface Message {
    id: number;
    sender: 'me' | 'them';
    text: string;
    time: string;
}

export interface Thread {
    id: string;
    user: {
        name: string;
        avatar: string;
        status: 'online' | 'offline';
        role: string;
        trustScore?: number; // Added for profile view
        verified?: boolean;  // Added for profile view
    };
    lastMessage: string;
    time: string;
    unread: number;
    item: string;
    messages: Message[];
    status: 'active' | 'archived' | 'deleted';
}

// Initial Mock Data
const INITIAL_THREADS: Thread[] = [
    {
        id: '1',
        user: { name: '@TheCurator', avatar: 'https://i.pravatar.cc/150?u=curator', status: 'online', role: 'Finder', trustScore: 92, verified: true },
        lastMessage: "I have the Raf bomber ready to ship. Sending photos now.",
        time: '2m ago',
        unread: 2,
        item: "Raf Simons 'Riot' Bomber",
        status: 'active',
        messages: [
            { id: 1, sender: 'them', text: "Hi there! I saw your ISO for the Raf Simons Riot Bomber.", time: "10:30 AM" },
            { id: 2, sender: 'them', text: "I actually have one in Size 50, sourced from a collector in Tokyo.", time: "10:31 AM" },
            { id: 3, sender: 'me', text: "That's incredible. Do you have verification of condition?", time: "10:33 AM" },
            { id: 4, sender: 'them', text: "I have the Raf bomber ready to ship. Sending photos now.", time: "10:35 AM" }
        ]
    }
];

// In-Memory Storage (Resets on Refresh)
let memoryThreads: Thread[] = [...INITIAL_THREADS];

export const getThreads = (): Thread[] => {
    return memoryThreads;
};

export const saveThread = (updatedThreads: Thread[]) => {
    memoryThreads = updatedThreads;
};

export const updateThreadStatus = (threadId: string, status: 'active' | 'archived' | 'deleted' | 'destroyed') => {
    let threads = getThreads();
    
    if (status === 'destroyed') {
        threads = threads.filter(t => t.id !== threadId);
    } else {
        threads = threads.map(t => {
            if (t.id === threadId) {
                return { ...t, status: status as 'active' | 'archived' | 'deleted' };
            }
            return t;
        });
    }
    saveThread(threads);
    return threads;
};

export const startConversation = (item: any, currentUser: User, recipient: User, initialMessage: string) => {
    const threads = getThreads();
    
    // Check if thread already exists
    const existingThread = threads.find(t => t.item === item.name && t.user.name === recipient.name);

    if (existingThread) {
        // If it was deleted/archived, bring it back to active
        existingThread.status = 'active';
        
        const newMessage: Message = {
            id: Date.now(),
            sender: 'me',
            text: initialMessage,
            time: 'Just now'
        };
        existingThread.messages.push(newMessage);
        existingThread.lastMessage = initialMessage;
        existingThread.time = 'Just now';
        
        const otherThreads = threads.filter(t => t.id !== existingThread.id);
        saveThread([existingThread, ...otherThreads]);
        return existingThread.id;
    } else {
        const newThread: Thread = {
            id: Date.now().toString(),
            user: {
                name: recipient.name,
                avatar: recipient.avatar,
                status: 'offline',
                role: 'Member',
                trustScore: recipient.trustScore || 50,
                verified: recipient.trustScore ? recipient.trustScore > 80 : false
            },
            item: item.name,
            lastMessage: initialMessage,
            time: 'Just now',
            unread: 0,
            status: 'active',
            messages: [
                {
                    id: Date.now(),
                    sender: 'me',
                    text: initialMessage,
                    time: 'Just now'
                }
            ]
        };
        
        saveThread([newThread, ...threads]);
        return newThread.id;
    }
};
