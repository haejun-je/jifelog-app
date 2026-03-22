import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Bookmark, Calendar, HardDrive, Layout, Sparkles } from 'lucide-react';

const flowSteps = [
  {
    label: 'Capture',
    title: '보이는 순간을 바로 남기고',
    description: '사진, 글, 링크를 놓치지 않게 가볍게 쌓습니다.',
  },
  {
    label: 'Organize',
    title: '흩어진 정보를 흐름으로 묶고',
    description: '저장한 정보와 일정, 파일이 서로 이어지도록 정리합니다.',
  },
  {
    label: 'Reflect',
    title: '하루의 맥락을 다시 읽습니다',
    description: 'AI가 핵심 장면을 요약하고 다음 행동을 제안합니다.',
  },
];

const scenarioGroups = [
  {
    title: '흩어진 하루를 한 곳에 모읍니다',
    description: '피드와 드라이브가 연결되어 기록과 보관이 분리되지 않습니다.',
    image: '/feed_mockup.png',
    accent: 'from-teal-300/30 via-cyan-300/8 to-transparent',
    points: [
      {
        title: '기록은 더 감각적으로',
        description: '사진과 글이 섞여도 무드가 흐트러지지 않는 개인 피드',
        icon: <Layout className="h-4 w-4" />,
      },
      {
        title: '파일은 더 안정적으로',
        description: '필요한 파일과 이미지가 같은 흐름 안에서 다시 쓰이는 저장 구조',
        icon: <HardDrive className="h-4 w-4" />,
      },
    ],
    cta: '피드 보기',
    key: 'feed',
  },
  {
    title: '저장한 정보가 다시 쓰이게 만듭니다',
    description: '북마크는 쌓이기만 하는 목록이 아니라, 나중에 다시 꺼내는 개인 지식 베이스가 됩니다.',
    image: '/bookmark_mockup.png',
    accent: 'from-amber-300/28 via-orange-300/10 to-transparent',
    points: [
      {
        title: '링크를 깔끔하게 보관',
        description: 'URL 하나로 콘텐츠를 정리해 두고 맥락까지 유지',
        icon: <Bookmark className="h-4 w-4" />,
      },
      {
        title: '검색보다 회수에 초점',
        description: '다시 볼 자료가 남는 구조로 읽는 시간을 자산화',
        icon: <Sparkles className="h-4 w-4" />,
      },
    ],
    cta: '북마크 보기',
    key: 'bookmark',
  },
  {
    title: '일정과 기록이 끊기지 않게 이어집니다',
    description: '캘린더는 약속만 적는 곳이 아니라 그날의 기억과 파일을 함께 묶는 기준점이 됩니다.',
    image: '/schedule_mockup.png',
    accent: 'from-violet-300/30 via-fuchsia-300/10 to-transparent',
    points: [
      {
        title: '하루를 시간으로 정리',
        description: '계획과 실행이 따로 놀지 않도록 일정 축을 유지',
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        title: '중요한 장면을 다시 연결',
        description: '그날의 기록과 저장한 자료를 일정 맥락 안에서 재탐색',
        icon: <Layout className="h-4 w-4" />,
      },
    ],
    cta: '캘린더 보기',
    key: 'calendar',
  },
  {
    title: 'AI가 하루를 요약하고 다음 행동을 돕습니다',
    description: '정리된 데이터 위에서 작동하는 AI가 회고와 추천까지 연결해 줍니다.',
    image: '/ai_mockup.png',
    accent: 'from-rose-300/30 via-pink-300/10 to-transparent',
    points: [
      {
        title: '단순 대화가 아닌 회고',
        description: '오늘의 기록과 일정, 저장한 자료를 바탕으로 핵심만 정리',
        icon: <Bot className="h-4 w-4" />,
      },
      {
        title: '내일의 행동까지 연결',
        description: '다음에 할 일과 돌아봐야 할 포인트를 자연스럽게 제안',
        icon: <ArrowRight className="h-4 w-4" />,
      },
    ],
    cta: 'AI 경험하기',
    key: 'ai',
  },
];

interface FeatureShowcaseProps {
  onFeed: () => void;
  onCalendar: () => void;
  onBookmark: () => void;
  onSignup: () => void;
}

const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  onFeed,
  onCalendar,
  onBookmark,
  onSignup,
}) => {
  const handlers: Record<string, () => void> = {
    feed: onFeed,
    bookmark: onBookmark,
    calendar: onCalendar,
    ai: onSignup,
  };

  return (
    <div className="space-y-28 py-24 md:space-y-36 md:py-32">
      <section className="space-y-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-300">Daily flow</p>
          <h2 className="mt-4 max-w-[14ch] text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
            기록하고, 모으고, 다시 읽는 흐름
          </h2>
        </div>

        <div className="grid gap-6 border-t border-white/10 pt-8 md:grid-cols-3">
          {flowSteps.map((step, index) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="border-l border-white/10 pl-4"
            >
              <p className="text-xs uppercase tracking-[0.26em] text-slate-500">{step.label}</p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.04em] text-white">{step.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400 md:text-base">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-24">
        {scenarioGroups.map((group, index) => {
          const handler = handlers[group.key];

          return (
            <motion.article
              key={group.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className={`grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 ${
                index % 2 === 1 ? 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">Scenario {index + 1}</p>
                <h3 className="mt-4 max-w-[12ch] text-3xl font-black tracking-[-0.05em] text-white md:text-5xl">
                  {group.title}
                </h3>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">{group.description}</p>

                <div className="mt-8 space-y-5 border-t border-white/10 pt-6">
                  {group.points.map((point) => (
                    <div key={point.title} className="flex gap-4">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-teal-200">
                        {point.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{point.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-slate-400 md:text-base">{point.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handler}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-teal-200 transition-colors hover:text-white"
                >
                  {group.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-3 shadow-[0_24px_80px_rgba(2,6,23,0.4)]">
                  <div className={`absolute inset-0 bg-gradient-to-br ${group.accent}`} />
                  <div className="relative overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#0b1120]">
                    <img src={group.image} alt={group.title} className="w-full object-cover" />
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>
    </div>
  );
};

export default FeatureShowcase;
