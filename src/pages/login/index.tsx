import Taro from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import { View, Input, CoverImage } from '@tarojs/components'
import { AtIcon, AtButton, AtToast } from 'taro-ui'
import CTitle from '@/components/CTitle'
import api from '@/services/api'
import { createQRCode, checkLoginStatus } from '@/actions/common'
import { useAppDispatch } from '@/store'
import { commonState } from '@/reducers/common'
import { useSelector } from 'react-redux'

import './index.scss'

type InputType = 'phone' | 'password'

const Login = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false)
  const [showTip, setShowTip] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [tip, setTip] = useState<string>('')
  const timerRef = useRef<NodeJS.Timer>()
  const dataRef = useRef<any>()

  const dispatch = useAppDispatch()
  const { qrCode, unikey, userInfo } = useSelector(commonState)

  dataRef.current = {
    unikey,
    userInfo
  }

  console.log(qrCode, unikey, userInfo)

  function handleLoginStatus(res) {
    const { code } = res.data
    let _tip = '登录成功'
    if (code !== 200) {
      _tip = res.data.msg || '登录失败'
    }
    setShowLoading(false)
    setShowTip(true)
    setTip(_tip)
    setTimeout(() => {
      setShowTip(false)
    }, 2000)
    if (code === 200) {
      Taro.setStorageSync('userInfo', res.data)
      Taro.setStorageSync('userId', res.data.account.id)
      Taro.navigateTo({
        url: '/pages/index/index'
      })
    }
  }

  function login() {
    if (!phone) {
      this.setState({
        showTip: true,
        tip: '请输入手机号'
      })
      return
    }
    if (!password) {
      this.setState({
        showTip: true,
        tip: '请输入密码'
      })
      return
    }
    setShowLoading(true)
    api
      .get('/login/cellphone', {
        phone,
        password
      })
      .then((res) => {
        handleLoginStatus(res)
      })
  }

  function handleChange(type: InputType, event) {
    const { value } = event.detail
    if (type === 'phone') {
      setPhone(value)
    } else {
      setPassword(value)
    }
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const { userInfo: _userInfo, unikey: _unikey } = dataRef.current
      if (_userInfo) {
        clearInterval(timerRef.current)
        return
      }
      if (_unikey) {
        dispatch(checkLoginStatus({ unikey: _unikey }))
      }
    }, 10 * 1000)
    dispatch(createQRCode())

    return () => {
      clearInterval(timerRef.current)
    }
  }, [dispatch])

  return (
    <View className="login_container">
      <CTitle isFixed={false} />
      <View className="login_content">
        <View className="login_content__item">
          <AtIcon value="iphone" size="24" color="#ccc"></AtIcon>
          <Input
            type="text"
            placeholder="手机号"
            className="login_content__input"
            onInput={(e): void => {
              handleChange('phone', e)
            }}
          />
        </View>
        <View className="login_content__item">
          <AtIcon value="lock" size="24" color="#ccc"></AtIcon>
          <Input
            type="text"
            password
            placeholder="密码"
            className="login_content__input"
            onInput={(e): void => {
              handleChange('password', e)
            }}
          />
        </View>
        {/* @ts-ignore */}
        <AtButton className="login_content__btn" onClick={() => login()}>
          登录
        </AtButton>
        <CoverImage className="login_content__qrCode" src={qrCode} />
      </View>
      <AtToast isOpened={showLoading} text="登录中" status="loading" hasMask duration={30000000}></AtToast>
      <AtToast isOpened={showTip} text={tip} hasMask duration={2000}></AtToast>
    </View>
  )
}

export default Login
