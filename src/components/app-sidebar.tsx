import * as React from "react";
import {
  ArrowLeftRight,
  Bot,
  ChartLine,
  ClipboardCheck,
  Wallet,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "./sidebar-logo";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Flowlet Assistant",
      url: "/",
      icon: Bot,
      isActive: true,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: ArrowLeftRight,
    },
    {
      title: "Stakes",
      url: "/stakes",
      icon: ChartLine,
    },
    {
      title: "Rules",
      url: "/rules",
      icon: ClipboardCheck,
    },
    {
      title: "Wallet",
      url: "/wallet",
      icon: Wallet,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
