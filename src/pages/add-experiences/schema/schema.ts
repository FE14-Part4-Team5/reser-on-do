import { z } from 'zod';

export const generalInfoSchema = z.object({
  title: z
    .string()
    .min(1, '* 제목을 입력해 주세요')
    .min(5, '* 제목은 5글자 이상 입력해 주세요')
    .max(20, '* 제목은 최대 20자까지 입력할 수 있습니다.'),
  category: z
    .enum(['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'])
    .optional()
    .refine(val => val !== undefined, { message: '* 카테고리를 선택해 주세요' }),
  description: z
    .string()
    .min(1, '* 설명을 입력해 주세요')
    .min(10, '* 설명은 10글자 이상 입력해 주세요'),
  price: z.preprocess(
    val => {
      if (typeof val === 'string') {
        const str = val.trim();
        if (str === '') {
          return undefined;
        }
        const cleaned = str.replace(/,/g, '').replace(/\D/g, '');
        if (cleaned === '') {
          return str;
        }
        return Number(cleaned);
      }
      return val;
    },
    z
      .number({
        invalid_type_error: '* 숫자만 입력해 주세요',
        required_error: '* 가격을 입력해 주세요',
      })
      .max(10000000, '* 가격은 1,000만원 이하로 입력해 주세요')
  ),
  address: z.string().min(1, '* 주소를 선택해 주세요'),
  schedules: z
    .array(
      z.object({
        date: z.string().min(1),
        startTime: z.string().min(1),
        endTime: z.string().min(1),
      })
    )
    .min(1, '* 최소 하나 이상의 스케줄을 등록해 주세요'),
  bannerImageUrl: z.preprocess(val => {
    if (Array.isArray(val)) {
      const first = val[0];
      if (typeof first === 'string') return first;
      return '';
    }
    return val;
  }, z.string().min(1, '* 배너 이미지 URL이 필요합니다').url({ message: '* 유효한 이미지 주소여야 합니다' })),

  subImageUrls: z
    .array(z.string().url({ message: '* 유효한 이미지 URL이어야 합니다' }))
    .max(4, '* 소개 이미지는 최대 4개까지만 등록 가능합니다'),
});

export type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;
