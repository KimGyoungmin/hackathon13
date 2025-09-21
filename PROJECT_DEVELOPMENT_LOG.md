# 🚀 해커톤 프로젝트 개발 로그

## 📋 프로젝트 개요
- **프로젝트명**: 축제 관리 시스템
- **기간**: 2024년 9월
- **기술 스택**: Spring Boot + React + MySQL + MyBatis
- **목표**: CSV 데이터를 ERD 구조로 변환하여 축제 필터링 시스템 구축

---

## 🎯 주요 요청사항 및 진행 과정

### 1. 초기 프로젝트 상태 확인
**사용자 요청**: "현재 프로젝트 상태를 확인해줘"

**확인 결과**:
- 백엔드: Spring Boot 3.4.10, Java 17, Maven
- 프론트엔드: React 19.1.1, Vite, TailwindCSS
- 데이터베이스: MySQL, MyBatis ORM
- 아키텍처: Controller-Service-Mapper-Database 계층 구조

### 2. 프로젝트 상태 문서화
**사용자 요청**: "지금 프로젝트 상태를 md파일로 만들어서 저장해줘"

**결과**: `PROJECT_STATUS.md` 파일 생성
- 아키텍처 다이어그램
- 기술 스택 상세 정보
- 데이터베이스 설계
- API 엔드포인트 목록
- 기능 상태 요약

### 3. 데이터 관리 구조 개선
**사용자 요청**: "csv데이터를 넣을만한 공간을 찾고있었거든? 그럼니가 더 잘 인식할수있잖아"

**구현**:
```
data/
├── imports/     # CSV 데이터 및 변환 스크립트
├── exports/     # 추출된 데이터
└── sample/      # 샘플 데이터
```

### 4. 중복 파일 정리
**문제**: `application.yaml`과 `application.yml` 중복 파일 존재
**해결**: `application.yaml` 삭제, `application.yml` 유지

---

## 🔄 데이터베이스 재구성 과정

### 1. 기존 테이블 삭제 및 새 스키마 구축
**사용자 요청**: "mysql workbench에서 테이블을 전부 드랍하고 schema.sql에서 샘플데이터대신 데이타폴더에 넣은것을 사용해서 워크벤치 해커톤_페스티벌 스키마에 테이블을 구성하고싶어"

**진행 과정**:
1. CSV 파일 분석 (`해커톤데이터_20250919.csv` - 520개 축제 데이터)
2. Python 스크립트로 CSV → SQL 변환
3. ERD 구조에 맞는 테이블 설계

### 2. ERD 구조 설계
**사용자 요청**: "시/군 데이터를 넣을 로케이션 테이블도 추가해서 erd 생성할 계획이거든?"

**최종 ERD 구조**:
- `category` 테이블: 축제 카테고리 (5개)
- `location` 테이블: 지역 정보 (14개)
- `festival` 테이블: 축제 기본 정보 (520개)
- `festival_detail` 테이블: 축제 상세 통계 데이터
- `festival_log` 테이블: 예측 로그 데이터

---

## 🛠️ 트러블슈팅 과정

### 1. CSV 인코딩 문제
**에러**: `❌ 오류 발생: '축제명'`

**원인**: CSV 파일에 BOM(Byte Order Mark) 문자 포함
**해결**: Python 스크립트에서 `encoding='utf-8-sig'` 사용

```python
with open(csv_file, 'r', encoding='utf-8-sig') as file:  # BOM 제거
```

### 2. MySQL Workbench Safe Update Mode
**에러**: `Error Code: 1175. You are using safe update mode`

**해결 방법**:
- MySQL Workbench Preferences → SQL Editor → Safe Updates 비활성화
- 또는 `TRUNCATE TABLE` 사용

### 3. 테이블명/도메인명 불일치
**문제**: 
- `festival_location` vs `location`
- `FestivalLocation` vs `Location`
- `location_name` vs `location_nm`
- `festival_name` vs `festival_nm`

**해결 과정**:
1. 테이블명 통일: `festival_location` → `location`
2. 도메인 클래스명 통일: `FestivalLocation` → `Location`
3. 필드명 통일: `location_name` → `location_nm`
4. 모든 관련 파일 수정 (Controller, Service, Mapper, XML, React 컴포넌트)

### 4. 중복 클래스 에러
**에러**: `duplicate class: com.example.hackerton.domain.Location`

**원인**: `FestivalLocation.java`와 `Location.java` 동시 존재
**해결**: `FestivalLocation.java` 삭제

### 5. 파일명-클래스명 불일치
**에러**: `The public type LocationMapper must be defined in its own file`

**원인**: `FestivalLocationMapper.java` 파일에 `LocationMapper` 클래스 정의
**해결**: 파일명을 `LocationMapper.java`로 변경

---

## 📊 데이터 변환 과정

### 1. CSV 데이터 분석
**원본 데이터**: `해커톤데이터_20250919.csv`
- 520개 축제 레코드
- 27개 컬럼 (축제명, 방문자수, 예산, 날씨, 지역 등)

