
export interface SocialLink {
    handle: string;
    verified: boolean;
    url?: string;
}

export interface PassportData {
    dob: string;
    origin: string;
    sex: string;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
    rating?: number;
    specialty?: string;
    trustScore?: number;
    passportData?: PassportData;
    socials?: {
        instagram?: SocialLink;
        grailed?: SocialLink;
        ebay?: SocialLink;
        whatsapp?: SocialLink;
    };
}

export interface Bid {
    id: string;
    user: User;
    price: number;
    condition: string;
    findersNote?: string;
    hasBuyback?: boolean;
}

export interface Comment {
    id: string;
    user: User;
    text: string;
    timestamp: number;
}

export interface IsoItem {
    id: number;
    seekers: number;
    joined: boolean;
    name: string;
    category: string;
    details: string;
    upvotes: number;
    topOffer: number;
    commentsList: Comment[]; 
    comments: number; 
    imageUrl: string;
    user: User;
    fundsVerified: boolean;
    privateBids: number;
    duration: number; // Days
    createdAt: number; // Timestamp
    finder: User | null;
    acquired?: {
        price: number;
        hasBuyback: boolean;
        date: number;
    };
    bids?: Bid[];
}

export interface ChatStep {
    bot?: string;
    key?: string;
    placeholder?: string;
    type?: 'buttons' | 'summary' | 'image' | 'action' | 'messageOnly';
    options?: string[];
    action?: string;
    next?: string | null;
}
