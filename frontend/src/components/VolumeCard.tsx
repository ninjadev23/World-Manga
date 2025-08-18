import type { VolueCardType } from "../types";
import { Trash, Download, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VolumeCard: React.FC<VolueCardType> = ({
  id,
  cover,
  file,
  number,
  MangaTitle,
  isOwner,
  handleDelete,
  continueReading,
}) => {
  const navigate = useNavigate();
  //ruta:mangas/read/:title/:volume/:file
  const handleRead = () => {
    const url = `/mangas/read/${MangaTitle}/${number}/${encodeURIComponent(
      file
    )}`;
    const ReadingList = JSON.parse(
      localStorage.getItem("ReadingList") || "[]"
    ) as VolueCardType[];
    if (ReadingList.some((item) => item.id === Number(id)))
      //si ya existe no manipula el localstorage
      return navigate(url);

    ReadingList.push({
      id,
      cover,
      number,
      file,
      MangaTitle,
    });
    localStorage.setItem("ReadingList", JSON.stringify(ReadingList));
    return navigate(url);
  };
  return (
    <div
      className="relative shadow-sm bg-black/40 backdrop-blur-md rounded-md"
      key={id}
    >
      {isOwner && (
        <button
          onClick={() => handleDelete && handleDelete(id)}
          className="absolute right-0 bg-black/30 p-1 hover:bg-black/60 hover:cursor-pointer"
        >
          <Trash />
        </button>
      )}
      <img className="w-40 h-50 object-cover" src={cover} alt="cover" />
      {continueReading && (
        <h2 className="text-sm text-center">Continua con {MangaTitle}:</h2>
      )}
      <h2 className="font-bold text-2xl text-center">Tomo {number}</h2>
      <div className="mb-2 flex justify-center gap-2">
        <a
          href={file}
          download={`${MangaTitle}-volume-${number}.pdf`}
          className="hover:scale-110 p-2 rounded-lg bg-black/30 inline-block"
        >
          <Download className="w-5 h-5" />
        </a>
        <button
          onClick={handleRead}
          className="hover:scale-110 hover:cursor-pointer p-2 rounded-lg bg-black/30"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
export default VolumeCard;
