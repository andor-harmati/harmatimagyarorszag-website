// Services.jsx — Harmati Magyarország

const services = [
  {
    num: '/01', title: 'Stratégia',
    desc: 'Piackutatás, versenytárselemzés, célközönség-térkép és éves tartalmi irány. A stratégia nem dokumentum — iránytű, amit minden hét használ.',
    items: ['— Márka audit & pozicionálás', '— Tartalmi pillérek', '— KPI keretrendszer'],
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1"/><path d="M14 5v9l6 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
  {
    num: '/02', title: 'Tartalomgyártás',
    desc: 'Forgatás, vágás, fotó, grafika és szövegírás. Saját stúdió Budapesten, mobilis forgatócsoport az ország bármely pontján.',
    items: ['— Rövidvideó (Reels, TikTok)', '— Statikus & carousel grafika', '— Szövegírás, copy'],
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="6" width="20" height="14" rx="1.5" stroke="currentColor" strokeWidth="1"/><path d="M4 10h20M9 14h6" stroke="currentColor" strokeWidth="1"/></svg>,
  },
  {
    num: '/03', title: 'Hirdetéskezelés',
    desc: 'Meta, Google és TikTok hirdetési fiókok napi kezelése. Kreatív tesztelés, közönség-szegmentálás, ROAS-ra optimalizálva.',
    items: ['— Meta Ads (Facebook, Instagram)', '— Google Ads & YouTube', '— TikTok Ads Manager'],
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M3 21 L10 13 L14 17 L22 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="22" cy="7" r="2" fill="currentColor"/></svg>,
  },
  {
    num: '/04', title: 'Közösségépítés',
    desc: 'Moderáció, DM-kezelés, közösségi válaszok magyarul, a márka hangján. Egy márkának emberi hang kell — nem botos válaszok.',
    items: ['— Válaszkezelés 24 órán belül', '— Krízis-protokoll', '— Közösségi események'],
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="10" cy="11" r="4" stroke="currentColor" strokeWidth="1"/><circle cx="19" cy="15" r="3" stroke="currentColor" strokeWidth="1"/><path d="M3 23 c1-4 5-6 7-6 m5 6 c0-3 2-5 5-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>,
  },
  {
    num: '/05', title: 'Analitika',
    desc: 'Heti dashboard, havi beszámolók és negyedéves retrospektív. Számok, kontextussal — nem képernyőfotók egy prezentációban.',
    items: ['— Looker Studio dashboard', '— GA4 & platform-analitika', '— Hozzáférés a nyers adathoz'],
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 22V10M12 22V4M19 22V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  {
    num: '/06', title: 'Márkaépítés',
    desc: 'Vizuális identitás, hangnem-könyv, tipográfiai rendszer. Nemcsak logó — konzisztens nyelv, ami minden csatornán felismerhető.',
    items: ['— Arculati kézikönyv', '— Közösségi sablonrendszer', '— Tone of voice dokumentum'],
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3 L17 11 L25 11 L19 16 L21 24 L14 19 L7 24 L9 16 L3 11 L11 11 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>,
  },
];

const ServiceCard = ({ service, idx }) => {
  const [hov, setHov] = React.useState(false);
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: 40,
        borderTop: row === 0 ? 'none' : '1px solid #1f2e25',
        borderRight: col < 2 ? '1px solid #1f2e25' : 'none',
        transition: 'background 400ms',
        background: hov ? 'rgba(255,255,255,0.015)' : 'transparent',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 56 }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, letterSpacing: '0.18em', color: '#3a8c63' }}>{service.num}</span>
        <span style={{ color: '#3a8c63' }}>{service.icon}</span>
      </div>
      <h3 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 30, lineHeight: 1.05, color: '#f2ede2', margin: 0 }}>{service.title}</h3>
      <p style={{ marginTop: 16, color: '#c8c5bd', fontSize: 14.5, lineHeight: 1.7 }}>{service.desc}</p>
      <ul style={{ marginTop: 24, padding: 0, listStyle: 'none' }}>
        {service.items.map((item, i) => (
          <li key={i} style={{ fontFamily: "'Geist Mono', monospace", color: '#7a8a7e', fontSize: 13, padding: '3px 0' }}>{item}</li>
        ))}
      </ul>
    </article>
  );
};

const HarmatiServices = () => (
  <section id="szolgaltatasok" style={{ padding: '144px 40px', borderTop: '1px solid #1f2e25', background: '#0b120e' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* Section head */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 64 }}>
        <div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a8c63' }}>01 — Szolgáltatások</div>
          <div style={{ marginTop: 24, fontFamily: "'Geist Mono', monospace", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a8a7e' }}>Hat terület, egy rendszer</div>
        </div>
        <div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(2rem,4vw,3.5rem)', lineHeight: 1, letterSpacing: '-0.035em', color: '#f2ede2', margin: 0 }}>
            Nem kampányokat szállítunk.{' '}
            <em style={{ fontStyle: 'italic', color: '#3a8c63', letterSpacing: '-0.045em' }}>Rendszert építünk,</em>{' '}
            amely hónapokon át dolgozik a márkádért.
          </h2>
        </div>
      </div>

      {/* Services grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
        {services.map((s, i) => <ServiceCard key={i} service={s} idx={i} />)}
      </div>
    </div>
  </section>
);

Object.assign(window, { HarmatiServices });
