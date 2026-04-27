// Hero.jsx — Harmati Magyarország

const HarmatiHero = ({ onCTAClick }) => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

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
      background: '#0b120e',
    }}>
      {/* Gradient bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(120% 70% at 50% 50%, rgba(58,140,99,0.12) 0%, transparent 60%), radial-gradient(80% 40% at 20% 80%, rgba(45,106,79,0.08) 0%, transparent 50%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1280, width: '100%',
        display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'end',
      }}>
        {/* Left */}
        <div>
          {/* Avail badge */}
          <div style={{ ...fadeIn(0), display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <PingDot />
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c8c5bd' }}>
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            ...fadeIn(80),
            fontFamily: "'Instrument Serif', serif", fontWeight: 400,
            fontSize: 'clamp(2.4rem, 7vw, 6rem)', lineHeight: 1,
            letterSpacing: '-0.035em', color: '#f2ede2', margin: 0,
          }}>
            A közösségi média{' '}
            <em style={{ fontStyle: 'italic', color: '#5db88a', letterSpacing: '-0.045em' }}>művészete</em>
          </h1>

          {/* Subtitle */}
          <p style={{ ...fadeIn(200), marginTop: 40, maxWidth: 560, color: '#c8c5bd', fontSize: 17, lineHeight: 1.7 }}>
          </p>

          {/* CTAs */}
          <div style={{ ...fadeIn(300), marginTop: 48, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <LiquidButton primary onClick={onCTAClick}>
              Indítsuk el a projektet
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10m0 0L8 3m4 4l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </LiquidButton>
            <LiquidButton>
              Szolgáltatások
            </LiquidButton>
          </div>
        </div>

        {/* Right — Stats */}
        <div style={{
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

const PingDot = () => (
  <span style={{ position: 'relative', width: 10, height: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <style>{`@keyframes ping{0%{transform:scale(1);opacity:.75}80%,100%{transform:scale(2.2);opacity:0}}`}</style>
    <span style={{ position: 'absolute', inset: 0, background: '#7cd88a', borderRadius: '999px', animation: 'ping 1.8s cubic-bezier(0,0,.2,1) infinite', opacity: 0.75 }} />
    <span style={{ position: 'absolute', inset: 2, background: '#2fa14a', borderRadius: '999px' }} />
  </span>
);

const LiquidButton = ({ children, primary, onClick }) => {
  const [hov, setHov] = React.useState(false);
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 12,
    padding: '16px 34px', borderRadius: 999,
    fontFamily: "'Geist', sans-serif", fontWeight: 500, fontSize: 15,
    cursor: 'pointer', border: 'none', textDecoration: 'none',
    transition: 'transform 500ms cubic-bezier(.2,.8,.2,1), box-shadow 500ms, background 500ms',
    transform: hov ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
  };
  const styles = primary ? {
    ...base,
    color: '#f2ede2',
    background: hov
      ? 'linear-gradient(180deg,#74c69d 0%,#40916c 60%,#2d6a4f 100%)'
      : 'linear-gradient(180deg,#52b788 0%,#2d6a4f 60%,#1b4332 100%)',
    border: '1px solid rgba(82,183,136,0.5)',
    boxShadow: hov
      ? 'inset 0 1px 0 rgba(255,255,255,.25),0 16px 50px rgba(45,106,79,.5)'
      : 'inset 0 1px 0 rgba(255,255,255,.2),0 10px 40px rgba(45,106,79,.35)',
  } : {
    ...base,
    color: '#f2ede2',
    background: hov ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
    border: hov ? '1px solid rgba(201,164,107,0.4)' : '1px solid rgba(255,255,255,0.14)',
    backdropFilter: 'blur(10px)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18),0 8px 30px rgba(0,0,0,.35)',
  };
  return (
    <button style={styles} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
};

Object.assign(window, { HarmatiHero, PingDot, LiquidButton });
