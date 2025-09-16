import React from 'react';

const PrismBackground = () => {
  return (
    <div className="prism-background">
      {/* Animated gradient shapes */}
      <div className="prism-shape prism-shape-1"></div>
      <div className="prism-shape prism-shape-2"></div>
      <div className="prism-shape prism-shape-3"></div>
      <div className="prism-shape prism-shape-4"></div>
      <div className="prism-shape prism-shape-5"></div>
      
      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>
      
      {/* Grid overlay */}
      <div className="grid-overlay"></div>
    </div>
  );
};

export default PrismBackground;
