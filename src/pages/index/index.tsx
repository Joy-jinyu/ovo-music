import Taro from "@tarojs/taro";
import { useSelector } from "react-redux";
import { AtTabBar, AtSearchBar, AtIcon } from "taro-ui";

import { useEffect, useState } from "react";
import { View, Image, Text, Swiper, SwiperItem } from "@tarojs/components";
import classnames from "classnames";
import CLoading from "@components/CLoading";
import CMusic from "@components/CMusic";
import api from "@services/api";
import { djState } from "@/reducers/dj";
import { songState } from "@/reducers/song";

import {
  getRecommend,
  getRecommendDj,
  getRecommendNewSong,
  getRecommendPlayList,
  updatePlayStatus,
} from "@/actions/song";

import "./index.scss";

interface Banner {
  typeTitle: string;
  pic: string;
  bannerId: number;
}

const Home = () => {
  const dj = useSelector(djState);
  const song = useSelector(songState);

  const [current, setCurrent] = useState(0);
  const [bannerList, setBannerList] = useState<Array<Banner>>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { recommendPlayList, currentSongInfo, isPlaying, canPlayList } = song;

  useEffect(() => {
    getRecommendPlayList();
    getRecommendNewSong();
    getRecommendDj();
    getRecommend();
    getBanner();
  });

  const getBanner = () => {
    api
      .get("/banner", {
        type: 1,
      })
      .then(({ data }) => {
        if (data.banners) {
          setBannerList(data.banners);
        }
      });
  };

  const goSearch = () => {
    Taro.navigateTo({
      url: `/pages/packageA/pages/search/index`,
    });
  };

  const goPage = (page: string) => {
    Taro.showToast({
      title: "正在开发中，敬请期待",
      icon: "none",
    });
  };

  const goDetail = (item) => {
    Taro.navigateTo({
      url: `/pages/packageA/pages/playListDetail/index?id=${item.id}&name=${item.name}`,
    });
  };

  const switchTab = (value) => {
    if (value !== 1) return;
    Taro.reLaunch({
      url: "/pages/my/index",
    });
  };

  return (
    <View
      className={classnames({
        index_container: true,
        hasMusicBox: !!song.currentSongInfo.name,
      })}
    >
      <CLoading fullPage hide={!showLoading} />
      <CMusic
        songInfo={{
          currentSongInfo,
          isPlaying,
          canPlayList,
        }}
        isHome
        onUpdatePlayStatus={updatePlayStatus}
      />
      <View onClick={goSearch}>
        {/* <AtSearchBar
          actionName='搜一下'
          disabled
          value={searchValue}
          onChange={goSearch}
        /> */}
      </View>
      {bannerList.length && (
        <Swiper
          className='banner_list'
          indicatorColor='#999'
          indicatorActiveColor='#d43c33'
          circular
          indicatorDots
          autoplay
        >
          {bannerList.map((item) => (
            <SwiperItem key={item.bannerId} className='banner_list__item'>
              <Image src={item.pic} className='banner_list__item__img' />
            </SwiperItem>
          ))}
        </Swiper>
      )}
      <View className='handle_list'>
        <View
          className='handle_list__item'
          onClick={() => goPage("dailyRecommend")}
        >
          <View className='handle_list__item__icon-wrap'>
            <AtIcon
              prefixClass='fa'
              value='calendar-minus-o'
              size='25'
              color='#ffffff'
              className='handle_list_item__icon'
            ></AtIcon>
          </View>
          <Text className='handle_list__item__text'>每日推荐</Text>
        </View>
        <View className='handle_list__item' onClick={() => goPage("rank")}>
          <View className='handle_list__item__icon-wrap'>
            <AtIcon
              prefixClass='fa'
              value='bar-chart'
              size='25'
              color='#ffffff'
              className='handle_list_item__icon'
            ></AtIcon>
          </View>
          <Text className='handle_list__item__text'>排行榜</Text>
        </View>
      </View>
      <View className='recommend_playlist'>
        <View className='recommend_playlist__title'>推荐歌单</View>
        <View className='recommend_playlist__content'>
          {recommendPlayList.map((item) => (
            <View
              key={item.id}
              className='recommend_playlist__item'
              onClick={() => goDetail(item)}
            >
              <Image
                src={`${item.picUrl}?imageView&thumbnail=250x0`}
                className='recommend_playlist__item__cover'
              />
              <View className='recommend_playlist__item__cover__num'>
                <Text className='at-icon at-icon-sound'></Text>
                {item.playCount < 10000
                  ? item.playCount
                  : `${Number(item.playCount / 10000).toFixed(0)}万`}
              </View>
              <View className='recommend_playlist__item__title'>
                {item.name}
              </View>
            </View>
          ))}
        </View>
      </View>
      <AtTabBar
        fixed
        selectedColor='#d43c33'
        tabList={[
          { title: "发现", iconPrefixClass: "fa", iconType: "feed" },
          { title: "我的", iconPrefixClass: "fa", iconType: "music" },
        ]}
        onClick={switchTab}
        current={current}
      />
    </View>
  );
};

export default Home;
