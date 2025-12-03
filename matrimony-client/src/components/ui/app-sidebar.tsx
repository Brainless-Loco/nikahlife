"use client";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { adminLinks } from "../features/admin/adminLinks";

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();

  const isRouteActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === url ||
      (pathname?.startsWith(url + "/") && pathname !== "/dashboard")
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-0 bg-[#1a1c37] text-white"
      style={{ "--sidebar-width-icon": "80px" } as React.CSSProperties}
    >
      <SidebarHeader className="border-b border-indigo-900/30 px-6 py-4">
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pink-800 text-white shadow-md">
            {/* <ShoppingBag className="h-5 w-5" /> */}
            <Image
              width={200}
              height={200}
              src={"https://images.com"}
              alt="dashboard-logo"
            />
          </div>

          <Link href="/">
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-bold text-black">Nikah</span>
              <span className="text-xs text-black">Find Soulmate</span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium uppercase tracking-wider text-black">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminLinks.map((item) => (
                <SidebarMenuItem key={item.title} className="text-black">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          className={cn(
                            "my-1 transition-all hover:bg-indigo-500/10",
                            isRouteActive(item.url) &&
                              "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white",
                            isCollapsed
                              ? "p-3 flex justify-center"
                              : "p-2.5 rounded-md"
                          )}
                        >
                          <Link
                            href={item.url}
                            className={cn(
                              "flex items-center gap-3",
                              isCollapsed && "justify-center w-full"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "transition-all",
                                isCollapsed ? "h-10 w-10" : "h-10 w-10"
                              )}
                            />
                            <span
                              className={cn(
                                "font-medium",
                                isCollapsed && "hidden"
                              )}
                            >
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        hidden={!isCollapsed}
                        className="bg-[#1a1c37] text-white border-indigo-900/50"
                      >
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-indigo-900/30 p-4">
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
            <User className="h-5 w-5 text-indigo-200" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-white">
                  Alex Johnson
                </span>
                <span className="text-xs text-indigo-200/70">Store Admin</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
      <SidebarRail className="after:bg-indigo-900/30 hover:after:bg-indigo-700/50" />
    </Sidebar>
  );
}
