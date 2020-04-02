const environment = require('./environment');
const merge = require('webpack-merge');

const devBuild = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const webpack = require('webpack');

// React Server Side Rendering webpacker config
// Builds a Node compatible file that React on Rails can load, never served to the client.

environment.plugins.insert(
  'DefinePlugin',
  new webpack.DefinePlugin({
    TRACE_TURBOLINKS: true,
    'process.env': {
      NODE_ENV: devBuild,
    },
  }),
  { after: 'Environment' },
);
const serverConfig = merge(environment.toWebpackConfig(), {
  mode: 'development',
  target: 'web',
  entry: './client/app/startup/serverRegistration.jsx',
  output: {
    filename: 'server-bundle.js',
    path: environment.config.output.path,
    globalObject: 'this',
  },
  optimization: {
    minimize: false,
  },
});

serverConfig.plugins = serverConfig.plugins.filter(
  (plugin) => plugin.constructor.name !== 'WebpackAssetsManifest',
);

module.exports = serverConfig;
