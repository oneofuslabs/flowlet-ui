import { createContext, useContext, useState } from "react";

type TitleContextType = {
  title: string;
  updateTitle: (title: string | undefined) => void;
};

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export function TitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string>("Dashboard");

  const updateTitle = (title: string | undefined) => {
    setTitle(title || "Flowlet");
    document.title = title ? title + " - Flowlet.ai" : "Flowlet.ai";
  };

  return (
    <TitleContext.Provider
      value={{
        title,
        updateTitle,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
}

export function useTitle() {
  const context = useContext(TitleContext);
  if (context === undefined) {
    throw new Error("useTitle must be used within an TitleProvider");
  }
  return context;
}
