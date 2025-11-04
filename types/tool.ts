export interface Tool {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  url: string;
  category: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  accentColor?: 'green' | 'blue' | 'purple';
  features?: string[];
  categoryColor?: string;
  createdAt: string;
  // Voting and ranking
  upvotes: number;
  downvotes: number;
  rating: number;
  ratingCount: number;
}

export interface VoteRequest {
  voteType: 'up' | 'down';
}

export interface RatingRequest {
  rating: number; // 1-5
}
