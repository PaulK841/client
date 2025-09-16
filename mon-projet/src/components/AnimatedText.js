import React, { useState, useEffect } from 'react';

const AnimatedText = ({ 
  text, 
  className = '', 
  delay = 100,
  animationType = 'fadeInUp' 
}) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleChars(prev => {
        if (prev < text.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  const getCharClass = (index) => {
    if (index < visibleChars) {
      switch (animationType) {
        case 'fadeInUp':
          return 'char-visible fade-in-up';
        case 'glitch':
          return 'char-visible glitch-effect';
        case 'neon':
          return 'char-visible neon-glow';
        default:
          return 'char-visible';
      }
    }
    return 'char-hidden';
  };

  return (
    <span className={`animated-text ${className}`}>
      {text.split('').map((char, index) => (
        <span 
          key={index} 
          className={`char ${getCharClass(index)}`}
          style={{ 
            animationDelay: `${index * (delay / 1000)}s`,
            display: char === ' ' ? 'inline' : 'inline-block'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;
