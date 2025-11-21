import React, { useState, useEffect, useRef } from 'react';
import { 
  Wand2, 
  Download, 
  RotateCcw, 
  History, 
  Maximize2, 
  Sparkles,
  Trash2,
  Layers
} from 'lucide-react';
import { ImageData, AppState } from '../types';
import { Button } from './Button';
import { editImageWithGemini } from '../services/geminiService';

interface EditorProps {
  initialImage: ImageData;
  onReset: () => void;
}

const SUGGESTED_PROMPTS = [
  "Add a cyberpunk neon filter",
  "Turn into a pencil sketch",
  "Remove the background",
  "Make it look like a vintage 1980s photo",
  "Add fireworks in the sky",
  "Convert to an oil painting"
];

export const Editor: React.FC<EditorProps> = ({ initialImage, onReset }) => {
  // History stack for undo functionality? For now, let's keep it simple: Original -> Current
  const [currentImage, setCurrentImage] = useState<ImageData>(initialImage);
  const [prompt, setPrompt] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setAppState(AppState.PROCESSING);
    setErrorMsg(null);

    try {
      const result = await editImageWithGemini(currentImage, prompt);
      setCurrentImage(result);
      setAppState(AppState.SUCCESS);
      setPrompt(''); // Clear prompt on success? Or keep it? Clearing feels cleaner for next action.
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "Failed to generate image");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.base64;
    link.download = `visionai-edit-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUndo = () => {
    setCurrentImage(initialImage);
    setAppState(AppState.IDLE);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      
      {/* Left Column: Image Preview */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="relative group w-full aspect-[4/3] or h-[60vh] bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden flex items-center justify-center shadow-2xl">
          
          {/* Background grid pattern for transparency */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          <img 
            src={showComparison ? initialImage.base64 : currentImage.base64} 
            alt="Editing preview" 
            className="max-w-full max-h-full object-contain transition-all duration-300"
          />

          {/* Loading Overlay */}
          {appState === AppState.PROCESSING && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
              <p className="mt-4 text-indigo-200 font-medium animate-pulse">VisionAI is dreaming...</p>
            </div>
          )}

          {/* Comparison Toggle Overlay (if edited) */}
          {currentImage !== initialImage && appState !== AppState.PROCESSING && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-slate-900/90 rounded-full p-1 border border-slate-700 shadow-xl">
              <button
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${!showComparison ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                onMouseEnter={() => setShowComparison(false)}
                onClick={() => setShowComparison(false)}
              >
                Edited
              </button>
              <button
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${showComparison ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                onMouseEnter={() => setShowComparison(true)}
                onMouseLeave={() => setShowComparison(false)}
                onClick={() => setShowComparison(true)}
              >
                Original
              </button>
            </div>
          )}

          {/* Error Overlay */}
          {appState === AppState.ERROR && errorMsg && (
             <div className="absolute inset-x-4 top-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl backdrop-blur-md flex items-center justify-between">
               <span className="text-red-200 text-sm">{errorMsg}</span>
               <button onClick={() => setAppState(AppState.IDLE)} className="text-red-200 hover:text-white"><Trash2 className="w-4 h-4"/></button>
             </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
           <div className="flex gap-2">
             <Button variant="secondary" onClick={handleUndo} disabled={currentImage === initialImage} icon={<RotateCcw className="w-4 h-4"/>}>
               Reset
             </Button>
             <Button variant="secondary" onClick={onReset} icon={<Trash2 className="w-4 h-4"/>}>
               New Image
             </Button>
           </div>
           <Button onClick={handleDownload} icon={<Download className="w-4 h-4"/>}>
             Download
           </Button>
        </div>
      </div>

      {/* Right Column: Controls */}
      <div className="flex flex-col gap-6">
        
        {/* Prompt Input */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-5 shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-2 text-indigo-400 font-medium">
            <Wand2 className="w-5 h-5" />
            <h2>Magic Editor</h2>
          </div>
          
          <p className="text-sm text-slate-400">
            Describe how you want to change the image. Be creative!
          </p>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Make the sky purple..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={!prompt.trim() || appState === AppState.PROCESSING} 
            isLoading={appState === AppState.PROCESSING}
            className="w-full py-3"
          >
            Generate Edit
          </Button>
        </div>

        {/* Quick Actions / Suggestions */}
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Layers className="w-5 h-5" />
            <h3>Quick Actions</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => setPrompt(p)}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-indigo-300 px-3 py-2 rounded-lg transition-colors border border-slate-600 hover:border-indigo-500/50 text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-auto p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200/80 leading-relaxed">
          <p className="font-semibold mb-1 text-indigo-300">Pro Tip:</p>
          The model works best with clear, descriptive instructions. You can ask to add objects, change styles, or modify specific areas.
        </div>

      </div>
    </div>
  );
};
