// app/hooks/useAuth.js
"use client";

import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

export const useAuth = () => {
  // Create an instance of universal-cookie
  const cookies = new Cookies();

  // Function to get the access token from cookies
  const getToken = () => {
    try {
      const accessToken = cookies.get("access_token");
      console.log("Raw access token:", accessToken);

      // Validate token to ensure it exists and is not a falsy value
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

  // Initialize state with the token from cookies
  const [token, setToken] = useState(() => getToken());

  // Use an effect to periodically check if the token has changed
  useEffect(() => {
    const checkToken = () => {
      const currentToken = getToken();
      console.log("Current token in useEffect:", currentToken);

      if (currentToken !== token) {
        setToken(currentToken);
      }
    };

    // Check token every second
    const intervalId = setInterval(checkToken, 1000);

    // Run an initial check
    checkToken();

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [token]);

  // Function to explicitly reload the token
  const loadToken = () => {
    const storedToken = getToken();
    console.log("Loading token:", storedToken);
    if (storedToken) {
      setToken(storedToken);
    }
    return storedToken;
  };

  // Function to remove the tokens from cookies (simulate logout)
  const removeToken = () => {
    try {
      // Remove tokens with the path specified
      cookies.remove("access_token", { path: "/" });
      cookies.remove("refresh_token", { path: "/" });
      setToken(null);
      console.log("Tokens removed");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  // Check authentication based on the current token
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
