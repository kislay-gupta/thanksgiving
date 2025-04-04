import AdminRoute from "@/components/protected-route";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="">
        <Navbar />
        <Sidebar />
        <main className="flex-1   bg-white min-h-screen border-x">
          {children}
        </main>
      </div>
    </AdminRoute>
  );
}
