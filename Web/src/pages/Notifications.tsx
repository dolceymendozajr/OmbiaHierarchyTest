import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  Trash2,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const typeConfig = {
  info: { icon: Info, color: "text-info", bgColor: "bg-info/10" },
  success: {
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

export default function Notifications() {
  const queryClient = useQueryClient();
  const userId = "559942E9-10EB-4CB8-B5DB-23662F60CEB1"; // Mock - replace with actual auth

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => notificationService.getUserNotifications(userId),
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast({ title: "Notificación marcada como leída" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notificationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast({ title: "Notificación eliminada" });
    },
  });

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notificaciones</h1>
          <p className="text-muted-foreground">
            Centro de notificaciones del sistema
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {unreadNotifications.length} sin leer
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <>
          {unreadNotifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  No Leídas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unreadNotifications.map((notification) => {
                  const config = typeConfig[notification.type || "info"];
                  const Icon = config.icon;

                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                              locale: es,
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            markAsReadMutation.mutate(notification.id)
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            if (confirm("¿Eliminar esta notificación?")) {
                              deleteMutation.mutate(notification.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {readNotifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Leídas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {readNotifications.map((notification) => {
                  const config = typeConfig[notification.type || "info"];
                  const Icon = config.icon;

                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30 opacity-70"
                    >
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                              locale: es,
                            }
                          )}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                          if (confirm("¿Eliminar esta notificación?")) {
                            deleteMutation.mutate(notification.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {notifications.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-muted-foreground">
                  Cuando recibas notificaciones aparecerán aquí
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
