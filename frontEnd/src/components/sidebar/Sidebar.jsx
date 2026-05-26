import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Bot, FileText, CheckCircle2, Circle, Sun, Moon, Database, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = () => {
  const { uploadedFiles, isDarkMode, toggleDarkMode, currentDocument, setCurrentDocument } = useAppContext();

  return (
    <div className="w-72 border-r border-border bg-card flex flex-col h-full z-10 shadow-sm transition-all duration-300">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">RAG Agent</h1>
          <p className="text-xs text-muted-foreground font-medium">AI Knowledge Assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            Knowledge Base
          </h3>
          
          {uploadedFiles.length === 0 ? (
            <div className="text-sm text-muted-foreground italic px-2 py-4 text-center border border-dashed border-border rounded-lg bg-background/50">
              No documents uploaded yet
            </div>
          ) : (
            <ul className="space-y-2">
              {uploadedFiles.map((file, idx) => (
                <li key={idx} 
                    onClick={() => file.status === 'processed' && setCurrentDocument(file.name)}
                    className={clsx(
                      "flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer group",
                      currentDocument === file.name 
                        ? "bg-primary/10 border-primary/30 text-primary-foreground" 
                        : "bg-background border-border hover:border-primary/30 hover:bg-muted"
                    )}>
                  <div className="flex-shrink-0">
                    {file.status === 'processed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : file.status === 'processing' ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground group-hover:text-primary transition-colors">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {file.status === 'processed' ? 'Ready for queries' : file.status === 'processing' ? 'Processing...' : 'Uploaded'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
          <div className={clsx(
            "w-8 h-4 rounded-full p-0.5 transition-colors",
            isDarkMode ? "bg-primary" : "bg-muted-foreground/30"
          )}>
            <div className={clsx(
              "w-3 h-3 rounded-full bg-white transition-transform",
              isDarkMode ? "translate-x-4" : "translate-x-0"
            )} />
          </div>
        </button>
      </div>
    </div>
  );
};
