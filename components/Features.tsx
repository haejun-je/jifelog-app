
import React from 'react';
import { Image, Book, Calendar, Folder } from 'lucide-react';

const featureList = [
  {
    id: 'feed',
    title: '피드 기록',
    description: '사진과 글로 일상의 순간들을 아름답게 기록하고 공유하세요',
    icon: <Image className="w-7 h-7 text-white" />,
    gradient: 'from-[#2dd4bf] to-[#0d9488]'
  },
  {
    id: 'journal',
    title: '저널 & 회고',
    description: '하루, 주간, 월간 회고를 통해 삶에 의미를 부여하세요',
    icon: <Book className="w-7 h-7 text-white" />,
    gradient: 'from-[#34d399] to-[#059669]',
    recommended: true
  },
  {
    id: 'schedule',
    title: '일정 관리',
    description: '중요한 일정과 약속을 체계적으로 관리하세요',
    icon: <Calendar className="w-7 h-7 text-white" />,
    gradient: 'from-[#22d3ee] to-[#0891b2]'
  },
  {
    id: 'drive',
    title: '드라이브 저장',
    description: '모든 사진과 파일을 안전하게 클라우드에 자동 저장합니다',
    icon: <Folder className="w-7 h-7 text-white" />,
    gradient: 'from-[#10b981] to-[#047857]'
  }
];

const Features: React.FC = () => {
  return (
    <div className="text-center">
      <div className="inline-block px-4 py-1 bg-teal-900/40 text-teal-400 rounded-full text-xs font-bold mb-4 border border-teal-500/20">
        Core Features
      </div>
      <h2 className="text-3xl font-black text-white mb-4">주요 기능</h2>
      <p className="text-gray-400 text-sm mb-12">
        JifeLog와 함께 삶의 여정을 완성하세요<br />
        당신의 모든 순간을 하나의 공간에서
      </p>

      <div className="grid grid-cols-2 gap-4">
        {featureList.map((item) => (
          <div 
            key={item.id} 
            className={`relative p-6 rounded-[32px] bg-gradient-to-br ${item.gradient} flex flex-col items-center text-center gap-4 transition-transform hover:scale-[1.02] cursor-pointer`}
          >
            {item.recommended && (
              <div className="absolute top-4 right-4 bg-slate-900 text-[10px] font-bold text-white px-2 py-1 rounded-md">
                추천
              </div>
            )}
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-2">
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
              <p className="text-white/80 text-[11px] leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
