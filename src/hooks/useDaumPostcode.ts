import { useState, useEffect } from 'react';

const useDaumPostcode = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 이미 로드된 경우 바로 loaded 처리
    if (window.daum && window.daum.Postcode) {
      setLoaded(true);
      return;
    }

    // 중복 삽입 방지
    if (document.getElementById('daum-postcode-sdk')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'daum-postcode-sdk';
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.charset = 'UTF-8';
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);

    // (선택) 언마운트 시 script 태그 제거
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return loaded;
};

export default useDaumPostcode;
