import { useState } from 'react';
import { Search, Image as ImageIcon, Video, Loader2, X } from 'lucide-react';

export default function PexelsPicker({ onSelect, type = 'images' }: { onSelect: (url: string) => void, type?: 'images' | 'videos' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://abstracker.abstracker0.workers.dev/api/pexels?q=${encodeURIComponent(query)}&type=${type}`);
      const data = await res.json();
      if (type === 'images') {
        setResults(data.photos || []);
      } else {
        setResults(data.videos || []);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch from Stock Media');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  if (!isOpen) {
    return (
      <button 
        type="button" 
        onClick={() => setIsOpen(true)}
        className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 border border-blue-200 transition-colors"
      >
        {type === 'images' ? <ImageIcon className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
        Search Stock {type === 'images' ? 'Images' : 'Videos'}
      </button>
    );
  }

  return (
    <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          {type === 'images' ? <ImageIcon className="w-4 h-4 text-blue-500" /> : <Video className="w-4 h-4 text-blue-500" />}
          Stock Media Search
        </h4>
        <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Search ${type}...`}
          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="button" onClick={handleSearch} disabled={loading} className="px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
          {results.map((item: any) => {
            const url = type === 'images' ? item.src.large : item.video_files[0]?.link;
            const thumb = type === 'images' ? item.src.medium : item.image;
            
            return (
              <div 
                key={item.id} 
                onClick={() => {
                  if (url) {
                    onSelect(url);
                    setIsOpen(false);
                  }
                }}
                className="aspect-video relative rounded-lg overflow-hidden cursor-pointer group border-2 border-transparent hover:border-blue-500 transition-all"
              >
                <img loading="lazy" width="800" height="600" src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold bg-blue-600 px-2 py-1 rounded">Select</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
