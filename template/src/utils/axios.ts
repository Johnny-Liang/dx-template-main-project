import axios from 'axios'
import vm from '../main'
import store from '@/store/index'
import { BASE_URL } from './config'
// 创建axios实例
const service:any = axios.create({
  baseURL: BASE_URL,
  timeout: 50000                  // 请求超时时间
})

// request拦截器
service.interceptors.request.use((config:any) => {
  // Do something before request is sentconfig.headers['Content-Type'] = 'application/json';
  config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
  config.headers['EmployeeCode'] = store.state.user.employeeCode // fixme: 铁前临时用
  // 8080
  if (config.type == 'file') {
      config.headers['content-type'] = 'application/multipart/form-data'
  } else if (config.type == 'form') {
      config.headers['Content-type'] = 'application/x-www-form-urlencoded'
  }
  config.headers['Authorization'] = sessionStorage.getItem('authorization') || ''
  if (config.method.toLowerCase() === 'get') {
    config.data = true
  }
  // 8080
  return config
}, (error:any) => {
  // Do something with request error
  Promise.reject(error)
})

let alertErr = true
// respone拦截器
service.interceptors.response.use(
  (response:any) => {
    if (response.data.success === false) {
      if (response.data.code === 70001) { // token失效
        if (alertErr) {
          alertErr = false
          vm.$warning({
            title: '验证失效，请重新登录',
            content: response.data.message,
            okText: '好的',
            onOk() {
              store.dispatch('Logout')
            }
          })
        }
      } else {
        alertErr = true
        vm.$notification.warning({
          message: response.data.message,
          description: ''
        })
      }
    } else {
      alertErr = true
    }
    return response
  },
  (error:any) => {
    if (error.response && error.response.data && error.response.data.message) {
      vm.$notification.warning({
        message: error.response.data.message,
        description: ''
      });
    } else if (error) {
      vm.$notification.warning({
        message: error.message,
        description: ''
      });
    }
    error.data = error.data || {}
    return error
  }
)

service.formSubmit = function ({url, method = 'POST',data = {}, params = {}}: {url: string; method: string; data: any; params: {[key: string]: number | string | (string | number)[]}}) {
  let d = new URLSearchParams()
  Object.keys(data).map(key => {
    d.append(key, data[key])
  })
  let paramsStr = Object.keys(params).reduce((acc, key) => {
    const val = params[key]
    if (typeof val === 'number' || typeof val === 'string') {
      acc += `${acc ? '&' : '?'}${key}=${val}`
    } else if (val instanceof Array) {
      acc += `${acc ? '&' : '?'}${key}=${val.join(',')}`
    }
    return acc
  }, '')
  service({
    url: url + paramsStr,
    data: d,
    method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'blob'
  }).then((res: any) => {
    const disposition = res.headers['content-disposition']
    let fileName = disposition.substring(disposition.indexOf('filename=') + 9, disposition.length)
    // iso8859-1的字符转换成中文
    fileName = decodeURI(escape(fileName))
    // 去掉双引号
    fileName = fileName.replace(/"/g, "")
    const content = res.data
    let url = window.URL.createObjectURL(new Blob([content]))
    let link = document.createElement("a")
    link.style.display = "none"
    link.href = url
    link.setAttribute("download", fileName)
    // 模拟
    document.body.appendChild(link)
    link.click()
    // 释放URL 对象
    window.URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  })
}

service.baseUrl = BASE_URL

export default service
