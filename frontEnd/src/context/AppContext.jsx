import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initial dark mode setup
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const addUploadedFile = useCallback((file) => {
    setUploadedFiles((prev) => [...prev, file]);
  }, []);

  const updateFileStatus = useCallback((filename, status) => {
    setUploadedFiles((prev) => 
      prev.map(f => f.name === filename ? { ...f, status } : f)
    );
  }, []);

  const addChatMessage = useCallback((message) => {
    setChatHistory((prev) => [...prev, message]);
  }, []);
  
  const clearChat = useCallback(() => {
    setChatHistory([]);
  }, []);

  const value = {
    uploadedFiles,
    setUploadedFiles,
    currentDocument,
    setCurrentDocument,
    isProcessing,
    setIsProcessing,
    chatHistory,
    setChatHistory,
    addUploadedFile,
    updateFileStatus,
    addChatMessage,
    clearChat,
    isDarkMode,
    toggleDarkMode
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
