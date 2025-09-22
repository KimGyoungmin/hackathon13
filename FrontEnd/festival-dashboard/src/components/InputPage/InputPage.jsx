/**
 * InputPage 컴포넌트
 *
 * 역할: 축제 시뮬레이션 입력 페이지
 * - 축제 선택 및 연도 선택 드롭다운
 * - 선택 데이터 표시 (예산, 홍보 강도, 방문객 수, 매출)
 * - 시뮬레이션 입력 폼 (예상 투입 예산, 홍보 강도, 숙박객 수)
 * - 예상 결과 출력 (방문객 수, 매출)
 */
import React, { useState, useEffect } from 'react';
import { inputPageAPI } from '../../services/api';
import './styles/InputPage.css';

const InputPage = () => {
  // 상태 관리
  const [selectedFestival, setSelectedFestival] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [festivals, setFestivals] = useState([]);
  const [years, setYears] = useState([]);
  const [festivalData, setFestivalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 시뮬레이션 입력 상태
  const [budgetType, setBudgetType] = useState('amount'); // 'amount' 또는 'percent'
  const [budgetValue, setBudgetValue] = useState('');
  const [promoType, setPromoType] = useState('value'); // 'value' 또는 'percent'
  const [promoValue, setPromoValue] = useState('');
  const [visitorsType, setVisitorsType] = useState('count'); // 'count' 또는 'percent'
  const [visitorsValue, setVisitorsValue] = useState('');

  // 예상 결과 상태
  const [predictedVisitors, setPredictedVisitors] = useState(null);
  const [predictedSales, setPredictedSales] = useState(null);

  // 축제 목록 로드
  useEffect(() => {
    const loadFestivals = async () => {
      setLoading(true);
      setError(null);
      try {
        const festivalList = await inputPageAPI.getAllUniqueFestivals();
        setFestivals(festivalList);
      } catch (err) {
        setError('축제 목록을 불러오는데 실패했습니다.');
        console.error('축제 목록 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFestivals();
  }, []);

  // 축제 선택 시 해당 축제의 사용 가능한 연도 목록 로드
  useEffect(() => {
    const loadYears = async () => {
      if (selectedFestival) {
        setLoading(true);
        try {
          const availableYears = await inputPageAPI.getAvailableYearsForFestival(selectedFestival);
          setYears(availableYears);
          setSelectedYear(''); // 축제 변경 시 연도 선택 초기화
          setFestivalData(null); // 기존 데이터 초기화
        } catch (err) {
          setError('연도 목록을 불러오는데 실패했습니다.');
          console.error('연도 목록 로드 실패:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setYears([]);
        setSelectedYear('');
        setFestivalData(null);
      }
    };

    loadYears();
  }, [selectedFestival]);

  // 데이터 조회 핸들러
  const handleDataFetch = async () => {
    if (!selectedFestival || !selectedYear) {
      alert('축제와 연도를 모두 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await inputPageAPI.getFestivalDetailByNameAndYear(selectedFestival, parseInt(selectedYear));
      if (data) {
        setFestivalData(data);
      } else {
        setError('해당 축제의 데이터를 찾을 수 없습니다.');
        setFestivalData(null);
      }
    } catch (err) {
      setError('축제 데이터를 불러오는데 실패했습니다.');
      console.error('축제 데이터 로드 실패:', err);
      setFestivalData(null);
    } finally {
      setLoading(false);
    }
  };

  // 시뮬레이션 실행
  const handleSimulation = () => {
    if (!festivalData || !budgetValue || !promoValue || !visitorsValue) {
      alert('모든 시뮬레이션 값을 입력해주세요.');
      return;
    }

    // TODO: 실제 예측 알고리즘 구현
    // 현재는 간단한 계산으로 대체
    let newBudget = festivalData.budget_krw;
    let newPromo = festivalData.promo_intensity_index;
    let newVisitors = parseInt(visitorsValue);

    if (budgetType === 'amount') {
      newBudget = parseInt(budgetValue);
    } else {
      newBudget = festivalData.budget_krw * (1 + parseInt(budgetValue) / 100);
    }

    if (promoType === 'value') {
      newPromo = parseFloat(promoValue);
    } else {
      newPromo = festivalData.promo_intensity_index * (1 + parseInt(promoValue) / 100);
    }

    if (visitorsType === 'percent') {
      newVisitors = festivalData.total_visitors * (1 + parseInt(visitorsValue) / 100);
    }

    // 간단한 예측 공식 (실제로는 ML 모델 사용)
    const budgetFactor = newBudget / festivalData.budget_krw;
    const promoFactor = newPromo / festivalData.promo_intensity_index;
    const visitorsFactor = newVisitors / festivalData.total_visitors;

    const predicted_visitors = Math.round(festivalData.total_visitors * budgetFactor * promoFactor * visitorsFactor);
    const predicted_sales = Math.round(festivalData.gross_sales * budgetFactor * promoFactor * visitorsFactor);

    setPredictedVisitors(predicted_visitors);
    setPredictedSales(predicted_sales);
  };

  // 알고리즘 다운로드 (placeholder)
  const handleAlgorithmDownload = () => {
    alert('알고리즘 다운로드 기능은 추후 구현 예정입니다.');
  };

  return (
    <div className="input-page">
      <div className="input-page__header">
        <h1>입력 페이지</h1>
      </div>

      {/* 상단 드롭다운 영역 */}
      <div className="input-page__controls">
        <div className="dropdown-group">
          <select
            value={selectedFestival}
            onChange={(e) => setSelectedFestival(e.target.value)}
            className="dropdown"
            disabled={loading}
          >
            <option value="">축제선택 선택</option>
            {festivals.map(festival => (
              <option key={festival.id} value={festival.festivalNm || festival.name}>
                {festival.festivalNm || festival.name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="dropdown"
            disabled={loading || !selectedFestival}
          >
            <option value="">축제 연도</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button
            className="fetch-btn"
            onClick={handleDataFetch}
            disabled={loading || !selectedFestival || !selectedYear}
          >
            {loading ? '조회 중...' : '데이터 조회'}
          </button>
        </div>
      </div>

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="input-page__content">
        {/* 왼쪽: 선택 데이터 */}
        <div className="selected-data">
          <h2>선택 데이터</h2>

          <div className="data-grid">
            <div className="data-item">
              <div className="data-label">예산 (백만원)</div>
              <div className="data-value">
                {festivalData ? Math.round((festivalData.budgetKrw || festivalData.budget_krw || 0) / 1000000).toLocaleString() : '-'}
              </div>
            </div>

            <div className="data-item">
              <div className="data-label">홍보 강도</div>
              <div className="data-value">
                {festivalData ? (festivalData.promoIntensityIndex || festivalData.promo_intensity_index || 0) : '-'}
              </div>
            </div>

            <div className="data-item">
              <div className="data-label">숙박객 수 (명)</div>
              <div className="data-value">
                -
              </div>
            </div>

            <div className="data-item highlighted">
              <div className="data-label">방문객 수 (명)</div>
              <div className="data-value">
                {festivalData ? (festivalData.totalVisitors || festivalData.total_visitors || 0).toLocaleString() : '-'}
              </div>
            </div>

            <div className="data-item highlighted">
              <div className="data-label">매출액 (백만원)</div>
              <div className="data-value">
                {festivalData ? Math.round((festivalData.grossSales || festivalData.gross_sales || 0) / 1000000).toLocaleString() : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 시뮬레이션 */}
        <div className="simulation">
          <h2>시뮬레이션</h2>

          <div className="simulation-form">
            {/* 예상 투입 예산 */}
            <div className="form-group">
              <label className="form-label">예상 투입 예산</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="budgetType"
                    value="amount"
                    checked={budgetType === 'amount'}
                    onChange={(e) => setBudgetType(e.target.value)}
                  />
                  백만원
                </label>
                <label>
                  <input
                    type="radio"
                    name="budgetType"
                    value="percent"
                    checked={budgetType === 'percent'}
                    onChange={(e) => setBudgetType(e.target.value)}
                  />
                  퍼센트
                </label>
              </div>
              <input
                type="number"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
                placeholder={budgetType === 'amount' ? '15,000' : '0.8'}
                className="form-input"
              />
            </div>

            {/* 예상 홍보 강도 */}
            <div className="form-group">
              <label className="form-label">예상 홍보 강도</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="promoType"
                    value="value"
                    checked={promoType === 'value'}
                    onChange={(e) => setPromoType(e.target.value)}
                  />
                  수치
                </label>
                <label>
                  <input
                    type="radio"
                    name="promoType"
                    value="percent"
                    checked={promoType === 'percent'}
                    onChange={(e) => setPromoType(e.target.value)}
                  />
                  퍼센트
                </label>
              </div>
              <input
                type="number"
                step="0.1"
                value={promoValue}
                onChange={(e) => setPromoValue(e.target.value)}
                placeholder={promoType === 'value' ? '0.8' : '20'}
                className="form-input"
              />
            </div>

            {/* 예상 숙박객 수 */}
            <div className="form-group">
              <label className="form-label">예상 숙박객 수</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="visitorsType"
                    value="count"
                    checked={visitorsType === 'count'}
                    onChange={(e) => setVisitorsType(e.target.value)}
                  />
                  명
                </label>
                <label>
                  <input
                    type="radio"
                    name="visitorsType"
                    value="percent"
                    checked={visitorsType === 'percent'}
                    onChange={(e) => setVisitorsType(e.target.value)}
                  />
                  퍼센트
                </label>
              </div>
              <input
                type="number"
                value={visitorsValue}
                onChange={(e) => setVisitorsValue(e.target.value)}
                placeholder={visitorsType === 'count' ? '10,000' : '15'}
                className="form-input"
              />
            </div>

            {/* 버튼 그룹 */}
            <div className="button-group">
              <button
                className="simulate-btn"
                onClick={handleSimulation}
              >
                예측 실행
              </button>
              <button
                className="download-btn"
                onClick={handleAlgorithmDownload}
              >
                알고리즘 다운로드
              </button>
            </div>

            {/* 예상 결과 */}
            {(predictedVisitors !== null && predictedSales !== null) && (
              <div className="prediction-results">
                <div className="result-item success">
                  <div className="result-label">예상 방문객 수 (명)</div>
                  <div className="result-value">
                    {predictedVisitors.toLocaleString()}
                  </div>
                </div>

                <div className="result-item success">
                  <div className="result-label">예상 매출 (백만원)</div>
                  <div className="result-value">
                    {predictedSales.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPage;