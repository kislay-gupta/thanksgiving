import { useState, useEffect } from "react";
import axios from "axios";
import { ProfileData } from "@/interface/profile";
import { useAuth } from "./use-auth";
import useLoader from "./user-loader";
import { toast } from "sonner";
import { baseUrl } from "@/constant";
import { usePathname } from "next/navigation";

export const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const { loadTokens, accessToken } = useAuth();
  const { isLoading, startLoading, stopLoading } = useLoader();
  const pathname = usePathname();

  const handleToken = async () => {
    // Skip loading tokens on login and signup pages
    if (pathname === "/login" || pathname === "/signup") return;
    await loadTokens();
  };

  useEffect(() => {
    handleToken();
  }, [pathname]);

  const fetchProfile = async () => {
    // Skip fetching profile on login and signup pages
    if (!accessToken || pathname === "/login" || pathname === "/signup") return;

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

  return {
    profileData,
    isLoading,
    refetchProfile: fetchProfile,
  };
};
