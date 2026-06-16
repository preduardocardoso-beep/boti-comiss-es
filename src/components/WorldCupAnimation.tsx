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
          left: 8px;
          bottom: 8px;
          z-index: 9999;
          animation: wc-pop 0.6s ease-out;
          pointer-events: none; /* não bloqueia botões */
        }
        .wc-player-card {
          position: relative;
          background: linear-gradient(135deg, rgba(0,156,59,0.92), rgba(0,122,46,0.92));
          border: 2px solid #FFDF00;
          border-radius: 14px;
          padding: 6px 8px 4px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.22);
          display: flex;
          align-items: flex-end;
          gap: 4px;
          backdrop-filter: blur(2px);
        }
        .wc-player-svg {
          width: 48px;
          height: 64px;
          animation: wc-juggle-body 1s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .wc-ball-svg {
          position: absolute;
          left: 50%;
          top: 14px;
          width: 16px;
          height: 16px;
          animation: wc-juggle-ball 1s ease-in-out infinite;
        }
        .wc-flag-wave {
          font-size: 18px;
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
          pointer-events: auto; /* só o X é clicável */
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
            {/* Bonequinho jogador - estilo mais realista */}
            <svg className="wc-player-svg" viewBox="0 0 56 74" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="wcSkin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#e8b48a"/>
                  <stop offset="1" stopColor="#b8895f"/>
                </linearGradient>
                <linearGradient id="wcShirt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFE94A"/>
                  <stop offset="1" stopColor="#E5C200"/>
                </linearGradient>
                <linearGradient id="wcShort" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#003a9e"/>
                  <stop offset="1" stopColor="#001a55"/>
                </linearGradient>
                <radialGradient id="wcBall" cx="0.35" cy="0.35" r="0.7">
                  <stop offset="0" stopColor="#ffffff"/>
                  <stop offset="1" stopColor="#cfcfcf"/>
                </radialGradient>
              </defs>

              {/* Pescoço */}
              <rect x="25" y="17" width="6" height="5" fill="url(#wcSkin)"/>

              {/* Cabeça */}
              <ellipse cx="28" cy="11" rx="7" ry="8" fill="url(#wcSkin)"/>
              {/* Cabelo */}
              <path d="M21 9 Q22 2 28 2 Q35 2 35 10 Q33 6 28 5.5 Q23 6 21 9 Z" fill="#2a1608"/>
              {/* Orelhas */}
              <ellipse cx="20.5" cy="12" rx="1.5" ry="2" fill="url(#wcSkin)"/>
              <ellipse cx="35.5" cy="12" rx="1.5" ry="2" fill="url(#wcSkin)"/>
              {/* Olhos */}
              <circle cx="25.5" cy="11.5" r="0.9" fill="#1a1208"/>
              <circle cx="30.5" cy="11.5" r="0.9" fill="#1a1208"/>
              {/* Sobrancelhas */}
              <path d="M24 9.5 L27 9.2" stroke="#2a1608" strokeWidth="0.8" strokeLinecap="round"/>
              <path d="M29 9.2 L32 9.5" stroke="#2a1608" strokeWidth="0.8" strokeLinecap="round"/>
              {/* Boca */}
              <path d="M26 14.5 Q28 16 30 14.5" stroke="#5a2a1a" strokeWidth="0.8" fill="none" strokeLinecap="round"/>

              {/* Camisa amarela com sombra */}
              <path d="M13 23 L43 23 L41 47 L15 47 Z" fill="url(#wcShirt)" stroke="#009C3B" strokeWidth="1.2"/>
              {/* Gola verde V */}
              <path d="M23 23 L28 30 L33 23 L31 23 L28 27 L25 23 Z" fill="#009C3B"/>
              {/* Listra lateral verde */}
              <path d="M13 23 L15 47 L17 47 L15.5 23 Z" fill="#009C3B" opacity="0.4"/>
              <path d="M43 23 L41 47 L39 47 L40.5 23 Z" fill="#009C3B" opacity="0.4"/>
              {/* Número 10 */}
              <text x="28" y="40" textAnchor="middle" fontSize="9" fontWeight="800" fill="#002776" fontFamily="Arial">10</text>
              {/* Escudo CBF estilizado */}
              <circle cx="20" cy="29" r="2" fill="#009C3B" stroke="#fff" strokeWidth="0.4"/>

              {/* Braços com músculo */}
              <path d="M13 24 Q9 28 9 38 Q9 42 12 42 L14 42 Q14 32 15 24 Z" fill="url(#wcShirt)" stroke="#009C3B" strokeWidth="0.8"/>
              <path d="M43 24 Q47 28 47 38 Q47 42 44 42 L42 42 Q42 32 41 24 Z" fill="url(#wcShirt)" stroke="#009C3B" strokeWidth="0.8"/>
              {/* Mãos */}
              <circle cx="11" cy="43" r="2.5" fill="url(#wcSkin)"/>
              <circle cx="45" cy="43" r="2.5" fill="url(#wcSkin)"/>

              {/* Calção azul */}
              <path d="M15 47 L41 47 L39 58 L29 58 L28 50 L27 58 L17 58 Z" fill="url(#wcShort)"/>
              {/* Detalhe amarelo no calção */}
              <path d="M27 50 L29 50 L28 58 Z" fill="#FFDF00" opacity="0.6"/>

              {/* Pernas musculosas */}
              <path d="M19 58 Q18 64 20 70 L25 70 Q25 64 24 58 Z" fill="url(#wcSkin)"/>
              <path d="M32 58 Q31 64 32 70 L37 70 Q38 64 37 58 Z" fill="url(#wcSkin)"/>
              {/* Meiões amarelos */}
              <rect x="19" y="66" width="6" height="5" fill="#FFDF00" stroke="#009C3B" strokeWidth="0.5"/>
              <rect x="32" y="66" width="6" height="5" fill="#FFDF00" stroke="#009C3B" strokeWidth="0.5"/>
              {/* Chuteiras */}
              <ellipse cx="21" cy="72" rx="5" ry="2" fill="#0a0a0a"/>
              <ellipse cx="35" cy="72" rx="5" ry="2" fill="#0a0a0a"/>
              <path d="M16.5 72 L25.5 72" stroke="#fff" strokeWidth="0.5"/>
              <path d="M30.5 72 L39.5 72" stroke="#fff" strokeWidth="0.5"/>
            </svg>

            {/* Bola da copa estilo Telstar */}
            <svg className="wc-ball-svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" fill="url(#wcBall)" stroke="#111" strokeWidth="0.8"/>
              <polygon points="10,5.5 13,7.4 11.8,10.8 8.2,10.8 7,7.4" fill="#111"/>
              <polygon points="10,2 13.5,4 13,7.4 10,5.5 7,7.4 6.5,4" fill="#111" opacity="0.85"/>
              <line x1="11.8" y1="10.8" x2="15" y2="13" stroke="#111" strokeWidth="0.6"/>
              <line x1="8.2" y1="10.8" x2="5" y2="13" stroke="#111" strokeWidth="0.6"/>
              <line x1="13" y1="7.4" x2="17" y2="7" stroke="#111" strokeWidth="0.6"/>
              <line x1="7" y1="7.4" x2="3" y2="7" stroke="#111" strokeWidth="0.6"/>
              <circle cx="7" cy="7" r="0.6" fill="#fff" opacity="0.7"/>
            </svg>
          </div>

          <span className="wc-flag-wave" style={{ animationDelay: '0.5s' }}>🇧🇷</span>
        </div>
      </div>
    </>
  );
};
