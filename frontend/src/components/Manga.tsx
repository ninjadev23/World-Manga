import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, Trash } from "lucide-react";
import type { TypeManga } from "../types";
import ProfileMiniCard from "./ProfileMiniCard";
interface Props extends Omit<TypeManga, "volumes" | "language">{
  isOwner?: boolean;
  handleDelete?: (id: number) => void;
}
const Manga: React.FC<Props> = ({
  id,
  title,
  description,
  categories,
  cover,
  username,
  authorAvatar,
  isOwner = false,
  handleDelete = () => {},
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
    <div className="relative text-white shadow-sm bg-black/40 backdrop-blur-md rounded-md flex gap-1 items-center flex-col w-55 border border-white/30 pb-5">
      {isOwner && 
      <button onClick={()=>handleDelete(id)} className="absolute p-1 bg-black/60 hover:cursor-pointer hover:bg-black/70 right-0">
        <Trash/>
      </button>
      }
      <img className="object-cover w-full h-40" src={cover} alt="Cover" />
      <div className="capitalize px-2 flex flex-col items-center">
        <h2 className="m-0 text-center  font-bold text-[1.2rem] border-b pb-1">
          {title}
        </h2>
        <p className="capitalize h-28 overflow-y-scroll scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">{description}</p>
        <div className="w-full justify-center items-center mt-2 h-14 overflow-hidden flex gap-1 flex-wrap">
          {categories.map((category, index) => (
            <p
              className="capitalize bg-black/40 p-1 border border-white/30 rounded-sm h-8"
              key={index}
            >
              {category}
            </p>
          ))}
        </div>
          <ProfileMiniCard text="Por:" username={username} authorAvatar={authorAvatar}/>
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
