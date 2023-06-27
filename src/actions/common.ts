import { REDUCER_NAME, CREATE_LOGIN_QR_CODE, API_QR_KEY, API_QR_CODE } from '@/constants/common'
import { dispatchType } from '@/utils/connect'
import api from '@/services/api'

const commonDispatchType = dispatchType(REDUCER_NAME)

// 生成登录的二维码
export const createQRCode = () => {
  return async (dispatch) => {
    const qrCodeKeyRes = await api.get(API_QR_KEY)
    const qrCodeRes = await api.post(API_QR_CODE)

    dispatch({
      type: commonDispatchType(CREATE_LOGIN_QR_CODE),
      payload: qrCodeRes
    })
  }
}
