const fonts = [
  {
    name: 'Adamina',
    weight: '400',
    variable: '--font-adamina',
    link: 'https://fonts.googleapis.com/css2?family=Adamina&display=swap',
  },
  {
    name: 'Assistant',
    weight: '400;700',
    variable: '--font-assistant',
    link: 'https://fonts.googleapis.com/css2?family=Assistant:wght@400;700&display=swap',
  },
  {
    name: 'Inter',
    weight: '400;700',
    variable: '--font-inter',
    link: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
  },
  {
    name: 'Literata',
    weight: '400;700',
    variable: '--font-literata',
    link: 'https://fonts.googleapis.com/css2?family=Literata:wght@400;700&display=swap',
  },
  {
    name: 'Lora',
    weight: '400;700',
    variable: '--font-lora',
    link: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap',
  },
  {
    name: 'Marcellus',
    weight: '400',
    variable: '--font-marcellus',
    link: 'https://fonts.googleapis.com/css2?family=Marcellus&display=swap',
  },
  {
    name: 'Merriweather',
    weight: '400;700',
    variable: '--font-merriweather',
    link: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
  },
  {
    name: 'Nanum Myeongjo',
    weight: '400;700',
    variable: '--font-nanum-myeongjo',
    link: 'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap',
  },
  {
    name: 'Noto_Sans',
    weight: '400;700',
    variable: '--font-noto-sans',
    link: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap',
  },
  {
    name: 'Nunito_Sans',
    weight: '400;700',
    variable: '--font-nunito-sans',
    link: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;700&display=swap',
  },
  {
    name: 'Open_Sans',
    weight: '400;700',
    variable: '--font-open-sans',
    link: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap',
  },
  {
    name: 'Oswald',
    weight: '400;700',
    variable: '--font-oswald',
    link: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap',
  },
  {
    name: 'Poppins',
    weight: '400;700',
    variable: '--font-poppins',
    link: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap',
  },
  {
    name: 'PT_Sans',
    weight: '400;700',
    variable: '--font-pt-sans',
    link: 'https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap',
  },
  {
    name: 'PT_Serif',
    weight: '400;700',
    variable: '--font-pt-serif',
    link: 'https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap',
  },
  {
    name: 'Roboto',
    weight: '400;700',
    variable: '--font-roboto',
    link: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
  },
  {
    name: 'Roboto_Mono',
    weight: '400;700',
    variable: '--font-roboto-mono',
    link: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap',
  },
  {
    name: 'Source Serif 4',
    weight: '400;700',
    variable: '--font-source-serif-4',
    link: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;700&display=swap',
  },
  {
    name: 'Spectral',
    weight: '400;700',
    variable: '--font-spectral',
    link: 'https://fonts.googleapis.com/css2?family=Spectral:wght@400;700&display=swap',
  },
  {
    name: 'Unna',
    weight: '400;700',
    variable: '--font-unna',
    link: 'https://fonts.googleapis.com/css2?family=Unna:wght@400;700&display=swap',
  },
];

export function generateGoogleFontsLink(selectedFonts) {
  const pickFonts = selectedFonts
    .map((fontName) => fonts.find((font) => font.name === fontName))
    .filter((a) => a && typeof a !== 'undefined');
  const fontString = pickFonts
    .map(
      ({ name, weight }) =>
        `family=${name.replace(/\s+/g, '+').replace(/_/g, '+')}:wght@${weight}`
    )
    .join('&');

  const googleFontsLink = `https://fonts.googleapis.com/css2?${fontString}&display=swap`;

  return googleFontsLink;
}

export function generateGoogleFontsVariables(selectedFonts) {
  const variables = selectedFonts
    .map((fontName) => fonts.find((font) => font.name === fontName))
    .filter((a) => a && typeof a !== 'undefined')
    .map((font) => `${font.variable}: ${font.name.replace(/_/, ' ')}`)
    .join(';');
  return variables;
}
