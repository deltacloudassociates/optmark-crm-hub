import { Bell, Search, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clients",
  "/clients/individual": "Individual Clients",
  "/clients/business": "Business Clients",
  "/clients/new": "Add New Client",
  "/tasks": "Tasks",
  "/workload": "Workload Distribution",
  "/communications": "Communications",
  "/documents": "Documents",
  "/billing": "Time & Billing",
  "/billing/time": "Time Tracking",
  "/billing/invoices": "Invoices",
  "/billing/payments": "Payments",
  "/reports": "Reports",
  "/templates": "Document Templates",
  "/settings": "Settings",
};

export function AppHeader() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Dashboard";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients, tasks..."
            className="w-72 pl-9 pr-12 bg-secondary border-0"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-destructive text-destructive-foreground">
            5
          </Badge>
        </Button>
      </div>
    </header>
  );
}
