import { z } from 'zod';

export const generalInfoSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해 주세요')
    .max(20, '제목은 최대 20자까지 입력할 수 있습니다.'),
  category: z.enum(['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'], {
    required_error: '카테고리를 선택해 주세요',
    invalid_type_error: '유효한 카테고리를 선택해 주세요',
  }),
  description: z.string().min(1, '설명을 입력해 주세요'),
  price: z.union([
    z.coerce
      .number({
        invalid_type_error: '숫자만 입력해 주세요',
        required_error: '가격을 입력해 주세요',
      })
      .max(10000000, '가격은 1,000만원 이하로 입력해 주세요'),
    z.undefined(),
  ]),
  address: z.string().min(1, '주소를 선택해 주세요'),
  schedules: z
    .array(
      z.object({
        date: z.string().min(1),
        startTime: z.string().min(1),
        endTime: z.string().min(1),
      })
    )
    .min(1, '* 최소 하나 이상의 스케줄을 등록해 주세요'),
  bannerImageUrl: z
    .string()
    .min(1, '배너 이미지 URL이 필요합니다')
    .url({ message: '유효한 이미지 주소여야 합니다' }),

  subImageUrls: z
    .instanceof(File)
    .array()
    .max(4, '* 소개 이미지는 최대 4개까지만 등록 가능합니다')
    .optional(),
});

export type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;
