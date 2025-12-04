import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  CheckSquare,
  TrendingUp,
  Mail,
  FileText,
  Clock,
  Receipt,
  CreditCard,
  BarChart3,
  Files,
  Settings,
  ChevronDown,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: { label: string; path: string }[];
}

const navigation: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/dashboard",
  },
  {
    label: "Clients",
    icon: <Users className="h-5 w-5" />,
    path: "/clients",
    children: [
      { label: "Individual Clients", path: "/clients/individual" },
      { label: "Business Clients", path: "/clients/business" },
      { label: "KYC Compliance", path: "/clients/kyc" },
      { label: "Add New Client", path: "/clients/new" },
    ],
  },
  {
    label: "Tasks",
    icon: <CheckSquare className="h-5 w-5" />,
    path: "/tasks",
    badge: 12,
  },
  {
    label: "Workload",
    icon: <TrendingUp className="h-5 w-5" />,
    path: "/workload",
  },
  {
    label: "Communications",
    icon: <Mail className="h-5 w-5" />,
    path: "/communications",
    badge: 3,
  },
  {
    label: "Documents",
    icon: <FileText className="h-5 w-5" />,
    path: "/documents",
  },
  {
    label: "Time & Billing",
    icon: <Clock className="h-5 w-5" />,
    path: "/billing",
    children: [
      { label: "Time Tracking", path: "/billing/time" },
      { label: "Invoices", path: "/billing/invoices" },
      { label: "Payments", path: "/billing/payments" },
    ],
  },
  {
    label: "Reports",
    icon: <BarChart3 className="h-5 w-5" />,
    path: "/reports",
  },
  {
    label: "Templates",
    icon: <Files className="h-5 w-5" />,
    path: "/templates",
  },
  {
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    path: "/settings",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>(["Clients"]);

  const toggleItem = (label: string) => {
    setOpenItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold">AccountPro</h1>
          <p className="text-xs text-sidebar-foreground/70">CRM System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <Collapsible
                  open={openItems.includes(item.label)}
                  onOpenChange={() => toggleItem(item.label)}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent">
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openItems.includes(item.label) && "rotate-180"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              cn(
                                "block rounded-lg px-3 py-2 text-sm transition-colors",
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                              )
                            }
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50"
                    )
                  }
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-medium text-sidebar-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-sidebar-foreground/70">Senior Accountant</p>
          </div>
          <button className="rounded-lg p-2 hover:bg-sidebar-accent transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
