// Header.jsx — Harmati Magyarország
// Sticky nav with brand lockup, nav links, social buttons, CTA

const HarmatiHeader = ({ activeSection }) => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(6,7,10,0.95)',
      backdropFilter: 'blur(20px) saturate(130%)',
      WebkitBackdropFilter: 'blur(20px) saturate(130%)',
      borderBottom: '1px solid #1f2e25',
      transition: 'box-shadow 300ms',
      boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.3)' : 'none',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Brand */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img src="assets/logo.png" alt="Harmati" style={{ width: 44, height: 44, borderRadius: '9999px', objectFit: 'contain', display: 'block', flexShrink: 0 }} />
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, lineHeight: 1, letterSpacing: '-0.035em', color: '#f2ede2' }}>
            Harmati <em style={{ fontStyle: 'italic', color: '#3a8c63', letterSpacing: '-0.045em' }}>Magyarország</em>
          </span>
        </a>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: 36, fontSize: 13, color: '#c8c5bd' }}>
          {['Szolgáltatások','Weboldal','MI-növekedés','Megközelítés','Kapcsolat'].map((item, i) => {
            const hrefs = ['#szolgaltatasok','#weboldal','#ai','#megkozelites','#kapcsolat'];
            return (
              <a key={i} href={hrefs[i]} style={{
                color: '#c8c5bd', textDecoration: 'none',
                transition: 'color 300ms',
              }}
              onMouseEnter={e => e.target.style.color = '#f2ede2'}
              onMouseLeave={e => e.target.style.color = '#c8c5bd'}
              >{item}</a>
            );
          })}
        </nav>

        {/* Right: social + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Instagram */}
          <a href="https://www.instagram.com/harmatimagyarorszag/" target="_blank" rel="noopener"
            style={socialBtnStyle}
            onMouseEnter={e => Object.assign(e.currentTarget.style, socialBtnHover)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, socialBtnStyle)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          {/* TikTok */}
          <a href="https://www.tiktok.com/@harmatimagyarorszag" target="_blank" rel="noopener"
            style={socialBtnStyle}
            onMouseEnter={e => Object.assign(e.currentTarget.style, socialBtnHover)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, socialBtnStyle)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 6.8a5.3 5.3 0 0 1-3.3-1.1 5.3 5.3 0 0 1-2-3.7h-3.2v13.4a2.6 2.6 0 1 1-1.8-2.5V9.6a5.8 5.8 0 1 0 5 5.7V9.8a8.4 8.4 0 0 0 5.3 1.8z"/></svg>
          </a>
          {/* CTA */}
          <a href="#kapcsolat" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 13, padding: '8px 16px', borderRadius: 999,
            border: '1px solid #2a3d30', color: '#f2ede2', textDecoration: 'none',
            transition: 'border-color 300ms, color 300ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a8c63'; e.currentTarget.style.color = '#3a8c63'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a3d30'; e.currentTarget.style.color = '#f2ede2'; }}>
            Árajánlat
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8m0 0L6.5 2.5M10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </a>
        </div>
      </div>
    </header>
  );
};

const socialBtnStyle = {
  width: 36, height: 36,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: '9999px', border: '1px solid #2a3d30', color: '#c8c5bd',
  transition: 'border-color 300ms, color 300ms, transform 300ms',
  textDecoration: 'none',
};
const socialBtnHover = {
  ...socialBtnStyle,
  borderColor: '#3a8c63', color: '#3a8c63',
  transform: 'translateY(-2px)',
};

Object.assign(window, { HarmatiHeader });
