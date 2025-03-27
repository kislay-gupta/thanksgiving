import AdminRoute from "@/components/protected-route";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRoute>{children}</AdminRoute>;
}
