import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionService } from '@/services/permissionService';
import { hierarchyService } from '@/services/hierarchyService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { PermissionForm } from '@/components/permissions/PermissionForm';

export default function Permissions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionService.getAll,
  });

  const { data: hierarchies = [] } = useQuery({
    queryKey: ['hierarchies'],
    queryFn: hierarchyService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: permissionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast({ title: 'Permiso creado exitosamente' });
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: permissionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast({ title: 'Permiso eliminado exitosamente' });
    },
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Permisos</h1>
          <p className="text-muted-foreground">
            Gestión de permisos del sistema
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Permiso
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Permisos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Jerarquía Asignada</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">
                      <Badge>{permission.name}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {permission.description || 'Sin descripción'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {permission.hierarchyId ? (
                        <Badge variant="outline">Asignado</Badge>
                      ) : (
                        <span className="text-muted-foreground">Global</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                          if (confirm('¿Está seguro de eliminar este permiso?')) {
                            deleteMutation.mutate(permission.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {permissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No hay permisos registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Permiso</DialogTitle>
          </DialogHeader>
          <PermissionForm
            hierarchies={hierarchies}
            onSubmit={(data) => createMutation.mutate({
              name: data.name,
              description: data.description || undefined,
              hierarchyId: data.hierarchyId || undefined,
            })}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
