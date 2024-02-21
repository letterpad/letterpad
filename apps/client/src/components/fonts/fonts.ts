import { DM_Sans, Nunito, Outfit, Roboto_Mono } from 'next/font/google';

const paragraph = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-paragraph',
});
const code = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-code',
});
const heading = Outfit({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
});
const sans = Nunito({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const fonts = { paragraph, code, heading, sans };
