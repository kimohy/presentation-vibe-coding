
<개인적인 경험: 캠핑장 빈자리 알림 서비스>

25년 11월 26일 부터 시작 - 당시 코덱스 활용 

그 전에 코딩보조 도구를 통해 poc 는 해본 적 있음.
그러나 보조에서 넘어서 코딩 전체를 위임하는 방향으로 새로 시작해봄.

AGENTS.md 에 핵심사항만 작성 

```
# AGENTS Guide

코드 작업 시 참조해야 할 핵심 문서와 원칙을 정리합니다. 모든 변경은 아래 문서를 확인하며 진행하세요.

## 핵심 문서
- 제품 요구: `docs/PRD.md`
- 시스템 요구: `docs/SRS.md`
- 작업 체크리스트: `docs/TODO.md` (진행 상태 업데이트 필수)
- 프로젝트 개요/실행/배포: `README.md`

## 작업 원칙
- 변경 계획과 진행 상황을 `docs/TODO.md` 체크박스에 반영합니다.
- PRD/SRS 요구사항을 충족하는지 리뷰 관점으로 검증합니다.
- 신규 파일/코드 구조는 README의 디렉터리 가이드를 우선합니다.
- 비밀정보는 `.env`로 관리하고 예시만 `.env.example`에 추가합니다.
## 기본 워크플로(예시)
1) 관련 요구사항 확인: PRD/SRS, TODO 체크 항목 선택.
2) 설계/스펙: 필요한 경우 README 구조에 맞춰 파일/모듈 결정.
3) 구현: 코드 추가/수정 시 자체 주석은 최소화, 복잡 로직만 설명.
4) 검증: lint/test/예상 명령 실행, 결과 요약.
5) 문서/체크리스트 반영: TODO 체크 상태 업데이트, README/AGENTS 필요 시 갱신.

## 커뮤니케이션
- 변경 요약 시 파일 경로와 핵심 영향 영역을 명시합니다.
- 발견된 리스크나 열린 결정 사항은 TODO의 리스크/오픈 이슈 섹션에 기록합니다.

## 참고
- 디자인/UX 작업 시 기존 스타일을 유지하거나 README의 UI 스택(Tailwind) 기준을 따릅니다.
- 크롤러/워커 관련 설정(쿨다운/재시도/백오프)은 SRS 섹션 8~10을 참조합니다.
```

-----------

이 내용은 현재까지고 크게 변하지 않음.(테스트 부분 추가)
이후 PRD와 TODO 중심으로 요구사항을 지속적으로 업데이트 하면서 실제 코드는 확인하지 않음.

주요한 체크포인트 마다 docs 내 문서를 추가하면서 (security 나 deploy 에 대한 규칙, e2e test 규칙등.)
기능이 지속적 확장됨. (like skill?)

TODO.md 는 계속적으로 스스로 추가하기도 하고 plan 한 것을 하나씩 해결하면서 진행됨.

-----------

