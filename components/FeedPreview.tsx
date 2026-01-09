
import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Sun } from 'lucide-react';

const mockFeeds = [
  {
    id: '1',
    user: { name: '김민지', avatar: 'https://i.pravatar.cc/150?u=minji' },
    content: '오늘 처음으로 등산을 다녀왔어요! 정상에서 본 일출이 정말 아름다웠습니다. 힘들었지만 보람찬 하루였어요 🏔️',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=800&auto=format&fit=crop',
    timestamp: '2시간 전',
    likes: 24,
    comments: 5
  },
  {
    id: '2',
    user: { name: '박준호', avatar: 'https://i.pravatar.cc/150?u=junho' },
    content: '오후에는 커피 한 잔의 여유. 오늘의 할 일들을 정리하며 차분한 시간을 보냈습니다. #일상 #기록',
    timestamp: '5시간 전',
    likes: 12,
    comments: 2
  }
];

const FeedPreview: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col items-center mb-10 text-center relative">
        <h2 className="text-3xl font-black text-white mb-2">최신 피드</h2>
        <p className="text-gray-400 text-sm">다른 사람들의 일상을 둘러보세요</p>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-teal-400 border border-white/5">
          <Sun size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {mockFeeds.map((feed) => (
          <div key={feed.id} className="dark-card rounded-3xl overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={feed.user.avatar} className="w-10 h-10 rounded-full" alt="" />
                <div>
                  <div className="font-bold text-sm text-white">{feed.user.name}</div>
                  <div className="text-[10px] text-gray-500">{feed.timestamp}</div>
                </div>
              </div>
              <button className="text-gray-600">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {feed.image && (
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img src={feed.image} className="w-full h-full object-cover" alt="" />
              </div>
            )}

            <div className="p-4 pt-4 flex flex-col gap-4">
              <div className="flex items-center gap-5 text-gray-400">
                <button className="flex items-center gap-1.5 hover:text-red-400">
                  <Heart size={20} />
                  <span className="text-xs font-medium">{feed.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-teal-400">
                  <MessageCircle size={20} />
                  <span className="text-xs font-medium">{feed.comments}</span>
                </button>
                <button className="ml-auto hover:text-teal-400">
                  <Share2 size={20} />
                </button>
              </div>
              
              <div className="text-sm text-gray-200 leading-relaxed">
                <span className="font-bold mr-2 text-white">{feed.user.name}</span>
                {feed.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPreview;
