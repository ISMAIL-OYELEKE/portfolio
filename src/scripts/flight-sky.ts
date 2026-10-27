/*
 * The painted sky behind the home page flight: a Lagos skyline on the lagoon
 * with the Third Mainland Bridge and volumetric clouds. Everything is drawn once into off-screen canvases per theme (day for
 * Light, night for Dark), then composited each frame, so scrolling stays
 * smooth on phones.
 */

type Theme = 'day' | 'night';

type Palette = {
  skyTop: string;
  skyLow: string;
  altTop: string;
  altLow: string;
  back: string;
  face: string;
  faces: string[];
  side: string;
  trees: string;
  window: string;
  lit: string[];
  water: string;
  bridge: string;
  cloudShadow: string;
  cloudBody: string;
  cloudLight: string;
  fog: string;
};

const PALETTES: Record<Theme, Palette> = {
  day: {
    skyTop: '#2c64a8',
    skyLow: '#b9d3ec',
    altTop: '#123e78',
    altLow: '#5b93d0',
    back: '#8fb0d2',
    face: '#5f7b99',
    faces: ['#6e86a3', '#8c98a8', '#5d7594', '#a0a9b4', '#7b8fa7', '#b3aea3'],
    side: '#465f7b',
    trees: '#3d5a46',
    window: '#a9c3dc',
    lit: ['#d8e6f3', '#c3d6ea'],
    water: '#3d6c9a',
    bridge: '#4d6178',
    cloudShadow: '#a9bbd0',
    cloudBody: '#e9eff6',
    cloudLight: '#ffffff',
    fog: '#eef3f8',
  },
  night: {
    skyTop: '#060e1b',
    skyLow: '#1a2f4f',
    altTop: '#03080f',
    altLow: '#0f1e33',
    back: '#13233b',
    face: '#16273f',
    faces: ['#16273f', '#1a2c46', '#132239', '#1d304b'],
    side: '#0f1c2f',
    trees: '#0a1424',
    window: '#1c2f4c',
    lit: ['#f2c26b', '#f2c26b', '#e0a33a', '#dfe8f5'],
    water: '#08152a',
    bridge: '#22344f',
    cloudShadow: '#14223a',
    cloudBody: '#273b5a',
    cloudLight: '#4b6185',
    fog: '#1f3150',
  },
};

const CITY_W = 2000;
const CITY_H = 520;
const WATERLINE = 420; // y of the lagoon's edge inside the city canvas
const DECK_Y = WATERLINE + 34;

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

type Beacon = { x: number; y: number };

