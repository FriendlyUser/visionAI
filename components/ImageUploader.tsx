import React, { useCallback } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { fileToBase64, getMimeTypeFromBase64 } from '../utils/imageUtils';
import { ImageData } from '../types';

interface ImageUploaderProps {
  onImageUpload: (data: ImageData) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const mimeType = getMimeTypeFromBase64(base64);
      onImageUpload({ base64, mimeType });
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Failed to read file.');
    }
  }, [onImageUpload]);

  return (
    <div className="w-full h-96 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30 hover:bg-slate-800/50 hover:border-indigo-500/50 transition-all flex flex-col items-center justify-center group cursor-pointer relative overflow-hidden">
       <input 
        type="file" 
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        onChange={handleFileChange}
        accept="image/*"
      />
      
      <div className="p-4 rounded-full bg-slate-800 group-hover:bg-indigo-500/20 transition-colors mb-4">
        <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-200 mb-2">Upload your photo</h3>
      <p className="text-slate-500 text-sm text-center max-w-xs">
        Drag and drop or click to browse. <br/>
        Supports JPG, PNG, and WEBP.
      </p>

      <div className="mt-8 flex gap-4 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
        {/* Decorative mini previews */}
        <div className="w-16 h-20 bg-slate-700 rounded-lg rotate-[-6deg] shadow-lg flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-slate-500" />
        </div>
        <div className="w-16 h-20 bg-slate-600 rounded-lg rotate-[3deg] shadow-lg flex items-center justify-center translate-y-[-10px]">
           <ImageIcon className="w-6 h-6 text-slate-400" />
        </div>
        <div className="w-16 h-20 bg-slate-700 rounded-lg rotate-[12deg] shadow-lg flex items-center justify-center">
           <ImageIcon className="w-6 h-6 text-slate-500" />
        </div>
      </div>
    </div>
  );
};
