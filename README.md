# The Concierge Ho Tram — 여행 · 호텔 프로모션 웹사이트

Next.js(App Router) + TypeScript 기반의 여행/호텔 프로모션 웹사이트입니다. 이벤트·프로모션 안내, 호텔/차량 예약 요청, AI 여행 컨시어지 챗봇, 관리자 대시보드로 구성되어 있습니다.

> 디자인 콘텐츠(로고, 문구, 카카오톡 채널 ID 등)는 전부 **플레이스홀더**입니다. 실제 운영 전 `messages/*.json`, `prisma/seed.ts`, `.env` 값을 실제 정보로 교체해주세요.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router, TypeScript, Turbopack) |
| 스타일링 | Tailwind CSS v4 |
| 애니메이션 | Framer Motion |
| 다국어(i18n) | next-intl (한국어 기본 / 영어, 베트남어 등 추가 가능) |
| DB | PostgreSQL |
| ORM | Prisma 7 |
| DB/이미지 스토리지 | Supabase (Postgres + Storage) |
| 관리자 인증 | 환경변수 비교 + 서명된 JWT 세션 쿠키 (jose) |
| 알림 | 텔레그램 Bot API (grammY) |
| AI 상담 | Anthropic Claude API (`@anthropic-ai/sdk`, 스트리밍) |
| 배포 타겟 | Vercel |

## 폴더 구조 (핵심만)

```
src/proxy.ts                  # (구 middleware) 로케일 라우팅 + /admin 보호
prisma.config.ts              # Prisma CLI 설정 (마이그레이션/Studio 연결 정보, Prisma 7+)
prisma/schema.prisma          # DB 스키마
prisma/seed.ts                # 샘플 데이터 시드
src/i18n/                     # next-intl 라우팅/네비게이션/요청 설정
messages/ko.json, en.json     # 다국어 문구
src/app/[locale]/             # 공개 페이지 (홈, 이벤트, 예약)
src/app/admin/                # 관리자 로그인 + 대시보드 (다국어 미적용)
src/app/api/                  # Route Handler (공개 API + 관리자 API)
src/lib/                      # prisma client, session, notifications, supabase, anthropic 등
src/components/                # UI, 모션, 상담 위젯, 사이트 공통 컴포넌트
```

## 1. 로컬 실행

### 1) 의존성 설치

```bash
npm install
```

`postinstall` 스크립트가 자동으로 `prisma generate`를 실행합니다 (Prisma Client 생성).

### 2) 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 아래 값들을 채워주세요. 각 항목의 발급 방법은 이 문서의 2~5번 섹션을 참고하세요.

### 3) 로컬 Postgres 실행 (Docker)

```bash
docker compose up -d
```

`docker-compose.yml`이 `localhost:5432`에 Postgres를 띄웁니다 (`.env.example`의 기본 `DATABASE_URL`과 맞춰져 있습니다). Supabase Postgres를 바로 사용하려면 이 단계를 건너뛰고 `DATABASE_URL`을 Supabase 연결 문자열로 바꾸면 됩니다.

### 4) 마이그레이션 + 시드

```bash
npm run db:migrate   # 최초 1회: 마이그레이션 생성 + 적용
npm run db:seed      # 호텔 타입 + 샘플 이벤트 데이터 삽입
```

### 5) 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 접속. 관리자 대시보드는 `http://localhost:3000/admin/login`.

### 6) 평소 켤 때 / 끌 때 (최초 설치 이후)

최초 설치(1~4단계)는 한 번만 하면 되고, 그다음부터 컴퓨터를 껐다 켤 때마다는 아래 두 가지만
반복하면 됩니다.

**시작할 때**

1. Docker Desktop 앱 실행 (메뉴바 고래 아이콘이 "Docker Desktop is running" 상태가 될 때까지 대기)
2. 로컬 Postgres 컨테이너 시작
   ```bash
   docker compose up -d
   ```
   (컨테이너와 데이터는 그대로 보존되어 있으므로 `db:migrate`/`db:seed`를 다시 할 필요는 없습니다.)
3. 개발 서버 실행
   ```bash
   npm run dev
   ```

**끝낼 때**

1. 개발 서버 종료: 터미널에서 `Ctrl + C`
2. Postgres 컨테이너 종료
   ```bash
   docker compose stop
   ```
   (컨테이너를 완전히 삭제하고 싶다면 `docker compose down`을 쓰되, 이 경우 볼륨을 함께
   지우지 않는 한 데이터는 유지됩니다. 데이터까지 전부 초기화하려면
   `docker compose down -v`를 사용하세요 — 되돌릴 수 없으니 주의하세요.)
3. (선택) Docker Desktop 앱 종료

컨테이너 상태 확인: `docker compose ps`

### 기타 스크립트

