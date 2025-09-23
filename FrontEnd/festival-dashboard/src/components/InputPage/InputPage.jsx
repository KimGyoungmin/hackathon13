/**
 * InputPage 컴포넌트
 *
 * 역할: 축제 시뮬레이션 입력 페이지
 * - 상단: 카테고리, 축제, 연도 선택 + 필터 초기화
 * - 좌측: 선택 데이터 6가지 (예산, 홍보량, 교통량, 프로그램수, 방문객수, 매출)
 * - 우측: 시뮬레이션 입력 4가지 + 예측 결과 + 보고서 다운로드
 * - 하단: 판단 근거
 */
import React, { useState, useEffect } from 'react';
import { inputPageAPI } from '../../services/api';
import './styles/InputPage.css';

const InputPage = () => {
  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
  // 데이터 상태
  const [categories, setCategories] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 시뮬레이션 입력 상태
  const [expectedBudget, setExpectedBudget] = useState('');
  const [expectedPromotion, setExpectedPromotion] = useState('');
  const [expectedTraffic, setExpectedTraffic] = useState('');
  const [expectedPrograms, setExpectedPrograms] = useState('');
  
  // 입력 타입 상태 (수치/비율)
  const [budgetType, setBudgetType] = useState('amount');
  const [promotionType, setPromotionType] = useState('amount');
  const [trafficType, setTrafficType] = useState('amount');
  const [programsType, setProgramsType] = useState('amount');

  // 예측 결과 상태
  const [predictedVisitors, setPredictedVisitors] = useState(null);
  const [predictedRevenue, setPredictedRevenue] = useState(null);
  const [reasoning, setReasoning] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);

  // 카테고리 목록 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // 카테고리 API 호출
        const response = await fetch('http://localhost:8080/api/filters');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data.categories);
        } else {
          console.error('카테고리 로드 실패');
          setCategories([]);
        }
      } catch (err) {
        console.error('카테고리 로드 실패:', err);
      }
    };
    loadCategories();
  }, []);

  // 축제 목록 로드
  useEffect(() => {
    const loadFestivals = async () => {
      if (selectedCategory) {
        try {
          // 축제 API 호출 (카테고리 필터링)
          const response = await fetch(`http://localhost:8080/api/festivals?categories=${selectedCategory}`);
          if (response.ok) {
            const data = await response.json();
            console.log('API 응답 데이터:', data.data);
            console.log('총 축제 수:', data.data.length);
            
            // 축제명으로 중복 제거 (Map 사용으로 더 효율적)
            const festivalMap = new Map();
            data.data.forEach(festival => {
              if (!festivalMap.has(festival.name)) {
                festivalMap.set(festival.name, festival);
              }
            });
            const uniqueFestivals = Array.from(festivalMap.values());
            console.log('중복 제거 후 축제 수:', uniqueFestivals.length);
            console.log('고유 축제 목록:', uniqueFestivals.map(f => f.name));
            setFestivals(uniqueFestivals);
          } else {
            console.error('축제 로드 실패');
            setFestivals([]);
          }
        } catch (err) {
          console.error('축제 로드 실패:', err);
        }
      } else {
        setFestivals([]);
      }
    };
    loadFestivals();
  }, [selectedCategory]);

  // 연도 목록 로드
  useEffect(() => {
    const loadYears = async () => {
      if (selectedFestival) {
        try {
          // 연도 API 호출 (축제 상세 정보에서 연도 추출)
          const response = await fetch(`http://localhost:8080/api/festivals/details?festivalNames=${selectedFestival}`);
          if (response.ok) {
            const data = await response.json();
            // 중복 제거하고 연도만 추출
            const years = [...new Set(data.map(item => item.year))];
            setYears(years.sort((a, b) => b - a)); // 내림차순 정렬
          } else {
            console.error('연도 로드 실패');
            setYears([]);
          }
        } catch (err) {
          console.error('연도 로드 실패:', err);
        }
      } else {
        setYears([]);
      }
    };
    loadYears();
  }, [selectedFestival]);

  // 선택 데이터 로드
  useEffect(() => {
    const loadSelectedData = async () => {
      if (selectedFestival && selectedYear) {
        setLoading(true);
        try {
          // 선택 데이터 API 호출
          const response = await fetch(`http://localhost:8080/api/festivals/details?festivalNames=${selectedFestival}&years=${selectedYear}`);
          if (response.ok) {
            const data = await response.json();
            console.log('선택 데이터 API 응답:', data);
            if (data && data.length > 0) {
              console.log('첫 번째 데이터:', data[0]);
              console.log('교통량 필드:', data[0].trafficCongestionIndex);
              console.log('프로그램수 필드:', data[0].programCount);
              setSelectedData(data[0]); // 첫 번째 결과 사용
              setError(null);
            } else {
              setError('해당 연도의 데이터를 찾을 수 없습니다.');
              setSelectedData(null);
            }
          } else {
            console.error('선택 데이터 로드 실패');
            setError('데이터를 불러올 수 없습니다.');
            setSelectedData(null);
          }
        } catch (error) {
          console.error('데이터 로드 실패:', error);
          setError('데이터를 불러올 수 없습니다.');
          setSelectedData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setSelectedData(null);
      }
    };
    loadSelectedData();
  }, [selectedFestival, selectedYear]);

  // 필터 초기화
  const handleResetFilter = () => {
    setSelectedCategory('');
    setSelectedFestival('');
    setSelectedYear('');
    setSelectedData(null);
    setPredictedVisitors(null);
    setPredictedRevenue(null);
    setReasoning('');
    setReportGenerated(false);
    setError(null);
  };

  // 예측 생성
  const handlePredict = async () => {
    if (!selectedData || !expectedBudget || !expectedPromotion || !expectedTraffic || !expectedPrograms) {
      alert('모든 시뮬레이션 값을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // TODO: 백엔드 API 호출
      // const response = await fetch('/api/simulation/predict', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     festivalId: selectedFestival,
      //     year: selectedYear,
      //     expectedBudget,
      //     expectedPromotion,
      //     expectedTraffic,
      //     expectedPrograms
      //   })
      // });
      
      // 임시 데이터
      setPredictedVisitors(250000);
      setPredictedRevenue(250000);
      setReasoning('예산과 홍보 지표의 영향으로 예측된 결과입니다.');
      setReportGenerated(true);
    } catch (error) {
      setError('예측 생성 실패');
      console.error('예측 생성 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 보고서 다운로드
  const handleDownloadReport = () => {
    // TODO: 보고서 다운로드 API 호출
    alert('보고서 다운로드 기능은 추후 구현 예정입니다.');
  };

  return (
    <div className="input-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <h1>입력 페이지</h1>
      </div>

      {/* 상단 필터 영역 */}
      <div className="input-page__header">
        <div className="filter-section">
          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-dropdown"
            >
              <option value="">카테고리 선택</option>
              {categories.map((category, index) => (
                <option key={`${category.id}-${index}`} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedFestival}
              onChange={(e) => setSelectedFestival(e.target.value)}
              className="filter-dropdown"
              disabled={!selectedCategory}
            >
              <option value="">축제 선택</option>
              {festivals.map((festival, index) => (
                <option key={`${festival.id}-${index}`} value={festival.name}>
                  {festival.name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="filter-dropdown"
              disabled={!selectedFestival}
            >
              <option value="">연도 선택</option>
              {years.map((year, index) => (
                <option key={`${year}-${index}`} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              className="reset-btn"
              onClick={handleResetFilter}
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="input-page__content">
        {/* 좌측: 선택 데이터 */}
        <div className="selected-data-panel">
          <h2>선택 데이터</h2>
          <div className="data-list">
            <div className="data-item">
              <div className="data-label">예산 (백만원)</div>
              <div className="data-value">
                {selectedData && selectedData.budgetKrw ? Math.round(selectedData.budgetKrw / 1000000).toLocaleString() : '-'}
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">홍보량</div>
              <div className="data-value">
                {selectedData ? selectedData.promoIntensityIndex : '-'}
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">교통량</div>
              <div className="data-value">
                {selectedData ? selectedData.trafficCongestionIndex : '-'}
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">프로그램 수 (개)</div>
              <div className="data-value">
                {selectedData ? selectedData.programCount : '-'}
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">방문객 수 (명)</div>
              <div className="data-value">
                {selectedData && selectedData.totalVisitors ? selectedData.totalVisitors.toLocaleString() : '-'}
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">매출 (백만원)</div>
              <div className="data-value">
                {selectedData && selectedData.grossSales ? Math.round(selectedData.grossSales / 1000000).toLocaleString() : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 시뮬레이션 */}
        <div className="simulation-panel">
          <h2>시뮬레이션</h2>
          
          {/* 시뮬레이션 입력 */}
          <div className="simulation-inputs">
            <div className="input-group">
              <label>예상 투입예산 <span className="required-badge">필수</span></label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="budgetType"
                    value="amount"
                    checked={budgetType === 'amount'}
                    onChange={(e) => setBudgetType(e.target.value)}
                  />
                  수치 (백만원)
                </label>
                <label>
                  <input
                    type="radio"
                    name="budgetType"
                    value="percent"
                    checked={budgetType === 'percent'}
                    onChange={(e) => setBudgetType(e.target.value)}
                  />
                  비율 (%)
                </label>
              </div>
              <input
                type="number"
                value={expectedBudget}
                onChange={(e) => setExpectedBudget(e.target.value)}
                placeholder="15000"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>예상 홍보량 <span className="optional-badge">선택</span></label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="promotionType"
                    value="amount"
                    checked={promotionType === 'amount'}
                    onChange={(e) => setPromotionType(e.target.value)}
                  />
                  수치
                </label>
                <label>
                  <input
                    type="radio"
                    name="promotionType"
                    value="percent"
                    checked={promotionType === 'percent'}
                    onChange={(e) => setPromotionType(e.target.value)}
                  />
                  비율 (%)
                </label>
              </div>
              <input
                type="number"
                value={expectedPromotion}
                onChange={(e) => setExpectedPromotion(e.target.value)}
                placeholder="30"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>예상 교통량 <span className="optional-badge">선택</span></label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="trafficType"
                    value="amount"
                    checked={trafficType === 'amount'}
                    onChange={(e) => setTrafficType(e.target.value)}
                  />
                  수치
                </label>
                <label>
                  <input
                    type="radio"
                    name="trafficType"
                    value="percent"
                    checked={trafficType === 'percent'}
                    onChange={(e) => setTrafficType(e.target.value)}
                  />
                  비율 (%)
                </label>
              </div>
              <input
                type="number"
                value={expectedTraffic}
                onChange={(e) => setExpectedTraffic(e.target.value)}
                placeholder="47"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>예상 프로그램 수 <span className="optional-badge">선택</span></label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="programsType"
                    value="amount"
                    checked={programsType === 'amount'}
                    onChange={(e) => setProgramsType(e.target.value)}
                  />
                  수치 (개)
                </label>
                <label>
                  <input
                    type="radio"
                    name="programsType"
                    value="percent"
                    checked={programsType === 'percent'}
                    onChange={(e) => setProgramsType(e.target.value)}
                  />
                  비율 (%)
                </label>
              </div>
              <input
                type="number"
                value={expectedPrograms}
                onChange={(e) => setExpectedPrograms(e.target.value)}
                placeholder="25"
                className="input-field"
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="button-row">
            <button
              className="predict-btn"
              onClick={handlePredict}
              disabled={loading || !selectedData}
            >
              {loading ? '예측 생성 중...' : '예측 생성'}
            </button>
            
            <button
              className="download-btn"
              onClick={handleDownloadReport}
            >
              결과 보고서 다운로드
            </button>
          </div>

          {/* 예측 결과 */}
          <div className="prediction-results">
            <div className="result-form">
              <label>예상 방문객 수 (명)</label>
              <div className="result-display">
                {predictedVisitors !== null ? predictedVisitors.toLocaleString() : '15,000'}
              </div>
            </div>
            <div className="result-form">
              <label>예상 매출 (백만원)</label>
              <div className="result-display">
                {predictedRevenue !== null ? predictedRevenue.toLocaleString() : '500'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단: 판단 근거 */}
      <div className="reasoning-container">
        <div className="reasoning-section">
          <h3>판단 근거</h3>
          {reasoning ? (
            <div className="reasoning-content">
              <div className="reasoning-item">
                <div className="reasoning-title">1. 예상 방문객 수</div>
                <div className="reasoning-details">
                  <div className="reasoning-detail">a. 입력된 교통량(67)과 프로그램 수(21)가 중간 수준으로 설정되어 있어, 방문객 유입의 안정적 기반이 마련됨.</div>
                  <div className="reasoning-detail">b. 홍보량이 수치 기준으로 20으로 설정되어 있어, 기본적인 대외 홍보 효과가 반영됨.</div>
                  <div className="reasoning-detail">c. 이에 따라 시뮬레이션 결과로 산출된 방문객 수는 15,000명으로 현실적인 규모의 예측치임.</div>
                </div>
              </div>
              <div className="reasoning-item">
                <div className="reasoning-title">2. 예상 매출</div>
                <div className="reasoning-details">
                  <div className="reasoning-detail">a. 매출은 방문객 수(15,000명)와 평균 소비 패턴을 기반으로 산출됨.</div>
                  <div className="reasoning-detail">b. 투입 예산(15,000백만원)에 비해 매출은 500백만원으로, 초기 투자 회수보다는 인지도 제고 효과에 더 초점이 맞춰짐.</div>
                  <div className="reasoning-detail">c. 이는 프로그램 참여율과 방문객 소비 수준이 보수적으로 반영된 결과임.</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="reasoning-placeholder">
              <p>예측 생성 후 판단 근거가 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default InputPage;