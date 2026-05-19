import { useState, useEffect } from 'react';

const A4_PX = 794; // 210mm at 96dpi

export function usePreviewScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw <= 767) {
        setScale(Math.min(1, (vw - 16) / A4_PX));
      } else {
        setScale(1);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return scale;
}