### 2. 지역 정보 자동 추출
**방법**: 축제명에서 지역명 추출
```python
location_mapping = {
    '강진': '강진군',
    '곡성': '곡성군', 
    '고흥': '고흥군',
    # ... 14개 지역
}
```

### 3. 외래키 매핑
**구현**: 카테고리와 지역 ID 자동 매핑
```python
category_id = category_list.index(festival['category_nm']) + 1
location_id = location_list.index(festival['location_nm']) + 1
```

### 4. 최종 결과물
**생성 파일**: `full_festival_data_erd.sql`
- 5개 카테고리 INSERT
- 14개 지역 INSERT  
- 520개 축제 INSERT
- 520개 축제 상세 INSERT
- 총 1,072줄의 SQL 스크립트

---

## 🔧 코드 수정 내역

### 백엔드 수정사항
1. **도메인 클래스**:
   - `FestivalLocation.java` → `Location.java`
   - `festivalName` → `festivalNm`
   - `locationName` → `locationNm`

2. **Mapper 인터페이스**:
   - `FestivalLocationMapper.java` → `LocationMapper.java`
   - import 경로 수정

3. **Service 클래스**:
   - `FestivalService.java`에서 모든 참조 수정
   - `FestivalLocation` → `Location`

4. **Controller 클래스**:
   - `FestivalController.java`에서 반환 타입 수정

5. **Mapper XML**:
   - `FestivalLocationMapper.xml` → `LocationMapper.xml`
   - 테이블명 및 컬럼명 수정

### 프론트엔드 수정사항
1. **LocationFilter.jsx**: `locationName` → `locationNm`
2. **FestivalList.jsx**: `festivalName` → `festivalNm`  
3. **MainPage.jsx**: 지역명 참조 수정

---

## 📁 최종 파일 구조

### 백엔드
```
BackEnd/hackerton/src/main/
├── java/com/example/hackerton/
│   ├── controller/FestivalController.java
│   ├── service/FestivalService.java
│   ├── mapper/
│   │   ├── LocationMapper.java
│   │   ├── FestivalMapper.java
│   │   ├── CategoryMapper.java
│   │   ├── FestivalDetailMapper.java
│   │   └── FestivalLogMapper.java
│   └── domain/
│       ├── Location.java
│       ├── Festival.java
│       ├── Category.java
│       ├── FestivalDetail.java
│       └── FestivalLog.java
└── resources/
    ├── application.yml
    ├── schema.sql
    └── mapper/
        ├── LocationMapper.xml
        ├── FestivalMapper.xml
        ├── CategoryMapper.xml
        ├── FestivalDetailMapper.xml
        └── FestivalLogMapper.xml
```

### 프론트엔드
```
FrontEnd/festival-frontend/src/
├── components/
│   ├── LocationFilter.jsx
│   ├── FestivalList.jsx
│   └── CategoryFilter.jsx
├── pages/MainPage.jsx
├── services/
│   ├── api.js
│   └── festivalService.js
└── App.jsx
```

### 데이터
```
data/
└── imports/
    ├── 해커톤데이터_20250919.csv
    ├── convert_csv_to_erd_structure.py
    └── full_festival_data_erd.sql
```

---

## ✅ 완료된 작업

1. ✅ **프로젝트 구조 정리**: 중복 파일 삭제, 폴더 구조 개선
2. ✅ **데이터베이스 설계**: ERD 기반 정규화된 테이블 구조
3. ✅ **데이터 변환**: CSV → SQL 자동 변환 스크립트
4. ✅ **코드 일관성**: 모든 파일에서 네이밍 통일
5. ✅ **에러 해결**: 컴파일 에러, 런타임 에러 모두 해결
6. ✅ **문서화**: 프로젝트 상태 및 개발 과정 기록

---

## 🚀 다음 단계

1. **MySQL Workbench에서 실행**:
   - `schema.sql` → 테이블 구조 생성
   - `full_festival_data_erd.sql` → 데이터 삽입

2. **애플리케이션 실행**:
   - 백엔드: `./mvnw spring-boot:run`
   - 프론트엔드: `npm run dev`

3. **테스트 및 검증**:
   - API 엔드포인트 테스트
   - 프론트엔드 필터링 기능 테스트

---

## 💡 학습된 내용

1. **데이터 정규화**: ERD 설계를 통한 테이블 구조 최적화
2. **데이터 변환**: CSV 데이터의 자동 SQL 변환 방법
3. **네이밍 컨벤션**: 일관된 네이밍의 중요성
4. **트러블슈팅**: 단계별 문제 해결 과정
5. **문서화**: 개발 과정 기록의 중요성

---

*이 문서는 해커톤 프로젝트의 전체 개발 과정을 기록한 것으로, 향후 유사한 프로젝트 진행 시 참고 자료로 활용할 수 있습니다.*
