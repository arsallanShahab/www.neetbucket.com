// src/redux/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./slices/cart";
import { profileReducer } from "./slices/profile";
const rootReducer = combineReducers({
  cart: cartReducer,
  profile: profileReducer,
});

export default rootReducer;
