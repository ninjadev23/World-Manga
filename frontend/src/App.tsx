import { useRoutes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MangaDetails from "./pages/MangaDetails";
import NotFound from "./pages/NotFound";
import ReaderManga from "./pages/ReaderManga";
import Favorites from "./pages/Favorites";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Public from "./pages/Public";
import NewMangas from "./pages/NewMangas";
import NewVolume from "./pages/NewVolume";
export default function App() {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        {
          element: <Home />,
          path: "/",
        },
        {
          element: <MangaDetails />,
          path: "/mangas/:id",
        },
        {
          element: <ReaderManga />,
          path: "/mangas/read/:title/:volume/:file",
        },
        {
          element: <Favorites />,
          path: "/favorites",
        },
        {
          element: <Signup />,
          path: "/signup",
        },
        {
          element: <Login />,
          path: "/login",
        },
        {
          element: <Profile />,
          path: "/profile",
        },
        {
          element: <Public />,
          path: "/publicar",
        },
        {
          element: <NewMangas />,
          path: "/publicar/manga",
        },
        {
          path: "*",
          element: <NotFound />,
        },
        {
          element: <NewVolume/>,
          path: "/publicar/volumes"
        }
      ],
    },
  ]);
}
