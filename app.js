// import { initializeLandingPage } from './landing.js';
// import { initializeHunts, renderFeed } from './hunts.js';
// import { initializeDashboard } from './dashboard.js';
// import { initializeModals } from './modals.js';
// import { initializeChat } from './chat.js';

// export let isoData = [
//   {
//     id: 1,
//     seekers: 1,
//     joined: false,
//     name: "Jordan 1 Retro High 'Chicago'",
//     category: "Sneakers",
//     details: "Size 10, New/Unworn",
//     upvotes: 112,
//     topOffer: 550,
//     comments: 12,
//     imageUrl: "images/jordan1.png",
//     user: { name: "@sneakerhead23", avatar: "https://i.pravatar.cc/40?u=user3", rating: 4.9 },
//     fundsVerified: true,
//     privateBids: 0,
//     duration: 30,
//     createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000), // Created 2 days ago
//     finder: null
//   },
//   {
//     id: 6,
//     seekers: 1,
//     joined: true, // Let's pretend the user created this one.
//     name: "Raf Simons 'Riot' Bomber Jacket",
//     category: "Archival Fashion",
//     details: "AW 2001, Size 50, Good condition",
//     upvotes: 88,
//     topOffer: 4500,
//     comments: 19,
//     imageUrl: "images/raf.png",
//     user: { name: "@archive_fiend", avatar: "https://i.pravatar.cc/40?u=user7", rating: 5.0 },
//     fundsVerified: true,
//     privateBids: 1,
//     duration: 14,
//     createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
//     finder: { name: '@TheCurator', specialty: 'Archival Fashion Expert', avatar: 'https://i.pravatar.cc/40?u=curator', rating: 5.0 }
//   },
//   {
//     id: 3,
//     seekers: 1,
//     joined: false,
//     name: "Margaret Keane: 'Big Eyes' Painting",
//     category: "Collectibles",
//     details: "1960, 'The Crying Girl'",
//     upvotes: 45,
//     topOffer: 850,
//     comments: 5,
//     imageUrl: "images/margret.jpg",
//     user: { name: "@artcollectorjane", avatar: "https://i.pravatar.cc/40?u=user5", rating: 5.0 },
//     fundsVerified: false,
//     privateBids: 0,
//     duration: 14,
//     createdAt: Date.now() - (4 * 24 * 60 * 60 * 1000),
//     finder: null
//   },
//   {
//     id: 4,
//     seekers: 1,
//     joined: false,
//     name: "Travis Scott Jordan 1 Low",
//     category: "Sneakers",
//     details: "Size 9.5, Olive",
//     upvotes: 203,
//     topOffer: 720,
//     comments: 25,
//     imageUrl: "images/travis.png",
//     user: { name: "@grailHunter", avatar: "https://i.pravatar.cc/40?u=user1", rating: 4.8 },
//     fundsVerified: true,
//     privateBids: 3,
//     duration: 7,
//     createdAt: Date.now() - (6 * 24 * 60 * 60 * 1000),
//     finder: null
//   },
//   {
//     id: 5,
//     seekers: 1,
//     joined: false,
//     name: "Rolex Daytona 'Panda'",
//     category: "Watches",
//     details: "116500LN, White Dial",
//     upvotes: 18,
//     topOffer: 28500,
//     comments: 32,
//     imageUrl: "images/rolexdaytona.png",
//     user: { name: "@watchguy", avatar: "https://i.pravatar.cc/40?u=user6", rating: 5.0 },
//     fundsVerified: false,
//     privateBids: 0,
//     duration: 30,
//     createdAt: Date.now() - (10 * 24 * 60 * 60 * 1000),
//     finder: null
//   }
// ];

