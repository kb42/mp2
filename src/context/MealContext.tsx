import { createContext, useContext, useState, ReactNode } from "react";

interface MealContextType {
  mealIds: string[];
  setMealIds: (ids: string[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  source: "list" | "gallery" | null;
  setSource: (source: "list" | "gallery" | null) => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export function MealProvider({ children }: { children: ReactNode }) {
  const [mealIds, setMealIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [source, setSource] = useState<"list" | "gallery" | null>(null);

  return (
    <MealContext.Provider
      value={{
        mealIds,
        setMealIds,
        currentIndex,
        setCurrentIndex,
        source,
        setSource,
      }}
    >
      {children}
    </MealContext.Provider>
  );
}

export function useMealContext() {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error("useMealContext must be used within MealProvider");
  }
  return context;
}
