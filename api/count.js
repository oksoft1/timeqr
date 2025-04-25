// api/count.js
let count = 0;  // 방문자 수를 초기화

export default function handler(req, res) {
  // 요청이 들어올 때마다 카운트를 증가시킵니다.
  count++;

  // 카운트를 반환합니다.
  res.status(200).json({ count });
}
