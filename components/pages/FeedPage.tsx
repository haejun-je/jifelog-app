
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Plus,
  X,
  Heart,
  Bookmark,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronDown,
  Flame,
  BarChart2,
  ImagePlus,
  MapPin,
} from 'lucide-react';
import UniversalHeader from '@/components/layout/UniversalHeader';
import ScrollAwareFab from '@/components/common/ScrollAwareFab';

// ─── Types ────────────────────────────────────────────────────────────────────

type CardType = 'post' | 'schedule' | 'diary' | 'ai';
type FilterTab = 'all' | 'post' | 'schedule' | 'diary' | 'ai';
type DateRange = 'today' | 'week' | 'all';

interface PostData {
  content: string;
  images?: string[];
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface ScheduleData {
  title: string;
  startTime: string;
  endTime?: string;
  status: 'upcoming' | 'done';
  description?: string;
}

interface DiaryData {
  content: string;
  emotion?: string;
  emotionLabel?: string;
}

interface AIData {
  content: string;
}

interface ActivityItem {
  id: string;
  type: CardType;
  createdAt: string; // ISO
  post?: PostData;
  schedule?: ScheduleData;
  diary?: DiaryData;
  ai?: AIData;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TODAY = '2026-04-10';
const YESTERDAY = '2026-04-09';
const WEEK_AGO = '2026-04-07';

const initialItems: ActivityItem[] = [
  {
    id: '1',
    type: 'post',
    createdAt: `${TODAY}T08:30:00`,
    post: {
      content: '아침 일찍 일어나 산책을 했어요. 봄바람이 상쾌하네요 🌿 #morning #walk',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
      ],
      likes: 5,
      isLiked: false,
      isBookmarked: false,
    },
  },
  {
    id: '2',
    type: 'schedule',
    createdAt: `${TODAY}T10:00:00`,
    schedule: {
      title: '팀 위클리 미팅',
      startTime: '10:00',
      endTime: '11:00',
      status: 'done',
      description: '이번 주 스프린트 리뷰 및 다음 주 계획 논의',
    },
  },
  {
    id: '3',
    type: 'diary',
    createdAt: `${TODAY}T12:15:00`,
    diary: {
      content: '오늘 미팅이 생각보다 순조롭게 끝났다. 팀원들과 소통이 잘 되는 것 같아서 기분이 좋았다. 오후에는 집중해서 작업을 마무리해야지.',
      emotion: '😊',
      emotionLabel: '기분 좋음',
    },
  },
  {
    id: '4',
    type: 'schedule',
    createdAt: `${TODAY}T15:00:00`,
    schedule: {
      title: '디자인 피드백 세션',
      startTime: '15:00',
      endTime: '16:00',
      status: 'upcoming',
      description: '새 피드 화면 디자인 검토',
    },
  },
  {
    id: '5',
    type: 'ai',
    createdAt: `${YESTERDAY}T22:00:00`,
    ai: {
      content: '어제 하루 동안 일정 2개를 완료하고 기록 3개를 작성했어요. 꾸준한 기록 습관이 형성되고 있습니다. 내일도 이 흐름을 유지해보세요!',
    },
  },
  {
    id: '6',
    type: 'post',
    createdAt: `${YESTERDAY}T18:45:00`,
    post: {
      content: '저녁에 책 한 권을 다 읽었다. 오랜만에 느끼는 독서의 여운 📖 #reading #evening',
      likes: 12,
      isLiked: true,
      isBookmarked: true,
    },
  },
  {
    id: '7',
    type: 'diary',
    createdAt: `${YESTERDAY}T21:30:00`,
    diary: {
      content: '오늘은 생산적인 하루였다. 오전에 운동하고 오후엔 밀린 업무를 처리했다. 저녁엔 독서까지 — 완벽한 루틴이었어.',
      emotion: '🔥',
      emotionLabel: '의욕 넘침',
    },
  },
  {
    id: '8',
    type: 'schedule',
    createdAt: `${WEEK_AGO}T09:00:00`,
    schedule: {
      title: '월간 회고 미팅',
      startTime: '09:00',
      endTime: '10:30',
      status: 'done',
      description: '3월 회고 및 4월 목표 설정',
    },
  },
  {
    id: '9',
    type: 'post',
    createdAt: `${WEEK_AGO}T14:20:00`,
    post: {
      content: '새로운 프로젝트 킥오프! 설레는 시작 🚀 #project #kickoff',
      images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'],
      likes: 24,
      isLiked: false,
      isBookmarked: false,
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDateKey(isoString: string) {
  return isoString.slice(0, 10);
}

function formatDateTime(isoString: string) {
  const d = new Date(isoString);
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) + ' · ' +
    d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const TAB_LABELS: Record<FilterTab, string> = {
  all: '전체',
  post: '포스트',
  schedule: '일정',
  diary: '일기',
  ai: 'AI',
};

const DATE_RANGE_LABELS: Record<DateRange, string> = {
  today: '오늘',
  week: '이번 주',
  all: '전체',
};

// ─── Card Components ──────────────────────────────────────────────────────────

// ─── Image Carousel ───────────────────────────────────────────────────────────

const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, images.length - 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 40) next();
    else if (delta < -40) prev();
    touchStartX.current = null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const delta = mouseStartX.current - e.clientX;
    if (delta > 40) next();
    else if (delta < -40) prev();
    mouseStartX.current = null;
  };

