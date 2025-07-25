import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Search, Github } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useSearch } from "../context/SearchContext";
export default function Layout() {
  //Hooks
  const navigate = useNavigate();
  const location = useLocation();

  //Context
  const { query, setQuery } = useSearch();
  const { user } = useUser();

  //States
  const [backgroundNumber, setBackgroundNumber] = useState(9);
  const [show, setShow] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const randomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  //Handlers

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  //This is for changing the background image, dinamic background image
  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        let number = randomNumber(1, 18);
        if (number === backgroundNumber) number = randomNumber(1, 18);
        setBackgroundNumber(number);
        setShow(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundNumber]);

  return (
    <div className="flex flex-col min-h-screen relative w-full bg-gradient-to-br from-black via-gray-900 to-blue-900">
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
              <Link to="/">
                <h1 className="text-[1.2rem] text-white border p-2 font-bold border-white/20 rounded-lg max-[940px]:text-[1rem] max-[940px]:p-1.5">
                  World Manga
                </h1>
              </Link>

              <div className="flex items-center space-x-8 max-[940px]:space-x-4">
                <Link
                  to="/favorites"
                  className="hover:border-b text-white hover:text-gray-300 font-medium hidden md:inline max-[940px]:text-sm"
                >
                  Favoritos
                </Link>
                <a
                  href="#"
                  className="hover:border-b text-white hover:text-gray-300 font-medium hidden md:inline max-[940px]:text-sm"
                >
                  Continuar Leyendo
                </a>
                <Link
                  to="/publicar"
                  className="hover:border-b text-white hover:text-gray-300 font-medium hidden md:inline max-[940px]:text-sm"
                >
                  Publicar Tomos
                </Link>
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
                    value={query}
                    onChange={handleSearchChange}
                    type="text"
                    placeholder="Buscar..."
                    className="
        pl-9 pr-3 py-1.5 rounded-md bg-white/10 text-white placeholder-gray-300
        focus:outline-none focus:ring-2 focus:ring-white/20
        w-64                              /* ancho base en pantallas grandes */
        max-[940px]:w-52 max-[940px]:pl-7 max-[940px]:py-1.5
        max-[760px]:w-40 max-[760px]:pl-6 max-[760px]:py-1
      "
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
                </div>
                {!user && (
                  <Link
                    to="/signup"
                    className="text-white hover:text-gray-300 font-medium"
                  >
                    Signup
                  </Link>
                )}
                {user && (
                  <Link to="/profile">
                    <div className="overflow-hidden hover:bg-black/20 border p-1 rounded-md border-white/10 m-0 flex text-white gap-2 items-center flex-wrap">
                      <img
                        className="w-10 h-10 object-cover rounded-full"
                        src={user.avatar}
                        alt="avatar"
                      />
                      <p className="max-w-24 font-bold">{user.username}</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu dropdown */}
            {menuOpen && (
              <div className="md:hidden mt-2 space-y-2 pb-4">
                <Link
                  to="/favorites"
                  className="hover:border-b block text-white hover:text-gray-300 font-medium"
                >
                  Favoritos
                </Link>
                <a
                  href="#"
                  className="hover:border-b block text-white hover:text-gray-300 font-medium"
                >
                  Continuar Leyendo
                </a>
                <Link
                  to="/publicar"
                  className="hover:border-b block text-white hover:text-gray-300 font-medium"
                >
                  Publicar Tomos
                </Link>
                {!user && (
                  <Link
                    to="/signup"
                    className="text-white hover:text-gray-300 font-medium"
                  >
                    Signup
                  </Link>
                )}
                {user && (
                  <Link to="/profile">
                    <div className="hover:bg-black/20 border p-1 rounded-md border-white/10 m-0 flex text-white gap-2 items-center">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={user.avatar}
                        alt="avatar"
                      />
                      <p className="font-bold text-[1.1rem]">
                        {user.username}
                      </p>
                    </div>
                  </Link>
                )}
                <div className="relative">
                  <input
                    value={query}
                    onChange={handleSearchChange}
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
          <Outlet/>
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
