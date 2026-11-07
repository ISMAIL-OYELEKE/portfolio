/* Canvas globe for the Projects page. See ProjectsGlobe.astro. */
import { airports, awsRegions, home, origin, zones } from '../data/globe';

type Pt = { name: string; lat: number; lon: number };
type Pin = { slug: string; region: string; city: string; lat: number; lon: number };

const C = {
  ocean: '#16304f',
  land: '#2c5585',
  coast: '#3d6aa0',
  grid: 'rgba(244,245,242,0.06)',
  rim: 'rgba(244,245,242,0.16)',
  pin: '#E0A33A',
  home: '#F4F5F2',
  arc: 'rgba(224,163,58,0.75)',
  region: 'rgba(244,245,242,0.45)',
  label: '#F4F5F2',
};

export async function initGlobe(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-globe-canvas]');
  const pinsJson = root.dataset.pins;
  if (!canvas || !pinsJson) return;
  const pins: Pin[] = JSON.parse(pinsJson);

  const [geo, land] = await Promise.all([
    import('d3-geo'),
    fetch(root.dataset.land || '/geo/land-110m.json').then((r) => r.json()),
  ]).catch(() => [null, null] as const);
  if (!geo || !land) return;

  const ctx = canvas.getContext('2d')!;
  const proj = geo.geoOrthographic().clipAngle(90).precision(0.5);
  const path = geo.geoPath(proj, ctx);
  const grid = geo.geoGraticule10();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let size = 300;
  let rot: [number, number, number] = [-home.lon + 20, -home.lat - 18, 0];
  let selected: Pin | null = null;
  let allRegions = false;
  let mode: 'builds' | 'trace' = 'builds';
  let running = false;
  let dragging = false;
  let userTouched = false;
  let idleUntil = 0;
  let fly: { t0: number; from: number[]; to: number[] } | null = null;
  let traceT = 0;

  const fit = () => {
    const w = canvas.clientWidth;
    if (!w) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = w;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(w * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    proj.scale(w / 2 - 4).translate([w / 2, w / 2]);
  };
  new ResizeObserver(fit).observe(canvas);
  fit();

  const centre = () => proj.invert!([size / 2, size / 2]) as [number, number];
  const seen = (lon: number, lat: number) => geo.geoDistance([lon, lat], centre()) < Math.PI / 2 - 0.03;
  const dot = (p: { lat: number; lon: number }, r: number, fill: string, ring?: string) => {
    if (!seen(p.lon, p.lat)) return;
    const [x, y] = proj([p.lon, p.lat])!;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (ring) {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = ring;
      ctx.stroke();
    }
  };
  const label = (p: { lat: number; lon: number }, text: string, dx = 9, dy = -8, side: 'auto' | 'left' = 'auto') => {
    if (!seen(p.lon, p.lat)) return;
    const [x, y] = proj([p.lon, p.lat])!;
    ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillStyle = C.label;
    ctx.textAlign = side === 'left' || x > size * 0.72 ? 'right' : 'left';
    ctx.fillText(text, x + (ctx.textAlign === 'right' ? -dx : dx), y + dy);
    ctx.textAlign = 'left';
  };
  const arc = (a: Pt | Pin, b: Pt | Pin, width: number, frac = 1) => {
    const i = geo.geoInterpolate([a.lon, a.lat], [b.lon, b.lat]);
    const steps = Math.max(2, Math.ceil(40 * frac));
    const coords = Array.from({ length: steps + 1 }, (_, k) => i((k / steps) * frac));
    ctx.beginPath();
    path({ type: 'LineString', coordinates: coords });
    ctx.strokeStyle = C.arc;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  /* ---------- the visitor's request ---------- */
  const tz = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {
      return '';
    }
  })();
  const z = zones[tz];
  let visitor: Pt | null = z ? { name: z[0], lat: z[1], lon: z[2] } : null;
  let edge: (Pt & { code?: string }) | null = null;
  let edgeEstimated = false;

  const nearestAirport = (p: Pt) => {
    let best: Pt | null = null;
    let bd = Infinity;
    for (const [n, la, lo] of Object.values(airports)) {
      const d = geo.geoDistance([p.lon, p.lat], [lo, la]);
      if (d < bd) {
        bd = d;
        best = { name: n, lat: la, lon: lo };
      }
    }
    return best;
  };

  const readEdge = async (bust = false) => {
    try {
      const url = bust ? `${location.pathname}?globe=${Date.now()}` : location.href;
      const r = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      const pop = r.headers.get('x-amz-cf-pop') || '';
      const a = airports[pop.slice(0, 3).toUpperCase()];
      if (a) {
        edge = { name: a[0], lat: a[1], lon: a[2], code: pop };
        edgeEstimated = false;
      }
    } catch {
      /* offline: keep what we have */
    }
    if (!edge && visitor) {
      edge = nearestAirport(visitor);
      edgeEstimated = true;
    }
    if (edge && !visitor) visitor = { name: `near ${edge.name}`, lat: edge.lat, lon: edge.lon };
  };

  /* ---------- panel ---------- */
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-gtab]')];
  const views = [...root.querySelectorAll<HTMLElement>('[data-gview]')];
  const pinButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-gpin]')];
  const card = root.querySelector<HTMLElement>('[data-gcard]')!;
  const cardItems = [...root.querySelectorAll<HTMLElement>('[data-gcard-item]')];
  const regionButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-gregions]')];
  const steps = [...root.querySelectorAll<HTMLElement>('[data-gstep]')];
  const stepText = (i: number) => root.querySelector<HTMLElement>(`[data-gstep-text="${i}"]`)!;
  const note = root.querySelector<HTMLElement>('[data-gnote]')!;
  const again = root.querySelector<HTMLButtonElement>('[data-gagain]')!;

  const flyTo = (lon: number, lat: number) => {
    const to = [-lon, Math.max(-60, Math.min(60, -lat)), 0];
    if (reduce) {
      rot = to as [number, number, number];
      return;
    }
    fly = { t0: performance.now(), from: rot.slice(), to };
  };

  const setMode = (m: 'builds' | 'trace') => {
    mode = m;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.gtab === m)));
    views.forEach((v) => (v.hidden = v.dataset.gview !== m));
    if (m === 'trace') startTrace();
    else {
      idleUntil = performance.now() + 1500;
      if (selected) flyTo(selected.lon, selected.lat);
      else flyTo(home.lon - 20, home.lat + 18);
    }
  };

  const select = (i: number) => {
    userTouched = true;
    selected = pins[i];
    pinButtons.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    card.hidden = false;
    cardItems.forEach((c, k) => (c.hidden = k !== i));
    idleUntil = performance.now() + 6000;
    if (mode !== 'builds') setMode('builds');
    flyTo(selected.lon, selected.lat);
  };

  const startTrace = () => {
    if (!visitor || !edge) return;
    stepText(0).textContent = `Your browser, ${visitor.name.startsWith('near') ? visitor.name : `around ${visitor.name}`}, asks for this page.`;
    stepText(1).textContent = edgeEstimated
      ? `CloudFront answers from an edge near you (on this preview copy it is estimated: ${edge.name}).`
      : `CloudFront answered from its ${edge.name} edge (${edge.code}), over HTTPS with an ACM certificate.`;
    traceT = reduce ? 2 : 0;
    const mid = geo.geoInterpolate([visitor.lon, visitor.lat], [origin.lon, origin.lat])(0.5);
    flyTo(mid[0], mid[1]);
  };

  tabs.forEach((t) =>
    t.addEventListener('click', () => {
      userTouched = true;
      setMode(t.dataset.gtab as 'builds' | 'trace');
    }),
  );
  pinButtons.forEach((b) => b.addEventListener('click', () => select(Number(b.dataset.gpin))));
  regionButtons.forEach((b) =>
    b.addEventListener('click', () => {
      allRegions = b.dataset.gregions === 'all';
      regionButtons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }),
  );
  again.addEventListener('click', async () => {
    userTouched = true;
    again.disabled = true;
    await readEdge(true);
    startTrace();
    again.disabled = false;
  });

  /* ---------- dragging and tapping ---------- */
  let last: [number, number] | null = null;
  let moved = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    fly = null;
    last = [e.clientX, e.clientY];
    moved = 0;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging || !last) return;
    const dx = e.clientX - last[0];
    const dy = e.clientY - last[1];
    moved += Math.abs(dx) + Math.abs(dy);
    last = [e.clientX, e.clientY];
    const k = 75 / proj.scale();
    rot = [rot[0] + dx * k, Math.max(-75, Math.min(75, rot[1] - dy * k)), 0];
  });
  const end = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    idleUntil = performance.now() + 3000;
    if (moved > 6) {
      userTouched = true;
      return;
    }
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const hit = pins.findIndex((p) => {
      if (!seen(p.lon, p.lat)) return false;
      const [px, py] = proj([p.lon, p.lat])!;
      return Math.hypot(px - x, py - y) < 16;
    });
    if (hit >= 0) select(hit);
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', () => (dragging = false));

  /* ---------- drawing ---------- */
  const draw = () => {
    proj.rotate(rot);
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.fillStyle = C.ocean;
    ctx.fill();
    ctx.beginPath();
    path(grid);
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    path(land);
    ctx.fillStyle = C.land;
    ctx.fill();
    ctx.strokeStyle = C.coast;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.strokeStyle = C.rim;
    ctx.stroke();

    if (mode === 'builds') {
      if (allRegions) awsRegions.forEach(([, la, lo]) => dot({ lat: la, lon: lo }, 2.6, C.region));
      const done = new Set<string>();
      pins.forEach((p) => {
        arc(home, p, 1.4);
        const key = `${p.lat},${p.lon}`;
        if (done.has(key)) return;
        done.add(key);
        const on = !!selected && selected.lat === p.lat && selected.lon === p.lon;
        dot(p, on ? 7 : 5, C.pin, on ? C.home : undefined);
        label(p, p.region, 9, p.region === 'eu-west-2' ? 15 : -8);
      });
      dot(home, 5, C.home, C.pin);
      label(home, 'Lagos', 9, 15);
    } else if (visitor && edge) {
      const f1 = Math.min(1, traceT);
      const f2 = Math.max(0, Math.min(1, traceT - 1));
      const sameSpot = geo.geoDistance([visitor.lon, visitor.lat], [edge.lon, edge.lat]) < 0.01;
      if (f1 > 0 && !sameSpot) arc(visitor, edge, 2, f1);
      if (f2 > 0) arc(edge, origin, 2, f2);
      if (traceT < 2) {
        const p =
          traceT < 1
            ? geo.geoInterpolate([visitor.lon, visitor.lat], [edge.lon, edge.lat])(f1)
            : geo.geoInterpolate([edge.lon, edge.lat], [origin.lon, origin.lat])(f2);
        dot({ lon: p[0], lat: p[1] }, 4.5, C.home);
      }
      dot(visitor, 5.5, C.home, C.pin);
      label(visitor, 'You', 9, 4, 'left');
      dot(edge, 5, C.pin);
      label(edge, `Edge · ${edge.name}`, 9, -10);
      dot(origin, 5, C.pin);
      label(origin, `S3 · ${origin.region}`, 9, 18);
      steps.forEach((s, i) => s.classList.toggle('is-on', traceT >= i - 0.001 || traceT >= 2));
    }
  };

  let traceDoneAt = 0;
  const frame = (now: number) => {
    if (!running) return;
    if (fly) {
      const k = Math.min(1, (now - fly.t0) / 1100);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      rot = fly.from.map((v, i) => v + (fly!.to[i] - v) * e) as [number, number, number];
      if (k >= 1) fly = null;
    } else if (!dragging && !reduce && mode === 'builds' && now > idleUntil) {
      rot = [rot[0] + 0.05, rot[1], 0];
    }
    if (mode === 'trace' && traceT < 2) {
      traceT = Math.min(2, traceT + 0.009);
      if (traceT >= 2) traceDoneAt = now;
    }
    // After the first trace plays, settle on the projects unless the visitor took over.
    if (mode === 'trace' && traceDoneAt && !userTouched && now - traceDoneAt > 3500) {
      traceDoneAt = 0;
      userTouched = true;
      setMode('builds');
    }
    draw();
    requestAnimationFrame(frame);
  };

  new IntersectionObserver((entries) => {
    const vis = entries.some((e) => e.isIntersecting);
    if (vis && !running) {
      running = true;
      requestAnimationFrame(frame);
    } else if (!vis) running = false;
  }).observe(canvas);

  await readEdge();
  if (visitor && edge) {
    tabs.forEach((t) => (t.hidden = false));
    if (edgeEstimated) note.textContent = `Your city is estimated from your device's time zone. Nothing is sent anywhere.`;
    setMode('trace');
  } else {
    setMode('builds');
  }
}
