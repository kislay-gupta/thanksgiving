import { useState, useEffect } from "react";
import axios from "axios";
import { ProfileData } from "@/interface/profile";
import { useAuth } from "./use-auth";
import useLoader from "./user-loader";
import { toast } from "sonner";
import { baseUrl } from "@/constant";
import { redirect } from "next/navigation";

export const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const { loadTokens, accessToken } = useAuth();
  const { isLoading, startLoading, stopLoading } = useLoader();
  const handleToken = async () => {
    await loadTokens();
  };
  useEffect(() => {
    handleToken();
  }, []);
  const fetchProfile = async () => {
    startLoading();
    try {
      const response = await axios.get(`${baseUrl}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProfileData(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
        
        }
        toast.error(error.message);
      }
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profileData,
    isLoading,
    refetchProfile: fetchProfile,
  };
};
