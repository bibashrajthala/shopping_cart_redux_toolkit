import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  total: 0,
  amount: 0,
  isloading: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
});

console.log(cartSlice);
