const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Generar plugins para cada archivo HTML
const htmlPlugins = glob.sync('./src/**/*.html').map((file) => {
  return new HtmlWebpackPlugin({
    template: file,
    filename: path.relative('./src', file), // Mantiene la estructura original
  });
});

module.exports = {
  entry: './src/js/index.js',
  output: { filename: 'bundle.js', path: path.resolve(__dirname, 'dist') },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    // Copiar CSS y assets a dist/
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/css', to: 'css' }, // Copia todos los CSS
        { from: 'src/assets', to: 'assets' }, // Copia la carpeta de imágenes, fuentes, etc.
      ],
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    hot: true,
    open: true,
    watchFiles: ['src/**/*'],
  },
};
