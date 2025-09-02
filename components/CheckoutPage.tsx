
import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import Spinner from './common/Spinner';
import { StripeIcon } from './icons/StripeIcon';
import { RazorpayIcon } from './icons/RazorpayIcon';
import Tooltip from './common/Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { UpiIcon } from './icons/UpiIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { NetBankingIcon } from './icons/NetBankingIcon';
import { WalletIcon } from './icons/WalletIcon';
import { CreditIcon } from './icons/CreditIcon';


type CheckoutMode = 'subscription' | 'topup';

interface CheckoutPageProps {
  mode: CheckoutMode;
  onPaymentSuccess: (type: CheckoutMode, amount?: number) => void;
  onBack: () => void;
}

type Gateway = 'stripe' | 'razorpay';
type RazorpayMethod = 'upi' | 'qrcode' | 'card' | 'netbanking' | 'wallet';

const TOPUP_OPTIONS = [
    { credits: 300, priceUSD: 3, priceINR: 250 },
    { credits: 550, priceUSD: 5, priceINR: 400 },
    { credits: 1000, priceUSD: 8, priceINR: 650 },
];

const CheckoutPage: React.FC<CheckoutPageProps> = ({ mode, onPaymentSuccess, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [gateway, setGateway] = useState<Gateway>('stripe');
  const [razorpayMethod, setRazorpayMethod] = useState<RazorpayMethod>('card');
  const [selectedTopUp, setSelectedTopUp] = useState(TOPUP_OPTIONS[0]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (mode === 'subscription') {
          onPaymentSuccess('subscription');
      } else {
          onPaymentSuccess('topup', selectedTopUp.credits);
      }
    }, 2000);
  };
  
  const CardForm = () => (
    <>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Email Address</label>
        <input type="email" id="email" defaultValue="demo.user@proai.com" className="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div>
        <label htmlFor="card-details" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Card Details</label>
        <div className="relative mt-1">
            <input type="text" id="card-details" placeholder="Card Number" className="block w-full px-3 py-2 pl-10 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
        <div className="flex space-x-4 mt-2">
          <input type="text" placeholder="MM / YY" className="block w-1/2 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          <input type="text" placeholder="CVC" className="block w-1/2 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Cardholder Name</label>
        <input type="text" id="name" placeholder="Full Name" className="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
    </>
  );

  const RazorpayPaymentMethod: React.FC<{icon: React.FC<{className?: string}>, label: string, method: RazorpayMethod}> = ({ icon: Icon, label, method }) => (
    <button type="button" onClick={() => setRazorpayMethod(method)} className={`flex-1 p-3 rounded-lg text-sm font-semibold flex flex-col items-center justify-center space-y-2 transition-all duration-200 border-2 ${razorpayMethod === method ? 'bg-indigo-50 dark:bg-slate-700/50 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-700 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600/50 text-slate-600 dark:text-slate-300'}`}>
      <Icon className="w-6 h-6" />
      <span>{label}</span>
    </button>
  );

  const SubscriptionDetails = () => (
    <>
      <div className="flex items-center mb-4">
        <SparklesIcon className="w-8 h-8 mr-3" />
        <h1 className="text-2xl font-bold">ProAI Plus</h1>
      </div>
      <p className="text-4xl font-bold mb-2">{gateway === 'stripe' ? '$10' : '₹850'}<span className="text-xl font-medium text-indigo-200">/month</span></p>
      <p className="text-indigo-200 mb-6">Unlock the full potential of AI-driven creativity.</p>
      <ul className="space-y-3 text-indigo-100 flex-1">
        <li className="flex items-center"><span className="bg-green-400 w-4 h-4 rounded-full mr-3 flex-shrink-0"></span>1,000 Daily Credits</li>
        <li className="flex items-center"><span className="bg-green-400 w-4 h-4 rounded-full mr-3 flex-shrink-0"></span>Advanced Prompt Architect</li>
        <li className="flex items-center"><span className="bg-green-400 w-4 h-4 rounded-full mr-3 flex-shrink-0"></span>Team Collaboration</li>
        <li className="flex items-center"><span className="bg-green-400 w-4 h-4 rounded-full mr-3 flex-shrink-0"></span>Priority Support</li>
      </ul>
    </>
  );

  const TopUpDetails = () => (
    <>
      <div className="flex items-center mb-4">
        <CreditIcon className="w-8 h-8 mr-3" />
        <h1 className="text-2xl font-bold">Top-up Credits</h1>
      </div>
      <p className="text-indigo-200 mb-6">Instantly add more credits to your account. One-time purchase.</p>
      <div className="space-y-3 flex-1">
        {TOPUP_OPTIONS.map(opt => (
          <button key={opt.credits} onClick={() => setSelectedTopUp(opt)} className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${selectedTopUp.credits === opt.credits ? 'bg-white/20 border-white' : 'border-transparent hover:bg-white/10'}`}>
            <p className="font-bold text-lg">{opt.credits} Credits</p>
            <p className="text-indigo-200">{gateway === 'stripe' ? `$${opt.priceUSD}` : `₹${opt.priceINR}`}</p>
          </button>
        ))}
      </div>
    </>
  );
  
  const priceDisplay = mode === 'subscription' 
    ? { usd: '$10.00', inr: '₹850.00' }
    : { usd: `$${selectedTopUp.priceUSD}.00`, inr: `₹${selectedTopUp.priceINR}.00` };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
          
          <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex flex-col">
            {mode === 'subscription' ? <SubscriptionDetails /> : <TopUpDetails />}
          </div>
          
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <button onClick={onBack} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 mb-4 self-start">&larr; Back to App</button>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Complete Your Purchase</h2>
            
            <div className="flex items-center border-b border-slate-200 dark:border-slate-700 mb-4">
              <button onClick={() => setGateway('stripe')} className={`py-2 px-4 text-sm font-semibold transition-colors border-b-2 ${gateway === 'stripe' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Stripe</button>
              <button onClick={() => setGateway('razorpay')} className={`py-2 px-4 text-sm font-semibold transition-colors border-b-2 ${gateway === 'razorpay' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Razorpay</button>
              <div className="ml-auto"><Tooltip text="For users in India, Razorpay offers more payment options like UPI. For all other users, Stripe is recommended."><span className="cursor-help text-slate-400 dark:text-slate-500"><InfoIcon className="w-5 h-5"/></span></Tooltip></div>
            </div>

            <form onSubmit={handlePayment} className="flex-1 flex flex-col space-y-4">
              {gateway === 'stripe' && <CardForm />}
              {gateway === 'razorpay' && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                     <RazorpayPaymentMethod icon={CreditCardIcon} label="Cards" method="card" />
                     <RazorpayPaymentMethod icon={UpiIcon} label="UPI" method="upi" />
                     <RazorpayPaymentMethod icon={QrCodeIcon} label="QR Code" method="qrcode" />
                     <RazorpayPaymentMethod icon={NetBankingIcon} label="Net Banking" method="netbanking" />
                     <RazorpayPaymentMethod icon={WalletIcon} label="Wallets" method="wallet" />
                  </div>
                  {razorpayMethod === 'card' && <CardForm />}
                  {razorpayMethod === 'upi' && <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-center text-sm"><p>Enter your UPI ID to proceed.</p></div>}
                  {razorpayMethod === 'qrcode' && <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-center text-sm"><p>Scan the QR code on the next screen.</p></div>}
                  {razorpayMethod === 'netbanking' && <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-center text-sm"><p>You will be redirected to select your bank.</p></div>}
                  {razorpayMethod === 'wallet' && <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-center text-sm"><p>Choose your preferred mobile wallet.</p></div>}
                </>
              )}
              
              <div className="pt-2 mt-auto">
                {gateway === 'stripe' ? (
                  <button type="submit" disabled={isProcessing} className="w-full flex justify-center items-center bg-[#635BFF] text-white font-semibold py-3 px-4 rounded-md shadow-lg hover:bg-[#574fde] transition-colors disabled:opacity-50">
                    {isProcessing ? <Spinner /> : <><StripeIcon className="w-14 h-auto mr-2" /> Pay {priceDisplay.usd}</>}
                  </button>
                ) : (
                   <button type="submit" disabled={isProcessing} className="w-full flex justify-center items-center bg-[#01224f] text-white font-semibold py-3 px-4 rounded-md shadow-lg hover:bg-[#0b2d5a] transition-colors disabled:opacity-50">
                    {isProcessing ? <Spinner /> : <><RazorpayIcon className="w-20 h-auto mr-2" /> Pay {priceDisplay.inr}</>}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
