"use client";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

export const useAuth = () => {
  const cookies = new Cookies();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(
    () => cookies.get("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => cookies.get("refreshToken") || null
  );

  const saveTokens = async (
    newAccessToken: string,
    newRefreshToken: string
  ) => {
    try {
      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Tokens cannot be null or undefined");
      }

      // Set access token cookie - shorter lifetime
      cookies.set("accessToken", newAccessToken, {
        path: "/",
        // 15 minutes in seconds
        secure: true,
        sameSite: "strict",
      });

      // Set refresh token cookie - longer lifetime
      cookies.set("refreshToken", newRefreshToken, {
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        secure: true,
        sameSite: "strict",
      });

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    } catch (error) {
      console.error("Error saving tokens:", error);
      throw error;
    }
  };

  const loadTokens = async () => {
    try {
      const storedAccessToken = cookies.get("accessToken");
      const storedRefreshToken = cookies.get("refreshToken");

      if (storedAccessToken) setAccessToken(storedAccessToken);
      if (storedRefreshToken) setRefreshToken(storedRefreshToken);

      return {
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
      };
    } catch (error) {
      console.error("Error loading tokens:", error);
      return { accessToken: null, refreshToken: null };
    }
  };

  const removeTokens = async () => {
    try {
      cookies.remove("accessToken", { path: "/" });
      cookies.remove("refreshToken", { path: "/" });
      setAccessToken(null);
      setRefreshToken(null);
      router.replace("/login");
      console.log("Tokens removed"); // Add this line for debugging purpo
    } catch (error) {
      console.error("Error removing tokens:", error);
    }
  };

  useEffect(() => {}, [accessToken, refreshToken]);

  return {
    accessToken,
    refreshToken,
    saveTokens,
    loadTokens,
    removeTokens,
    isAuthenticated: Boolean(accessToken),
  };
};
