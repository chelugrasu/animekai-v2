const path = require('path');

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vtt')
      .test(/\.vtt$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  }
};