"use client";
import { useEffect } from "react";
import Cookies from "universal-cookie";
export default function Home() {
  const cookies = new Cookies();
  useEffect(() => {
    console.log(cookies.get("access_token"), "cookies");
    cookies.get("access_token");
  }, []);
  return (
    <div className="min-h-screen bg-thanksgiving-light">
      <main className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <h1>Coming Soon</h1>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
