import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetMangaDetails, DeleteVolume } from "../api/mangas.api";
import type { TypeManga } from "../types";
import { Download, ArrowRight, Trash } from "lucide-react";
import { isManga } from "../utils";
import BackButton from "../components/BackButton";
import { GetProfile } from "../api/users.api";
export default function MangaDetails() {
  const [mangaDetail, setMangaDetail] = useState<TypeManga | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    if (!id || isNaN(Number(id))) navigate("/404");
    const loadDetail = async () => {
      const data = await GetMangaDetails(Number(id));
      if (isManga(data.data)) setMangaDetail(data.data);
      const profileData = await GetProfile();
      if (!profileData.data) return;
      if (profileData.data.id == data.data.user) setIsOwner(true);
    };
    loadDetail();
  }, []);
  const handleDeleteVolume = async (volumeID: number) => {
    const response = await DeleteVolume(volumeID);
    if (response.status === 204) {
      const details = mangaDetail as TypeManga
      setMangaDetail({
        ...details,
        volumes: details.volumes.filter((v) => v.id !== volumeID),
      });
    }
  };
  if (!mangaDetail)
    return (
      <div className="text-white text-center text-2xl font-bold mt-10">
        Cargando...
      </div>
    );
  return (
    <div className="text-white">
      <div className="text-center p-3 bg-black/40 backdrop-blur-md">
        <BackButton className="flex" />
        <h1 className="font-bold text-2xl capitalize">{mangaDetail?.title}</h1>
        <p className="mt-5">{mangaDetail?.description}</p>
        <div className="mt-1 flex gap-1 justify-center">
          {mangaDetail?.categories.map((category, index) => (
            <p
              className="capitalize bg-black/40 p-1 border border-white/30 rounded-sm"
              key={index}
            >
              {category}
            </p>
          ))}
        </div>
        <p className="p-2">
          Por: <span className="font-bold">{mangaDetail?.username}</span>
        </p>
      </div>
      <h2 className="text-2xl font-bold text-center p-3">Volumenes</h2>
      <div className="flex flex-wrap gap-3 justify-center pb-10">
        {mangaDetail?.volumes.length === 0 && (
          <div className="flex flex-col">
            <p>Este Manga Aun Tiene Volumenes.</p>
            <div className="flex flex-col items-center">
              <p>Quieres ser el primero en compartir?</p>
              <Link
                className="bg-black/40 p-2 m-2 flex gap-2 w-25"
                to="/publicar"
              >
                Publicar
                <ArrowRight />
              </Link>
            </div>
          </div>
        )}
        {mangaDetail?.volumes.map((volume) => (
          <div
            className="relative shadow-sm bg-black/40 backdrop-blur-md rounded-md"
            key={volume.id}
          >
            {isOwner && (
              <button
                onClick={() => handleDeleteVolume(volume.id)}
                className="absolute right-0 bg-black/30 p-1 hover:bg-black/60 hover:cursor-pointer"
              >
                <Trash />
              </button>
            )}
            <img
              className="w-40 h-50 object-cover"
              src={`http://localhost:8000/${volume.cover}`}
              alt=""
            />
            <h2 className="font-bold text-2xl text-center">
              Tomo {volume.number}
            </h2>
            <div className="mb-2 flex justify-center gap-2">
              <a
                href={volume.file}
                download={`${mangaDetail.title}-volume-${volume.number}.pdf`}
                className="hover:scale-110 p-2 rounded-lg bg-black/30 inline-block"
              >
                <Download className="w-5 h-5" />
              </a>
              <Link
                to={`/mangas/read/${mangaDetail.title}/${
                  volume.number
                }/${encodeURIComponent(volume.file)}`}
                className="hover:scale-110 hover:cursor-pointer p-2 rounded-lg bg-black/30"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
