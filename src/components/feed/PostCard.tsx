/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { MessageSquare, RefreshCw, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth"; // Add this import
import { toast } from "sonner"; // Add this import

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { PostProps } from "@/interface";
import { baseUrl } from "@/constant";

interface PostProps {
  id: number;
  persons: number;
  username: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  comments: any[]; // Add proper type if available
}

const Post = ({
  content,

  id,
  created_at,
  username,
  likes_count,
  comments_count,
  shares_count,
}: PostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes_count);
  const { accessToken } = useAuth();

  const handleLike = async () => {
    try {
      if (!accessToken) {
        toast.error("Please login to like posts");
        return;
      }

      if (!isLiked) {
        // Like the post
        await axios.post(`${baseUrl}/api/messages/${id}/like/`, null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
        toast.success("Post liked!");
      } else {
        // Unlike the post
        await axios.delete(`${baseUrl}/api/messages/${id}/like/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
        toast.success("Post unliked!");
      }
    } catch (error) {
      console.error("Error handling like:", error);
      toast.error("Failed to update like status");
    }
  };

  return (
    <div
      className={cn("border-b cursor-auto my-2 rounded p-4 w-full")}
      style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex flex-col items-stretch space-x-3">
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-semibold truncate">@{username}</div>
              <div className="text-gray-300 text-sm">
                {format(new Date(created_at), "MM/dd/yyyy HH:mm:ss")}
              </div>
            </div>
          </div>
          <button className="text-brand-blue font-medium">Follow ⋯</button>
        </div>
        <div>
          <p className="mt-2 text-gray-800 break-words">{content}</p>
          <div className="flex w-full justify-between mt-3 text-gray-500 text-sm">
            <button
              className={`flex items-center space-x-1 ${
                isLiked ? "text-red-500" : ""
              }`}
              onClick={handleLike}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center space-x-1">
              <MessageSquare size={16} />
              <span>{comments_count}</span>
            </button>
            <button className="flex items-center space-x-1">
              <RefreshCw size={16} />
              <span>{shares_count}</span>
            </button>
            <button>
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
