// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     cart:typeof window!=='undefined' && localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!):[]
// }

// export const cartSlice = createSlice({
//     name: "cartitem",
//     initialState,
//     reducers: {
//         addToCartItem : (state, action) => {
//             const cartitems = [...state.cart, action.payload]
//             state.cart = cartitems
//             localStorage.setItem('cart', JSON.stringify(cartitems));
//         },
//         removeFromCartItem: (state, action) => {
//             const cartitems = state.cart.filter((item:any) => item._id !== action.payload)
//             state.cart = cartitems
//             localStorage.setItem('cart', JSON.stringify(cartitems))
//         },
//         increaseQuantity: (state, action) => {
//             const cartProduct = state.cart.findIndex((item:any) => item._id === action.payload)
//             if(cartProduct){
//                 cartProduct.quantity += 1;
//                 localStorage.setItem('cart', JSON.stringify(state.cart));
//             }
//         },
//         decreaseQuantity: (state, action) => {
//             const cartProduct = state.cart.find((item:any) => item._id === action.payload)
//             if(cartProduct && cartProduct.quantity > 1){
//                 cartProduct.quantity -= 1;
//                 localStorage.setItem('cart', JSON.stringify(state.cart))
//             }
//         },
//         resetCart: (state, action) => {
//             state.cart =[]
//             localStorage.setItem('cart', JSON.stringify([]))
//         }
//     }
// })

// export const {addToCartItem, removeFromCartItem, increaseQuantity, decreaseQuantity, resetCart} = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: typeof window !== 'undefined' && localStorage.getItem('cart') 
        ? JSON.parse(localStorage.getItem('cart')!) 
        : []
};

export const cartSlice = createSlice({
    name: "cartitem",
    initialState,
    reducers: {
        addToCartItem: (state, action) => {
            const existingItem = state.cart.find((item:any) => item._id === action.payload._id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                const newItem = { ...action.payload, quantity: 1 };
                state.cart.push(newItem);
            }

            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        removeFromCartItem: (state, action) => {
            const updatedCart = state.cart.filter((item:any) => item._id !== action.payload);
            state.cart = updatedCart;
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        },
        increaseQuantity: (state, action) => {
            const item = state.cart.find((item:any) => item._id === action.payload);
            if (item) {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.cart.find((item:any) => item._id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(state.cart));
            } else if (item && item.quantity === 1) {
                state.cart = state.cart.filter((cartItem:any) => cartItem._id !== item._id);
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }
        },
        resetCart: (state) => {
            state.cart = [];
            localStorage.setItem('cart', JSON.stringify([]));
        }
    }
});

export const { addToCartItem, removeFromCartItem, increaseQuantity, decreaseQuantity, resetCart } = cartSlice.actions;
export default cartSlice.reducer;