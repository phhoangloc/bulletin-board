
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"

export type UserLogin = {
    success: boolean,
    id?: string,
    nickname?: string,
    email?: string,
}
const UserReducer = createSlice({
    name: "User",
    initialState: { success: false } as UserLogin,
    reducers: {
        setUser: {
            reducer: (state, action: PayloadAction<UserLogin>) => {
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
export const { actions, reducer } = UserReducer
export const { setUser } = actions;

export default UserReducer