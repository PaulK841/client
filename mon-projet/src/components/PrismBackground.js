import React from 'react';
import Prism from './Prism'; // On réimporte le vrai Prism

const PrismBackground = () => {
  return (
    <div className="prism-background-wrapper">
      <Prism />
    </div>
  );
};

export default PrismBackground;
