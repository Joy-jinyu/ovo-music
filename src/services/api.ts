import Taro, { addInterceptor } from '@tarojs/taro'
import { OptionType } from '@/typings/api'

import { logError } from '../utils/error'
import { interceptors } from './interceptor'

interceptors.forEach((i) => addInterceptor(i))

const baseUrl = 'https://music.ovometa.ink'

export default {
  baseOptions(params, method = 'GET') {
    let { url, data, config = {} } = params
    const { header, ...reqOption } = config

    data = {
      ...data,
      timestamp: new Date().getTime()
    }

    const option: OptionType = {
      url: url.indexOf('http') !== -1 ? url : baseUrl + url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/json',
        ...header
      },
      mode: 'cors',
      xhrFields: { withCredentials: true },
      error(e) {
        logError('api', '请求接口出现问题', e)
      },
      ...reqOption
    }
    // eslint-disable-next-line
    return Taro.request(option)
  },
  get(url, data?: object, config?: any) {
    let option = { url, data, config }
    return this.baseOptions(option)
  },
  post: function (url, data?: object, config?: any) {
    let option = { url, data, config }
    return this.baseOptions(option, 'POST')
  },
  put(url, data?: object, config?: any) {
    let option = { url, data, config }
    return this.baseOptions(option, 'PUT')
  },
  delete(url, data?: object, config?: any) {
    let option = { url, data, config }
    return this.baseOptions(option, 'DELETE')
  }
}
