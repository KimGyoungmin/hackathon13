# 📁 프로젝트 구조 가이드

## 🏗️ 전체 프로젝트 구조

```
hackathon13/
├── 📁 BackEnd/                          # 백엔드 (Spring Boot)
│   └── hackerton/
│       ├── src/main/java/com/example/hackerton/
│       │   ├── 🎯 HackertonApplication.java    # 메인 애플리케이션
│       │   ├── 📁 controller/
│       │   │   └── FestivalController.java     # REST API 컨트롤러
│       │   ├── 📁 service/
│       │   │   └── FestivalService.java        # 비즈니스 로직
│       │   ├── 📁 domain/                      # 도메인 모델
│       │   │   ├── Festival.java
│       │   │   ├── Location.java
│       │   │   ├── Category.java
│       │   │   ├── FestivalDetail.java
│       │   │   └── FestivalLog.java
│       │   └── 📁 mapper/                      # MyBatis 매퍼
│       │       ├── FestivalMapper.java
│       │       ├── LocationMapper.java
│       │       ├── CategoryMapper.java
│       │       ├── FestivalDetailMapper.java
│       │       └── FestivalLogMapper.java
│       ├── src/main/resources/
│       │   ├── application.yml                 # Spring Boot 설정
│       │   ├── schema.sql                      # 데이터베이스 스키마
│       │   └── 📁 mapper/                      # MyBatis XML 매퍼
│       │       ├── FestivalMapper.xml
│       │       ├── LocationMapper.xml
│       │       ├── CategoryMapper.xml
│       │       ├── FestivalDetailMapper.xml
│       │       └── FestivalLogMapper.xml
│       ├── pom.xml                            # Maven 의존성
│       └── HELP.md                            # Maven 도움말
│
├── 📁 FrontEnd/                           # 프론트엔드 (React + Vite)
│   └── festival-dashboard/
│       ├── src/
│       │   ├── 🎯 App.jsx                    # 메인 앱 컴포넌트
│       │   ├── main.jsx                      # 앱 진입점
│       │   ├── index.css                     # 글로벌 스타일
│       │   ├── App.css                       # 앱 스타일
│       │   ├── 📁 components/                # React 컴포넌트
│       │   │   ├── Header/
│       │   │   │   ├── Header.jsx
│       │   │   │   └── Header.css
│       │   │   ├── MainLayout/
│       │   │   │   ├── MainLayout.jsx
│       │   │   │   └── MainLayout.css
│       │   │   ├── FilterPanel/
│       │   │   │   ├── FilterPanel.jsx
│       │   │   │   └── FilterPanel.css
│       │   │   ├── MapPanel/
│       │   │   │   ├── MapPanel.jsx
│       │   │   │   └── MapPanel.css
│       │   │   └── ChartPanel/
│       │   │       ├── ChartPanel.jsx
│       │   │       └── ChartPanel.css
│       │   ├── 📁 contexts/                  # Context API
│       │   │   └── AppContext.jsx            # 전역 상태 관리
│       │   ├── 📁 hooks/                     # 커스텀 훅
│       │   │   ├── useApi.js                 # API 호출 훅
│       │   │   ├── useFestivals.js           # 축제 데이터 훅
│       │   │   └── useChartData.js           # 차트 데이터 훅
│       │   ├── 📁 services/                  # API 서비스
│       │   │   ├── api.js                    # API 클라이언트
│       │   │   └── festivalService.js        # 축제 API 서비스
│       │   └── 📁 assets/                    # 정적 자산
│       │       └── react.svg
│       ├── public/
│       │   └── vite.svg
│       ├── package.json                      # npm 의존성
│       ├── vite.config.js                    # Vite 설정
│       ├── eslint.config.js                  # ESLint 설정
│       ├── .env.local                        # 환경변수 (로컬)
│       ├── env.example                       # 환경변수 예시
│       ├── API_SETUP.md                      # API 설정 가이드
│       └── STATE_MANAGEMENT_GUIDE.md         # 상태 관리 가이드
│
├── 📁 data/                                 # 데이터 파일
│   ├── imports/
│   │   ├── 해커톤데이터_20250919.csv         # 원본 CSV 데이터
│   │   ├── convert_csv_to_erd_structure.py   # CSV 변환 스크립트
│   │   └── full_festival_data_erd.sql        # ERD 구조 SQL
│   ├── exports/                             # 내보낸 데이터
│   └── sample/                              # 샘플 데이터
│
├── 📄 README.md                             # 프로젝트 메인 문서
├── 📄 FESTIVAL_DASHBOARD_PRD.md             # PRD 문서
├── 📄 backend.md                            # 백엔드 아키텍처 문서
├── 📄 ARCHITECTURE_DESIGN.md                # 전체 아키텍처 설계
├── 📄 API_FLOW_DIAGRAM.md                   # API 플로우 다이어그램
├── 📄 KAKAO_MAP_INTEGRATION.md              # 카카오맵 통합 가이드
├── 📄 PROJECT_DEVELOPMENT_LOG.md            # 개발 로그
├── 📄 PROJECT_STATUS.md                     # 프로젝트 상태
└── 📄 PROJECT_STRUCTURE.md                  # 이 파일
```

