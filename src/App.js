import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from "react";

function App() {
  // 시간 상태
  const [time, setTime] = useState(new Date());

  // 1초마다 시간을 갱신하는 useEffect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date()); // 현재 시간을 업데이트
    }, 1000);

    // 컴포넌트가 언마운트될 때 interval을 정리
    return () => clearInterval(intervalId);
  }, []);

  // 시, 분, 초를 2자리로 표시
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "20%" }}>
      <h1>Current Time</h1>
      <h2>{`${hours}:${minutes}:${seconds}`}</h2>
    </div>
  );
}

export default App;