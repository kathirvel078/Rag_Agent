import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Navbar } from '../layout/Navbar';
import { Loader } from '../ui/Loader';
import { Bot, MessageSquarePlus, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { documentService } from '../../services/api';
import toast from 'react-hot-toast';

export const ChatContainer = () => {
  const { chatHistory, addChatMessage, clearChat, uploadedFiles } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isGenerating]);

  const handleSend = async (content) => {
    // Add user message
    const userMessage = { role: 'user', content };
    addChatMessage(userMessage);
    
    setIsGenerating(true);
    
    try {
      const response = await documentService.askQuestion(content);
      
      const aiMessage = {
        role: 'assistant',
        content: response.answer || response.response || 'I could not generate an answer.',
        sources: response.sources || []
      };
      
      addChatMessage(aiMessage);
    } catch (error) {
      console.error(error);
      toast.error('Failed to get response from AI');
      addChatMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error while trying to answer your question. Please make sure the backend is running and documents are processed.',
        sources: []
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const hasProcessedDocs = uploadedFiles.some(f => f.status === 'processed');

  return (
    <div className="flex flex-col h-full relative">
      <Navbar />

      <div className="flex-1 overflow-y-auto scroll-smooth">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">How can I help you today?</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              {!hasProcessedDocs 
                ? "Upload and process some documents first to start asking questions about them." 
                : "Ask me anything about your uploaded documents. I'll search through the knowledge base to find the right answers."}
            </p>
            
            {/* {hasProcessedDocs && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                {['What is the main topic of the documents?', 'Can you summarize the key points?', 'Are there any specific dates mentioned?', 'List the main conclusions.'].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-left group"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{suggestion}</p>
                  </button>
                ))}
              </div>
            )} */}
          </div>
        ) : (
          <div className="pb-8 pt-4">
            {chatHistory.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            
            {isGenerating && (
              <div className="py-6 px-4 md:px-8 bg-muted/30 border-y border-border/50">
                <div className="max-w-4xl mx-auto flex gap-4 md:gap-6 w-full">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-sm">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Loader />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={isGenerating || !hasProcessedDocs} />
    </div>
  );
};