## 🚀 빠른 시작 가이드

### 1. 백엔드 실행
```bash
cd BackEnd/hackerton
./mvnw spring-boot:run
```
- 서버 주소: http://localhost:8080
- API 문서: http://localhost:8080/api/filters

### 2. 프론트엔드 실행
```bash
cd FrontEnd/festival-dashboard
npm install
npm run dev
```
- 개발 서버: http://localhost:5173

### 3. 환경변수 설정
```bash
# FrontEnd/festival-dashboard/.env.local
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=false
VITE_DEBUG_MODE=false
```

## 📋 주요 기능

### 🎯 백엔드 (Spring Boot)
- ✅ REST API 엔드포인트
- ✅ MyBatis 데이터 매핑
- ✅ MySQL 데이터베이스 연동
- ✅ CORS 설정
- ✅ 520개 축제 데이터 제공

### 🎨 프론트엔드 (React)
- ✅ 3분할 레이아웃 (필터/지도/차트)
- ✅ Context API 상태 관리
- ✅ API 클라이언트 및 에러 처리
- ✅ 반응형 디자인
- ✅ Chart.js 차트 통합

### 🗺️ 지도 기능 (예정)
- ⏳ 카카오맵 API 통합
- ⏳ 축제 마커 표시
- ⏳ 마커 클릭 이벤트

## 🔧 기술 스택

### 백엔드
- **Spring Boot 3.4.10**
- **Java 22**
- **MySQL**
- **MyBatis 3.0.5**
- **Maven**

### 프론트엔드
- **React 19.1.1**
- **Vite**
- **Chart.js**
- **Context API + useReducer**
- **CSS Modules**

## 📚 문서 가이드

| 문서 | 설명 |
|------|------|
| `README.md` | 프로젝트 개요 및 설치 가이드 |
| `FESTIVAL_DASHBOARD_PRD.md` | 상세 요구사항 정의서 |
| `backend.md` | 백엔드 아키텍처 및 API 문서 |
| `ARCHITECTURE_DESIGN.md` | 전체 시스템 아키텍처 설계 |
| `API_FLOW_DIAGRAM.md` | API 플로우 다이어그램 |
| `KAKAO_MAP_INTEGRATION.md` | 카카오맵 통합 가이드 |
| `PROJECT_DEVELOPMENT_LOG.md` | 개발 과정 로그 |
| `PROJECT_STATUS.md` | 현재 프로젝트 상태 |

## 🎯 다음 단계

1. **카카오맵 API 통합**
   - 개발자 계정 생성
   - API 키 발급
   - MapPanel 컴포넌트 업데이트

2. **성능 최적화**
   - 이미지 최적화
   - 코드 스플리팅
   - 캐싱 전략

3. **추가 기능**
   - 사용자 인증
   - 즐겨찾기 기능
   - 실시간 업데이트
