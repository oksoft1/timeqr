import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';
import * as locales from 'date-fns/locale';

const App = () => {
  // --- 1. 상태 관리 (기존 모든 기능 포함) ---
  const [canEdit, setCanEdit] = useState(false); // 수정 모드 여부
  const [time, setTime] = useState(new Date());
  const [url, setUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [timeColor, setTimeColor] = useState(localStorage.getItem('timeColor') || '#A8E6CF');
  const [dateColor, setDateColor] = useState(localStorage.getItem('dateColor') || '#33A1FF');
  const [timeFormat, setTimeFormat] = useState(localStorage.getItem('timeFormat') || 'HH:mm:ss');
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'yyyy-MM-dd eeee');
  const [x, setX] = useState(Number(localStorage.getItem('timeX')) || 10);
  const [y, setY] = useState(Number(localStorage.getItem('timeY')) || 100);
  const [dateX, setDateX] = useState(Number(localStorage.getItem('dateX')) || 20);
  const [dateY, setDateY] = useState(Number(localStorage.getItem('dateY')) || 220);
  const [timeSize, setTimeSize] = useState(Number(localStorage.getItem('timeSize')) || 60);
  const [dateSize, setDateSize] = useState(Number(localStorage.getItem('dateSize')) || 25);
  const [shadowColor, setShadowColor] = useState(localStorage.getItem('shadowColor') || '#000000');
  const [shadowSize, setShadowSize] = useState(Number(localStorage.getItem('shadowSize')) || 2);
  const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem('backgroundColor') || '#FFFFFF');
  const [textColor, setTextColor] = useState('#000000');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  
  // 방문자 및 카운트다운 상태
  const [visitorCount, setVisitorCount] = useState(0);
  const [todayVisitorCount, setTodayVisitorCount] = useState(0);
  const [targetDateTime, setTargetDateTime] = useState('');
  const [countdown, setCountdown] = useState('');
  const [isCountdownVisible, setIsCountdownVisible] = useState(true);

  // --- 2. 텔레그램 연동 및 초기 설정 ---
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand(); // 화면 가득 키우기
    }
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 방문자 수 API 호출 (기존 로직 유지)
  useEffect(() => {
    fetch('/api/visitor')
      .then(res => res.json())
      .then(data => {
        setVisitorCount(data.visitorCount || 0);
        setTodayVisitorCount(data.todayVisitorCount || 0);
      }).catch(() => {});
  }, []);

  // 카운트다운 로직
  useEffect(() => {
    const interval = setInterval(() => {
      if (targetDateTime) {
        const distance = new Date(targetDateTime).getTime() - new Date().getTime();
        if (distance <= 0) {
          setCountdown('Time is up!');
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((distance / (1000 * 60)) % 60);
          const seconds = Math.floor((distance / 1000) % 60);
          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDateTime]);

  // 배경색에 따른 글자색 자동 반전
  useEffect(() => {
    const rgb = hexToRgb(backgroundColor);
    setTextColor((rgb.r + rgb.g + rgb.b) <= 384 ? '#FFFFFF' : '#000000');
  }, [backgroundColor]);

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  // --- 3. 드래그 핸들러 (canEdit 조건 추가) ---
  const handleStart = (e, type) => {
    if (!canEdit) return;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    setStartX(type === 'time' ? clientX - x : clientX - dateX);
    setStartY(type === 'time' ? clientY - y : clientY - dateY);
    setIsDragging(true);
  };

  const handleMove = (e, type) => {
    if (!isDragging || !canEdit) return;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    if (type === 'time') {
      setX(clientX - startX); setY(clientY - startY);
      localStorage.setItem('timeX', clientX - startX); localStorage.setItem('timeY', clientY - startY);
    } else {
      setDateX(clientX - startX); setDateY(clientY - startY);
      localStorage.setItem('dateX', clientX - startX); localStorage.setItem('dateY', clientY - startY);
    }
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: backgroundColor, overflow: 'hidden', touchAction: 'none'
    }}>
      
      {/* 🔓 수정 모드 스위치 */}
      <button onClick={() => setCanEdit(!canEdit)} style={{
        position: 'absolute', top: '50px', right: '20px', zIndex: 1000,
        padding: '10px 20px', borderRadius: '30px', border: 'none',
        backgroundColor: canEdit ? '#FF4757' : '#2ED573', color: 'white', fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        {canEdit ? '✅ 수정 완료' : '⚙️ 앱 설정'}
      </button>

      {/* ⏳ 카운트다운 표시 */}
      {isCountdownVisible && targetDateTime && (
        <div style={{
          position: 'fixed', top: '15px', width: '100%', textAlign: 'center',
          color: textColor, fontSize: '18px', fontWeight: 'bold', zIndex: 10
        }}>
          ⏳ {countdown}
        </div>
      )}

      {/* ⏰ 시계 & 날짜 영역 */}
      <div onTouchStart={(e)=>handleStart(e,'date')} onTouchMove={(e)=>handleMove(e,'date')} onTouchEnd={()=>setIsDragging(false)}
        onMouseDown={(e)=>handleStart(e,'date')} onMouseMove={(e)=>handleMove(e,'date')} onMouseUp={()=>setIsDragging(false)}
        style={{
          position: 'fixed', top: dateY, left: dateX, color: dateColor, fontSize: `${dateSize}px`,
          textShadow: `${shadowSize}px ${shadowSize}px ${shadowColor}`, userSelect: 'none',
          border: canEdit ? '2px dashed #ccc' : 'none', padding: '5px'
        }}>
        {format(time, dateFormat)}
      </div>

      <div onTouchStart={(e)=>handleStart(e,'time')} onTouchMove={(e)=>handleMove(e,'time')} onTouchEnd={()=>setIsDragging(false)}
        onMouseDown={(e)=>handleStart(e,'time')} onMouseMove={(e)=>handleMove(e,'time')} onMouseUp={()=>setIsDragging(false)}
        style={{
          position: 'fixed', top: y, left: x, color: timeColor, fontSize: `${timeSize}px`,
          textShadow: `${shadowSize}px ${shadowSize}px ${shadowColor}`, userSelect: 'none',
          border: canEdit ? '2px dashed #ccc' : 'none', padding: '10px'
        }}>
        {format(time, timeFormat)}
      </div>

      {/* ⚙️ 설정창 (수정 모드에서만 등장) */}
      {canEdit && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60vh',
          backgroundColor: 'white', borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
          padding: '20px', overflowY: 'auto', zIndex: 900, boxShadow: '0 -5px 20px rgba(0,0,0,0.1)', color: '#333'
        }}>
          <h3>🛠️ 설정 메뉴</h3>
          <p style={{fontSize: '12px'}}>시계와 날짜를 직접 드래그하여 배치하세요.</p>
          
          <hr/>
          <h4>🎨 색상 및 배경</h4>
          <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
             <label>배경: <input type="color" value={backgroundColor} onChange={(e)=>setBackgroundColor(e.target.value)}/></label>
             <label>시간: <input type="color" value={timeColor} onChange={(e)=>setTimeColor(e.target.value)}/></label>
             <label>날짜: <input type="color" value={dateColor} onChange={(e)=>setDateColor(e.target.value)}/></label>
          </div>

          <h4>📏 크기 조절</h4>
          <label>시간 크기: <input type="range" min="10" max="300" value={timeSize} onChange={(e)=>setTimeSize(Number(e.target.value))}/></label><br/>
          <label>날짜 크기: <input type="range" min="10" max="150" value={dateSize} onChange={(e)=>setDateSize(Number(e.target.value))}/></label>

          <h4>🔗 QR 코드 생성</h4>
          <input type="text" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="URL 입력" style={{width: '70%', padding: '5px'}}/>
          <button onClick={() => setQrCodeUrl(url)} style={{marginLeft: '5px'}}>생성</button>
          {qrCodeUrl && <div style={{marginTop: '10px'}}><QRCode value={qrCodeUrl} size={128} /></div>}

          <h4>📅 카운트다운</h4>
          <input type="datetime-local" value={targetDateTime} onChange={(e)=>setTargetDateTime(e.target.value)} style={{padding: '5px'}}/>
          
          <div style={{marginTop: '30px', paddingBottom: '50px'}}>
             <button onClick={handleReset} style={{backgroundColor: '#eee', border: '1px solid #ccc', padding: '10px'}}>전체 초기화</button>
             <p style={{fontSize: '10px', marginTop: '10px'}}>오늘 방문자: {todayVisitorCount} | 전체 방문자: {visitorCount}</p>
          </div>
        </div>
      )}

      {/* 📜 저작권 표시 */}
      {!canEdit && (
        <footer style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', fontSize: '12px', opacity: 0.4, color: textColor }}>
          © {new Date().getFullYear()} AnonDev. All rights reserved.
        </footer>
      )}
    </div>
  );
};

export default App;
