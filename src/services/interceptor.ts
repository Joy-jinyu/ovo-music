import Taro from '@tarojs/taro'
import { logError } from '@/utils/error'
import { HTTP_STATUS } from '@/constants/status'

const setCookie = (res: {
  cookies: Array<{
    name: string
    value: string
    expires: string
    path: string
  }>
  header: {
    'Set-Cookie': string
  }
}) => {
  if (res.cookies && res.cookies.length > 0) {
    let cookies = ''
    res.cookies.forEach((cookie, index) => {
      // windows的微信开发者工具返回的是cookie格式是有name和value的,在mac上是只是字符串的
      if (cookie.name && cookie.value) {
        cookies +=
          index === res.cookies.length - 1
            ? `${cookie.name}=${cookie.value};expires=${cookie.expires};path=${cookie.path}`
            : `${cookie.name}=${cookie.value};`
      } else {
        cookies += `${cookie}`
      }
    })
    Taro.setStorageSync('cookies', cookies)
  }
}

const ResponseInterceptor = (chain) => {
  const requestParams = chain.requestParams
  const { isComplete } = requestParams

  return chain.proceed(requestParams).then((res) => {
    // interceptor是洋葱模型，会执行两次
    if (!res?.statusCode) {
      return res
    }
    setCookie(res)
    if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
      logError('api', '请求资源不存在')
    } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
      logError('api', '服务端出现了问题')
    } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
      logError('api', '没有权限访问')
    } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
      Taro.clearStorage()
      Taro.navigateTo({
        url: '/pages/login/index'
      })
      logError('api', '请先登录')
    } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
      return isComplete ? res.data : res.data.data
    }

    return isComplete ? res.data : Promise.reject('服务器异常')
  })
}

export const interceptors = [ResponseInterceptor]
