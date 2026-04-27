'use client';
export const runtime = "edge";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Save, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

const SLIDER_KEYS = [
  { key: 'home_hero_slider_images', name: 'Home Hero Slider' },
  { key: 'home_powers_slider_images', name: 'Super Powers Slider' },
];

export default function SlidersPage() {
  const [activeSlider, setActiveSlider] = useState(SLIDER_KEYS[0].key);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error' | null, msg: string}>({type: null, msg: ''});

  const supabase = createClient();

  useEffect(() => {
    fetchSliderContent();
  }, [activeSlider]);

  const fetchSliderContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content')
      .select('value')
      .eq('key', activeSlider)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is no rows found
      console.error(error);
    } else {
      if (data && data.value) {
        try {
          let parsed = JSON.parse(data.value);
          let imagesArray = Array.isArray(parsed) ? parsed : [];
          
          // If sliders are empty, seed them with defaults
          if (imagesArray.length === 0) {
             if (activeSlider === 'home_hero_slider_images') {
               const defaults = ['/images/gym-girl-scaled.jpg', '/images/fitness image 2.jpg'];
               imagesArray = [...defaults];
               await saveSliderToDB(imagesArray, true);
             } else if (activeSlider === 'home_powers_slider_images') {
               const defaults = ['/images/superman.jpeg', '/images/thor.jpg', '/images/supergirl.jpeg'];
               imagesArray = [...defaults];
               await saveSliderToDB(imagesArray, true);
             }
          }
          
          setImages(imagesArray);
        } catch(e) {
          setImages([]);
        }
      } else {
        // Create initial entry if missing entirely
        if (activeSlider === 'home_hero_slider_images') {
             const defaults = ['/images/gym-girl-scaled.jpg', '/images/fitness image 2.jpg'];
             setImages(defaults);
             await saveSliderToDB(defaults, true);
        } else if (activeSlider === 'home_powers_slider_images') {
             const defaults = ['/images/superman.jpeg', '/images/thor.jpg', '/images/supergirl.jpeg'];
             setImages(defaults);
             await saveSliderToDB(defaults, true);
        } else {
             setImages([]);
        }
      }
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setStatus({type: null, msg: ''});

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `slider_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `sliders/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      const newUrl = publicUrlData.publicUrl;
      const newImages = [...images, newUrl];
      
      setImages(newImages);
      await saveSliderToDB(newImages);
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setStatus({type: 'error', msg: error.message});
    } finally {
      setUploading(false);
      if(e.target) e.target.value = ''; // reset input
    }
  };

  const removeImage = async (indexToRemove: number) => {
    const newImages = images.filter((_, idx) => idx !== indexToRemove);
    setImages(newImages);
    await saveSliderToDB(newImages);
  };

  const saveSliderToDB = async (imagesArray: string[], silent = false) => {
    if (!silent) setSaving(true);
    try {
      const { error } = await supabase
        .from('content')
        .upsert({ 
          key: activeSlider, 
          value: JSON.stringify(imagesArray),
          type: 'text'
        }, { onConflict: 'key' });

      if (error) throw error;
      if (!silent) {
        setStatus({type: 'success', msg: 'Slider updated successfully'});
        setTimeout(() => setStatus({type: null, msg: ''}), 3000);
      }
    } catch(err: any) {
      if (!silent) setStatus({type: 'error', msg: err.message});
    } finally {
      if (!silent) setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Slider Management</h1>
          <p className="text-text-grey mt-1">Add, remove, and organize images for your website sliders.</p>
        </div>
      </div>

      {status.type && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          {status.msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-glass-border">
        {SLIDER_KEYS.map((slider) => (
          <button
            key={slider.key}
            onClick={() => setActiveSlider(slider.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeSlider === slider.key 
                ? 'bg-primary text-white shadow-[0_0_15px_rgba(168,98,237,0.3)]' 
                : 'bg-white/5 text-text-grey hover:bg-white/10 hover:text-white'
            }`}
          >
            {slider.name}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-glass-border rounded-2xl p-6 backdrop-blur-md">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="text-primary" size={24} />
            {SLIDER_KEYS.find(s => s.key === activeSlider)?.name}
          </h2>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={async () => {
                if(confirm('Are you sure you want to reset this slider to defaults? This will remove all custom images.')) {
                  const defaults = activeSlider === 'home_hero_slider_images' 
                    ? ['/images/gym-girl-scaled.jpg', '/images/fitness image 2.jpg']
                    : ['/images/superman.jpeg', '/images/thor.jpg', '/images/supergirl.jpeg'];
                  setImages(defaults);
                  await saveSliderToDB(defaults);
                }
              }}
              className="px-4 py-2 bg-white/5 hover:bg-red-500/10 text-text-grey hover:text-red-400 rounded-xl border border-glass-border transition-all text-xs font-bold"
            >
              Reset to Defaults
            </button>
            <button 
              onClick={fetchSliderContent}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-glass-border transition-colors"
              title="Refresh images"
            >
              <Loader2 className={loading ? "animate-spin" : ""} size={20} />
            </button>
            <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={uploading || saving}
              />
              <button 
                disabled={uploading || saving}
                className="btn btn-primary flex items-center gap-2 px-6 py-2.5 disabled:opacity-50 text-sm font-bold"
              >
                {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                {uploading ? 'Uploading...' : 'Add Image'}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-grey">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Loading slider images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-grey bg-black/20 rounded-xl border border-dashed border-glass-border">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No images in this slider yet.</p>
            <p className="text-sm mt-2 opacity-70">Click the upload button to add your first image.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((url, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden bg-black/40 border border-glass-border shadow-lg min-h-[150px]">
                <div className="aspect-video relative w-full h-full min-h-[150px] bg-white/5 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={encodeURI(url)} 
                    alt={`Slider image ${idx + 1}`} 
                    className="w-full h-full object-cover block"
                    loading="lazy"
                    onError={(e) => {
                      console.error("Image failed to load:", url);
                      (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a1a/a862ed?text=Image+Not+Found';
                    }}
                  />
                  
                  {/* Delete Button - Always visible on top right */}
                  <button 
                    onClick={() => removeImage(idx)}
                    disabled={saving}
                    className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-md transition-all shadow-lg z-10"
                    title="Remove image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="p-3 bg-black/40 border-t border-glass-border flex justify-between items-center">
                  <span className="text-xs font-mono text-text-grey uppercase tracking-wider">
                    Slide {idx + 1}
                  </span>
                  <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                    {url.includes('supabase') ? 'CLOUD' : 'LOCAL'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
