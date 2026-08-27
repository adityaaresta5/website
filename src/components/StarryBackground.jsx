import React from 'react';
import './StarryBackground.css';

const StarryBackground = () => {
  // Generate random stars
  const stars = Array.from({ length: 50 }).map((_, i) => {
    const left = Math.random() * 100;
    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 5 + 5;
    const delay = Math.random() * 5;
    
    return (
      <div
        key={i}
        className="star"
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });

  return (
    <div className="starry-background">
      {stars}
    </div>
  );
};

export default StarryBackground;
