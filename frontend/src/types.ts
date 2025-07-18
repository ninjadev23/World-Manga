export interface TypeVolume {
    file: string
    number: number
    cover: string
}
export interface TypeManga {
    id: number
    title: string
    description: string
    categories: string[]
    language: string
    cover: string
    username: string
    volumes: TypeVolume[]
}