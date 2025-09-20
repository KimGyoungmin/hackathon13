# 🎉 Hackerton 프로젝트 현재 상태

## 📋 프로젝트 개요
- **프로젝트명**: hackerton (축제 관리 시스템)
- **프로젝트 유형**: 풀스택 웹 애플리케이션 (Spring Boot + React)
- **Git 상태**: `suyeon` 브랜치에서 2개 커밋이 앞서 있음
- **작성일**: 2024년 12월

## 🏗️ 아키텍처 구조

### 백엔드 (Spring Boot)
- **기술 스택**: 
  - Spring Boot 3.4.10
  - Java 17
  - MySQL
  - MyBatis 3.0.5
  - Lombok
- **서버 포트**: 8080
- **데이터베이스**: `hackerton_festival` (localhost:3306)
- **패키지 구조**: 레이어드 아키텍처
  ```
  Controller Layer (REST API)
      ↓
  Service Layer (비즈니스 로직)
      ↓
  Mapper Layer (데이터 접근)
      ↓
  Database (MySQL)
  ```

### 프론트엔드 (React)
- **기술 스택**: 
  - React 19.1.1
  - Vite 7.1.6
  - TailwindCSS 4.1.13
  - Axios 1.12.2
  - React Router DOM 7.9.1
- **빌드 도구**: Vite
- **UI 프레임워크**: TailwindCSS

## 🗄️ 데이터베이스 설계

### 테이블 구조
완전한 ERD 구조로 설계된 5개 테이블:

1. **category** - 축제 카테고리
   - `category_id` (PK)
   - `category_nm` (카테고리명)

2. **festival_location** - 축제 개최 지역
   - `location_id` (PK)
   - `location_nm` (지역 시/군명)

3. **festival** - 축제 기본 정보
   - `festival_id` (PK)
   - `category_id` (FK)
   - `location_id` (FK)
   - `festival_nm` (축제명)

4. **festival_detail** - 축제 상세 정보
   - 방문객 정보 (총 방문자수, 일평균 방문자수)
   - 기간 정보 (기간일수, 주말일수, 숙박일수)
   - 재정 정보 (예산, 총 매출, 1일 평균 지출액)
   - 기상 정보 (평균기온, 강수량, 일조시간)
   - 지역 정보 (인구수, GRDP, 교통 접근성)

5. **festival_log** - 축제 예측 및 로그 데이터
   - 홍보/예산 상승량 정보
   - 예측 매출/방문객 수
   - 판단 근거 및 생성일시

### 관계도
- `festival` ← `category` (Many-to-One)
- `festival` ← `festival_location` (Many-to-One)
- `festival_detail` ← `festival` (One-to-One)
- `festival_log` ← `festival` (One-to-Many)

## 🔌 API 엔드포인트

현재 구현된 REST API:

| 메서드 | 엔드포인트 | 설명 | 파라미터 |
|--------|------------|------|----------|
| GET | `/api/locations` | 모든 지역 정보 조회 | - |
| GET | `/api/festivals/location/{locationId}` | 특정 지역의 축제 조회 | `locationId` (Long) |
| GET | `/api/festivals/filter` | 지역과 카테고리로 축제 필터링 | `locationId` (Long), `categoryIds` (List<Long>) |

## 🎨 프론트엔드 컴포넌트

### 주요 컴포넌트
- **App.jsx** - 메인 애플리케이션 (라우팅 관리)
- **MainPage.jsx** - 메인 페이지 (필터링 기능)
- **LocationFilter.jsx** - 지역 필터 컴포넌트
- **CategoryFilter.jsx** - 카테고리 필터 컴포넌트
- **FestivalList.jsx** - 축제 목록 표시 컴포넌트

### 서비스 레이어
- **festivalService.js** - 백엔드 API 통신 서비스
- **api.js** - Axios 기반 HTTP 클라이언트 설정

## ✅ 현재 기능 상태

