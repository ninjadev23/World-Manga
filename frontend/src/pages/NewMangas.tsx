import { Image, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { categories } from "../types";
import { CreateManga } from "../api/mangas.api";
import { GetProfile } from "../api/users.api";
import type { BackendErrors, User } from "../types";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import ProfileMiniCard from "../components/ProfileMiniCard";
export default function NewMangas() {
  const navigate = useNavigate()
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<BackendErrors>(null);
  const [profile, setProfile] = useState<User | null>(null)
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setCover(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true)
    setError(null)
    try{
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("language", "español")
      formData.append("categories", JSON.stringify(selectedCategories))
      if(cover){
        formData.append("cover", cover)
      }
      const response = await CreateManga(formData)
      if(response.status === 201){
        navigate("/")
      }
    }catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;
        if(status === 401) return navigate("/signup")
        if (status === 400 && typeof data === "object") {
          setError(data as BackendErrors);
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

  useEffect(()=>{
    const loadProfile = async ()=>{
      try{
        const data = await GetProfile()
        if(data.status === 200) return setProfile(data.data)
      }catch(err){
        if(isAxiosError(err)) {
          if(err.status === 401) return navigate("/signup")
          else setError(err.response?.data as BackendErrors)
        }else console.error(err)
      }
    }
    loadProfile()
  },[])

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl text-center mt-5 text-white">
        Compartir Nuevo Manga
      </h1>

      <div className="mt-10 flex flex-col items-center gap-3 bg-black/50 backdrop-blur-md w-65 pb-10 mx-auto rounded-lg relative">
        {coverPreview && (
          <label
            htmlFor="cover"
            className="w-full h-48 group relative hover:cursor-pointer"
          >
            <img
              src={coverPreview}
              className="w-full h-full object-cover"
              alt=""
            />
            <div className="transition-all duration-500 hidden group-hover:flex items-center justify-center absolute w-full h-full top-0 bg-black/40">
              <p className="text-2xl">Subir Portada</p>
            </div>
          </label>
        )}
        {!coverPreview && (
          <>
            <label htmlFor="cover" className="font-bold text-white/50 pt-5">
              Portada:
            </label>
            <label
              htmlFor="cover"
              className="group relative transition-all duration-500 hover:bg-black/60 hover:cursor-pointer w-28 h-28 p-5 border-white/40 border-dashed border-2"
            >
              <Image className="w-full h-full text-white/40" />
              <p className="w-full absolute top-9 left-1 hidden group-hover:block font-bold text-white">
                Subir Portada
              </p>
            </label>
          </>
        )}
        <input
          accept="image/*"
          onChange={handleFileChange}
          type="file"
          id="cover"
          className="hidden"
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Título"
          className="outline-0 p-2 border-b border-white/30 bg-transparent text-white w-52"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción..."
          className="border-b border-white/30 resize-none outline-0 h-20 mt-3 bg-transparent text-white w-52"
        />
        <label className="font-bold text-white mt-2">Categorías:</label>
        <div className="relative w-full flex justify-center">
          <button
            type="button"
            onClick={() => setShowCategories((prev) => !prev)}
            className="p-2 bg-black/30 hover:cursor-pointer rounded"
          >
            <Plus className="text-white" />
          </button>
          {showCategories && (
            <div className="absolute -top-10 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg p-3 shadow-xl w-56 z-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm font-semibold">
                  Selecciona Categorías
                </span>
                <button
                  type="button"
                  onClick={() => setShowCategories(false)}
                  className="text-white hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category, index) => {
                  const selected = selectedCategories.includes(category);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`hover:cursor-pointer px-2 py-1 rounded text-xs font-medium border transition-all
                        ${
                          selected
                            ? "bg-white text-black border-white"
                            : "bg-black/30 text-white border-white/30"
                        }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-3 px-4">
            {selectedCategories.map((cat, idx) => (
              <span
                key={idx}
                className="bg-white/10 text-white text-sm px-2 py-1 rounded border border-white/20"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
        
      {error && (
        <ul className="p-3">
          {Object.entries(error).map(([field, messages]) =>
            messages.map((msg, i) => (
              <li key={`${field}-${i}`} className="capitalize">
                <span className="font-bold">{field}</span>: {msg}
              </li>
            ))
          )}
        </ul>
      )}
      {profile && profile.avatar instanceof File &&

        <ProfileMiniCard text="Usuario: " username={profile.username} authorAvatar={URL.createObjectURL(profile.avatar)}/>
      }
      {profile && !(profile.avatar instanceof File) &&
        <ProfileMiniCard text="Usuario: " username={profile.username} authorAvatar={typeof profile.avatar === "string" ? profile.avatar : ""}/>
      }
        <input
          type="submit"
          className="hover:cursor-pointer mt-4 px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30"
          value={sending ? "Subiendo..." : "Compartir Manga"}
        />
      </div>
    </form>
  );
}
