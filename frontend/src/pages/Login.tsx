import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Login as LoginUser } from "../api/users.api";
import type { LoginUserType } from "../types";
import type { AxiosError } from "axios";
import { useUser } from "../context/UserContext";

export default function Login() {
  const {refreshUser} = useUser()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    try {
      const userData: LoginUserType = { email, password };
      await LoginUser(userData);
      setEmail("");
      setPassword("");
      await refreshUser()
      navigate("/"); // redirección
    } catch (error) {
      const err = error as AxiosError<any>;
      const errorMessages: string[] = [];

      if (err.response?.data) {
        const data = err.response.data;

        if (typeof data === "object" && data !== null) {
          for (const key in data) {
            const value = data[key];
            if (Array.isArray(value)) {
              errorMessages.push(...value);
            } else {
              errorMessages.push(String(value));
            }
          }
        } else {
          errorMessages.push(String(data));
        }
      } else {
        errorMessages.push("Error al conectar con el servidor.");
      }

      setErrors(errorMessages);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto mt-20 w-60 bg-black/40 backdrop-blur-md p-5 flex flex-col text-white"
    >
      <label htmlFor="email">Email</label>
      <div className="flex rounded-lg py-3 w-full">
        <Mail className="text-white/40 mr-2" size={24} />
        <input
          id="email"
          type="email"
          placeholder="Tu Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="outline-none w-full bg-transparent text-white"
        />
      </div>

      <label htmlFor="password">Contraseña</label>
      <div className="flex items-center rounded-lg py-3 w-full">
        <Lock className="text-white/50 mr-2" size={23} />
        <input
          id="password"
          type="password"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="outline-none w-full bg-transparent text-white"
        />
      </div>

      <input
        type="submit"
        value="Ingresar"
        className="border border-white/20 rounded-lg hover:bg-black/40 hover:text-white py-2 mt-1 hover:cursor-pointer bg-white text-black"
      />

      {errors.length > 0 && (
        <ul className="text-red-400 text-sm mt-2 list-disc list-inside">
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-center text-white">
        No tienes cuenta?
        <Link className="ml-1 inline font-bold" to="/signup">
          Signup
        </Link>
      </p>
    </form>
  );
}
