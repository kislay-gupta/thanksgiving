"use client";

import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Loader from "./shared/Loader";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, loadTokens } = useAuth();
  const tokenLoad = async () => {
    await loadTokens();
  };
  useEffect(() => {
    tokenLoad();
    if (!isAuthenticated) {
      redirect("/login");
    }
  }, [isAuthenticated]);
  if (!isAuthenticated) {
    return <Loader />;
  }

  return <>{children}</>;
}
