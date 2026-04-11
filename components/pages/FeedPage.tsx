
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, X, Clock3, PenSquare, ChevronRight, MessageCircle, Heart, BookOpen } from 'lucide-react';
import type { Feed, Schedule } from '@/types';
import FeedCreateForm from '@/components/feed/FeedCreateForm';
import FeedItem from '@/components/feed/FeedItem';
import UniversalHeader from '@/components/layout/UniversalHeader';
import FeedSideMenu from '@/components/feed/FeedSideMenu';
import ScrollAwareFab from '@/components/common/ScrollAwareFab';

interface FeedPageProps {
  currentUserId?: string;
}

const mockSchedules: Schedule[] = [
  { id: '1', title: '팀 미팅', date: '2026-02-18', time: '14:00', dDay: 1 },
  { id: '2', title: '프로젝트 마감', date: '2026-02-20', time: '18:00', dDay: 3 },
  { id: '3', title: '고객 미팅', date: '2026-02-21', time: '10:00', dDay: 4 },
];

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

  const currentUser = feeds.find((feed) => feed.authorId === currentUserId)?.author ?? {
    id: currentUserId,
    name: '홍길동',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
  };
  const unreadMessagesCount = 3;

  const briefing = useMemo(() => {
    const myFeeds = feeds.filter((feed) => feed.authorId === currentUserId);
    const nextSchedule = [...mockSchedules].sort((a, b) => a.dDay - b.dDay)[0];
    const latestFeed = myFeeds[0];
    const todayLikes = myFeeds.reduce((sum, feed) => sum + feed.likes, 0);

    return {
      summary: `${currentUser.name}님, 아직 확인하지 않은 메시지 ${unreadMessagesCount}개가 있습니다.`,
      scheduleLabel: nextSchedule ? `${nextSchedule.title} · ${nextSchedule.time || '시간 미정'}` : '예정된 일정 없음',
      latest: latestFeed ? latestFeed.content.replace(/#(\w+)/g, '').trim() : '오늘의 기록을 남겨보세요.',
      utilityCards: [
        {
          label: '읽지 않은 메시지',
          value: `${unreadMessagesCount}개`,
          icon: MessageCircle,
        },
        {
          label: '오늘 받은 좋아요',
          value: `${todayLikes}개`,
          icon: Heart,
        },
      ],
    };
  }, [feeds, currentUserId, currentUser.name, unreadMessagesCount]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors flex flex-col">
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
      
      <div className="flex flex-1 overflow-hidden h-screen pt-16">
        <FeedSideMenu isOpen={isMenuOpen} onClose={closeMenu} />
        
        <main data-fab-scroll-container className="flex-1 overflow-y-auto w-full relative">
          <div className="max-w-3xl mx-auto px-4 md:px-5 py-5 md:py-6 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 space-y-5"
            >
              <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
                <div className="px-5 py-5 md:px-6 md:py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                        Daily Briefing
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                        {currentUser.name}님의 하루
                      </h2>
                    </div>
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="hidden sm:block w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                    />
                  </div>

                  <div className="mt-4">
                    <div className="rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40 p-4">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        <BookOpen size={13} />
                        최근 기록
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {briefing.latest}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 grid-cols-2">
                    {briefing.utilityCards.map((card) => {
                      const Icon = card.icon;
                      return (
                      <div key={card.label} className="rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40 px-4 py-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {card.label}
                          </div>
                          <Icon size={13} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                        </div>
                        <div className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                          {card.value}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="px-5 py-4 md:px-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                      Upcoming
                    </p>
                    <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                      다가오는 일정
                    </h3>
                  </div>
                  <button className="h-9 px-2.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="px-5 py-4 md:px-6 grid gap-2">
                  {mockSchedules.slice(0, 3).map(schedule => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 flex items-center justify-center flex-shrink-0">
                          <Clock3 size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{schedule.title}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            {schedule.date} {schedule.time && `· ${schedule.time}`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                        schedule.dDay === 0
                          ? 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400'
                          : schedule.dDay === 1
                          ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
                      }`}>
                        D-{schedule.dDay}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="px-5 py-4 md:px-6 flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                      Journal
                    </p>
                    <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                      오늘의 기록
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="h-9 px-3.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-1.5"
                  >
                    <PenSquare size={14} />
                    작성
                  </button>
                </div>
                <div className="px-5 py-4 md:px-6 text-sm text-slate-400 dark:text-slate-500">
                  내 기록을 시간순으로 확인
                </div>
              </section>
            </motion.div>

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

      <ScrollAwareFab
        onClick={() => setIsCreateModalOpen(true)}
        ariaLabel="피드 작성"
      >
        <Plus size={28} />
      </ScrollAwareFab>
    </div>
  );
};

export default FeedPage;
