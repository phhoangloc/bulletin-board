export type BookType = {
    _id: string,
    genre: string,
    img: string,
    pdf: string,
    name: string,
    author: string,
    slug: string,
    owner: string,
    detail: string,
    slogan?: string,
    createDate?: Date,
}
export type BlogType = {
    _id: string,
    genre: string,
    cover: string,
    title: string,
    author: string,
    slug: string,
    owner: string,
    detail: string,
    createDate?: Date,
}