// Footer.jsx — Harmati Magyarország

const HarmatiFooter = () => (
  <footer style={{ borderTop: '1px solid #1f2e25', padding: '64px 40px 40px', background: '#0b120e' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, gap: 48, flexWrap: 'wrap' }}>
        {/* Left brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="assets/logo.png" alt="Harmati" style={{ width: 40, height: 40, borderRadius: '9999px', objectFit: 'contain', display: 'block', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, letterSpacing: '-0.035em', color: '#f2ede2' }}>
              Harmati <em style={{ fontStyle: 'italic', color: '#3a8c63', letterSpacing: '-0.045em' }}>Magyarország</em>
            </span>
          </div>
          <p style={{ maxWidth: 380, color: '#c8c5bd', fontSize: 13.5, lineHeight: 1.7, marginTop: 16 }}>
            Független közösségi média műhely. Magyar márkáknak, hosszú távú figyelemre hangolva.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {[
              <svg key="ig" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
              <svg key="tt" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 6.8a5.3 5.3 0 0 1-3.3-1.1 5.3 5.3 0 0 1-2-3.7h-3.2v13.4a2.6 2.6 0 1 1-1.8-2.5V9.6a5.8 5.8 0 1 0 5 5.7V9.8a8.4 8.4 0 0 0 5.3 1.8z"/></svg>,
            ].map((icon, i) => (
              <a key={i} href="#" style={{ width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', border: '1px solid #2a3d30', color: '#c8c5bd', textDecoration: 'none' }}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right nav cols */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40 }}>
          {[
            { head: 'Cég', links: ['Megközelítés','Munkafolyamat','Kapcsolat'] },
            { head: 'Szolgáltatás', links: ['Stratégia','Tartalom','Hirdetés','Weboldal'] },
            { head: 'Jogi', links: ['Adatvédelem','ÁSZF','Impresszum'] },
          ].map((col, i) => (
            <div key={i}>
              <h6 style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7a8a7e', margin: '0 0 16px', fontWeight: 400 }}>{col.head}</h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map((l, j) => (
                  <li key={j}><a href="#" style={{ color: '#c8c5bd', fontSize: 13, textDecoration: 'none' }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        paddingTop: 32, borderTop: '1px solid #1f2e25',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#7a8a7e',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>© 2026 Harmati Magyarország Kft. — Minden jog fenntartva.</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <PingDot />
            Új projektekre nyitva
          </span>
          <span>Europe/Budapest · v2026.04</span>
        </div>
      </div>
    </div>
  </footer>
);

Object.assign(window, { HarmatiFooter });
