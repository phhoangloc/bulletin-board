import { InforType } from "./propType"
export type ThemeContextType = {
    theme: string,
    toggleTheme: () => void
}
export type BooleanContextType = {
    modal: boolean,
    toggleModal: () => void
}

export type UserContextType = {
    id: string,
    username: string
    i: number,
    infor: InforType | undefined,
    UserFecth: () => void
    changeI: () => void

}