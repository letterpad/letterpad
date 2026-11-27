const config = require('../../packages/config/tailwind.config');

module.exports = {
  ...config,
  theme: {
    ...config.theme,
    extend: {
      ...config.theme.extend,
      fontFamily: {
        ...config.theme.extend.fontFamily,
        sans: 'var(--font-sans, system-ui, sans-serif)',
        serif: 'var(--font-heading, Georgia, serif)',
      },
    },
  },
};
