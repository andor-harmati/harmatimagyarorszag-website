// HeroShader.jsx — Harmati Magyarország
// WebGL sine-wave shader background + hero content (title, stats, CTAs).
// Three.js loaded via importmap (window.__THREE assigned by index.html init script).

const HarmatiHeroShader = ({ onCTAClick }) => {
  const canvasRef = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  React.useEffect(() => {
    const tryInit = () => {
      if (canvasRef.current && window.__initHeroShader) {
        window.__initHeroShader(canvasRef.current);
      } else {
        setTimeout(tryInit, 80);
      }
    };
    tryInit();
  }, []);

  const fadeIn = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    filter: visible ? 'blur(0)' : 'blur(6px)',
    transition: `opacity 900ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 900ms cubic-bezier(.2,.8,.2,1) ${delay}ms, filter 900ms ease ${delay}ms`,
  });

  return (
    <section id="hero" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '120px 40px 80px',
      background: '#0a0a0a',
    }}>
      {/* Shader canvas */}
      <canvas ref={canvasRef} id="shader-canvas" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        display: 'block', pointerEvents: 'none',
      }} />

      {/* Veil for legibility */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(120% 70% at 50% 50%, rgba(11,18,14,0) 0%, rgba(11,18,14,0.55) 70%, rgba(11,18,14,0.85) 100%)',
      }} />

      <div className="hero-content-grid" style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1280, width: '100%',
        display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'end',
      }}>
        <div>
          <div style={{ ...fadeIn(0), display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <PingDot />
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c8c5bd' }}>
              Új projekteket fogadunk — 2026 Q2
            </span>
          </div>

          <h1 style={{
            ...fadeIn(80),
            fontFamily: "'Instrument Serif', serif", fontWeight: 400,
            fontSize: 'clamp(2.4rem, 7vw, 6rem)', lineHeight: 1,
            letterSpacing: '-0.035em', color: '#f2ede2', margin: 0,
          }}>
            A közösségi média{' '}
            <em style={{ fontStyle: 'italic', color: '#5db88a', letterSpacing: '-0.045em' }}>művészete</em>
          </h1>

          <p style={{ ...fadeIn(200), marginTop: 40, maxWidth: 560, color: '#c8c5bd', fontSize: 17, lineHeight: 1.7 }}>
            A Harmati Magyarország egy független közösségi média műhely. Magyar márkáknak építünk stratégiát, tartalmat és hirdetési rendszert — mérhető eredményekre hangolva, feltűnés nélküli kézművességgel.
          </p>

          <div style={{ ...fadeIn(300), marginTop: 48, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <LiquidButton primary onClick={onCTAClick}>
              Indítsuk el a projektet
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10m0 0L8 3m4 4l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </LiquidButton>
            <a href="#szolgaltatasok" style={{ textDecoration: 'none' }}>
              <LiquidButton>Szolgáltatások</LiquidButton>
            </a>
          </div>
        </div>

        <div className="hero-stats-divider" style={{
          ...fadeIn(280),
          paddingLeft: 40, borderLeft: '1px solid #1f2e25', paddingTop: 24,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, borderTop: '1px solid #1f2e25', paddingTop: 24 }}>
            {[
              { num: '6', lbl: 'kiemelt platform' },
              { num: '100%', lbl: 'magyar csapat' },
              { num: <span>7 <span style={{ color: '#3a8c63' }}>nap</span></span>, lbl: 'indulási idő' },
              { num: <span>4 <span style={{ color: '#3a8c63' }}>hó</span></span>, lbl: 'minimum együttműk.' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, lineHeight: 1, color: '#f2ede2' }}>{s.num}</div>
                <div style={{ marginTop: 6, fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a8a7e' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

Object.assign(window, { HarmatiHeroShader });
