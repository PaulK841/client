import React, { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import physicalToolImg from '../assets/unnamed (1).png'; 
import softwareImg from '../assets/software.png';

// --- Les icônes SVG restent les mêmes ---
const CrosshairIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>);
const SettingsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>);
const ShieldIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>);
const SolderIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13.3 3.4-2.6 2.6a1 1 0 0 0 0 1.4l5.8 5.8a1 1 0 0 0 1.4 0l2.6-2.6Z"/><path d="m12 12 6 6"/><path d="m6.2 21.2 1.4-1.4a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L2 17.2V22h4.8Z"/></svg>);
const CheckBadgeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.78l1.21 1.21a1 1 0 0 0 1.41 0l1.21-1.21a4 4 0 0 1 4.78 4.78l-1.21 1.21a1 1 0 0 0 0 1.41l1.21 1.21a4 4 0 0 1-4.78 4.78l-1.21-1.21a1 1 0 0 0-1.41 0l-1.21 1.21a4 4 0 0 1-4.78-4.78l1.21-1.21a1 1 0 0 0 0-1.41Z"/><path d="m9 12 2 2 4-4"/></svg>);
const BoxIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>);

const HomePage = () => {
  const tiltRef = useRef(null);
  const tiltContainerRef = useRef(null);

  const [featuresRef, isFeaturesVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [hardwareRef, isHardwareVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [softwareRef, isSoftwareVisible] = useIntersectionObserver({ threshold: 0.1 });

  const handleMouseMove = (e) => {
    const el = tiltRef.current;
    if (!el) return;
    const { clientX, clientY } = e;
    const rect = tiltContainerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (clientY - rect.top - rect.height / 2) / (rect.height / 2);
    el.style.transform = `perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Master Your Aim. Conquer the Game.</h1>
          <p>The ultimate hardware-based anti-recoil solution for competitive gamers who demand pixel-perfect precision.</p>
          <a href="#features" className="hero-btn">Explore Features</a>
        </div>
      </section>

      <section 
        id="features" 
        className={`fade-in-section ${isFeaturesVisible ? 'is-visible' : ''}`} 
        ref={featuresRef}
      >
        <div className="container">
          <div className="section-header">
            <h2>Why Choose AimGuard?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card"><h3><CrosshairIcon/> Pixel-Perfect Precision</h3><p>Our advanced algorithm provides flawless recoil compensation, turning your spray into a laser beam.</p></div>
            <div className="feature-card"><h3><SettingsIcon/> Fully Customizable</h3><p>Fine-tune every aspect of recoil control for any weapon in any game with our intuitive software.</p></div>
            <div className="feature-card"><h3><ShieldIcon/> Hardware Based & Undetected</h3><p>Operates at the hardware level, making it completely invisible to anti-cheat systems. Play with peace of mind.</p></div>
          </div>
        </div>
      </section>
      
      <section 
        id="hardware-build" 
        className={`split-section fade-in-section ${isHardwareVisible ? 'is-visible' : ''}`} 
        ref={hardwareRef}
      >
        <div className="container split-section-grid" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <div className="text-content">
            <h2>Expertly Hand-Crafted Hardware</h2>
            <p>You don't just receive a product; you receive a piece of precision engineering. Each AimGuard device is meticulously assembled by hand to ensure maximum quality and performance.</p>
            <div className="hardware-features">
              <div className="hardware-feature-item"><SolderIcon /><div><h4>Precision Soldering</h4><p>Every connection is hand-soldered for superior durability and flawless electrical conductivity.</p></div></div>
              <div className="hardware-feature-item"><CheckBadgeIcon /><div><h4>Rigorous Testing</h4><p>Each unit undergoes a multi-point inspection and performance test before it's cleared for shipping.</p></div></div>
              <div className="hardware-feature-item"><BoxIcon /><div><h4>Ready to Dominate</h4><p>Your device arrives fully assembled, flashed with the latest firmware, and ready for plug-and-play action.</p></div></div>
            </div>
          </div>
          <div className="image-content" ref={tiltContainerRef}><img src={physicalToolImg} alt="AimGuard Physical Device" ref={tiltRef} id="device-image"/></div>
        </div>
      </section>

      <section 
        id="software" 
        className={`split-section fade-in-section ${isSoftwareVisible ? 'is-visible' : ''}`} 
        ref={softwareRef}
      >
        <div className="container split-section-grid software-grid">
          <div className="image-content"><img src={softwareImg} alt="AimGuard Software Interface" className="software-image"/></div>
          <div className="text-content">
            <h2>Effortless Control. Powerful Results.</h2>
            <p>Our companion software is designed for simplicity and power. Get set up in minutes with an intuitive interface that makes recoil control accessible to everyone.</p>
            <ul className="software-features-list">
              <li><strong>Easy to Use:</strong> A clean, straightforward layout means you spend less time tweaking and more time playing.</li>
              <li><strong>Unlimited Profiles:</strong> Create, save, and switch between profiles for different games, weapons, and attachments on the fly.</li>
              <li><strong>Real-time Visualization:</strong> Understand recoil patterns and create perfect counter-movements with visual feedback.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;