// export const aiInsightsData = {
//     "Jordan 1 Retro High 'Chicago'": "The Air Jordan 1 'Chicago' is arguably the most iconic sneaker ever created. Originally released in 1985, its 'Chicago' colorway is a cornerstone of sneaker culture, synonymous with Michael Jordan's rookie season. The 2022 'Reimagined' version added a vintage, aged look that was met with massive commercial success. For collectors, condition and originality are key; a true 1985 pair is a museum piece, while the Reimagined version offers a more accessible entry into its legacy. The market for this shoe is consistently strong, making it a true blue-chip collectible.",
//     "Raf Simons 'Riot' Bomber Jacket": "The Autumn/Winter 2001 'Riot, Riot, Riot' bomber from Raf Simons is a seminal piece of modern menswear. Its oversized silhouette, a collage of patches (including iconic Richey Edwards and Manic Street Preachers references), and military surplus aesthetic defined a generation of fashion. It is considered a holy grail item for fashion archivists. Due to its age and rarity, finding one in good condition is exceptionally difficult. Its value is not just in its material, but its immense cultural significance and influence on subsequent designers. A true museum-quality piece.",
//     "Margaret Keane: 'Big Eyes' Painting": "Margaret Keane's Big Eyes paintings are defined by their signature, disproportionately large, doe-like eyes that dominate the canvas. The artworks typically feature women, children, and animals in styles ranging from melancholy and dark to joyful and bright, reflecting different periods of the artist's life.",
//     "Travis Scott Jordan 1 Low": "Travis Scott's collaborations with Nike are among the most influential of the modern era. His take on the Air Jordan 1, characterized by the reversed Swoosh, is his signature design element. These releases create a frenzy in the market due to Scott's cultural influence and the limited production numbers. The 'Olive' and 'Fragment' colorways are particularly coveted. Owning a pair signifies being in-the-know with current sneaker culture. The resale market is highly volatile but consistently high, reflecting its status as a modern classic.",
//     "Rolex Daytona 'Panda'": "The Rolex Daytona Ref. 116500LN with a white dial, nicknamed the 'Panda,' is one of the most sought-after luxury watches in the world. Its scarcity is manufactured; authorized dealers have notoriously long waitlists, often spanning years. This drives a hyper-inflated secondary market where the watch trades for more than double its retail price. The watch's appeal comes from its perfect proportions, ceramic bezel, racing heritage, and the status associated with the Rolex brand. It's considered a benchmark 'investment' watch by many collectors due to its strong and consistent value retention."
// };

// export const privateBidsData = {
//     4: [ // Travis Scott Jordan 1 Low
//         { user: '@resell_king', avatar: 'https://i.pravatar.cc/40?u=resell', price: 710, condition: 'Deadstock with original box. Can ship today.', rating: 4.9, findersNote: null },
//         { user: '@sneakerVault', avatar: 'https://i.pravatar.cc/40?u=vault', price: 680, condition: 'VNDS, worn once indoors. Includes extra laces.', rating: 5.0, findersNote: null, hasBuyback: true },
//         { user: '@kickzCircle', avatar: 'https://i.pravatar.cc/40?u=kickz', price: 725, condition: 'Perfect condition, OG all. Includes receipt.', rating: 4.7, findersNote: null },
//     ],
//     6: [ // Raf Simons 'Riot' Bomber Jacket
//         { user: '@archive_dealer', avatar: 'https://i.pravatar.cc/40?u=archive', price: 4400, condition: 'Excellent condition for its age, minor fading. From my personal collection.', rating: 5.0, findersNote: "Sourced from a trusted private collector in Japan. I've personally verified the condition and authenticity. This is a clean example of a notoriously fragile piece." }
//     ]
// };

// export function getDaysRemaining(createdAt, duration) {
//     const now = Date.now();
//     const expirationDate = createdAt + (duration * 24 * 60 * 60 * 1000);
//     const remainingTime = expirationDate - now;
    
//     if (remainingTime <= 0) {
//         return '<span class="text-red-500 font-semibold">Expired</span>';
//     }
    
//     const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
//     return `<span class="text-gray-500">Expires in ${remainingDays} day${remainingDays > 1 ? 's' : ''}</span>`;
// }

// export async function callGeminiAPI(userQuery, systemPrompt = "") {
//     console.log("Simulating Gemini API call with query:", userQuery);
//     const apiKey = ""; // API key is handled by the environment
//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     if (userQuery.includes("Generate a compelling description")) {
//         return "Seeking this iconic piece for a personal collection. Highly interested in items with good condition and provenance. Looking for a serious seller for a straightforward, secure transaction.";
//     }
//     if (userQuery.includes("difference between the 1985 and 2022 versions")) {
//         return "The original 1985 Air Jordan 1 'Chicago' features a different shape, higher-quality leather, and the original Nike Air branding. The 2022 'Reimagined' version is a tribute that uses artificially aged materials, a different box, and a shape closer to the '85 model than other retros, but it is distinctly a modern interpretation, not a 1-to-1 copy.";
//     }
//     if (aiInsightsData[userQuery]) {
//         return aiInsightsData[userQuery];
//     }

//     return "I can provide insights on specific collectibles, their history, and market standing. What would you like to know?";
// }

