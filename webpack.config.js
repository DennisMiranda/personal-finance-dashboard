const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Obtener todos los archivos JS dentro de src/js
const jsEntries = Object.fromEntries(
  glob
    .sync('./src/js/*.js')
    .map((file) => [path.basename(file, '.js'), './' + file])
);

// Generar plugins para cada archivo HTML
const htmlPlugins = glob.sync('./src/**/*.html').map((file) => {
  return new HtmlWebpackPlugin({
    template: file,
    filename: path.relative('./src', file), // Mantiene la estructura original
    chunks: ['global', path.basename(file, '.html')], // Incluir el js global en todos los archivos html.
  });
});

module.exports = {
  entry: jsEntries,
  output: {
    filename: 'js/[name].bundle.js', // Guarda cada archivo JS con su mismo nombre
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Limpia dist antes de cada build
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
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
