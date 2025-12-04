
import React from 'react';
import { Search, Clock, CheckCircle, AlertCircle, ShieldCheck, ArrowRight, Plus } from 'lucide-react';
import { IsoItem } from '../types';

interface DashboardProps {
    items: IsoItem[];
    onViewDetails: (id: number) => void;
    onViewMessages: (itemName: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ items, onViewDetails, onViewMessages }) => {
    const myHunts = items.filter(item => item.joined && !item.acquired);
    const myCollection = items.filter(item => item.acquired);
    const actionItems = myHunts.filter(item => item.privateBids > 0);

    return (
        <div className="space-y-12 animate-fade-in max-w-5xl mx-auto pb-20">
            <div className="flex items-end justify-between pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 font-swiss">My Hub</h2>
                    <p className="text-gray-500 mt-2 font-medium">Track your hunts, review messages, and manage your collection.</p>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-sm font-bold text-gray-900">{myHunts.length}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Active Hunts</div>
                </div>
            </div>

            {/* Action Required Section */}
            {actionItems.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-indigo-600" /> New Messages
                    </h3>
                    <div className="grid gap-4">
                        {actionItems.map(item => (
                            <div key={item.id} className="bg-white p-5 rounded-2xl premium-shadow border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
                                <div className="flex items-center gap-5 w-full sm:w-auto">
                                    <div className="w-20 h-20 bg-gray-100 rounded-xl bg-cover bg-center shrink-0 shadow-inner" style={{ backgroundImage: `url('${item.imageUrl}')` }}></div>
                                    <div>
                                        <p className="font-bold text-lg text-gray-900 font-swiss">{item.name}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{item.privateBids} New Message{item.privateBids > 1 ? 's' : ''}</span>
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onViewMessages(item.name)}
                                    className="w-full sm:w-auto bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    View Chat <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Active Hunts Section */}
            <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4" /> Active Hunts
                </h3>
                {myHunts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myHunts.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all group cursor-pointer" onClick={() => onViewDetails(item.id)}>
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${item.imageUrl}')` }}></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-gray-900 truncate pr-2">{item.name}</p>
                                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs mt-2">
                                            <span className="font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded">Budget: ${item.topOffer.toLocaleString()}</span>
                                            {item.fundsVerified ? (
                                                <span className="text-blue-700 bg-blue-50 font-bold px-2 py-1 rounded flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>
                                            ) : (
                                                <span className="text-gray-500 bg-gray-50 font-bold px-2 py-1 rounded flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg">No active hunts</h3>
                        <p className="text-sm text-gray-500 mt-1">You aren't looking for anything right now.</p>
                    </div>
                )}
            </section>

            {/* My Collection Section */}
            <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" /> My Collection
                </h3>
                {myCollection.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {myCollection.map(item => (
                            <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                                <div className="aspect-square bg-gray-100 rounded-xl bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url('${item.imageUrl}')` }}>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                </div>
                                <div className="mt-3 px-1">
                                    <p className="font-bold text-sm text-gray-900 truncate">{item.name}</p>
                                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mt-1">Acquired • ${item.acquired?.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gradient-to-b from-white to-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Your collection is empty</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Items you successfully purchase through Finders will appear here.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
