import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hierarchyService } from '@/services/hierarchyService';
import { HierarchyTree } from '@/components/hierarchy/HierarchyTree';
import { HierarchyForm } from '@/components/hierarchy/HierarchyForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { HierarchyNode } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function Hierarchies() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<HierarchyNode | null>(null);
  const [parentIdForNew, setParentIdForNew] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: hierarchies = [], isLoading } = useQuery({
    queryKey: ['hierarchies'],
    queryFn: hierarchyService.getAll,
  });

  const { data: effectivePermissions = [] } = useQuery({
    queryKey: ['effectivePermissions', selectedNode?.id],
    queryFn: () => hierarchyService.getEffectivePermissions(selectedNode!.id),
    enabled: !!selectedNode,
  });

  const createMutation = useMutation({
    mutationFn: hierarchyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hierarchies'] });
      toast({ title: 'Nodo creado exitosamente' });
      setIsFormOpen(false);
      setParentIdForNew(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: hierarchyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hierarchies'] });
      toast({ title: 'Nodo eliminado exitosamente' });
      setSelectedNode(null);
    },
  });

  const handleAddChild = (parentId: string) => {
    setParentIdForNew(parentId);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Jerarquías</h1>
          <p className="text-muted-foreground">
            Gestión de niveles jerárquicos y permisos
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Nodo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Árbol de Jerarquías</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <HierarchyTree
                nodes={hierarchies}
                onSelectNode={setSelectedNode}
                onDeleteNode={(id) => {
                  if (confirm('¿Está seguro de eliminar este nodo?')) {
                    deleteMutation.mutate(id);
                  }
                }}
                onAddChild={handleAddChild}
                selectedId={selectedNode?.id}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles del Nodo</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedNode.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {selectedNode.id}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Permisos Efectivos</h4>
                  {effectivePermissions.length > 0 ? (
                    <div className="space-y-2">
                      {effectivePermissions.map((perm) => (
                        <div
                          key={`${perm.permissionId}-${perm.nodeId}`}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <span className="text-sm">{perm.permissionName}</span>
                          {perm.inherited && (
                            <Badge variant="outline" className="text-xs">
                              Heredado (nivel {perm.depth})
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sin permisos asignados</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Selecciona un nodo para ver sus detalles
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Nodo</DialogTitle>
          </DialogHeader>
          <HierarchyForm
            hierarchies={hierarchies}
            parentId={parentIdForNew}
            onSubmit={(data) => createMutation.mutate({ 
              name: data.name, 
              parentId: data.parentId 
            })}
            onCancel={() => {
              setIsFormOpen(false);
              setParentIdForNew(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
