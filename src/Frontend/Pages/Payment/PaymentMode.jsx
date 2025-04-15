import React, { useState } from 'react';
import { CreditCard, QrCode, Wallet } from 'lucide-react';

const PaymentMethodSelector = () => {
  const [activeTab, setActiveTab] = useState('card');

  const paymentTabs = [
    { 
      id: 'card', 
      icon: <CreditCard className="w-6 h-6" />, 
      label: 'Credit/Debit Card' 
    },
    { 
      id: 'upi', 
      icon: <QrCode className="w-6 h-6" />, 
      label: 'UPI' 
    },
    { 
      id: 'wallet', 
      icon: <Wallet className="w-6 h-6" />, 
      label: 'Wallet' 
    }
  ];
  useEffect(() => {
      document.title = "Make Your Payments";
  }, []);

  const renderPaymentForm = () => {
    switch(activeTab) {
      case 'card':
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full px-3 py-2 bg-transparent border-2 border-black-100 text-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Expiry</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  className="mt-1 block w-full px-3 py-2 bg-transparent border-2 border-black-100 text-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input 
                  type="text" 
                  placeholder="123"
                  className="mt-1 block w-full px-3 py-2  bg-transparent border-2 border-black-100 text-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        );
      case 'upi':
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">UPI ID</label>
              <input 
                type="text" 
                placeholder="yourname@upi"
                className="mt-1 block w-full px-3 py-2 bg-transparent border-2 border-black-100 text-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Select Wallet</label>
              <select 
                className="mt-1 block w-full px-3 py-2 bg-transparent border-2 border-black-100 text-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Paytm</option>
                <option>Google Pay</option>
                <option>PhonePe</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-h-screen  flex items-left justify-start p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-6 space-y-6">
        <div className="flex justify-between bg-gray-100 rounded-full p-1">
          {paymentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-indigo-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-200'}
              `}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {renderPaymentForm()}
        </div>

        <button 
          className="w-full bg-indigo-500 text-white py-3 rounded-full hover:bg-indigo-600 transition-colors duration-300 shadow-lg"
        >
          Submit Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;