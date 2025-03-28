// app/components/MyComponent.js
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function Test() {
  const { token, loadToken, removeToken, isAuthenticated } = useAuth();
  useEffect(() => {
    console.log("To:", document.cookie);
    console.log("Is Authenticated:", isAuthenticated);
  });

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>User is {isAuthenticated ? "Authenticated" : "Not Authenticated"}</h1>
      <p>
        <strong>Token:</strong> {token ? token : "No token available"}
      </p>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={loadToken} style={{ marginRight: "1rem" }}>
          Reload Token
        </button>
        <button onClick={removeToken}>Log Out</button>
      </div>
    </div>
  );
}
