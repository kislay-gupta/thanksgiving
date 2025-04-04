/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Users, Compass, Bell, Bookmark, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProfileData } from "@/interface/profile";
import { useAuth } from "@/hooks/use-auth";
import useLoader from "@/hooks/user-loader";
import axios from "axios";
import { baseUrl } from "@/constant";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import LogoutModal from "@/components/modals/LogoutModal";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, X } from "lucide-react";
import { useFeedStore } from "@/store/feed-store";
import { Button } from "../ui/button";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { startLoading, isLoading, stopLoading } = useLoader();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const { accessToken, removeTokens } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { setShouldRefetch } = useFeedStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);

      // Create previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/messages/`,
        { content: postContent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success(response.data.message);
      setShouldRefetch(true);

      setIsOpen(false);
      setPostContent("");
      setFiles([]);
      setPreviews([]);
    } catch (error: any) {
      if (error.response?.data?.code === "token_not_valid") {
        console.error("Token expired. Please login again");
      } else {
        console.error("Error creating post:", error);
      }
    } finally {
      stopLoading();
    }
  };
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const handleLogout = async () => {
    // Implement logout logic here
    try {
      await removeTokens();
      redirect("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLogoutModalOpen(false);
    }
  };
  const fetchProfile = async () => {
    if (!accessToken) return;

    startLoading();
    const token = accessToken;
    try {
      const response = await axios.get(`${baseUrl}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Your session has expired. Please login again.");
          // You might want to trigger a logout or token refresh here
        } else {
          toast.error(
            error.response?.data?.message || "Failed to fetch profile data"
          );
        }
      }
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [accessToken, pathname]);
  const menuItems = [
    { icon: <Users size={20} />, label: "Communities", href: "/communities" },
    { icon: <Compass size={20} />, label: "Explore", href: "/explore" },
    {
      icon: <Bell size={20} />,
      label: "Notifications",
      href: "/notifications",
    },
    { icon: <Bookmark size={20} />, label: "Bookmarks", href: "/bookmarks" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex mx-4 justify-between h-16">
          <div className="flex flex-1 justify-between">
            <div className="flex-shrink-0 flex items-center mr-8">
              <Link href="/" className="text-blue-600 font-bold text-xl">
                GratitudeSphere
              </Link>
            </div>
            <div className="hidden sm:flex sm:space-x-8">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    pathname === item.href
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="sm:ml-6 my-auto sm:flex sm:items-center">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="bg-white hidden md:block p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Create post</span>
                  <PlusCircleIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Textarea
                        placeholder="What's happening?!"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="w-full min-h-[100px] text-lg border-0 focus-visible:ring-0 resize-none pt-3 px-0"
                      />

                      {previews.length > 0 && (
                        <div className="mt-3 rounded-xl overflow-hidden border">
                          <div className="relative">
                            {previews.map((preview, index) => (
                              <div key={index} className="relative group">
                                {files[index].type.startsWith("video/") ? (
                                  <video
                                    src={preview}
                                    className="w-full max-h-[400px] object-cover"
                                    controls
                                  />
                                ) : (
                                  <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full max-h-[400px] object-cover"
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/90 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t mt-3">
                        <div className="flex gap-1 text-blue-500">
                          <Label
                            htmlFor="media-upload"
                            className="cursor-pointer p-2 rounded-full hover:bg-blue-50"
                          >
                            <ImageIcon className="w-5 h-5" />
                            <Input
                              id="media-upload"
                              type="file"
                              multiple
                              accept="image/*,video/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </Label>
                        </div>
                        <Button
                          type="button"
                          className="rounded-full px-4 font-bold"
                          disabled={
                            isLoading && !postContent && files.length === 0
                          }
                          onClick={handleSubmit}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="ml-3 relative my-auto">
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {isLoading ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage
                        className="rounded-full object-cover"
                        src={profileData?.profile_picture_url}
                        alt="@Profile Pic"
                      />
                      <AvatarFallback className="rounded-full text-blue-600">
                        G
                      </AvatarFallback>
                    </Avatar>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={() => setIsLogoutModalOpen(true)}>
                      Log out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile menu button */}
          {/* <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div> */}
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {/* <div className="sm:hidden hidden">
        <div className="pt-2 pb-3 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center",
                pathname === item.href
                  ? "border-blue-500 text-blue-700 bg-blue-50"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div> */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </nav>
  );
};

export default Navbar;
