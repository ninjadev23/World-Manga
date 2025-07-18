import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Search, Github } from "lucide-react";
export default function Layout() {
  const [backgroundNumber, setBackgroundNumber] = useState(11);
  const [show, setShow] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const randomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false); // empieza fade-out
      setTimeout(() => {
        let number = randomNumber(1, 12);
        if (number === backgroundNumber) number = randomNumber(1, 11);
        setBackgroundNumber(number);
        setShow(true); // empieza fade-in
      }, 300); // cambio de imagen
    }, 5000); // tiempo entre cambios
    return () => clearInterval(interval);
  }, [backgroundNumber]);

  return (
    <div className="flex flex-col min-h-screen relative w-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
      <div
        key={backgroundNumber}
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(to top left, rgba(0,0,0,0.4), rgba(17,24,39,0.3)), url(/backgrounds/background${backgroundNumber}.jpg)`,
          opacity: show ? 1 : 0,
        }}
      />
      <div className="relative z-20 flex flex-col flex-1">
        <nav className="fixed top-0 left-0 w-full z-30 bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo o nombre del sitio si lo deseas */}
              <NavLink to="/">
                <h1 className="text-[1.2rem] text-white border p-2 font-bold border-white/20 rounded-lg">
                  World Manga
                </h1>
              </NavLink>
              <div className="flex items-center space-x-8">
                <NavLink
                  to="/favorites"
                  className="hover:border-b text-white hover:text-gray-300 font-medium hidden md:inline"
                >
                  Favoritos
                </NavLink>
                <a
                  href="#"
                  className="hover:border-b text-white hover:text-gray-300 font-medium hidden md:inline"
                >
                  Continuar Leyendo
                </a>
                <a
                  href="#"
                  className="hover:border-b text-white hover:text-gray-300 font-medium hidden md:inline"
                >
                  Publicar Tomos
                </a>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-white focus:outline-none"
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

              {/* Login + Search */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="pl-9 pr-3 py-1.5 rounded-md bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
                </div>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 font-medium"
                >
                  Login
                </a>
              </div>
            </div>

            {/* Mobile menu dropdown */}
            {menuOpen && (
              <div className="md:hidden mt-2 space-y-2 pb-4">
                <a
                  href="#"
                  className="hover:border-b block text-white hover:text-gray-300 font-medium"
                >
                  Favoritos
                </a>
                <a
                  href="#"
                  className="hover:border-b block text-white hover:text-gray-300 font-medium"
                >
                  Continuar Leyendo
                </a>
                <a
                  href="#"
                  className="hover:border-b block text-white hover:text-gray-300 font-medium"
                >
                  Publicar Tomos
                </a>
                <a
                  href="#"
                  className="hover:border-b block text-white hover:text-gray-300 font-medium"
                >
                  Login
                </a>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="mt-2 pl-9 pr-3 py-1.5 rounded-md bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/20 w-full"
                  />
                  <Search className="absolute left-2 top-6 transform -translate-y-1/2 text-white w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </nav>
        <main className="pt-16 flex-1 text-white mb-10">
          <Outlet />
        </main>
        <footer className="w-full bg-black/40 backdrop-blur-md text-zinc-300 py-7">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Jansel Roa
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="https://github.com/ninjadev23"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white transition"
              >
                <Github className="w-4 h-4" />
                GitHub Personal
              </a>
              <a
                href="https://github.com/ninjadev23/World-Manga"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white transition"
              >
                <Github className="w-4 h-4" />
                Proyecto
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
