'use client';

import { useEffect, useState } from 'react';

type SplashScreenProps = {
  onComplete: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sequence = setTimeout(() => {
      setVisible(false);
      const completion = setTimeout(onComplete, 500); // Wait for fade out
      return () => clearTimeout(completion);
    }, 2500); // Stay for 2.5 seconds

    return () => clearTimeout(sequence);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <h1
        className={`text-2xl md:text-3xl text-white transition-opacity duration-500 ${
          visible ? 'animate-in fade-in-0' : 'animate-out fade-out-0'
        }`}
        style={{ animationDuration: '1000ms' }}
      >
        Security, taken to the next level.
      </h1>
    </div>
  );
}
