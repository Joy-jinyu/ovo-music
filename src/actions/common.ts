import Taro from '@tarojs/taro'
import {
  REDUCER_NAME,
  CREATE_LOGIN_QR_CODE,
  API_QR_KEY,
  API_QR_CODE,
  API_CHECK_LOGIN_STATUS,
  API_GET_LOGIN_INFO,
  GET_USER_INFO
} from '@/constants/common'
import { dispatchType } from '@/utils/connect'
import api from '@/services/api'

const commonDispatchType = dispatchType(REDUCER_NAME)

// 生成登录的二维码
export const createQRCode = () => {
  return async (dispatch) => {
    const { unikey } = await api.get(API_QR_KEY)
    const { qrimg } = await api.post(API_QR_CODE, {
      key: unikey,
      qrimg: true
    })

    dispatch({
      type: commonDispatchType(CREATE_LOGIN_QR_CODE),
      payload: {
        unikey,
        qrimg
      }
    })
  }
}

export const getUnikeyCookie = async (unikey) => {
  const { cookie } = await api.get(
    API_CHECK_LOGIN_STATUS,
    {
      key: unikey
    },
    {
      isComplete: true
    }
  )

  Taro.setStorageSync('cookie', cookie)
  return cookie
}

// 检查用户的登录状态
export const checkLoginStatus = ({ unikey }) => {
  return async (dispatch) => {
    try {
      let cookie = Taro.getStorageSync('cookie')

      if (!cookie) {
        cookie = await getUnikeyCookie(unikey)
      }

      if (!cookie) {
        return ''
      }

      const data = await api.post(API_GET_LOGIN_INFO, {
        cookie
      })

      dispatch({
        type: commonDispatchType(GET_USER_INFO),
        payload: data
      })
    } catch {}
  }
}
