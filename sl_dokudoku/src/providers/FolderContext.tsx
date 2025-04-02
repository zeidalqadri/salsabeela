'use client';

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface FolderContextType {
  selectedFolderId: string | null;
  setSelectedFolderId: Dispatch<SetStateAction<string | null>>;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null); // Default to null (All Documents)

  return (
    <FolderContext.Provider value={{ selectedFolderId, setSelectedFolderId }}>
      {children}
    </FolderContext.Provider>
  );
};

export const useFolderContext = (): FolderContextType => {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error('useFolderContext must be used within a FolderProvider');
  }
  return context;
};
