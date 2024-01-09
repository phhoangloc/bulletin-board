import { configureStore } from "@reduxjs/toolkit";
import ThemeReducer from "./reducer/ThemeReducer";
import MenuReducer from "./reducer/MenuReducer";
import UserReducer from "./reducer/UserReducer";
import RefreshReducer from "./reducer/RefreshReducer";
const store = configureStore({
    reducer: {
        theme: ThemeReducer.reducer,
        menu: MenuReducer.reducer,
        user: UserReducer.reducer,
        refresh: RefreshReducer.reducer
    }
})

export default store
