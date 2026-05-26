import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X, Check, Loader2, Server } from 'lucide-react';
import { documentService } from '../../services/api';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import clsx from 'clsx';

export const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const { addUploadedFile, updateFileStatus } = useAppContext();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.txt')) {
      toast.error('Invalid file type. Please upload PDF, DOCX, or TXT.');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    const toastId = toast.loading('Uploading document...');
    
    try {
      await documentService.uploadDocument(selectedFile);
      toast.success('Document uploaded successfully!', { id: toastId });
      
      const fileData = { name: selectedFile.name, status: 'uploaded' };
      addUploadedFile(fileData);
      setSelectedFile(null);
      
      // Auto trigger processing
      handleProcess(selectedFile.name);
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload document. Is the backend running?', { id: toastId });
    } finally {
      setUploading(false);
    }
  };
  
  const handleProcess = async (filename) => {
    updateFileStatus(filename, 'processing');
    const toastId = toast.loading(`Processing ${filename} into vector store...`);
    
    try {
      await documentService.processDocument(filename);
      toast.success('Document processed and ready for Q&A!', { id: toastId });
      updateFileStatus(filename, 'processed');
    } catch (error) {
      console.error(error);
      toast.error('Failed to process document.', { id: toastId });
      updateFileStatus(filename, 'failed');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-1 bg-card rounded-2xl border border-border shadow-sm mb-2">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-primary" />
          Add Knowledge
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Upload documents to expand the AI's knowledge base.</p>
      </div>

      {!selectedFile ? (
        <div 
          className={clsx(
            "relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer group",
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={handleChange}
          />
          <div className="w-14 h-10 bg-background border border-border rounded-full flex items-center justify-center mb-1 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">Click to upload or drag and drop</h3>
          <p className="text-sm text-muted-foreground">PDF, DOCX, or TXT (Max. 10MB)</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-2 bg-background flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!uploading && (
              <button 
                onClick={() => setSelectedFile(null)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Server className="w-4 h-4" />
                  Upload to Server
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
