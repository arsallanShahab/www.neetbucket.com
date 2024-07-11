import { HardCopyEntry } from "@/types/contentful/hardcopy";
import { SoftCopyEntry } from "@/types/contentful/softcopy";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CartState {
  order_type: "softcopy" | "hardcopy";
  softcopy_items: SoftCopyEntry[];
  hardcopy_items: HardCopyEntry[];
  isCartOpen: boolean;
  isFirstTimeCartOpen: boolean;
  total_items_softcopy: number;
  total_amount_softcopy: number;
  total_items_hardcopy: number;
  total_amount_hardcopy: number;
}

const initialState: CartState = {
  order_type: "softcopy",
  isCartOpen: false,
  isFirstTimeCartOpen: true,
  softcopy_items: [],
  total_items_softcopy: 0,
  total_amount_softcopy: 0,
  hardcopy_items: [],
  total_items_hardcopy: 0,
  total_amount_hardcopy: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<SoftCopyEntry>) {
      state.order_type = "softcopy";
      if (
        state.softcopy_items.find(
          (item) => item.sys.id === action.payload.sys.id,
        )
      ) {
        return;
      }
      state.softcopy_items.push(action.payload);
      state.total_items_softcopy = state.softcopy_items.length;
      state.total_amount_softcopy = state.softcopy_items.reduce(
        (acc, item) => acc + item.fields.price,
        0,
      );
    },
    buyNowSoftCopy(state, action: PayloadAction<SoftCopyEntry>) {
      state.order_type = "softcopy";
      state.softcopy_items = [action.payload];
      state.total_items_softcopy = state.softcopy_items.length;
      state.total_amount_softcopy = state.softcopy_items.reduce(
        (acc, item) => acc + item.fields.price,
        0,
      );
    },
    removeItem(state, action: PayloadAction<SoftCopyEntry["sys"]["id"]>) {
      state.softcopy_items = state.softcopy_items.filter(
        (item) => item.sys.id !== action.payload,
      );
      state.total_items_softcopy = state.softcopy_items.length;
      state.total_amount_softcopy = state.softcopy_items.reduce(
        (acc, item) => acc + item.fields.price,
        0,
      );
    },
    addItemHardCopy(state, action: PayloadAction<HardCopyEntry>) {
      console.log("Adding hardcopy item", action.payload);
      state.order_type = "hardcopy";
      if (
        state?.hardcopy_items?.find(
          (item) => item?.sys?.id === action?.payload?.sys?.id,
        )
      ) {
        return;
      }
      // state?.hardcopy_items?.push(action?.payload);
      // state.total_items_hardcopy = state?.hardcopy_items?.length;
      // state.total_amount_hardcopy = state?.hardcopy_items?.reduce(
      //   (acc, item) => acc + item?.fields?.price,
      //   0,
      // );
      state.hardcopy_items = [action.payload];
      state.total_items_hardcopy = state.hardcopy_items.length;
      state.total_amount_hardcopy = state.hardcopy_items.reduce(
        (acc, item) => acc + item.fields.price,
        0,
      );
    },
    removeItemHardCopy(
      state,
      action: PayloadAction<HardCopyEntry["sys"]["id"]>,
    ) {
      state.hardcopy_items = state.hardcopy_items.filter(
        (item) => item.sys.id !== action.payload,
      );
      state.total_items_hardcopy = state.hardcopy_items.length;
      state.total_amount_hardcopy = state.hardcopy_items.reduce(
        (acc, item) => acc + item.fields.price,
        0,
      );
    },

    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.isCartOpen = action.payload;
    },
    setFirstTimeCartOpen(state, action: PayloadAction<boolean>) {
      state.isFirstTimeCartOpen = action.payload;
    },
    clearCart(state) {
      state.softcopy_items = [];
      state.hardcopy_items = [];
      state.total_items_softcopy = 0;
      state.total_amount_softcopy = 0;
      state.total_items_hardcopy = 0;
      state.total_amount_hardcopy = 0;
      state.isCartOpen = false;
      state.isFirstTimeCartOpen = true;
    },
  },
});

export const {
  addItem,
  removeItem,
  buyNowSoftCopy,
  toggleCart,
  addItemHardCopy,
  removeItemHardCopy,
  clearCart,
  setCartOpen,
  setFirstTimeCartOpen,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
