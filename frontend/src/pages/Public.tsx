import { Link } from "react-router-dom";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function Share() {
  const BASE = import.meta.env.BASE_URL;
  const [imageOne, setImageOne] = useState(1);
  const [imageTwo, setImageTwo] = useState(6);
  const [animatingOne, setAnimatingOne] = useState(false);
  const [animatingTwo, setAnimatingTwo] = useState(false);

  const randomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatingOne(true);
      setTimeout(() => {
        setImageOne(randomNumber(1, 7));
        setAnimatingOne(false);
      }, 700); // duración de la animación de salida
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatingTwo(true);
      setTimeout(() => {
        setImageTwo(randomNumber(1, 8));
        setAnimatingTwo(false);
      }, 700);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="capitalize text-center text-2xl mt-10">
        Comparte tu manga favorito
      </h1>
      <div className="flex justify-center gap-15 items-center mt-10 flex-wrap">
        <div className="flex flex-col justify-center items-center gap-2 bg-black/50 backdrop-blur-md p-5 rounded-lg">
          <img
            className={clsx(
              "w-60 h-60 object-cover transition-all duration-500",
              animatingOne
                ? "opacity-0 translate-x-10"
                : "opacity-100 translate-x-0"
            )}
            src={`${BASE}wallpaper${imageOne}.webp`}
            alt=""
          />
          <Link
            className="flex gap-1 rounded bg-white/20 text-white hover:bg-white/30 hover:cursor-pointer transition p-2"
            to="/publicar/manga/"
          >
            <Upload className="w-5 h-5" />
            Compartir Nuevo Manga
          </Link>
        </div>
        {/* Imagen Uno */}
        <div className="flex flex-col justify-center items-center gap-2 bg-black/50 backdrop-blur-md p-5 rounded-lg">
          <img
            className={clsx(
              "w-60 h-60 object-cover transition-all duration-500",
              animatingTwo
                ? "opacity-0 -translate-x-10"
                : "opacity-100 translate-x-0"
            )}
            src={`${BASE}ImageTomos/cover${imageTwo}.webp`}
            alt=""
          />
          <Link
            className="flex gap-1 rounded bg-white/20 text-white hover:bg-white/30 hover:cursor-pointer transition p-2"
            to="/publicar/volumes"
          >
            <Upload className="w-5 h-5" />
            Compartir Tomos o Capitulos
          </Link>
        </div>
      </div>
    </div>
  );
}
