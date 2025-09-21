-- 해커톤 축제 데이터베이스 스키마
-- 새로운 ERD 구조 반영 (festival_location 테이블 추가)

USE hackerton_festival;

-- 기존 테이블 삭제 (외래키 제약조건 때문에 순서 중요)
DROP TABLE IF EXISTS festival_log;
DROP TABLE IF EXISTS festival_detail;
DROP TABLE IF EXISTS festival;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS category;

-- 축제 카테고리 테이블
CREATE TABLE category (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_nm VARCHAR(50) NOT NULL COMMENT '축제 카테고리명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 축제 위치 테이블 (ERD에 맞게)
CREATE TABLE location (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location_nm VARCHAR(100) NOT NULL COMMENT '지역 시/군명'
);

-- 축제 메인 테이블
CREATE TABLE festival (
    festival_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    festival_nm VARCHAR(200) NOT NULL COMMENT '축제명',
    category_id BIGINT COMMENT '축제 카테고리 ID',
    location_id BIGINT COMMENT '축제 위치 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (location_id) REFERENCES location(location_id)
);

-- 축제 상세 정보 테이블
CREATE TABLE festival_detail (
    festival_detail_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '축제 상세 정보 고유 ID',
    festival_id BIGINT NOT NULL COMMENT '축제 ID (외래키)',
    total_visitors INT COMMENT '전체 방문자수',
    avg_daily_visitors INT COMMENT '일평균 방문자 수',
    duration_days INT COMMENT '기간일수(축제 기간)',
    weekend_days INT COMMENT '주말일수',
    lodging_days INT COMMENT '숙박일수',
    lodging_visitor_ratio DOUBLE COMMENT '숙박형 방문객 비율',
    avg_spend_per_day_krw INT COMMENT '1일 평균 지출액',
    stay_days_weight DOUBLE COMMENT '체류일수 가중치',
    avg_temp_c DOUBLE COMMENT '평균기온',
    total_precip_mm DOUBLE COMMENT '강수량',
    sunshine_hours DOUBLE COMMENT '일조시간(시간)',
    traffic_congestion_index DOUBLE COMMENT '교통 접근성 지수',
    regional_pop_thousands INT COMMENT '지역 인구수(천명)',
    grdp_per_capita_mkrw DOUBLE COMMENT '지역 인당 GRDP',
    program_count INT COMMENT '프로그램 수',
    promo_intensity_index DOUBLE COMMENT '홍보 강도 지수',
    budget_krw BIGINT COMMENT '축제 예산',
    year INT COMMENT '개최연도',
    gross_sales BIGINT COMMENT '총 매출',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (festival_id) REFERENCES festival(festival_id) ON DELETE CASCADE
);

-- 축제 예측 로그 테이블
CREATE TABLE festival_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    festival_id BIGINT COMMENT '축제 ID',
    promo_increase INT COMMENT '홍보 상승량',
    budget_increase BIGINT COMMENT '예산 상승량',
    forecast_visitors INT COMMENT '예측 인원',
    forecast_revenue BIGINT COMMENT '예측 매출',
    create_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '입력 날짜',
    FOREIGN KEY (festival_id) REFERENCES festival(festival_id)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_festival_category ON festival(category_id);
CREATE INDEX idx_festival_location ON festival(location_id);
CREATE INDEX idx_festival_detail_festival ON festival_detail(festival_id);
CREATE INDEX idx_festival_detail_year ON festival_detail(year);
CREATE INDEX idx_festival_log_festival ON festival_log(festival_id);
CREATE INDEX idx_location_name ON location(location_nm);
