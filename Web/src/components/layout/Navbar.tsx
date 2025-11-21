import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import React from "react";
import { useUser } from "../../contexts/UserContext";

interface NavbarProps {
  onMenuClick: () => void;
  unreadCount: number;
}

export const Navbar = ({ onMenuClick, unreadCount }: NavbarProps) => {
  const { userId, setUserId, users } = useUser();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-primary">Sistema de Gestión</h1>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className="sr-only">Select user</label>
          <select
            value={userId ?? ""}
            onChange={(e) => setUserId(e.target.value || null)}
            className="rounded-md border px-2 py-1 text-sm"
          >
            <option value="">(No user)</option>
            {users.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.name ?? u.email ?? u.id}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationDropdown>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        </NotificationDropdown>
      </div>
    </header>
  );
};
