// HeroScrub.jsx — Harmati Magyarország (rewritten for reliability)
// GSAP + ScrollTrigger must be loaded as globals before this file.

const PIN_VH_MULTIPLE = 3.2;
const IMMERSE_OVERFILL = 1.04;
const ENTRY_DELAY = 0.2;
const CARD_START_SCALE_DESKTOP = 0.6;
const CARD_START_SCALE_MOBILE = 0.82;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function HeroScrub({
  frameCount,
  frameUrl,
  titleTop,
  titleBottom,
  bgColor = "#0b120e",
  accentHex = "#3a8c63",
  defaultAspect = 16 / 9,
}) {
  const sectionRef = React.useRef(null);
  const stickyRef  = React.useRef(null);
  const canvasRef  = React.useRef(null);
  const imagesRef  = React.useRef([]);
  const lastDrawnRef = React.useRef(-1);
  const bgRef        = React.useRef(null);
  const cardRef      = React.useRef(null);
  const titleTopRef  = React.useRef(null);
  const titleBotRef  = React.useRef(null);

  const [ready, setReady]     = React.useState(false);
  const [framesOk, setFramesOk] = React.useState(true);
  const [aspect, setAspect]   = React.useState(defaultAspect);
  const reduced = usePrefersReducedMotion();

  // ── Frame loading ──────────────────────────────────────────────
  React.useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let errored = 0;
    const images = new Array(frameCount);
    imagesRef.current = images;

    const onFirstReady = (img) => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (canvas && img.naturalWidth && img.naturalHeight) {
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        lastDrawnRef.current = 0;
        setAspect(img.naturalWidth / img.naturalHeight);
      }
      setReady(true);
    };

    const onErr = () => { errored++; if (!cancelled && errored >= 5) setFramesOk(false); };

    const loadOne = (i) => {
      const img = new Image();
      img.decoding = "async";
      if (i < 4) img.fetchPriority = "high";
      img.onerror = onErr;
      if (i === 0) img.onload = () => onFirstReady(img);
      img.src = frameUrl(i);
      images[i] = img;
    };

    const INITIAL = Math.min(20, frameCount);
    for (let i = 0; i < INITIAL; i++) loadOne(i);

    const BATCH = 20;
    let cursor = INITIAL, timer = null;
    const loadNext = () => {
      if (cancelled) return;
      const end = Math.min(frameCount, cursor + BATCH);
      for (let i = cursor; i < end; i++) loadOne(i);
      cursor = end;
      if (cursor < frameCount) timer = setTimeout(loadNext, 80);
    };
    timer = setTimeout(loadNext, 200);

    const fallback = setTimeout(() => { if (!cancelled && !images[0]?.complete) setFramesOk(false); }, 4500);
    return () => { cancelled = true; if (timer) clearTimeout(timer); clearTimeout(fallback); };
  }, [reduced, frameCount, frameUrl]);

  // ── Entry animation ────────────────────────────────────────────
  React.useEffect(() => {
    if (reduced || !window.gsap) return;
    const tl = gsap.timeline({ delay: ENTRY_DELAY });
    if (bgRef.current)       tl.from(bgRef.current,       { opacity: 0, duration: 1.4, ease: "power2.out" });
    if (cardRef.current)     tl.from(cardRef.current,     { opacity: 0, duration: 1.1, ease: "power3.out" }, 0.35);
    if (titleTopRef.current) tl.from(titleTopRef.current, { opacity: 0, y: 30, duration: 1, ease: "expo.out" }, 0.5);
    if (titleBotRef.current) tl.from(titleBotRef.current, { opacity: 0, y: -30, duration: 1, ease: "expo.out" }, 0.62);
    return () => tl.kill();
  }, [reduced]);

  // ── Scroll choreography ────────────────────────────────────────
  React.useEffect(() => {
    if (reduced || !ready || !framesOk) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) {
      console.warn('[HeroScrub] gsap or ScrollTrigger missing', { gsap: !!gsap, ScrollTrigger: !!ScrollTrigger });
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    console.log('[HeroScrub] registering ScrollTrigger timeline');

    const startScale  = () => window.innerWidth < 768 ? CARD_START_SCALE_MOBILE : CARD_START_SCALE_DESKTOP;
    const immerseScale = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const baseW = Math.min(vw * 0.96, vh * 0.72 * aspect);
      const baseH = Math.min(vh * 0.72, (vw * 0.96) / aspect);
      if (baseW <= 0 || baseH <= 0) return 1.5;
      return Math.max(vw / baseW, vh / baseH) * IMMERSE_OVERFILL;
    };

    const isLoaded = (i) => { const img = imagesRef.current[i]; return !!img && img.complete && img.naturalWidth > 0; };

    const drawFrame = (index) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      let useIdx = index;
      if (!isLoaded(useIdx)) {
        let found = -1;
        for (let d = 1; d < frameCount; d++) {
          if (useIdx - d >= 0 && isLoaded(useIdx - d)) { found = useIdx - d; break; }
          if (useIdx + d < frameCount && isLoaded(useIdx + d)) { found = useIdx + d; break; }
        }
        if (found === -1) return;
        useIdx = found;
      }
      if (lastDrawnRef.current === useIdx) return;
      const img = imagesRef.current[useIdx];
      const ctx2 = canvas.getContext("2d");
      if (!ctx2 || !img) return;
      ctx2.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawnRef.current = useIdx;
    };

    if (cardRef.current) gsap.set(cardRef.current, { scale: startScale(), transformOrigin: "50% 50%" });

    const master = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const mapped = gsap.utils.clamp(0, 1, (p - 0.15) / 0.63);
          const frameIdx = Math.min(frameCount - 1, Math.floor(mapped * frameCount));
          drawFrame(frameIdx);
        },
      },
    });

    master.to(cardRef.current,     { scale: 1, ease: "power2.out", duration: 0.15 }, 0);
    master.to(titleTopRef.current, { x: () => window.innerWidth < 768 ? "-70vw" : "-60vw", letterSpacing: "0.02em", ease: "power2.inOut", duration: 0.15 }, 0);
    master.to(titleBotRef.current, { x: () => window.innerWidth < 768 ? "70vw"  : "60vw",  letterSpacing: "0.02em", ease: "power2.inOut", duration: 0.15 }, 0);

    master.to(cardRef.current,     { scale: immerseScale(), ease: "power2.in", duration: 0.63 }, 0.15);
    master.to(titleTopRef.current, { opacity: 0, ease: "power1.in", duration: 0.22 }, 0.15);
    master.to(titleBotRef.current, { opacity: 0, ease: "power1.in", duration: 0.22 }, 0.15);

    master.to(cardRef.current,     { scale: startScale(), ease: "power3.inOut", duration: 0.22 }, 0.78);
    master.to(titleTopRef.current, { x: 0, opacity: 1, letterSpacing: "-0.04em", ease: "power2.inOut", duration: 0.22 }, 0.78);
    master.to(titleBotRef.current, { x: 0, opacity: 1, letterSpacing: "-0.04em", ease: "power2.inOut", duration: 0.22 }, 0.78);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      clearTimeout(refreshTimer);
      master.scrollTrigger?.kill();
      master.kill();
    };
  }, [ready, framesOk, reduced, aspect, frameCount]);

  const tallHeight = `${(PIN_VH_MULTIPLE + 1) * 100}vh`;

  return (
    <section
      ref={sectionRef}
      aria-label="Cinematic scroll hero"
      style={{ position: 'relative', width: '100%', overflow: 'clip', color: '#fff', backgroundColor: bgColor, height: tallHeight }}
    >
      <div ref={stickyRef} style={{ position: 'sticky', top: 0, display: 'flex', height: '100svh', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        <div ref={bgRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundColor: accentHex }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'rgba(0,0,0,0.35)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.06) 0%, transparent 55%)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', height: '100%', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>

          <h2
            ref={titleTopRef}
            aria-hidden="true"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(3rem, 11vw, 10rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: '#f2ede2',
              margin: 0,
              textAlign: 'center',
            }}
          >{titleTop}</h2>

          <div
            ref={cardRef}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 12,
              boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
              outline: '1px solid rgba(255,255,255,0.08)',
              willChange: 'transform',
              width:  `min(96vw, calc(72svh * ${aspect}))`,
              height: `min(72svh, calc(96vw / ${aspect}))`,
              aspectRatio: aspect,
            }}
          >
            <div aria-hidden="true" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, zIndex: 20, boxShadow: 'inset 0 0 120px rgba(0,0,0,0.45)' }} />
            {framesOk && (
              <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>

          <h2
            ref={titleBotRef}
            aria-hidden="true"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontWeight: 400,
              fontSize: 'clamp(3rem, 11vw, 10rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: '#f2ede2',
              margin: 0,
              textAlign: 'center',
            }}
          >{titleBottom}</h2>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HeroScrub });