  return (
    <div
      className="relative w-full h-52 overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {/* Slide strip */}
      <div
        className="flex h-full w-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="w-full h-full flex-shrink-0">
            <img src={src} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
          </div>
        ))}
      </div>

      {/* Counter badge */}
      {images.length > 1 && (
        <span className="absolute top-2.5 right-2.5 text-[11px] font-semibold bg-black/50 text-white px-2 py-0.5 rounded-full">
          {index + 1} / {images.length}
        </span>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Post Card ────────────────────────────────────────────────────────────────

interface PostCardProps {
  item: ActivityItem;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ item, onToggleLike, onToggleBookmark }) => {
  const post = item.post!;
  const images = post.images ?? [];
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden">
      {images.length > 0 && <ImageCarousel images={images} />}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
            Post
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{formatDateTime(item.createdAt)}</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{post.content}</p>
        <div className="mt-3 flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <button
            onClick={() => onToggleLike(item.id)}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              post.isLiked
                ? 'text-rose-500 dark:text-rose-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400'
            }`}
          >
            <Heart size={16} className={post.isLiked ? 'fill-current' : ''} />
            <span>{post.likes}</span>
          </button>
          <button
            onClick={() => onToggleBookmark(item.id)}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              post.isBookmarked
                ? 'text-teal-500 dark:text-teal-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-teal-500 dark:hover:text-teal-400'
            }`}
          >
            <Bookmark size={16} className={post.isBookmarked ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ScheduleCard: React.FC<{ item: ActivityItem }> = ({ item }) => {
  const s = item.schedule!;
  const isDone = s.status === 'done';
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400">
          일정
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">{formatDateTime(item.createdAt)}</span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isDone
              ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400'
          }`}>
            {isDone ? <CheckCircle2 size={16} /> : <Clock size={16} />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.title}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {s.startTime}{s.endTime ? ` ~ ${s.endTime}` : ''}
            </p>
            {s.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{s.description}</p>
            )}
          </div>
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg ${
          isDone
            ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : 'bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400'
        }`}>
          {isDone ? '완료' : '예정'}
        </span>
      </div>
    </div>
  );
};

const DiaryCard: React.FC<{ item: ActivityItem }> = ({ item }) => {
  const d = item.diary!;
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
          일기
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">{formatDateTime(item.createdAt)}</span>
        {d.emotion && (
          <span className="ml-auto text-base" title={d.emotionLabel}>{d.emotion}</span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-3">{d.content}</p>
      {d.emotionLabel && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{d.emotionLabel}</p>
      )}
    </div>
  );
};

const AICard: React.FC<{ item: ActivityItem }> = ({ item }) => {
  const ai = item.ai!;
  return (
    <div className="rounded-2xl border border-teal-200 dark:border-teal-500/30 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-500/10 dark:to-cyan-500/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300">
          AI 인사이트
        </span>
        <span className="text-xs text-teal-500/70 dark:text-teal-400/60">{formatDateTime(item.createdAt)}</span>
      </div>
      <div className="flex items-start gap-3">
        <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-teal-500 dark:text-teal-400" />
        <p className="text-sm leading-relaxed text-teal-800 dark:text-teal-200">{ai.content}</p>
      </div>
    </div>
  );
};

// ─── FAB Bottom Sheet ─────────────────────────────────────────────────────────


// ─── Main Page ────────────────────────────────────────────────────────────────

