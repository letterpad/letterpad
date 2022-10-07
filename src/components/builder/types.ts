interface BlockImage {
  width?: number;
  height?: number;
  src: string;
  description?: string;
}

export interface BlockItem {
  image?: BlockImage;
  text?: string;
}
// export enum BlockType {
//   Split = "split",
//   FullWidth = "fullWidth",
//   Placeholder = "placeholder",
// }
export interface Block {
  // onChange: (change: BlockItem) => void;
  columns: number;
  data: BlockItem[];
}
