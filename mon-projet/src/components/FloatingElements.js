import React from 'react';

const FloatingElements = () => {
  const elements = [
    // Geometric shapes
    { id: 1, type: 'triangle', size: 'small', delay: 0 },
    { id: 2, type: 'circle', size: 'medium', delay: 2 },
    { id: 3, type: 'square', size: 'large', delay: 4 },
    { id: 4, type: 'triangle', size: 'medium', delay: 1 },
    { id: 5, type: 'circle', size: 'small', delay: 3 },
    { id: 6, type: 'square', size: 'small', delay: 5 },
    { id: 7, type: 'triangle', size: 'large', delay: 2.5 },
    { id: 8, type: 'circle', size: 'medium', delay: 4.5 },
    
    // Tech symbols
    { id: 9, type: 'code', size: 'small', delay: 1.5 },
    { id: 10, type: 'chip', size: 'medium', delay: 3.5 },
    { id: 11, type: 'binary', size: 'small', delay: 0.5 },
    { id: 12, type: 'circuit', size: 'large', delay: 5.5 },
  ];

  const renderElement = (element) => {
    const baseClass = `floating-element floating-${element.type} size-${element.size}`;
    
    switch (element.type) {
      case 'triangle':
        return <div className={`${baseClass} triangle`} />;
      case 'circle':
        return <div className={`${baseClass} circle`} />;
      case 'square':
        return <div className={`${baseClass} square`} />;
      case 'code':
        return <div className={`${baseClass} code`}>{'</>'}</div>;
      case 'chip':
        return <div className={`${baseClass} chip`}>⚡</div>;
      case 'binary':
        return <div className={`${baseClass} binary`}>01</div>;
      case 'circuit':
        return <div className={`${baseClass} circuit`}>⚙</div>;
      default:
        return <div className={baseClass} />;
    }
  };

  return (
    <div className="floating-elements-container">
      {elements.map((element, index) => (
        <div
          key={element.id}
          className="floating-wrapper"
          style={{
            '--delay': `${element.delay}s`,
            '--position-x': `${(index * 83) % 100}%`,
            '--position-y': `${(index * 47) % 100}%`,
          }}
        >
          {renderElement(element)}
        </div>
      ))}
    </div>
  );
};

export default FloatingElements;