const FeedPage: React.FC = () => {
  const [items, setItems] = useState<ActivityItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    const files: File[] = Array.from(fileList);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setDraftImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setDraftContent('');
    setDraftImages([]);
  };
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // ── filter ──────────────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab !== 'all' && item.type !== activeTab) return false;
      const dateKey = getDateKey(item.createdAt);
      if (dateRange === 'today' && dateKey !== TODAY) return false;
      if (dateRange === 'week' && dateKey < WEEK_AGO) return false;
      return true;
    });
  }, [items, activeTab, dateRange]);


  // ── summary stats ────────────────────────────────────────────────────────────
  const todayItems = items.filter((i) => getDateKey(i.createdAt) === TODAY);
  const todaySchedules = todayItems.filter((i) => i.type === 'schedule').length;
  const todayRecords = todayItems.filter((i) => i.type !== 'schedule').length;

  const weekItems = items.filter((i) => getDateKey(i.createdAt) >= WEEK_AGO);
  const weekRecords = weekItems.filter((i) => i.type !== 'schedule').length;
  const streak = 3; // mock

  // ── actions ──────────────────────────────────────────────────────────────────
  const handleToggleLike = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.post
          ? {
              ...item,
              post: {
                ...item.post,
                isLiked: !item.post.isLiked,
                likes: item.post.isLiked ? item.post.likes - 1 : item.post.likes + 1,
              },
            }
          : item
      )
    );
  };

  const handleToggleBookmark = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.post
          ? { ...item, post: { ...item.post, isBookmarked: !item.post.isBookmarked } }
          : item
      )
    );
  };

  const tabs: FilterTab[] = ['all', 'post', 'schedule', 'diary', 'ai'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors flex flex-col">
      <UniversalHeader
        title="오늘"
        showBack={false}
        rightAction={
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        }
      />

      <main data-fab-scroll-container className="flex-1 overflow-y-auto no-scrollbar pt-16">
        <div className="max-w-2xl mx-auto px-4 py-5 pb-28 space-y-5">

          {/* ── Summary Section ── */}
          <section className="grid grid-cols-1 gap-3">
            {/* Today + Weekly row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Today Card */}
              <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                  <Calendar size={13} />
                  오늘
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-slate-900 dark:text-white">{todaySchedules}개</span>
                    <span className="text-[13px] text-slate-400 dark:text-slate-500">일정</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-slate-900 dark:text-white">{todayRecords}개</span>
                    <span className="text-[13px] text-slate-400 dark:text-slate-500">기록</span>
                  </div>
                </div>
                <p className="mt-auto pt-3 text-xs text-teal-600 dark:text-teal-400 font-medium">꾸준히 기록 중 👍</p>
              </div>

              {/* Weekly Card */}
              <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                  <BarChart2 size={13} />
                  이번 주
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-slate-900 dark:text-white">{weekRecords}개</span>
                    <span className="text-[13px] text-slate-400 dark:text-slate-500">기록</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-orange-500 dark:text-orange-400">{streak}일</span>
                    <span className="text-[13px] text-slate-400 dark:text-slate-500">연속</span>
                  </div>
                </div>
                <p className="mt-auto pt-3 text-xs text-orange-500 dark:text-orange-400 font-medium">{streak}일 연속 기록 중 🔥</p>
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="rounded-2xl border border-teal-200 dark:border-teal-500/30 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-500/10 dark:to-cyan-500/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">AI 요약</span>
              </div>
              <p className="text-sm leading-relaxed text-teal-800 dark:text-teal-200">
                이번 주는 생산적인 한 주였습니다. 기록이 꾸준히 유지되고 있으며, 일정 완료율도 높아지고 있어요.
              </p>
            </div>
          </section>

          {/* ── Filter Tabs + Date Range ── */}
          <section className="space-y-3">
            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === tab
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {/* Date Range Dropdown */}
            {/*<div className="relative inline-block">
              <button
                onClick={() => setIsDateDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-teal-400 transition-colors"
              >
                {DATE_RANGE_LABELS[dateRange]}
                <ChevronDown size={12} className={`transition-transform ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isDateDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute left-0 top-full mt-1.5 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl shadow-lg overflow-hidden min-w-[100px]"
                  >
                    {(['today', 'week', 'all'] as DateRange[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => { setDateRange(r); setIsDateDropdownOpen(false); }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                          dateRange === r
                            ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        {DATE_RANGE_LABELS[r]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>*/}
          </section>

          {/* ── Feed List ── */}
          <section className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm">
                해당 조건의 기록이 없습니다.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                  >
                    {item.type === 'post' && (
                      <PostCard
                        item={item}
                        onToggleLike={handleToggleLike}
                        onToggleBookmark={handleToggleBookmark}
                      />
                    )}
                    {item.type === 'schedule' && <ScheduleCard item={item} />}
                    {item.type === 'diary' && <DiaryCard item={item} />}
                    {item.type === 'ai' && <AICard item={item} />}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </section>
        </div>
      </main>

      <ScrollAwareFab onClick={() => setIsCreateOpen(true)} ariaLabel="피드 작성">
        <Plus size={26} />
      </ScrollAwareFab>

      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 120 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">새 피드 작성</h2>
                <button
                  onClick={handleCloseCreate}
                  className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 pt-4 pb-2 space-y-3">
                <textarea
                  autoFocus
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="오늘 어떤 일이 있었나요?"
                  className="w-full h-36 resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />

                {/* Image previews */}
                {draftImages.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {draftImages.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setDraftImages((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer: actions + buttons */}
              <div className="px-5 pb-8 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                {/* Left: attach icons */}
                <div className="flex items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="사진 첨부"
                  >
                    <ImagePlus size={20} />
                  </button>
                  <button
                    className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="장소 추가"
                  >
                    <MapPin size={20} />
                  </button>
                </div>

                {/* Right: cancel + submit */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCloseCreate}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    disabled={!draftContent.trim()}
                    onClick={() => {
                      if (!draftContent.trim()) return;
                      const newItem: ActivityItem = {
                        id: Date.now().toString(),
                        type: 'post',
                        createdAt: new Date().toISOString(),
                        post: {
                          content: draftContent.trim(),
                          images: draftImages.length > 0 ? [...draftImages] : undefined,
                          likes: 0,
                          isLiked: false,
                          isBookmarked: false,
                        },
                      };
                      setItems((prev) => [newItem, ...prev]);
                      handleCloseCreate();
                    }}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    등록
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedPage;
