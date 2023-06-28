import Taro, { addInterceptor } from '@tarojs/taro'
import { OptionType } from '@/typings/api'

import { logError } from '../utils/error'
import { interceptors } from './interceptor'

interceptors.forEach((i) => addInterceptor(i))

const baseUrl = 'https://music.ovometa.ink'

export default {
  baseOptions(params, method = 'GET') {
    let { url, data } = params
    let contentType = 'application/json'
    contentType = params.contentType || contentType

    data = {
      ...data,
      timestamp: new Date().getTime()
      // cookie: Taro.getStorageSync("cookies"),
    }

    const option: OptionType = {
      url: url.indexOf('http') !== -1 ? url : baseUrl + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType
        // cookie: Taro.getStorageSync('cookies')
      },
      mode: 'cors',
      xhrFields: { withCredentials: true },
      error(e) {
        logError('api', '请求接口出现问题', e)
      }
    }
    // eslint-disable-next-line
    return Taro.request(option)
  },
  get(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post: function (url, data?: object, contentType?: string) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  },
  put(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'PUT')
  },
  delete(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'DELETE')
  }
}
