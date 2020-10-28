const path = require('path')
const modules = require('./modules').default
const package = require('./package')
module.exports = {
  publicPath: process.env.BASE_URL,
  lintOnSave: false,
  transpileDependencies: process.env.NODE_ENV === 'development' ? [] : [/dh-\w+/],
  productionSourceMap: false,
  chainWebpack: config => {
    config.output.filename('[name].[hash].js').end()
    config.output.chunkFilename('[name].[hash].js').end()
    config.plugin("fork-ts-checker").tap((args) => {
      args[0].memoryLimit = 1024 * 8
      return args;
    })
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'subp': path.resolve(__dirname, '../../src'),
        ...Object.keys(modules).reduce((acc, name) => {
          acc[name + '/src'] = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../../src') : path.resolve(__dirname, `./node_modules/${name}/src`)
          return acc
        }, {}),
        'vue$': path.resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm.js')
      }
      // alias: process.env.NODE_ENV === 'development' ? moduleConf : {}
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        include: /((big-screen-frontend|dh-big-screen)[\/\\]src)/,
        plugins: [
          require('postcss-plugin-px2rem')({
            rootValue: 192, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], //黑名单
            exclude: /^((?!(big-screen-frontend|dh-big-screen)[\/\\]src).)*$/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: [], //要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 0 //设置要替换的最小像素值(3px会被转rem)。 默认 0
          }),
        ]
      },
      sass: {
        prependData: `@import 'src/assets/styles/_variable.scss';`
      },
      less: {
        modifyVars: {
          'primary-color': '#355DB4',
          'menu-dark-bg': '#001C40'
        },
        javascriptEnabled: true
      }
    }
  }
}
