import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Editor } from './components/Editor';
import { ImageData } from './types';

function App() {
  const [uploadedImage, setUploadedImage] = useState<ImageData | null>(null);

  const handleImageUpload = (data: ImageData) => {
    setUploadedImage(data);
  };

  const handleReset = () => {
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!uploadedImage ? (
          <div className="max-w-2xl mx-auto flex flex-col gap-8 mt-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Transform photos with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">AI Magic</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Use natural language to edit images, remove objects, change backgrounds, and more. Powered by Gemini Nano.
              </p>
            </div>
            <ImageUploader onImageUpload={handleImageUpload} />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
               {['Smart Object Removal', 'Style Transfer', 'Generative Fill'].map((feat, i) => (
                 <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                   <p className="text-indigo-300 font-medium">{feat}</p>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="h-full">
            <Editor initialImage={uploadedImage} onReset={handleReset} />
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-slate-900 bg-slate-950 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} VisionAI. Built with Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
}

export default App;
