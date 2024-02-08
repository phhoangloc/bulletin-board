
import React from "react";

export type iconType = {
    data: React.ReactNode[],
    func?: (i: number) => void
}
export type dividerType = {
    data: {
        name: string,
        url: string
    }[],
    func?: (i: number) => void
}
export type dividerColumType = {
    data: Record<string, string>,
}
export type ButtonType = {
    name: string,
    onClick: () => void
}

export type InputType = {
    dis?: boolean,
    type?: string,
    name: string,
    value: string,
    onChange: (e: any) => void,
    warn?: string,
    isFocus?: number
}

export type PageDetailType = {
    img?: string,
    name?: string,
    author?: string,
    detail?: string | TrustedHTML
    component?: React.ReactNode
}

export type InforType = {
    avata: string,
    fullname: string,
    phone: string,
    address: string,
}

export type ButtonUploadType = {
    onChange: (e: any) => void,
    multiple?: boolean,
    icon?: React.ReactNode
}
