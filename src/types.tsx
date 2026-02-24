export interface TreeNodeData {
  id: string;
  label: string;
  children?: TreeNodeData[];
  hasChildren?: boolean;
  isLoading?: boolean;
}