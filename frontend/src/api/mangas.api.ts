import axios from "axios"
const apiUrl = "http://localhost:8000/api/v1"
export const GetAllMangas = ()=>{
    return axios.get(`${apiUrl}/mangas/`)
}
export const GetMangaDetails = (id: number)=>{
    return axios.get(`${apiUrl}/mangas/${id}/`)
}
//export const loadMangasByQuery = (title: string)=>{
  //  return axios.get(`{}`)
//}