```
# Camping & Lodging Reservation Monitoring Service – 개발 계획서 (TODO)

> 이 문서를 작업 체크리스트의 기준으로 사용합니다. 진행 상황은 여기에 반영하세요.

## 1. 목표 및 마일스톤
- [ ] M1: 기본 Auth + 관리자 승인 + 알림 CRUD + 텔레그램 연동(가동 가능) — 3주
- [ ] M2: 스케줄러/워커 + 플러그인 엔진 + 쿨다운/재시도 + 로깅 — 3주
- [ ] M3: 관리자 대시보드(승인/알림/크롤러/로그) + 모니터링 — 2주
- [ ] M4: 부하/보안/통합 테스트 및 배포 자동화 — 2주

## 2. 백엔드 TODO (Node.js/TS)
- [x] Auth/권한: JWT, 비밀번호 해시, 로그인 시도 제한, 관리자 권한 미들웨어.
  - [x] JWT 발급/검증, bcrypt 해시, 관리자 미들웨어 기본 구현
  - [x] 로그인 시도 실패 누적/잠금(5회, 15분) 추가
- [x] 사용자 흐름: 가입(pending), 텔레그램 ID 등록/검증, 승인 후 active 전환.
  - [x] 가입/로그인 API, pending 기본 상태, 관리자 승인/거절 엔드포인트 추가
  - [x] 텔레그램 ID 검증 코드 발급/확인 + 실제 발송
  - [x] 텔레그램 검증 코드 재요청 쿨다운(1분) 추가
- [x] 텔레그램 검증/전송 강화: 코드 유효 기간 적용, 재요청 쿨다운/재시도 로직 검증, chat_id 변경 시 재검증 강제 및 마지막 검증 chat_id만 유효하게 유지, sendMessage 실패시 백오프 후 fail 기록
  - [x] 텔레그램 코드 요청/검증 핸들러의 상태 코드와 재시도 호출을 테스트 기대치(쿨다운 429, 만료 400, 성공 200, 전송 실패 시 3회 호출)와 일치하도록 정비
  - [x] 텔레그램 폴러/전송 dispatcher 설정을 IPv4 강제·프록시 옵션에 맞게 타입 오류 없이 정리
  - [x] 텔레그램 타입 정합성 추가 점검(undici dispatcher 모듈 일원화, 검증 상태코드 매핑 타입 가드 적용)
  - [x] 텔레그램 sendMessage 공통 재시도/백오프 유틸 추가 및 코드 발송·테스트/알림 전송 경로에 적용해 실패 시 기록 강화
- [x] 알림 API: CRUD, 상태 토글, 만료 처리 로직(check_out < now → expired).
  - [x] 알림 CRUD/토글 엔드포인트 초안(만료 자동화는 토글 시 체크, 스케줄러 연동 미구현)
  - [x] 스케줄러 tick에서 만료 처리(check_out < now) 적용
  - [x] 알림 생성/수정 시 checkIn/checkOut 순서 검증 및 플러그인 param_schema 타입 검증
  - [x] 알림 목록 필터(status/plugin/checkIn 범위) 쿼리 추가(사용자/관리자)
  - [x] 알림 수정 시 param_schema에 배열 타입 지원(배열 내 문자열 검증 및 필터링 등) 기능 보완
  - [x] 알림 삭제 시 연관된 AlertLog, Notification의 Foreign Key 제약 조건 위배 오류 수정 (삭제 트랜잭션 연동)
- [x] 플러그인 관리: 등록/수정/비활성화, param_schema 검증, cooldown_sec/버전 관리.
  - [x] 플러그인 CRUD/상태 토글(admin 전용) 엔드포인트 초안 추가, param_schema는 JSON 문자열 저장
  - [x] 플러그인 param_schema 타입 검증(필드별 string/number/boolean + required) 추가
  - [x] 플러그인 목록 status/domain 필터 추가
- [x] 플러그인 구현 파일 자동 등록: implementations 디렉터리 manifest 스캔→DB upsert 동기화, 서버/스케줄러 부팅 시 실행(기존 status는 manifest 미지정 시 보존)
- [x] 관리자 플러그인 리프레시 API: `/admin/plugins/refresh`에서 manifest 재스캔/upsert, 일부 실패 시에도 나머지 적용 후 실패 목록 반환
- [x] 스케줄러/큐: 1분 주기 활성 알림 큐잉, 쿨다운 체크, 백오프 재시도 정책. (BullMQ/인메모리 폴백 포함, 재시도/백오프/쿨다운 적용)
  - [x] 1분 주기 스케줄러 스텁 추가(만료 처리 + 큐 스텁 로그)
  - [x] 플러그인 cooldown_sec 기반 스킵 처리 추가
  - [x] 인메모리 큐 스텁 + 재시도/백오프 추가(작업 핸들러는 플러그인 실행 미구현)
  - [x] 워커에서 플러그인 실패 시 alert_log 기록 후 백오프 재시도 + lastRunAt 갱신(중복 스케줄 방지)
  - [x] 지수 백오프 helper/export 및 유닛 테스트 추가
  - [x] 큐 도입(BullMQ/Redis, Redis 미설정 시 인메모리 폴백), 재시도 정책 BullMQ에 적용
  - [x] BullMQ Redis URL 파싱 및 연결 옵션 타입 오류 수정(NodeJS.Timeout 반환 타입 정리 포함)
- [x] 워커 실행: 플러그인 호출(HTTP/Puppeteer), 결과/에러 코드 표준화, duration_ms 기록.
  - [x] 플러그인 러너 스텁(runPlugin) 추가, 워커 큐에서 결과(nochange/available/fail) 기록 + duration_ms 포함
  - [x] 플러그인 어댑터 로더(도메인/버전 → implementations/<slug>), 에러 코드 표준화 스텁 + default 어댑터
  - [x] campfield REST 어댑터 구현(예약 가능 타입 ACP/CMP2/CMP3/CMP4 필터)
  - [x] 어댑터 누락 시 default 폴백 적용 + fail 로그 payload에 errorCode 포함
  - [x] campfield 어댑터에 예약 검색 URL 반환, UA/프록시 헤더 적용, 네트워크 오류 코드 세분화
  - [x] campfield 어댑터 5xx/타임아웃 재시도+백오프, 샘플 슬롯 로깅 추가
  - [x] campfield 로그 payload에 searchUrl/slots 샘플 포함(운영 가시성 강화)
  - [x] campfield 어댑터 4xx 에러 코드(BLOCKED/INVALID_PARAM) 매핑 및 petYn 옵션 Y/N 정규화
  - [x] campfield 어댑터 Retry-After 헤더(429/5xx) 기반 대기 후 재시도
- [x] 알림 전송: 텔레그램 메시지, dedup_key로 중복 방지, 재시도(최소 2회).
  - [x] 텔레그램 전송 구현(실제 Bot API 호출, 10s 타임아웃, dedup 검증 후 기록)
  - [x] Notification 저장 + dedup 처리 스텁, 사용자/관리자 목록 API 추가
  - [x] 텔레그램 전송 재시도(최대 3회, 1s 지수 백오프) 후 fail 기록
- [x] 로그/감사: alert_logs, notifications, audit_logs 구조화 기록 및 필터 API.
  - [x] alert_logs 기록/조회 API(사용자/관리자) 추가, 워커 스텁에서 nochange 로그 기록
  - [x] 관리자 알림 강제 비활성/감사 로그 추가, 관리자 알림 목록 API 추가
  - [x] audit_logs 조회 API(관리자) 추가
  - [x] alert_logs/notifications 기간·결과 필터 쿼리 추가(사용자/관리자)
- [x] 헬스/옵스: /health, 큐 길이/성공률/에러 메트릭 노출(추후 APM 연계).
  - [x] 워커 프로세스 /health 추가(queue pending/processed/failed/retried, 최근 tick 상태 포함)
  - [x] 큐 최근 성공률/최근 실패 사유 노출
  - [x] API /health에서 DB 연결 상태 확인 후 에러 시 500 반환 + dbLatencyMs 제공
  - [x] API/워커 /ready 엔드포인트 추가(DB 연결, 워커는 마지막 tick 오류 포함) 실패 시 503
  - [x] API/워커 /live 엔드포인트 추가(심플 liveness)

## 3. 프론트엔드 TODO (React/Next + Tailwind)
- [x] 공통: 인증 흐름, 오류/로딩 UX, 폼 검증. (단일 HTML에서 검증/로딩/가드/토스트 정비)
- [x] 역할 기반 라우팅/내비게이션: 로그인 화면 기본, `/auth/me`로 role=user/admin에 따라 홈/메뉴 노출.
- [x] 사용자 대시보드: 알림 요약/로그 요약/텔레그램 검증 상태, 알림 리스트/필터/토글/삭제, 수정/생성 폼(플러그인 스키마 기반). (단일 HTML/vanilla JS 구현 완료)
- [x] Notifications 뷰: 텔레그램 코드 요청→봇 전송→검증→테스트 메시지, active 상태만 허용, 코드 자동 노출/읽기전용, 미검증/미링크 시 경고. (단일 HTML/vanilla JS 구현)
- [x] 프런트 UX 개선(게스트/폼/접근성): (단일 HTML에서 가드/토스트/폼/접근성 일괄 개선)
  - [x] 로그인/회원가입 탭 시각 강조, 입력값 검증, CTA/Back 링크
  - [x] 로그인 상태에서 Login/Signup nav 숨김
  - [x] 로그인/회원가입/대시보드 출력이 모두 원시 JSON(pre 태그)으로 노출되어 사용성이 낮음 → API 호출 결과를 카드/테이블 기반으로 요약하고, 로딩/빈 상태/에러 메시지를 각 섹션별로 일관된 토스트·배지로 분리
  - [x] Notifications/Alerts/Plugins 폼이 텍스트 입력과 임의 JSON 입력만 허용 → 텔레그램 미인증/미승인 상태에서는 버튼을 비활성화하고 상태 배지를 강조, 플러그인 param_schema를 읽어 필수 필드/옵션을 폼 필드로 노출하도록 개선
  - [x] API/Worker Base·JWT 수동 설정 패널(`env` 섹션)이 nav에서 접근 불가 → 로그인 후 상단 내비게이션에 "Environment"(또는 Settings) 항목을 추가하고, 현재 연결 상태/토큰 프리뷰를 한 번에 확인·설정할 수 있는 연결 카드로 묶기
  - [x] 토스트/aria/state 접근성(프로덕션 UI) 보완
  - [x] Alerts 목록 페이징 번호/동작 오류 픽스 (프론트 버튼 이벤트 중복 제거 및 백엔드 limit/offset 페이징 적용)
- [x] 관리자 화면: 승인/거절, 알림 강제 조치, 플러그인 CRUD/상태, 로그/성공률/최근 에러 뷰, 대시보드 요약(큐/성공률/대기 승인). (단일 HTML/vanilla JS 구현)
- [x] Dashboard 재설계: 별도 Admin 탭 제거, Dashboard를 role-aware로 통합 (상세 구현 가이드: `docs/DASHBOARD_IMPLEMENTATION.md`)
  - [x] User Dashboard 개선: 24h 체크 현황(성공/실패 카운트) 지표 카드 추가, 최근 활동/알림을 3건으로 확대, Worker 상태 표시 제거, Quick Actions(New Alert/Telegram/Logs) 추가
  - [x] Admin Dashboard 전면 재작성: System Status 바(API/Worker 헬스+Uptime), 지표 카드(대기 승인·전체 사용자·24h 성공률·알림 전송), 24h 크롤링 분포 바(nochange/available/fail+에러코드), Queue 상태, 최근 감사 로그(5건), Quick Actions
  - [x] Nav 구조 변경: Admin 탭(`navAdminDash`) 제거, admin 로그인 시 홈을 통합 Dashboard로 변경
- [x] 텔레그램 연동 고도화:
  - [x] 요청 코드/검증/테스트 UX 마감(미링크/미검증 시 메시지, 상태 배지) — 단일 HTML에서 구현
  - [x] 텔레그램 웹훅/폴러 코드 매칭(봇에 코드 전송 시 `telegramId` 자동 저장/verified) — 코드 재사용 시 기존 chat_id 분리 처리 포함
  - [x] 테스트 메시지 UX(성공/실패 토스트, 링크 필요 안내) — 미연결/레이트리밋 가이드, 성공 안내 메시지 보완
- [x] 스타일/반응형: 공통 레이아웃, 키보드 내비, 명확한 상태/에러 표시. (skip-link/focus-visible, 좁은 화면 nav 스크롤/버튼 스택, 테이블 가로 스크롤)

## 4. 데이터/인프라 TODO
- [x] Prisma 스키마 정의 및 마이그레이션 세트(users, alerts, crawler_plugins, alert_logs, notifications, audit_logs).
  - [x] 스키마 초안 작성(prisma/schema.prisma, SQLite)
- [x] 초기 마이그레이션 세트 생성/검증 (수동 SQL: prisma/migrations/0001_init/migration.sql, apply-sqlite.js로 전체 세트 일괄 적용 가능)
  - [x] 스키마 확장(텔레그램 코드/검증시간, 로그인 잠금 필드) → prisma/migrations/0002_telegram_login_guard/migration.sql
  - [x] Notification 관계 스키마 정리(유저 참조 제거, dedup 전용) → prisma/migrations/0003_notifications_dedup_only/migration.sql
  - [x] Prisma migrate dev/db push 엔진 오류 대응: Node 20 권장 + 실패 시 migrate diff 스크립트 생성 후 `db:apply` 우회(`docs/DB_SETUP.md` 트러블슈팅 추가)
  - [x] Node 20 Docker 환경에서 migrate dev 성공, 신규 마이그레이션 생성/적용(prisma/migrations/20251122233641_docker_test, db:apply 완료)
  - [x] Node 20을 기본 개발 버전으로 채택(.nvmrc 20, README 반영). CI/로컬 모두 Node 20 사용 권장.
- [x] 로컬 docker-compose: web(API/UI)+worker(스케줄러/텔레그램) + Redis + SQLite 공유 볼륨(dev.db) 구성 추가
- [x] SQLite 로컬/개발 환경 구성 (PostgreSQL 전환은 현재 범위 외). 
  - [x] 로컬 SQLite/정식 Postgres 전환 절차 문서화(`docs/DB_SETUP.md`)
- [x] 큐 인프라: BullMQ + Redis 사용 확정, 인메모리 모드는 폴백 옵션으로 유지.
- [x] 비밀/환경: .env 템플릿, 텔레그램 토큰, 크롤러 UA/프록시 설정. (진행중: .env.example 추가)
  - [x] 테스트 환경에서 TELEGRAM_BOT_TOKEN 미설정 시 기본 토큰을 사용해 CI 환경 변수 검증 실패 완화
  - [x] 테스트 환경에서 DATABASE_URL 미설정 시 로컬 SQLite 경로로 폴백해 환경 검증 실패 방지
- [x] 비생산 환경에서 JWT_SECRET 기본값을 제공해 CI 환경 변수 누락 시에도 검증이 통과하도록 조정(프로덕션은 엄격 검증 유지)
- [x] 저장소 무시 규칙: node_modules, dist, 로컬 DB, 개인 .env 등 불필요 산출물 제외(.gitignore 추가).
- [ ] 배포: CI(테스트/린트/빌드) + CD(마이그레이션 실행), 헬스체크/롤백 전략.
  - [x] CI 워크플로 추가: Node 20, prisma generate/migrate deploy, build (`.github/workflows/main.yml`에 Publish 와 통합)
  - [x] 린트 단계 추가(ESLint v9, npm run lint), CI에 포함
  - [x] 테스트 단계 추가 및 CD 파이프라인 설계 (테스트 단계 완료, CD 설계 초안 `docs/DEPLOY.md`)
  - [x] npm lockfile 재생성: dev dependency `npm-run-all` 제거 및 `worker:all` 대체 스크립트 추가 → lockfile/의존성 불일치 해소. (npm install --ignore-scripts --package-lock-only 완료)
  - [x] GHCR 컨테이너 빌드/푸시 워크플로 추가(web/worker 이미지, 태그: latest + sha): CI 성공 시에만 publish 진행되도록 `main.yml` 로 연결.
  - [x] GHCR 이미지를 사용하는 K8s 배포/서비스 매니페스트 추가(`k8s/deployment.yaml`, `k8s/service.yaml`)
  - [x] K8s ConfigMap/Secret, 내부 통신용 NetworkPolicy 추가(`k8s/config.yaml`, `k8s/networkpolicy.yaml`) 및 web→worker 내부 주소 env 설정
  - [x] GHCR 이미지 빌드 후 `vm2-k8s` manifest repo의 `camping-deployment.yaml`에 PR 생성하는 워크플로 추가 (`INFRA_REPO_TOKEN` 필요)
- [x] 관측: 로그 수집 포맷 정의, 기본 메트릭(큐 길이, 성공률, 오류 코드 분포).
  - [x] 로그 포맷/헬스 노출 범위 문서화(`docs/OBSERVABILITY.md`)
  - [x] 워커 /health에 최근(24h) alert_logs 결과/에러코드, notifications 상태 메트릭 노출
  - [x] 워커 /metrics Prometheus 게이지 노출(queue/scheduler/alert_logs/notifications)
  - [x] API /metrics DB 상태/지연 게이지 추가
  - [x] 로그 수집/전송 경로 확정(stdout 우선, 파일/에이전트 시 동일 스키마) 및 필수 필드 스키마 정의(alert_logs/notifications/audit) — `docs/OBSERVABILITY.md` 보완
  - [x] 프로메테우스 스크레이프 설정/라벨 가이드 + 기본 대시보드 요구(큐 pending/성공률/최근 실패 코드, 알림 전송 성공률) — `docs/OBSERVABILITY.md`에 패널/라벨/알림 초안 추가
- [x] 중복 알림: dedup_key 정책(슬롯/시간 단위) 확정, 저장소 기반 체크. (정책: `alert-{id}-{checkInYmd}-{slotTypes|ANY}`, README에 명시)

## 5. 품질/테스트 TODO
- [ ] 유닛: 플러그인 인터페이스/옵션 검증, 알림 상태 전환, JWT/권한, dedup 로직.
  - [x] 플러그인 param_schema/옵션 검증 유닛 테스트 추가(vitest)
  - [x] 플러그인 러너 기본 어댑터 폴백/비활성 반환 유닛 테스트 추가
  - [x] 알림 전송 dedup/재시도 유닛 테스트 추가
  - [x] 워커 alert 처리(processAlertJob) 알림/로그/텔레그램 경로 유닛 테스트 추가
  - [x] 인메모리 큐 재시도/백오프 스케줄링 유닛 테스트 추가
  - [x] BullMQ 큐 재시도/백오프 설정 검증 유닛 테스트 추가
  - [x] 텔레그램 코드 흐름 유닛 테스트(유효 기간, 쿨다운, 재시도/실패 기록, chat_id 변경 시 재검증 강제)
  - [x] metrics 통계 helper를 Prisma 클라이언트 생성 없이 실행 가능하도록 분리
  - [x] metrics getRecentMetrics 중복 prisma 선언 제거(테스트 통과)
  - [x] JWT/권한 실패 경로, dedup edge(동시 전송, 만료 상태) 유닛 테스트 추가
  - [x] 알림 상태 전환 로직(만료/토글/쿨다운) 단위 검증 보강 (inactive/expired 스킵 포함)
- [ ] 통합: 알림 생성→큐→플러그인→알림 전송 플로우, 관리자 승인 플로우.
  - [x] 알림→큐→플러그인→노티 인메모리 스켈레톤 테스트 추가
  - [x] 텔레그램 검증/알림 전송 통합 시나리오(코드 요청→검증→알림 발송 성공/실패 경로) — `tests/telegramIntegration.test.ts` 추가
- [ ] 부하: 1분 주기 N(예: 5k) 알림 시 지연 측정, 쿨다운/백오프 동작 검증. (계획: `docs/LOAD_TEST.md`, 알림 벌크 생성 스크립트 `npm run load:alerts` 추가, 실행/자동화 미구현)
- [x] 보안: 인증/권한, 비밀번호 해시, 텔레그램 검증, 관리자 액션 감사 로그 확인. (정책/정리: `docs/SECURITY.md`)
  - [ ] 역할 기반 UI/E2E: 로그인→role별 홈 라우팅, 메뉴 비노출 확인, 권한 없는 API 호출 차단
- [ ] E2E(UI): 사용자/관리자 주요 플로우(생성/승인/알림 확인) 시나리오 테스트. (browsermcp 기반 수동/반자동 계획: `docs/E2E_PLAN.md`)

## 6. 리스크 및 대응
- [ ] 사이트 차단/봇 감지: 요청 간 쿨다운, UA/프록시 회전, Puppeteer 사용 기준 명확화.
  - [x] campfield 어댑터에 UA/프록시 적용 및 예약 페이지 링크 포함(봇 탐지 대응)
- [ ] 중복 알림: dedup_key 정책(슬롯/시간 단위) 확정, 저장소 기반 체크.
  - [x] dedup_key를 `alert-{id}-{checkInYmd}-{slotTypes}`로 정교화(슬롯 미제공 시 ANY)
- [ ] 워커 장애/유실: 큐 기반 재시도, 장애 복구 시 미처리 작업 확인.
- [ ] 스키마 변경: 마이그레이션 버전 관리, 롤백 스크립트 준비.
- [ ] SQLite에서 enum/JSON 미지원으로 문자열 저장 → PostgreSQL 전환 시 native 타입 전환 필요.
- [ ] Prisma schema engine가 로컬 SQLite 환경에서 migrate/db push 실패 → Node 20 환경에서는 정상, 로컬 20 미만 사용 시 Docker/수동 SQL 우회 필요.
- [ ] vitest `--pool=vmThreads`가 로컬에서 간헐적으로 segfault 발생 → `npx vitest run --pool=threads` 우회 사용 중

## 7. 차주 우선 작업
- [ ] 백엔드: Prisma 스키마 초안, Auth+가입/승인 API, 알림 CRUD 초안, 텔레그램 전송 스텁. (진행중: Prisma 스키마 초안 완료)
- [ ] 인프라: .env 예시, CI 린트/테스트 워크플로, 스케줄러/큐 방식 결정. (진행중: .env.example 추가)
- [ ] 프론트: 기본 레이아웃 + 로그인/가입 + 텔레그램 검증 UX 와이어, 알림 리스트 뷰 초안.

## 8. PRD/SRS 반영 신규/수정 작업
- [x] Role 기반 내비게이션 분기: 공통 사이드바를 사용하되 role=user는 Dashboard/Alerts/Notifications/Activity만 노출, role=admin은 추가로 Users/All Alerts/Plugins/Logs 노출. 별도 Admin 탭 제거.
- [x] 로그인 기본 진입점 고정 + JWT role에 따른 홈 라우팅(user→User Dashboard, admin→Admin Dashboard), 로그아웃 시 로그인 화면 복귀
- [x] 승인 대기(pending) 상태일 때, 로그인 직후 별도의 안내 페이지 렌더링 및 내비게이션 접근 차단
- [x] User Dashboard 개선: 24h 체크 현황 지표 추가, 최근 활동/알림 3건 확대, Quick Actions 추가
- [x] Admin Dashboard 재작성: System Status·지표 카드·24h 크롤링 분포·Queue 상태·최근 감사 로그·Quick Actions (Worker `/health` 메트릭 활용)
- [ ] 텔레그램 검증/전송 품질 구현: 코드 유효 기간, 재요청 쿨다운, sendMessage 재시도(지수 백오프), 실패 로깅 및 dedup 처리, chat_id 변경 시 재검증 강제
- [ ] 텔레그램 chat_id 다중 계정 정책 결정 및 코드 반영(마지막 검증만 유효/정책 문서화)
- [x] Activity Log 개선: 예약 일자(checkIn, checkOut) 및 캠핑장(site), 플러그인(plugin) 정보 API 응답 및 UI 추가 반영
- [x] naver-place 플러그인에 대한 설명 문서(`docs/plugins/naver-place.md`) 작성

## 10. Dry Run 기능 TODO
- [x] **백엔드**: `POST /alerts/dryrun` 엔드포인트 추가
  - [x] alertBaseSchema 동일 페이로드, active 사용자 전용, 플러그인 스키마 검증
  - [x] 임시 alert 객체 생성 후 `runPlugin()` 직접 호출, DB 기록 없음
  - [x] 응답: `{ status, message, slots?, durationMs }`
- [x] **프론트엔드**: 알림 생성/수정 폼에 "지금 확인" Dry Run 버튼 추가
  - [x] 버튼 클릭 시 `/alerts/dryrun` 호출, 로딩 스피너, 결과 인라인 패널 표시
  - [x] available(녹색+룸목록) / 단일 nochange(노란색) / fail(적색+에러메시지) 구분 표시
  - [x] Dry Run 후 폼 초기화 없이 저장 가능
  - [ ] **Dynamic Preset 검색 및 Sub-target (Execute) 연동**:
    - Select Preset 윈도우에 키워드 타자 검색창 추가 및 정적 Preset과 병합하여 표시
    - Sub-target 정보를 받아올 "Fetch Sub-targets" 버튼 추가 및 동작 시 +7일 ~ +9일 더미 일자로 자동 실행
- [x] **테스트**: Dry Run 엔드포인트 유닛 테스트(플러그인 모킹, 각 status 케이스)
- [x] **CLI**: 로컬 테스트용 `scripts/dryrun.ts` 추가 (`npm run dryrun`)

## 9. SSO(OAuth) 연동 작업
- [x] 1단계: 사용자 스키마 및 기초 시그니처 정비
  - [x] `User` 테이블 `passwordHash` 선택적(Optional) 처리
  - [x] `OAuthAccount` 테이블 신설 (Google, Naver 등 확장 고려)
  - [x] `OAuthService` 등 통합 인증/가입 처리 로직 기반 마련
- [x] 2단계: Google 로그인 백엔드 구현
  - [x] Google Cloud Console 앱 설정 (Client ID, Secret 발급)
  - [x] 라우터 추가 (`/auth/google`, `/auth/google/callback`)
  - [x] `.env` 환경변수 세팅 및 구글 ID Token/구현 라이브러리 연동
- [x] 3단계: 프론트엔드 UI/UX 작업
  - [x] 로그인/회원가입 페이지 "Google로 시작하기" 버튼 추가
  - [x] Google 로그인 SDK 또는 리디렉션 흐름 반영
```
----------

