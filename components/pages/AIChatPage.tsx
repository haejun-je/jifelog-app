import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  SendHorizonal,
  Loader2,
  Plus,
  MessageSquare,
  Lightbulb,
  FileText,
  Code2,
  PenSquare,
} from 'lucide-react';
import UniversalHeader from '../layout/UniversalHeader';
import ResponsiveSidebar from '../sidebars/ResponsiveSidebar';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  chatId: string;
  sender: 'user' | 'ai';
  content: string;
  createdAt: string;
}

interface ChatRoom {
  id: string;
  title: string;
  preview: string;
  lastMessageAt: string;
  messageCount: number;
  messages: Message[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CHATS: ChatRoom[] = [
  {
    id: 'chat-1',
    title: 'React 상태관리 패턴',
    preview: 'Zustand와 Jotai의 차이점을 정리해드릴게요.',
    lastMessageAt: '2026-04-12T14:23:00',
    messageCount: 8,
    messages: [
      {
        id: 'msg-1-1',
        chatId: 'chat-1',
        sender: 'user',
        content: 'React에서 전역 상태관리 어떤 걸 쓰는 게 좋아?',
        createdAt: '2026-04-12T14:20:00',
      },
      {
        id: 'msg-1-2',
        chatId: 'chat-1',
        sender: 'ai',
        content:
          '프로젝트 규모와 팀 구성에 따라 다르지만, 가벼운 프로젝트라면 Zustand를, 복잡한 파생 상태가 많다면 Jotai를 추천드려요.\n\n주요 차이점:\n• Zustand: 스토어 중심, 직관적 API, 러닝커브 낮음\n• Jotai: 아톰 기반, 세밀한 리렌더 최적화 가능\n• Recoil: Facebook 개발이지만 유지보수 불투명',
        createdAt: '2026-04-12T14:20:45',
      },
      {
        id: 'msg-1-3',
        chatId: 'chat-1',
        sender: 'user',
        content: 'Zustand 기본 사용법 알려줘',
        createdAt: '2026-04-12T14:22:00',
      },
      {
        id: 'msg-1-4',
        chatId: 'chat-1',
        sender: 'ai',
        content:
          'Zustand 기본 사용법은 다음과 같아요:\n\n1. 설치: npm install zustand\n2. 스토어 생성: create() 함수 사용\n3. 컴포넌트에서: useStore() 훅으로 구독\n\n매우 간단한 API 덕분에 보일러플레이트가 거의 없어요.',
        createdAt: '2026-04-12T14:23:00',
      },
    ],
  },
  {
    id: 'chat-2',
    title: '오늘 저녁 메뉴 추천',
    preview: '냉장고 재료 기반으로 3가지 메뉴를 추천해드릴게요.',
    lastMessageAt: '2026-04-12T09:11:00',
    messageCount: 4,
    messages: [
      {
        id: 'msg-2-1',
        chatId: 'chat-2',
        sender: 'user',
        content: '냉장고에 달걀, 두부, 대파, 간장이 있어. 뭐 해먹을 수 있을까?',
        createdAt: '2026-04-12T09:10:00',
      },
      {
        id: 'msg-2-2',
        chatId: 'chat-2',
        sender: 'ai',
        content:
          '있는 재료로 만들 수 있는 메뉴 3가지를 추천해드릴게요!\n\n1. 달걀 두부 조림 - 두부와 달걀을 간장 양념으로 조린 반찬\n2. 파달걀 볶음밥 - 대파와 달걀로 만드는 간단한 볶음밥\n3. 두부 된장국 - 두부와 대파로 끓이는 구수한 국\n\n가장 빠르게 만들 수 있는 건 볶음밥이에요!',
        createdAt: '2026-04-12T09:11:00',
      },
    ],
  },
  {
    id: 'chat-3',
    title: 'TypeScript 제네릭 정리',
    preview: '제네릭은 타입을 파라미터처럼 사용하는 기능이에요.',
    lastMessageAt: '2026-04-10T16:45:00',
    messageCount: 6,
    messages: [
      {
        id: 'msg-3-1',
        chatId: 'chat-3',
        sender: 'user',
        content: 'TypeScript 제네릭이 뭔지 쉽게 설명해줘',
        createdAt: '2026-04-10T16:40:00',
      },
      {
        id: 'msg-3-2',
        chatId: 'chat-3',
        sender: 'ai',
        content:
          '제네릭(Generic)은 타입을 마치 함수의 파라미터처럼 사용하는 기능이에요.\n\n쉽게 말하면, "어떤 타입이든 받을 수 있지만, 한 번 정하면 그 타입으로 고정"하는 방식이에요.\n\n예시: function identity<T>(arg: T): T { return arg; }\n\n이렇게 하면 string을 넣으면 string, number를 넣으면 number를 반환해요.',
        createdAt: '2026-04-10T16:45:00',
      },
    ],
  },
  {
    id: 'chat-4',
    title: '봄 여행지 추천해줘',
    preview: '국내 4월 여행지로는 경주, 담양, 남해를 추천드려요.',
    lastMessageAt: '2026-04-08T20:30:00',
    messageCount: 4,
    messages: [
      {
        id: 'msg-4-1',
        chatId: 'chat-4',
        sender: 'user',
        content: '4월에 가기 좋은 국내 봄 여행지 추천해줘',
        createdAt: '2026-04-08T20:28:00',
      },
      {
        id: 'msg-4-2',
        chatId: 'chat-4',
        sender: 'ai',
        content:
          '4월 국내 봄 여행지 TOP 3를 추천해드릴게요!\n\n🌸 경주 - 벚꽃과 역사 유적지의 조화, 보문호 벚꽃길\n🎋 담양 - 메타세쿼이아 가로수길, 죽녹원 대나무숲\n🌊 남해 - 독일마을, 다랭이마을의 봄 풍경\n\n특히 경주 벚꽃 시즌(4월 초~중순)은 놓치지 마세요!',
        createdAt: '2026-04-08T20:30:00',
      },
    ],
  },
  {
    id: 'chat-5',
    title: 'CSS Grid vs Flexbox',
    preview: '2차원 레이아웃은 Grid, 1차원은 Flexbox가 적합해요.',
    lastMessageAt: '2026-04-03T11:00:00',
    messageCount: 4,
    messages: [
      {
        id: 'msg-5-1',
        chatId: 'chat-5',
        sender: 'user',
        content: 'CSS Grid랑 Flexbox 언제 쓰는지 헷갈려',
        createdAt: '2026-04-03T10:58:00',
      },
      {
        id: 'msg-5-2',
        chatId: 'chat-5',
        sender: 'ai',
        content:
          '간단하게 구분하면 이렇게 생각하면 돼요!\n\n📐 Flexbox - 1차원 (행 또는 열 하나)\n• 네비게이션 메뉴, 버튼 그룹, 카드 한 줄 배치\n• 아이템 간격/정렬이 목적일 때\n\n🔲 Grid - 2차원 (행과 열 동시)\n• 전체 페이지 레이아웃, 갤러리, 대시보드\n• 행과 열을 동시에 제어해야 할 때\n\n둘을 함께 쓰는 게 가장 좋아요!',
        createdAt: '2026-04-03T11:00:00',
      },
    ],
  },
];

const MOCK_AI_RESPONSES = [
  '좋은 질문이에요! 제가 자세히 설명해드릴게요.\n\n먼저 개념부터 정리하면, 이 주제는 크게 세 가지 관점으로 나눌 수 있어요. 각각의 장단점을 고려해서 상황에 맞게 선택하시면 됩니다.',
  '네, 이해했어요! 아래와 같이 정리해드릴게요.\n\n• 첫 번째 포인트: 핵심 개념을 파악하는 것이 중요합니다\n• 두 번째 포인트: 실제 사례를 통해 확인해보세요\n• 세 번째 포인트: 꾸준한 연습이 실력 향상의 핵심이에요',
  '좋은 접근법이에요! 제가 단계별로 안내해드릴게요.\n\n1단계: 기본 개념 이해\n2단계: 간단한 예제 실습\n3단계: 실제 프로젝트에 적용\n\n궁금한 점이 있으면 언제든 물어보세요!',
  '흥미로운 주제네요. 제 생각을 말씀드리면, 이 문제는 여러 가지 방법으로 접근할 수 있어요. 상황과 목적에 따라 최적의 방법이 달라지니, 좀 더 구체적인 상황을 알려주시면 더 정확한 답변을 드릴 수 있어요.',
  '물론이죠! 핵심만 간단히 정리해드릴게요.\n\n가장 중요한 점은 기본기를 탄탄히 하는 것이에요. 기초가 튼튼하면 어떤 응용 문제도 해결할 수 있습니다. 추가로 궁금한 내용이 있으면 편하게 물어보세요!',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getDateGroup(dateStr: string): 'today' | 'thisWeek' | 'older' {
  const now = new Date();
  const date = new Date(dateStr);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

  if (date >= startOfToday) return 'today';
  if (date >= startOfWeek) return 'thisWeek';
  return 'older';
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── AIChatPage ───────────────────────────────────────────────────────────────

const AIChatPage: React.FC = () => {
  const [chats, setChats] = useState<ChatRoom[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelHistoryRef = useRef(false);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const messages = activeChat?.messages ?? [];

  // ── popstate handler ───────────────────────────────────────────────────────
  useEffect(() => {
    const handlePopState = () => {
      if (isPanelOpen) {
        setIsPanelOpen(false);
        panelHistoryRef.current = false;
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isPanelOpen]);

  // ── auto-scroll to bottom ──────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── textarea auto-resize ───────────────────────────────────────────────────
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [inputValue]);

  // ── panel open/close ───────────────────────────────────────────────────────
  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
    if (!panelHistoryRef.current) {
      window.history.pushState({ aiChatPanel: true }, '');
      panelHistoryRef.current = true;
    }
  }, []);

  const closePanel = useCallback(() => {
    if (panelHistoryRef.current) {
      window.history.back();
    } else {
      setIsPanelOpen(false);
    }
  }, []);

  // ── new chat ───────────────────────────────────────────────────────────────
  const handleNewChat = useCallback(() => {
    const newChat: ChatRoom = {
      id: `chat-${generateId()}`,
      title: '새 대화',
      preview: '',
      lastMessageAt: new Date().toISOString(),
      messageCount: 0,
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setIsPanelOpen(false);
    panelHistoryRef.current = false;
  }, []);

  // ── select chat ───────────────────────────────────────────────────────────
  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    setIsPanelOpen(false);
    panelHistoryRef.current = false;
  }, []);

  // ── send message ───────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;

    setInputValue('');
    setIsSending(true);

    let currentChatId = activeChatId;

    // Create new chat if none is active
    if (!currentChatId) {
      const newChat: ChatRoom = {
        id: `chat-${generateId()}`,
        title: trimmed.slice(0, 20),
        preview: '',
        lastMessageAt: new Date().toISOString(),
        messageCount: 0,
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      currentChatId = newChat.id;
    }

    const userMsg: Message = {
      id: `msg-${generateId()}`,
      chatId: currentChatId,
      sender: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) return chat;
        const updatedMessages = [...chat.messages, userMsg];
        return {
          ...chat,
          messages: updatedMessages,
          messageCount: updatedMessages.length,
          title: chat.messageCount === 0 ? trimmed.slice(0, 20) : chat.title,
          lastMessageAt: userMsg.createdAt,
          preview: trimmed.slice(0, 40),
        };
      })
    );

    setIsSending(false);
    setIsTyping(true);

    // Simulate AI response delay (1.2s ~ 2s)
    const delay = 1200 + Math.random() * 800;
    await new Promise((r) => setTimeout(r, delay));

    const aiResponse = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
    const aiMsg: Message = {
      id: `msg-${generateId()}`,
      chatId: currentChatId,
      sender: 'ai',
      content: aiResponse,
      createdAt: new Date().toISOString(),
    };

    setIsTyping(false);
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) return chat;
        const updatedMessages = [...chat.messages, aiMsg];
        return {
          ...chat,
          messages: updatedMessages,
          messageCount: updatedMessages.length,
          lastMessageAt: aiMsg.createdAt,
          preview: aiResponse.slice(0, 40),
        };
      })
    );
  }, [inputValue, isSending, activeChatId]);

  // ── keyboard handler ───────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // ── quick preset ──────────────────────────────────────────────────────────
  const handlePreset = useCallback((text: string) => {
    setInputValue(text);
    textareaRef.current?.focus();
  }, []);

  // ── date groups ───────────────────────────────────────────────────────────
  const todayChats = chats.filter((c) => getDateGroup(c.lastMessageAt) === 'today');
  const thisWeekChats = chats.filter((c) => getDateGroup(c.lastMessageAt) === 'thisWeek');
  const olderChats = chats.filter((c) => getDateGroup(c.lastMessageAt) === 'older');

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors">
      {/* Header */}
      <UniversalHeader
        title="AI 비서"
        showBack={false}
        onMenuClick={openPanel}
        rightAction={
          <button
            onClick={handleNewChat}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="새 대화"
          >
            <PenSquare size={20} />
          </button>
        }
      />

      {/* Chat History Panel */}
      <ResponsiveSidebar
        isOpen={isPanelOpen}
        onClose={closePanel}
        title="이전 대화"
      >
        <div className="space-y-5">
          {/* Today */}
          {todayChats.length > 0 && (
            <div>
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                오늘
              </p>
              <div className="space-y-1">
                {todayChats.map((chat) => (
                  <ChatHistoryItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onClick={() => handleSelectChat(chat.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* This week */}
          {thisWeekChats.length > 0 && (
            <div>
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                이번 주
              </p>
              <div className="space-y-1">
                {thisWeekChats.map((chat) => (
                  <ChatHistoryItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onClick={() => handleSelectChat(chat.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Older */}
          {olderChats.length > 0 && (
            <div>
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                이전
              </p>
              <div className="space-y-1">
                {olderChats.map((chat) => (
                  <ChatHistoryItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onClick={() => handleSelectChat(chat.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {chats.length === 0 && (
            <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-8">
              대화 내역이 없습니다
            </p>
          )}
        </div>
      </ResponsiveSidebar>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden h-screen pt-16">
        <main className="flex-1 overflow-y-auto pb-28 md:pb-4">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Welcome state */}
            {messages.length === 0 && !isTyping && (
              <ChatWelcome onPreset={handlePreset} />
            )}

            {/* Messages */}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <MessageBubble message={msg} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <AITypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input area */}
        <div className="fixed bottom-0 left-0 right-0 md:left-16 mb-16 md:mb-0 bg-slate-50/80 dark:bg-[#0f172a]/80 backdrop-blur-lg border-t border-slate-200 dark:border-white/5">
          <div className="max-w-3xl mx-auto px-2 py-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1 shadow-sm transition-colors focus-within:border-teal-400/60 dark:focus-within:border-teal-500/40">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="무엇이든 물어보세요..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none leading-relaxed"
                style={{ minHeight: '30px', maxHeight: '90px', paddingTop: '4px', paddingBottom: '4px' }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isSending}
                aria-label="전송"
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  inputValue.trim()
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <SendHorizonal size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ChatHistoryItem ──────────────────────────────────────────────────────────

interface ChatHistoryItemProps {
  chat: ChatRoom;
  isActive: boolean;
  onClick: () => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ chat, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left rounded-xl px-4 py-3 transition-colors group ${
      isActive
        ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <MessageSquare
          size={15}
          className={`flex-shrink-0 mt-0.5 ${
            isActive ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500'
          }`}
        />
        <span className="text-sm font-medium truncate">{chat.title}</span>
      </div>
      <span className="flex-shrink-0 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
        {formatRelativeTime(chat.lastMessageAt)}
      </span>
    </div>
    {chat.preview && (
      <p className="mt-1 ml-[23px] text-xs text-slate-400 dark:text-slate-500 truncate">
        {chat.preview}
      </p>
    )}
  </button>
);

// ─── MessageBubble ────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.sender === 'ai';

  if (isAI) {
    return (
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-teal-500/10 dark:bg-teal-500/15 flex items-center justify-center text-teal-600 dark:text-teal-400 mt-0.5">
          <Bot size={16} />
        </div>
        <div className="max-w-[85%] md:max-w-[70%]">
          <div className="rounded-2xl rounded-tl-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <p className="mt-1 ml-1 text-[10px] text-slate-400 dark:text-slate-500">
            {formatTimestamp(message.createdAt)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] md:max-w-[70%]">
        <div className="rounded-2xl rounded-tr-md bg-teal-500 px-4 py-3 shadow-sm">
          <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <p className="mt-1 mr-1 text-right text-[10px] text-slate-400 dark:text-slate-500">
          {formatTimestamp(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

// ─── AITypingIndicator ────────────────────────────────────────────────────────

const AITypingIndicator: React.FC = () => (
  <div className="flex items-start gap-2.5">
    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-teal-500/10 dark:bg-teal-500/15 flex items-center justify-center text-teal-600 dark:text-teal-400 mt-0.5">
      <Bot size={16} />
    </div>
    <div className="rounded-2xl rounded-tl-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 px-4 py-3.5 shadow-sm">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400 dark:bg-teal-500 animate-bounce"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: '800ms' }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ─── ChatWelcome ──────────────────────────────────────────────────────────────

interface ChatWelcomeProps {
  onPreset: (text: string) => void;
}

const PRESETS = [
  { label: '아이디어 브레인스토밍', icon: <Lightbulb size={15} />, prompt: '새로운 아이디어를 브레인스토밍하는 것을 도와줘.' },
  { label: '글 요약하기', icon: <FileText size={15} />, prompt: '긴 글을 간결하게 요약하는 것을 도와줘.' },
  { label: '코드 리뷰', icon: <Code2 size={15} />, prompt: '코드를 리뷰하고 개선점을 알려줘.' },
];

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ onPreset }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
  >
    {/* Icon */}
    <div className="w-16 h-16 rounded-2xl bg-teal-500/10 dark:bg-teal-500/15 flex items-center justify-center text-teal-500 mb-5">
      <Bot size={32} />
    </div>

    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1.5">무엇이든 물어보세요</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
      AI 비서가 질문에 답하고, 아이디어를 제안하고, 작업을 도와드려요.
    </p>

    {/* Preset buttons */}
    <div className="flex flex-wrap justify-center gap-2">
      {PRESETS.map((preset) => (
        <button
          key={preset.label}
          onClick={() => onPreset(preset.prompt)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:border-teal-400/60 hover:text-teal-600 dark:hover:text-teal-400 dark:hover:border-teal-500/40 transition-colors shadow-sm"
        >
          <span className="text-teal-500">{preset.icon}</span>
          {preset.label}
        </button>
      ))}
    </div>
  </motion.div>
);

export default AIChatPage;
