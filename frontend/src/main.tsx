import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.tsx";
import { SearchProvider } from "./context/SearchContext.tsx";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <UserProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </UserProvider>
  </BrowserRouter>
);
