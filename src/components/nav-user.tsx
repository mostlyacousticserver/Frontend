"use client";

import Link from "next/link";
import { ChevronsUpDown, ExternalLink, LogOut } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth();

  if (!user) return null;

  const fallback = initials(user.name) || "AD";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10 data-[state=open]:bg-white/10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:hover:bg-white/10"
            >
              <Avatar className="size-8 shrink-0 rounded-md group-data-[collapsible=icon]:size-7">
                <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                <AvatarFallback className="rounded-md bg-brand-orange text-xs font-semibold text-white">
                  {fallback}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-semibold">
                  {user.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-60 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-xl border-border/60 p-1.5 shadow-lg shadow-brand-navy/10"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-left">
                <Avatar className="size-9 shrink-0 rounded-md">
                  <AvatarImage
                    src={user.avatarUrl ?? undefined}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-md bg-brand-orange text-xs font-semibold text-white">
                    {fallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 leading-tight">
                  <span className="truncate text-sm font-semibold">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/60" />
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-2 py-2 text-sm font-medium"
            >
              <Link href="/">
                <ExternalLink />
                View site
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer rounded-lg px-2 py-2 text-sm font-medium"
              onClick={() => void logout()}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
