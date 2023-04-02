import qs from 'qs'
import { request } from "@tarojs/taro";

class Request {
  config: Request.Config = {}

  loadConfig(config: Request.Config) {

    Object.assign(this.config, {
      timeout: 5 * 60 * 1000,
      baseURL: '',
    }, config)
  }

  formatOptions({ url, params = {} }: { url: string, params?: Record<string, string | number> }) {
    const { baseURL, timeout } = this.config

    const paramString = qs.stringify(params, { arrayFormat: 'repeat' })
    const relate = paramString ? '?' : ''


    return {
      url: `${baseURL}${url}${relate}${paramString}`,

      timeout,

      header: {
        "ngrok-skip-browser-warning": "true"
      }
    }
  }

  get({ url, params }: Request.Body) {
    const { url: _url, ...args } = this.formatOptions({
      url,
      params
    })

    return this.request({
      url: _url,
      method: 'GET',
      ...args
    })
  }

  post({ url, params, data }: Request.Body) {
    const { url: _url, ...args } = this.formatOptions({
      url,
      params
    })

    return this.request({
      url: _url,
      method: 'POST',
      data,
      ...args
    })
  }

  request(requestOptions: any) {
    return new Promise((resolve, reject) => {
      request({
        ...requestOptions,
        success: response => {
          const { statusCode, data, errMsg } = response
          if (statusCode === 200 && data?.success) {
            resolve(data?.data);
          } else {
            reject(errMsg || data?.message);
          }
        },
        fail: err => {
          const { errMsg } = err
          reject(errMsg || "服务器异常");
        }
      })
    })
  }
}

class SingleRequest {
  static _request: Request

  static getInstance(config: Request.Config) {
    if (!this._request) {
      this._request = new Request()
      this._request.loadConfig(config)
    }
    return this._request
  }
}

export default SingleRequest
