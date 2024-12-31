module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-preset-env')({
      features: { 'nesting-rules': false },
    }),
  ],
};
