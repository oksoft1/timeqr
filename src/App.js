import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';  // QR 코드 라이브러리 import

const App = () => {
  const [time, setTime] = useState(new Date());  // 시간 상태
  const [url, setUrl] = useState('');  // URL 상태
  const [qrCodeUrl, setQrCodeUrl] = useState('');  // QR 코드 URL 상태

  // 시계를 매초마다 갱신
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);  // 컴포넌트가 언마운트되면 인터벌 클리어
  }, []);

  // 시간 포맷
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

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

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Current Time</h1>
      <h2>{`${hours}:${minutes}:${seconds}`}</h2>

      {/* URL 입력 필드 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={handleUrlChange}
          style={{ padding: '10px', width: '300px', fontSize: '16px', marginBottom: '20px' }}
        />
        {/* QR 코드 생성 버튼 */}
        <button
          onClick={handleGenerateQR}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Generate QR Code
        </button>
      </div>

      {/* QR 코드가 생성되었을 때 표시 */}
      {qrCodeUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Generated QR Code</h3>
          <QRCode value={qrCodeUrl} size={256} />
        </div>
      )}
    </div>
  );
};

export default App;
