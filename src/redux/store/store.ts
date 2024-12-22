// import { combineReducers } from "@reduxjs/toolkit";
// import { authslice } from "../slices/auth";
// import { userslice } from "../slices/user";



// const rootReducer = combineReducers({
//     authToken: authslice,
//     authUser: userslice
// })

// export default rootReducer;

// import { configureStore } from "@reduxjs/toolkit";
// import { authslice } from "../slices/auth";
// import { userslice } from "../slices/user";

// export const store = configureStore({
//     reducer: {
//         authToken: authslice.reducer,
//         authUser: userslice.reducer
//     }
// })

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { configureStore } from "@reduxjs/toolkit";
import { authslice } from "../slices/auth";
import { userslice } from "../slices/user";
import { wishlistSlice } from "../slices/wishlistItem";
import { cartSlice } from "../slices/cart";
import { paymentSlice } from "../slices/payment";

export const store = configureStore({
    reducer: {
        authToken: authslice.reducer,
        authUser: userslice.reducer,
        wishlistitem: wishlistSlice.reducer,
        cartitem: cartSlice.reducer,
        payment: paymentSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;