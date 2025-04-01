"use client";
import React from "react";
import { MessageSquare, RefreshCw, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostProps } from "@/interface";

const Post = ({ content, persons, id, created_at }: PostProps) => {
  return (
    <div
      className={cn("border-b cursor-auto p-4 w-full  ")}
      onClick={() => console.log(id)}
    >
      <div className="flex flex-col items-stretch  space-x-3">
        <div className="flex justify-between  w-full items-center">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-semibold truncate">{persons}</div>
              <div className="text-gray-300 text-sm">
                @{persons} ·{" "}
                {format(new Date(created_at), "MM/dd/yyyy HH:mm:ss")}
              </div>
            </div>
          </div>
          <button className="text-brand-blue font-medium">Follow ⋯</button>
        </div>
        <div>
          <p className="mt-2 text-gray-800 break-words">{content}</p>
          {/* {image && (
            <div className="mt-3 rounded-xl overflow-hidden ">
              <Image
                src={image}
                alt="Post image"
                className="aspect-[3/4] h-fit w-fit object-cover"
                width={300}
                height={400}
              />
            </div>
          )} */}
          <div className="flex  w-full justify-between mt-3 text-gray-500 text-sm">
            <button className="flex items-center space-x-1">
              <Heart size={16} />
              <span>16</span>
            </button>
            <button className="flex items-center space-x-1">
              <MessageSquare size={16} />
              <span>42</span>
            </button>
            <button className="flex items-center space-x-1">
              <RefreshCw size={16} />
              <span>8</span>z
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
