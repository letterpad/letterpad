import { DM_Sans, Lora, Nunito, Outfit, PT_Serif, Roboto_Mono } from 'next/font/google';

const lora = DM_Sans({ subsets: ['latin'], weight: ["400", "500", "700"], variable: "--font-paragraph" })
const robotoMono = Roboto_Mono({ subsets: ['latin'], weight: ["400", "500", "700"], variable: "--font-code" });
const ptSerif = Outfit({ subsets: ['latin'], weight: ["400", "700"], variable: "--font-heading" });
const openSans = Nunito({ subsets: ['latin'], weight: ["400", "700"], variable: "--font-sans" });

export const fonts = { lora, robotoMono, ptSerif, openSans };
