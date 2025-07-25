import axios from "axios";
import type { LoginUserType } from "../types";
export const SignupEndPoint = (data: FormData) => {
  return axios.post("/api/v1/signup", data, {
    headers: {
      "Content-Type": "multipart/form-data", // Esto es clave para enviar archivos
    },
    withCredentials: true,
  });
};

export const GetProfile = ()=>{
  return axios.get("/api/v1/profile")
}
export const UpdateUser = async (formData: FormData) => {
  return axios.put("/api/v1/update_user", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};
export const LogoutEndPoint = ()=>{
  return axios.post("/api/v1/logout", null, { withCredentials: true });
}
export const Login = (data: LoginUserType)=>{
  return axios.post("/api/v1/login",data, {
    withCredentials: true
  })
}
/*
  respuesta correcta:
{
  "id": 3,
  "password": "123123",
  "last_login": null,
  "is_superuser": false,
  "first_name": "",
  "last_name": "",
  "is_staff": false,
  "is_active": false,
  "date_joined": "2025-07-19T01:02:11.197491Z",
  "username": "test123",
  "email": "test@gmail.com",
  "avatarUrl": "default-avatar.jpg",
  "favorites": [],
  "groups": [],
  "user_permissions": []
}
*/