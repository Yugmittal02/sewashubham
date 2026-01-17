import React, { useState, useEffect, useCallback } from 'react';
import { FaTag, FaChevronDown, FaCheckCircle, FaPercent, FaRupeeSign, FaExclamationCircle } from 'react-icons/fa';
import { fetchOffers } from '../services/api';

const OffersDropdown = ({ orderTotal = 0, onOfferSelect, selectedOffer = null }) => {
  const [offers, setOffers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchOffers();
      const data = response?.data || [];
      
      // Safely filter offers with defensive checks
      const activeOffers = Array.isArray(data) 
        ? data.filter(offer => 
            offer && 
            offer.isActive && 
            (!offer.minOrderValue || orderTotal >= offer.minOrderValue)
          )
        : [];
      
      setOffers(activeOffers);
    } catch (err) {
      console.error('Error loading offers:', err);
      setError('Failed to load offers');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, [orderTotal]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const calculateDiscount = useCallback((offer) => {
    if (!offer) return 0;
    
    const total = Number(orderTotal) || 0;
    const discountValue = Number(offer.discountValue) || 0;
    
    if (offer.discountType === 'percentage') {
      return Math.round(total * (discountValue / 100));
    }
    return discountValue;
  }, [orderTotal]);


  const handleSelectOffer = (offer) => {
    const discount = calculateDiscount(offer);
    onOfferSelect?.({
      ...offer,
      calculatedDiscount: discount
    });
    setIsOpen(false);
  };

  const handleRemoveOffer = (e) => {
    e.stopPropagation();
    onOfferSelect?.(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-gray-100 animate-pulse">
        <div className="h-14 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  if (offers.length === 0 && !selectedOffer) {
    return null;
  }

  return (
    <div className="relative">
      {/* Selected Offer Display or Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 rounded-3xl border-2 flex items-center gap-4 transition-all ${
          selectedOffer
            ? 'border-green-400 bg-green-50'
            : 'border-gray-200 bg-white hover:border-orange-300'
        }`}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          selectedOffer
            ? 'bg-gradient-to-br from-green-400 to-emerald-500'
            : 'bg-gradient-to-br from-orange-400 to-orange-500'
        }`}>
          <FaTag className="text-white text-lg" />
        </div>
        
        <div className="flex-1 text-left">
          {selectedOffer ? (
            <>
              <p className="font-bold text-gray-800">{selectedOffer.title}</p>
              <p className="text-sm text-green-600 font-semibold">
                You save ₹{selectedOffer.calculatedDiscount}!
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-gray-800">Available Offers</p>
              <p className="text-sm text-gray-500">
                {offers.length} offer{offers.length !== 1 ? 's' : ''} available
              </p>
            </>
          )}
        </div>

        {selectedOffer ? (
          <button
            onClick={handleRemoveOffer}
            className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors"
          >
            Remove
          </button>
        ) : (
          <FaChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && offers.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
          <div className="p-2 max-h-[300px] overflow-y-auto">
            {offers.map((offer) => {
              const discount = calculateDiscount(offer);
              const isSelected = selectedOffer?._id === offer._id;
              
              return (
                <button
                  key={offer._id}
                  onClick={() => handleSelectOffer(offer)}
                  className={`w-full p-4 rounded-xl flex items-start gap-3 transition-all mb-1 last:mb-0 ${
                    isSelected
                      ? 'bg-green-50 border-2 border-green-400'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    offer.discountType === 'percentage'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {offer.discountType === 'percentage' ? <FaPercent /> : <FaRupeeSign />}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-800">{offer.title}</p>
                      {isSelected && <FaCheckCircle className="text-green-500" />}
                    </div>
                    {offer.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{offer.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-bold">
                        {offer.discountType === 'percentage' 
                          ? `${offer.discountValue}% OFF` 
                          : `₹${offer.discountValue} OFF`}
                      </span>
                      <span className="text-xs text-gray-400">
                        Save ₹{discount}
                      </span>
                    </div>
                  </div>

                  {offer.code && (
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-600">
                      {offer.code}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OffersDropdown;
