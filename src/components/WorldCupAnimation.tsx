import { useEffect, useMemo, useRef, useState } from 'react';

// Tema Copa do Mundo — desativa automaticamente após 19/07/2026
export const WORLD_CUP_END = new Date('2026-07-19T23:59:59');

export const isWorldCupActive = () => {
  if (typeof window === 'undefined') return false;
  if (localStorage.getItem('worldcup_theme_off') === '1') return false;
  return new Date() <= WORLD_CUP_END;
};

/**
 * WorldCupAnimation — camada visual premium global.
 * Renderiza:
 *  - Faixa superior tricolor discreta
 *  - Partículas douradas sutis (GPU only, transform/opacity)
 * Não bloqueia cliques (pointer-events: none).
 */
export const WorldCupAnimation = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isWorldCupActive());
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 10,
        size: 3 + Math.random() * 3,
        opacity: 0.25 + Math.random() * 0.35,
        key: i,
      })),
    []
  );

  if (!active) return null;

  return (
    <>
      <style>{`
        @keyframes wc-rise {
          0%   { transform: translate3d(0, 20px, 0);  opacity: 0; }
          15%  { opacity: var(--wc-op, 0.5); }
          85%  { opacity: var(--wc-op, 0.5); }
          100% { transform: translate3d(0, -110vh, 0); opacity: 0; }
        }
        .wc-flag-strip {
          position: fixed; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg,
            #009C3B 0 33%, #FFDF00 33% 66%, #002776 66% 100%);
          z-index: 60;
          pointer-events: none;
          opacity: 0.85;
        }
        .wc-particles {
          position: fixed; inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
          contain: strict;
        }
        .wc-particle {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffe27a, #d4af37 65%, transparent 72%);
          filter: blur(0.3px);
          animation-name: wc-rise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .wc-particle { animation: none !important; display: none; }
        }
      `}</style>

      <div className="wc-flag-strip" aria-hidden />
      <div className="wc-particles" aria-hidden>
        {particles.map((p) => (
          <span
            key={p.key}
            className="wc-particle"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDelay: `-${p.delay}s`,
              animationDuration: `${p.duration}s`,
              // @ts-expect-error CSS var
              '--wc-op': p.opacity,
            }}
          />
        ))}
      </div>
    </>
  );
};

/** Banner discreto "Temporada da Copa" — aparece só enquanto tema ativo */
export const WorldCupBanner = () => {
  const [active, setActive] = useState(false);
  useEffect(() => setActive(isWorldCupActive()), []);
  if (!active) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#FFDF00]/40"
      style={{
        background:
          'linear-gradient(120deg, #003a1c 0%, #006B3F 45%, #0a3a8a 100%)',
        boxShadow: '0 8px 24px -12px rgba(0,0,0,0.35)',
      }}
    >
      {/* Textura sutil de estádio */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #ffffff 0 1px, transparent 1px 24px)',
        }}
      />
      {/* Faixa tricolor lateral */}
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{
          background:
            'linear-gradient(180deg,#009C3B 0 33%,#FFDF00 33% 66%,#002776 66% 100%)',
        }}
      />
      <div className="relative flex items-center gap-3 p-4 sm:p-5">
        <div
          className="shrink-0 h-11 w-11 rounded-xl flex items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg,#FFDF00,#e6b800)',
            boxShadow: '0 4px 12px rgba(255,223,0,0.35)',
          }}
        >
          <span className="text-xl">🏆</span>
        </div>
        <div className="min-w-0">
          <p
            className="text-sm sm:text-base font-bold tracking-wide text-white truncate"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            TEMPORADA DA COPA
          </p>
          <p className="text-[11px] sm:text-xs text-white/85 truncate">
            Transforme cada venda em um gol rumo aos seus objetivos.
          </p>
        </div>
        <div aria-hidden className="ml-auto hidden sm:flex items-center gap-1">
          <span className="text-lg">🇧🇷</span>
        </div>
      </div>
    </div>
  );
};

/**
 * GoalCelebration — dispara comemoração premium ao bater METAS.
 * Uso: <GoalCelebration trigger={tierName} enabled />
 * Detecta transição para 'Meta' | 'Super Meta' | 'Sonho Grande'.
 */
