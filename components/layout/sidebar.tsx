"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Repeat,
  PiggyBank,
  BarChart,
  Settings,
  ChevronLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const sidebarLinks = [
  {
    name: "Overview",
    href: "/user",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    href: "/user/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Pots",
    href: "/user/pots",
    icon: Wallet,
  },
  {
    name: "Recurring bills",
    href: "/user/recurring-bills",
    icon: Repeat,
  },
  {
    name: "Budget",
    href: "/user/budget",
    icon: PiggyBank,
  },
  {
    name: "Reports",
    href: "/user/reports",
    icon: BarChart,
  },
  {
    name: "Settings",
    href: "/user/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out bg-background border-r flex flex-col",
          collapsed ? "w-17.5" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b">
          {!collapsed && (
            <span className="font-bold text-lg truncate">Personal Finance</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("hidden md:flex", collapsed && "mx-auto")}
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180",
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-2 px-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground",
                        collapsed && "justify-center px-2",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{link.name}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">{link.name}</TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="mt-auto border-t p-4">
          {!collapsed && (
            <div className="text-xs text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} Personal Finance
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
