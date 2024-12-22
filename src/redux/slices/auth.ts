"use client"
import { createSlice } from "@reduxjs/toolkit"

// interface AuthState {
//     token: string | null;
// }

const initialState = {
    token:typeof window!=='undefined' && localStorage.getItem("token") !== 'undefined' ? JSON.parse(localStorage.getItem("token")!): null,
}

export const authslice = createSlice({
    name: "authToken",
    initialState,
    reducers: {
        setToken:(state, action) => {
            state.token = action.payload,
            localStorage.setItem("token", JSON.stringify(action.payload))
        }
    }
})

export const {setToken} = authslice.actions;
export default authslice.reducer;