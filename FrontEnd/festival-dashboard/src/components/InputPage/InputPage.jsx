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
        // TODO: 실제 카테고리 API 호출
        // const response = await fetch('/api/categories');
        // const categoriesData = await response.json();
        // setCategories(categoriesData);
        
        // 임시 데이터
        setCategories([
          { id: 1, name: '문화예술' },
          { id: 2, name: '음식' },
          { id: 3, name: '자연환경' },
          { id: 4, name: '전통문화' }
        ]);
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
          // TODO: 실제 축제 API 호출 (카테고리 필터링)
          // const response = await fetch(`/api/festivals?categoryId=${selectedCategory}`);
          // const festivalsData = await response.json();
          // setFestivals(festivalsData);
          
          // 임시 데이터 - 카테고리별 축제 목록
          const festivalsByCategory = {
            1: [ // 문화예술
              { id: 1, name: '강진만춤추는갈대축제' },
              { id: 2, name: '강진청자축제' },
              { id: 3, name: '군동풍동봄꽃축제' }
            ],
            2: [ // 음식
              { id: 4, name: '강진녹차축제' },
              { id: 5, name: '전남해양수산축제' }
            ],
            3: [ // 자연환경
              { id: 6, name: '다도해해상국립공원축제' },
              { id: 7, name: '완도해조류축제' }
            ],
            4: [ // 전통문화
              { id: 8, name: '진도신비의바닷길축제' },
              { id: 9, name: '고흥우주항공축제' }
            ]
          };
          
          setFestivals(festivalsByCategory[selectedCategory] || []);
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
          // TODO: 실제 연도 API 호출
          // const response = await fetch(`/api/festivals/${selectedFestival}/years`);
          // const yearsData = await response.json();
          // setYears(yearsData);
          
          // 임시 데이터 - 축제별 사용 가능한 연도
          const yearsByFestival = {
            1: [2022, 2023, 2024], // 강진만춤추는갈대축제
            2: [2021, 2022, 2023, 2024], // 강진청자축제
            3: [2023, 2024], // 군동풍동봄꽃축제
            4: [2022, 2023, 2024], // 강진녹차축제
            5: [2021, 2022, 2023, 2024], // 전남해양수산축제
            6: [2023, 2024], // 다도해해상국립공원축제
            7: [2022, 2023, 2024], // 완도해조류축제
            8: [2021, 2022, 2023, 2024], // 진도신비의바닷길축제
            9: [2023, 2024] // 고흥우주항공축제
          };
          
          setYears(yearsByFestival[selectedFestival] || []);
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
          // TODO: 실제 API 호출
          // const response = await fetch(`/api/festivals/${selectedFestival}/data/${selectedYear}`);
          // const data = await response.json();
          // setSelectedData(data);
          
          // 임시 데이터 - 축제별, 연도별 실제 데이터
          const festivalData = {
            // 강진만춤추는갈대축제
            1: {
              2022: { budget: 12000, promotion: 18, traffic: 65, programs: 19, visitors: 12000, revenue: 450 },
              2023: { budget: 15000, promotion: 20, traffic: 67, programs: 21, visitors: 15000, revenue: 500 },
              2024: { budget: 18000, promotion: 22, traffic: 70, programs: 23, visitors: 18000, revenue: 600 }
            },
            // 강진청자축제
            2: {
              2021: { budget: 10000, promotion: 15, traffic: 60, programs: 17, visitors: 10000, revenue: 400 },
              2022: { budget: 13000, promotion: 18, traffic: 63, programs: 19, visitors: 13000, revenue: 480 },
              2023: { budget: 16000, promotion: 21, traffic: 68, programs: 22, visitors: 16000, revenue: 550 },
              2024: { budget: 19000, promotion: 24, traffic: 72, programs: 25, visitors: 19000, revenue: 650 }
            },
            // 군동풍동봄꽃축제
            3: {
              2023: { budget: 8000, promotion: 12, traffic: 55, programs: 15, visitors: 8000, revenue: 300 },
              2024: { budget: 11000, promotion: 16, traffic: 62, programs: 18, visitors: 11000, revenue: 420 }
            },
            // 강진녹차축제
            4: {
              2022: { budget: 9000, promotion: 14, traffic: 58, programs: 16, visitors: 9000, revenue: 350 },
              2023: { budget: 12000, promotion: 17, traffic: 64, programs: 20, visitors: 12000, revenue: 450 },
              2024: { budget: 15000, promotion: 20, traffic: 69, programs: 22, visitors: 15000, revenue: 520 }
            },
            // 전남해양수산축제
            5: {
              2021: { budget: 14000, promotion: 19, traffic: 66, programs: 21, visitors: 14000, revenue: 480 },
              2022: { budget: 17000, promotion: 22, traffic: 70, programs: 24, visitors: 17000, revenue: 580 },
              2023: { budget: 20000, promotion: 25, traffic: 75, programs: 27, visitors: 20000, revenue: 680 },
              2024: { budget: 23000, promotion: 28, traffic: 80, programs: 30, visitors: 23000, revenue: 780 }
            },
            // 다도해해상국립공원축제
            6: {
              2023: { budget: 11000, promotion: 16, traffic: 61, programs: 18, visitors: 11000, revenue: 400 },
              2024: { budget: 14000, promotion: 19, traffic: 67, programs: 21, visitors: 14000, revenue: 500 }
            },
            // 완도해조류축제
            7: {
              2022: { budget: 10000, promotion: 15, traffic: 59, programs: 17, visitors: 10000, revenue: 380 },
              2023: { budget: 13000, promotion: 18, traffic: 65, programs: 20, visitors: 13000, revenue: 470 },
              2024: { budget: 16000, promotion: 21, traffic: 71, programs: 23, visitors: 16000, revenue: 560 }
            },
            // 진도신비의바닷길축제
            8: {
              2021: { budget: 12000, promotion: 17, traffic: 64, programs: 19, visitors: 12000, revenue: 450 },
              2022: { budget: 15000, promotion: 20, traffic: 68, programs: 22, visitors: 15000, revenue: 520 },
              2023: { budget: 18000, promotion: 23, traffic: 73, programs: 25, visitors: 18000, revenue: 620 },
              2024: { budget: 21000, promotion: 26, traffic: 78, programs: 28, visitors: 21000, revenue: 720 }
            },
            // 고흥우주항공축제
            9: {
              2023: { budget: 13000, promotion: 18, traffic: 66, programs: 20, visitors: 13000, revenue: 480 },
              2024: { budget: 17000, promotion: 22, traffic: 72, programs: 24, visitors: 17000, revenue: 600 }
            }
          };
          
          const data = festivalData[selectedFestival]?.[selectedYear];
          if (data) {
            setSelectedData(data);
            setError(null);
          } else {
            setError('해당 연도의 데이터를 찾을 수 없습니다.');
            setSelectedData(null);
          }
        } catch (error) {
          setError('데이터 로드 실패');
          console.error('데이터 로드 실패:', error);
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
              {categories.map(category => (
                <option key={category.id} value={category.id}>
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
              {festivals.map(festival => (
                <option key={festival.id} value={festival.id}>
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
              {years.map(year => (
                <option key={year} value={year}>
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
                {selectedData ? selectedData.budget.toLocaleString() : '-'}
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">홍보량</div>
              <div className="data-value">
                {selectedData ? selectedData.promotion : '-'}
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">교통량</div>
              <div className="data-value">
                {selectedData ? selectedData.traffic : '-'}
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">프로그램 수 (개)</div>
              <div className="data-value">
                {selectedData ? selectedData.programs : '-'}
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">방문객 수 (명)</div>
              <div className="data-value">
                {selectedData ? selectedData.visitors.toLocaleString() : '-'}
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">매출 (백만원)</div>
              <div className="data-value">
                {selectedData ? selectedData.revenue.toLocaleString() : '-'}
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
              <label>예상 투입예산</label>
              <div className="input-row">
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="budgetType"
                      value="amount"
                      checked={budgetType === 'amount'}
                      onChange={(e) => setBudgetType(e.target.value)}
                    />
                    수치
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="budgetType"
                      value="percent"
                      checked={budgetType === 'percent'}
                      onChange={(e) => setBudgetType(e.target.value)}
                    />
                    비율
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
            </div>

            <div className="input-group">
              <label>예상 홍보량</label>
              <div className="input-row">
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
                    비율
                  </label>
                </div>
                <input
                  type="number"
                  value={expectedPromotion}
                  onChange={(e) => setExpectedPromotion(e.target.value)}
                  placeholder="20"
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <label>예상 교통량</label>
              <div className="input-row">
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
                    비율
                  </label>
                </div>
                <input
                  type="number"
                  value={expectedTraffic}
                  onChange={(e) => setExpectedTraffic(e.target.value)}
                  placeholder="67"
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <label>예상 프로그램수</label>
              <div className="input-row">
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="programsType"
                      value="amount"
                      checked={programsType === 'amount'}
                      onChange={(e) => setProgramsType(e.target.value)}
                    />
                    수치
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="programsType"
                      value="percent"
                      checked={programsType === 'percent'}
                      onChange={(e) => setProgramsType(e.target.value)}
                    />
                    비율
                  </label>
                </div>
                <input
                  type="number"
                  value={expectedPrograms}
                  onChange={(e) => setExpectedPrograms(e.target.value)}
                  placeholder="21"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* 예측 생성 버튼 */}
          <button
            className="predict-btn"
            onClick={handlePredict}
            disabled={loading || !selectedData}
          >
            {loading ? '예측 생성 중...' : '예측 생성'}
          </button>

          {/* 예측 결과 */}
          {(predictedVisitors !== null && predictedRevenue !== null) && (
            <div className="prediction-results">
              <div className="result-item">
                <div className="result-label">예상 방문객수</div>
                <div className="result-value">{predictedVisitors.toLocaleString()}명</div>
              </div>
              <div className="result-item">
                <div className="result-label">예상 매출</div>
                <div className="result-value">{predictedRevenue.toLocaleString()}백만원</div>
              </div>
            </div>
          )}

          {/* 보고서 다운로드 */}
          {reportGenerated && (
            <div className="report-section">
              <button
                className="download-btn"
                onClick={handleDownloadReport}
              >
                📄 결과 보고서 다운로드
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 하단: 판단 근거 */}
      <div className="reasoning-section">
        <h3>판단 근거</h3>
        {reasoning && (
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
        )}
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