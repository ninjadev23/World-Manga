import axios from "axios"
export const GetAllMangas = ()=>{
    return axios.get(`/api/v1/mangas/`)
}
export const GetMangaDetails = (id: number)=>{
    return axios.get(`/api/v1/mangas/${id}/`)
}
export const GetMangasOfUser = ()=>{
  return axios.get('/api/v1/usermangas', {
    withCredentials: true
  })
} 
export const CreateManga = (data: FormData)=>{
  return axios.post('/api/v1/mangas/', data, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true
  })
}
export const CreateVolume = (mangaID: number, data: FormData)=>{
  return axios.post(`/api/v1/mangas/${mangaID}/volumes/`, data, {
    headers: { Accept: "application/json" },
    withCredentials: true
  })
}
export const DeleteVolume = (volumeID: number)=>{
  return axios.delete(`/api/v1/mangas/volumes/${volumeID}/`, {
    withCredentials: true
  })
}
export const DeleteManga = (mangaID: number)=>{
  return axios.delete(`/api/v1/mangas/${mangaID}/`, {
    withCredentials: true
  })
}
//export const loadMangasByQuery = (title: string)=>{
  //  return axios.get(`{}`)
//}