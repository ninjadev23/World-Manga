import {useRoutes} from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import MangaDetails from "./pages/MangaDetails"
import NotFound from "./pages/NotFound"
import ReaderManga from "./pages/ReaderManga"
import Favorites from "./pages/Favorites"
export default function App(){
    return useRoutes([
        {
            element: <Layout/>,
            children: [
                {
                    element:  <Home/>,
                    path: "/"
                },
                {
                    element: <MangaDetails/>,
                    path: "/mangas/:id"
                },
                {
                    element: <ReaderManga/>,
                    path: "/mangas/read/:title/:volume/:file"
                },
                {
                    element: <Favorites/>,
                    path: "/favorites"
                }
            ]
        },
        {
            path:"*",
            element: <NotFound/>
        }
    ])
}