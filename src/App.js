import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';  // QR 코드 라이브러리 import
import { format } from 'date-fns';  // 날짜 포맷 라이브러리 import
import * as locales from 'date-fns/locale'; // 모든 로케일을 한 번에 가져옵니다.

const App = () => {
  const [time, setTime] = useState(new Date());  // 시간 상태
  const [url, setUrl] = useState('');  // URL 상태
  const [qrCodeUrl, setQrCodeUrl] = useState('');  // QR 코드 URL 상태
  const [timeColor, setTimeColor] = useState(localStorage.getItem('timeColor') || '#A8E6CF');  // 시간 색상 상태
  const [dateColor, setDateColor] = useState(localStorage.getItem('dateColor') || '#33A1FF');  // 날짜 색상 상태
  const [timeFormat, setTimeFormat] = useState(localStorage.getItem('timeFormat') || 'HH:mm:ss');  // 시간 포맷 상태
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'yyyy-MM-dd eeee');  // 날짜 포맷 상태
  const [x, setX] = useState(Number(localStorage.getItem('timeX')) || 10);  // 시간 x 좌표
  const [y, setY] = useState(Number(localStorage.getItem('timeY')) || -90);  // 시간 y 좌표
  const [dateX, setDateX] = useState(Number(localStorage.getItem('dateX')) || 20);  // 날짜 x 좌표
  const [dateY, setDateY] = useState(Number(localStorage.getItem('dateY')) || 70);  // 날짜 y 좌표
  const [isDragging, setIsDragging] = useState(false);  // 드래그 상태
  const [startX, setStartX] = useState(0);  // 드래그 시작 x 좌표
  const [startY, setStartY] = useState(0);  // 드래그 시작 y 좌표
  const [timeSize, setTimeSize] = useState(Number(localStorage.getItem('timeSize')) || 90);  // 시간 크기 상태
  const [dateSize, setDateSize] = useState(Number(localStorage.getItem('dateSize')) || 30);  // 날짜 크기 상태
  const [shadowColor, setShadowColor] = useState(localStorage.getItem('shadowColor') || '#000000');
  const [shadowSize, setShadowSize] = useState(Number(localStorage.getItem('shadowSize')) || 2);
  // 배경색상 상태 추가
  const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem('backgroundColor') || '#FFFFFF');  // 기본 배경색은 흰색
  const [textColor, setTextColor] = useState('#000000');  // 텍스트 기본색은 검정
  const [isFullScreen, setIsFullScreen] = useState(false); // Full screen state
  const [isClockTouching, setIsClockTouching] = useState(false); // 시계를 터치하고 있는지 여부
  const [isClockVisible, setIsClockVisible] = useState(true); // 시계 표시 여부 상태 추가
 // 전체 방문자 수와 오늘 방문자 수를 각각 상태로 관리
 const [visitorCount, setVisitorCount] = useState(0);
 const [todayVisitorCount, setTodayVisitorCount] = useState(0);

 useEffect(() => {
   // 서버less 함수로 API 호출
   fetch('/api/visitor')
     .then(response => response.json())
     .then(data => {
       // 방문자 수와 오늘 방문자 수 업데이트
       setVisitorCount(data.visitorCount || 0);
       setTodayVisitorCount(data.todayVisitorCount || 0);
     })
     .catch(error => {
       console.error('Error fetching visitor count:', error);
       setVisitorCount(0);  // 오류 발생 시 0으로 설정
       setTodayVisitorCount(0);  // 오류 발생 시 0으로 설정
     });
 }, []);  // 의존성 배열이 비어있어 처음 컴포넌트가 마운트될 때만 호출됨

  const handleTimePositionX = (e) => {
    const newX = Number(e.target.value);
    setX(newX);
    localStorage.setItem('timeX', newX);  // 시간 x 좌표 저장
  }
  const handleTimePositioY = (e) => {
    const newY = Number(e.target.value);
    setY(newY);
    localStorage.setItem('timeY', newY);  // 시간 y 좌표 저장
  }
  const handleDatePositionX = (e) => {
    const newX = Number(e.target.value);
    setDateX(newX);
    localStorage.setItem('dateX', newX);  // 날짜 x 좌표 저장
  }
  const handleDatePositionY = (e) => {
    const newY = Number(e.target.value);
    setDateY(newY);
    localStorage.setItem('dateY', newY);  // 날짜 y 좌표 저장
  }
  // 시계 표시 여부를 토글하는 함수
  const handleClockToggle = () => {
    setIsClockVisible(prev => !prev); // 시계 표시 여부 반전
  };
  const handleRandomClockColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // 랜덤 색상 생성
    setTimeColor(randomColor); // 시간 색상 업데이트
    const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // 랜덤 색상 생성
    setDateColor(randomColor1); // 날짜 색상 업데이트
    const randomColor2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // 랜덤 색상 생성
    setShadowColor(randomColor2); // 그림자 색상 업데이트
    localStorage.setItem('shadowColor', randomColor2); // 로컬 스토리지에 저장
    localStorage.setItem('timeColor', randomColor); // 로컬 스토리지에 저장
    localStorage.setItem('dateColor', randomColor1); // 로컬 스토리지에 저장
  }
  const handleRandomUIColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // 랜덤 색상 생성
    setBackgroundColor(randomColor); // 배경색상 업데이트
    localStorage.setItem('backgroundColor', randomColor); // 로컬 스토리지에 저장
  }
  // 마우스 다운과 터치 시작 이벤트 공통 처리
