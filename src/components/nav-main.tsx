"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type NavMainItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
};

/** One active treatment, shared by top-level items and their sub-items. */
const activeClass =
  "data-[active=true]:bg-brand-orange data-[active=true]:text-white data-[active=true]:shadow-[0_8px_18px_rgb(255_106_0_/_0.28)] data-[active=true]:hover:bg-brand-orange-hover data-[active=true]:hover:text-white";

const navButtonClass = cn(
  "rounded-lg text-sidebar-foreground/80 hover:bg-white/10 hover:text-white data-[state=open]:hover:bg-white/10 data-[state=open]:hover:text-white data-[active=true]:data-[state=open]:hover:bg-brand-orange-hover",
  activeClass,
);

const navSubButtonClass = cn(
  "rounded-md text-sidebar-foreground/70 hover:bg-white/10 hover:text-white",
  activeClass,
);


/**
 * Section match. Only a full path segment counts, so /admin/courses does not
 * light up for /admin/courses-archive, and /admin is an exact match because
 * every other route sits under it.
 */
function isUnder(pathname: string, url: string) {
  if (url === "/admin") return pathname === "/admin";
  return pathname === url || pathname.startsWith(`${url}/`);
}

/**
 * The deepest matching child wins, so /admin/courses/new marks "New course"
 * while /admin/courses/<id> falls back to the list entry it was opened from.
 */
function activeChildUrl(pathname: string, items?: { url: string }[]) {
  return items
    ?.filter((item) => isUnder(pathname, item.url))
    .sort((a, b) => b.url.length - a.url.length)[0]?.url;
}

export function NavMain({
  label,
  items,
}: {
  label: string;
  items: NavMainItem[];
}) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  // On the icon rail the sub-items are hidden, so the parent has to carry the
  // active marker there. Everywhere else the matching child carries it alone.
  const isRail = state === "collapsed" && !isMobile;
  // Manual toggles win until the route changes, then sections follow the URL
  // again. Without this the group stays shut when you land on a detail page
  // from another section, since the sidebar never unmounts. Tagging the state
  // with its pathname expires it on navigation without an effect.
  const [toggled, setToggled] = useState<{
    path: string;
    open: Record<string, boolean>;
  }>({ path: pathname, open: {} });
  const openOverrides = toggled.path === pathname ? toggled.open : {};

  return (
    <SidebarGroup className="px-1 group-data-[collapsible=icon]:px-0">
      <SidebarGroupLabel className="mb-1 px-3 text-[11px] font-semibold tracking-[0.18em] text-brand-teal uppercase">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
        {items.map((item) => {
          const hasChildren = Boolean(item.items?.length);
          const isActive = isUnder(pathname, item.url);
          const childUrl = activeChildUrl(pathname, item.items);

          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className={navButtonClass}
                >
                  <Link href={item.url}>
                    {item.icon ? <item.icon /> : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              open={openOverrides[item.title] ?? isActive}
              onOpenChange={(open) =>
                setToggled({
                  path: pathname,
                  open: { ...openOverrides, [item.title]: open },
                })
              }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive && (isRail || !childUrl)}
                    className={navButtonClass}
                  >
                    {item.icon ? <item.icon /> : null}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="ml-3.5 border-white/15">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.url === childUrl}
                          className={navSubButtonClass}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
