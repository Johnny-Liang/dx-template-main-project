// 请求服务地址处理
// let BASE_URL = process.env.VUE_APP_API_URL
let BASE_URL = 'http://10.0.10.211:10000'
if (process.env.VUE_APP_ENV === 'production' || process.env.VUE_APP_ENV === 'uat') { // 生产环境和uat环境根据访问URL IP进行访问指定
  BASE_URL = `${window.location.protocol}//${window.location.hostname}:${(process as any).env.VUE_APP_API_URL.match(/\d+$/g)[0]}`
}
export {
  BASE_URL
}