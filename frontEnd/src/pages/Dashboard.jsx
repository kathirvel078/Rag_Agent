import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { FileUpload } from '../components/upload/FileUpload';
import { ChatContainer } from '../components/chat/ChatContainer';

export const Dashboard = () => {
  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-none p-6 border-b border-border bg-background/50">
          <FileUpload />
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatContainer />
        </div>
      </div>
    </MainLayout>
  );
};
