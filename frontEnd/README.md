# AI RAG Assistant Frontend

This is a modern, production-ready React.js frontend for an AI-powered RAG (Retrieval-Augmented Generation) application. It provides a ChatGPT-style interface with a seamless document upload and processing workflow.

## Features

- **Document Upload**: Support for PDF, DOCX, and TXT files with drag-and-drop.
- **Vector Store Processing**: Process uploaded documents seamlessly into a vector database for RAG.
- **AI Chat Interface**: Interactive chat with markdown support and source citation.
- **Source Tracing**: View document sources and page numbers for the generated answers.
- **Dark Mode**: Built-in support for dark and light modes.
- **Modern UI**: Polished, responsive design using Tailwind CSS, Lucide icons, and Framer Motion.

## Tech Stack

- React.js (Vite)
- Tailwind CSS
- Axios (API Client)
- React Hot Toast (Notifications)
- Lucide React (Icons)
- Framer Motion (Animations)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory and add the backend API URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
   *An example `.env` file has been provided in the project.*

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The app will be accessible at `http://localhost:5173` (or another port depending on Vite).

## API Integration

The frontend expects the backend to expose the following endpoints:

- `POST /upload`: Uploads a document (expects `multipart/form-data` with `file`).
- `POST /upload/store/{filename}`: Processes the uploaded document into the vector store.
- `POST /ask`: Accepts a JSON payload `{ "question": "..." }` and returns `{ "answer": "...", "sources": [...] }`.

## Architecture

- `src/components/`: Modular UI components organized by feature (chat, layout, upload, etc.).
- `src/context/`: React Context for global state management.
- `src/services/`: API layer for handling backend communication with Axios.
- `src/pages/`: Main application views.

Enjoy building your AI applications!
