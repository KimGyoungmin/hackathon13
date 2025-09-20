-- 축제 관리 시스템 데이터베이스 스키마
-- ERD에 기반한 테이블 생성 스크립트

-- 카테고리 테이블
CREATE TABLE category (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_nm VARCHAR(100) NOT NULL COMMENT '카테고리명'
);

-- 지역 테이블
CREATE TABLE festival_location (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location_nm VARCHAR(100) NOT NULL COMMENT '지역 시/군명'
);

-- 축제 테이블
CREATE TABLE festival (
    festival_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL COMMENT '카테고리 ID',
    location_id BIGINT NOT NULL COMMENT '지역 ID',
    festival_nm VARCHAR(200) NOT NULL COMMENT '축제명',
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (location_id) REFERENCES festival_location(location_id)
);

-- 축제 상세 정보 테이블
CREATE TABLE festival_detail (
    festival_id BIGINT PRIMARY KEY COMMENT '축제 ID',
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
    local_population INT COMMENT '지역 인구수(천명)',
    grdp_per_capita_mkrw DOUBLE COMMENT '지역 인당 GRDP',
    program_count INT COMMENT '프로그램 수',
    promo_intensity_index DOUBLE COMMENT '홍보 강도 지수',
    budget_krw INT COMMENT '축제 예산',
    year INT COMMENT '개최연도',
    gross_sales INT COMMENT '총 매출',
    FOREIGN KEY (festival_id) REFERENCES festival(festival_id)
);

-- 축제 예측 로그 테이블
CREATE TABLE festival_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    festival_id BIGINT NOT NULL COMMENT '축제 ID',
    promo_increase DOUBLE COMMENT '홍보 상승량',
    budget_increase DOUBLE COMMENT '예산 상승량',
    promo_increase_rate DOUBLE COMMENT '홍보 상승량 비율',
    budget_increase_rate DOUBLE COMMENT '예산 상승량 비율',
    evidence_summary TEXT COMMENT '판단 근거 내용',
    forecast_revenue INT COMMENT '예측 매출',
    forecast_visitors INT COMMENT '예측 인원',
    create_dt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '입력 날짜',
    del_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부',
    FOREIGN KEY (festival_id) REFERENCES festival(festival_id)
);

-- 샘플 데이터 삽입
INSERT INTO category (category_nm) VALUES 
('문화예술'),
('음식'),
('스포츠'),
('전통'),
('국제');

INSERT INTO festival (category_id, festival_nm) VALUES 
(1, '부산국제영화제'),
(2, '전주비빔밥축제'),
(3, '서울마라톤'),
(4, '안동하회탈춤축제'),
(5, '서울국제음식축제');

INSERT INTO festival_detail (
    festival_id, total_visitors, avg_daily_visitors, duration_days, weekend_days,
    lodging_days, lodging_visitor_ratio, avg_spend_per_day_krw, stay_days_weight,
    avg_temp_c, total_precip_mm, sunshine_hours, traffic_congestion_index,
    local_population, grdp_per_capita_mkrw, program_count, promo_intensity_index,
    budget_krw, year, gross_sales
) VALUES 
(1, 150000, 15000, 10, 4, 3, 0.7, 50000, 1.2, 22.5, 15.2, 8.5, 0.8, 3500, 45.2, 25, 0.9, 2000000000, 2023, 5000000000),
(2, 80000, 8000, 10, 4, 2, 0.6, 30000, 1.1, 18.3, 8.7, 7.2, 0.6, 1200, 35.8, 15, 0.7, 800000000, 2023, 2000000000),
(3, 200000, 20000, 1, 1, 1, 0.8, 40000, 1.0, 15.2, 5.1, 9.1, 0.9, 10000, 55.3, 5, 0.95, 1500000000, 2023, 8000000000),
(4, 60000, 6000, 10, 4, 2, 0.5, 25000, 1.0, 20.1, 12.3, 6.8, 0.4, 800, 28.5, 12, 0.6, 500000000, 2023, 1500000000),
(5, 120000, 12000, 7, 2, 2, 0.7, 45000, 1.1, 19.8, 10.5, 7.5, 0.7, 10000, 55.3, 20, 0.8, 1200000000, 2023, 3500000000);

INSERT INTO festival_log (
    festival_id, promo_increase, budget_increase, promo_increase_rate, budget_increase_rate,
    evidence_summary, forecast_revenue, forecast_visitors, create_dt, del_yn
) VALUES 
(1, 100000000, 200000000, 0.1, 0.2, '영화제 인지도 상승 및 해외 관광객 증가 예상', 6000000000, 180000, '2023-12-01 10:00:00', 'N'),
(2, 50000000, 100000000, 0.15, 0.25, '전통 음식에 대한 관심 증가 및 지역 관광 활성화', 2500000000, 95000, '2023-12-01 11:00:00', 'N'),
(3, 200000000, 300000000, 0.2, 0.3, '마라톤 참가자 증가 및 체육관광 트렌드', 10000000000, 250000, '2023-12-01 12:00:00', 'N');
