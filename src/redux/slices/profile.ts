import { ISoftCopy } from "@/pages/profile";
import { createSlice } from "@reduxjs/toolkit";

interface IProfile {
  orders: {
    softcopy: ISoftCopy[];
  };
}

const initialState: IProfile = {
  orders: {
    softcopy: [],
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addSoftCopyOrders: (state, action) => {
      state.orders.softcopy = action.payload;
    },
    removeSoftCopyOrders: (state) => {
      state.orders.softcopy = [];
    },
  },
});

export const { addSoftCopyOrders, removeSoftCopyOrders } = profileSlice.actions;

export const profileReducer = profileSlice.reducer;
