const path = require('path');
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: './src/firestore.ts',
  devtool: 'inline-source-map',
  plugins: [new Dotenv()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        // use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  stats: {
    errorDetails: true
  }
};
