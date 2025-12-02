
import { IsoItem } from './types';

const MOCK_COMMENTS = [
    {
        id: 'c1',
        user: { id: 'u_comment1', name: '@TokyoVintage', avatar: 'https://i.pravatar.cc/40?u=tokyo', specialty: 'Dealer', trustScore: 95, socials: { instagram: { handle: '@tokyovintage', verified: true } } },
        text: "Saw one of these at a pop-up in Shibuya last week. Asking price was around $600 though.",
        timestamp: Date.now() - 86400000
    },
    {
        id: 'c2',
        user: { id: 'u_comment2', name: '@LegitChecker', avatar: 'https://i.pravatar.cc/40?u=check', specialty: 'Authenticator', trustScore: 98, socials: { grailed: { handle: 'checker', verified: true } } },
        text: "Be careful with the 2015 release, lots of fakes with the wrong heel stitching.",
        timestamp: Date.now() - 172800000
    }
];

export const isoData: IsoItem[] = [
    {
        id: 5,
        seekers: 1,
        joined: false,
        name: "Rolex Daytona 'Panda'",
        category: "Watches",
        details: "116500LN, White Dial",
        upvotes: 18,
        topOffer: 28500,
        comments: 0,
        commentsList: [],
        imageUrl: "images/rolexdaytona.png",
        user: { 
            id: 'u6', 
            name: "@watchguy", 
            avatar: "https://i.pravatar.cc/40?u=user6", 
            rating: 5.0, 
            trustScore: 99, // High Trust Score - Should appear first
            socials: { whatsapp: { handle: '+1234567890', verified: true } } 
        },
        fundsVerified: true,
        privateBids: 0,
        duration: 30,
        createdAt: Date.now() - (10 * 24 * 60 * 60 * 1000),
        finder: null,
        acquired: {
            price: 28000,
            hasBuyback: true,
            date: Date.now() - (100 * 24 * 60 * 60 * 1000)
        }
    },
    {
        id: 1,
        seekers: 1,
        joined: false,
        name: "Jordan 1 Retro High 'Chicago'",
        category: "Sneakers",
        details: "Size 10, New/Unworn",
        upvotes: 112,
        topOffer: 550,
        comments: 2,
        commentsList: MOCK_COMMENTS,
        imageUrl: "images/jordan1.png",
        user: { 
            id: 'u3', 
            name: "@sneakerhead23", 
            avatar: "https://i.pravatar.cc/40?u=user3", 
            rating: 4.9,
            trustScore: 92, // High Trust
            socials: {
                instagram: { handle: '@snkrhead23', verified: true },
                ebay: { handle: 'snkrs_store', verified: true }
            }
        },
        fundsVerified: true,
        privateBids: 0,
        duration: 30,
        createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
        finder: null
    },
    {
        id: 6,
        seekers: 1,
        joined: true,
        name: "Raf Simons 'Riot' Bomber Jacket",
        category: "Archival Fashion",
        details: "AW 2001, Size 50, Good condition",
        upvotes: 88,
        topOffer: 4500,
        comments: 1,
        commentsList: [MOCK_COMMENTS[0]],
        imageUrl: "images/raf.png",
        user: { 
            id: 'u7', 
            name: "@archive_fiend", 
            avatar: "https://i.pravatar.cc/40?u=user7", 
            rating: 5.0,
            trustScore: 88, // Moderate-High Trust
            socials: {
                grailed: { handle: 'archived', verified: true }
            }
        },
        fundsVerified: true,
        privateBids: 1,
        duration: 14,
        createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
        finder: { id: 'finder1', name: '@TheCurator', specialty: 'Archival Fashion Expert', avatar: 'https://i.pravatar.cc/40?u=curator', rating: 5.0 },
        bids: [
            {
                id: 'bid_1',
                user: { id: 'finder1', name: '@archive_dealer', avatar: 'https://i.pravatar.cc/40?u=archive', rating: 5.0 },
                price: 4400,
                condition: 'Excellent condition for its age, minor fading. From my personal collection.',
                findersNote: "Sourced from a trusted private collector in Japan. I've personally verified the condition and authenticity. This is a clean example of a notoriously fragile piece."
            }
        ]
    },
    {
        id: 4,
        seekers: 1,
        joined: true,
        name: "Travis Scott Jordan 1 Low",
        category: "Sneakers",
        details: "Size 9.5, Olive",
        upvotes: 203,
        topOffer: 720,
        comments: 0,
        commentsList: [],
        imageUrl: "images/travis.png",
        user: { id: 'u1', name: "@grailHunter", avatar: "https://i.pravatar.cc/40?u=user1", rating: 4.8, trustScore: 45 }, // Low Trust
        fundsVerified: true,
        privateBids: 3,
        duration: 7,
        createdAt: Date.now() - (6 * 24 * 60 * 60 * 1000),
        finder: null
    },
    {
        id: 3,
        seekers: 1,
        joined: false,
        name: "Margaret Keane: 'Big Eyes' Painting",
        category: "Collectibles",
        details: "1960, 'The Crying Girl'",
        upvotes: 45,
        topOffer: 850,
        comments: 0,
        commentsList: [],
        imageUrl: "images/margret.jpg",
        user: { id: 'u5', name: "@artcollectorjane", avatar: "https://i.pravatar.cc/40?u=user5", rating: 5.0, trustScore: 60 }, // Mid Trust
        fundsVerified: false,
        privateBids: 0,
        duration: 14,
        createdAt: Date.now() - (4 * 24 * 60 * 60 * 1000),
        finder: null
    },
    {
        id: 7,
        seekers: 42,
        joined: false,
        name: "KAWS Companion (Five Years Later)",
        category: "Collectibles",
        details: "Grey Vinyl, 2004, Opened but complete with box",
        upvotes: 315,
        topOffer: 2200,
        comments: 1,
        commentsList: [MOCK_COMMENTS[1]],
        imageUrl: "images/kaws.png",
        user: { id: 'u8', name: "@vinyl_king", avatar: "https://i.pravatar.cc/40?u=kaws", rating: 4.9, trustScore: 75 }, // Mid Trust
        fundsVerified: true,
        privateBids: 2,
        duration: 5,
        createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
        finder: null
    }
];

export const aiInsightsData: Record<string, string> = {
    "Jordan 1 Retro High 'Chicago'": "The Air Jordan 1 'Chicago' is arguably the most iconic sneaker ever created. Originally released in 1985, its 'Chicago' colorway is a cornerstone of sneaker culture, synonymous with Michael Jordan's rookie season. The 2022 'Reimagined' version added a vintage, aged look that was met with massive commercial success.",
    "Raf Simons 'Riot' Bomber Jacket": "The Autumn/Winter 2001 'Riot, Riot, Riot' bomber from Raf Simons is a seminal piece of modern menswear. Its oversized silhouette, a collage of patches (including iconic Richey Edwards and Manic Street Preachers references), and military surplus aesthetic defined a generation of fashion. It is considered a holy grail item for fashion archivists.",
    "Rolex Daytona 'Panda'": "The Rolex Daytona Ref. 116500LN with a white dial, nicknamed the 'Panda,' is one of the most sought-after luxury watches in the world. Its scarcity is manufactured; authorized dealers have notoriously long waitlists, often spanning years. This drives a hyper-inflated secondary market where the watch trades for more than double its retail price.",
    "KAWS Companion (Five Years Later)": "The 'Five Years Later' Companion is one of KAWS' most recognizable vinyl figures, bridging the gap between street art and high-end collectibles. Released in 2004, these figures have seen steady appreciation, particularly as KAWS gained mainstream art world recognition."
};
