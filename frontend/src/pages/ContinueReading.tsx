import { useEffect, useState } from "react";
import type { VolueCardType } from "../types";
import { Link } from "react-router-dom";
import VolumeCard from "../components/VolumeCard";
export default function ContinueReading() {
  const [ReadingListState, setReadingListState] = useState<VolueCardType[]>([]);
  useEffect(() => {
    const ReadingList = JSON.parse(
      localStorage.getItem("ReadingList") || "[]"
    ) as VolueCardType[];
    setReadingListState(ReadingList)
}, []);
  return (
    <div>
      <h1 className="text-center text-2xl my-10"><span className="border-b border-white/40 py-2">Continua Leyendo</span></h1>
      {
        ReadingListState.length<1 &&
        <p className="text-center capitalize">No haz visto explorado nada aun <Link className="p-2 bg-black/50" to="/">Mangas</Link></p>
      }
      <div className="flex flex-wrap justify-center items-center gap-5">

      {
        ReadingListState.map(volume=>(
            <VolumeCard
                key={volume.id}
                cover={volume.cover}
                MangaTitle={volume.MangaTitle}
                file={volume.file}
                number={volume.number}
                id={volume.id}
            />
        ))
      }

      </div>
    </div>
  );
}
