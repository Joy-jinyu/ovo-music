
/* eslint-disable no-unused-vars */
declare namespace Request {
  interface Body {
    url: string
    params?: Record<string, string | number>
    data?: Record<string, any>
  }

  interface ResponseData {
    // 是否成功
    success?: boolean
    // 目标数据集
    data?: any
    // 错误信息
    message?: string
    // 错误码
    resultCode?: number
  }

  interface Config {
    timeout?: number // 请求超时时间5分钟
    baseURL?: string // api的base_url
  }
}
