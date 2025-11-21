import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HierarchyNode } from '@/types';

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  parentId: z.string().nullable(),
});

interface HierarchyFormProps {
  hierarchies: HierarchyNode[];
  parentId?: string | null;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export const HierarchyForm = ({ hierarchies, parentId, onSubmit, onCancel }: HierarchyFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      parentId: parentId || null,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Nodo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Departamento de TI" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nodo Padre (Opcional)</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'null' ? null : value)}
                defaultValue={field.value || 'null'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nodo padre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">Sin padre (raíz)</SelectItem>
                  {hierarchies.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Crear Nodo
          </Button>
        </div>
      </form>
    </Form>
  );
};
