const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/chat.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        },
      ],
  },
};
