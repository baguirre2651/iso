import React from 'react';
import HuntCard from './HuntCard';

const HuntsFeed = ({ isoData }) => {
  // In a real app, state for filters and search would be managed here
  const [filter, setFilter] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = isoData
    .filter(item => filter === 'All' || item.category === filter)
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Hunts</h1>
      <p className="mt-2 text-lg text-gray-500">Browse what collectors are searching for.</p>

      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow md:flex-grow-0 md:w-80">
          <input type="search" placeholder="Search for items, brands, or users..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setSearchTerm(e.target.value)} />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i data-lucide="search" className="w-5 h-5 text-gray-400"></i>
          </div>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          {['All', 'Sneakers', 'Archival Fashion', 'Collectibles', 'Watches'].map(category => (
            <button key={category} onClick={() => setFilter(category)} className={`filter-btn flex-shrink-0 font-semibold py-2 px-4 rounded-full shadow-sm transition-colors ${filter === category ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}>
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredData.map(item => <HuntCard key={item.id} item={item} />)}
      </div>
    </div>
  );
};

export default HuntsFeed;