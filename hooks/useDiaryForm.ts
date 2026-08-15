import { useState } from 'react';
import {
  DiaryFormState,
  EmotionKey,
  WeatherKey,
  formStateToCreateRequest,
} from '../types';
import {
  createDiary,
  createPhotoUploadUrl,
  uploadPhotoToMinio,
} from '../api/diary';
import { updateDiary as updateDiaryMock } from '../api/diaryMock';
import { ApiError } from '../api/auth';

/**
 * 업로드 진행 상태를 가진 이미지 항목.
 * - previewUrl: 미리보기(blob: 또는 data:) URL
 * - file: 업로드 대상 원본 File
 * - objectKey: 업로드 성공 시 받은 MinIO object key (없으면 일기 생성 페이로드에 포함되지 않음)
 * - status: 업로드 진행 상태
 * - error: 업로드 실패 메시지
 */
export interface UploadableImage {
  previewUrl: string;
  file: File;
  objectKey: string | null;
  status: 'uploading' | 'done' | 'error';
  error?: string;
}

interface UseDiaryFormOptions {
  initialValues?: Partial<DiaryFormState>;
  onCreateSuccess?: (id: string) => void;
  onUpdateSuccess?: (id: string) => void;
  /**
   * 'edit': 일기 수정 흐름. 사진 첨부 시 업로드를 시도하지 않고 미리보기만 추가한다.
   * 기본값('create'): 일기 작성 흐름. 첨부된 사진을 MinIO로 업로드하고 objectKey를 매핑한다.
   */
  mode?: 'create' | 'edit';
}

