import Link from 'next/link'

export default function NotFound() {
  // Total cycle: 6s. Char1: 0-1.6s, Char2: 1.7-3.3s, Char3: 3.4-5s, hold 5-5.5s, reset 5.5-6s
  const cycle = 6
  const fillDur = 1.5 // seconds per character fill
  const chars = [
    { char: '4', start: 0.1, end: 0.1 + fillDur },
    { char: '0', start: 1.7, end: 1.7 + fillDur },
    { char: '4', start: 3.3, end: 3.3 + fillDur },
  ]

  function pct(s: number) { return ((s / cycle) * 100).toFixed(1) }

  return (
    <div className="relative min-h-screen bg-vurmz-dark overflow-hidden flex items-center justify-center">
      <style>{`
        .engrave-wrap {
          display: flex;
          gap: clamp(2px, 0.5vw, 8px);
          user-select: none;
          position: relative;
        }

        .char-box {
          position: relative;
          overflow: hidden;
        }

        /* Ghost — faint outline of what will be engraved */
        .char-ghost {
          font-size: clamp(100px, 26vw, 280px);
          font-weight: 900;
          line-height: 0.85;
          color: transparent;
          -webkit-text-stroke: 1px rgba(240, 230, 213, 0.03);
          font-family: Inter, system-ui, sans-serif;
        }

        /* ═══ Filled text ═══
           Uses background-clip:text so the fill gradient only shows INSIDE the letter shape.
           This is the key — the gradient acts as a "progress bar" moving down through the letter. */
        .char-fill {
          position: absolute;
          top: 0; left: 0;
          font-size: clamp(100px, 26vw, 280px);
          font-weight: 900;
          line-height: 0.85;
          font-family: Inter, system-ui, sans-serif;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* The fill gradient: solid color on top (engraved area), bright line (laser), transparent below (unengraved) */
        ${chars.map((c, i) => `
          .char-box:nth-child(${i + 1}) .char-fill {
            background: linear-gradient(
              180deg,
              rgba(240, 230, 213, 0.8) 0%,
              rgba(240, 230, 213, 0.8) var(--fill-pos, 0%),
              rgba(255, 200, 120, 1) var(--fill-pos, 0%),
              rgba(255, 140, 60, 0.6) calc(var(--fill-pos, 0%) + 1.5%),
              transparent calc(var(--fill-pos, 0%) + 2.5%)
            );
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: fillChar${i} ${cycle}s linear infinite;
          }

          @keyframes fillChar${i} {
            0% { --fill-pos: 0%; }
            ${pct(c.start)}% { --fill-pos: 0%; }
            ${pct(c.end)}% { --fill-pos: 100%; }
            ${pct(cycle * 0.92)}% { --fill-pos: 100%; }
            ${pct(cycle * 0.97)}% { --fill-pos: 0%; }
            100% { --fill-pos: 0%; }
          }
        `).join('')}

        /* Hatch line overlay — gives it the engraved line texture */
        .char-hatch {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 3px,
            rgba(36, 59, 57, 0.2) 3px,
            rgba(36, 59, 57, 0.2) 4px
          );
          pointer-events: none;
          mix-blend-mode: multiply;
        }

        /* ═══ Laser dot ═══
           Jitters rapidly left-right (galvo X mirror) while tracking Y with the fill */
        .char-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #fff;
          border-radius: 50%;
          box-shadow:
            0 0 4px 2px rgba(255, 255, 255, 0.9),
            0 0 12px 4px rgba(255, 200, 100, 0.7),
            0 0 30px 8px rgba(255, 140, 60, 0.4),
            0 0 50px 12px rgba(255, 100, 30, 0.15);
          left: 50%;
          opacity: 0;
          z-index: 5;
        }

        /* X-axis jitter — simulates the galvo mirror snapping back and forth */
        @keyframes galvoX {
          0% { transform: translateX(-45px); }
          10% { transform: translateX(38px); }
          20% { transform: translateX(-28px); }
          30% { transform: translateX(52px); }
          40% { transform: translateX(-42px); }
          50% { transform: translateX(30px); }
          60% { transform: translateX(-50px); }
          70% { transform: translateX(44px); }
          80% { transform: translateX(-32px); }
          90% { transform: translateX(48px); }
          100% { transform: translateX(-45px); }
        }

        ${chars.map((c, i) => `
          .char-box:nth-child(${i + 1}) .char-dot {
            animation:
              dotY${i} ${cycle}s linear infinite,
              galvoX 0.06s linear infinite;
          }

          @keyframes dotY${i} {
            0% { top: 0%; opacity: 0; }
            ${pct(c.start - 0.05)}% { top: 0%; opacity: 0; }
            ${pct(c.start)}% { top: 0%; opacity: 1; }
            ${pct(c.end)}% { top: 95%; opacity: 1; }
            ${pct(c.end + 0.05)}% { opacity: 0; }
            100% { opacity: 0; }
          }
        `).join('')}

        /* ═══ Glow line ═══
           Wider ambient glow that follows the laser position */
        .char-glow {
          position: absolute;
          left: -30%;
          right: -30%;
          height: 8px;
          background: radial-gradient(ellipse 50% 100% at 50% 50%,
            rgba(255, 180, 80, 0.5) 0%,
            rgba(255, 120, 40, 0.15) 50%,
            transparent 100%
          );
          opacity: 0;
          z-index: 4;
          filter: blur(2px);
        }

        ${chars.map((c, i) => `
          .char-box:nth-child(${i + 1}) .char-glow {
            animation: glowY${i} ${cycle}s linear infinite;
          }
          @keyframes glowY${i} {
            0% { top: 0%; opacity: 0; }
            ${pct(c.start)}% { top: 0%; opacity: 1; }
            ${pct(c.end)}% { top: 95%; opacity: 1; }
            ${pct(c.end + 0.05)}% { opacity: 0; }
            100% { opacity: 0; }
          }
        `).join('')}

        /* Ambient glow behind everything */
        .ambient {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -55%);
          width: 70%;
          height: 60%;
          background: radial-gradient(ellipse, rgba(255,140,60,0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Register the custom property for gradient animation */
        @property --fill-pos {
          syntax: '<percentage>';
          inherits: false;
          initial-value: 0%;
        }
      `}</style>

      <div className="ambient" />

      <div className="text-center relative z-10">
        <div className="engrave-wrap">
          {chars.map((c, i) => (
            <div key={i} className="char-box">
              <span className="char-ghost">{c.char}</span>
              <span className="char-fill">{c.char}</span>
              <div className="char-hatch" />
              <div className="char-glow" />
              <div className="char-dot" />
            </div>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-xs font-mono text-gray-500 tracking-[0.3em] uppercase mb-6">
            Page not found
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
          >
            Back to VURMZ
          </Link>
        </div>
      </div>
    </div>
  )
}
