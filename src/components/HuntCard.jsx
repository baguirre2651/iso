import React from 'react';

const HuntCard = ({ item }) => {
  const fundsVerifiedBadge = item.fundsVerified
    ? (
      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-green-700">
        <i data-lucide="check-circle" className="w-3.5 h-3.5"></i>
        <span>Verified</span>
      </div>
      )
    : null;

  const seekersHtml = item.seekers > 1
    ? <span className="text-xs font-bold text-gray-500">+{item.seekers - 1} seeker{item.seekers > 2 ? 's' : ''}</span>
    : '';

  return (
    <div className="group view-details-btn flex flex-col rounded-2xl p-3 transition-all hover:shadow-xl cursor-pointer" data-id={item.id}>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-4">
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        {fundsVerifiedBadge}
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{item.name}</h3>
        <p className="text-sm text-gray-500 truncate">{item.details}</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Top Offer</p>
            <p className="text-xl font-bold text-gray-900">${item.topOffer.toLocaleString()}</p>
          </div>
          {seekersHtml}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center space-x-4 text-gray-400">
          <span className="flex items-center text-sm font-bold"><i data-lucide="arrow-up-circle" className="w-4 h-4 mr-1.5"></i> {item.upvotes}</span>
          <span className="flex items-center text-sm font-bold"><i data-lucide="message-square" className="w-4 h-4 mr-1.5"></i> {item.comments}</span>
        </div>
      </div>
    </div>
  );
};

export default HuntCard;