export function useDiaryForm({
  initialValues,
  onCreateSuccess,
  onUpdateSuccess,
  mode = 'create',
}: UseDiaryFormOptions = {}) {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(initialValues?.date ?? today);
  const [emotion, setEmotion] = useState<string | null>(initialValues?.emotion ?? null);
  const [weather, setWeather] = useState<string | null>(initialValues?.weather ?? null);
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [energy, setEnergy] = useState<number | null>(initialValues?.energy ?? 3);
  const [satisfaction, setSatisfaction] = useState<number | null>(initialValues?.satisfaction ?? 3);
  const [keywords, setKeywords] = useState<string[]>(initialValues?.keywords ?? []);
  const [achievement, setAchievement] = useState<string[]>(initialValues?.achievement ?? []);
  const [regret, setRegret] = useState<string[]>(initialValues?.regret ?? []);
  const [images, setImages] = useState<UploadableImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasUploadingImage = images.some((img) => img.status === 'uploading');

  const canSubmit =
    !isSubmitting &&
    !hasUploadingImage &&
    (!!emotion || !!weather || content.trim().length > 0 || energy !== null || satisfaction !== null || keywords.length > 0);

  function initForm(values: DiaryFormState) {
    setDate(values.date);
    setEmotion(values.emotion);
    setWeather(values.weather);
    setContent(values.content);
    setEnergy(values.energy);
    setSatisfaction(values.satisfaction);
    setKeywords(values.keywords);
    setAchievement(values.achievement);
    setRegret(values.regret);
    // 수정 흐름 진입 시: 외부에서 주어진 images URL들은 objectKey가 없는 미리보기로 취급.
    const existing = values.images ?? [];
    setImages(
      existing.map((url) => ({
        previewUrl: url,
        file: new File([], 'placeholder'),
        objectKey: null,
        status: 'done',
      })),
    );
  }

  /**
   * 업로드 대상 파일을 images에 추가한다.
   * mode='create'면 각 파일마다 사전서명 URL을 발급받아 MinIO로 업로드 후 objectKey를 매핑한다.
   * mode='edit'이면 미리보기(blob URL)만 추가하고 objectKey는 null로 남는다.
   */
  async function addImages(files: File[], entryDate: string): Promise<void> {
    if (files.length === 0) return;

    // 1) 즉시 blob URL 미리보기를 'uploading' 상태로 추가
    const placeholders: UploadableImage[] = files.map((file) => ({
      previewUrl: URL.createObjectURL(file),
      file,
      objectKey: null,
      status: mode === 'create' ? 'uploading' : 'done',
    }));
    setImages((prev) => [...prev, ...placeholders]);

    if (mode !== 'create') {
      // 수정 흐름: 업로드 없이 미리보기만 유지
      return;
    }

    // 2) 각 파일마다 사전서명 URL → MinIO 업로드
    await Promise.all(
      placeholders.map(async (placeholder) => {
        const { file } = placeholder;
        try {
          const presigned = await createPhotoUploadUrl({
            fileName: file.name,
            contentType: file.type || 'application/octet-stream',
            entryDate,
          });
          await uploadPhotoToMinio(presigned.uploadUrl, presigned.formData, file);
          // 성공: 해당 placeholder의 objectKey/status 갱신
          setImages((prev) =>
            prev.map((img) =>
              img.previewUrl === placeholder.previewUrl
                ? { ...img, objectKey: presigned.formData.key, status: 'done' }
                : img,
            ),
          );
        } catch (e: unknown) {
          const message =
            e instanceof ApiError ? e.message : (e as Error).message ?? '업로드에 실패했습니다.';
          setImages((prev) =>
            prev.map((img) =>
              img.previewUrl === placeholder.previewUrl
                ? { ...img, status: 'error', error: message }
                : img,
            ),
          );
        }
      }),
    );
  }

  function removeImage(index: number): void {
    setImages((prev) => {
      const target = prev[index];
      // blob: URL은 명시적으로 해제하여 메모리 누수 방지
      if (target?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleCreate() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const formState: DiaryFormState = {
        date,
        emotion: emotion as EmotionKey | null,
        weather: weather as WeatherKey | null,
        content,
        energy,
        satisfaction,
        keywords,
        achievement,
        regret,
        images: images.map((img) => img.previewUrl),
      };
      const request = formStateToCreateRequest(formState);
      // 업로드 완료된 이미지의 objectKey만 object_keys로 전달
      const objectKeys = images
        .map((img) => img.objectKey)
        .filter((key): key is string => typeof key === 'string' && key.length > 0);
      const response = await createDiary({ ...request, objectKeys });
      onCreateSuccess?.(response.id);
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        // 409: 같은 날짜에 이미 일기가 존재
        if (e.errorCode === 'EC_02_001') {
          setSubmitError('이미 작성된 일기가 존재합니다.');
        } else {
          setSubmitError(e.message);
        }
      } else {
        const err = e as Error;
        setSubmitError(err.message ?? '저장에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const formState: DiaryFormState = {
        date,
        emotion: emotion as EmotionKey | null,
        weather: weather as WeatherKey | null,
        content,
        energy,
        satisfaction,
        keywords,
        achievement,
        regret,
        images: images.map((img) => img.previewUrl),
      };
      await updateDiaryMock(id, {
        date: formState.date,
        emotion: formState.emotion,
        weather: formState.weather,
        content: formState.content,
        energy: formState.energy,
        satisfaction: formState.satisfaction,
        keywords: formState.keywords,
        achievement: formState.achievement,
        regret: formState.regret,
        images: formState.images,
      });
      onUpdateSuccess?.(id);
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        setSubmitError(e.message);
      } else {
        const err = e as Error;
        setSubmitError(err.message ?? '수정에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    date, setDate,
    emotion, setEmotion,
    weather, setWeather,
    content, setContent,
    energy, setEnergy,
    satisfaction, setSatisfaction,
    keywords, setKeywords,
    achievement, setAchievement,
    regret, setRegret,
    images,
    addImages,
    removeImage,
    isSubmitting,
    submitError,
    canSubmit,
    initForm,
    handleCreate,
    handleUpdate,
  };
}