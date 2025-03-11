const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        use: [
          MiniCssExtractPlugin.loader, // Extrae el CSS en un archivo separado
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'css/style.css', // Guarda el CSS en "dist/css/style.css"
    }),
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
  },
};
