// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        includePaths: ['./node_modules']
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        // modify the options...
        options.limit = 1024
        return options
      })
  }
}