/** The skyline, its reflection and the bridge, for one theme. */
function buildCity(theme: Theme) {
  const pal = PALETTES[theme];
  const rnd = mulberry(20261027);
  const scale = 2;
  const sky = canvas(CITY_W * scale, WATERLINE * scale);
  const g = sky.getContext('2d')!;
  g.scale(scale, scale);
  const beacons: Beacon[] = [];

  // Two distant layers, hazier the further away they are, so the city has depth.
  for (const [colour, minH, spread, alpha] of [
    [pal.back, 60, 150, 0.75],
    [mix(pal.back, pal.side, 0.45), 40, 120, 1],
  ] as [string, number, number, number][]) {
    g.fillStyle = colour;
    g.globalAlpha = alpha;
    for (let x = -20; x < CITY_W; ) {
      const w = 26 + rnd() * 56;
      const h = minH + rnd() * spread;
      g.fillRect(x, WATERLINE - h, w, h);
      if (rnd() > 0.72) g.fillRect(x + w * 0.4, WATERLINE - h - 18, 3, 18);
      x += w - 6 + rnd() * 10;
    }
  }
  g.globalAlpha = 1;

  // Landmark towers at fixed spots, then the rest of the city around them.
  const landmarks = new Map<number, number>([
    [470, 360],
    [930, 330],
    [990, 385],
    [1420, 345],
  ]);
  const towers: { x: number; w: number; h: number }[] = [];
  for (let x = 0; x < CITY_W; ) {
    let w = 36 + rnd() * 80;
    let h = 70 + rnd() * 200;
    for (const [lx, lh] of landmarks) {
      if (Math.abs(x - lx) < 70) {
        w = 70 + rnd() * 20;
        h = lh;
        landmarks.delete(lx);
        break;
      }
    }
    towers.push({ x, w, h });
    x += w + 2 + rnd() * 8;
  }

  for (const t of towers) {
    const top = WATERLINE - t.h;
    const style = t.h > 300 ? (rnd() > 0.5 ? 'spire' : 'setback') : ['flat', 'tank', 'setback', 'slant', 'flat'][Math.floor(rnd() * 5)];

    // Body: concrete or glass, lit from the left and a touch lighter towards
    // the top; the right-hand face in shadow so each block reads as 3D.
    const face = pal.faces[Math.floor(rnd() * pal.faces.length)];
    const body = g.createLinearGradient(0, top, 0, WATERLINE);
    body.addColorStop(0, mix(face, '#ffffff', theme === 'day' ? 0.18 : 0.04));
    body.addColorStop(1, face);
    g.fillStyle = body;
    g.fillRect(t.x, top, t.w, t.h);
    g.fillStyle = mix(face, pal.side, 0.7);
    g.fillRect(t.x + t.w * 0.64, top, t.w * 0.36, t.h);

    // Roofs.
    g.fillStyle = face;
    if (style === 'setback') {
      const w2 = t.w * 0.62;
      g.fillRect(t.x + (t.w - w2) / 2, top - 26, w2, 26);
      g.fillRect(t.x + t.w / 2 - 6, top - 44, 12, 18);
    } else if (style === 'spire') {
      g.fillRect(t.x + t.w * 0.2, top - 20, t.w * 0.6, 20);
      g.fillRect(t.x + t.w / 2 - 1.5, top - 74, 3, 54);
      beacons.push({ x: t.x + t.w / 2, y: top - 76 });
    } else if (style === 'slant') {
      g.beginPath();
      g.moveTo(t.x, top);
      g.lineTo(t.x + t.w, top - 22);
      g.lineTo(t.x + t.w, top);
      g.fill();
    } else if (style === 'tank') {
      g.fillRect(t.x + t.w * 0.15, top - 12, 14, 12);
      g.fillRect(t.x + t.w * 0.6, top - 8, t.w * 0.25, 8);
    }
    if (t.h > 220 && style !== 'spire') {
      g.fillRect(t.x + t.w * 0.8, top - 30, 2, 30);
      beacons.push({ x: t.x + t.w * 0.8 + 1, y: top - 32 });
    }

    // Windows: a grid, lit at random at night, sky reflections by day.
    const glassBands = theme === 'day' && rnd() > 0.55;
    for (let wy = top + 10; wy < WATERLINE - 10; wy += 11) {
      if (glassBands) {
        g.fillStyle = pal.window;
        g.globalAlpha = 0.55;
        g.fillRect(t.x + 4, wy, t.w - 8, 5);
        g.globalAlpha = 1;
        continue;
      }
      for (let wx = t.x + 5; wx < t.x + t.w - 8; wx += 8) {
        const on = theme === 'night' ? rnd() > 0.62 : rnd() > 0.85;
        g.fillStyle = on ? pal.lit[Math.floor(rnd() * pal.lit.length)] : pal.window;
        g.globalAlpha = theme === 'day' && !on ? 0.5 : 1;
        g.fillRect(wx, wy, 4, 6);
      }
      g.globalAlpha = 1;
    }
  }

  // Humid haze low over the water, and the trees along the shore.
  const haze = g.createLinearGradient(0, WATERLINE - 170, 0, WATERLINE);
  haze.addColorStop(0, 'rgba(0,0,0,0)');
  haze.addColorStop(1, theme === 'day' ? 'rgba(206,222,238,0.55)' : 'rgba(26,47,79,0.45)');
  g.fillStyle = haze;
  g.fillRect(0, WATERLINE - 170, CITY_W, 170);
  g.fillStyle = pal.trees;
  for (let x = -10; x < CITY_W; x += 7 + rnd() * 9) {
    const r = 5 + rnd() * 7;
    g.beginPath();
    g.arc(x, WATERLINE - r * 0.55, r, Math.PI, 0);
    g.fill();
  }
  g.fillRect(0, WATERLINE - 3, CITY_W, 3);

  // Final canvas: city, lagoon, reflection and bridge.
  const out = canvas(CITY_W * scale, CITY_H * scale);
  const o = out.getContext('2d')!;
  o.drawImage(sky, 0, 0);
  o.scale(scale, scale);
  o.fillStyle = pal.water;
  o.fillRect(0, WATERLINE, CITY_W, CITY_H - WATERLINE);

  // Reflection: the city flipped into the water, faded and broken by ripples.
  o.save();
  o.globalAlpha = theme === 'night' ? 0.32 : 0.22;
  o.translate(0, WATERLINE * 2);
  o.scale(1, -1);
  o.drawImage(sky, 0, 0, CITY_W, WATERLINE);
  o.restore();
  o.fillStyle = pal.water;
  for (let y = WATERLINE + 2; y < CITY_H; y += 3) {
    o.globalAlpha = 0.35 + rnd() * 0.3;
    o.fillRect(0, y, CITY_W, 1);
  }
  o.globalAlpha = 1;

  // Third Mainland Bridge: a low deck on piers across the lagoon.
  o.fillStyle = pal.bridge;
  for (let x = 8; x < CITY_W; x += 46) o.fillRect(x, DECK_Y, 5, CITY_H - DECK_Y);
  o.fillRect(0, DECK_Y - 4, CITY_W, 7);
  o.fillRect(0, DECK_Y - 9, CITY_W, 2);
  if (theme === 'night') {
    o.fillStyle = '#e0a33a';
    for (let x = 20; x < CITY_W; x += 70) o.fillRect(x, DECK_Y - 14, 2, 2);
  }

  return { canvas: out, beacons };
}

