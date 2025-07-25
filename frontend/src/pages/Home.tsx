import { useEffect, useState } from "react";
import { GetAllMangas } from "../api/mangas.api";
import type { TypeManga } from "../types";
import { isManga } from "../utils";
import Manga from "../components/Manga";
import { useSearch } from "../context/SearchContext";

export default function Home() {
  const [mangas, setMangas] = useState<TypeManga[]>([]);
  const { query } = useSearch();

  useEffect(() => {
    const load = async () => {
      const data = await GetAllMangas();
      if (Array.isArray(data.data)) setMangas(data.data);
      console.log(data.data[0])
    };
    load();
  }, []);

  const filtered = mangas.filter((manga) =>
    manga.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="mt-15">
      <h1 className="mb-10 text-center text-2xl font-bold">Mangas</h1>
      <div className="flex gap-4 flex-wrap justify-center items-center">
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
      </div>
    </main>
  );
}
