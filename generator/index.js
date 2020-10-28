module.exports = (api, options, rootOptions) => {
  // 修改 `package.json` 里的字段
  api.extendPackage({
    name: `${options.prefix}-${options.name}`,
    scripts: {
      "serve": "gulp install_dev && node --max_old_space_size=8192 node_modules/@vue/cli-service/bin/vue-cli-service.js serve",
      "build": "gulp install_build && node --max_old_space_size=8192 node_modules/@vue/cli-service/bin/vue-cli-service.js build",
      "build:dev": "gulp install_build && node --max_old_space_size=8192 node_modules/@vue/cli-service/bin/vue-cli-service.js build --mode development",
      "build:test": "gulp install_build && node --max_old_space_size=8192 node_modules/@vue/cli-service/bin/vue-cli-service.js build --mode sit",
      "build:uat": "gulp install_build && node --max_old_space_size=8192 node_modules/@vue/cli-service/bin/vue-cli-service.js build --mode uat",
      "lint": "vue-cli-service lint"
    },
    dependencies: {
      "ant-design-vue": "^1.6.3",
      "axios": "^0.19.0",
      "dhgt-ui": "^0.1.35",
      "nprogress": "^0.2.0",
      "vue-class-component": "^7.0.2",
      "vue-property-decorator": "^8.3.0",
      "vuex-persistedstate": "^2.7.0"
    },
    devDependencies: {
      "@types/nprogress": "^0.2.0",
      "babel-plugin-import": "^1.12.2",
      "gulp": "^4.0.2",
      "postcss-plugin-px2rem": "^0.8.1",
      "less": "^2.7.3",
      "less-loader": "^4.1.0"
    }
  })

  api.render('../template')

  api.render((files, render) => {
    // console.log(JSON.stringify(files))
    delete files['src/components/HelloWorld.vue']
    delete files['src/views/About.vue']
    // console.log(JSON.stringify(files))
  })

  // 复制并用 ejs 渲染 `./template` 内所有的文件

  api.postProcessFiles((files) => {
    delete files['src/App.vue']
    files['src/assets/iconfont/iconfont.js'] = files['src/assets/iconfont/iconfont.ts']
    delete files['src/assets/iconfont/iconfont.ts']
    files['gulpfile.js'] = files['gulpfile.ts']
    delete files['gulpfile.ts']
    files['modules.js'] = files['modules.ts']
    delete files['modules.ts']
  })
  // api.render({
  //   'src/App.vue': '../template/src/App.vue',
  //   'gulpfile.js': '../template/gulpfile.js',
  //   'modules.js': '../template/modules.js',
  // })
  // if (options.module === 'module1') { 
  //   // options.module 可以访问上面问题数组的第一个对象的值，默认为: 'module0'
  //   console.log(`Your choice is ${options.module}`)
  // }

  // if (options.moduleName === 'myModule') {
  //   // options.moduleName 可以访问到用户从控制台输入的文字
  //   console.log(`Your input is ${options.moduleName}`)
  // }
}