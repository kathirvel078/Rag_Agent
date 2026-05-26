import React from 'react';
import { User, Bot, FileText, ChevronDown, ChevronUp, Copy, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [showSources, setShowSources] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "py-6 px-4 md:px-8 flex w-full",
        isUser ? "bg-transparent" : "bg-muted/30 border-y border-border/50"
      )}
    >
      <div className="max-w-4xl mx-auto flex gap-4 md:gap-6 w-full">
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-foreground">
              {isUser ? 'You' : 'RAG Assistant'}
            </span>
            {!isUser && (
              <button 
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                title="Copy response"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>

          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <button 
                onClick={() => setShowSources(!showSources)}
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="w-4 h-4" />
                {message.sources.length} Source{message.sources.length !== 1 ? 's' : ''} Used
                {showSources ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
              </button>
              
              <AnimatePresence>
                {showSources && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 grid gap-2">
                      {message.sources.map((source, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-background border border-border text-xs flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-muted-foreground font-medium">
                            <span className="truncate">{source.metadata?.source || `Document ${idx + 1}`}</span>
                            {source.metadata?.page && <span className="flex-shrink-0 bg-muted px-1.5 py-0.5 rounded">Page {source.metadata.page}</span>}
                          </div>
                          <p className="text-foreground/80 line-clamp-3 italic">"{source.page_content}"</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
