import { useContext, createContext, useState } from "react";
import type { SearchContextType } from "../types";
//Search context
const SearchContext = createContext<SearchContextType>({
  query: "",
  setQuery: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
export function useSearch() {
  return useContext(SearchContext);
}

