export interface Pattern {
  background?: string;
  gradientStart?: string;
  gradientEnd?: string;
}

interface BlockImage {
  width?: number;
  height?: number;
  src: string;
  description?: string;
  pattern?: Pattern;
}

export interface BlockMasonry {
  width?: number;
  height?: number;
  src: string;
  description?: string;
  caption?: string;
  aspectRatio?: number;
  id: string;
}

export interface BlockItem {
  image?: BlockImage;
  text?: string;
  masonry?: BlockMasonry[];
  bgColor?: string;
  type: "text" | "image" | "masonry";
}

export type CoverType = "big" | "small" | "banner";

export interface Block {
  columns: number;
  data: BlockItem[];
  cover?: "big" | "small" | "banner";
  id: string;
}
