import React, { useState, useEffect } from 'react';
import Prism from './Prism';
import SimplePrism from './SimplePrism';

const PrismBackground = () => {
  const [error, setError] = useState(null);
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    // Test WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
      console.log('WebGL Support:', !!gl);
    } catch (e) {
      console.error('WebGL Test Error:', e);
      setWebglSupported(false);
    }
  }, []);

  if (error) {
    console.error('Prism Error:', error);
    return (
      <div className="prism-background-wrapper">
        <div className="prism-fallback">
          <div className="fallback-gradient"></div>
        </div>
      </div>
    );
  }

  if (!webglSupported) {
    console.warn('WebGL not supported, using fallback');
    return (
      <div className="prism-background-wrapper">
        <div className="prism-fallback">
          <div className="fallback-gradient"></div>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="prism-background-wrapper">
        <div className="prism-fallback">
          <div className="fallback-gradient"></div>
        </div>
        {/* <Prism
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
        /> */}
      </div>
    );
  } catch (e) {
    console.error('Prism Render Error:', e);
    setError(e);
    return (
      <div className="prism-background-wrapper">
        <div className="prism-fallback">
          <div className="fallback-gradient"></div>
        </div>
      </div>
    );
  }
};

export default PrismBackground;
