'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Folder } from '@/lib/types';

interface FoldersContextType {
  folders: Folder[] | null;
  setFolders: (folders: Folder[] | null) => void;
}

// 1. create context object with type
const FoldersContext = createContext<FoldersContextType | undefined>(undefined);

interface FoldersProviderProps {
  children: ReactNode;
}

// 2. create the context provider with types
function FoldersProvider({ children }: FoldersProviderProps) {
  const [folders, setFolders] = useState<Folder[] | null>(null);

  return <FoldersContext.Provider value={{ folders, setFolders }}>{children}</FoldersContext.Provider>;
}

// Custom hook with proper type checking
const useFolders = (): FoldersContextType => {
  const context = useContext(FoldersContext);
  if (!context) {
    throw new Error('useFolders must be used within a FoldersProvider');
  }
  return context;
};

// 3. export the context and provider
export { useFolders, FoldersProvider };
