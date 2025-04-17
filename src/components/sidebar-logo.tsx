import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link to="/">
          <SidebarMenuButton className="p-0! hover:bg-transparent">
            <img src="/flowlet.png" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-medium">Flowlet</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