### 완료된 기능
- ✅ 지역별 축제 필터링
- ✅ 카테고리별 축제 필터링
- ✅ 복합 조건 필터링 (지역 + 카테고리)
- ✅ 반응형 UI (TailwindCSS)
- ✅ 에러 처리 및 로딩 상태
- ✅ RESTful API 설계
- ✅ MyBatis 기반 데이터 접근
- ✅ 트랜잭션 관리

### 샘플 데이터
- **지역**: 서울특별시, 부산광역시, 전주시, 안동시, 목포시
- **카테고리**: 문화예술, 음식, 스포츠, 전통, 국제
- **축제**: 부산국제영화제, 전주비빔밥축제, 서울마라톤, 안동하회탈춤축제, 서울국제음식축제

## ⚙️ 설정 정보

### 백엔드 설정
- **MyBatis**: 
  - SQL 로깅 활성화
  - 스네이크케이스 → 카멜케이스 자동 변환
  - 매퍼 위치: `classpath:mapper/*.xml`
- **데이터베이스 초기화**: `never` 모드 (수동 설정 필요)
- **로깅**: MyBatis SQL 로그 레벨 DEBUG

### 프론트엔드 설정
- **개발 서버**: Vite 개발 서버
- **빌드**: Vite 빌드 도구
- **린팅**: ESLint 설정 완료
- **스타일링**: TailwindCSS 설정 완료

## 🚀 실행 준비 상태

### 백엔드 실행
```bash
cd BackEnd/hackerton
./mvnw spring-boot:run
```

### 프론트엔드 실행
```bash
cd FrontEnd/festival-frontend
npm install
npm run dev
```

### 데이터베이스 설정
1. MySQL 서버 실행 (localhost:3306)
2. `hackerton_festival` 데이터베이스 생성
3. `schema.sql` 실행하여 테이블 생성 및 샘플 데이터 삽입

## 📈 확장 가능성

### 현재 구현된 기능
- 기본적인 축제 조회 및 필터링
- 지역별, 카테고리별 검색
- 복합 조건 필터링

### 향후 확장 가능한 기능
- 🔄 축제 상세 정보 조회 API
- 🔄 축제 예측 및 분석 API
- 🔄 사용자 관리 및 인증
- 🔄 축제 즐겨찾기 기능
- 🔄 실시간 축제 정보 업데이트
- 🔄 축제 통계 및 대시보드
- 🔄 이미지 업로드 및 관리
- 🔄 축제 리뷰 및 평점 시스템

## 📁 프로젝트 구조

```
hackathon13/
├── BackEnd/
│   └── hackerton/
│       ├── src/main/java/com/example/hackerton/
│       │   ├── controller/FestivalController.java
│       │   ├── service/FestivalService.java
│       │   ├── domain/ (5개 도메인 클래스)
│       │   └── mapper/ (5개 매퍼 인터페이스)
│       ├── src/main/resources/
│       │   ├── application.yml
│       │   ├── schema.sql
│       │   └── mapper/ (5개 XML 매퍼 파일)
│       └── pom.xml
├── FrontEnd/
│   └── festival-frontend/
│       ├── src/
│       │   ├── components/ (3개 컴포넌트)
│       │   ├── pages/MainPage.jsx
│       │   ├── services/ (2개 서비스 파일)
│       │   └── App.jsx
│       └── package.json
├── backend.md
├── README.md
└── PROJECT_STATUS.md (현재 파일)
```

## 🎯 프로젝트 상태 요약

**✅ 완료 상태**: 기본적인 축제 관리 시스템의 핵심 기능이 완성되어 실행 가능한 상태입니다.

**🔧 기술적 완성도**: 
- 백엔드: Spring Boot 기반 REST API 완성
- 프론트엔드: React 기반 반응형 UI 완성
- 데이터베이스: 완전한 ERD 설계 및 샘플 데이터 준비

**🚀 배포 준비도**: 개발 환경에서 즉시 실행 가능한 상태

---

*이 문서는 프로젝트의 현재 상태를 정확히 반영하며, 향후 개발 진행에 따라 업데이트될 예정입니다.*
