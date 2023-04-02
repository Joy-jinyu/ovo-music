import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@store/index";

import { GETDJLISTDETAIL } from "../constants/dj";

import { djListType } from "../constants/commonType";

const INITIAL_STATE: djListType = {
  djListDetailInfo: {
    name: "",
  },
};

export const djSlice = createSlice({
  name: "dj",
  initialState: INITIAL_STATE,
  reducers: {
    [GETDJLISTDETAIL]: (state, action) => {
      const { djListDetailInfo } = action.payload;
      state.djListDetailInfo = djListDetailInfo;
    },
  },
});

export const djState = (state: RootState) => state.dj;
