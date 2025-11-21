import { useState } from 'react';
import { HierarchyNode } from '@/types';
import { ChevronRight, ChevronDown, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HierarchyTreeProps {
  nodes: HierarchyNode[];
  onSelectNode?: (node: HierarchyNode) => void;
  onDeleteNode?: (id: string) => void;
  onAddChild?: (parentId: string) => void;
  selectedId?: string;
}

interface TreeNodeProps {
  node: HierarchyNode;
  level: number;
  onSelectNode?: (node: HierarchyNode) => void;
  onDeleteNode?: (id: string) => void;
  onAddChild?: (parentId: string) => void;
  selectedId?: string;
}

const TreeNode = ({ node, level, onSelectNode, onDeleteNode, onAddChild, selectedId }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors",
          selectedId === node.id && "bg-primary/10 border border-primary/20"
        )}
        style={{ paddingLeft: `${level * 24}px` }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-background rounded"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </button>

        <div
          className="flex-1 flex items-center justify-between"
          onClick={() => onSelectNode?.(node)}
        >
          <span className="font-medium">{node.name}</span>
          <div className="flex items-center gap-2">
            {node.permissions && node.permissions.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {node.permissions.length} permisos
              </Badge>
            )}
            {onAddChild && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChild(node.id);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {onDeleteNode && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNode(node.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelectNode={onSelectNode}
              onDeleteNode={onDeleteNode}
              onAddChild={onAddChild}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const HierarchyTree = ({ nodes, onSelectNode, onDeleteNode, onAddChild, selectedId }: HierarchyTreeProps) => {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          onSelectNode={onSelectNode}
          onDeleteNode={onDeleteNode}
          onAddChild={onAddChild}
          selectedId={selectedId}
        />
      ))}
      {nodes.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No hay jerarquías creadas</p>
      )}
    </div>
  );
};
