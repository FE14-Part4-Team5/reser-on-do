# Reser On Do
![reserondo](https://github.com/user-attachments/assets/ad2061a4-6b6b-49a4-9933-8cb478ce96b7)

## ☀️ Reser On Do 서비스 소개

### 보고, 고르고, 예약하세요!  
**Reser On Do**는 전국 방방곡곡의 체험을 한눈에 보고,  
지도 위에서 쏙쏙 골라 직접 등록하고 예약할 수 있는 **체험 탐색 플랫폼**입니다.

---

### 지금 바로 Reser On Do에서  
**당신의 특별한 경험을 시작해보세요!**

테스트용 계정  
test@test.com  
test1234

---

## 서비스 둘러보기
### 로그인 / 회원가입 페이지
> 이 페이지는 회원 가입과 로그인을 진행해요. 
> 
> 유효성 검사 및 zustand를 통해 전역으로 액세스 토큰 및 상태를 관리해요.

![로그인](https://github.com/user-attachments/assets/fa7ada80-7469-4719-96c8-4912d1a79c77)

![회원가입](https://github.com/user-attachments/assets/174bf020-5f5f-45bf-a937-9cd61500628c)

---

### 메인 페이지
> 이 페이지는 사용자가 키워드를 입력하거나, 카테고리와 정렬 옵션을 사용해 원하는 체험을 탐색할 수 있어요.
>
> 인기 체험은 무한스크롤 방식으로 가로로 넘기며 더 많은 체험을 불러오고,
>
> 전체 체험 목록은 페이지네이션을 통해 페이지 단위로 나누어 보여줘요.

![메인](https://github.com/user-attachments/assets/202c65ef-550b-4127-b335-cdfa042021b0)

---

### 체험 상세 페이지
> 이 페이지는 체험에 대한 정보를 자세히 볼 수 있어요.
>
> 지도 SDK를 통해 체험 장소를 지도로 볼 수 있으며,
>
> 사용자는 예약 캘린더를 통해 체험을 예약할 수 있어요.

![상세](https://github.com/user-attachments/assets/1a55b2a8-eda6-4da1-9540-e028656349b4)

---

### 내정보 페이지
> 이 페이지에서 사용자가 닉네임, 비밀번호, 프로필 이미지를 변경할 수 있어요.
> 
> React Hook Form + Zod를 사용한 폼 상태 및 유효성 검사를 했어요.

![내정보](https://github.com/user-attachments/assets/2bc83ba4-10dc-43b2-b9d8-09b0d4538a92)

---

### 예약내역 페이지
> 이 페이지에서 사용자가 예약한 체험을 취소하거나,
>
> 체험을 완료하면 후기를 작성할 수 있어요.

![예약내역](https://github.com/user-attachments/assets/ffe8fb71-b7f5-4f59-9308-e50166c24eaf)

---

### 내 체험관리 페이지
> 이 페이지는 체험 등록, 체험 수정, 체험 상세 페이지로 이동할 수 있고,
> 
> 체험을 삭제할 수 있어요, 또 무한스크롤을 구현해서 스크롤을 내릴 때마다 체험 목록을 불러와요

![체험관리](https://github.com/user-attachments/assets/d9f96e23-3e5e-4e0e-8d73-5aad945707a2)

---

### 체험등록 페이지
> 이 페이지에서 사용자가 새로운 체험을 등록할 수 있어요.
> 
> React Hook Form + Zod를 사용한 폼 상태 및 유효성 검사를 했어요.
>
> 카카오 주소 SDK를 사용해서 주소 입력을 할 수 있어요

![체험등록](https://github.com/user-attachments/assets/17cc9838-6ca9-420c-9efd-56d4f0e4dabd)

### 체험수정 페이지
> 이 페이지는 체험등록 페이지와 동일한 UI와 기능을 제공하지만,
>
> 기존 체험 정보가 자동으로 입력 필드에 불러와지는 점이 달라요.

![체험수정](https://github.com/user-attachments/assets/8e06a1f4-8d03-4361-8017-5888f0a839ee)

---

### 예약현황 페이지
> 이 페이지는 캘린더에서 내 체험에 예약된 내역들을 모달로 승인하거나 거절할 수 있어요.

![예약현황](https://github.com/user-attachments/assets/20ed6e05-6ea0-443e-ac7d-052a4db43df8)

---



## 기술 스택
| 구분                     | 기술 | 참고 |
|--------------------------|------|------|
| **언어 및 프레임워크**        | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | [우리가 Next.js를 사용하지 않은 이유](https://github.com/FE14-Part4-Team5/global-nomad/wiki/%EC%9A%B0%EB%A6%AC%EA%B0%80-Next.js%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%A7%80-%EC%95%8A%EC%9D%80-%EC%9D%B4%EC%9C%A0) |
| **상태 관리 & 데이터 페칭** | ![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=flat-square&logo=react-query&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat-square&logo=react&logoColor=white) | [로딩은 Suspense에게, 에러는 ErrorBoundary에게](https://github.com/FE14-Part4-Team5/reser-on-do/wiki/%EB%A1%9C%EB%94%A9%EC%9D%80-Suspense%EC%97%90%EA%B2%8C,-%EC%97%90%EB%9F%AC%EB%8A%94-ErrorBoundary%EC%97%90%EA%B2%8C) |
| **폼 / 유효성 / 인증**     | ![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white) ![Zod](https://camo.githubusercontent.com/598caa75c5ce213fbbb0a74e56cfa76af5fa4a12c19638f3273311f7274c1bea/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5a6f642d3345363742313f7374796c653d666c61742d737175617265266c6f676f3d7a6f64266c6f676f436f6c6f723d7768697465) ![OAuth](https://img.shields.io/badge/OAuth-4285F4?style=flat-square&logo=oauth&logoColor=white) | [카카오 들어가기 어렵다](https://github.com/FE14-Part4-Team5/global-nomad/wiki/%EC%B9%B4%EC%B9%B4%EC%98%A4-%EB%93%A4%EC%96%B4%EA%B0%80%EA%B8%B0-%EC%96%B4%EB%A0%B5%EB%8B%A4) |
| **외부 SDK**              | ![Address Lookup](https://img.shields.io/badge/Address%20Lookup%20SDK-FF6600?style=flat-square) ![Map SDK](https://img.shields.io/badge/Map%20SDK-1E90FF?style=flat-square) |  |
| **배포 & 인프라**          | ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) |  |

## 프로젝트 아키텍쳐

![프로젝트 구조화](https://github.com/user-attachments/assets/60469d14-49a0-43ef-8d18-ebffc14ed91f)

## 프로젝트 타임라인
![프로젝트 타임라인](https://github.com/user-attachments/assets/fe5e0a2c-8738-40ef-a426-68a9696eb222)

## 팀원 소개
[🔗 wiki 팀원소개 바로가기](https://github.com/FE14-Part4-Team5/reser-on-do/wiki/%ED%8C%80%EC%9B%90%20%EC%86%8C%EA%B0%9C)
| <a href="https://github.com/jihoon135"><img src="https://github.com/jihoon135.png" width="100"></a> | <a href="https://github.com/ShiroUsagi25"><img src="https://github.com/ShiroUsagi25.png" width="100"></a> | <a href="https://github.com/BANGHoYeong"><img src="https://github.com/BANGHoYeong.png" width="100"></a> | <a href="https://github.com/Jiwon42"><img src="https://github.com/Jiwon42.png" width="100"></a> | <a href="https://github.com/kwonjin2"><img src="https://github.com/kwonjin2.png" width="100"></a> | <a href="https://github.com/ghdtnals"><img src="https://github.com/ghdtnals.png" width="100"></a> |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **[FE] [곽지훈](https://github.com/jihoon135)**                                                        | **[FE] [이윤승](https://github.com/ShiroUsagi25)**                                                        | **[FE] [방호영](https://github.com/BANGHoYeong)**                                                          | **[FE] [정지원](https://github.com/Jiwon42)**                                                    | **[FE] [최권진](https://github.com/kwonjin2)**                                                    | **[FE] [홍수민](https://github.com/ghdtnals)**                                                   |

## 팀 문화
#### 원활한 프로젝트 진행을 위해 다음과 같은 팀 문화를 함께 만들어가기로 했어요.
1. 의사결정은 합의제 우선, 필요시 다수결
<br> 중요한 결정은 우선 합의를 통해 진행하며, 의견이 통합되지 않을 경우 다수결을 따르기로 했어요.
2. 피드백은 근거 기반으로
<br> 단순한 인상보다는 이유가 명확한 피드백을 지향해요. ( 색이 별로예요 ❌ -> 색 조합이 너무 비슷해서 구분이 잘 안되는 것 같아요 ⭕️ )
3. 의견은 부드럽고 배려 있게
<br> 의견을 낼 때 상대방을 배려하며 따듯하게 말 하려고 노력해요. ( 이모지 과다사용을 지향해요 ☺️😄😊🙏👍🏻🙌🏻 )
4. 아이디어는 바로바로 공유!!
<br> 생각이 떠오르면 고민하지 말고 바로 말해요. ( 아끼면 똥! 💩 )


