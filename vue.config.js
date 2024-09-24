'use strict';

const { createWebpackConfig } = require('@lucifinil/config-vue');
const proxy = require('./config/proxy');
const { resolve } = require('path');
const isProduction = process.env.NODE_ENV === 'production';
require('events').EventEmitter.defaultMaxListeners = 0;

module.exports = createWebpackConfig(isProduction, process.cwd(), {
  proxy,
  publicPath: '/push',
  alias: {
    '@crud': resolve('src/components/Crud'),
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#0058ff',
          'text-color': '#666',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      },
    },
  },
});
