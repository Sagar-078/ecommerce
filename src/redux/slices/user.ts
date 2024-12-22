"use client"
import { createSlice } from "@reduxjs/toolkit"

// interface UserState {
//     user: object | null; // Define a specific type for user if possible
// }

const initialState = {
    // user:"sagar"
    user:typeof window!=='undefined' && localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')!): null
}

export const userslice = createSlice({
    name: "authUser",
    initialState,
    reducers: {
        setUser:(state, action) => {
            state.user = action.payload,
            localStorage.setItem("user", JSON.stringify(action.payload))
        }
    }
})

export const {setUser} = userslice.actions;
export default userslice.reducer;