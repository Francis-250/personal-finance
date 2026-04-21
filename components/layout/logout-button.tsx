"use client";

import { logout } from "@/app/_action/auth.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

interface LogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} {...props}>
      {children || "Logout"}
    </Button>
  );
}
