"use client";
import React from "react";
import ProfileCard from "./ProfileCard";
import { useProfile } from "@/hooks/use-profile";

interface ProfilePageProps {
  className?: string;
}

const ProfilePage = ({ className = "" }: ProfilePageProps) => {
  const { profileData, isLoading } = useProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return profileData ? (
    <div className={className}>
      <ProfileCard profile={profileData} />
    </div>
  ) : null;
};

export default ProfilePage;
