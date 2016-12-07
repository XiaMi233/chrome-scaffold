import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../webpack.config'

let proxyTarget = 'http://bilibili.com';

new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  historyApiFallback: true,
  contentBase: 'build/',
  proxy: [
    {
      path: '*.json',
      target: proxyTarget,
      changeOrigin: true
    },
    {
      path: '*',
      target: proxyTarget,
      changeOrigin: true
    }
  ],
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  headers: {'X-Custom-Header': 'no'},
  stats: {
    colors: true,
    hash: true,
    version: true,
    timings: true,
    chunks: false,
    chunkModules: true,
    cached: true,
    cachedAssets: true,
    assets: false
  }
}).listen(webpackConfig.port, function(err, result) {
  if(err) {
    console.log(err);
  }

  console.log(`Listening at localhost:${webpackConfig.port}`);
});
