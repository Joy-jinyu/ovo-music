import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

import {
  GETPLAYLISTDETAIL,
  GETRECOMMENDPLAYLIST,
  GETRECOMMENDDJ,
  GETRECOMMENDNEWSONG,
  GETRECOMMEND,
  GETSONGINFO,
  CHANGEPLAYMODE,
  GETLIKEMUSICLIST,
  UPDATELIKEMUSICLIST,
  UPDATEPLAYSTATUS,
  UPDATECANPLAYLIST,
  UPDATERECENTTAB,
  RESETPLAYLIST,
} from "../constants/song";

import { songType } from "../constants/commonType";

const INITIAL_STATE: songType = {
  playListDetailInfo: {
    coverImgUrl: "",
    name: "",
    playCount: 0,
    tags: [],
    creator: {
      avatarUrl: "",
      nickname: "",
    },
    tracks: [],
  },
  canPlayList: [],
  playListDetailPrivileges: [],
  recommendPlayList: [],
  recommendDj: [],
  recommendNewSong: [],
  recommend: [],
  myCreateList: [],
  myCollectList: [],
  currentSongId: "",
  currentSongInfo: {
    id: 0,
    name: "",
    ar: [],
    al: {
      picUrl: "",
      name: "",
    },
    url: "",
    lrcInfo: "",
    dt: 0, // 总时长，ms
    st: 0, // 是否喜欢
  },
  currentSongIndex: 0,
  playMode: "loop",
  likeMusicList: [],
  isPlaying: false,
  recentTab: 0,
};

export const songSlice = createSlice({
  name: "song",
  initialState: INITIAL_STATE,
  reducers: {
    [GETPLAYLISTDETAIL]: (state, action) => {
      const { playListDetailInfo, playListDetailPrivileges } = action.payload;
      let canPlayList = playListDetailInfo.tracks.filter((_, index) => {
        return playListDetailPrivileges[index].st !== -200;
      });
      state.playListDetailInfo = playListDetailInfo;
      state.playListDetailPrivileges = playListDetailPrivileges;
      state.canPlayList = canPlayList;
    },
    [RESETPLAYLIST]: (state) => {
      state.playListDetailInfo = INITIAL_STATE.playListDetailInfo;
      state.playListDetailPrivileges = [];
      state.canPlayList = [];
    },
    [GETRECOMMENDPLAYLIST]: (state, action) => {
      const { recommendPlayList } = action.payload;
      state.recommendPlayList = recommendPlayList;
    },
    [GETRECOMMENDDJ]: (state, action) => {
      const { recommendDj } = action.payload;
      state.recommendDj = recommendDj;
    },
    [GETRECOMMENDNEWSONG]: (state, action) => {
      const { recommendNewSong } = action.payload;
      state.recommendNewSong = recommendNewSong;
    },
    [GETRECOMMEND]: (state, action) => {
      const { recommend } = action.payload;
      state.recommend = recommend;
    },
    [GETSONGINFO]: (state, action) => {
      const { currentSongInfo } = action.payload;
      const currentSongIndex = state.canPlayList.findIndex(
        (item) => item.id === currentSongInfo.id
      );
      const canPlayList = state.canPlayList.map((item, index) => {
        item.current = false;
        if (currentSongIndex === index) {
          item.current = true;
        }
        return item;
      });
      state.currentSongInfo = currentSongInfo;
      state.currentSongIndex = currentSongIndex;
      state.canPlayList = canPlayList;
    },
    [CHANGEPLAYMODE]: (state, action) => {
      const { playMode } = action.payload;
      state.playMode = playMode;
    },
    [GETLIKEMUSICLIST]: (state, action) => {
      const { likeMusicList } = action.payload;
      state.likeMusicList = likeMusicList;
    },
    [UPDATELIKEMUSICLIST]: (state, action) => {
      const { like, id } = action.payload;
      let likeMusicList: Array<number> = [];
      if (like) {
        likeMusicList = state.likeMusicList.concat([id]);
      } else {
        state.likeMusicList.forEach((item) => {
          if (item !== id) likeMusicList.push(item);
        });
      }
      state.likeMusicList = likeMusicList;
    },
    [UPDATEPLAYSTATUS]: (state, action) => {
      const { isPlaying } = action.payload;
      state.isPlaying = isPlaying;
    },
    [UPDATECANPLAYLIST]: (state, action) => {
      const { canPlayList } = action.payload;
      const currentSongIndex = canPlayList.findIndex(
        (item) => item.id === action.payload.currentSongId
      );
      state.canPlayList = canPlayList;
      state.currentSongIndex = currentSongIndex;
    },
    [UPDATERECENTTAB]: (state, action) => {
      const { recentTab } = action.payload;
      state.recentTab = recentTab;
    },
  },
});

export const songState = (state: RootState) => state.song;
