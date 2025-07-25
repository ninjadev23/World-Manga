import { Image, Plus, X } from "lucide-react";
import { useState } from "react";
import { categories } from "../types";

export default function NewMangas() {
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Categorías seleccionadas:", selectedCategories);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl text-center mt-5 text-white">Compartir Nuevo Manga</h1>

      <div className="mt-10 flex flex-col items-center gap-3 bg-black/50 backdrop-blur-md w-60 pb-10 mx-auto rounded-lg relative">

        {/* Portada */}
        <label htmlFor="cover" className="font-bold text-white/50 pt-5">Portada: </label>
        <label
          htmlFor="cover"
          className="group relative transition-all duration-500 hover:bg-black/60 hover:cursor-pointer w-28 h-28 p-5 border-white/40 border-dashed border-2"
        >
          <Image className="w-full h-full text-white/40" />
          <p className="absolute top-10 left-3 hidden group-hover:block font-bold text-white">
            Subir Cover
          </p>
        </label>
        <input type="file" id="cover" className="hidden" />
        <input
          type="text"
          placeholder="Título"
          className="outline-0 p-2 border-b border-white/30 bg-transparent text-white w-52"
        />
        <textarea
          placeholder="Descripción..."
          className="border-b border-white/30 resize-none outline-0 h-20 mt-3 bg-transparent text-white w-52"
        />
        <label className="font-bold text-white mt-2">Categorías:</label>
        <div className="relative w-full flex justify-center">
          <button
            type="button"
            onClick={() => setShowCategories((prev) => !prev)}
            className="p-2 bg-black/30 hover:cursor-pointer rounded"
          >
            <Plus className="text-white" />
          </button>
        {showCategories && (
            <div className="absolute -top-10 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg p-3 shadow-xl w-56 z-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm font-semibold">Selecciona Categorías</span>
                <button
                  type="button"
                  onClick={() => setShowCategories(false)}
                  className="text-white hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category, index) => {
                  const selected = selectedCategories.includes(category);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`hover:cursor-pointer px-2 py-1 rounded text-xs font-medium border transition-all
                        ${
                          selected
                            ? "bg-white text-black border-white"
                            : "bg-black/30 text-white border-white/30"
                        }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-3 px-4">
            {selectedCategories.map((cat, idx) => (
              <span
                key={idx}
                className="bg-white/10 text-white text-sm px-2 py-1 rounded border border-white/20"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="hover:cursor-pointer mt-4 px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30"
        >
          Publicar Manga
        </button>
      </div>
    </form>
  );
}
