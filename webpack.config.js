import _ from 'lodash'
import webpack from 'webpack'
import path from 'path'

import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import autoprefixer from 'autoprefixer'
import opacity from 'postcss-opacity'
import unrgba from 'postcss-unrgba'
import gradient from 'postcss-filter-gradient'
import AssetsPlugin from 'assets-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WriteFilePlugin from 'write-file-webpack-plugin'
import {port} from './port.config';


let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

let appConfig = {
  entry: {
    'index': {
      entry: ['./app/index']
    }
  },
  commonChunks: {
    'common': []
  },
  entries: {
    popup: {
      title: 'test',
      template: './entry/index.html',
      chunks: ['index', 'common']
    }
  },
  output: {
    path: '',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'locales': '../_locales'
    }
  },
  providePlugin: {
  },
  noParse: /react/
};

function create() {
  //==============entry================
  let entry = _.reduce(appConfig.entry, (entries, entryInfo, entryName) => {
    let entry = entryInfo.entry;
    if (process.env.NODE_ENV === "development") {
      entry = [
        `webpack-dev-server/client?http://localhost:${port}`,
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch'
      ].concat(entry);
    }

    entries[entryName] = entry;

    return entries;
  }, {});

  //==============output================
  let output;

  output = {
    path: path.join(__dirname, 'www/' + appConfig.output.path),
    // devtoolModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  };

  if (process.env.NODE_ENV === "development") {

    output.publicPath = appConfig.output.publicPath;
    // output.publicPath = 'http://localhost:' + appConfig.port + appConfig.output.publicPath;
    output.filename = '[name].bundle.js';
    output.chunkFilename = '[name].bundle.js';
  } else {
    //临时解决绝对路径在线上无法找到css中下级资源的问题
    output.publicPath = '.' + appConfig.output.publicPath;
    output.filename = '[name].bundle.js';
    output.chunkFilename = '[name].bundle.js';
  }

  //==============resolve================
  let resolve = {
    modules: [
      path.join(__dirname, 'app'),
      path.join(__dirname, 'local_modules'),
      path.join(__dirname, 'node_modules')
    ],
    extensions: ['.js', '.jsx']
  };

  if (appConfig.resolve) {
    resolve.alias = appConfig.resolve.alias;
  }

  let plugins = [
    new LodashModuleReplacementPlugin,
    new WriteFilePlugin(),
    new webpack.ProvidePlugin({
      "React": "react",
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: function () {
          return {
            defaults: [
              unrgba({
                method: 'clone'
              }),
              gradient,
              opacity,
              autoprefixer({browsers: ['Chrome > 30','ie >= 8','> 1%']})
            ]
          };
        }
      },
    })
  ];

  if (appConfig.providePlugin) {
    plugins.push(new webpack.ProvidePlugin(appConfig.providePlugin));
  }

  if (process.env.NODE_ENV === "development") {
    _.each(appConfig.commonChunks, (commonChunk, name) => {
      plugins.push(new CommonsChunkPlugin({
        name: name,
        filename: name + '.js',
        chunks: _.isEmpty(commonChunk) ? Infinity: commonChunk
      }));
    });
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    _.each(appConfig.commonChunks, (commonChunk, name) => {
      plugins.push(new CommonsChunkPlugin({
        name: name,
        filename: name + '.js',
        chunks: _.isEmpty(commonChunk) ? Infinity: commonChunk
      }));
    });
    plugins.push(new ExtractTextPlugin('[name].styles.css'));
    plugins.push(new AssetsPlugin());
    plugins.push(new webpack.optimize.OccurrenceOrderPlugin);
    plugins.push(new webpack.optimize.UglifyJsPlugin);
  }

  _.each(appConfig.entries, (entryInfo, entryName) => {
    plugins.push(new HtmlWebpackPlugin({
      title: entryInfo.title,
      filename: entryName + '.html',
      template: entryInfo.template,
      chunks: entryInfo.chunks,
      inject: 'body',
      favicon: entryInfo.favicon,
      resources : entryInfo.resources,
      chunksSortMode: function(a, b) {
        if (a.entry !== b.entry) {
          return b.entry ? 1 : -1;
        } else if (a.names[0] === 'base' || b.names[0] === 'base') {
          return b.names[0] === 'base' ? 1 : -1;
        } else {
          return b.id - a.id;
        }
      }
    }));
  });

  //==============module================
  let module = {
    loaders: [
      {
        test: /\.(jpg|gif)$/,
        use: ['url-loader?limit=1024']
      },
      {
        test: /\.png$/,
        use: ['file-loader?name=[path][name].[ext]']
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['url-loader?limit=10000&minetype=application/font-woff']
      },
      {
        test: /\.(ttf|eot|svg|swf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader']
      },
      {
        test: /\.json$/,
        use: ['file-loader?name=[name].[ext]']
      },
      {
        test: /_locales(.*)\.json$/,
        use: ['file-loader?name=[path][name].[ext]']
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: [
          path.join(__dirname, 'app'),
          path.join(__dirname, 'local_modules')
        ]
      }
    ],
    noParse: appConfig.noParse
  };

  if (process.env.NODE_ENV === "development") {
    module.loaders.push({
      test: /\.css$/,
      loaders: ['css', 'postcss']
    });
  } else {
    module.loaders.push({
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css!postcss'
      })
    });
  }

  return {
    devtool: process.env.NODE_ENV === "development" ? "#inline-source-map" : false,
    entry: entry,
    output: output,
    externals: {
    },
    resolve: resolve || {},
    plugins: plugins,
    module: module
  };
}

const webpackConfig = create();

export default webpackConfig;
