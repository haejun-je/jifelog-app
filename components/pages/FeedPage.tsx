
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, X } from 'lucide-react';
import type { Feed, Schedule, DriveFile } from '@/types';
import FeedCreateForm from '@/components/feed/FeedCreateForm';
import FeedItem from '@/components/feed/FeedItem';
import UniversalHeader from '@/components/layout/UniversalHeader';
import FeedSideMenu from '@/components/feed/FeedSideMenu';

interface FeedPageProps {
  currentUserId?: string;
}

const mockSchedules: Schedule[] = [
  { id: '1', title: '팀 미팅', date: '2026-02-18', time: '14:00', dDay: 1 },
  { id: '2', title: '프로젝트 마감', date: '2026-02-20', time: '18:00', dDay: 3 },
  { id: '3', title: '고객 미팅', date: '2026-02-21', time: '10:00', dDay: 4 },
];

const mockDriveFiles: DriveFile[] = [
  { id: '1', name: '프로젝트 기획서.pdf', extension: 'pdf', updatedAt: '2026-02-17T10:30:00' },
  { id: '2', name: '디자인 시안.fig', extension: 'fig', updatedAt: '2026-02-16T15:20:00' },
  { id: '3', name: '회의록.docx', extension: 'docx', updatedAt: '2026-02-15T09:00:00' },
  { id: '4', name: '예산안.xlsx', extension: 'xlsx', updatedAt: '2026-02-14T14:45:00' },
];

const getExtensionIcon = (ext: string): string => {
  const icons: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📊',
    pptx: '📊',
    fig: '🎨',
    png: '🖼️',
    jpg: '🖼️',
    jpeg: '🖼️',
    mp4: '🎬',
    mp3: '🎵',
  };
  return icons[ext.toLowerCase()] || '📎';
};

