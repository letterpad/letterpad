// With the below line, tailwind JIT doesnt work.
// module.exports = require('config/tailwind.config');
module.exports = {
  ...require('../../packages/config/tailwind.config'),
  content: [
    './pages/**/*.tsx',
    './components/**/*.tsx',
    './themes/**/*.tsx',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
};
