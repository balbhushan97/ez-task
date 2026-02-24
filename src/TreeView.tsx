// TreeView.tsx
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { TreeNode } from "./TreeNode";
import { TreeNodeData } from "./types";
import {
  isDescendant,
  findNodeAndParent,
} from "./treeUtils";

const initialTree: TreeNodeData[] = [
  { id: "A", label: "Level A", hasChildren: true },
  { id: "B", label: "Level B", hasChildren: true },
];

export const TreeView = () => {
  const [tree, setTree] = useState<TreeNodeData[]>(initialTree);

  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const { node: dragged, parent: sourceParent } = findNodeAndParent(
      tree,
      activeId,
    );

    const { node: target, parent: targetParent } = findNodeAndParent(
      tree,
      overId,
    );

    if (!dragged || !target) return;
    if (isDescendant(dragged, overId)) return;

    // 🔁 REORDER (same level)
    if (sourceParent?.id === targetParent?.id) {
      const siblings = sourceParent?.children ?? tree;

      const oldIndex = siblings.findIndex((n) => n.id === activeId);
      const newIndex = siblings.findIndex((n) => n.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(siblings, oldIndex, newIndex);

      if (sourceParent) {
        sourceParent.children = reordered;
      } else {
        setTree(reordered);
        return;
      }
    }
    // 📦 MOVE (different parents)
    else {
      const sourceList = sourceParent?.children ?? tree;

      sourceList.splice(
        sourceList.findIndex((n) => n.id === activeId),
        1,
      );

      target.children = [...(target.children ?? []), dragged];
    }

    setTree([...tree]);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="tree">
        {tree.map((node) => (
          <TreeNode key={node.id} node={node} tree={tree} setTree={setTree} />
        ))}
      </div>
    </DndContext>
  );
};
