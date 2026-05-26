import React from 'react';
import { Sparkles, MessageSquarePlus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Navbar = () => {
  const { chatHistory, clearChat } = useAppContext();

  return (
    <div className="flex items-center justify-between px-7 py-2 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-8 w-full">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
        <Sparkles className="w-5 h-5 text-primary" />
        Knowledge Chat
      </h2>
      
      {chatHistory.length > 0 && (
        <button 
          onClick={clearChat}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-lg transition-colors"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Chat
        </button>
      )}
    </div>
  );
};
