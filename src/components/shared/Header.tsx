"use client";
import React, { useState } from "react";
import { SearchIcon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Header: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 bg-transparent  sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-blue-600 font-bold text-xl">
              GratitudeSphere
            </span>
          </Link>
        </div>

        {/* Search */}
        <div
          className={cn(
            "relative hidden md:block transition-all duration-300 ease-in-out",
            searchFocused ? "w-80" : "w-64"
          )}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-9 pl-10 pr-4 rounded-full bg-thanksgiving-light border border-transparent focus:border-thanksgiving-border focus:outline-none focus:ring-0 text-sm transition-all duration-200"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-thanksgiving-secondaryText" />
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className="text-thanksgiving-blue hover:text-thanksgiving-darkBlue transition-colors px-4 py-1 rounded-full text-sm font-medium"
          >
            Log in
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            Create account
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-thanksgiving-secondaryText hover:bg-thanksgiving-light transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile search & menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-thanksgiving-border animate-fade-in-up">
          <div className="px-4 py-3">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search"
                className="w-full h-9 pl-10 pr-4 rounded-full bg-thanksgiving-light border border-transparent focus:border-thanksgiving-border focus:outline-none focus:ring-0 text-sm"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-thanksgiving-secondaryText" />
            </div>
            <div className="flex flex-col space-y-3 py-2">
              <Link href="/signup" className="btn-primary text-center w-full">
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
