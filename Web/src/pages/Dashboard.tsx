import { useQuery } from "@tanstack/react-query";
import { hierarchyService } from "@/services/hierarchyService";
import { userService } from "@/services/userService";
import { permissionService } from "@/services/permissionService";
import { notificationService } from "@/services/notificationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Network, Shield, Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const userId = "559942E9-10EB-4CB8-B5DB-23662F60CEB1"; // Mock - replace with actual auth

  const { data: hierarchies, isLoading: loadingHierarchies } = useQuery({
    queryKey: ["hierarchies"],
    queryFn: hierarchyService.getAll,
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });

  const { data: permissions, isLoading: loadingPermissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: permissionService.getAll,
  });

  const { data: notifications, isLoading: loadingNotifications } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => notificationService.getUserNotifications(userId),
  });

  const stats = [
    {
      title: "Total Usuarios",
      value: users?.length || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      isLoading: loadingUsers,
    },
    {
      title: "Jerarquías",
      value: hierarchies?.length || 0,
      icon: Network,
      color: "text-info",
      bgColor: "bg-info/10",
      isLoading: loadingHierarchies,
    },
    {
      title: "Permisos",
      value: permissions?.length || 0,
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10",
      isLoading: loadingPermissions,
    },
    {
      title: "Notificaciones No Leídas",
      value: notifications?.filter((n) => !n.isRead).length || 0,
      icon: Bell,
      color: "text-warning",
      bgColor: "bg-warning/10",
      isLoading: loadingNotifications,
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general del sistema de gestión
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {stat.isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {users?.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tipo: {user.bloodType}
                      </p>
                    </div>
                  </div>
                ))}
                {(!users || users.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    No hay usuarios
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingNotifications ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {notifications?.slice(0, 5).map((notif) => (
                  <div key={notif.id} className="p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notif.message}
                    </p>
                  </div>
                ))}
                {(!notifications || notifications.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    No hay actividad
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
