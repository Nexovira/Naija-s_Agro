import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, RefreshCw, Eye } from 'lucide-react';

interface ImageUploadFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (imageUrl: string) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  id,
  label = 'Upload Image',
  value,
  onChange,
  placeholder = 'Click or drag & drop an image file here',
  helperText = 'Supports PNG, JPG, WEBP, AVIF up to 5MB',
  required = false,
  aspectRatio = 'auto',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) {
        setIsProcessing(false);
        return;
      }

      // Optimize / scale image if it's large to prevent heavy local/Firestore payload
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            onChange(optimizedDataUrl);
            setIsProcessing(false);
            return;
          }
        }

        onChange(result);
        setIsProcessing(false);
      };
      img.onerror = () => {
        onChange(result);
        setIsProcessing(false);
      };
      img.src = result;
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read image file');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const ratioClass = 
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'video' ? 'aspect-video' :
    aspectRatio === 'wide' ? 'aspect-[21/9]' : 'h-36';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-xs font-semibold text-[#4A5568]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Remove Photo</span>
            </button>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/avif,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview State */
        <div 
          className={`relative w-full ${ratioClass} rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] overflow-hidden group cursor-pointer`}
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={value}
            alt="Uploaded preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#0B3B24] text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace Photo</span>
            </span>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Image Attached</span>
          </div>
        </div>
      ) : (
        /* Upload Dropzone State */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full ${ratioClass} rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer ${
            isDragging 
              ? 'border-[#0B3B24] bg-emerald-50/60 scale-[1.01]' 
              : 'border-[#D9D0BE] bg-[#FAF8F5] hover:border-[#0B3B24] hover:bg-[#FAF8F5]/80'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 text-xs text-[#0B3B24] font-medium">
              <RefreshCw className="w-6 h-6 animate-spin text-[#0B3B24]" />
              <span>Processing image file...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-[#0B3B24]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0B3B24]">{placeholder}</p>
                <p className="text-[11px] text-[#718096] mt-0.5">{helperText}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] text-red-600 font-medium mt-1">{errorMsg}</p>
      )}
    </div>
  );
};