type CelebrationTier = 'Meta' | 'Super Meta' | 'Sonho Grande';
const MESSAGES: Record<CelebrationTier, { emoji: string; title: string; sub: string }> = {
  Meta: {
    emoji: '⚽',
    title: 'GOOOOOL!',
    sub: 'Você atingiu sua META. Continue avançando.',
  },
  'Super Meta': {
    emoji: '🏆',
    title: 'GOOOOOL!',
    sub: 'Você atingiu sua SUPER META. Desempenho acima da média.',
  },
  'Sonho Grande': {
    emoji: '👑',
    title: 'GOOOOOL HISTÓRICO!',
    sub: 'Você conquistou seu SONHO GRANDE. Resultado extraordinário.',
  },
};

export const GoalCelebration = ({
  tierName,
  storageKey,
}: {
  tierName: string;
  storageKey: string; // ex: 'wc_celebrated_inicios'
}) => {
  const [show, setShow] = useState<CelebrationTier | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isWorldCupActive()) return;
    const valid: CelebrationTier[] = ['Meta', 'Super Meta', 'Sonho Grande'];
    if (!valid.includes(tierName as CelebrationTier)) return;

    const already = localStorage.getItem(storageKey);
    if (already === tierName) return;

    localStorage.setItem(storageKey, tierName);
    setShow(tierName as CelebrationTier);
    if (navigator.vibrate) navigator.vibrate([40, 30, 60]);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setShow(null), 3000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [tierName, storageKey]);

  if (!show) return null;
  const msg = MESSAGES[show];

  const confetti = Array.from({ length: 28 });

  return (
    <>
      <style>{`
        @keyframes wc-goal-in {
          0% { transform: scale(0.7); opacity: 0; }
          50% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes wc-goal-glow {
          0%,100% { box-shadow: 0 0 30px rgba(255,223,0,0.35); }
          50%     { box-shadow: 0 0 60px rgba(255,223,0,0.75); }
        }
        @keyframes wc-confetti-fall {
          0%   { transform: translate3d(0,-20vh,0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translate3d(var(--wc-x,0), 90vh, 0) rotate(720deg); opacity: 0; }
        }
        .wc-goal-overlay {
          position: fixed; inset: 0;
          z-index: 9999;
          pointer-events: none;
          display: flex; align-items: center; justify-content: center;
          background: radial-gradient(circle at center, rgba(0,0,0,0.35), rgba(0,0,0,0.05) 70%);
        }
        .wc-goal-card {
          background: linear-gradient(135deg,#004c2b 0%, #006B3F 60%, #0a3a8a 100%);
          border: 2px solid #FFDF00;
          border-radius: 20px;
          padding: 24px 32px;
          text-align: center;
          animation: wc-goal-in 0.5s cubic-bezier(.2,.9,.2,1.2) both, wc-goal-glow 1.6s ease-in-out infinite;
          max-width: 92vw;
        }
        .wc-confetti-piece {
          position: absolute; top: 0;
          width: 8px; height: 14px;
          animation: wc-confetti-fall linear forwards;
          will-change: transform, opacity;
          border-radius: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .wc-goal-card { animation: none !important; }
          .wc-confetti-piece { display: none; }
        }
      `}</style>
      <div className="wc-goal-overlay" role="status" aria-live="polite">
        {confetti.map((_, i) => {
          const colors = ['#009C3B', '#FFDF00', '#002776', '#ffffff'];
          const c = colors[i % colors.length];
          const left = Math.random() * 100;
          const x = (Math.random() - 0.5) * 200;
          const dur = 2 + Math.random() * 1.2;
          const delay = Math.random() * 0.4;
          return (
            <span
              key={i}
              className="wc-confetti-piece"
              style={{
                left: `${left}%`,
                background: c,
                animationDuration: `${dur}s`,
                animationDelay: `${delay}s`,
                // @ts-expect-error css var
                '--wc-x': `${x}px`,
              }}
            />
          );
        })}
        <div className="wc-goal-card">
          <div className="text-5xl sm:text-6xl mb-2">{msg.emoji}</div>
          <div
            className="text-3xl sm:text-4xl font-black tracking-wider"
            style={{
              color: '#FFDF00',
              textShadow: '0 2px 12px rgba(0,0,0,0.5), 0 0 20px rgba(255,223,0,0.4)',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {msg.title}
          </div>
          <p className="mt-2 text-sm sm:text-base text-white/90 font-medium">
            {msg.sub}
          </p>
        </div>
      </div>
    </>
  );
};
