import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wishlist:typeof window!=='undefined' && localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')!):[]
}

export const wishlistSlice = createSlice({
    name: "wishlistitem",
    initialState,
    reducers: {
        setWishlistitem: (state, action) => {
            const wishlistitems = [...state.wishlist, action.payload]
            state.wishlist = wishlistitems
            localStorage.setItem('wishlist', JSON.stringify(wishlistitems));
        },
        removefromwishlist: (state, action) => {
            const wishlistitems = state.wishlist.filter((item: any) => item._id !== action.payload);
            state.wishlist = wishlistitems
            localStorage.setItem('wishlist', JSON.stringify(wishlistitems));
        }
    }
})

export const {setWishlistitem, removefromwishlist} = wishlistSlice.actions;
export default wishlistSlice.reducer;