// 일기 초안 생성 (LLM 호출 래퍼)
// 현재는 백엔드 LLM 엔드포인트가 없으므로 클라이언트에서 답변을 합성해 초안을 생성한다.
// 추후 실제 LLM API가 연결되면 이 함수만 교체하면 된다.

export interface DiaryDraftAnswers {
  q1Events: string;        // 오늘 하루 사건들 (시간 순)
  q2Memorable: string;     // 가장 기억에 남은 순간 + 감정
  q3Condition: string;      // 컨디션과 영향
  q4Achievement: string;    // 잘한 점
  q4Regret: string;         // 아쉬운 점
  q5Closing: string;        // 한 줄 요약 / 내일의 나에게
}

export interface DiaryDraftResult {
  content: string;
  achievement: string[];
  regret: string[];
}

function splitSentences(text: string): string[] {
  return text
    .split(/[\n.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * 5개 질문 답변을 일기 본문 + 회고 항목으로 합성한다.
 * 답변의 문맥을 최대한 보존하되, 일기 형식으로 자연스럽게 이어 붙인다.
 */
export function generateDiaryDraft(answers: DiaryDraftAnswers): DiaryDraftResult {
  const paragraphs: string[] = [];

  // 1. 하루 사건 (뼈대)
  if (answers.q1Events.trim()) {
    paragraphs.push(answers.q1Events.trim());
  }

  // 2. 기억에 남은 순간 + 감정 (클라이맥스)
  if (answers.q2Memorable.trim()) {
    paragraphs.push(`가장 기억에 남는 순간은 ${answers.q2Memorable.trim()}`);
  }

  // 3. 컨디션과 영향 (맥락)
  if (answers.q3Condition.trim()) {
    paragraphs.push(answers.q3Condition.trim());
  }

  // 4. 회고 (잘한 점 / 아쉬운 점) — 본문에는 요약, 항목은 분리해 추출
  const achievementText = answers.q4Achievement.trim();
  const regretText = answers.q4Regret.trim();
  if (achievementText || regretText) {
    const reflectionParts: string[] = [];
    if (achievementText) reflectionParts.push(`잘한 점은 ${achievementText}`);
    if (regretText) reflectionParts.push(`아쉬운 점은 ${regretText}`);
    paragraphs.push(`스스로 돌아보면, ${reflectionParts.join(', ')}.`);
  }

  // 5. 클로징 멘트
  if (answers.q5Closing.trim()) {
    paragraphs.push(answers.q5Closing.trim());
  }

  const content = paragraphs.filter(Boolean).join('\n\n');

  // 회고 항목 추출: 각 입력값을 문장 단위로 분리
  const achievement = achievementText ? splitSentences(achievementText) : [];
  const regret = regretText ? splitSentences(regretText) : [];

  return {
    content,
    achievement,
    regret,
  };
}