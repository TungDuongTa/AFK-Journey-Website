import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IntroVideoState {
  inTroVideoPlayTime: number;
}

const initialState: IntroVideoState = {
  inTroVideoPlayTime: 0,
};

const introVideoSlice = createSlice({
  name: "introVideo",
  initialState,
  reducers: {
    setInTroVideoPlayTime: (state, action: PayloadAction<number>) => {
      state.inTroVideoPlayTime = action.payload;
    },
  },
});

export const { setInTroVideoPlayTime } = introVideoSlice.actions;
export default introVideoSlice.reducer;
