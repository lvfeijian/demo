const { defineConfig } = require('@vue/cli-service')

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  // configureWebpack: {
  //   devServer: {
  //     historyApiFallback: false, // historyApiFallback为false，会导致页面刷新404
  //   }
  // }
  configureWebpack: config => {
    const plugins = []
    plugins.push(new NodePolyfillPlugin())
  }
})
