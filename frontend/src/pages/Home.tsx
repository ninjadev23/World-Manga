import Manga from "../components/Manga";
import { GetAllMangas } from "../api/mangas.api";
import { useEffect, useState } from "react";
import type { TypeManga } from "../types";
import { isManga } from "../utils";
export default function Home() {
  const [mangas, setMangas] = useState<TypeManga[]>([]);
  useEffect(() => {
    const load = async () => {
      const data = await GetAllMangas();
      if (Array.isArray(data.data)) setMangas(data.data);
    };
    load();
  }, []);
  return (
    <main className="mt-15">
      <h1 className="mb-10 text-center text-2xl font-bold">Mangas</h1>
      <div className="flex gap-4 flex-wrap justify-center items-center">
        {mangas.map(
          manga =>
            isManga(manga) && (
                <Manga
                  key={manga.id}
                  id={manga.id}
                  title={manga.title}
                  cover={manga.cover}
                  categories={manga.categories}
                  description={manga.description}
                  username={manga.username}
                />
            )
        )}
      </div>
    </main>
  );
}