코덱스 기반에서 UI 가 많이 허접하다고 생각하던 참에 개인 구독을 Gemini 로 변경함. (12월)

Antigravity 를 기반으로 사용하면서 claude 모델 기반으로 디자인 변경을 해봄.

-> 조금 나아졌지만 원판에서 크게 Theme 이 달라지지 않음

----------

최근에 stitch 가 2.0 으로 출시 되어서 (3/20) 
귀찮으니 기존 PRD 문서를 그냥 때려넣고 돌려봄.

생각보다 대만족스런 결과

---------

좋은 레퍼런스 html 을 사용하면 많이 달라지겠지?! 기대하면서 디자인 재작성 해봤으나
마치 사람이 하는 작업 처럼 디자이너와 개발자의 간극을 그대로 보여줌. (오호!)
전체적인 컬러톤과 레이아웃은 그럴싸하게 변경해주었으나, 디테일을 완벽하게 재현하지는 않음.

물론 리펙토링이 아닌 밑바닥부터 다시 만들었다면 더 퀄리티가 좋았을 것 같음.

---------

30년 지기 회계사 친구에게 클린룸 당한 썰.

어느정도 완성이 되었다 싶어서 캠핑을 좋아하는 친구에게 계정하나를 내 주고 써보라고 했습니다.
그리고 일주일이 지나서 충격적인 소식을 들었습니다.

똑같은 서비스를 만들어 왔습니다. 심지어 더 좋은 UX 를 만들어 왔습니다.

나중에 더 확인 해보니 종합적으로 소모된 시간은 고작 하루 뿐이었고 클로드 코드를 사용 했습니다.

물론 이 친구가 이런저런 서비스를 만들어 보던 친구이기 때문에 금방 따라할 수 있는 것이기도 하지만,
이제는 컨셉이 명확하고 UX 가 잘 보이며 구현 방법이 대략적으로 있다면, 복사하는 건 딸깍입니다.

이 친구는 컴공 전공도 아니고 문과 출신 회계사 입니다.
이제 자신감도 많이 붙어서 이제는 ERP/회계 시스템 구축해서 SaaS 솔루션을 복사해보려고 한답니다.
근데 가능할 것 같습니다. 결국 도메인을 잘 알고, 비즈니스 생태계를 알고 있는 사람이 이 판에서 성공하기 때문입니다.
