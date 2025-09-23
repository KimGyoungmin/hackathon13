-- 해커톤 축제 데이터베이스 스키마
-- 새로운 ERD 구조 반영 (festival_location 테이블 추가)

USE hackerton_festival;

-- 기존 테이블 삭제 (외래키 제약조건 때문에 순서 중요)
DROP TABLE IF EXISTS festival_log_detail;
DROP TABLE IF EXISTS festival_log;
DROP TABLE IF EXISTS festival_detail;
DROP TABLE IF EXISTS festival;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS predict_type;

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

-- 예측 타입 테이블
CREATE TABLE predict_type (
    type_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_nm VARCHAR(50) NOT NULL COMMENT '예측 타입명 (예산, 홍보지수, 교통량, 프로그램수)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    festival_detail_id BIGINT NOT NULL COMMENT '축제 상세 정보 ID',
    forecast_revenue BIGINT COMMENT '예측 매출',
    forecast_visitors INT COMMENT '예측 방문자 수',
    created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (시,분,초 포함)',
    del_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y/N)',
    FOREIGN KEY (festival_detail_id) REFERENCES festival_detail(festival_detail_id) ON DELETE CASCADE
);

-- 축제 예측 로그 상세 테이블
CREATE TABLE festival_log_detail (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    log_id BIGINT NOT NULL COMMENT '예측 로그 ID',
    type_id BIGINT NOT NULL COMMENT '예측 타입 ID',
    increase_val DECIMAL(10,2) COMMENT '증가값 (소수점 포함)',
    increase_rate DECIMAL(10,2) COMMENT '증가율 (소수점 포함)',
    visitor_evidence_summary TEXT COMMENT '예상 방문객 수 예측 근거',
    revenue_evidence_summary TEXT COMMENT '예상 매출 예측 근거',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES festival_log(log_id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES predict_type(type_id)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_festival_category ON festival(category_id);
CREATE INDEX idx_festival_location ON festival(location_id);
CREATE INDEX idx_festival_detail_festival ON festival_detail(festival_id);
CREATE INDEX idx_festival_detail_year ON festival_detail(year);
CREATE INDEX idx_festival_log_detail ON festival_log(festival_detail_id);
CREATE INDEX idx_festival_log_detail_log ON festival_log_detail(log_id);
CREATE INDEX idx_festival_log_detail_type ON festival_log_detail(type_id);
CREATE INDEX idx_location_name ON location(location_nm);
CREATE INDEX idx_predict_type_name ON predict_type(type_nm);

-- 기본 데이터 삽입
-- 축제 카테고리 데이터 삽입
INSERT INTO category (category_nm) VALUES
('일반/기타'),
('문화/역사'),
('자연/계절');

-- 축제 위치 데이터 삽입
INSERT INTO location (location_nm) VALUES
('영암군'),
('장흥군'),
('보성군'),
('진도군');

-- 예측 타입 데이터 삽입
INSERT INTO predict_type (type_nm) VALUES
('budget'),
('promotion'),
('traffic'),
('program');

-- 축제 기본 정보 삽입
INSERT INTO festival (festival_nm, category_id, location_id) VALUES
('영암왕인문화축제', (SELECT category_id FROM category WHERE category_nm = '일반/기타'), (SELECT location_id FROM location WHERE location_nm = '영암군')),
('정남진장흥물축제', (SELECT category_id FROM category WHERE category_nm = '문화/역사'), (SELECT location_id FROM location WHERE location_nm = '장흥군')),
('보성벚꽃축제', (SELECT category_id FROM category WHERE category_nm = '자연/계절'), (SELECT location_id FROM location WHERE location_nm = '보성군')),
('진도신비의바닷길축제', (SELECT category_id FROM category WHERE category_nm = '일반/기타'), (SELECT location_id FROM location WHERE location_nm = '진도군'));

-- 축제 상세 정보 삽입
INSERT INTO festival_detail (festival_id, total_visitors, avg_daily_visitors, duration_days, weekend_days, lodging_days, lodging_visitor_ratio, avg_spend_per_day_krw, stay_days_weight, avg_temp_c, total_precip_mm, sunshine_hours, traffic_congestion_index, regional_pop_thousands, grdp_per_capita_mkrw, program_count, promo_intensity_index, budget_krw, year, gross_sales) VALUES
-- 영암왕인문화축제 (2017-2024)
((SELECT festival_id FROM festival WHERE festival_nm = '영암왕인문화축제'), 201459, 50364, 4, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.39, 70000000, 2017, 1775659626),
((SELECT festival_id FROM festival WHERE festival_nm = '영암왕인문화축제'), 323224, 53870, 6, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.64, 110000000, 2018, 2299092312),
((SELECT festival_id FROM festival WHERE festival_nm = '영암왕인문화축제'), 244832, 40805, 6, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.48, 90000000, 2019, 2209119136),
((SELECT festival_id FROM festival WHERE festival_nm = '영암왕인문화축제'), 332750, 66550, 5, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.66, 120000000, 2020, 2688952750),
((SELECT festival_id FROM festival WHERE festival_nm = '영암왕인문화축제'), 438511, 109627, 4, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.88, 170000000, 2021, 3460290301),
((SELECT festival_id FROM festival WHERE festival_nm = '영암왕인문화축제'), 441674, 73612, 6, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.88, 140000000, 2022, 3250720640),
((SELECT festival_id FROM festival WHERE festival_nm = '영암왕인문화축제'), 469947, 156649, 3, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.94, 150000000, 2023, 3843226566),
((SELECT festival_id FROM festival WHERE festival_nm = '영암왕인문화축제'), 192324, 64108, 3, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.37, 60000000, 2024, 1647832032),

-- 정남진장흥물축제 (2017-2024)
((SELECT festival_id FROM festival WHERE festival_nm = '정남진장흥물축제'), 200497, 66832, 3, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.39, 70000000, 2017, 1994544156),
((SELECT festival_id FROM festival WHERE festival_nm = '정남진장흥물축제'), 382453, 76490, 5, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.76, 150000000, 2018, 3741920152),
((SELECT festival_id FROM festival WHERE festival_nm = '정남진장흥물축제'), 370846, 123615, 3, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.74, 180000000, 2019, 2004051784),
((SELECT festival_id FROM festival WHERE festival_nm = '정남진장흥물축제'), 291172, 41596, 7, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.58, 110000000, 2020, 1880971120),
((SELECT festival_id FROM festival WHERE festival_nm = '정남진장흥물축제'), 373060, 93265, 4, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.74, 130000000, 2021, 3423944680),
((SELECT festival_id FROM festival WHERE festival_nm = '정남진장흥물축제'), 483432, 161144, 3, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.97, 200000000, 2022, 4421469072),
((SELECT festival_id FROM festival WHERE festival_nm = '정남진장흥물축제'), 121949, 40649, 3, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.23, 40000000, 2023, 1216563224),
((SELECT festival_id FROM festival WHERE festival_nm = '정남진장흥물축제'), 238311, 59577, 4, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.47, 90000000, 2024, 1250894439),

-- 보성벚꽃축제 (2017-2024)
((SELECT festival_id FROM festival WHERE festival_nm = '보성벚꽃축제'), 189489, 94744, 2, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.37, 100000000, 2017, 1815873087),
((SELECT festival_id FROM festival WHERE festival_nm = '보성벚꽃축제'), 455093, 227546, 2, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.91, 250000000, 2018, 3395448873),
((SELECT festival_id FROM festival WHERE festival_nm = '보성벚꽃축제'), 427090, 213545, 2, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.85, 200000000, 2019, 3838684920),
((SELECT festival_id FROM festival WHERE festival_nm = '보성벚꽃축제'), 279830, 139915, 2, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.55, 150000000, 2020, 2763321250),
((SELECT festival_id FROM festival WHERE festival_nm = '보성벚꽃축제'), 462644, 231322, 2, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.92, 220000000, 2021, 3566059952),
((SELECT festival_id FROM festival WHERE festival_nm = '보성벚꽃축제'), 417677, 208838, 2, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.83, 170000000, 2022, 2823078843),
((SELECT festival_id FROM festival WHERE festival_nm = '보성벚꽃축제'), 158005, 79002, 2, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.3, 70000000, 2023, 1006175840),
((SELECT festival_id FROM festival WHERE festival_nm = '보성벚꽃축제'), 279980, 139990, 2, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.55, 120000000, 2024, 2762002700),

-- 진도신비의바닷길축제 (2017-2024)
((SELECT festival_id FROM festival WHERE festival_nm = '진도신비의바닷길축제'), 104263, 26065, 4, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.19, 30000000, 2017, 568650402),
((SELECT festival_id FROM festival WHERE festival_nm = '진도신비의바닷길축제'), 463476, 77246, 6, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.93, 120000000, 2018, 4540674372),
((SELECT festival_id FROM festival WHERE festival_nm = '진도신비의바닷길축제'), 201371, 40274, 5, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.39, 60000000, 2019, 1767231896),
((SELECT festival_id FROM festival WHERE festival_nm = '진도신비의바닷길축제'), 153276, 21896, 7, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.29, 40000000, 2020, 1356492600),
((SELECT festival_id FROM festival WHERE festival_nm = '진도신비의바닷길축제'), 322320, 64464, 5, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.64, 110000000, 2021, 2531501280),
((SELECT festival_id FROM festival WHERE festival_nm = '진도신비의바닷길축제'), 284374, 40624, 7, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.56, 100000000, 2022, 1929477590),
((SELECT festival_id FROM festival WHERE festival_nm = '진도신비의바닷길축제'), 214130, 42826, 5, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.42, 70000000, 2023, 1910039600),
((SELECT festival_id FROM festival WHERE festival_nm = '진도신비의바닷길축제'), 232596, 77532, 3, 2, 4, 1, 12178, 69598, 18.3, 16.5, 6.1, 67.4, 294, 32.8, 21, 0.46, 80000000, 2024, 1707952428);
