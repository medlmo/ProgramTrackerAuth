import { Link, useLocation } from "wouter";
import { FolderOpen, ListTodo, BarChart3, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout, canAdmin } = useAuth();

  const navigation = [
    {
      name: "Programmes",
      href: "/programmes",
      icon: FolderOpen,
      current: location === "/programmes" || location === "/",
    },
    {
      name: "Projets",
      href: "/projets",
      icon: ListTodo,
      current: location === "/projets",
    },
    {
      name: "Analyses",
      href: "/analyses",
      icon: BarChart3,
      current: location === "/analyses",
    },
    ...(canAdmin ? [{
      name: "Utilisateurs",
      href: "/users",
      icon: Users,
      current: location === "/users",
    }] : []),
  ];

  return (
    <aside className="w-64 bg-sidebar-background shadow-lg border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-primary flex items-center">
          <BarChart3 className="mr-2 h-6 w-6" />
          RSM Dev. Éco
        </h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Gestion des Programmes</p>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <button
                    className={cn(
                      "w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors",
                      item.current
                        ? "sidebar-active"
                        : "sidebar-inactive"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground text-sm font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">{user?.username}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-sidebar-foreground hover:text-sidebar-primary"
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
