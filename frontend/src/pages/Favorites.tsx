import type { TypeManga } from "../types";
import { GetAllMangas } from "../api/mangas.api";
import { useEffect, useState } from "react";
import { isManga } from "../utils";
import Manga from "../components/Manga";
import BackButton from "../components/BackButton";
export default function Favorites() {
  const [favorites, setFavorites] = useState<TypeManga[]>([]);
  useEffect(() => {
    const favoritesLocalStorage = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    if (favoritesLocalStorage.length === 0) return;
    const loadData = async () => {
      const data = await GetAllMangas();
      if (!data) return;
      if (Array.isArray(data.data)) {
        setFavorites(
          data.data.filter((manga: unknown) => {
            if (isManga(manga) && favoritesLocalStorage.includes(manga.id))
              return true;
          })
        );
      }
    };
    loadData();
  }, [favorites]);
  if (favorites.length === 0)
    return (
      <div className="p-10 text-white text-center w-full bg-black/40 backdrop-blur-md">
        <p className="font-bold text-2xl">Aun no tienes favorites</p>
        <div className="flex justify-center gap-2">
          <BackButton className="" />
          <p className="mt-2 font-bold">Volver</p>
        </div>
      </div>
    );
  return (
    <>
      <h1 className="mx-auto mt-10 w-fit text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 border border-white/20 px-6 py-2 rounded-md glowing-border">
        Tus Favoritos
      </h1>
      <div className="mt-5 flex gap-5 flex-wrap w-full justify-center">
        {favorites.map((manga) => (
          <Manga
            title={manga.title}
            description={manga.description}
            id={manga.id}
            categories={manga.categories}
            username={manga.username}
            cover={manga.cover}
          />
        ))}
      </div>
    </>
  );
}
