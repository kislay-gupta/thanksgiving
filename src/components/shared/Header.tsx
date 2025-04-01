"use client";
import React, { useEffect, useState } from "react";
import { SearchIcon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const Header: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, loadTokens } = useAuth();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const tokenLoad = async () => {
    setLoading(true);
    await loadTokens();
    setLoading(false);
  };

  useEffect(() => {
    tokenLoad();
    console.log("isAuthenticated", isAuthenticated);
  }, [pathname]); // Add pathname as a dependency to run effect on route change

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
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : isAuthenticated ? (
            <div className="text-black">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-thanksgiving-blue hover:text-thanksgiving-darkBlue transition-colors px-4 py-1 rounded-full text-sm font-medium"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary text-sm">
                Create account
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-thanksgiving-secondaryText hover:bg-thanksgiving-light transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile search & menu */}
    </header>
  );
};

export default Header;
