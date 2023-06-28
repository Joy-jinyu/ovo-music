import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '@store/index'

import { GET_USER_INFO, REDUCER_NAME, CREATE_LOGIN_QR_CODE } from '@/constants/common'

const INITIAL_STATE = {
  userInfo: null,
  qrCode: '',
  unikey: ''
}

export const commonSlice = createSlice({
  name: REDUCER_NAME,
  initialState: INITIAL_STATE,
  reducers: {
    [CREATE_LOGIN_QR_CODE]: (state, action) => {
      const { qrimg, unikey } = action.payload

      state.qrCode = qrimg
      state.unikey = unikey
    },
    [GET_USER_INFO]: (state, action) => {
      state.userInfo = action.payload
    }
  }
})

export const commonState = (state: RootState) => state[REDUCER_NAME]
