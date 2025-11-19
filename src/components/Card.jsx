import React from 'react';

const Card = ({ item }) => {
  const fundsVerifiedBadge = item.fundsVerified
    ? `<span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1"><i data-lucide="check-circle" class="w-3 h-3"></i><span>Funds Verified</span></span>`
    : '';
  const ratingHtml = item.user.rating ? `<span class="text-xs text-gray-500 flex items-center"><i data-lucide="star" class="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1"></i> ${item.user.rating}</span>` : '';
  const daysRemainingHtml = getDaysRemaining(item.createdAt, item.duration);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 flex justify-between items-start border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img src={item.user.avatar} className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <button className="font-semibold text-sm text-gray-800 hover:underline user-profile-link" data-username={item.user.name}>{item.user.name}</button>
            <div className="flex items-center space-x-2 mt-1">
              {ratingHtml}
              <span className="text-gray-300">|</span>
              <span className="text-xs">{daysRemainingHtml}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          {fundsVerifiedBadge}
        </div>
      </div>
      <div className="p-4 cursor-pointer view-details-btn" data-id={item.id}>
        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 bg-center bg-cover" style={{ backgroundImage: `url('${item.imageUrl}')` }}>
        </div>
        <h3 className="font-bold text-lg truncate text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600 truncate">{item.details}</p>
        <p className="text-sm font-semibold text-gray-800 mt-2">Top Offer: <span className="text-green-600">${item.topOffer.toLocaleString()}</span></p>
      </div>
      <div className="p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex space-x-4">
          <button data-id={item.id} className="upvote-btn flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors">
            <i data-lucide="arrow-up-circle" className="w-5 h-5"></i>
            <span className="font-semibold text-sm upvote-count">{item.upvotes}</span>
          </button>
          <button data-id={item.id} className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors">
            <i data-lucide="message-square" className="w-5 h-5"></i>
            <span className="font-semibold text-sm">{item.comments}</span>
          </button>
        </div>
        <button data-id={item.id} className="view-details-btn text-sm font-semibold text-indigo-600 hover:underline">View Hunt</button>
      </div>
    </div>
  );
};

export default Card;
