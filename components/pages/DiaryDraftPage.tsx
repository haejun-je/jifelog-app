import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Check } from 'lucide-react';
import UniversalHeader from '../layout/UniversalHeader';
import { generateDiaryDraft, DiaryDraftAnswers, DiaryDraftResult } from '../../api/diaryDraft';

interface DiaryDraftPageProps {
  onBack: () => void;
  onDraftGenerated: (draft: DiaryDraftResult) => void;
}

interface SingleField {
  kind: 'single';
  id: keyof DiaryDraftAnswers;
  title: string;
  placeholder: string;
  helper: string;
}

interface MultiField {
  kind: 'multi';
  id: string;
  title: string;
  helper: string;
  fields: {
    id: keyof DiaryDraftAnswers;
    label: string;
    placeholder: string;
  }[];
}

type Question = SingleField | MultiField;

const QUESTIONS: Question[] = [
  {
    kind: 'single',
    id: 'q1Events',
    title: '오늘 하루를 시간 순서대로 떠올려보면, 어떤 일들이 있었나요?',
    placeholder:
      '아침엔 늦잠 자서 정신없이 출근, 점심에 팀원이랑 새로 생긴 파스타집 감, 오후엔 회의가 길어져서 야근, 퇴근길에 비가 와서 우산 없이 뛰어옴',
    helper: '하루의 뼈대가 되는 사건들을 자유롭게 나열해주세요.',
  },
  {
    kind: 'single',
    id: 'q2Memorable',
    title: '그 중에서 가장 기억에 남거나 마음이 움직인 순간은 언제였고, 그때 기분이 어땠나요?',
    placeholder:
      '회의에서 내 의견이 받아들여졌을 때 뿌듯했음. 근데 그 직후에 실수를 지적받아서 살짝 위축되기도 했음',
    helper: '사건과 감정, 감정의 변화까지 적어주면 일기의 감정선이 살아납니다.',
  },
  {
    kind: 'single',
    id: 'q3Condition',
    title: '오늘 하루를 지내면서 몸이나 마음의 컨디션은 어땠나요? 그게 하루에 어떤 영향을 줬나요?',
    placeholder:
      '잠을 4시간밖에 못 자서 오전 내내 멍했는데, 커피 마시고 오후엔 좀 살아남. 그래서 집중이 잘 안 돼서 일이 밀림',
    helper: '컨디션과 그로 인한 영향(원인-결과)까지 적어주면 맥락이 더해집니다.',
  },
  {
    kind: 'multi',
    id: 'q4Reflection',
    title: '오늘 있었던 일들 중, 스스로 잘했다고 느낀 점과 아쉬웠던 점을 각각 적어주세요.',
    helper: '잘한 점과 아쉬운 점을 분리해 적으면 더 정확한 회고가 됩니다.',
    fields: [
      {
        id: 'q4Achievement',
        label: '잘한 점',
        placeholder: '미루던 연락을 먼저 함',
      },
      {
        id: 'q4Regret',
        label: '아쉬운 점',
        placeholder: '운동을 또 걸렀고, 야식을 먹었음',
      },
    ],
  },
  {
    kind: 'single',
    id: 'q5Closing',
    title: '오늘을 한 문장으로 요약하거나, 내일의 나에게 하고 싶은 말이 있다면요?',
    placeholder:
      '오늘은 널뛰던 하루였지만 그래도 잘 버텼다 / 내일은 일찍 자자, 내일 회의는 더 잘 준비해가자',
    helper: '일기를 마무리하는 한 줄이 됩니다.',
  },
];

