// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import("tailwindcss").Config}  */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: [
    './pages/**/*.tsx',
    './components/**/*.tsx',
    './partials/**/*.tsx',
    './themes/**/*.tsx',
    './layouts/**/*.tsx',
    './lib/**/*.ts',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        paragraph: 'var(--font-paragraph)',
        body: 'var(--font-body)',
        code: 'var(--font-code)',
      },
      fontSize: {
        xs: '.8rem',
        sm: '.9rem',
        base: '1rem',
        'base-1': '0.95rem',
        md: '1.1rem',
        lg: '1.25rem',
        prose: '1.2rem',
        xl: ['1.3rem', { lineHeight: '1.50', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.415', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.333', letterSpacing: '-0.01em' }],
        '4xl': ['2.25rem', { lineHeight: '1.277', letterSpacing: '-0.01em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        '6xl': ['3.75rem', { lineHeight: '1.166', letterSpacing: '-0.01em' }],
        '7xl': ['5rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.4em',
      },
      colors: {
        // primary: colors.blue,
        gray: colors.slate,
        // muted: colors.slate[400],
        brand: "#2f8ccf",
        userbrand: 'var(--userbrand)',
        // accent: {
        //   50: 'var(--accent)',
        //   100: '#f4f5f7',
        // },
        zinc: {
          800: '#131e32',
          900: '#101827',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: theme('fontSize.prose'),
            color: theme('colors.gray.700'),
            fontFamily: theme('fontFamily.body'),
            maxWidth: 'inherit',
            a: {
              color: theme('colors.primary.500'),
              code: { color: theme('colors.primary.400') },
            },
            'h1, h2, h3': {
              fontFamily: theme('fontFamily.heading'),
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.900'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.900'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.900'),
            },
            'h4,h5,h6': {
              color: theme('colors.gray.900'),
            },
            code: {
              // color: theme('colors.green.600'),
              fontSize: theme('fontSize.md'),
              backgroundColor: '#6fd7535c',
              fontWeight: 'initial',
              fontFamily: theme('fontFamily.code'),
              padding: '0.1rem 0.2rem',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            details: {
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            hr: { borderColor: theme('colors.gray.200') },
            'ul,ol': {
              padding: '0 1rem',
            },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.gray.500'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.gray.500'),
            },
            strong: { color: theme('colors.gray.600') },
            blockquote: {
              color: theme('colors.gray.900'),
              borderLeftColor: theme('colors.accent.50'),
            },
            'figcaption a': {
              color: theme('colors.green.500'),
            },
            '.prose': {
              fontFamily: theme('fontFamily.paragraph'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.slate.300'),
            a: {
              color: theme('colors.primary.500'),
              code: { color: theme('colors.primary.400') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.100'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.100'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.100'),
            },
            'h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
            // pre: {
            //   backgroundColor: theme('colors.gray.900'),
            // },
            code: {
              color: theme('colors.lime.500'),
              backgroundColor: 'transparent',
            },
            details: {
              backgroundColor: theme('colors.gray.800'),
            },
            hr: { borderColor: theme('colors.gray.700') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.gray.400'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.gray.400'),
            },
            strong: { color: theme('colors.gray.100') },
            thead: {
              th: {
                color: theme('colors.gray.100'),
              },
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700'),
              },
            },
            blockquote: {
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.accent.50'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
