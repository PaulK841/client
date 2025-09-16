import React from 'react';
import Prism from './Prism';

const PrismBackground = () => {
  return (
    <div className="prism-background-wrapper">
      <Prism
        animationType="rotate"
        timeScale={0.3}
        height={3.5}
        baseWidth={5.5}
        scale={2.8}
        hueShift={0.8}
        colorFrequency={0.8}
        noise={0.1}
        glow={0.8}
        bloom={0.7}
        transparent={true}
      />
    </div>
  );
};

export default PrismBackground;