const handleStart = (e, type) => {
  const clientX = e.clientX || e.touches[0].clientX;  // 마우스 또는 터치의 X 좌표
  const clientY = e.clientY || e.touches[0].clientY;  // 마우스 또는 터치의 Y 좌표

  if (type === 'time') {
    setStartX(clientX - x);  // 시간 x 위치 저장
    setStartY(clientY - y);  // 시간 y 위치 저장
  } else {
    setStartX(clientX - dateX);  // 날짜 x 위치 저장
    setStartY(clientY - dateY);  // 날짜 y 위치 저장
  }
  setIsDragging(true);  // 드래그 시작
};

useEffect(() => {
  // 배경색이 변경될 때마다 텍스트 색상 업데이트
  const rgb = hexToRgb(backgroundColor);
  const rgbSum = rgb.r + rgb.g + rgb.b;

  // 배경색의 RGB 합이 384(128*3) 이하이면 텍스트 색상을 흰색, 그 이상이면 검은색
  if (rgbSum <= 384) {
    setTextColor('#FFFFFF');  // 배경이 어두우면 텍스트는 흰색
  } else {
    setTextColor('#000000');  // 배경이 밝으면 텍스트는 검은색
  }
}, [backgroundColor]);
 // HEX 색상을 RGB로 변환하는 함수
 const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const handleBackgroundColorChange = (e) => {
  setBackgroundColor(e.target.value);
  localStorage.setItem('backgroundColor', e.target.value);  // 배경색을 로컬스토리지에 저장
};

// 마우스 이동과 터치 이동 이벤트 공통 처리
const handleMove = (e, type) => {
  if (isDragging) {
    const clientX = e.clientX || e.touches[0].clientX;  // 마우스 또는 터치의 X 좌표
    const clientY = e.clientY || e.touches[0].clientY;  // 마우스 또는 터치의 Y 좌표

    if (type === 'time') {
      // 시간의 경우
      const newX = clientX - startX;
      const newY = clientY - startY;

      setX(newX);  // x 좌표 업데이트
      setY(newY);  // y 좌표 업데이트
      localStorage.setItem('timeX', newX);  // 새로운 위치 저장
      localStorage.setItem('timeY', newY);
    } else {
      // 날짜의 경우
      const newDateX = clientX - startX;
      const newDateY = clientY - startY;

      setDateX(newDateX);  // 날짜 x 좌표 업데이트
      setDateY(newDateY);  // 날짜 y 좌표 업데이트
      localStorage.setItem('dateX', newDateX);  // 새로운 위치 저장
      localStorage.setItem('dateY', newDateY);
    }
  }
};

