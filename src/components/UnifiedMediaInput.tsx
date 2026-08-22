import { useState } from 'react';
import { Image as ImageIcon, Video, Link as LinkIcon, Upload, Check } from 'lucide-react';
import PexelsPicker from './PexelsPicker';
import CryptoJS from 'crypto-js';

// Cloud config for unified uploader
const publicKey = 'public_8Nsb3smOsQ7Mqwdtyhi5Z6ZZwsY=';
const privateKey = 'private_g1I4bEI5myyv4yhWHhaPP7cWHwc=';

export default function UnifiedMediaInput({ 
  value, 
  onChange, 
  label, 
  type = 'images' 
}: { 
  value: string, 
  onChange: (url: string) => void, 
  label: string, 
  type?: 'images' | 'videos' 
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('folder', '/dealers');
      formData.append('useUniqueFileName', 'true');

      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(privateKey + ':')}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error('Upload failed: ' + errText);
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Upload Error', error);
      alert('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
          {label}
        </label>
        <PexelsPicker type={type} onSelect={onChange} />
      </div>

      <div className="flex gap-2 items-center">
        {/* Direct URL Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="url" 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            className="w-full pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-bold text-slate-900 shadow-sm" 
            placeholder="https://..." 
          />
        </div>

        
        {/* File Upload Button */}
        <div className="relative">
          <input 
            type="file" 
            accept={type === 'images' ? 'image/*' : 'video/*'}
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
          />
          <div className="px-4 py-3 bg-slate-900 border border-slate-900 rounded-xl text-white font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap">
            {uploading ? (
               <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
            ) : (
               <Upload className="w-4 h-4" />
            )}
            Upload to Cloud
          </div>
        </div>
      </div>
      
      {/* Preview */}
      {value && type === 'images' && (
        <div className="mt-2 w-32 h-20 rounded-lg border border-slate-200 overflow-hidden relative group">
           <img loading="lazy" width="800" height="600" src={value} className="w-full h-full object-cover" alt="Preview" />
        </div>
      )}
      {value && type === 'videos' && (
        <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
          <Check className="w-4 h-4" /> Video successfully attached
        </div>
      )}
    </div>
  );
}
