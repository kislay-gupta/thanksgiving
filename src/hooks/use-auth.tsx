"use client";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

export const useAuth = () => {
  const cookies = new Cookies();

  // Improved token retrieval with debugging
  const getToken = () => {
    try {
      const accessToken = cookies.get("access_token");
      console.log("Raw access token:", accessToken);

      // More robust token validation
      if (
        accessToken &&
        accessToken !== "undefined" &&
        accessToken !== "null" &&
        accessToken.trim() !== ""
      ) {
        return accessToken;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  // Initialize state with token check
  const [token, setToken] = useState<string | null>(() => getToken());

  // Add useEffect for additional debugging and state sync
  useEffect(() => {
    const checkToken = () => {
      const currentToken = getToken();
      console.log("Current token in useEffect:", currentToken);

      if (currentToken !== token) {
        setToken(currentToken);
      }
    };

    // Check token periodically
    const intervalId = setInterval(checkToken, 1000);

    // Initial check
    checkToken();

    // Cleanup interval
    return () => clearInterval(intervalId);
  }, []);

  const loadToken = () => {
    const storedToken = getToken();
    console.log("Loading token:", storedToken);

    if (storedToken) {
      setToken(storedToken);
    }
    return storedToken;
  };

  const removeToken = () => {
    try {
      // Remove tokens with more specific path handling
      cookies.remove("access_token", { path: "/" });
      cookies.remove("refresh_token", { path: "/" });
      setToken(null);
      console.log("Tokens removed");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  // Enhanced authentication check
  const isAuthenticated = (() => {
    const currentToken = getToken();
    const authenticated =
      !!currentToken &&
      currentToken !== "undefined" &&
      currentToken !== "null" &&
      currentToken.trim() !== "";

    console.log("Is Authenticated:", authenticated);
    console.log("Current Token:", currentToken);

    return authenticated;
  })();

  return {
    token,
    loadToken,
    removeToken,
    isAuthenticated,
  };
};
