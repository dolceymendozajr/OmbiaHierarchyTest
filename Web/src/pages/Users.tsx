import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { hierarchyService } from '@/services/hierarchyService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
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
import { UserForm } from '@/components/users/UserForm';
import { User } from '@/types';

export default function Users() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });

  const { data: hierarchies = [] } = useQuery({
    queryKey: ['hierarchies'],
    queryFn: hierarchyService.getAll,
  });

  const { data: userPermissions = [] } = useQuery({
    queryKey: ['userPermissions', selectedUser?.id],
    queryFn: () => userService.getUserPermissions(selectedUser!.id),
    enabled: !!selectedUser,
  });

  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Usuario creado exitosamente' });
      setIsFormOpen(false);
    },
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestión de usuarios del sistema
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
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
                  <TableHead>Apellido</TableHead>
                  <TableHead>Tipo de Sangre</TableHead>
                  <TableHead>Jerarquía</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.bloodType}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.hierarchy?.name || 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No hay usuarios registrados
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
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <UserForm
            hierarchies={hierarchies}
            onSubmit={(data) => createMutation.mutate({
              firstName: data.firstName,
              lastName: data.lastName,
              bloodType: data.bloodType,
              hierarchyId: data.hierarchyId,
              email: data.email || undefined,
            })}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">Tipo: {selectedUser.bloodType}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Permisos Efectivos</h4>
                {userPermissions.length > 0 ? (
                  <div className="space-y-2">
                    {userPermissions.map((perm, idx) => (
                      <div key={idx} className="p-2 bg-muted rounded">
                        <p className="font-medium text-sm">{perm.permissionName}</p>
                        <p className="text-xs text-muted-foreground">
                          Desde: {perm.hierarchyName}
                          {perm.inherited && ' (Heredado)'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin permisos asignados</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
