import { SoftCopyChapter } from "@/lib/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CartState {
  items: SoftCopyChapter[];
  isCartOpen: boolean;
  total_items: number;
  total_amount: number;
}

const initialState: CartState = {
  items: [],
  isCartOpen: false,
  total_items: 0,
  total_amount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<SoftCopyChapter>) {
      if (state.items.find((item) => item.sys.id === action.payload.sys.id)) {
        return;
      }
      state.items.push(action.payload);
      state.total_items = state.items.length;
      state.total_amount = state.items.reduce(
        (acc, item) => acc + item.fields.price,
        0,
      );
    },
    removeItem(state, action: PayloadAction<SoftCopyChapter["sys"]["id"]>) {
      state.items = state.items.filter(
        (item) => item.sys.id !== action.payload,
      );
      state.total_items = state.items.length;
      state.total_amount = state.items.reduce(
        (acc, item) => acc + item.fields.price,
        0,
      );
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const { addItem, removeItem, toggleCart } = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
