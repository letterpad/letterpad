interface ItemText {
  text: string;
}
interface ItemImage {
  width: number;
  height: number;
  src: string;
  description: string;
}

export interface BlockText {
  data: ItemImage;
  type: "image";
}
export interface BlockImage {
  data: ItemText;
  type: "text";
}
export type BlockItem = BlockText | BlockImage;

export enum BlockType {
  Split = "split",
  FullWidth = "fullWidth",
  Placeholder = "placeholder",
}
export interface Block {
  // onChange: (change: BlockItem) => void;
  type: BlockType;
  data: BlockItem[];
}

// export type Block = BlockType;