// export function switchView(viewId, options = {}) {
//     document.querySelectorAll('.main-content, .detail-view, .how-it-works-view, .my-iso-view, .finder-hub-view, .seller-portal-view, .landing-view').forEach(view => {
//         view.classList.remove('active');
//     });
//     const targetView = document.getElementById(viewId);
//     if(targetView) targetView.classList.add('active');
//     window.scrollTo(0, 0);

//     document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
//         link.classList.remove('active');
//         if (link.dataset.view === viewId) {
//             link.classList.add('active');
//         }
//     });
//      if(['how-it-works-view', 'my-iso-view', 'finder-hub-view', 'seller-portal-view', 'landing-view'].includes(viewId)){
//          lucide.createIcons();
//     }

//     if (viewId === 'main-content' && options.category) {
//         const filterBtn = document.getElementById('filter-bar').querySelector(`[data-category="${options.category}"]`);
//         if (filterBtn) {
//             filterBtn.click();
//         }
//     }

//     if (viewId === 'main-content') {
//         renderFeed(document.getElementById('filter-bar').querySelector('.active')?.dataset.category || 'All', document.getElementById('search-bar').value);
//     }

//     if (viewId === 'landing-view') {
//         setTimeout(() => {
//             document.querySelector('.hero-animate-in')?.classList.add('start-animation');
//         }, 100);
//     }
// }

// export function toggleModal(modal, show) { 
//     const modalBackdrop = document.getElementById('modal-backdrop');
//     if (show) { 
//         modalBackdrop.style.display = 'block'; 
//         modal.style.display = 'block'; 
//         modal.classList.add('animate-fade-in'); 
//     } else { 
//         modal.classList.remove('animate-fade-in'); 
//         modal.style.display = 'none'; 
//         modalBackdrop.style.display = 'none'; 
//     } 
// }

// export function showNotification(title, message, icon='check-circle', color='green') {
//     const container = document.getElementById('notification-container');
//     const notification = document.createElement('div');
//     notification.className = 'bg-white rounded-xl shadow-lg p-4 border border-gray-200 notification-enter-animation';
//     notification.innerHTML = `
//         <div class="flex items-start">
//             <div class="flex-shrink-0">
//                 <i data-lucide="${icon}" class="h-6 w-6 text-${color}-500"></i>
//             </div>
//             <div class="ml-3 w-0 flex-1 pt-0.5">
//                 <p class="text-sm font-medium text-gray-900">${title}</p>
//                 <p class="mt-1 text-sm text-gray-500">${message}</p>
//             </div>
//         </div>
//     `;
//     container.appendChild(notification);
//     lucide.createIcons();

//     setTimeout(() => {
//         notification.style.transition = 'opacity 0.5s ease';
//         notification.style.opacity = '0';
//         setTimeout(() => container.removeChild(notification), 500);
//     }, 5000);
// }

// function initializeApp() {
//     lucide.createIcons();
    
//     initializeLandingPage();
//     initializeHunts();
//     initializeDashboard();
//     initializeModals();
//     initializeChat();

//     switchView('landing-view');

//     // Global Event Listeners
//     document.querySelectorAll('.nav-link, .nav-link-mobile, #logo-link').forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();
//             const viewId = e.currentTarget.dataset.view || 'landing-view';
//             switchView(viewId);
//         });
//     });

//     const profileDropdownBtn = document.getElementById('profile-dropdown-btn');
//     const profileDropdown = document.getElementById('profile-dropdown');
//     profileDropdownBtn.addEventListener('click', () => {
//         profileDropdown.classList.toggle('hidden');
//     });

//     window.addEventListener('click', (e) => {
//         if (!profileDropdownBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
//             profileDropdown.classList.add('hidden');
//         }
//     });

//     const scrollElements = document.querySelectorAll('.animate-on-scroll');
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('is-visible');
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, { threshold: 0.1 });

//     scrollElements.forEach(el => {
//         observer.observe(el);
//     });
// }

// // Initialize the app after the DOM is fully loaded
// (function() {
//     function onDocumentReady(fn) {
//         if (document.readyState === 'complete' || document.readyState === 'interactive') {
//             setTimeout(fn, 1);
//         } else {
//             document.addEventListener('DOMContentLoaded', fn);
//         }
//     }

//     onDocumentReady(function() {
//         if (typeof lucide !== 'undefined') {
//             initializeApp();
//         } else {
//             console.error('Lucide library not found.');
//         }
//     });
// })();