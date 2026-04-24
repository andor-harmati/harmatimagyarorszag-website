import * as THREE from "three";

/* ============================================================
   1) Hero — BackgroundPaths (SVG)
   ============================================================ */
function buildPaths(position, container) {
  const svgNS = "http://www.w3.org/2000/svg";
  for (let i = 0; i < 36; i++) {
    const d =
      `M-${380 - i * 5 * position} -${189 + i * 6}` +
      `C-${380 - i * 5 * position} -${189 + i * 6} ` +
      `-${312 - i * 5 * position} ${216 - i * 6} ` +
      `${152 - i * 5 * position} ${343 - i * 6}` +
      `C${616 - i * 5 * position} ${470 - i * 6} ` +
      `${684 - i * 5 * position} ${875 - i * 6} ` +
      `${684 - i * 5 * position} ${875 - i * 6}`;

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke-width", String(0.5 + i * 0.03));
    path.style.strokeOpacity = String(0.12 + i * 0.025);
    // Randomized breathing cycle + entrance delay
    const len = 3200;
    path.style.setProperty("--len", len);
    path.style.setProperty("--delay", `${i * 0.05}s`);
    path.style.setProperty("--breath", `${18 + Math.random() * 14}s`);
    container.appendChild(path);
  }
}

function initHeroPaths() {
  const svg = document.getElementById("paths-svg");
  if (!svg) return;
  const g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const g2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(g1);
  svg.appendChild(g2);
  buildPaths(1, g1);
  buildPaths(-1, g2);
}

/* ============================================================
   2) Hero title — letter-by-letter rise
   ============================================================ */
function initHeroTitle() {
  const title = document.getElementById("hero-title");
  if (!title) return;

  const text = title.getAttribute("data-text") || "";
  const accentWord = title.getAttribute("data-accent") || "";
  title.innerHTML = "";

  const words = text.split(" ");
  let globalIdx = 0;

  words.forEach((word) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";
    const isAccent = word.toLowerCase() === accentWord.toLowerCase();

    for (const letter of word) {
      const s = document.createElement("span");
      s.className = "letter" + (isAccent ? " accent" : "");
      s.textContent = letter;
      s.style.animationDelay = `${globalIdx * 0.028}s`;
      wordSpan.appendChild(s);
      globalIdx++;
    }
    title.appendChild(wordSpan);
  });
}

/* ============================================================
   3) Scroll-in / scroll-out animation observer
   ============================================================ */
function initScrollAnim() {
  const nodes = document.querySelectorAll(".anim");
  if (!nodes.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle("in-view", e.isIntersecting);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((n) => obs.observe(n));
}

/* ============================================================
   4) Copy-to-clipboard + toast
   ============================================================ */
const toast = document.getElementById("toast");
function showToast(text) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(() => toast.classList.remove("show"), 2000);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

function initCopyables() {
  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.addEventListener("click", async (ev) => {
      ev.preventDefault();
      const val = el.getAttribute("data-copy");
      const label = el.getAttribute("data-copy-label") || "Másolva";
      const ok = await copyText(val);
      showToast(ok ? `${label} · ${val}` : "Másolás nem sikerült");
    });
  });
}

/* ============================================================
   5) AI Section — 3D DRAGGABLE PHONE
   ============================================================ */
