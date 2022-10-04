interface GridItem {
  src?: string;
  alt: string;
  title: string;
  description: string;
  index: number;
  aspectRatio: number;
  __typename: "GridItem";
}

interface GridPlaceholder {
  description: string;
  __typename: "GridPlaceholder";
}

export type Item = GridItem | GridPlaceholder;

export enum Controls {
  Left,
  Right,
}

export type Grid = Item[][];
