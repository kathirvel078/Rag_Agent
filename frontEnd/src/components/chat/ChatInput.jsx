import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';
import clsx from 'clsx';

export const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent">
      <div className="max-w-4xl mx-auto relative group">
        <form 
          onSubmit={handleSubmit}
          className={clsx(
            "relative flex items-end gap-2 p-2 rounded-2xl border bg-card shadow-sm transition-all duration-300",
            disabled ? "opacity-70 border-border" : "border-border hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:shadow-md"
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "Waiting for response..." : "Ask a question about your documents..."}
            className="flex-1 max-h-[200px] min-h-[44px] w-full resize-none bg-transparent px-3 py-3 text-sm md:text-base outline-none text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed"
            rows={1}
          />
          <div className="flex-shrink-0 mb-1 mr-1">
            <button
              type="submit"
              disabled={!input.trim() || disabled}
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transition-all hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary disabled:cursor-not-allowed active:scale-95"
            >
              <Send className="w-5 h-5 -ml-0.5" />
            </button>
          </div>
        </form>
        <div className="text-center mt-2 text-xs text-muted-foreground">
          Press <kbd className="font-sans px-1.5 py-0.5 rounded-md border border-border bg-muted/50 text-[10px] uppercase inline-flex items-center gap-1">Enter <CornerDownLeft className="w-3 h-3"/></kbd> to send, <kbd className="font-sans px-1.5 py-0.5 rounded-md border border-border bg-muted/50 text-[10px] uppercase">Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
};
