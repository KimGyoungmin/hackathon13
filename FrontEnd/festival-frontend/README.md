# 축제 관리 시스템 - 프론트엔드

## 프로젝트 개요
- **프로젝트명**: festival-frontend (축제 관리 시스템 프론트엔드)
- **프레임워크**: React 19.1.1
- **빌드 도구**: Vite 7.1.6
- **스타일링**: Tailwind CSS 4.1.13
- **HTTP 클라이언트**: Axios 1.12.2
- **라우팅**: React Router DOM 7.9.1

## 기술 스택

### 핵심 의존성
- **React**: 사용자 인터페이스 라이브러리
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Axios**: HTTP 클라이언트 라이브러리
- **React Router DOM**: 클라이언트 사이드 라우팅

### 개발 환경 설정
- **개발 서버 포트**: 5173 (Vite 기본값)
- **백엔드 API**: http://localhost:8080/api
- **문자 인코딩**: UTF-8

## 아키텍처 패턴

### 컴포넌트 기반 아키텍처
```
Pages (페이지 컴포넌트)
    ↓
Components (재사용 가능한 컴포넌트)
    ↓
Services (API 통신 레이어)
    ↓
Backend API (Spring Boot)
```

## 폴더 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── LocationFilter.jsx    # 지역 필터링 컴포넌트
│   ├── CategoryFilter.jsx    # 카테고리 필터링 컴포넌트
│   └── FestivalList.jsx      # 축제 목록 컴포넌트
├── pages/               # 페이지 컴포넌트
│   └── MainPage.jsx          # 메인 페이지
├── services/            # API 서비스 레이어
│   ├── api.js               # Axios 기본 설정
│   └── festivalService.js   # 축제 관련 API 서비스
├── hooks/               # 커스텀 훅 (향후 확장)
├── utils/               # 유틸리티 함수 (향후 확장)
├── App.jsx             # 메인 애플리케이션 컴포넌트
├── main.jsx            # 애플리케이션 진입점
└── index.css           # Tailwind CSS 설정
```

## 주요 기능

### 1. 축제 필터링 시스템
- **지역 필터링**: 시/군별 축제 검색
- **카테고리 필터링**: 축제 카테고리별 분류 (다중 선택 가능)
- **복합 조건 필터링**: 지역 + 카테고리 동시 필터링

### 2. 사용자 인터페이스
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **모던 UI**: Tailwind CSS를 활용한 깔끔한 디자인
- **로딩 상태**: 사용자 경험을 위한 로딩 인디케이터
- **에러 처리**: 친화적인 에러 메시지 표시

### 3. 상태 관리
- **React Hooks**: useState, useEffect를 활용한 상태 관리
- **컴포넌트 간 통신**: Props를 통한 데이터 전달
- **비동기 처리**: async/await를 활용한 API 호출

## API 통신

### 백엔드 연동
- **Base URL**: http://localhost:8080/api
- **요청/응답 인터셉터**: 로깅 및 에러 처리
- **타임아웃**: 10초

### 주요 API 엔드포인트
- `GET /locations` - 모든 지역 정보 조회
- `GET /festivals/location/{locationId}` - 특정 지역의 축제 조회
- `GET /festivals/filter` - 지역과 카테고리로 축제 필터링

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

### 4. 빌드 결과 미리보기
```bash
npm run preview
```

## 개발 가이드라인

### 1. 컴포넌트 설계 원칙
- **단일 책임 원칙**: 각 컴포넌트는 하나의 기능만 담당
- **재사용성**: Props를 통한 유연한 컴포넌트 설계
- **가독성**: 명확한 변수명과 함수명 사용

### 2. 스타일링 가이드
- **Tailwind CSS**: 유틸리티 클래스 우선 사용
- **커스텀 클래스**: 반복되는 스타일은 @layer components로 정의
- **반응형**: 모바일 우선 설계

### 3. API 통신 패턴
- **서비스 레이어**: API 호출 로직을 별도 서비스로 분리
- **에러 처리**: try-catch를 통한 적절한 에러 처리
- **로딩 상태**: 사용자 피드백을 위한 로딩 상태 관리

## 확장 가능성

### 현재 구현된 기능
- 기본적인 축제 조회 및 필터링
- 지역별, 카테고리별 검색
- 반응형 UI 디자인

### 향후 확장 가능한 기능
- 축제 상세 정보 페이지
- 축제 즐겨찾기 기능
- 사용자 인증 및 권한 관리
- 실시간 알림 기능
- 다국어 지원
- 다크 모드 지원