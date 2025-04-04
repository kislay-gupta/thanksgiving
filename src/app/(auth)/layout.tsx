import Header from "@/components/shared/Header";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Header />
      <div className="">{children}</div>
    </div>
  );
}
