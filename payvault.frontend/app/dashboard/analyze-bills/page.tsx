'use client';
import React from 'react';
import { useState, useRef } from 'react';

export default function AnalyzeBills() {
  const [billImage, setBillImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (file: File) => {
    setFileName(file.name);
    setFileType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setBillImage(e.target?.result as string);
      setConversation([{role: 'assistant', content: 'Bill uploaded successfully. Ask me anything about it.'}]);
    };
    reader.readAsDataURL(file);
  };

  const handleQuestion = async (question: string) => {
    if (!fileInputRef.current?.files?.[0] || !question.trim() ) return;
    
    setIsProcessing(true);
    setConversation(prev => [...prev, {role: 'user', content: question}]);
    
    try {
      const formData = new FormData();
      formData.append("image", fileInputRef.current.files[0]);
      formData.append("question", question);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_GENAI}/analyze-bill`,
        {
          method: 'POST',
          body:formData
        }
      );
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const data = await response.json();
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer_from_image_text || "No answer found."
      }]);
    } catch (error) {
      console.error(error)
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please ask something else."
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Analyze Your Bills</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload a bill image or PDF, and ask questions about charges, due dates, and more.
        </p>
      </div>
      <div className="mt-3 p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Upload & Preview */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Upload Bill</h2>
            <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              accept="image/*,.pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <div className=" bg-blue-600 text-white px-4 py-2 transition">
                Choose File
             </div>
              <div className="px-4 py-2 text-gray-500 truncate">
                {fileInputRef.current?.files?.[0]?.name || 'No file chosen'}
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Supports: JPG, PNG, PDF (max 5MB)
          </p>
        </div>
          {billImage && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Bill Preview</h2>
               {fileType === 'application/pdf' ? (
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="text-6xl text-red-500 mb-2">📄</div>
                <p className="text-sm font-medium text-gray-700 truncate max-w-full">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF Document</p>
              </div>
            ):(
              <img 
                src={billImage} 
                alt="Uploaded bill" 
                className="max-h-80 w-auto mx-auto border rounded"
              />
            )}
            </div>
          )}
        </div>

        {/* Right Column - Chat */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col h-[500px]">
          <h2 className="text-lg font-semibold mb-3">Ask About Your Bill</h2>
          
          {/* Conversation */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {conversation.map((msg, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-blue-100 ml-auto' 
                    : 'bg-gray-100 mr-auto'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isProcessing && (
              <div className="p-3 rounded-lg bg-gray-100 mr-auto w-1/2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const question = (form.elements.namedItem('question') as HTMLInputElement).value;
              handleQuestion(question);
              form.reset();
            }}
            className="mt-auto"
          >
            <div className="flex gap-2">
              <input
                name="question"
                type="text"
                placeholder="Ask about charges, due date, etc..."
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!billImage || isProcessing}
              />
              <input
                type="submit"
                value="Send"
                disabled={!billImage || isProcessing}
                className="bg-blue-600 text-white p-2 rounded-lg disabled:opacity-50 cursor-pointer"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
