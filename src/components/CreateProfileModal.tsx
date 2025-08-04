import React, { useState } from 'react';
import { X, User, Mail, FileText, Tag } from 'lucide-react';
import { User as UserType } from '../types';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (profile: Omit<UserType, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
}

export function CreateProfileModal({ isOpen, onClose, onCreateProfile }: CreateProfileModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      profileImage: formData.profileImage
    };

    onCreateProfile(profile);
    onClose();
    setFormData({ name: '', email: '', bio: '', skills: '', profileImage: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Your Profile</h2>
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
                <User className="h-4 w-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                Bio
              </label>
              <textarea
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tell people about yourself and what you offer..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-2" />
                Skills (comma-separated)
              </label>
              <input
                type="text"
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="French, Teaching, Conversation, etc."
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold"
              >
                Create Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}