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

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1280, width: '100%',
      }}>
        <h1 style={{
          ...fadeIn(80),
          fontFamily: "'Instrument Serif', serif", fontWeight: 400,
          fontSize: 'clamp(3rem, 10vw, 8.5rem)', lineHeight: 1,
          letterSpacing: '-0.035em', color: '#f2ede2', margin: 0,
        }}>
          A közösségi média{' '}
          <em style={{ fontStyle: 'italic', color: '#5db88a', letterSpacing: '-0.045em' }}>művészete</em>
        </h1>
      </div>

    </section>
  );
};

Object.assign(window, { HarmatiHeroShader });