const DiaryDraftPage: React.FC<DiaryDraftPageProps> = ({ onBack, onDraftGenerated }) => {
  const [phase, setPhase] = useState<'questions' | 'review'>('questions');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiaryDraftAnswers>({
    q1Events: '',
    q2Memorable: '',
    q3Condition: '',
    q4Achievement: '',
    q4Regret: '',
    q5Closing: '',
  });
  const [draft, setDraft] = useState<DiaryDraftResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length - 1;

  const canProceed =
    currentQuestion.kind === 'single'
      ? answers[currentQuestion.id].trim().length > 0
      : currentQuestion.fields.every((f) => answers[f.id].trim().length > 0);

  const handleNext = () => {
    if (!canProceed) return;
    if (isLastStep) {
      handleGenerate();
      return;
    }
    setStep((prev) => prev + 1);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handlePrev = () => {
    if (phase === 'review') {
      setPhase('questions');
      setError(null);
      return;
    }
    if (step === 0) {
      onBack();
      return;
    }
    setStep((prev) => prev - 1);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // LLM 호출(현재는 클라이언트 합성 mock). 추후 비동기 API 교체 대비 await 유지.
      const result = await Promise.resolve(generateDiaryDraft(answers));
      setDraft(result);
      setPhase('review');
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message ?? '초안 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceed = () => {
    if (!draft) return;
    onDraftGenerated(draft);
  };

  const handleChange = (id: keyof DiaryDraftAnswers) => (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setAnswers((prev) => ({ ...prev, [id]: e.target.value }));
  };

  // --- 리뷰 단계: 초안 본문 인라인 편집 ---
  const updateDraftContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft((prev) => (prev ? { ...prev, content: e.target.value } : prev));
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors">
      <UniversalHeader title="일기 초안 작성" onBack={onBack} showBack={true} />

      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto pt-16 pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pb-32">
        <div className="mx-auto w-full max-w-2xl min-w-0 px-4 py-5 md:px-5 md:py-6">
          {phase === 'questions' && (
            <>
              {/* 진행 표시 */}
              <div className="mb-6 flex items-center gap-2">
                {QUESTIONS.map((q, i) => (
                  <div
                    key={q.id}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= step ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                <Sparkles size={14} />
                <span>
                  {step + 1} / {QUESTIONS.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-snug">
                    {currentQuestion.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {currentQuestion.helper}
                  </p>

                  {currentQuestion.kind === 'single' && (
                    <section className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden">
                      <textarea
                        ref={textareaRef}
                        value={answers[currentQuestion.id]}
                        onChange={handleChange(currentQuestion.id)}
                        placeholder={currentQuestion.placeholder}
                        maxLength={2000}
                        autoFocus
                        className="w-full min-h-[180px] bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none transition-colors"
                      />
                      <div className="px-4 pb-2 text-right text-[11px] text-slate-400 dark:text-slate-500">
                        {answers[currentQuestion.id].length}/2000
                      </div>
                    </section>
                  )}

                  {currentQuestion.kind === 'multi' && (
                    <div className="mt-5 space-y-4">
                      {currentQuestion.fields.map((field, idx) => (
                        <section
                          key={field.id}
                          className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden"
                        >
                          <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                                field.label === '잘한 점'
                                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                              {field.label}
                            </label>
                          </div>
                          <textarea
                            value={answers[field.id]}
                            onChange={handleChange(field.id)}
                            placeholder={field.placeholder}
                            maxLength={1000}
                            autoFocus={idx === 0}
                            className="w-full min-h-[120px] bg-transparent px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none transition-colors"
                          />
                          <div className="px-4 pb-2 text-right text-[11px] text-slate-400 dark:text-slate-500">
                            {answers[field.id].length}/1000
                          </div>
                        </section>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}

          {phase === 'review' && draft && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                <Check size={14} />
                <span>초안 리뷰</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-snug">
                생성된 초안을 확인하고 다듬어주세요
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                마음에 들지 않는 부분은 자유롭게 수정할 수 있어요. 수정을 마치면 일기 작성 페이지로
                넘어갑니다.
              </p>

              {/* 본문 편집 */}
              <section className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="px-4 pt-3 pb-1">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                    일기 본문
                  </label>
                </div>
                <textarea
                  value={draft.content}
                  onChange={updateDraftContent}
                  maxLength={2500}
                  className="w-full min-h-[260px] bg-transparent px-4 py-3 text-sm leading-relaxed text-slate-900 dark:text-white focus:outline-none resize-none transition-colors"
                />
                <div className="px-4 pb-2 text-right text-[11px] text-slate-400 dark:text-slate-500">
                  {draft.content.length}/2500
                </div>
              </section>
            </motion.div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
          )}
        </div>
      </main>

      {/* 하단 액션 바 */}
      <div className="fixed bottom-0 left-0 right-0 md:left-16 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-900/70 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={isGenerating}
            className="px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {phase === 'review' ? '질문으로' : '이전'}
          </button>
          {phase === 'questions' ? (
            <button
              onClick={handleNext}
              disabled={!canProceed || isGenerating}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-colors ${
                canProceed && !isGenerating
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  초안 작성 중...
                </>
              ) : isLastStep ? (
                <>
                  <Sparkles size={18} />
                  초안 작성
                </>
              ) : (
                <>
                  다음
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleProceed}
              disabled={isGenerating || !draft}
              className="flex flex-1 items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-teal-500 text-white hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              <Check size={18} />
              일기 작성으로 이동
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryDraftPage;