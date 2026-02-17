
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image, MapPin, X } from 'lucide-react';

interface FeedCreateFormProps {
  onSubmit: (content: string, images: string[], location?: string) => void;
  currentUserAvatar?: string;
}

const FeedCreateForm: React.FC<FeedCreateFormProps> = ({
  onSubmit,
  currentUserAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
}) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) return;
    onSubmit(content, images, location || undefined);
    setContent('');
    setImages([]);
    setLocation('');
    setShowLocationInput(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-white/5"
    >
      <div className="flex gap-3">
        <img
          src={currentUserAvatar}
          alt="Current user"
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="무슨 일이 일어나고 있나요?"
            className="w-full min-h-[80px] resize-none bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none text-sm"
          />
          {content.includes('#') && (
            <div className="flex flex-wrap gap-1 mb-3">
              {content.match(/#\w+/g)?.map((tag, idx) => (
                <span key={idx} className="text-xs text-teal-600 dark:text-teal-400">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {images.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`Preview ${idx}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-slate-800 dark:bg-slate-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {showLocationInput && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <MapPin size={16} className="text-teal-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="장소를 입력하세요"
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
              <button
                onClick={() => setShowLocationInput(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition-colors"
                title="사진 추가"
              >
                <Image size={20} />
              </button>
              <button
                onClick={() => setShowLocationInput(!showLocationInput)}
                className={`p-2 rounded-lg transition-colors ${
                  showLocationInput || location
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10'
                    : 'text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10'
                }`}
                title="장소 태그"
              >
                <MapPin size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() && images.length === 0}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              게시하기
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedCreateForm;
