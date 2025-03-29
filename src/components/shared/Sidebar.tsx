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
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Smile, MapPin, Calendar, X } from "lucide-react";
import {
  Image as ImageIcon,
  Gift as GifIcon,
  List as PollIcon,
} from "lucide-react";
import { baseUrl } from "@/constant";
import axios from "axios";
import Cookie from "universal-cookie";
const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [postContent, setPostContent] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const cookie = new Cookie();
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
    console.log(cookie.get("access_token"));
    try {
      const response = await axios.post(
        `${baseUrl}/api/messages/`,
        { content: postContent },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Post created:", response.data);
      setIsOpen(false);
      setPostContent("");
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

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

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button
              className="flex flex-col items-center justify-center p-2 md:p-3 hover:bg-gray-800 md:hover:bg-gray-100 rounded-lg md:mb-2"
              title="Create a Post"
            >
              <div className="text-gray-700">
                <PlusCircleIcon size={20} />
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/default-avatar.jpg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="What's happening?!"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full min-h-[100px] text-lg border-0 focus-visible:ring-0 resize-none pt-3 px-0"
                  />

                  {/* Media preview */}
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

                  {/* Twitter-style action buttons */}
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
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-blue-50"
                      >
                        <GifIcon className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-blue-50"
                      >
                        <PollIcon className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-blue-50"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-blue-50"
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-blue-50"
                      >
                        <MapPin className="w-5 h-5" />
                      </button>
                    </div>
                    <Button
                      type="button"
                      className="rounded-full px-4 font-bold"
                      disabled={!postContent && files.length === 0}
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
      </div>
    </aside>
  );
};

export default Sidebar;
