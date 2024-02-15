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

// const fonts = {
//   "Inter": {
//     name: "Inter",
//     weights: ["400", "500", "600", "700"]
//   },
//   "Roboto": {
//     name: "Roboto",
//     weights: ["400", "500", "700"]
//   },
//   "Roboto_Mono": {
//     name: "Roboto+Mono",
//     weights: ["400", "500", "700"]
//   },
//   "PT_Sans": {
//     name: "PT+Sans",
//     weights: ["400", "700"]
//   },
//   "Oswald": {
//     name: "Oswald",
//     weights: ["400", "500", "700"]
//   },
//   "Noto_Sans": {
//     name: "Noto+Sans",
//     weights: ["400", "700"]
//   },
//   "Assistant": {
//     name: "Assistant",
//     weights: ["400", "600", "700"]
//   },
//   "Poppins": {
//     name: "Poppins",
//     weights: ["400", "500", "600", "700"]
//   },
//   "Source_Serif_4": {
//     name: "Source+Serif+4",
//     weights: ["400", "600", "700"]
//   },
//   "Merriweather": {
//     name: "Merriweather",
//     weights: ["400", "700"]
//   },
//   "Lora": {
//     name: "Lora",
//     weights: ["400", "500", "700"]
//   },
//   "Nunito_Sans": {
//     name: "Nunito+Sans",
//     weights: ["400", "600", "700"]
//   },
//   "Open_Sans": {
//     name: "Open+Sans",
//     weights: ["400", "600", "700"]
//   },
// };

// export function generateFontLink(fontsArr: string[]) {
//   const fontFamilies = fontsArr.map(font => {
//     const fontInfo = fonts[font];

//     if (fontInfo) {
//       return fontInfo.name + ":" + fontInfo.weights.join(",");
//     } else {
//       return null;
//     }
//   }).filter(font => font !== null);

//   const fontFamiliesString = fontFamilies.join("|");

//   return `https://fonts.googleapis.com/css?family=${fontFamiliesString}&display=swap`;
// }
