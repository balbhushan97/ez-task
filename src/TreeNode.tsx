// TreeNode.tsx
import { useState } from "react";
import { TreeNodeData } from "./types";
import { loadChildren } from "./api";
import { removeNode } from "./treeUtils";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  node: TreeNodeData;
  tree: TreeNodeData[];
  setTree: React.Dispatch<React.SetStateAction<TreeNodeData[]>>;
}

export const TreeNode = ({ node, tree, setTree }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(node.label);

  /* ---------- Drag & Drop ---------- */
  const { setNodeRef: setDropRef } = useDroppable({ id: node.id });
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({ id: node.id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  /* ---------- Expand / Lazy Load ---------- */
  const toggle = async () => {
    if (!expanded && node.hasChildren && !node.children) {
      node.isLoading = true;
      setTree([...tree]);

      node.children = await loadChildren(node.id);
      node.isLoading = false;
    }
    setExpanded(!expanded);
  };

  /* ---------- Add ---------- */
  const addChild = () => {
    const name = prompt("Node name");
    if (!name) return;

    node.children = node.children || [];
    node.children.push({
      id: crypto.randomUUID(),
      label: name,
    });
    setExpanded(true);
    setTree([...tree]);
  };

  /* ---------- Delete ---------- */
  const remove = () => {
    if (!window.confirm("Delete this node and its subtree?")) return;
    setTree(removeNode([...tree], node.id));
  };

  /* ---------- Edit ---------- */
  const save = () => {
    node.label = value;
    setEditing(false);
    setTree([...tree]);
  };

  return (
    <div ref={setDropRef} className="node">
      <div ref={setDropRef} className="node">
        <div className="node-row" style={style}>
          {/* DRAG HANDLE */}
          <span
            ref={setDragRef}
            {...listeners}
            {...attributes}
            className="drag-handle"
          >
            ⠿
          </span>

          {node.hasChildren && (
            <button onClick={toggle}>{expanded ? "−" : "+"}</button>
          )}

          {editing ? (
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={save}
              autoFocus
            />
          ) : (
            <span onDoubleClick={() => setEditing(true)}>{node.label}</span>
          )}

          <button onClick={addChild}>＋</button>
          <button onClick={remove}>🗑</button>
        </div>
      </div>

      {node.isLoading && <div className="loading">Loading…</div>}

      {expanded && node.children && (
        <div className="children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              tree={tree}
              setTree={setTree}
            />
          ))}
        </div>
      )}
    </div>
  );
};
