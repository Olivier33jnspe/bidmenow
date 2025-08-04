import React, { useState } from 'react';
import { X, DollarSign, TrendingUp } from 'lucide-react';
import { Auction, Bid } from '../types';

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceBid: (auctionId: string, amount: number) => void;
  auction: Auction | null;
  currentUser: { id: string; name: string } | null;
}

export function PlaceBidModal({ isOpen, onClose, onPlaceBid, auction, currentUser }: PlaceBidModalProps) {
  const [bidAmount, setBidAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auction || !currentUser) return;
    
    const amount = parseFloat(bidAmount);
    if (amount <= auction.currentBid) {
      alert(`Bid must be higher than current bid of $${auction.currentBid}`);
      return;
    }

    onPlaceBid(auction.id, amount);
    onClose();
    setBidAmount('');
  };

  if (!isOpen || !auction) return null;

  const minBid = Math.max(auction.currentBid + 1, auction.minBid);
  const suggestedBids = [
    minBid,
    minBid + 5,
    minBid + 10,
    minBid + 20
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Place Your Bid</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{auction.title}</h3>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Current bid: <strong>${auction.currentBid}</strong></span>
              <span>Minimum bid: <strong>${minBid}</strong></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Your Bid Amount
              </label>
              <input
                type="number"
                required
                min={minBid}
                step="0.01"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
                placeholder={`$${minBid}`}
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-3">Quick bid options:</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedBids.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setBidAmount(amount.toString())}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center text-blue-800 mb-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="font-medium">Bidding Tips</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Bids are binding once placed</li>
                <li>• You'll be notified if outbid</li>
                <li>• Payment processed only if you win</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!currentUser}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentUser ? 'Place Bid' : 'Sign In to Bid'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}