function initPhone3D() {
  const canvas = document.getElementById("phone-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Phone group — rotatable as one
  const phone = new THREE.Group();
  scene.add(phone);

  // Body shape — rounded rect extruded
  const W = 1.55, H = 3.1, R = 0.28, D = 0.2;
  const shape = new THREE.Shape();
  shape.moveTo(-W/2 + R, -H/2);
  shape.lineTo( W/2 - R, -H/2);
  shape.quadraticCurveTo( W/2, -H/2,  W/2, -H/2 + R);
  shape.lineTo( W/2,  H/2 - R);
  shape.quadraticCurveTo( W/2,  H/2,  W/2 - R,  H/2);
  shape.lineTo(-W/2 + R,  H/2);
  shape.quadraticCurveTo(-W/2,  H/2, -W/2,  H/2 - R);
  shape.lineTo(-W/2, -H/2 + R);
  shape.quadraticCurveTo(-W/2, -H/2, -W/2 + R, -H/2);

  const bodyGeo = new THREE.ExtrudeGeometry(shape, {
    depth: D,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 8,
    curveSegments: 28,
  });
  bodyGeo.center();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x14161c,
    metalness: 0.85,
    roughness: 0.28,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  phone.add(body);

  // Gold side rail (thin frame)
  const railShape = new THREE.Shape();
  const rW = W + 0.02, rH = H + 0.02, rR = R + 0.01;
  railShape.moveTo(-rW/2 + rR, -rH/2);
  railShape.lineTo( rW/2 - rR, -rH/2);
  railShape.quadraticCurveTo( rW/2, -rH/2,  rW/2, -rH/2 + rR);
  railShape.lineTo( rW/2,  rH/2 - rR);
  railShape.quadraticCurveTo( rW/2,  rH/2,  rW/2 - rR,  rH/2);
  railShape.lineTo(-rW/2 + rR,  rH/2);
  railShape.quadraticCurveTo(-rW/2,  rH/2, -rW/2,  rH/2 - rR);
  railShape.lineTo(-rW/2, -rH/2 + rR);
  railShape.quadraticCurveTo(-rW/2, -rH/2, -rW/2 + rR, -rH/2);
  const railHole = new THREE.Path();
  const iW = W - 0.04, iH = H - 0.04, iR = R - 0.01;
  railHole.moveTo(-iW/2 + iR, -iH/2);
  railHole.lineTo( iW/2 - iR, -iH/2);
  railHole.quadraticCurveTo( iW/2, -iH/2,  iW/2, -iH/2 + iR);
  railHole.lineTo( iW/2,  iH/2 - iR);
  railHole.quadraticCurveTo( iW/2,  iH/2,  iW/2 - iR,  iH/2);
  railHole.lineTo(-iW/2 + iR,  iH/2);
  railHole.quadraticCurveTo(-iW/2,  iH/2, -iW/2,  iH/2 - iR);
  railHole.lineTo(-iW/2, -iH/2 + iR);
  railHole.quadraticCurveTo(-iW/2, -iH/2, -iW/2 + iR, -iH/2);
  railShape.holes.push(railHole);

  const railGeo = new THREE.ExtrudeGeometry(railShape, {
    depth: D + 0.04,
    bevelEnabled: false,
    curveSegments: 28,
  });
  railGeo.center();
  const railMat = new THREE.MeshStandardMaterial({
    color: 0xc9a46b,
    metalness: 1,
    roughness: 0.18,
    emissive: 0x3a2b0e,
    emissiveIntensity: 0.35,
  });
  const rail = new THREE.Mesh(railGeo, railMat);
  phone.add(rail);

  // Screen plane (front)
  const screenW = W - 0.18, screenH = H - 0.22;
  const screenGeo = new THREE.PlaneGeometry(screenW, screenH);

  // Dynamic canvas texture for screen
  const tex = (() => {
    const c = document.createElement("canvas");
    c.width = 540; c.height = 1080;
    const g = c.getContext("2d");

    // Gradient background
    const grad = g.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0,   "#0c0e14");
    grad.addColorStop(0.5, "#121520");
    grad.addColorStop(1,   "#0a0c12");
    g.fillStyle = grad;
    g.fillRect(0, 0, c.width, c.height);

    // Warm gold glow spot
    const rad = g.createRadialGradient(c.width*0.3, c.height*0.2, 0, c.width*0.3, c.height*0.2, c.width*0.9);
    rad.addColorStop(0, "rgba(201,164,107,0.35)");
    rad.addColorStop(1, "rgba(201,164,107,0)");
    g.fillStyle = rad;
    g.fillRect(0,0,c.width,c.height);

    // Status bar
    g.fillStyle = "#f2ede2";
    g.font = "600 28px 'Geist Mono', monospace";
    g.fillText("9:41", 36, 60);
    g.fillText("harmati", c.width - 190, 60);

    // Header
    g.fillStyle = "#f2ede2";
    g.font = "italic 90px 'Instrument Serif', serif";
    g.fillText("Harmati", 36, 260);
    g.fillStyle = "#c9a46b";
    g.font = "italic 72px 'Instrument Serif', serif";
    g.fillText("MI", 380, 260);

    g.fillStyle = "rgba(242,237,226,0.7)";
    g.font = "26px 'Geist', sans-serif";
    g.fillText("MI-vezérelt növekedés", 36, 320);

    // Card 1
    const cardX = 36, cardW = c.width - 72;
    g.fillStyle = "rgba(201,164,107,0.14)";
    g.strokeStyle = "rgba(201,164,107,0.7)";
    g.lineWidth = 2;
    roundRect(g, cardX, 380, cardW, 180, 22);
    g.fill(); g.stroke();
    g.fillStyle = "#c9a46b";
    g.font = "600 22px 'Geist Mono', monospace";
    g.fillText("MODELL · LIVE", cardX + 26, 420);
    g.fillStyle = "#f2ede2";
    g.font = "italic 52px 'Instrument Serif', serif";
    g.fillText("Growth +34%", cardX + 26, 490);
    g.fillStyle = "rgba(242,237,226,0.65)";
    g.font = "22px 'Geist', sans-serif";
    g.fillText("Előrejelzés · 30 nap", cardX + 26, 540);

    // Card 2
    g.fillStyle = "rgba(242,237,226,0.06)";
    g.strokeStyle = "rgba(242,237,226,0.18)";
    g.lineWidth = 2;
    roundRect(g, cardX, 600, cardW, 160, 22);
    g.fill(); g.stroke();
    g.fillStyle = "rgba(242,237,226,0.55)";
    g.font = "20px 'Geist Mono', monospace";
    g.fillText("ELEMZÉS", cardX + 26, 640);
    g.fillStyle = "#f2ede2";
    g.font = "italic 42px 'Instrument Serif', serif";
    g.fillText("Heti riport kész", cardX + 26, 700);
    g.fillStyle = "rgba(242,237,226,0.5)";
    g.font = "22px 'Geist', sans-serif";
    g.fillText("12 kreatív · 4 közönség", cardX + 26, 740);

    // Mini chart bars
    g.fillStyle = "rgba(201,164,107,0.8)";
    const bars = [30, 55, 42, 78, 65, 90, 70, 95];
    const bx = cardX, by = 880, bw = (cardW - (bars.length-1)*8) / bars.length, bh = 140;
    bars.forEach((v, i) => {
      const h = (v/100) * bh;
      g.globalAlpha = 0.3 + (i/bars.length) * 0.7;
      g.fillRect(bx + i * (bw + 8), by + (bh - h), bw, h);
    });
    g.globalAlpha = 1;

    // Home indicator
    g.fillStyle = "rgba(242,237,226,0.5)";
    roundRect(g, c.width/2 - 70, c.height - 30, 140, 6, 3);
    g.fill();

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x+r, y);
      ctx.arcTo(x+w, y, x+w, y+h, r);
      ctx.arcTo(x+w, y+h, x, y+h, r);
      ctx.arcTo(x, y+h, x, y, r);
      ctx.arcTo(x, y, x+w, y, r);
      ctx.closePath();
    }

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  })();

  const screenMat = new THREE.MeshBasicMaterial({ map: tex });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.z = D / 2 + 0.062;
  phone.add(screen);

  // Camera bump / dynamic island (small pill on top)
  const islandGeo = new THREE.CapsuleGeometry(0.05, 0.18, 6, 16);
  const islandMat = new THREE.MeshBasicMaterial({ color: 0x05060a });
  const island = new THREE.Mesh(islandGeo, islandMat);
  island.rotation.z = Math.PI / 2;
  island.position.set(0, H/2 - 0.22, D/2 + 0.063);
  phone.add(island);

  // Back camera bump
  const camBumpGeo = new THREE.CircleGeometry(0.13, 36);
  const camBumpMat = new THREE.MeshStandardMaterial({ color: 0x0a0c12, metalness: 0.7, roughness: 0.3 });
  const camBump = new THREE.Mesh(camBumpGeo, camBumpMat);
  camBump.position.set(-W/2 + 0.4, H/2 - 0.45, -D/2 - 0.05);
  camBump.rotation.y = Math.PI;
  phone.add(camBump);
  const lensGeo = new THREE.CircleGeometry(0.07, 28);
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x181b22, metalness: 1, roughness: 0.15, emissive: 0xc9a46b, emissiveIntensity: 0.18 });
  const lens = new THREE.Mesh(lensGeo, lensMat);
  lens.position.set(-W/2 + 0.4, H/2 - 0.45, -D/2 - 0.051);
  lens.rotation.y = Math.PI;
  phone.add(lens);

  // Side buttons (right rail power)
  const btnGeo = new THREE.BoxGeometry(0.04, 0.45, 0.08);
  const btnMat = new THREE.MeshStandardMaterial({ color: 0xb08856, metalness: 1, roughness: 0.3 });
  const power = new THREE.Mesh(btnGeo, btnMat);
  power.position.set(W/2 + 0.01, 0.5, 0);
  phone.add(power);
  const volUp = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.08), btnMat);
  volUp.position.set(-W/2 - 0.01, 0.65, 0);
  phone.add(volUp);
  const volDn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.08), btnMat);
  volDn.position.set(-W/2 - 0.01, 0.2, 0);
  phone.add(volDn);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffe9c2, 2.2);
  key.position.set(3, 4, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x8ab8c4, 0.8);
  fill.position.set(-4, -2, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xc9a46b, 1.2);
  rim.position.set(0, -3, -5);
  scene.add(rim);

  // Initial tilt
  phone.rotation.y = -0.4;
  phone.rotation.x = 0.15;

  // Resize
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  // Drag to rotate
  let isDown = false;
  let lastX = 0, lastY = 0;
  let velX = 0, velY = 0;
  let idle = true;
  let lastInteract = performance.now();

  canvas.addEventListener("pointerdown", (e) => {
    isDown = true; idle = false;
    lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    phone.rotation.y += dx * 0.01;
    phone.rotation.x += dy * 0.01;
    // clamp x rotation so the phone doesn't flip wildly
    phone.rotation.x = Math.max(-1.1, Math.min(1.1, phone.rotation.x));
    velX = dx * 0.01;
    velY = dy * 0.01;
    lastX = e.clientX; lastY = e.clientY;
    lastInteract = performance.now();
  });
  const endDrag = () => { isDown = false; };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", endDrag);

  function loop() {
    const now = performance.now();
    const sinceInteract = now - lastInteract;

    if (!isDown) {
      // Inertia
      phone.rotation.y += velX;
      phone.rotation.x += velY;
      velX *= 0.93;
      velY *= 0.93;
      if (Math.abs(velX) < 0.0002) velX = 0;
      if (Math.abs(velY) < 0.0002) velY = 0;

      // After ~2s idle, gently auto-rotate
      if (sinceInteract > 2000) {
        phone.rotation.y += 0.0035;
        // Ease x back toward 0.15
        phone.rotation.x += (0.15 - phone.rotation.x) * 0.02;
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();
}

/* ============================================================
   Boot
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  initHeroPaths();
  initHeroTitle();
  initScrollAnim();
  initCopyables();
  initPhone3D();
});
