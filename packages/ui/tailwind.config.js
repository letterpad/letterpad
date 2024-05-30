// With the below line, tailwind JIT doesnt work.
// module.exports = require('config/tailwind.config');
module.exports = {...require("config/tailwind.config"),
    content: [
    './components/**/*.tsx',
    './src/**/*.{js,ts,jsx,tsx}',
  ]};
