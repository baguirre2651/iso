
import React from 'react';
import { MessageCircle, UserCheck, Search, ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';

const HowItWorks: React.FC = () => {
    return (
        <div className="animate-fade-in space-y-16 pb-12">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 font-swiss">The Open Protocol</h2>
                <p className="text-lg text-gray-500 mt-4 leading-relaxed">
                    We are a pure connection engine. We introduce the Buyer to the Finder, then we get out of the way.
                </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-center text-indigo-600 mb-4">Connect & Leave</h3>
                <p className="text-center text-gray-600 leading-relaxed">
                    Traditional marketplaces trap you with fees and restrictions. <strong className="text-indigo-600">We are an open bulletin board.</strong> Use our tools to find the item, then move to <span className="font-bold text-gray-900">Instagram, Grailed, PayPal, eBay, or WhatsApp</span> to handle the money and shipping. Deal on your terms, on your preferred platform.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start max-w-6xl mx-auto">
                {/* Step 1 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col h-full">
                    <div className="mx-auto bg-indigo-100 text-indigo-600 w-12 h-12 flex items-center justify-center rounded-full mb-4 flex-shrink-0">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">1. Post Your ISO</h3>
                    <p className="text-sm text-gray-600 mt-auto">Tell us what you want. Our AI extracts the details and broadcasts the signal.</p>
                </div>
                {/* Step 2 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col h-full">
                    <div className="mx-auto bg-indigo-100 text-indigo-600 w-12 h-12 flex items-center justify-center rounded-full mb-4 flex-shrink-0">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">2. Signal Sent</h3>
                    <p className="text-sm text-gray-600 mt-auto">Vetted Finders and private sellers receive the alert and check their inventory.</p>
                </div>
                {/* Step 3 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col h-full">
                    <div className="mx-auto bg-indigo-100 text-indigo-600 w-12 h-12 flex items-center justify-center rounded-full mb-4 flex-shrink-0">
                        <Search className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">3. Direct DM</h3>
                    <p className="text-sm text-gray-600 mt-auto">A Finder messages you directly on our platform with photos and a price.</p>
                </div>
                {/* Step 4 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col h-full">
                    <div className="mx-auto bg-indigo-100 text-indigo-600 w-12 h-12 flex items-center justify-center rounded-full mb-4 flex-shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">4. Verify Identity</h3>
                    <p className="text-sm text-gray-600 mt-auto">Check their profile, rating, and history. Ask for a FaceTime or tagged photo.</p>
                </div>
                 {/* Step 5 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col h-full">
                    <div className="mx-auto bg-indigo-100 text-indigo-600 w-12 h-12 flex items-center justify-center rounded-full mb-4 flex-shrink-0">
                        <ExternalLink className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">5. Transact Anywhere</h3>
                    <p className="text-sm text-gray-600 mt-auto">Move to PayPal, Grailed, or eBay to pay. We take no fee on the transaction.</p>
                </div>
            </div>

            {/* Disclaimer Section */}
            <div className="mt-16 bg-gray-50 border border-gray-200 p-8 rounded-sm">
                 <div className="flex items-start gap-4 max-w-4xl mx-auto">
                    <div className="text-gray-400 mt-1"><AlertTriangle className="w-6 h-6" /></div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-mono uppercase">Disclaimer of Liability</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">
                            In Search Of (ISO) serves solely as a connection utility. We connect buyers with potential sellers/finders.
                            We are <strong className="text-gray-900">NOT</strong> responsible for:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600 list-disc pl-5">
                            <li>Processing payments or holding funds</li>
                            <li>Mediation or dispute resolution</li>
                            <li>Shipping, logistics, or customs</li>
                            <li>Authentication of goods (unless explicitly stated)</li>
                            <li>Chargebacks or refunds</li>
                            <li>Escrow services</li>
                        </ul>
                        <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-200">
                            Users are strongly encouraged to use protected payment methods (PayPal Goods & Services, Grailed, eBay) when transacting with new connections.
                        </p>
                        <p className="text-[10px] text-gray-300 mt-2">
                            * All third-party trademarks (including but not limited to Instagram, Grailed, eBay, PayPal, WhatsApp) are the property of their respective owners. ISO is not affiliated, associated, authorized, endorsed by, or in any way officially connected with these companies. References to these platforms are for informational purposes only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
