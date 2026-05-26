import React from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export const MainLayout = ({ children }) => {
  const { isDarkMode } = useAppContext();

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {children}
      </main>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: '!bg-card !text-card-foreground !border !border-border !shadow-lg',
          style: {
            borderRadius: '0.75rem',
            padding: '16px',
          },
        }} 
      />
    </div>
  );
};
