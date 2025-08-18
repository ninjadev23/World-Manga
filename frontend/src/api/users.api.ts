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