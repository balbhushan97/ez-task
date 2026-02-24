// TreeView.tsx
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { TreeNode } from "./TreeNode";
import { TreeNodeData } from "./types";
import { findNode, removeNode, isDescendant } from "./treeUtils";

const initialTree: TreeNodeData[] = [
  { id: "A", label: "Level A", hasChildren: true },
  { id: "B", label: "Level B", hasChildren: true },
];

export const TreeView = () => {
  const [tree, setTree] = useState<TreeNodeData[]>(initialTree);

  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const dragged = findNode(tree, active.id as string);
    const target = findNode(tree, over.id as string);

    if (!dragged || !target) return;
    if (isDescendant(dragged, target.id)) return;

    const newTree = removeNode([...tree], dragged.id);

    target.children = target.children || [];
    target.children.push(dragged);

    setTree([...newTree]);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="tree">
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            tree={tree}
            setTree={setTree}
          />
        ))}
      </div>
    </DndContext>
  );
};