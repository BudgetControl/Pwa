// vue.config.js
module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
	disableHostCheck: true,
	},
};
