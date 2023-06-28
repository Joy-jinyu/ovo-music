/** 跨域策略 */
export interface CorsMode {
  /** 跨域请求将获取不透明的响应 */
  'no-cors'
  /** 允许跨域请求 */
  cors
  /** 请求总是向当前的源发起的 */
  'same-origin'
}

export type OptionType = {
  url: string
  data?: object | string
  method?: any
  header: object
  mode: keyof CorsMode
  error: any
  xhrFields: object
}