// 마우스 업과 터치 종료 이벤트 공통 처리
const handleEnd = () => {
  setIsDragging(false);  // 드래그 종료
};
const handleFullScreenToggle = () => {
  setIsFullScreen(!isFullScreen);
};
  // 시계를 매초마다 갱신
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);  // 컴포넌트가 언마운트되면 인터벌 클리어
  }, []);
  const getLocale = () => {
    const userLang = navigator.language.split('-')[0];  // 사용자의 언어 코드 (예: 'en', 'ko', 'fr' 등)
  
    // 'date-fns/locale'에서 해당 언어 로케일을 찾아서 반환
    return locales[userLang] || locales.enUS;  // 지원되지 않는 언어는 기본 영어로 처리
  };
  
  const locale = getLocale();  // 사용자의 로케일에 맞는 locale 객체 선택

  // 시간 포맷
  const formattedTime = format(time, timeFormat, { locale });

  // 날짜 포맷 처리 (유효하지 않은 경우 기본 포맷으로 설정)
  let formattedDate = '';
  try {
    formattedDate = dateFormat ? format(time, dateFormat, { locale }) : format(time, 'yyyy-MM-dd eeee');
  } catch (error) {
    console.error('Invalid date format:', dateFormat);
    formattedDate = format(time, 'yyyy-MM-dd eeee', { locale });  // 기본 포맷으로 설정
  }

  // URL 입력 변경 처리
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  // 버튼 클릭 시 QR 코드 생성
  const handleGenerateQR = () => {
    if (url) {
      setQrCodeUrl(url);  // QR 코드 생성
    } else {
      alert('Please enter a URL');
    }
  };

  // 시간 색상 변경 처리
  const handleTimeColorChange = (e) => {
    const selectedColor = e.target.value;
    setTimeColor(selectedColor);
    localStorage.setItem('timeColor', selectedColor);  // 색상 저장
  };

  // 날짜 색상 변경 처리
  const handleDateColorChange = (e) => {
    const selectedColor = e.target.value;
    setDateColor(selectedColor);
    localStorage.setItem('dateColor', selectedColor);  // 색상 저장
  };

  // 날짜 포맷 변경 처리
  const handleDateFormatChange = (e) => {
    let selectedFormat = e.target.value;

    // 빈 문자열 처리
    if (!selectedFormat.trim()) {
      selectedFormat = 'yyyy-MM-dd eeee'; // 기본 날짜 포맷
    }

    setDateFormat(selectedFormat);
    localStorage.setItem('dateFormat', selectedFormat);  // 날짜 포맷 저장
  };

  // 시간 포맷 변경 처리
  const handleTimeFormatChange = (e) => {
    let selectedFormat = e.target.value;

    // 빈 문자열 처리
    if (!selectedFormat.trim()) {
      selectedFormat = 'HH:mm:ss'; // 기본 시간 포맷
    }

    setTimeFormat(selectedFormat);
    localStorage.setItem('timeFormat', selectedFormat);  // 시간 포맷 저장
  };

  // 마우스 다운 이벤트 (드래그 시작)
  const handleMouseDown = (e, type) => {
    handleClockMouseDown(); // 시계 터치 시작
    if (type === 'time') {
      setStartX(e.clientX - x);  // 시간 x 위치 저장
      setStartY(e.clientY - y);  // 시간 y 위치 저장
    } else {
      setStartX(e.clientX - dateX);  // 날짜 x 위치 저장
      setStartY(e.clientY - dateY);  // 날짜 y 위치 저장
    }
    setIsDragging(true);  // 드래그 시작
  };

  // 마우스 이동 이벤트 (드래그 중)
  const handleMouseMove = (e, type) => {
    if (isDragging) {
      if (type === 'time') {
        // 시간의 경우
        const newX = e.clientX - startX;
        const newY = e.clientY - startY;

        setX(newX);  // x 좌표 업데이트
        setY(newY);  // y 좌표 업데이트
        localStorage.setItem('timeX', newX);  // 새로운 위치 저장
        localStorage.setItem('timeY', newY);
      } else {
        // 날짜의 경우
        const newDateX = e.clientX - startX;
        const newDateY = e.clientY - startY;

        setDateX(newDateX);  // 날짜 x 좌표 업데이트
        setDateY(newDateY);  // 날짜 y 좌표 업데이트
        localStorage.setItem('dateX', newDateX);  // 새로운 위치 저장
        localStorage.setItem('dateY', newDateY);
      }
    }
  };

  // 마우스 업 이벤트 (드래그 종료)
  const handleMouseUp = () => {
    setTimeout(() => {
      handleClockMouseUp(); // 시계 터치 종료
    }, 100); // 100ms 뒤에 실행
    setIsDragging(false);  // 드래그 종료
  };

  // 시간 크기 변경 처리 (슬라이더)
  const handleTimeSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setTimeSize(newSize);
    localStorage.setItem('timeSize', newSize);  // 크기 저장
  };

  // 날짜 크기 변경 처리 (슬라이더)
  const handleDateSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setDateSize(newSize);
    localStorage.setItem('dateSize', newSize);  // 크기 저장
  };
  const handleShadowColorChange = (e) => {
    const color = e.target.value;
    setShadowColor(color);
    localStorage.setItem('shadowColor', color);
  };
  
  const handleShadowSizeChange = (e) => {
    const size = Number(e.target.value);
    setShadowSize(size);
    localStorage.setItem('shadowSize', size);
  };
  
  const handleReset = () => {
    setTimeColor('#A8E6CF'); // 기본 시간 색상 (예쁜 오렌지)
    setDateColor('#33A1FF'); // 기본 날짜 색상 (예쁜 블루)
    setTimeFormat('HH:mm:ss');
    setDateFormat('yyyy-MM-dd eeee');
    setTimeSize(90);
    setDateSize(30);
    setX(10);
    setY(-90);
    setDateX(20);
    setDateY(70);
    setShadowSize(2);
    setShadowColor('#000000');
    setBackgroundColor('#FFFFFF'); // 기본 배경색은 흰색
    setTextColor('#000000'); // 기본 텍스트 색상은 검정색
    setUrl(''); // URL 초기화
    setQrCodeUrl(''); // QR 코드 URL 초기화
    setIsFullScreen(false); // 전체 화면 해제
    setIsClockTouching(false); // 시계 터치 해제
    setIsClockVisible(true); // 시계 보이기

    // 로컬 스토리지 초기화
    localStorage.clear();
  };
