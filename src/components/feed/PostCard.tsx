import React from "react";
import { MessageSquare, RefreshCw, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PostProps {
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  image?: string;
  video?: boolean;
  stats: {
    likes: number;
    comments: number;
    reposts: number;
  };
  className?: string;
}

const Post = ({ user, content, image, video, stats, className }: PostProps) => {
  return (
    <div className={cn("border-b p-4", className)}>
      <div className="flex items-start space-x-3">
        <Image
          src={user.avatar}
          alt={user.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">{user.name}</span>{" "}
              <span className="text-gray-500">@{user.username}</span>
            </div>
            <button className="text-brand-blue font-medium">Follow ⋯</button>
          </div>

          <p className="mt-2 text-gray-800">{content}</p>

          {image && (
            <div className="mt-3 rounded-xl overflow-hidden relative max-h-[512px]">
              <Image
                src={image}
                alt="Post image"
                width={800}
                height={450}
                className="w-full h-full object-contain"
              />
              {video && (
                <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  VIDEO
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-3 text-gray-500 text-sm">
            <button className="flex items-center space-x-1">
              <Heart size={16} />
              <span>{stats.likes}</span>
            </button>
            <button className="flex items-center space-x-1">
              <MessageSquare size={16} />
              <span>{stats.comments}</span>
            </button>
            <button className="flex items-center space-x-1">
              <RefreshCw size={16} />
              <span>{stats.reposts}</span>
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
