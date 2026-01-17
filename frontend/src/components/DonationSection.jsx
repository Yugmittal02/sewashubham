import React, { useState } from 'react';
import { FaHeart, FaHandHoldingHeart } from 'react-icons/fa';

const DonationSection = ({ onDonationChange, customerName = '' }) => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const presetAmounts = [5, 10, 50, 100];

  const handlePresetSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    onDonationChange?.(amount);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 2000);
  };

  const handleCustomChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setSelectedAmount(0);
    const numValue = parseInt(value) || 0;
    onDonationChange?.(numValue);
    if (numValue > 0) {
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 2000);
    }
  };

  const clearDonation = () => {
    setSelectedAmount(0);
    setCustomAmount('');
    onDonationChange?.(0);
  };

  const currentDonation = selectedAmount || parseInt(customAmount) || 0;

  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-5 border border-pink-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
          <FaHandHoldingHeart className="text-white text-xl" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-base">Make a Donation</h3>
          <p className="text-xs text-gray-500">Support a good cause with your order</p>
        </div>
      </div>

      {/* Thank You Animation */}
      {showThankYou && currentDonation > 0 && (
        <div className="mb-4 animate-pulse bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 rounded-2xl text-center">
          <div className="flex items-center justify-center gap-2">
            <FaHeart className="animate-bounce" />
            <span className="font-bold">
              Thank you{customerName ? `, ${customerName}` : ''}! 💕
            </span>
          </div>
        </div>
      )}

      {/* Preset Amount Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handlePresetSelect(amount)}
            className={`py-3 rounded-xl font-bold text-base transition-all active:scale-95 ${
              selectedAmount === amount
                ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-pink-300'
            }`}
          >
            ₹{amount}
          </button>
        ))}
      </div>

      {/* Custom Amount Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
          <input
            type="text"
            value={customAmount}
            onChange={handleCustomChange}
            placeholder="Other amount"
            className={`w-full pl-8 pr-4 py-3 rounded-xl text-base font-bold border-2 transition-all ${
              customAmount
                ? 'border-pink-400 bg-pink-50'
                : 'border-gray-200 bg-white'
            }`}
          />
        </div>
        {currentDonation > 0 && (
          <button
            onClick={clearDonation}
            className="px-4 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Selected Amount Display */}
      {currentDonation > 0 && (
        <div className="mt-4 flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-pink-200">
          <span className="text-gray-600 font-medium">Donation Amount</span>
          <span className="text-pink-600 font-black text-lg">+ ₹{currentDonation}</span>
        </div>
      )}
    </div>
  );
};

export default DonationSection;
