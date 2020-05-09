module.exports = {
    mode:'development',
    watch: true,
    entry: {
      demo: './src/demo.js',
    },
    output: {
      path: __dirname + '/dist',
      filename: '[name]-bundle.js'
    }
  }