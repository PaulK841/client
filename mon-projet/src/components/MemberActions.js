import React from 'react';

// --- On centralise les icônes ici ---
const DownloadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const DiscordIcon = () => (
  <svg role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>Discord</title>
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.446.825-.666 1.282-2.258.044-4.516.044-6.774 0-.22-.457-.456-.907-.666-1.282a.074.074 0 00-.079-.037A19.791 19.791 0 003.683 4.37a.025.025 0 00-.001.018c-.53.45-1.023.963-1.478 1.543a.074.074 0 00.012.102c1.432.858 2.822 1.583 4.162 2.15.025.012.04.025.053.037a17.47 17.47 0 00-2.3-2.586.074.074 0 00-.012-.102c-.001-.001-.001-.001 0 0-1.258.846-2.504 1.7-3.642 2.586a.074.074 0 00.013.114c.153.102.307.2.46.3.065.04.13.066.205.093a19.014 19.014 0 00-2.738 7.078.074.074 0 00.08.086c.394.14.79.27 1.185.39.074.025.15.013.205-.037a1.642 1.642 0 00.418-.553c-.48-.26-1.478-2.01-1.478-2.01s-.012-.013-.012-.025c.013-.012.025-.025-.037.037-.128.09-.268.192-.408.282a17.47 17.47 0 002.3-2.586.074.074 0 00.012.102c.001.001.001.001 0 0 .53.45.963 1.023 1.543 1.478a.074.074 0 00.102.012c.706-.394 1.39-.79 2.062-1.185a.074.074 0 00.038-.078 19.014 19.014 0 00-2.738-7.078.074.074 0 00-.08-.086c-.394-.14-.79-.27-1.185-.39a.074.074 0 00-.205.037 1.642 1.642 0 00-.418.553c.48.26 1.478 2.01 1.478 2.01s.012.013.012.025c-.013.012-.025.025-.037.037-.128.09-.268.192-.408.282a17.47 17.47 0 00-2.3 2.586.074.074 0 00-.012-.102l0 0z" />
  </svg>
);


const MemberActions = () => {
    // IMPORTANT: Remplacez '#' par vos vrais liens ici
    const downloadLink = "#";
    const discordLink = "#";

    return (
        <div className="member-actions">
            <div className="member-action-card">
                <div className="step-icon"><DownloadIcon /></div>
                <h3>Download Software</h3>
                <p>Get the latest version of the AimGuard client.</p>
                <a href={downloadLink} className="auth-button">Download Now</a> 
            </div>

            <div className="member-action-card">
                <div className="step-icon"><DiscordIcon /></div>
                <h3>Join our Community</h3>
                <p>Get support, share profiles, and chat with other users.</p>
                <a href={discordLink} target="_blank" rel="noopener noreferrer" className="secondary-button">Join Discord</a>
            </div>
        </div>
    );
};

export default MemberActions;