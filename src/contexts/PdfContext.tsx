import React, { createContext, useContext, useState } from 'react';

interface PdfContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export const usePdfContext = () => {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error('usePdfContext must be used within a PdfProvider');
  }
  return context;
};

interface PdfProviderProps {
  children: React.ReactNode;
}

export const PdfProvider: React.FC<PdfProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(54); // Based on the PDF showing 2/54 in the screenshot

  return (
    <PdfContext.Provider value={{ 
      currentPage, 
      setCurrentPage, 
      totalPages, 
      setTotalPages 
    }}>
      {children}
    </PdfContext.Provider>
  );
};