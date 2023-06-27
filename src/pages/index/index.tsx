import Taro from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'

import { useEffect, useState } from 'react'
import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import classnames from 'classnames'
import CLoading from '@components/CLoading'
import CMusic from '@components/CMusic'
import { songState } from '@/reducers/song'

import { getRecommend, getRecommendDj, getRecommendNewSong, updatePlayStatus, getBannerList } from '@/actions/song'
import { useAppDispatch } from '@/store'

import './index.scss'

const Home = () => {
  const song = useSelector(songState)
  const dispatch = useAppDispatch()

  const [current, setCurrent] = useState(0)
  const [showLoading] = useState(false)
  const { bannerList, currentSongInfo, isPlaying, canPlayList } = song

  useEffect(() => {
    getRecommendNewSong()
    getRecommendDj()
    getRecommend()
    dispatch(getBannerList())
  }, [dispatch])

  const goPage = () => {
    Taro.showToast({
      title: '正在开发中，敬请期待',
      icon: 'none'
    })
  }

  const switchTab = (value) => {
    setCurrent(value)
    // Taro.reLaunch({
    //   url: '/pages/my/index'
    // })
  }

  return (
    <View
      className={classnames({
        index_container: true,
        hasMusicBox: !!song.currentSongInfo.name
      })}
    >
      <CLoading fullPage hide={!showLoading} />
      <CMusic
        songInfo={{
          currentSongInfo,
          isPlaying,
          canPlayList
        }}
        isHome
        onUpdatePlayStatus={updatePlayStatus}
      />
      {!!bannerList.length && (
        <Swiper className="banner_list" circular indicatorDots autoplay>
          {bannerList.map((item) => (
            <SwiperItem key={item.bannerId} className="banner_list__item" onClick={goPage}>
              <Image src={item.pic} className="banner_list__item__img" />
            </SwiperItem>
          ))}
        </Swiper>
      )}
      <AtTabBar
        fixed
        tabList={[
          { title: '发现', iconPrefixClass: 'fa', iconType: 'feed' },
          { title: '我的', iconPrefixClass: 'fa', iconType: 'music' }
        ]}
        onClick={switchTab}
        current={current}
      />
    </View>
  )
}

export default Home
