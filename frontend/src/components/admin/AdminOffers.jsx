import React from 'react';
import { FaTicketAlt, FaTrash, FaPlus, FaCalendarAlt, FaMoneyBillWave, FaEdit, FaUsers, FaRupeeSign } from 'react-icons/fa';

const AdminOffers = ({ offers, onAdd, onEdit, onDelete }) => {
    const isExpired = (offer) => offer.validTo && new Date(offer.validTo) < new Date();
    const isUpcoming = (offer) => offer.validFrom && new Date(offer.validFrom) > new Date();

    return (
        <div className="px-4 pb-20 pt-4">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-30 pb-4">
                <h2 className="text-2xl font-black text-gray-800">Offers</h2>
                <button
                    onClick={onAdd}
                    className="bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-200 active:scale-95 transition-transform"
                >
                    <FaPlus size={12} /> Create Offer
                </button>
            </div>

            <div className="space-y-4">
                {offers.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <FaTicketAlt className="text-5xl mx-auto mb-4 opacity-30" />
                        <p className="font-medium">No offers yet</p>
                        <p className="text-sm mt-1">Create your first offer to attract customers</p>
                    </div>
                ) : (
                    offers.map((offer) => (
                        <div
                            key={offer._id}
                            className={`bg-white p-4 rounded-2xl shadow-sm border relative overflow-hidden ${!offer.isActive ? 'border-gray-200 opacity-60' :
                                    isExpired(offer) ? 'border-red-100' :
                                        isUpcoming(offer) ? 'border-blue-100' :
                                            'border-green-100'
                                }`}
                        >
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3 z-10">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${!offer.isActive ? 'bg-gray-100 text-gray-500' :
                                        isExpired(offer) ? 'bg-red-100 text-red-600' :
                                            isUpcoming(offer) ? 'bg-blue-100 text-blue-600' :
                                                'bg-green-100 text-green-600'
                                    }`}>
                                    {!offer.isActive ? 'INACTIVE' :
                                        isExpired(offer) ? 'EXPIRED' :
                                            isUpcoming(offer) ? 'UPCOMING' : 'ACTIVE'}
                                </span>
                            </div>

                            <div className="relative z-10 flex gap-4">
                                {/* Coupon Code vertical strip */}
                                <div className="bg-amber-100 rounded-xl px-2 py-4 flex flex-col items-center justify-center border border-dashed border-amber-300 min-w-[70px]">
                                    <span className="text-amber-700 font-bold text-lg rotate-180 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
                                        {offer.code}
                                    </span>
                                    <FaTicketAlt className="text-amber-500 mt-2" />
                                </div>

                                <div className="flex-1 py-1">
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 pr-16">{offer.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{offer.description}</p>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-gray-50 px-2 py-1.5 rounded-lg flex items-center gap-1.5 text-gray-600">
                                            <FaMoneyBillWave className="text-green-500" />
                                            <span className="font-bold">
                                                {offer.discountType === 'percentage'
                                                    ? `${offer.discountValue}% OFF${offer.maxDiscount ? ` (max ₹${offer.maxDiscount})` : ''}`
                                                    : `₹${offer.discountValue} OFF`}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 px-2 py-1.5 rounded-lg flex items-center gap-1.5 text-gray-600">
                                            <FaCalendarAlt className="text-blue-500" />
                                            <span>
                                                {offer.validTo ? new Date(offer.validTo).toLocaleDateString() : 'No Expiry'}
                                            </span>
                                        </div>
                                        {offer.minOrderValue > 0 && (
                                            <div className="bg-gray-50 px-2 py-1.5 rounded-lg flex items-center gap-1.5 text-gray-600">
                                                <FaRupeeSign className="text-amber-500" size={10} />
                                                <span>Min ₹{offer.minOrderValue}</span>
                                            </div>
                                        )}
                                        {(offer.maxUsageCount !== null && offer.maxUsageCount !== undefined) && (
                                            <div className="bg-gray-50 px-2 py-1.5 rounded-lg flex items-center gap-1.5 text-gray-600">
                                                <FaUsers className="text-purple-500" size={10} />
                                                <span>{offer.usedCount || 0}/{offer.maxUsageCount} used</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => onEdit(offer)}
                                            className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                                        >
                                            <FaEdit size={11} /> Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(offer._id)}
                                            className="px-4 py-2 rounded-lg bg-red-50 text-red-500 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                                        >
                                            <FaTrash size={11} /> Delete
                                        </button>
                                    </div>

                                    {offer.image && (
                                        <div className="mt-3 h-24 w-full rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${offer.image})` }}>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminOffers;
