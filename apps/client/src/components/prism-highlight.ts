'use client';
import Prism from 'prismjs';
import { useEffect } from 'react';
Prism.manual = true;
export const PrismHighlight = ({ id }) => {
  useEffect(() => {
    const highlight = async () => {
      await Prism.highlightAll();
    };
    highlight();
  }, [id]);

  return null;
};
