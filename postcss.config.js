const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-preset-env')({
      stage: 1,
    }),
    tailwindcss('./src/tailwind.js'),
    require('postcss-nested'),
    require('autoprefixer'),
  ],
};
