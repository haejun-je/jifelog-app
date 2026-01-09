
import React from 'react';

interface DrivePreviewProps {
  onSeeAll?: () => void;
}

const files = [
  { name: '제주도 여행.jpg', size: '2.4 MB', date: '2024.01.15', thumb: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=200&fit=crop' },
  { name: '2024 목표 계획서.pdf', size: '156 KB', date: '2024.01.10', type: 'doc', color: 'bg-red-500', char: 'D' },
  { name: '카페 브런치.jpg', size: '1.8 MB', date: '2024.01.12', thumb: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop' },
  { name: '독서 노트.docx', size: '89 KB', date: '2024.01.08', type: 'doc', color: 'bg-blue-500', char: 'W' },
  { name: '운동 기록.jpg', size: '3.1 MB', date: '2024.01.14', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop' },
  { name: '생일 파티.mp4', size: '45.2 MB', date: '2024.01.05', type: 'video', color: 'bg-purple-500', char: '▶' }
];

const DrivePreview: React.FC<DrivePreviewProps> = ({ onSeeAll }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">드라이브</h2>
          <p className="text-gray-400 text-sm">모든 파일을 안전하게 보관하세요</p>
        </div>
        <button 
          onClick={onSeeAll}
          className="bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-transform"
        >
          전체보기
        </button>
      </div>

      <div className="dark-card rounded-2xl p-5 mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-gray-300">저장 공간</span>
          <span className="text-xs font-bold"><span className="text-teal-400">2.8 GB</span> <span className="text-gray-500">/ 15 GB</span></span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full teal-gradient w-[18.6%] rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {files.map((file, i) => (
          <div key={i} className="dark-card rounded-2xl overflow-hidden group">
            <div className="aspect-square bg-slate-800 flex items-center justify-center relative">
              {file.thumb ? (
                <img src={file.thumb} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
              ) : (
                <div className={`w-10 h-10 rounded-lg ${file.color} flex items-center justify-center text-white font-bold text-xl`}>
                  {file.char}
                </div>
              )}
            </div>
            <div className="p-3 bg-slate-800/50">
              <div className="text-xs font-bold text-white truncate mb-1">{file.name}</div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>{file.size}</span>
                <span>{file.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrivePreview;
