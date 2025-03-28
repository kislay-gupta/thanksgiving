"use client";
import React from "react";
import {
  Home,
  Users,
  Compass,
  Bell,
  Bookmark,
  PlusCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    { icon: <Home size={20} />, label: "Home", href: "/" },
    { icon: <Users size={20} />, label: "Communities", href: "/communities" },
    { icon: <Compass size={20} />, label: "Explore", href: "/explore" },
    {
      icon: <Bell size={20} />,
      label: "Notifications",
      href: "/notifications",
    },
    { icon: <Bookmark size={20} />, label: "Bookmarks", href: "/bookmarks" },
    {
      icon: <PlusCircleIcon size={20} />,
      label: "Create a Post",
      href: "/bookmarks",
    },
  ];

  return (
    <aside className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto  bg-white md:bg-transparent z-50 md:flex flex-col border-r h-auto md:h-[calc(100vh-4rem)] md:sticky md:top-16 w-full md:w-16 items-center py-2 md:py-4">
      <div className="max-w-screen-sm mx-auto px-4 md:px-0 md:w-auto flex md:flex-col justify-between md:justify-start ">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex flex-col items-center justify-center p-2 md:p-3 hover:bg-gray-800 md:hover:bg-gray-100 rounded-lg md:mb-2"
            title={item.label}
          >
            <div
              className={`${
                pathname === item.href ? "text-blue-500" : "text-gray-700"
              }`}
            >
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
