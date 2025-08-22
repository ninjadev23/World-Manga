import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SignupEndPoint } from "../api/users.api";
import { useState } from "react";
import type { BackendErrors } from "../types";
import { isAxiosError } from "axios";
import { useUser } from "../context/UserContext";
export default function Signup() {
  
  const BASE = import.meta.env.BASE_URL;
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<BackendErrors>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const formData = new FormData(); 

      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await SignupEndPoint(formData);
      if (response.status === 201) {
        await refreshUser();
        navigate("/");
      }
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;

        if (status === 400 && typeof data === "object") {
          setError(data as Record<string, string[]>);
          return;
        }

        console.error("Error de backend", status, data);
      } else {
        console.error("Error inesperado:", err);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto mt-10 w-65 bg-black/40 backdrop-blur-md p-5 flex flex-col"
    >
      <label className="text-center text-white/80 font-bold pb-3 text-[1.2rem]">Avatar</label>
      <div className="flex justify-center mb-6">
        <label className="relative group w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 cursor-pointer rounded-full overflow-hidden shadow-md">
          <img
            src={avatarPreview ? avatarPreview : (BASE+"default-avatar.webp")}
            alt="Foto de perfil"
            className="w-full h-full object-cover rounded-full transition duration-300"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
            <span className="text-white text-sm sm:text-base font-medium text-center px-2">Foto de perfil</span>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </label>
      </div>

      <label htmlFor="username">Nombre de usuario</label>
      <div className="flex items-center py-3">
        <User className="text-white/50 mr-2" size={23} />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          type="text"
          placeholder="Nombre de usuario"
          className="outline-none w-full"
        />
      </div>
      <label htmlFor="email">Email</label>
      <div className="flex rounded-lg py-3 w-full">
        <Mail className="text-white/40 mr-2" size={24} />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          type="email"
          placeholder="Tu Email"
          className="outline-none w-full"
        />
      </div>
      <label htmlFor="password">Contraseña</label>
      <div className="flex items-center rounded-lg py-3 w-full ">
        <Lock className="text-white/50 mr-2" size={23} />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          type="password"
          placeholder="Tu contraseña"
          className="outline-none w-full"
        />
      </div>

      <input
        type="submit"
        value={sending ? "Registrando..." : "Registrar"}
        className="border border-white/20 rounded-lg hover:bg-black/40 hover:text-white py-2 mt-1 hover:cursor-pointer bg-white text-black"
      />

      {error && (
        <ul className="list-disc p-3 text-red-500">
          {Object.entries(error).map(([field, messages]) =>
            messages.map((msg, i) => (
              <li key={`${field}-${i}`} className="capitalize">
                <span className="font-bold">{field}</span>: {msg}
              </li>
            ))
          )}
        </ul>
      )}

      <p className="mt-3 text-center">
        Ya tienes cuenta?
        <Link className="ml-1 inline font-bold" to="/login">
          Login
        </Link>
      </p>
    </form>
  );
}
