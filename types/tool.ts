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
  // Workflow
  status?: 'published' | 'pending' | 'unpublished';
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  updatedAt?: string;
  // Tags for search and categorization
  tags?: string[];
  aiGeneratedTags?: boolean; // Track if tags were AI-generated
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
