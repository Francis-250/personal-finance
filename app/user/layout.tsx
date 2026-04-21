"use client";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { authClient } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await authClient.getSession();
        setUser(data?.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          collapsed ? "md:ml-17.5" : "md:ml-64",
        )}
      >
        <Header
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user={user}
          collapsed={collapsed}
        />

        <main className="container mx-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
