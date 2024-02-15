import { Lora, PT_Serif, Roboto_Mono } from 'next/font/google';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-paragraph',
});
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-code',
});
const ptSerif = PT_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
});
export const fonts = { lora, robotoMono, ptSerif };
