import React from "react";
import { ProfileData } from "@/interface/profile";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  profile: ProfileData;
  className?: string;
}

const ProfileCard = ({ profile, className = "" }: ProfileCardProps) => {
  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Picture Section */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            <Image
              src={profile.profile_picture_url}
              alt={profile.fullname}
              fill
              className="object-cover"
            />
          </div>

          {/* Profile Info Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{profile.fullname}</h2>
            <p className="text-gray-600">@{profile.username}</p>
            <p className="text-gray-500 text-sm">{profile.email}</p>
            <p className="mt-3 hidden text-gray-700">
              {profile.bio || "No bio yet"}
            </p>
          </div>

          {/* Stats Section */}
          <div className="hidden justify-center gap-8 w-full py-4 border-y">
            <div className="text-center">
              <div className="font-bold">{profile.posts || 0}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{profile.followers || 0}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{profile.following || 0}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className=" hidden gap-3">
            <Button variant="default">Follow</Button>
            <Button variant="outline">Message</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
