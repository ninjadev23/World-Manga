import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
type Props = {
  id: number;
  title: string;
  description: string;
  categories: string[];
  username: string;
  cover: string;
};
const Manga: React.FC<Props> = ({
  id,
  title,
  description,
  categories,
  cover,
  username,
}) => {
  const [started, setStarted] = useState<boolean>(false)
  const handleStar = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if(favorites.includes(id)) {
        favorites = favorites.filter((n: number)=>n!==id)
        setStarted(false)
    }
    else {
        favorites.push(id);
        setStarted(true)
    } 
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };
  useEffect(()=>{
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    if(!favorites && !Array.isArray(favorites)) return 
    if(favorites.includes(id)) setStarted(true)
  },[started])
  return (
    <div className="text-white shadow-sm bg-black/40 backdrop-blur-md rounded-md flex gap-1 items-center flex-col w-60 h-[430px] border border-white/30">
      <img className="object-cover w-full h-40" src={cover} alt="Cover" />
      <div className="capitalize px-5 flex flex-col items-center">
        <h2 className="m-0 text-center w-11/12 font-bold text-2xl border-b pb-1">
          {title}
        </h2>
        <p className="capitalize overflow-scroll h-28 block">{description}</p>
        <div className="mt-1 flex gap-1">
          {categories.map((category, index) => (
            <p
              className="capitalize bg-black/40 p-1 border border-white/30 rounded-sm"
              key={index}
            >
              {category}
            </p>
          ))}
        </div>

        <p className="p-1">
          Por: <span className="font-bold">{username}</span>
        </p>
        <div className="flex w-full justify-center gap-3 flex-wrap">
          <button
            onClick={handleStar}
            className="bg-transparent m-0 flex-wrap hover:cursor-pointer hover:scale-125 h-8 w-8"
          >
            <Star className={`${started ? "text-yellow-400/40 fill-yellow-400/40" : "text-white/60"} w-full h-full`} />
          </button>
          <Link
            to={`/mangas/${id}`}
            className="hover:scale-110 hover:cursor-pointer p-2 rounded-lg bg-black/40"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Manga;
