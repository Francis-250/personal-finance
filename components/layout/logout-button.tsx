"use client";

import { logout } from "@/app/actions/auth.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton({ children, ...props }) {
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
