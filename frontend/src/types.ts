export interface TypeVolume {
    file: string
    number: number
    cover: string
    id: number
}
export interface TypeManga {
    id: number
    title: string
    description: string
    categories: string[]
    language: string
    cover: string
    username: string
    authorAvatar: string
    volumes: TypeVolume[]
}
export interface User{
    username: string
    password: string
    email: string
    avatar?: string | File
}
export type UserUpdateType = Omit<User, "password">
export type BackendErrors = Record<string, string[]> | null;
export type LoginUserType = Pick<User, "email" | "password">

export interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
}
export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}
export const categories = [
  "Shonen",
  "Seinen",
  "Fantasia Oscura",
  "Demonios",
  "Heroes"
]