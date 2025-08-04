import React, { useState } from 'react';
import { X, Clock, DollarSign, FileText, Tag, Calendar } from 'lucide-react';
import { Auction } from '../types';

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAuction: (auction: Omit<Auction, 'id' | 'currentBid' | 'bids' | 'status'>) => void;
  userId: string;
}

export function CreateAuctionModal({ isOpen, onClose, onCreateAuction, userId }: CreateAuctionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Language Learning',
    duration: 60,
    minBid: 25,
    tags: '',
    startTime: ''
  });

  const categories = [
    'Language Learning',
    'Fitness Coaching',
    'Career Advice',
    'Creative Skills',
    'Tech Support',
    'Music Lessons',
    'Cooking',
    'Business Consulting'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startTime = new Date(formData.startTime);
    const endTime = new Date(startTime.getTime() + formData.duration * 60000);

    const auction = {
      sellerId: userId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      duration: formData.duration,
      minBid: formData.minBid,
      startTime,
      endTime,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    onCreateAuction(auction);
    onClose();
    setFormData({
      title: '',
      description: '',
      category: 'Language Learning',
      duration: 60,
      minBid: 25,
      tags: '',
      startTime: ''
    });
  };

  if (!isOpen) return null;

  // Set minimum datetime to current time
  const now = new Date();
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Auction</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                Auction Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 1-Hour French Conversation Practice"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what you're offering..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  required
                  min="15"
                  max="480"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Minimum Bid
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.minBid}
                  onChange={(e) => setFormData({ ...formData, minBid: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Start Time
              </label>
              <input
                type="datetime-local"
                required
                min={minDateTime}
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-2" />
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="conversational, beginner-friendly, etc."
              />
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold"
              >
                Create Auction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}