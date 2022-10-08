interface BlockImage {
  width?: number;
  height?: number;
  src: string;
  description?: string;
}

export interface BlockItem {
  image?: BlockImage;
  text?: string;
  type: "text" | "image";
}
export interface Block {
  // onChange: (change: BlockItem) => void;
  columns: number;
  data: BlockItem[];
  cover?: "big" | "small";
}
