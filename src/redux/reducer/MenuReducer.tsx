
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"

const MenuReducer = createSlice({
    name: "Menu",
    initialState: false,
    reducers: {
        setMenu: {
            reducer: (state, action: PayloadAction<boolean>) => {
                return (state = action.payload)
            },
            prepare: (msg) => {
                return {
                    payload: msg
                }
            }
        }
    }
})
export const { actions, reducer } = MenuReducer
export const { setMenu } = actions;

export default MenuReducer