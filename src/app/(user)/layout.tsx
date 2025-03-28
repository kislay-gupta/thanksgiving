// import AdminRoute from "@/components/protected-route";
import Sidebar from "@/components/shared/Sidebar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex">
        <Sidebar />

        <main className="flex-1   bg-white min-h-screen border-x">
          {children}
        </main>
      </div>
    </>
  );
}
