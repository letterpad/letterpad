import {
  Inter,
  Merriweather,
  Roboto,
  Roboto_Mono,
  Source_Serif_4,
} from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const sourceSerif4 = Source_Serif_4({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif-4",
});

export const robotoMono = Roboto_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});
export const merriweather = Merriweather({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather",
});

export const fonts = {
  inter,
  roboto,
  sourceSerif4,
  robotoMono,
  merriweather,
};
