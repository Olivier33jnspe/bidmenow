export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  profileImage: string;
  createdAt: Date;
}

export interface Auction {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in minutes
  minBid: number;
  currentBid: number;
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'live' | 'ended';
  tags: string[];
  bids: Bid[];
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
}