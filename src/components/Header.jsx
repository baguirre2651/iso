import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center pb-6 border-b border-gray-200">
      <a href="#" id="logo-link" className="flex items-center space-x-3 text-gray-900 no-underline">
        <div className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-lg shadow-md">
          <i data-lucide="search-check" className="w-6 h-6"></i>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">In Search Of</h1>
      </a>
      <nav className="hidden md:flex items-center space-x-6 text-sm">
        <a href="#" className="nav-link text-gray-600 hover:text-indigo-600 transition-colors" data-view="main-content">Hunts</a>
        <a href="#" className="nav-link text-gray-600 hover:text-indigo-600 transition-colors" data-view="my-iso-view">My ISO</a>
        <a href="#" className="nav-link text-gray-600 hover:text-indigo-600 transition-colors" data-view="finder-hub-view">Finder Hub</a>
        <a href="#" className="nav-link text-gray-600 hover:text-indigo-600 transition-colors" data-view="seller-portal-view">Seller Portal</a>
        <a href="#" className="nav-link text-gray-600 hover:text-indigo-600 transition-colors" data-view="how-it-works-view">How It Works</a>
      </nav>
      <div className="flex items-center space-x-3">
        <button id="messages-btn" className="text-gray-500 hover:text-indigo-600">
          <i data-lucide="message-square" className="w-6 h-6"></i>
        </button>
        <button id="post-iso-btn" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center space-x-2">
          <i data-lucide="plus-circle" className="w-5 h-5"></i>
          <span className="hidden md:inline">Create ISO</span>
          <span className="md:hidden">Post</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
