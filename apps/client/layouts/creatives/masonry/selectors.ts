import { BlockMasonry } from '../types';

export const isLastImage = <T>(item: T[], index: number) => {
  return index > item.length - 1;
};

export const reorder = (arr: BlockMasonry[], columns: number) => {
  const cols = columns;
  const out: BlockMasonry[] = [];
  let col = 0;
  while (col < cols) {
    for (let i = 0; i < arr.length; i += cols) {
      let _val = arr[i + col];
      if (_val !== undefined) out.push(_val);
    }
    col++;
  }
  return out;
};
