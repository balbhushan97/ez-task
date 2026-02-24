import { TreeNodeData } from "./types";

export const findNode = (
  nodes: TreeNodeData[],
  id: string
): TreeNodeData | null => {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
};
export const findNodeAndParent = (
  nodes: TreeNodeData[],
  id: string,
  parent: TreeNodeData | null = null
): { node: TreeNodeData | null; parent: TreeNodeData | null } => {
  for (const n of nodes) {
    if (n.id === id) return { node: n, parent };
    if (n.children) {
      const res = findNodeAndParent(n.children, id, n);
      if (res.node) return res;
    }
  }
  return { node: null, parent: null };
};

export const removeNode = (
  nodes: TreeNodeData[],
  id: string
): TreeNodeData[] =>
  nodes
    .filter((n) => n.id !== id)
    .map((n) =>
      n.children
        ? { ...n, children: removeNode(n.children, id) }
        : n
    );

export const isDescendant = (
  parent: TreeNodeData,
  targetId: string
): boolean => {
  if (!parent.children) return false;
  for (const child of parent.children) {
    if (child.id === targetId) return true;
    if (isDescendant(child, targetId)) return true;
  }
  return false;
};