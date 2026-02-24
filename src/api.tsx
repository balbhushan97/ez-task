// api.ts
import { TreeNodeData } from "./types";

export const fakeLoadChildren = (
  parentId: string
): Promise<TreeNodeData[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: `${parentId}-${crypto.randomUUID()}`,
          label: "Level A",
          hasChildren: Math.random() > 0.5,
        },
        {
          id: `${parentId}-${crypto.randomUUID()}`,
          label: "Level A",
        },
      ]);
    }, 700);
  });