```bash
npm run build       # 프로덕션 빌드
npm run start       # 빌드 결과 실행
npm run lint        # ESLint
npm run db:studio   # Prisma Studio (DB GUI)
npm run db:push     # 마이그레이션 파일 없이 스키마를 DB에 바로 반영 (프로토타이핑용)
```

## 2. 관리자 계정

DB에 별도 계정 테이블을 두지 않고 환경변수로 관리합니다.

```
ADMIN_ID=admin
ADMIN_PASSWORD=change-me-please
SESSION_SECRET=32자 이상의 임의 문자열   # 예: openssl rand -base64 32
```

로그인하면 `admin_session`이라는 httpOnly 쿠키(서명된 JWT, 12시간 만료)가 발급됩니다. `/admin/*` 페이지와 `/api/admin/*` 쓰기 API는 `proxy.ts`(미들웨어)와 각 API 핸들러 양쪽에서 세션을 검증합니다.

## 3. Supabase 설정 (Postgres + Storage)

1. [supabase.com](https://supabase.com)에서 새 프로젝트를 만듭니다.
2. **Project Settings → Database**에서 Connection string(URI)을 복사해 운영용 `DATABASE_URL`로 사용합니다 (로컬 개발은 Docker Postgres를 계속 써도 됩니다).
3. **Project Settings → API**에서 아래 값을 확인해 `.env`에 채웁니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (서버 전용, 절대 클라이언트에 노출 금지)
4. **Storage**에서 이벤트 이미지를 저장할 버킷을 만들고 (기본값: `event-images`) **Public bucket**으로 설정합니다. 버킷 이름이 다르면 `SUPABASE_STORAGE_BUCKET`을 맞춰주세요.

이벤트 이미지는 관리자 대시보드 → 이벤트 편집 화면에서 업로드하면 이 버킷에 저장되고, 공개 URL이 `EventImage.url`에 저장됩니다.

## 4. 텔레그램 봇 알림 설정

1. 텔레그램에서 **@BotFather**와 대화를 시작하고 `/newbot`으로 봇을 생성합니다.
2. 발급된 토큰을 `TELEGRAM_BOT_TOKEN`에 넣습니다.
3. 알림을 받을 개인 채팅방 또는 그룹에 봇을 초대합니다.
4. `TELEGRAM_CHAT_ID`를 확인하는 방법:
   - 봇에게 아무 메시지나 보낸 뒤, 브라우저에서
     `https://api.telegram.org/bot<TOKEN>/getUpdates`를 열어 `chat.id` 값을 확인합니다.
   - 그룹 채팅의 경우 `id`가 음수(`-100...`)일 수 있습니다. 그대로 사용하면 됩니다.

알림 발송 로직은 `NotificationSender` 인터페이스(`src/lib/notifications/types.ts`)로 추상화되어 있어서, 카카오 알림톡(솔라피 등)처럼 채널을 추가하고 싶으면 이 인터페이스를 구현한 클래스를 만들어 `src/lib/notifications/index.ts`의 배열에 추가하면 됩니다.

## 5. AI 상담 (Claude API) 설정

1. [console.anthropic.com](https://console.anthropic.com)에서 API 키를 발급받습니다.
2. `.env`의 `ANTHROPIC_API_KEY`에 넣습니다.
3. 필요하면 `ANTHROPIC_MODEL`을 원하는 모델 ID로 바꿀 수 있습니다 (기본값: `claude-sonnet-4-5`).

상담 위젯은 우측 하단 플로팅 버튼으로 열리며, `/api/consult`가 Claude 응답을 스트리밍으로 전달합니다. 시스템 프롬프트(상담 톤/범위)는 `src/lib/anthropic.ts`의 `buildConsultSystemPrompt`에서 수정할 수 있습니다. 대화 내용은 `ConsultationSession` / `ConsultationMessage` 테이블에 저장되며, 관리자 대시보드 → AI 상담 로그에서 확인할 수 있습니다.

## 6. 예약 완료 후 "바로 문의하기" 딥링크

예약 요청 제출 후 결과 화면에서 카카오톡/왓츠앱/잘로로 바로 이어서 문의할 수 있는 버튼을 보여줍니다.

```
NEXT_PUBLIC_KAKAO_CHANNEL_ID=_xxxxxxx   # pf.kakao.com/_xxxxxxx 채널 홈 URL에서 확인
NEXT_PUBLIC_WHATSAPP_PHONE=84xxxxxxxxx  # 국가번호 포함, + 기호/공백 없이
NEXT_PUBLIC_ZALO_PHONE=84xxxxxxxxx
```

- **왓츠앱**은 `wa.me` 딥링크가 메시지 텍스트를 URL로 미리 채워줍니다.
- **카카오톡 채널 / 잘로**는 채팅창에 텍스트를 미리 채우는 공식 방법이 없어서, 버튼을 누르면 예약 요약 텍스트를 클립보드에 복사한 뒤 채팅방을 열어줍니다 (사용자가 붙여넣기만 하면 됩니다).

값이 비어 있으면 해당 버튼은 자동으로 숨겨집니다.

## 7. 배포 (Vercel)

1. GitHub 저장소를 Vercel에 연결합니다.
2. Vercel 프로젝트 설정 → Environment Variables에 `.env.example`의 모든 항목을 등록합니다 (`DATABASE_URL`은 Supabase 연결 문자열 사용을 권장합니다).
3. Supabase Postgres는 서버리스 환경에서 커넥션 풀링이 필요할 수 있습니다 — Supabase의 **Connection Pooling(Transaction mode)** URL을 `DATABASE_URL`로 사용하는 것을 권장합니다.
4. 첫 배포 후 `npx prisma migrate deploy`를 (로컬 또는 CI에서) 실행해 운영 DB에 마이그레이션을 적용하세요.

## 8. 다국어(i18n) 확장

현재 한국어(`ko`, 기본)와 영어(`en`)가 활성화되어 있습니다. 베트남어 등을 추가하려면:

1. `src/i18n/routing.ts`의 `locales` 배열에 언어 코드를 추가합니다.
2. `messages/<코드>.json` 파일을 만들고 `messages/ko.json` 구조를 복사해 번역합니다.

이 두 가지만으로 라우팅, 네비게이션, 폼 문구 등 사이트 전체에 반영됩니다.

## 9. 알아두면 좋은 설계 메모

- **이벤트 콘텐츠 다국어**: `Event.title`/`description`은 단일 언어(관리자가 입력한 그대로)로 저장됩니다. 사이트 UI(메뉴, 버튼, 폼 라벨 등)는 next-intl로 완전히 다국어 처리되지만, 이벤트/프로모션 같은 관리자 입력 콘텐츠까지 언어별로 이중화하지는 않았습니다 (요구사항 대비 불필요한 복잡도라고 판단했습니다). 언어별 콘텐츠가 필요해지면 `Event.title`/`description`을 JSON(`{ko, en}`) 컬럼으로 바꾸는 마이그레이션을 추가하면 됩니다.
- **HotelType 모델 추가**: "호텔 타입을 관리자가 등록 가능한 옵션으로" 요구사항을 위해 스키마에 `HotelType` 모델을 추가했습니다 (원 요구사항 스키마 목록에는 명시되어 있지 않았지만, 기능 요구사항을 충족하려면 필요했습니다).
- **ReservationRequest.source**: 이벤트 상세 페이지에서 예약하면 `source`에 `event:<eventId>` 형태로 유입 경로가 기록됩니다.
- **분석 이벤트(AnalyticsEvent)**: `reservation_submit`, `consult_start`, `consult_message` 등을 서버에서 자동 기록합니다. `page_view`처럼 클라이언트에서 직접 기록하고 싶은 이벤트는 `POST /api/analytics`로 보내면 됩니다.
- **Prisma Client 생성**: 이 리포지토리를 처음 받은 환경에서는 `npm install` 시 `postinstall`이 `prisma generate`를 실행해 `src/generated/prisma`를 만듭니다 (이 폴더는 git에 커밋하지 않습니다). 인터넷이 제한된 환경에서 `prisma generate`가 엔진 바이너리를 내려받지 못해 실패한다면, 일반적인 개발 환경(로컬 PC, CI, Vercel)에서는 문제없이 동작합니다.
- **Prisma 7의 설정 방식 변경**: Prisma 7부터 `schema.prisma`의 `datasource` 블록에는 더 이상 `url`을 직접 쓸 수 없습니다. 대신 (1) `prisma migrate`/`db push`/`studio` 같은 CLI 명령은 루트의 `prisma.config.ts`(내부에서 `DATABASE_URL`을 읽습니다)를 사용하고, (2) 런타임 `PrismaClient`(`src/lib/prisma.ts`)는 `@prisma/adapter-pg` 드라이버 어댑터로 직접 연결합니다. 두 경로 모두 `.env`의 `DATABASE_URL` 하나만 있으면 되므로, 사용하는 입장에서 추가로 신경 쓸 부분은 없습니다.

## 10. 시드 데이터로 들어있는 플레이스홀더

`npm run db:seed` 실행 시 아래가 들어갑니다 (전부 실제 데이터로 교체 필요):

- 호텔 타입: 스탠다드 / 디럭스 / 스위트
- 샘플 이벤트 3건 (공개 2건 + 비공개 1건, 이미지는 picsum.photos 임시 이미지)

관리자 대시보드에서 자유롭게 수정·삭제하고 실제 이미지를 업로드하세요.
