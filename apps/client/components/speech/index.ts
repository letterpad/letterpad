import dynamic from 'next/dynamic';

export const Speech = dynamic(() => import('./speech').then((m) => m.Speak), {
  ssr: false,
});