const FeedPage: React.FC<FeedPageProps> = ({ currentUserId = 'user1' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const menuHistoryRef = React.useRef(false);

  React.useEffect(() => {
    const handlePopState = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
        menuHistoryRef.current = false;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isMenuOpen]);

  const openMenu = () => {
    setIsMenuOpen(true);
    if (!menuHistoryRef.current) {
      window.history.pushState({ menuOpen: true }, '');
      menuHistoryRef.current = true;
    }
  };

  const closeMenu = () => {
    if (menuHistoryRef.current) {
      window.history.back();
    } else {
      setIsMenuOpen(false);
    }
  };

  const [feeds, setFeeds] = useState<Feed[]>([
    {
      id: '1',
      authorId: 'user1',
      author: {
        id: 'user1',
        name: '홍길동',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
      },
      content: '오늘 정말 좋은 날이었어요! 🌟 #daily #happy',
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800'],
      hashtags: ['daily', 'happy'],
      location: '서울 강남구',
      createdAt: '2026-02-17T09:00:00',
      updatedAt: '2026-02-17T09:00:00',
      likes: 12,
      isLiked: false,
      isBookmarked: false,
      comments: [
        {
          id: 'c1',
          feedId: '1',
          authorId: 'user2',
          author: {
            id: 'user2',
            name: '김철수',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
          },
          content: '정말 멋진 사진이네요! 😊',
          createdAt: '2026-02-17T10:00:00',
          likes: 3,
          isLiked: false,
          replies: [
            {
              id: 'r1',
              commentId: 'c1',
              authorId: 'user1',
              author: {
                id: 'user1',
                name: '홍길동',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
              },
              content: '감사합니다! 😄',
              createdAt: '2026-02-17T10:30:00',
              likes: 1,
              isLiked: false,
            },
          ],
        },
      ],
    },
    {
      id: '2',
      authorId: 'user2',
      author: {
        id: 'user2',
        name: '김철수',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
      },
      content: '새로운 프로젝트 시작! 열심히 해야겠어요 💪 #work #motivation',
      images: [],
      hashtags: ['work', 'motivation'],
      createdAt: '2026-02-16T14:00:00',
      updatedAt: '2026-02-16T14:00:00',
      likes: 8,
      isLiked: true,
      isBookmarked: true,
      comments: [],
    },
  ]);

  const handleCreateFeed = (content: string, images: string[], location?: string) => {
    const newFeed: Feed = {
      id: Date.now().toString(),
      authorId: currentUserId,
      author: {
        id: currentUserId,
        name: '홍길동',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
      },
      content,
      images,
      hashtags: content.match(/#(\w+)/g)?.map(tag => tag.slice(1)) || [],
      location,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
    };
    setFeeds((prev) => [newFeed, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateFeed = (feedId: string, content: string, images: string[], location?: string) => {
    setFeeds(feeds.map(feed =>
      feed.id === feedId
        ? {
            ...feed,
            content,
            images,
            location,
            hashtags: content.match(/#(\w+)/g)?.map(tag => tag.slice(1)) || [],
            updatedAt: new Date().toISOString(),
          }
        : feed
    ));
  };

  const handleDeleteFeed = (feedId: string) => {
    setFeeds(feeds.filter(feed => feed.id !== feedId));
  };

  const handleToggleLike = (feedId: string) => {
    setFeeds(feeds.map(feed =>
      feed.id === feedId
        ? {
            ...feed,
            isLiked: !feed.isLiked,
            likes: feed.isLiked ? feed.likes - 1 : feed.likes + 1,
          }
        : feed
    ));
  };

  const handleToggleBookmark = (feedId: string) => {
    setFeeds(feeds.map(feed =>
      feed.id === feedId
        ? { ...feed, isBookmarked: !feed.isBookmarked }
        : feed
    ));
  };

  const handleAddComment = (feedId: string, content: string) => {
    setFeeds(feeds.map(feed =>
      feed.id === feedId
        ? {
            ...feed,
            comments: [
              ...feed.comments,
              {
                id: Date.now().toString(),
                feedId,
                authorId: currentUserId,
                author: {
                  id: currentUserId,
                  name: '홍길동',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
                },
                content,
                createdAt: new Date().toISOString(),
                likes: 0,
                isLiked: false,
                replies: [],
              },
            ],
          }
        : feed
    ));
  };

  const handleAddReply = (feedId: string, commentId: string, content: string) => {
    setFeeds(feeds.map(feed =>
      feed.id === feedId
        ? {
            ...feed,
            comments: feed.comments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: [
                      ...comment.replies,
                      {
                        id: Date.now().toString(),
                        commentId,
                        authorId: currentUserId,
                        author: {
                          id: currentUserId,
                          name: '홍길동',
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
                        },
                        content,
                        createdAt: new Date().toISOString(),
                        likes: 0,
                        isLiked: false,
                      },
                    ],
                  }
                : comment
            ),
          }
        : feed
    ));
  };

  const handleToggleCommentLike = (feedId: string, commentId: string) => {
    setFeeds(feeds.map(feed =>
      feed.id === feedId
        ? {
            ...feed,
            comments: feed.comments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    isLiked: !comment.isLiked,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                  }
                : comment
            ),
          }
        : feed
    ));
  };

  const handleToggleReplyLike = (feedId: string, commentId: string, replyId: string) => {
    setFeeds(feeds.map(feed =>
      feed.id === feedId
        ? {
            ...feed,
            comments: feed.comments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: comment.replies.map(reply =>
                      reply.id === replyId
                        ? {
                            ...reply,
                            isLiked: !reply.isLiked,
                            likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                          }
                        : reply
                    ),
                  }
                : comment
            ),
          }
        : feed
    ));
  };

  const handleDeleteComment = (feedId: string, commentId: string) => {
    setFeeds(feeds.map(feed =>
      feed.id === feedId
        ? { ...feed, comments: feed.comments.filter(c => c.id !== commentId) }
        : feed
    ));
  };

  const handleDeleteReply = (feedId: string, commentId: string, replyId: string) => {
    setFeeds(feeds.map(feed =>
      feed.id === feedId
        ? {
            ...feed,
            comments: feed.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, replies: comment.replies.filter(r => r.id !== replyId) }
                : comment
            ),
          }
        : feed
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col">
      <UniversalHeader 
        title="피드"
        onMenuClick={openMenu}
        showBack={false}
        rightAction={
          <button className="p-2 -mr-2 text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Send size={20} />
          </button>
        }
      />
      
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        <FeedSideMenu isOpen={isMenuOpen} onClose={closeMenu} />
        
        <main className="flex-1 overflow-y-auto w-full relative md:ml-64">
          <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
            {/* 대시보드 영역 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 space-y-4"
            >
              {/* 다가오는 일정 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-white/5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  다가오는 일정
                </h3>
                <div className="space-y-2">
                  {mockSchedules.slice(0, 3).map(schedule => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center">
                          <span className="text-lg">📅</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{schedule.title}</p>
                          <p className="text-xs text-slate-500 dark:text-gray-400">
                            {schedule.date} {schedule.time && `· ${schedule.time}`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        schedule.dDay === 0
                          ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                          : schedule.dDay === 1
                          ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
                          : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                      }`}>
                        D-{schedule.dDay}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 최근 드라이브 파일 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-white/5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  최근 드라이브 파일
                </h3>
                <div className="space-y-2">
                  {mockDriveFiles.slice(0, 4).map(file => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getExtensionIcon(file.extension)}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[180px]">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400">
                            {new Date(file.updatedAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 피드 작성 폼 */}
            <div className="space-y-4 mt-6">
              <AnimatePresence mode="popLayout">
                {feeds.map(feed => (
                  <FeedItem
                    key={feed.id}
                    feed={feed}
                    currentUserId={currentUserId}
                    onUpdate={handleUpdateFeed}
                    onDelete={handleDeleteFeed}
                    onToggleLike={handleToggleLike}
                    onToggleBookmark={handleToggleBookmark}
                    onAddComment={handleAddComment}
                    onAddReply={handleAddReply}
                    onToggleCommentLike={handleToggleCommentLike}
                    onToggleReplyLike={handleToggleReplyLike}
                    onDeleteComment={handleDeleteComment}
                    onDeleteReply={handleDeleteReply}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 120 }}
              className="relative w-full max-w-md md:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900">
                <div className="w-6" />
                <h2 className="text-lg font-black">새 피드 등록</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 -mr-2 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  aria-label="피드 작성 닫기"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pb-28">
                <FeedCreateForm
                  onSubmit={handleCreateFeed}
                  currentUserAvatar={feeds[0]?.author.avatar}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed right-6 bottom-24 z-30 w-14 h-14 bg-teal-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-teal-600 transition-colors"
      >
        <Plus size={28} />
      </motion.button>
    </div>
  );
};

export default FeedPage;
