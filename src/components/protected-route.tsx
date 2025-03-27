"use client";

import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, loadToken } = useAuth();
  console.log(isAuthenticated);
  const tokenLoad = async () => {
    await loadToken();
  };
  useEffect(() => {
    tokenLoad();
    console.log(isAuthenticated, "use effect");
    if (!isAuthenticated) {
      redirect("/login");
    }
  }, [isAuthenticated]);
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
