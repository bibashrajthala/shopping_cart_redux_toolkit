import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { openModal } from "../modal/modalSlice";
import cartItems from "../../cartItems";

const url = "https://course-api.com/react-useReducer-cart-project";

const initialState = {
  // cartItems: cartItems,
  cartItems: [],
  total: 0,
  amount: 4,
  isLoading: false,
  error: null,
};

// export const getCartItems = createAsyncThunk("cart/getCartItems", () => {
//   return axios
//     .get(url)
//     .then((res) => res.data)
//     .catch((err) => console.log(err));
// });

// OR

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (name, thunkAPI) => {
    // first parameter is argument sent from components if necessary while api call such as in params or for post,patch requests
    try {
      // console.log("passed data", name);
      // console.log("whole thunk API", thunkAPI);
      // console.log("thunk api getState()", thunkAPI.getState());
      // can use it to access other reducers,states as well
      // thunkAPI.dispatch(openModal());
      const resp = await axios.get(url);

      return resp.data;
    } catch (error) {
      console.log("error", error);
      // return thunkAPI.rejectWithValue(error.message);
      return thunkAPI.rejectWithValue(error.response.data);
      // return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

const getCartItemsPending = ["cart/getCartItems/pending"];
const getCartItemsFulfilled = ["cart/getCartItems/fulfilled"];
const getCartItemsRejected = ["cart/getCartItems/rejected"];

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = []; // directly mutate
      // or return new state ,but whatever we return becomes new state
      //eg if we return [], our state is now empty array, if we return {cartItems:[]} it is this object without total,amount,isloading , if we return {...state,cartItems:[]} ,then is same as previous but updates cartItems
      //   return { ...state, cartItems: [] };
    },
    removeItem: (state, action) => {
      //   console.log(action);
      //   console.log(action.payload);
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      //   console.log(action.payload);
      // console.log(payload)

      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
  // extraReducers: {
  //   [getCartItems.pending]: (state) => {
  //     state.isLoading = true;
  //   },
  //   [getCartItems.fulfilled]: (state, action) => {
  //     // console.log(action);
  //     state.isLoading = false;
  //     state.cartItems = action.payload;
  //     state.error = null;
  //   },
  //   [getCartItems.rejected]: (state, action) => {
  //     console.log(action);
  //     state.isLoading = false;
  //     state.error = action.payload;
  //   },
  // },

  // OR,

  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getCartItems.pending, (state, action) => {
  //       state.isLoading = true;
  //     })
  //     .addCase(getCartItems.fulfilled, (state, action) => {
  //       console.log(action);
  //       state.isLoading = false;
  //       state.cartItems = action.payload;
  //       state.error = null;
  //     })
  //     .addCase(getCartItems.rejected, (state, action) => {
  //       console.log(action);
  //       state.isLoading = false;
  //       state.error = action.payload;
  //     });
  // },

  //OR,

  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => getCartItemsPending.includes(action.type),
        (state, action) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) => getCartItemsFulfilled.includes(action.type),
        (state, action) => {
          console.log(action);
          state.isLoading = false;
          state.cartItems = action.payload;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => getCartItemsRejected.includes(action.type),
        (state, action) => {
          console.log(action);
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

// console.log(cartSlice);

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
