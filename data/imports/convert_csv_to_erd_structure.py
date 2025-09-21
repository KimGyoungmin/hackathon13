#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSV 데이터를 ERD 구조에 맞게 3개 테이블로 분리하는 스크립트
"""

import csv
import re
from collections import defaultdict

def extract_location_from_population_data():
    """지역_인구수 데이터에서 지역 정보 추출"""
    # CSV에서 지역 정보를 추출하는 로직
    # 실제로는 축제명에서 지역을 추출해야 할 것 같습니다
    
    location_mapping = {
        # 축제명에서 추출할 수 있는 지역들
        '강진': '강진군',
        '곡성': '곡성군', 
        '고흥': '고흥군',
        '광양': '광양시',
        '구례': '구례군',
        '나주': '나주시',
        '담양': '담양군',
        '목포': '목포시',
        '무안': '무안군',
        '보성': '보성군',
        '순천': '순천시',
        '신안': '신안군',
        '여수': '여수시',
        '영광': '영광군',
        '영암': '영암군',
        '완도': '완도군',
        '장성': '장성군',
        '장흥': '장흥군',
        '진도': '진도군',
        '함평': '함평군',
        '해남': '해남군',
        '화순': '화순군',
        '부산': '부산광역시',
        '서울': '서울특별시'
    }
    
    return location_mapping

def convert_csv_to_erd_structure():
    """CSV를 ERD 구조로 변환"""
    
    # 1. 고유 데이터 수집
    categories = set()
    locations = set()
    festivals_data = []
    details_data = []
    
    # 지역 매핑 정보
    location_mapping = extract_location_from_population_data()
    
    # CSV 파일 읽기
    with open('해커톤데이터_20250919.csv', 'r', encoding='utf-8-sig') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            # 축제명
            festival_name = row['축제명']
            
            # 카테고리 수집
            category = row['축제카테고리']
            if category:
                categories.add(category)
            
            # 지역 추출 (축제명에서)
            location_name = None
            for key, value in location_mapping.items():
                if key in festival_name:
                    location_name = value
                    break
            
            if not location_name:
                # 기본값 설정
                location_name = '기타지역'
            
            locations.add(location_name)
            
            # 축제 데이터 (festival 테이블용)
            festival_data = {
                'festival_nm': festival_name,
                'category_nm': category,
                'location_nm': location_name,
                'year': row.get('개최년도', '0')
            }
            festivals_data.append(festival_data)
            
            # 상세 데이터 (festival_detail 테이블용)
            detail_data = {
                'festival_nm': festival_name,
                'total_visitors': row.get('전체_방문자수', '0'),
                'avg_daily_visitors': row.get('일평균_방문자수', '0'),
                'duration_days': row.get('기간일수', '0'),
                'weekend_days': row.get('주말일수', '0'),
                'lodging_days': row.get('숙박일수', '0'),
                'avg_spend_per_day_krw': row.get('1일_평균지출액(원)', '0'),
                'avg_temp_c': row.get('평균기온(°C)', '0'),
                'total_precip_mm': row.get('강수량(mm)', '0'),
                'sunshine_hours': row.get('일조시간(시간)', '0'),
                'traffic_congestion_index': row.get('교통_접근성_지수', '0'),
                'regional_pop_thousands': row.get('지역_인구수(천명)', '0'),
                'grdp_per_capita_mkrw': row.get('지역_1인당_GRDP(백만원)', '0'),
                'program_count': row.get('프로그램_개수', '0'),
                'promo_intensity_index': row.get('홍보강도지수', '0'),
                'budget_krw': row.get('예산(원)', '0'),
                'year': row.get('개최년도', '0'),
                'gross_sales': row.get('예상_총지출액(원)', '0')
            }
            details_data.append(detail_data)
    
    return categories, locations, festivals_data, details_data

def generate_sql_inserts(categories, locations, festivals_data, details_data):
    """SQL INSERT 문 생성 - 전체 데이터 포함"""
    
    sql_content = []
    sql_content.append("-- ERD 구조에 맞는 전체 데이터 INSERT 스크립트")
    sql_content.append("USE hackerton_festival;")
    sql_content.append("")
    
    # 카테고리와 지역을 리스트로 변환 (ID 매핑을 위해)
    category_list = sorted(list(categories))
    location_list = sorted(list(locations))
    
    # 1. category 테이블 INSERT
    sql_content.append("-- 카테고리 데이터 삽입")
    sql_content.append("INSERT INTO category (category_nm) VALUES")
    category_values = []
    for category in category_list:
        category_values.append(f"('{category}')")
    sql_content.append(",\n".join(category_values) + ";")
    sql_content.append("")
    
    # 2. location 테이블 INSERT
    sql_content.append("-- 지역 데이터 삽입")
    sql_content.append("INSERT INTO location (location_nm) VALUES")
    location_values = []
    for location in location_list:
        location_values.append(f"('{location}')")
    sql_content.append(",\n".join(location_values) + ";")
    sql_content.append("")
    
    # 3. festival 테이블 INSERT (전체 데이터)
    sql_content.append("-- 축제 데이터 삽입 (전체 520개)")
    sql_content.append("INSERT INTO festival (festival_nm, category_id, location_id) VALUES")
    festival_values = []
    
    for festival in festivals_data:
        # 카테고리 ID 찾기
        category_id = category_list.index(festival['category_nm']) + 1
        # 지역 ID 찾기
        location_id = location_list.index(festival['location_nm']) + 1
        
        # SQL 인젝션 방지를 위한 이스케이프
        festival_name = festival['festival_nm'].replace("'", "''")
        
        festival_values.append(f"('{festival_name}', {category_id}, {location_id})")
    
    sql_content.append(",\n".join(festival_values) + ";")
    sql_content.append("")
    
    # 4. festival_detail 테이블 INSERT (전체 데이터)
    sql_content.append("-- 축제 상세 데이터 삽입 (전체 520개)")
    sql_content.append("INSERT INTO festival_detail (festival_id, total_visitors, avg_daily_visitors, duration_days, weekend_days, lodging_days, avg_spend_per_day_krw, avg_temp_c, total_precip_mm, sunshine_hours, traffic_congestion_index, regional_pop_thousands, grdp_per_capita_mkrw, program_count, promo_intensity_index, budget_krw, year, gross_sales) VALUES")
    
    detail_values = []
    for i, detail in enumerate(details_data):
        # NULL 값 처리
        def safe_int(value):
            try:
                return int(float(value)) if value and value != '' else 0
            except:
                return 0
        
        def safe_float(value):
            try:
                return float(value) if value and value != '' else 0.0
            except:
                return 0.0
        
        values = [
            str(i+1),  # festival_id
            str(safe_int(detail['total_visitors'])),
            str(safe_int(detail['avg_daily_visitors'])), 
            str(safe_int(detail['duration_days'])),
            str(safe_int(detail['weekend_days'])),
            str(safe_int(detail['lodging_days'])),
            str(safe_float(detail['avg_spend_per_day_krw'])),
            str(safe_float(detail['avg_temp_c'])),
            str(safe_float(detail['total_precip_mm'])),
            str(safe_float(detail['sunshine_hours'])),
            str(safe_float(detail['traffic_congestion_index'])),
            str(safe_float(detail['regional_pop_thousands'])),
            str(safe_float(detail['grdp_per_capita_mkrw'])),
            str(safe_int(detail['program_count'])),
            str(safe_float(detail['promo_intensity_index'])),
            str(safe_int(detail['budget_krw'])),
            str(safe_int(detail['year'])),
            str(safe_int(detail['gross_sales']))
        ]
        detail_values.append(f"({', '.join(values)})")
    
    sql_content.append(",\n".join(detail_values) + ";")
    
    return "\n".join(sql_content)

if __name__ == "__main__":
    print("CSV 데이터를 ERD 구조로 변환 중...")
    
    # CSV 데이터 변환
    categories, locations, festivals_data, details_data = convert_csv_to_erd_structure()
    
    print(f"발견된 카테고리 수: {len(categories)}")
    print(f"발견된 지역 수: {len(locations)}")
    print(f"축제 데이터 수: {len(festivals_data)}")
    
    # SQL INSERT 문 생성
    sql_content = generate_sql_inserts(categories, locations, festivals_data, details_data)
    
    # 파일로 저장
    with open('full_festival_data_erd.sql', 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print("변환 완료! full_festival_data_erd.sql 파일이 생성되었습니다.")
    print(f"총 {len(festivals_data)}개의 축제 데이터가 포함되었습니다.")
    
    # 샘플 출력
    print("\n=== 샘플 카테고리 ===")
    for category in sorted(categories):
        print(f"- {category}")
    
    print("\n=== 샘플 지역 ===")
    for location in sorted(locations):
        print(f"- {location}")
