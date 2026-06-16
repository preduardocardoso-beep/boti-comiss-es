import { useEffect, useState } from 'react';

// Animações da Copa do Mundo - exibidas até 19/07/2026 ou até remoção manual
const END_DATE = new Date('2026-07-19T23:59:59');

export const WorldCupAnimation = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('worldcup_animation_dismissed') === '1';
    const now = new Date();
    setVisible(!dismissed && now <= END_DATE);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes wc-fly-left {
          0% { transform: translateX(-10vw); }
          100% { transform: translateX(110vw); }
        }
        @keyframes wc-fly-right {
          0% { transform: translateX(110vw); }
          100% { transform: translateX(-10vw); }
        }
        @keyframes wc-wave {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes wc-juggle-body {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-4px) rotate(-2deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-4px) rotate(2deg); }
        }
        @keyframes wc-juggle-ball {
          0%   { transform: translate(-14px, -10px) rotate(0deg); }
          15%  { transform: translate(-18px, -38px) rotate(90deg); }
          30%  { transform: translate(-14px, -10px) rotate(180deg); }
          45%  { transform: translate(0px,   -6px)  rotate(270deg); }
          60%  { transform: translate(14px,  -10px) rotate(360deg); }
          75%  { transform: translate(18px,  -38px) rotate(450deg); }
          90%  { transform: translate(14px,  -10px) rotate(540deg); }
          100% { transform: translate(-14px, -10px) rotate(630deg); }
        }
        @keyframes wc-pop {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .wc-flag-strip {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(90deg, #009C3B 0 33%, #FFDF00 33% 66%, #002776 66% 100%);
          z-index: 9998;
          pointer-events: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .wc-floating-flag {
          position: fixed;
          top: 70px;
          font-size: 22px;
          z-index: 9998;
          pointer-events: none;
          animation: wc-fly-left 22s linear infinite;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
        }
        .wc-floating-flag.f2 {
          top: 140px;
          font-size: 18px;
          animation: wc-fly-right 28s linear infinite;
          animation-delay: -8s;
        }
        .wc-floating-flag.f3 {
          top: auto;
          bottom: 90px;
          font-size: 20px;
          animation: wc-fly-left 26s linear infinite;
          animation-delay: -14s;
        }
        .wc-player-wrap {
          position: fixed;
          bottom: 12px;
          right: 12px;
          z-index: 9999;
          animation: wc-pop 0.6s ease-out;
        }
        .wc-player-card {
          position: relative;
          background: linear-gradient(135deg, #009C3B, #007a2e);
          border: 2px solid #FFDF00;
          border-radius: 16px;
          padding: 10px 12px 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
          display: flex;
          align-items: flex-end;
          gap: 6px;
        }
        .wc-player-svg {
          width: 56px;
          height: 70px;
          animation: wc-juggle-body 1s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .wc-ball-svg {
          position: absolute;
          left: 50%;
          top: 18px;
          width: 18px;
          height: 18px;
          animation: wc-juggle-ball 1s ease-in-out infinite;
        }
        .wc-flag-wave {
          font-size: 22px;
          display: inline-block;
          animation: wc-wave 1.6s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .wc-close {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          color: #002776;
          border: 2px solid #FFDF00;
          font-size: 13px;
          line-height: 1;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (prefers-reduced-motion: reduce) {
          .wc-floating-flag, .wc-player-svg, .wc-ball-svg, .wc-flag-wave {
            animation: none !important;
          }
        }
      `}</style>

      <div className="wc-flag-strip" />
      <div className="wc-floating-flag" aria-hidden>🇧🇷</div>
      <div className="wc-floating-flag f2" aria-hidden>🇧🇷</div>
      <div className="wc-floating-flag f3" aria-hidden>🏆</div>

      <div className="wc-player-wrap" aria-hidden>
        <div className="wc-player-card">
          <button
            className="wc-close"
            onClick={() => {
              localStorage.setItem('worldcup_animation_dismissed', '1');
              setVisible(false);
            }}
            aria-label="Fechar animação Copa"
            title="Fechar"
          >×</button>

          <span className="wc-flag-wave">🇧🇷</span>

          <div style={{ position: 'relative' }}>
            {/* Bonequinho jogador */}
            <svg className="wc-player-svg" viewBox="0 0 56 70" xmlns="http://www.w3.org/2000/svg">
              {/* Cabeça */}
              <circle cx="28" cy="12" r="7" fill="#f5c79a" />
              <path d="M21 10 Q28 3 35 10 Q35 7 28 5 Q21 7 21 10 Z" fill="#3a2410" />
              {/* Camisa amarela */}
              <path d="M14 22 L42 22 L40 44 L16 44 Z" fill="#FFDF00" stroke="#009C3B" strokeWidth="1.5"/>
              {/* Gola verde */}
              <path d="M24 22 L28 26 L32 22 Z" fill="#009C3B"/>
              {/* Número 10 */}
              <text x="28" y="36" textAnchor="middle" fontSize="9" fontWeight="700" fill="#009C3B" fontFamily="Arial">10</text>
              {/* Braços */}
              <rect x="10" y="22" width="5" height="16" rx="2" fill="#FFDF00" stroke="#009C3B" strokeWidth="1"/>
              <rect x="41" y="22" width="5" height="16" rx="2" fill="#FFDF00" stroke="#009C3B" strokeWidth="1"/>
              {/* Calção azul */}
              <path d="M16 44 L40 44 L38 54 L18 54 Z" fill="#002776"/>
              {/* Pernas */}
              <rect x="19" y="54" width="7" height="12" fill="#f5c79a"/>
              <rect x="30" y="54" width="7" height="12" fill="#f5c79a"/>
              {/* Chuteiras */}
              <ellipse cx="22" cy="68" rx="5" ry="2" fill="#1a1a1a"/>
              <ellipse cx="34" cy="68" rx="5" ry="2" fill="#1a1a1a"/>
            </svg>

            {/* Bola da copa */}
            <svg className="wc-ball-svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" fill="#fff" stroke="#111" strokeWidth="1"/>
              <polygon points="10,5 13,7 12,11 8,11 7,7" fill="#111"/>
              <line x1="10" y1="1" x2="10" y2="5" stroke="#111" strokeWidth="0.8"/>
              <line x1="19" y1="10" x2="13" y2="7" stroke="#111" strokeWidth="0.8"/>
              <line x1="16" y1="18" x2="12" y2="11" stroke="#111" strokeWidth="0.8"/>
              <line x1="4" y1="18" x2="8" y2="11" stroke="#111" strokeWidth="0.8"/>
              <line x1="1" y1="10" x2="7" y2="7" stroke="#111" strokeWidth="0.8"/>
            </svg>
          </div>

          <span className="wc-flag-wave" style={{ animationDelay: '0.5s' }}>🇧🇷</span>
        </div>
      </div>
    </>
  );
};
