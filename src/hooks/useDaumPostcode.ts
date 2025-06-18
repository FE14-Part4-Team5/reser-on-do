import { useState, useEffect } from 'react';

const useDaumPostcode = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.daum && window.daum.Postcode) {
      setLoaded(true);
      return;
    }

    if (document.getElementById('daum-postcode-sdk')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'daum-postcode-sdk';
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.charset = 'UTF-8';
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return loaded;
};

export default useDaumPostcode;
