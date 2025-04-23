import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';  // QR 코드 라이브러리 import
import { format } from 'date-fns';  // 날짜 포맷 라이브러리 import
const App = () => {
  const [time, setTime] = useState(new Date());  // 시간 상태
  const [url, setUrl] = useState('');  // URL 상태
  const [qrCodeUrl, setQrCodeUrl] = useState('');  // QR 코드 URL 상태
  const [timeColor, setTimeColor] = useState(localStorage.getItem('timeColor') || '#A8E6CF');  // 시간 색상 상태
  const [dateColor, setDateColor] = useState(localStorage.getItem('dateColor') || '#33A1FF');  // 날짜 색상 상태
  const [timeFormat, setTimeFormat] = useState(localStorage.getItem('timeFormat') || 'HH:mm:ss');  // 시간 포맷 상태
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'yyyy-MM-dd eeee');  // 날짜 포맷 상태
  const [x, setX] = useState(Number(localStorage.getItem('timeX')) || -180);  // 시간 x 좌표
  const [y, setY] = useState(Number(localStorage.getItem('timeY')) || -80);  // 시간 y 좌표
  const [dateX, setDateX] = useState(Number(localStorage.getItem('dateX')) || -180);  // 날짜 x 좌표
  const [dateY, setDateY] = useState(Number(localStorage.getItem('dateY')) || 70);  // 날짜 y 좌표
  const [isDragging, setIsDragging] = useState(false);  // 드래그 상태
  const [startX, setStartX] = useState(0);  // 드래그 시작 x 좌표
  const [startY, setStartY] = useState(0);  // 드래그 시작 y 좌표
  const [timeSize, setTimeSize] = useState(Number(localStorage.getItem('timeSize')) || 90);  // 시간 크기 상태
  const [dateSize, setDateSize] = useState(Number(localStorage.getItem('dateSize')) || 30);  // 날짜 크기 상태
  const [shadowColor, setShadowColor] = useState(localStorage.getItem('shadowColor') || '#000000');
  const [shadowSize, setShadowSize] = useState(Number(localStorage.getItem('shadowSize')) || 2);
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
  // 시계를 매초마다 갱신
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);  // 컴포넌트가 언마운트되면 인터벌 클리어
  }, []);

  // 시간 포맷
  const formattedTime = format(time, timeFormat);

  // 날짜 포맷 처리 (유효하지 않은 경우 기본 포맷으로 설정)
  let formattedDate = '';
  try {
    formattedDate = dateFormat ? format(time, dateFormat) : format(time, 'yyyy-MM-dd eeee');
  } catch (error) {
    console.error('Invalid date format:', dateFormat);
    formattedDate = format(time, 'yyyy-MM-dd eeee');  // 기본 포맷으로 설정
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
    setX(-180);
    setY(-80);
    setDateX(-180);
    setDateY(70);
    setShadowSize(2);

    // 로컬 스토리지 초기화
    localStorage.clear();
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
    }}
  >
    {/* 시계 부분: 윗쪽 고정 */}
    <div
        style={{
          position: 'fixed',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '1000',
        }}
      >
   {/* 날짜 표시 (색상, 크기, 위치, 포맷 적용) */}
   <h3
        style={{
          color: dateColor,
          fontSize: `${dateSize}px`,
          position: 'absolute',
          top: `${dateY}px`,
          left: `${dateX}px`,
          whiteSpace: 'nowrap',  // 텍스트가 한 줄로 표시되도록 설정
          cursor: 'move',
          userSelect: 'none',
    textShadow: `${shadowSize}px ${shadowSize}px ${shadowColor}`,
    padding: '5px'
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

      {/* 시간 표시 (색상, 크기, 위치, 포맷 적용) */}
      <h2
        style={{
          color: timeColor,
          fontSize: `${timeSize}px`,
          position: 'absolute',
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
    </div>
    {/* 옵션들: 스크롤 가능 */}
    <div style={{ marginTop: '150px', overflowY: 'auto', maxHeight: 'calc(100vh - 270px)',border: '2px solid #ccc', }}>
      {/* 시간 색상 선택 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="color"
          value={timeColor}
          onChange={handleTimeColorChange}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <span style={{ marginLeft: '10px', fontSize: '16px' }}>Select Time Color</span>
      </div>

      {/* 날짜 색상 선택 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="color"
          value={dateColor}
          onChange={handleDateColorChange}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <span style={{ marginLeft: '10px', fontSize: '16px' }}>Select Date Color</span>
      </div>

      {/* 날짜 포맷 입력 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={dateFormat}
          onChange={handleDateFormatChange}
          placeholder="Enter Date Format (e.g., yyyy-MM-dd eeee)"
          style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
      </div>

      {/* 시간 포맷 입력 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={timeFormat}
          onChange={handleTimeFormatChange}
          placeholder="Enter Time Format (e.g., HH:mm:ss)"
          style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
      </div>

      {/* 시간 크기 조절 */}
      <div style={{ marginTop: '20px' }}>
        <label style={{ fontSize: '16px' }}>Time Size: </label>
        <input
          type="range"
          min="10"
          max="100"
          value={timeSize}
          onChange={handleTimeSizeChange}
          style={{ marginLeft: '10px', width: '200px' }}
        />
      </div>

      {/* 날짜 크기 조절 */}
      <div style={{ marginTop: '20px' }}>
        <label style={{ fontSize: '16px' }}>Date Size: </label>
        <input
          type="range"
          min="10"
          max="100"
          value={dateSize}
          onChange={handleDateSizeChange}
          style={{ marginLeft: '10px', width: '200px' }}
        />
      </div>
{/* 그림자 색상 */}
<div style={{ marginTop: '20px' }}>
  <input type="color" value={shadowColor} onChange={handleShadowColorChange} />
  <span style={{ marginLeft: '10px' }}>Shadow Color</span>
</div>

{/* 그림자 크기 */}
<div style={{ marginTop: '20px' }}>
  <label>Shadow Size: </label>
  <input type="range" min="0" max="20" value={shadowSize} onChange={handleShadowSizeChange} />
  <span>{shadowSize}px</span>
</div>
  {/* 초기화 버튼 */}
  <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleReset}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
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
          style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
      </div>

      {/* QR 코드 생성 버튼 */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleGenerateQR}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
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
    </div>
    </div>
  );
};

export default App;
