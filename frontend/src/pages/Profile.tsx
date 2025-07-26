import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { isAxiosError } from "axios";
import { LogoutEndPoint, UpdateUser } from "../api/users.api";
import { GetMangasOfUser, DeleteManga } from "../api/mangas.api";
import type { UserUpdateType, TypeManga, BackendErrors } from "../types";
import Manga from "../components/Manga";
import { useUser } from "../context/UserContext";
export default function Profile() {
  const { refreshUser, setUser } = useUser();
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserUpdateType | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | File>("");
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false);
  const [mangas, setMangas] = useState<TypeManga[]>([]);
  const [error, setError] = useState<BackendErrors>(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await axios.get("/api/v1/profile", { withCredentials: true });
      if(res.status === 401) {
        setLoading(false)
        return setError({
        notAuthorized: ["No tenes cuenta boludo anda a login o signup"]
      })
    }
      setLoading(false)
      setProfile(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setAvatar(res.data.avatar);

      const dataMangas = await GetMangasOfUser();
      if (dataMangas.status === 200) setMangas(dataMangas.data);
    };
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    }

    try {
      const res = await UpdateUser(formData);
      setProfile(res.data);
      setEditing(false);
      await refreshUser();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data) {
        setError(err.response.data);
      } else {
        console.error(err);
      }
    }
  };

   const handleLogout = async () => {
    try {
      await LogoutEndPoint();
      setUser(null);
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (id: number)=>{
    const response = await DeleteManga(id);
    if(response.status === 204){
      setMangas(mangas.filter((manga) => manga.id !== id));
    };
  }
  if(loading) return <p className="text-center text-2xl mt-10">Cargando...</p>
  if(error && "notAuthorized" in error) return <p className="mt-10 text-center text-2xl">{error.notAuthorized[0]}</p>
  return (
    <main className="min-h-screen flex flex-col items-center text-white p-4">
      <div className="w-full md:w-11/12 lg:w-9/12 flex flex-col gap-6 bg-black/30 backdrop-blur-md p-6 rounded-lg mt-8">
        {/* Perfil */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex justify-center items-start md:items-center">
            {!editing ? (
              <img
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
                src={typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)}
                alt="Avatar"
              />
            ) : (
              <div className="flex flex-col items-center">
                <label className="text-center text-white/80 font-bold pb-3 text-[1.2rem]">Avatar</label>
                <label className="relative group w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 cursor-pointer rounded-full overflow-hidden shadow-md">
                  <img
                    src={typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)}
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
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center flex flex-col justify-center">
            {!editing ? (
              <>
                <p>Nombre de usuario:</p>
                <h2 className="capitalize text-2xl font-bold mb-3">{profile?.username}</h2>
                <p>Correo Electrónico:</p>
                <h2 className="font-bold mb-3">{profile?.email}</h2>

                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 rounded bg-white/20 text-white hover:bg-white/30 hover:cursor-pointer transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleLogout}
                    className="border border-white/30 p-2 rounded-lg text-white hover:bg-red-700/60 hover:border-white/0 hover:cursor-pointer transition"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-3 w-full max-w-md mx-auto"
              >
                <input
                  type="text"
                  placeholder="Nuevo nombre"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-3 py-2 rounded bg-white/10 text-white w-full focus:outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Nuevo correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-2 rounded bg-white/10 text-white w-full focus:outline-none"
                  required
                />

                {/* Errores */}
                {error && (
                  <ul className="text-left text-sm list-disc px-4 w-full">
                    {Object.entries(error).map(([field, messages]) =>
                      messages.map((msg, i) => (
                        <li key={`${field}-${i}`} className="capitalize">
                          <span className="font-bold">{field}</span>: {msg}
                        </li>
                      ))
                    )}
                  </ul>
                )}

                <div className="flex gap-4 mt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-white text-black hover:bg-black/40 hover:text-white hover:cursor-pointer transition"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 rounded bg-black/40 hover:bg-red-800 hover:cursor-pointer transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center mt-6 px-2">
          <div>
            <h2 className="text-center text-xl font-semibold">Mangas que has compartido:</h2>
            {!mangas.length && <p className="text-white/50">Aún no has compartido ningún manga</p>}
          </div>
          {mangas.length > 0 && (
            <div className="flex w-full justify-center flex-wrap gap-4 mt-4">
              {mangas.map((manga) => (
                <Manga
                  key={manga.id}
                  title={manga.title}
                  description={manga.description}
                  categories={manga.categories}
                  username={manga.username}
                  cover={manga.cover}
                  id={manga.id}
                  authorAvatar={manga.authorAvatar}
                  isOwner={true}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
