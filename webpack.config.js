import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'node:path';
import process from 'node:process';

const mode = process.env.NODE_ENV || 'development';

export default {
  mode,
  entry: './static/index.js',
  output: {
    path: path.resolve('dist', 'static')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};