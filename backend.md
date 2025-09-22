# 백엔드 아키텍처 문서

## 프로젝트 개요
- **프로젝트명**: hackerton (축제 관리 시스템)
- **프레임워크**: Spring Boot 3.4.10
- **Java 버전**: 17
- **데이터베이스**: MySQL
- **빌드 도구**: Maven
- **패키지 구조**: `com.example.hackerton`

## 기술 스택

### 핵심 의존성
- **Spring Boot Starter Web**: REST API 개발
- **MyBatis Spring Boot Starter**: 데이터베이스 매핑 (버전 3.0.5)
- **MySQL Connector**: MySQL 데이터베이스 연결
- **Lombok**: 보일러플레이트 코드 자동 생성
- **Spring Boot DevTools**: 개발 편의성 도구

### 개발 환경 설정
- **서버 포트**: 8080
- **데이터베이스**: `hackerton_festival` (localhost:3306)
- **타임존**: Asia/Seoul
- **문자 인코딩**: UTF-8

## 아키텍처 패턴

### 레이어드 아키텍처
```
Controller Layer (REST API)
    ↓
Service Layer (비즈니스 로직)
    ↓
Mapper Layer (데이터 접근)
    ↓
Database (MySQL)
```

## 패키지 구조

```
com.example.hackerton/
├── HackertonApplication.java          # 메인 애플리케이션
├── controller/
│   └── FestivalController.java        # REST API 컨트롤러
├── service/
│   └── FestivalService.java           # 비즈니스 로직
├── domain/
│   ├── Festival.java                  # 축제 도메인
│   ├── FestivalLocation.java          # 지역 도메인
│   ├── Category.java                  # 카테고리 도메인
│   ├── FestivalDetail.java            # 축제 상세 도메인
│   └── FestivalLog.java               # 축제 로그 도메인
└── mapper/
    ├── FestivalMapper.java            # 축제 데이터 매퍼
    ├── FestivalLocationMapper.java    # 지역 데이터 매퍼
    ├── CategoryMapper.java            # 카테고리 데이터 매퍼
    ├── FestivalDetailMapper.java      # 축제 상세 데이터 매퍼
    └── FestivalLogMapper.java         # 축제 로그 데이터 매퍼
```

## 데이터베이스 설계

### 주요 테이블
1. **category**: 축제 카테고리 (문화예술, 음식, 스포츠, 전통, 국제)
2. **festival_location**: 축제 개최 지역 정보
3. **festival**: 축제 기본 정보
4. **festival_detail**: 축제 상세 정보 (방문객, 예산, 기상 정보 등)
5. **festival_log**: 축제 예측 및 로그 데이터

### ERD 관계
- `festival` ← `category` (Many-to-One)
- `festival` ← `festival_location` (Many-to-One)
- `festival_detail` ← `festival` (One-to-One)
- `festival_log` ← `festival` (One-to-Many)

## API 엔드포인트

### 기본 조회 API
- **GET** `/api/locations` - 모든 지역 정보 조회
- **GET** `/api/festivals/location/{locationId}` - 특정 지역의 축제 조회
- **GET** `/api/festivals/filter` - 지역과 카테고리로 축제 필터링
- **GET** `/api/filters` - 필터 옵션 조회 (지역, 카테고리, 연도)

### 축제 정보 API
- **GET** `/api/festivals` - 축제 목록 조회 (필터링 지원)
- **GET** `/api/festivals/{id}` - 특정 축제의 상세 정보 조회
- **GET** `/api/festivals/unique` - 중복 제거된 고유 축제 목록 조회
- **GET** `/api/festivals/{id}/yearly-stats` - 특정 축제의 연도별 통계 조회

### 통계 및 분석 API
- **GET** `/api/festivals/statistics` - 축제별 년도별 통계 데이터 조회
- **GET** `/api/festivals/details` - 축제별 년도별 상세 데이터 조회

### API 파라미터
- `locationId`: 지역 ID (Long)
- `categoryIds`: 카테고리 ID 리스트 (다중 선택 가능, 쉼표 구분)
- `festivalNames`: 축제명 리스트 (다중 선택 가능)
- `years`: 연도 리스트 (다중 선택 가능)
- `regions`: 지역 ID 리스트 (쉼표로 구분)
- `categories`: 카테고리 ID 리스트 (쉼표로 구분)
- `search`: 검색어

## 주요 기능

### 1. 축제 필터링 시스템
- 시/군별 축제 검색
- 카테고리별 축제 분류
- 복합 조건 필터링 (지역 + 카테고리 + 연도 + 검색어)
- 중복 제거된 고유 축제 목록 제공

### 2. 축제 상세 정보 관리
- 축제 기본 정보 조회
- 축제별 연도별 상세 데이터 관리
- 예산, 홍보 강도, 방문객 수, 매출 등 상세 정보 제공
- 축제 통계 데이터 분석

### 3. 통계 및 분석 기능
- 축제별 년도별 통계 데이터 제공
- 방문객 수, 매출, 예산 등 주요 지표 분석
- 다중 축제 및 다중 연도 비교 분석 지원

### 4. 데이터 접근 계층
- MyBatis를 활용한 SQL 매핑
- XML 기반 쿼리 관리 (`src/main/resources/mapper/`)
- 트랜잭션 관리 (`@Transactional`)

### 5. 로깅 및 디버깅
- MyBatis SQL 로그 출력 활성화
- 개발 시 SQL 쿼리 모니터링 가능

## 설정 정보

### MyBatis 설정
- **매퍼 위치**: `classpath:mapper/*.xml`
- **타입 별칭**: `com.example.hackerton.domain`
- **네이밍 규칙**: 스네이크_케이스 → 카멜케이스 자동 변환
- **SQL 로깅**: 표준 출력으로 SQL 쿼리 표시

### 데이터베이스 초기화
- `schema.sql`을 통한 테이블 생성
- 샘플 데이터 자동 삽입
- 초기화 모드: `never` (수동 설정 시 `always`)

## 개발 가이드라인

### 1. 코드 스타일
- Lombok 애노테이션 활용 (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`)
- 서비스 계층에서 트랜잭션 관리
- 읽기 전용 트랜잭션 명시 (`@Transactional(readOnly = true)`)

### 2. API 설계 원칙
- RESTful API 설계
- 명확한 엔드포인트 네이밍
- 적절한 HTTP 메서드 사용
- 상세한 JavaDoc 주석

### 3. 에러 처리
- 서비스 계층에서 비즈니스 로직 검증
- 적절한 예외 처리 메커니즘

## 확장 가능성

### 현재 구현된 기능
- 축제 조회 및 필터링 (지역, 카테고리, 연도, 검색어)
- 축제 상세 정보 API
- 축제 통계 및 분석 API
- 중복 제거된 고유 축제 목록
- 축제별 연도별 상세 데이터 제공
- 다중 조건 필터링 지원

### 향후 확장 가능한 기능
- 축제 예측 및 시뮬레이션 API
- 머신러닝 기반 방문객 수 예측
- 사용자 관리 및 인증
- 축제 즐겨찾기 기능
- 실시간 축제 정보 업데이트
- 대시보드용 실시간 데이터 스트리밍
- 축제 추천 시스템