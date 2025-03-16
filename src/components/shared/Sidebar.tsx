"use client";
import React from "react";
import Link from "next/link";
import { Home, BookHeart, Users, Calendar, Camera, Laptop, Search, Plus } from "lucide-react";

const Sidebar = () => {
  const categories = [
    { name: "Home", href: "/", icon: Home },
    { name: "Gratitude", href: "/category/gratitude", icon: BookHeart },
    { name: "Personal Stories", href: "/category/personal-stories", icon: Users },
    { name: "Daily Prompts", href: "/category/daily-prompts", icon: Calendar },
    { name: "Photography", href: "/category/photography", icon: Camera },
    { name: "Technology", href: "/category/technology", icon: Laptop },
  ];

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-16 bg-black flex flex-col items-center py-4">
      <div className="flex-1 flex flex-col items-center space-y-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.name}
              href={category.href}
              className="text-white/70 hover:text-white transition-colors p-3 rounded-lg hover:bg-white/10"
              title={category.name}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
      <div className="mt-auto flex flex-col items-center space-y-4 mb-4">
        <button
          className="text-white/70 hover:text-white transition-colors p-3 rounded-lg hover:bg-white/10"
          title="Search"
        >
          <Search size={20} />
        </button>
        <button
          className="text-white/70 hover:text-white transition-colors p-3 rounded-lg hover:bg-white/10"
          title="Add New"
        >
          <Plus size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;