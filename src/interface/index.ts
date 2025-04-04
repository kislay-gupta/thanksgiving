/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PostProps {
  id: number;
  persons: number;
  username: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  comments: any[];
}
