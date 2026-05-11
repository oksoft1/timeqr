import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';

const App = () => {
  // --- 1. 상태 관리 ---
  const [canEdit, setCanEdit] = useState(false);
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
  
  const [visitorCount, setVisitorCount] = useState(0);
  const [todayVisitorCount, setTodayVisitorCount] = useState(0);
  const [targetDateTime, setTargetDateTime] = useState('');
  const [countdown, setCountdown] = useState('');
  const [isCountdownVisible, setIsCountdownVisible] = useState(true);

  // --- 2. 텔레그램 및 타이머 설정 ---
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
    }
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/visitor')
      .then(res => res.json())
      .then(data => {
        setVisitorCount(data.visitorCount || 0);
        setTodayVisitorCount(data.todayVisitorCount || 0);
      }).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (targetDateTime) {
        const distance = new Date(targetDateTime).getTime() - new Date().getTime();
        if (distance <= 0) {
          setCountdown('Time is up!');
        } else {
          const d = Math.floor(distance / (1000 * 60 * 60 * 24));
          const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
          const m = Math.floor((distance / (1000 * 60)) % 60);
          const s = Math.floor((distance / 1000) % 60);
          setCountdown(`${d}d ${h}h ${m}m ${s}s`);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDateTime]);

  useEffect(() => {
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };
    const rgb = hexToRgb(backgroundColor);
    setTextColor((rgb.r + rgb.g + rgb.b) <= 384 ? '#FFFFFF' : '#000000');
  }, [backgroundColor]);

  // --- 3. 이벤트 핸들러 ---
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
      const newX = clientX - startX;
      const newY = clientY - startY;
      setX(newX); setY(newY);
      localStorage.setItem('timeX', newX); localStorage.setItem('timeY', newY);
    } else {
      const newX = clientX - startX;
      const newY = clientY - startY;
      setDateX(newX); setDateY(newY);
      localStorage.setItem('dateX', newX); localStorage.setItem('dateY', newX);
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
      
      <button onClick={() => setCanEdit(!canEdit)} style={{
        position: 'absolute', top: '60px', right: '20px', zIndex: 1000,
        padding: '10px 20px', borderRadius: '30px', border: 'none',
        backgroundColor: canEdit ? '#FF4757' : '#2ED573', color: 'white', fontWeight: 'bold'
      }}>
        {canEdit ? '✅ 완료' : '⚙️ 설정'}
      </button>

      {isCountdownVisible && targetDateTime && (
        <div style={{
          position: 'fixed', top: '20px', width: '100%', textAlign: 'center',
          color: textColor, fontSize: '18px', fontWeight: 'bold'
        }}>
          ⏳ {countdown}
        </div>
      )}

      {/* 날짜 */}
      <div onTouchStart={(e)=>handleStart(e,'date')} onTouchMove={(e)=>handleMove(e,'date')} onTouchEnd={()=>setIsDragging(false)}
        onMouseDown={(e)=>handleStart(e,'date')} onMouseMove={(e)=>handleMove(e,'date')} onMouseUp={()=>setIsDragging(false)}
        style={{
          position: 'fixed', top: dateY, left: dateX, color: dateColor, fontSize: `${dateSize}px`,
          textShadow: `${shadowSize}px ${shadowSize}px ${shadowColor}`, userSelect: 'none',
          border: canEdit ? '2px dashed #ccc' : 'none', padding: '5px'
        }}>
        {format(time, dateFormat)}
      </div>

      {/* 시간 */}
      <div onTouchStart={(e)=>handleStart(e,'time')} onTouchMove={(e)=>handleMove(e,'time')} onTouchEnd={()=>setIsDragging(false)}
        onMouseDown={(e)=>handleStart(e,'time')} onMouseMove={(e)=>handleMove(e,'time')} onMouseUp={()=>setIsDragging(false)}
        style={{
          position: 'fixed', top: y, left: x, color: timeColor, fontSize: `${timeSize}px`,
          textShadow: `${shadowSize}px ${shadowSize}px ${shadowColor}`, userSelect: 'none',
          border: canEdit ? '2px dashed #ccc' : 'none', padding: '10px'
        }}>
        {format(time, timeFormat)}
      </div>

      {canEdit && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60vh',
          backgroundColor: 'white', borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
          padding: '20px', overflowY: 'auto', zIndex: 900, color: '#333'
        }}>
          <h3>🛠️ 설정</h3>
          <label>배경: <input type="color" value={backgroundColor} onChange={(e)=>setBackgroundColor(e.target.value)}/></label><br/>
          <label>시간 색상: <input type="color" value={timeColor} onChange={(e)=>setTimeColor(e.target.value)}/></label><br/>
          <label>날짜 색상: <input type="color" value={dateColor} onChange={(e)=>setDateColor(e.target.value)}/></label><br/>
          <label>그림자 색상: <input type="color" value={shadowColor} onChange={(e)=>setShadowColor(e.target.value)}/></label><br/>
          <hr/>
          <label>시간 크기: <input type="range" min="10" max="300" value={timeSize} onChange={(e)=>setTimeSize(Number(e.target.value))}/></label><br/>
          <label>날짜 크기: <input type="range" min="10" max="150" value={dateSize} onChange={(e)=>setDateSize(Number(e.target.value))}/></label><br/>
          <label>그림자 크기: <input type="range" min="0" max="20" value={shadowSize} onChange={(e)=>setShadowSize(Number(e.target.value))}/></label><br/>
          <hr/>
          <label>시간 포맷: <input type="text" value={timeFormat} onChange={(e)=>setTimeFormat(e.target.value)}/></label><br/>
          <label>날짜 포맷: <input type="text" value={dateFormat} onChange={(e)=>setDateFormat(e.target.value)}/></label><br/>
          <hr/>
          <h4>🔗 QR 생성</h4>
          <input type="text" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="URL 입력"/>
          <button onClick={() => setQrCodeUrl(url)}>생성</button>
          {qrCodeUrl && <div style={{marginTop: '10px'}}><QRCode value={qrCodeUrl} size={100} /></div>}
          <hr/>
          <h4>📅 카운트다운</h4>
          <input type="datetime-local" value={targetDateTime} onChange={(e)=>setTargetDateTime(e.target.value)}/>
          <button onClick={() => setIsCountdownVisible(!isCountdownVisible)}>토글</button>
          
          <div style={{marginTop: '30px', paddingBottom: '40px'}}>
             <button onClick={handleReset} style={{backgroundColor: '#FF4757', color: 'white', border: 'none', padding: '10px'}}>초기화</button>
             <p>오늘: {todayVisitorCount} | 전체: {visitorCount}</p>
          </div>
        </div>
      )}

      {!canEdit && (
        <footer style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', fontSize: '12px', opacity: 0.4, color: textColor }}>
          © {new Date().getFullYear()} AnonDev. All rights reserved.
        </footer>
      )}
    </div>
  );
};

export default App;
