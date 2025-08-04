import React, { useState } from 'react';
import { Clock, Users, Star, Calendar, Video, Heart, Zap, ArrowRight, Play, MessageCircle } from 'lucide-react';
import { CreateProfileModal } from './components/CreateProfileModal';
import { CreateAuctionModal } from './components/CreateAuctionModal';
import { PlaceBidModal } from './components/PlaceBidModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { User, Auction, Bid } from './types';

function App() {
  // State management
  const [users, setUsers] = useLocalStorage<User[]>('bidmenow_users', []);
  const [auctions, setAuctions] = useLocalStorage<Auction[]>('bidmenow_auctions', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('bidmenow_current_user', null);
  
  // Modal states
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showCreateAuction, setShowCreateAuction] = useState(false);
  const [showPlaceBid, setShowPlaceBid] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  
  // Sample auction state (for demo)
  const [currentBid, setCurrentBid] = useState(45);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 12 });

  // Create sample auction if none exist
  React.useEffect(() => {
    if (auctions.length === 0) {
      const sampleAuction: Auction = {
        id: 'sample-1',
        sellerId: 'olivier-123',
        title: '1-Hour Live French Coaching Session',
        description: 'Personal French conversation practice with immediate feedback. Perfect for intermediate learners wanting to boost confidence and fluency.',
        category: 'Language Learning',
        duration: 60,
        minBid: 25,
        currentBid: 45,
        startTime: new Date(Date.now() - 30 * 60000), // Started 30 minutes ago
        endTime: new Date(Date.now() + 2.5 * 60 * 60000), // Ends in 2.5 hours
        status: 'live',
        tags: ['Conversational', '1-on-1', 'Video Call'],
        bids: [
          { id: '1', auctionId: 'sample-1', bidderId: 'user1', bidderName: 'Sarah M.', amount: 45, timestamp: new Date() },
          { id: '2', auctionId: 'sample-1', bidderId: 'user2', bidderName: 'Mike_learns', amount: 42, timestamp: new Date(Date.now() - 5 * 60000) },
          { id: '3', auctionId: 'sample-1', bidderId: 'user3', bidderName: 'FrenchFan22', amount: 38, timestamp: new Date(Date.now() - 10 * 60000) }
        ]
      };
      setAuctions([sampleAuction]);
    }
  }, [auctions.length, setAuctions]);

  // Handle profile creation
  const handleCreateProfile = (profileData: Omit<User, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newUser: User = {
      ...profileData,
      id: `user_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date()
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  // Handle auction creation
  const handleCreateAuction = (auctionData: Omit<Auction, 'id' | 'currentBid' | 'bids' | 'status'>) => {
    const newAuction: Auction = {
      ...auctionData,
      id: `auction_${Date.now()}`,
      currentBid: auctionData.minBid,
      bids: [],
      status: new Date() >= auctionData.startTime ? 'live' : 'upcoming'
    };
    
    setAuctions([...auctions, newAuction]);
  };

  // Handle bid placement
  const handlePlaceBid = (auctionId: string, amount: number) => {
    if (!currentUser) return;
    
    const newBid: Bid = {
      id: `bid_${Date.now()}`,
      auctionId,
      bidderId: currentUser.id,
      bidderName: currentUser.name,
      amount,
      timestamp: new Date()
    };

    setAuctions(auctions.map(auction => {
      if (auction.id === auctionId) {
        return {
          ...auction,
          currentBid: amount,
          bids: [newBid, ...auction.bids]
        };
      }
      return auction;
    }));
  };

  // Handle bid button click
  const handleBidClick = () => {
    const sampleAuction = auctions.find(a => a.id === 'sample-1');
    if (sampleAuction) {
      setSelectedAuction(sampleAuction);
      setShowPlaceBid(true);
    }
  };

  // Simulate live bidding
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCurrentBid(prev => prev + Math.floor(Math.random() * 5) + 1);
      }
      
      setTimeLeft(prev => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
          if (newMinutes < 0) {
            newMinutes = 59;
            newHours -= 1;
          }
        }
        
        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">BidMeNow</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it works</a>
            <a href="#browse" className="text-gray-300 hover:text-white transition-colors">Browse</a>
            <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🔥 LIVE AUCTIONS HAPPENING NOW
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Auction Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> Time</span>
              <br />
              Bid on
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500"> Experiences</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              The world's first live auction platform where real people auction their time and skills. 
              Connect directly, learn instantly, experience authentically.
            </p>
          </div>

          {/* Main CTAs */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-20">
            <button className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-3">
              onClick={() => currentUser ? setShowCreateAuction(true) : setShowCreateProfile(true)}
              <Users className="h-6 w-6" />
              <span>{currentUser ? 'Create New Auction' : 'I want to auction myself'}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-3">
              <Heart className="h-6 w-6" />
              <span>I want to bid on someone</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Live Auction Showcase */}
      <section className="px-6 py-16 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">🔴 LIVE AUCTION</h2>
            <p className="text-gray-300">See how it works with a real auction happening now</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Section */}
              <div className="md:w-1/3">
                <div className="relative">
                  <img 
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" 
                    alt="Olivier - French Teacher" 
                    className="w-full aspect-square rounded-xl object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900">Olivier Dubois</h3>
                  <p className="text-gray-600">French Teacher & Coach</p>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(127 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Auction Details */}
              <div className="md:w-2/3">
                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    1-Hour Live French Coaching Session
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Personal French conversation practice with immediate feedback. 
                    Perfect for intermediate learners wanting to boost confidence and fluency.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Conversational</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">1-on-1</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Video Call</span>
                  </div>
                </div>

                {/* Current Bid */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Current Highest Bid</p>
                      <p className="text-3xl font-bold">${currentBid}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-100 text-sm">Time Left</p>
                      <p className="text-xl font-bold">
                        {String(timeLeft.hours).padStart(2, '0')}:
                        {String(timeLeft.minutes).padStart(2, '0')}:
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bidding Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-xl font-bold hover:scale-105 transition-all duration-300">
                    onClick={handleBidClick}
                    {currentUser ? 'Place Bid' : 'Sign In to Bid'}
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-300 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-300 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>

                {/* Recent Bids */}
                <div className="mt-6">
                  <h5 className="font-semibold text-gray-900 mb-3">Recent Bids</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Sarah M.</span>
                      <span className="font-semibold">${currentBid}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Mike_learns</span>
                      <span className="font-semibold">${currentBid - 3}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">FrenchFan22</span>
                      <span className="font-semibold">${currentBid - 7}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How BidMeNow Works</h2>
            <p className="text-xl text-gray-300">Three simple steps to connect and experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* For Sellers */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">1. Create Your Auction</h3>
              <p className="text-gray-300">
                Set up your profile, describe your skills, and create time slots for auction. 
                Set your minimum bid and duration.
              </p>
            </div>

            {/* The Process */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">2. Live Bidding</h3>
              <p className="text-gray-300">
                People bid on your time in real-time auctions. Watch bids come in and 
                connect with your winning bidder instantly.
              </p>
            </div>

            {/* For Buyers */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">3. Connect & Experience</h3>
              <p className="text-gray-300">
                Meet via video call, chat, or in-person. Learn, share experiences, 
                and build genuine connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="px-6 py-16 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Popular Categories</h2>
            <p className="text-gray-300">Discover amazing experiences from real people</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Language Learning', count: '127 live', color: 'from-blue-500 to-cyan-500' },
              { name: 'Fitness Coaching', count: '89 live', color: 'from-green-500 to-emerald-500' },
              { name: 'Career Advice', count: '156 live', color: 'from-purple-500 to-pink-500' },
              { name: 'Creative Skills', count: '203 live', color: 'from-orange-500 to-red-500' },
            ].map((category, index) => (
              <div key={index} className={`bg-gradient-to-br ${category.color} p-6 rounded-xl text-white text-center hover:scale-105 transition-transform cursor-pointer`}>
                <h3 className="font-bold mb-2">{category.name}</h3>
                <p className="text-sm opacity-90">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of people already connecting through live auctions
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-all duration-300 shadow-2xl">
              Start Auctioning Your Time
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-all duration-300 shadow-2xl">
              Browse Live Auctions
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Zap className="h-6 w-6 text-yellow-400" />
              <span className="text-xl font-bold text-white">BidMeNow</span>
              {currentUser && (
                <span className="ml-4 text-sm text-gray-300">
                  Welcome, {currentUser.name}!
                </span>
              )}
            </div>
            <div className="flex space-x-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 BidMeNow. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateProfileModal
        isOpen={showCreateProfile}
        onClose={() => setShowCreateProfile(false)}
        onCreateProfile={handleCreateProfile}
      />
      
      <CreateAuctionModal
        isOpen={showCreateAuction}
        onClose={() => setShowCreateAuction(false)}
        onCreateAuction={handleCreateAuction}
        userId={currentUser?.id || ''}
      />
      
      <PlaceBidModal
        isOpen={showPlaceBid}
        onClose={() => setShowPlaceBid(false)}
        onPlaceBid={handlePlaceBid}
        auction={selectedAuction}
        currentUser={currentUser ? { id: currentUser.id, name: currentUser.name } : null}
      />
    </div>
  );
}

export default App;