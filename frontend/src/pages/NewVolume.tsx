import { useState, useEffect } from "react";
import { GetAllMangas, CreateVolume } from "../api/mangas.api";
import type { TypeManga } from "../types";
import MangaSelection from "../components/MangaSelection";
import { Image, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function NewVolume() {
  const navigate = useNavigate()
  const [mangaSelected, setMangaSelected] = useState<TypeManga | null>(null);
  const [open, setOpen] = useState(false);
  const [mangas, setMangas] = useState<TypeManga[]>([]);
  const [number, setNumber] = useState(1);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [sending, setSeinding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sucess, setSuccess] = useState(false);
  useEffect(() => {
    const load = async () => {
      try {
        const data = await GetAllMangas();
        if (data.status === 200) setMangas(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);
  const handleSelect = (manga: TypeManga) => {
    setMangaSelected(manga);
    setOpen(!open);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSeinding(true);
    if (!mangaSelected || !cover || !number) {
      setError("Debes seleccionar un manga, subir una imagen, y un numero");
      setSeinding(false);
      return;
    }
    if (!file) {
      setError("Debes subir un archivo PDF del tomo o capitulo");
      setSeinding(false);
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.append("cover", cover);
    formData.append("number", number.toString());
    formData.append("file", file);
    try {
      const response = await CreateVolume(mangaSelected.id, formData);
      if (response.status === 200 || response.status === 201) {
        setError(null);
        setMangaSelected(null);
        setCover(null);
        setCoverPreview(null);
        setFile(null);
        setNumber(1);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate(`/mangas/${mangaSelected.id}`);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Error al subir el volumen o capitulo");
    } finally {
      setSeinding(false);
    }
  };
  const handleFilePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };
  return (
    <>
      <h1 className="text-center text-2xl mt-5">
        Compartir Nuevo Volumen o Capitulos
      </h1>
      <div className="flex justify-center items-center">
        <div className="p-3 bg-black/50 backdrop-blur-md mt-5  pb-15">
          {!mangaSelected && (
            <div
              onClick={() => setOpen(!open)}
              className="bg-black/40 p-3 hover:cursor-pointer hover:border border-white/30"
            >
              <p>Selecciona El Manga al que quieres aportar</p>
            </div>
          )}
          {mangaSelected && (
            <MangaSelection
              title={mangaSelected.title}
              categories={mangaSelected.categories}
              cover={mangaSelected.cover}
              onClick={() => setOpen(!open)}
            />
          )}
          {open && (
            <div className="max-h-64 overflow-scroll absolute bg-black/90 flex flex-col z-30">
              {mangas &&
                mangas.map((manga) => (
                  <MangaSelection
                    key={manga.id}
                    title={manga.title}
                    cover={manga.cover}
                    categories={manga.categories}
                    onClick={() => handleSelect(manga)}
                  />
                ))}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center mt-5 gap-3"
          >
            <label htmlFor="cover" className="text-white/70 font-bold">
              Cover del tomo o capitulo
            </label>
            <label
              htmlFor="cover"
              className="group relative w-35 h-35 p-3 border-dashed border-2 border-white/40 hover:cursor-pointer flex justify-center items-center"
            >
              {coverPreview && (
                <img
                  className="w-full h-full object-cover"
                  src={coverPreview}
                  alt="cover"
                />
              )}
              {!coverPreview && <Image className="w-4/5 h-4/5 text-white/40" />}
              <div className="hidden w-full h-full absolute top-0 left-0 font-bold bg-black/40 group-hover:flex items-center justify-center">
                Subir
              </div>
            </label>
            <input
              onChange={handleFileChange}
              className="hidden"
              type="file"
              id="cover"
              accept="image/*"
            />
            <label className="text-white/70 font-bold" htmlFor="number">
              Numero del volumen o capitulo
            </label>
            <input
              value={number}
              onChange={(e) => setNumber(parseInt(e.target.value))}
              className="outline-0"
              type="number"
              id="number"
              placeholder="Numero: "
            />
            <label
              htmlFor="file"
              className="hover:bg-black/20 border-2 border-dashed border-white/40 flex font-bold items-center hover:cursor-pointer bg-black/30 p-2 text-white/70"
            >
              <Book className="w-10 h-10" />
              <p className="text-sm">{file ? file.name : "Subir PDF del tomo o capitulo"}</p>
            </label>
            <input onChange={handleFilePdfChange} className="hidden" type="file" accept="application/pdf" id="file" />
            {error && <p className="border-b p-1 bg-black/30">{error}</p>}
            {sucess && (
              <p className="p-2 bg-green-500/30 text-white">
                Volumen o capitulo subido correctamente
              </p>
            )}
            <input
              className="w-30 font-bold p-2 text-black bg-white hover:bg-black/30 hover:text-white transition hover:cursor-pointer"
              type="submit"
              value={sending ? "Subiendo..." : "Subir"}
            />
          </form>
        </div>
      </div>
    </>
  );
}
