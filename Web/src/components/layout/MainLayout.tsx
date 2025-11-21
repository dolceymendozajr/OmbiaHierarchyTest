import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock user ID - replace with actual auth
  const userId = "559942E9-10EB-4CB8-B5DB-23662F60CEB1";

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => notificationService.getUserNotifications(userId),
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          unreadCount={unreadCount}
        />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