/** One soft, shaded cumulus, drawn from overlapping puffs. */
function buildCloud(theme: Theme, w: number, h: number, seed: number) {
  const pal = PALETTES[theme];
  const rnd = mulberry(seed);
  const c = canvas(w, h);
  const g = c.getContext('2d')!;
  const base = h * 0.78;
  const puffs: { x: number; y: number; r: number }[] = [];
  const n = 16 + Math.floor(rnd() * 10);
  for (let i = 0; i < n; i++) {
    const u = 0.12 + rnd() * 0.76;
    const bell = Math.sin(u * Math.PI); // taller in the middle
    const r = h * (0.1 + rnd() * 0.12) * (0.55 + bell);
    puffs.push({ x: u * w, y: base - rnd() * h * 0.38 * bell - r * 0.2, r });
  }
  // Small puffs along the rim break up the outline, like real cumulus.
  for (let i = 0; i < 26; i++) {
    const host = puffs[Math.floor(rnd() * puffs.length)];
    const a = -Math.PI * (0.05 + rnd() * 0.9);
    puffs.push({ x: host.x + Math.cos(a) * host.r * 0.85, y: host.y + Math.sin(a) * host.r * 0.85, r: host.r * (0.25 + rnd() * 0.3) });
  }

  // 1. The silhouette: solid puffs with a level base, softened at the edge.
  const mask = canvas(w, h);
  const m = mask.getContext('2d')!;
  m.fillStyle = '#000';
  for (const p of puffs) {
    m.beginPath();
    m.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    m.fill();
  }
  m.globalCompositeOperation = 'destination-out';
  m.fillRect(0, base + h * 0.06, w, h);

  // 2. Body: lit from above, shadowed underneath.
  const shade = g.createLinearGradient(0, base - h * 0.55, 0, base + h * 0.06);
  shade.addColorStop(0, pal.cloudLight);
  shade.addColorStop(0.45, pal.cloudBody);
  shade.addColorStop(1, pal.cloudShadow);
  g.fillStyle = shade;
  g.fillRect(0, 0, w, h);

  // 3. Soft highlights on the upper side of each big puff, and soft shadow
  //    where puffs tuck under one another.
  g.globalCompositeOperation = 'source-atop';
  // A wide blur and light touch, so no single puff reads as a round blob.
  g.filter = 'blur(18px)';
  for (const p of puffs) {
    if (p.r < h * 0.08) continue;
    g.globalAlpha = theme === 'day' ? 0.4 : 0.18;
    g.fillStyle = pal.cloudLight;
    g.beginPath();
    g.arc(p.x - p.r * 0.15, p.y - p.r * 0.3, p.r * 0.6, 0, Math.PI * 2);
    g.fill();
    g.globalAlpha = 0.16;
    g.fillStyle = pal.cloudShadow;
    g.beginPath();
    g.arc(p.x + p.r * 0.2, p.y + p.r * 0.75, p.r * 0.55, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;

  // 4. Cut the painted body to the softened silhouette.
  g.globalCompositeOperation = 'destination-in';
  g.filter = 'blur(2.5px)';
  g.drawImage(mask, 0, 0);
  g.filter = 'none';
  g.globalCompositeOperation = 'source-over';
  return c;
}

type Assets = {
  city: HTMLCanvasElement;
  beacons: Beacon[];
  clouds: HTMLCanvasElement[];
};

const cache: Partial<Record<Theme, Assets>> = {};
function assets(theme: Theme): Assets {
  if (!cache[theme]) {
    const { canvas: city, beacons } = buildCity(theme);
    const clouds = Array.from({ length: 6 }, (_, i) => buildCloud(theme, 640, 300, 101 + i * 37));
    cache[theme] = { city, beacons, clouds };
  }
  return cache[theme]!;
}

function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

type CloudSprite = { sprite: number; x: number; y: number; w: number; speed: number; layer: number; side: number; drift: number };

export function createSky(el: HTMLCanvasElement) {
  const ctx = el.getContext('2d')!;
  const rnd = mulberry(7);
  const stars = Array.from({ length: 140 }, () => ({ x: rnd(), y: rnd() * 0.75, r: rnd() * 1.3 + 0.3, tw: rnd() * 6 }));

  // Clouds in vw/vh: far, mid, and the near bank the camera flies through.
  const clouds: CloudSprite[] = [];
  const add = (layer: number, n: number, speed: number, size: number, yFrom: number, ySpread: number) => {
    for (let i = 0; i < n; i++) {
      const w = size * (0.8 + rnd() * 0.5);
      clouds.push({
        sprite: Math.floor(rnd() * 6),
        x: (i / Math.max(1, n - 1)) * 120 - 10 - w / 2 + (rnd() - 0.5) * 10,
        y: yFrom + rnd() * ySpread,
        w,
        speed,
        layer,
        side: i % 2 ? 1 : -1,
        drift: (rnd() - 0.5) * 0.25,
      });
    }
  };
  add(0, 6, 0.55, 30, 75, 40);
  add(1, 6, 0.9, 42, 105, 50);
  add(2, 5, 1.6, 70, 130, 40);
  add(3, 3, 2.3, 105, 150, 30);
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    el.width = Math.round(el.clientWidth * dpr);
    el.height = Math.round(el.clientHeight * dpr);
  };
  resize();
  window.addEventListener('resize', resize);
  // Coming back to the page (the back button, or a phone restoring the tab)
  // can leave the canvas at a stale size, which stretches and blurs the sky.
  window.addEventListener('pageshow', resize);

  const theme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'night' : 'day');

  /** p is the flight progress 0..1, t is seconds since load. */
  function draw(p: number, t: number) {
    // Match the canvas to its box on every frame, so it is never drawn stretched.
    const d = Math.min(2, window.devicePixelRatio || 1);
    if (d !== dpr || el.width !== Math.round(el.clientWidth * d) || el.height !== Math.round(el.clientHeight * d)) resize();
    if (!el.width || !el.height) return;
    const W = el.width / dpr;
    const H = el.height / dpr;
    const th = theme();
    const pal = PALETTES[th];
    const a = assets(th);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const ease = (v: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, v)), 3);
    const seg = (v: number, x: number, y: number) => Math.min(1, Math.max(0, (v - x) / (y - x)));
    const alt = ease(seg(p, 0, 0.62));

    // Sky, deepening with altitude.
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, mix(pal.skyTop, pal.altTop, alt));
    sky.addColorStop(1, mix(pal.skyLow, pal.altLow, alt));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Stars at night, more of them the higher we go; the sun by day.
    if (th === 'night') {
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + s.tw);
        ctx.globalAlpha = (0.35 + alt * 0.65) * tw;
        ctx.fillStyle = '#dfe8f5';
        ctx.fillRect(s.x * W, s.y * H, s.r, s.r);
      }
      ctx.globalAlpha = 1;
      const mr = Math.min(24, W * 0.045);
      const mx = W * 0.88, my = H * 0.13 + alt * H * 0.05;
      // A high moon is a warm cream, not paper white.
      ctx.fillStyle = '#f3e7c4';
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = mix(pal.skyTop, pal.altTop, alt);
      ctx.beginPath();
      ctx.arc(mx + mr * 0.42, my - mr * 0.25, mr * 0.88, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // The sun: a warm disc in a wide, soft halo of light.
      const sr = Math.min(34, W * 0.055);
      const sx = W * 0.86, sy = H * 0.15 + alt * H * 0.06;
      const halo = ctx.createRadialGradient(sx, sy, sr * 0.6, sx, sy, sr * 6);
      halo.addColorStop(0, 'rgba(255,236,190,0.75)');
      halo.addColorStop(0.25, 'rgba(255,226,160,0.28)');
      halo.addColorStop(1, 'rgba(255,226,160,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(sx - sr * 6, sy - sr * 6, sr * 12, sr * 12);
      const disc = ctx.createRadialGradient(sx - sr * 0.25, sy - sr * 0.25, 0, sx, sy, sr);
      disc.addColorStop(0, '#fffbea');
      disc.addColorStop(0.7, '#ffe8a3');
      disc.addColorStop(1, '#ffd27a');
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // City: covers the width, anchored to the bottom, falling away as we rise.
    // Phones see more of the skyline at a smaller scale, not three towers up close.
    const cityScale = W < 700 ? Math.max(W / CITY_W, Math.min(0.46, (H * 0.5) / CITY_H)) : Math.max(W / CITY_W, (H * 0.55) / CITY_H);
    const cw = CITY_W * cityScale;
    const ch = CITY_H * cityScale;
    const cityY = H - ch + ease(seg(p, 0, 0.42)) * H * 1.05;
    if (cityY < H) {
      ctx.drawImage(a.city, (W - cw) / 2, cityY, cw, ch);
      // Traffic on the bridge and blinking aviation lights.
      const deck = cityY + (DECK_Y - 4) * cityScale;
      for (let i = 0; i < 26; i++) {
        const dir = i % 2 ? 1 : -1;
        const x = ((i * 137.7 + t * 38 * dir * (0.8 + (i % 3) * 0.15)) % (W + 40) + W + 40) % (W + 40) - 20;
        ctx.fillStyle = th === 'night' ? (dir > 0 ? '#ffe9b0' : '#ff5a4f') : '#2a3a4f';
        ctx.fillRect(x, deck - 2.5 + (dir > 0 ? 0 : 2), 3, 1.6);
      }
      if (Math.sin(t * 3) > 0.2) {
        ctx.fillStyle = '#ff4b3e';
        for (const b of a.beacons) ctx.fillRect((W - cw) / 2 + b.x * cityScale - 1.5, cityY + b.y * cityScale - 1.5, 3, 3);
      }
    }

    // Clouds rising past the camera; the near bank parts to the sides.
    const vw = W / 100;
    const vh = H / 100;
    for (const c of clouds) {
      let x = c.x + c.drift * t;
      if (c.layer === 3) x += c.side * ease(seg(p, 0.45, 0.64)) * 75;
      if (c.layer === 2) x += c.side * ease(seg(p, 0.5, 0.68)) * 45;
      const y = c.y - p * c.speed * 160;
      const w = c.w * vw;
      const h = w * (300 / 640);
      const yy = y * vh;
      if (yy > H || yy + h < 0) continue;
      // Every cloud clears away from the name.
      // The near banks are thin, so the camera passes through wisps, not a wall.
      const thin = c.layer === 3 ? 0.55 : c.layer === 2 ? 0.8 : 1;
      ctx.globalAlpha = thin * (c.layer >= 2 ? 1 - seg(p, 0.6, 0.68) : 1 - seg(p, 0.6, 0.7));
      if (ctx.globalAlpha <= 0) continue;
      ctx.drawImage(a.clouds[c.sprite], x * vw, yy, w, h);
    }
    ctx.globalAlpha = 1;

    // Inside the cloud for a moment: a light haze, never a full whiteout.
    const fog = Math.max(0, 1 - Math.abs(p - 0.5) / 0.05);
    if (fog > 0) {
      ctx.globalAlpha = fog * 0.3;
      ctx.fillStyle = pal.fog;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
  }

  return { draw, resize };
}
