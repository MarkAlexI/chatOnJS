const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/chat.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
