import { useEffect, useState } from "react";
import { GetAllMangas } from "../api/mangas.api";
import type { TypeManga } from "../types";
import { isManga } from "../utils";
import Manga from "../components/Manga";
import { useSearch } from "../context/SearchContext";
import { Link } from "react-router-dom";

export default function Home() {
  const [mangas, setMangas] = useState<TypeManga[]>([]);
  const [loading, setLoading] = useState(false)
  const { query } = useSearch();

  useEffect(() => {
    setLoading(true)
    const load = async () => {
      const data = await GetAllMangas();
      if (Array.isArray(data.data)) setMangas(data.data);
      setLoading(false)
    };
    load();
  }, []);

  const filtered = mangas.filter((manga) =>
    manga.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="mt-15">
      <h1 className="mb-10 text-center text-2xl font-bold">Mangas</h1>
      <div className="flex gap-7 flex-wrap justify-center items-center">
        {filtered.map(
          (manga) =>
            isManga(manga) && (
              <Manga
                key={manga.id}
                id={manga.id}
                title={manga.title}
                cover={manga.cover}
                categories={manga.categories}
                description={manga.description}
                username={manga.username}
                authorAvatar={manga.authorAvatar}
              />
            )
        )}
        {
          loading && <h1 className="text-center text-2xl">Cargando...</h1>
        }
        {!loading && mangas.length<1 && 
          <p className="text-center">
              Aun No Hay Mangas Disponibles, ¿Quieres ser el primero en compartir <Link to="/publicar" className="p-2 bg-black/50">Compartir</Link>   
          </p>
        }
      </div>
    </main>
  );
}
