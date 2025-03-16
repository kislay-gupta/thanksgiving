"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  image: string;
  title: string;
  subtitle: string;
  author: string;
}

const Card: React.FC<CardProps> = ({ image, title, subtitle, author }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative rounded-xl overflow-hidden aspect-[4/3] card-hover">
      <div
        className={cn(
          "absolute inset-0 image-loading",
          isLoaded ? "hidden" : "block"
        )}
      ></div>
      <img
        src={image}
        alt={title}
        className={cn(
          "object-cover w-full h-full",
          isLoaded ? "opacity-100" : "opacity-0",
          "transition-opacity duration-500"
        )}
        onLoad={() => setIsLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="text-xs text-white/80 mb-1">{subtitle}</div>
        <h3 className="font-bold text-sm">{title}</h3>
        <div className="text-xs mt-1 text-white/80">By {author}</div>
      </div>
    </div>
  );
};

const FeaturedCards = () => {
  const cards = [
    {
      image:
        "https://images.unsplash.com/photo-1480497490787-505ec076689f?auto=format&fit=crop&q=80&w=500",
      title: "Finding Joy in the Small Things",
      subtitle: "GRATITUDE",
      author: "Jane Smith",
    },
    {
      image:
        "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?auto=format&fit=crop&q=80&w=500",
      title: "Nature's Gifts to the World",
      subtitle: "PHOTOGRAPHY",
      author: "Michael Stevens",
    },
    {
      image:
        "https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?auto=format&fit=crop&q=80&w=500",
      title: "What Are You Grateful For?",
      subtitle: "DAILY PROMPT",
      author: "Community Team",
    },
    {
      image:
        "https://images.unsplash.com/photo-1531908012224-8f8865e79a96?auto=format&fit=crop&q=80&w=500",
      title: "How Being Thankful Changed My Life",
      subtitle: "PERSONAL STORY",
      author: "Claire Wells",
    },
    {
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500",
      title: "Expressing Gratitude in the Digital Age",
      subtitle: "TECHNOLOGY",
      author: "Marcus Feng",
    },
  ];

  return (
    <div className="w-full overflow-hidden animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
      <div className="relative mt-8 mb-4">
        <div className="py-8 bg-[url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative text-center px-4 py-8 mx-auto max-w-2xl">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
              Express Your Gratitude
            </h2>
            <p className="text-white/80 mb-4 text-sm">
              Share moments of thankfulness with our community and discover what
              others are grateful for
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCards;
