const gulp = require('gulp')
const fs = require('fs')
const modules = require('./modules').default
const cp = require('child_process')

function isFileExisted(filePath) {
  return new Promise(function(resolve, reject) {
    fs.access(filePath, (err) => {
      if (err) {
        reject(err.message)
      } else {
        resolve('existed')
      }
    })
  })
}
function newFolder() {
  return new Promise(async (resolve, reject) => {
    const moduleCachePath = './module_cache'
    try {
      const existed = await isFileExisted(moduleCachePath)
      resolve()
    } catch (error) {
      cp.exec('mkdir module_cache', (err) => {
        if (!err) {
          resolve()
        } else {
          reject()
        }
      })
    }
  })
}
function npmInstall(module, version) {
  console.log(`安装${module}@${version}...`)
  return new Promise((resolve) => {
    cp.exec(`npm i ${module}@${version} --registry=http://219.135.209.147:4873`, (err, stdout, stderr) => {
      if (err) {
        console.warn(`安装${module}@${version}错误，请检查`)
        console.log(err)
      }
      console.log(stdout)
      resolve(err)
    })
  })
}

// 编写引入文件
async function writeImoprts(mode, cb) {
  const imports = mode === 'dev' ? 'import "subp/main.js"\n' : Object.keys(modules).reduce((acc, cur) => {
    acc += `import '${cur}'\n`
    return acc
  }, '')
  await newFolder()
  fs.writeFile('./module_cache/modules.import.ts', imports, cb)
}
// 编写页面引入文件 loadBuildView
function writeLoadBuildView(mode, cb) {
  const caseStr = Object.keys(modules).reduce((acc, cur) => {
    // const prefixPath = mode === 'dev' ? 'subp/' : `@/../node_modules/${cur}/src/`
    acc += `case '${cur}':\n`
    acc += '      return () => import(`' + cur + '/src/views/${path}.vue`)\n'
    return acc
  }, '')
  const file = `
const loadBuildView = function (moduleName: string, path: string) {
  switch (moduleName) {
    ${caseStr}
    default:
      return () => import('@/views/test.vue')
  }
}
export default loadBuildView`
  fs.writeFile('./module_cache/loadBuildView.ts', file, cb)
}
// 编写应用别名
// async function writeModuleConf (mode, cb) {
//   const conf = await Object.keys(modules).reduce(async (acc, cur) => {
//     acc = await acc
//     try {
//       if (mode === 'dev') {
//         const existed = await isFileExisted(`./module_cache/${cur}.umd.min.js`)
//         if (existed) {
//           acc += `  '${cur}': path.resolve(__dirname, './${cur}.umd.min.js'),\n`
//         }
//       } else {
//         acc += `  '${cur}': path.resolve(__dirname, './${cur}.umd.min.js'),\n`
//       }
//     } catch (error) {
//       console.warn(error)
//     }
//     return acc
//   }, `const path = require('path')\nexports.default = {\n`)
//   fs.writeFile('./module_cache/module.conf.js', conf + '}', cb)
// }

// 安装依赖
async function installModule(cb) {
  console.log('安装子应用')
  for (let module in modules) {
    await npmInstall(module, modules[module])
  }
}

exports.install_dev = gulp.series(writeImoprts.bind({}, 'dev'), writeLoadBuildView.bind({}, 'dev'))
exports.install_build = gulp.series(installModule, writeImoprts.bind({}, 'build'), writeLoadBuildView.bind({}, 'build'))