// 배경 클릭 시 전체 화면 모드 해제
const handleBackgroundClick = () => {
  if (isFullScreen && !isClockTouching) {
    setIsFullScreen(false); // 전체 화면 해제
  }
};
const handleClockMouseDown = () => {
  setIsClockTouching(true); // 시계를 터치 시작
};
const handleClockMouseUp = () => {
  setIsClockTouching(false); // 시계 터치 종료
};
  return (
    <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10, // 시계가 항상 위에 보이도록 설정
      textAlign: 'center',
      padding: '20px',
      touchAction: 'none',
      backgroundColor: backgroundColor,  // 배경색 적용
      height: '100vh',
        width: '100vw',
        cursor: isFullScreen ? 'pointer' : 'default', // Pointer cursor when full screen
    }}
    onClick={handleBackgroundClick} // 배경 클릭 시 전체화면 해제
  >
    {/* 옵션들: 스크롤 가능 */}
    { (
    <div style={{ marginTop: '150px', marginRight: '40px', overflowY: 'auto', maxHeight: 'calc(100vh - 180px)',border: '2px solid #ccc',  opacity: isFullScreen ? 0 : 1,pointerEvents: isFullScreen ? 'none' : 'auto',}}>
       {/* Full Screen button */}
     { (
        <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleFullScreenToggle}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', color: textColor, backgroundColor: backgroundColor }}
        >
          {isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        </button>
      </div>
      )}
      {/* 시계 숨기기/보이기 버튼 추가 */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleClockToggle}
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', color: textColor, backgroundColor: backgroundColor }}
            >
              {isClockVisible ? 'Hide Clock' : 'Show Clock'}
            </button>
          </div>
      {/* 배경색상 선택 */}
      <div style={{ marginTop: '20px' }}>
          <input
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            style={{ padding: '10px', fontSize: '16px', color: textColor }}
          />
          <span style={{ marginLeft: '10px', fontSize: '16px', color: textColor }}>Select Background Color</span>
        </div>
      {/* 시간 색상 선택 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="color"
          value={timeColor}
          onChange={handleTimeColorChange}
          style={{ padding: '10px', fontSize: '16px', color: textColor }}
        />
        <span style={{ marginLeft: '10px', fontSize: '16px', color: textColor }}>Select Time Color</span>
      </div>

      {/* 날짜 색상 선택 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="color"
          value={dateColor}
          onChange={handleDateColorChange}
          style={{ padding: '10px', fontSize: '16px', color: textColor }}
        />
        <span style={{ marginLeft: '10px', fontSize: '16px', color: textColor }}>Select Date Color</span>
      </div>

      {/* 날짜 포맷 입력 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={dateFormat}
          onChange={handleDateFormatChange}
          placeholder="Enter Date Format (e.g., yyyy-MM-dd eeee)"
          style={{ padding: '10px', width: '300px', fontSize: '16px', color: textColor, backgroundColor: backgroundColor }}
        />
      </div>

      {/* 시간 포맷 입력 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={timeFormat}
          onChange={handleTimeFormatChange}
          placeholder="Enter Time Format (e.g., HH:mm:ss)"
          style={{ padding: '10px', width: '300px', fontSize: '16px', color: textColor, backgroundColor: backgroundColor }}
        />
      </div>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <label style={{ fontSize: '16px', color: textColor }}>Time Position X: </label>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="range"
      min="-1000"
      max="1000"
      value={x}
      onChange={handleTimePositionX}
      style={{ marginLeft: '10px', width: '200px' }}
    />
    <input
      type="number"
      value={x}
      onChange={handleTimePositionX}
      style={{ marginLeft: '10px', width: '60px' }}
      min="-1000"
      max="1000"
    />
  </div>
</div>

<div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <label style={{ fontSize: '16px', color: textColor }}>Time Position Y: </label>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="range"
      min="-1000"
      max="1000"
      value={y}
      onChange={handleTimePositioY}
      style={{ marginLeft: '10px', width: '200px' }}
    />
    <input
      type="number"
      value={y}
      onChange={handleTimePositioY}
      style={{ marginLeft: '10px', width: '60px' }}
      min="-1000"
      max="1000"
    />
  </div>
</div>

<div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <label style={{ fontSize: '16px', color: textColor }}>Date Position X: </label>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="range"
      min="-1000"
      max="1000"
      value={dateX}
      onChange={handleDatePositionX}
      style={{ marginLeft: '10px', width: '200px' }}
    />
    <input
      type="number"
      value={dateX}
      onChange={handleDatePositionX}
      style={{ marginLeft: '10px', width: '60px' }}
      min="-1000"
      max="1000"
    />
  </div>
</div>

<div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <label style={{ fontSize: '16px', color: textColor }}>Date Position Y: </label>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="range"
      min="-1000"
      max="1000"
      value={dateY}
      onChange={handleDatePositionY}
      style={{ marginLeft: '10px', width: '200px' }}
    />
    <input
      type="number"
      value={dateY}
      onChange={handleDatePositionY}
      style={{ marginLeft: '10px', width: '60px' }}
      min="-1000"
      max="1000"
    />
  </div>
</div>

      {/* 시간 크기 조절 */}
      <div style={{ marginTop: '20px' }}>
        <label style={{ fontSize: '16px', color: textColor }}>Time Size: </label>
        <input
          type="range"
          min="10"
          max="500"
          value={timeSize}
          onChange={handleTimeSizeChange}
          style={{ marginLeft: '10px', width: '200px' }}
        />
      </div>

      {/* 날짜 크기 조절 */}
      <div style={{ marginTop: '20px' }}>
        <label style={{ fontSize: '16px', color: textColor }}>Date Size: </label>
        <input
          type="range"
          min="10"
          max="500"
          value={dateSize}
          onChange={handleDateSizeChange}
          style={{ marginLeft: '10px', width: '200px' }}
        />
      </div>
{/* 그림자 색상 */}
<div style={{ marginTop: '20px' }}>
  <input type="color" value={shadowColor} onChange={handleShadowColorChange} />
  <span style={{ marginLeft: '10px', color: textColor }}>Shadow Color</span>
</div>

{/* 그림자 크기 */}
<div style={{ marginTop: '20px', color: textColor }}>
  <label>Shadow Size: </label>
  <input type="range" min="0" max="20" value={shadowSize} onChange={handleShadowSizeChange} />
  <span>{shadowSize}px</span>
</div>
<div style={{ marginTop: '20px' }}>
            <button
              onClick={handleRandomClockColor}
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', color: textColor, backgroundColor: backgroundColor }}
            >
              Random Clock Color
            </button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleRandomUIColor}
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', color: textColor, backgroundColor: backgroundColor }}
            >
              Random UI Color
            </button>
          </div>
  {/* 초기화 버튼 */}
  <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleReset}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', color: textColor, backgroundColor: backgroundColor }}
        >
          Reset to Default
        </button>
      </div>
      {/* URL 입력 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Enter URL for QR code"
          style={{ padding: '10px', width: '300px', fontSize: '16px', color: textColor, backgroundColor: backgroundColor }}
        />
      </div>

      {/* QR 코드 생성 버튼 */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleGenerateQR}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', color: textColor, backgroundColor: backgroundColor }}
        >
          Generate QR Code
        </button>
      </div>

      {/* QR 코드 표시 */}
      {qrCodeUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Generated QR Code</h3>
          <QRCode value={qrCodeUrl} size={256} />
        </div>
      )}
       <div>
      <h1>Number of visitors</h1>
      <p>Number of visitors today: {todayVisitorCount}</p>
      <p>Total number of visitors: {visitorCount}</p>
    </div>
     {/* 푸터 추가 */}
     <footer style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center', marginTop: '0px' }}>
        <p>Copyright © 2025 OkSoft. All Rights Reserved.</p>
        <p>Launching Date: 2025.4.25</p>
      </footer>
    </div>
      )}
       {/* 날짜 표시 (색상, 크기, 위치, 포맷 적용) */}
   {isClockVisible && (
   <h3
        style={{
          color: dateColor,
          fontSize: `${dateSize}px`,
          position: 'fixed',
          top: `${dateY}px`,
          left: `${dateX}px`,
          whiteSpace: 'nowrap',  // 텍스트가 한 줄로 표시되도록 설정
          cursor: 'move',
          userSelect: 'none',
          textShadow: `${shadowSize}px ${shadowSize}px ${shadowColor}`,
          padding: '5px',
        }}
        onMouseDown={(e) => handleMouseDown(e, 'date')}  // 날짜 드래그 시작
        onMouseMove={(e) => handleMouseMove(e, 'date')}  // 날짜 드래그 중
        onMouseUp={handleMouseUp}                      // 드래그 종료
        onTouchStart={(e) => handleStart(e, 'date')}  // 시간 드래그 시작 (터치)
        onTouchMove={(e) => handleMove(e, 'date')}   // 시간 드래그 중 (터치)
        onTouchEnd={handleEnd}                     // 드래그 종료 (터치)
      >
        {formattedDate}
      </h3>
   )}

      {/* 시간 표시 (색상, 크기, 위치, 포맷 적용) */}
      {isClockVisible && (
      <h2
        style={{
          color: timeColor,
          fontSize: `${timeSize}px`,
          position: 'fixed',
          top: `${y}px`,
          left: `${x}px`,
          whiteSpace: 'nowrap',  // 텍스트가 한 줄로 표시되도록 설정
          cursor: 'move',
          userSelect: 'none',
          textShadow: `${shadowSize}px ${shadowSize}px ${shadowColor}`,
          padding: '5px',
        }}
        onMouseDown={(e) => handleMouseDown(e, 'time')}  // 시간 드래그 시작
        onMouseMove={(e) => handleMouseMove(e, 'time')}  // 시간 드래그 중
        onMouseUp={handleMouseUp}                      // 드래그 종료
        onTouchStart={(e) => handleStart(e, 'time')}  // 시간 드래그 시작 (터치)
        onTouchMove={(e) => handleMove(e, 'time')}   // 시간 드래그 중 (터치)
        onTouchEnd={handleEnd}                     // 드래그 종료 (터치)
      >
        {formattedTime}
      </h2>
      )}
    </div>
  );
};

export default App;
