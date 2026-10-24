'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UploadDropzone, UploadDropzoneHandle, uploadBurst } from './components/UploadDropzone';
import './demo.css';
/* ?demo=0 or ?autoplay=0 turns the scripted demo off */
const AUTOPLAY = (() => { const p = new URLSearchParams(location.search); return p.get('demo') !== '0' && p.get('autoplay') !== '0'; })();

const DEMO_FILES = [
  { name: 'brand-guidelines.pdf', size: 4.2 * 1048576, simulate: { speed: 0.62 } },
  { name: 'hero-shot@2x.png', size: 2.8 * 1048576, simulate: { speed: 0.85 } },
  { name: 'build-2.4.0.zip', size: 18.6 * 1048576, simulate: { speed: 0.7, failAt: 62 } },
  { name: 'launch-notes.md', size: 12 * 1024, simulate: { speed: 1.5 } },
];
const RM = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IDLE_MS = 4000;

export default function App() {
  const dz = useRef<UploadDropzoneHandle>(null);
  const [ready, setReady] = useState(false);
  const [pop, setPop] = useState(0);
  const [published, setPublished] = useState(false);
  const [mode, setMode] = useState<'demo' | 'live'>(AUTOPLAY ? 'demo' : 'live');
  const [cur, setCur] = useState({ x: 1200, y: 760, ms: 0, ease: '', on: false, down: false, drag: false });
  const [rings, setRings] = useState<{ id: number; x: number; y: number }[]>([]);
  const modeRef = useRef(mode); modeRef.current = mode;
  const pubRef = useRef<HTMLButtonElement>(null);
  const curEl = useRef<HTMLDivElement>(null);
  const run = useRef(0);
  const pos = useRef({ x: 1200, y: 760 });
  const busy = useRef(false);

  const place = (x: number, y: number, ms: number, ease = 'cubic-bezier(.45,.05,.2,1)') => { pos.current = { x, y }; setCur((c) => ({ ...c, x, y, ms, ease, on: true })); };
  const publish = useCallback(() => {
    if (!pubRef.current?.classList.contains('ready')) return;
    setPublished(true);
    if (!RM() && pubRef.current) uploadBurst(pubRef.current, 18, 70);
    setTimeout(() => setPublished(false), 1500);
  }, []);

  const demo = useCallback(async () => {
    const id = ++run.current;
    const sleep = (ms: number) => new Promise<void>((res, rej) => setTimeout(() => (id === run.current ? res() : rej(new Error('stop'))), ms));
    const centre = (e: HTMLElement, fx = 0.5, fy = 0.5) => { const r = e.getBoundingClientRect(); return [r.left + r.width * fx, r.top + r.height * fy] as [number, number]; };
    const moveTo = async (e: HTMLElement | null, ms = 520) => { if (!e) return; const [x, y] = centre(e); place(x, y, ms); await sleep(RM() ? 120 : ms); };
    const click = async (e: HTMLElement | null) => {
      setCur((k) => ({ ...k, down: true })); e?.classList.add('press');
      if (!RM()) { const rid = Date.now(); setRings((r) => [...r, { id: rid, ...pos.current }]); setTimeout(() => setRings((r) => r.filter((x) => x.id !== rid)), 520); }
      await sleep(130); setCur((k) => ({ ...k, down: false })); e?.classList.remove('press');
    };
    try {
      const zone = document.querySelector<HTMLElement>('.qd-zone')!;
      place(innerWidth - 40, innerHeight - 30, 0); setCur((k) => ({ ...k, drag: true }));
      await sleep(350);
      const [zx, zy] = centre(zone, 0.55, 0.52);
      place(zx, zy, RM() ? 0 : 1100, 'cubic-bezier(.5,0,.25,1)');
      const t0 = performance.now(); let on = false;
      while (performance.now() - t0 < (RM() ? 150 : 1100)) {
        const r = zone.getBoundingClientRect(); const cr = curEl.current!.getBoundingClientRect();
        const x = cr.left + 4; const y = cr.top + 3;
        if (x > r.left && x < r.right && y > r.top && y < r.bottom) { dz.current?.setDragOver(true, 4, [x, y]); on = true; }
        await sleep(30);
      }
      if (!on) dz.current?.setDragOver(true, 4, [zx, zy]);
      dz.current?.setDragOver(true, 4, [zx, zy]);
      await sleep(350);
      setCur((k) => ({ ...k, drag: false, down: true })); dz.current?.setDragOver(false); dz.current?.shock(zx, zy);
      dz.current?.addFiles(DEMO_FILES.map((f) => ({ ...f, simulate: { ...f.simulate } })), [zx, zy]);
      await sleep(160); setCur((k) => ({ ...k, down: false }));
      await sleep(1900);
      const z = dz.current?.items().find((f) => f.status === 'error');
      if (z) { const b = document.querySelector<HTMLElement>('.qd-file.err .qd-retry'); await moveTo(b, 620); await click(b); dz.current?.retry(z.id); }
      await sleep(1500);
      if (pubRef.current?.classList.contains('ready')) { await moveTo(pubRef.current, 650); await click(pubRef.current); publish(); }
      await sleep(1000);
      place(pos.current.x - 120, pos.current.y + 200, 700);
      await sleep(500);
      dz.current?.clear(true); setReady(false); setPublished(false); await sleep(500);
      if (modeRef.current === 'demo') demo();
    } catch { /* stopped by real input */ }
  }, [publish]);

  useEffect(() => { if (!AUTOPLAY) return; const k = setTimeout(demo, 50); return () => { clearTimeout(k); run.current++; }; }, [demo]);

  const takeOverRef = useRef<() => void>(() => {});
  useEffect(() => {
    let last = performance.now(); let pressed = 0; let mx: number | null = null; let my = 0;
    const take = () => {
      last = performance.now();
      if (modeRef.current !== 'demo') return;
      modeRef.current = 'live'; setMode('live'); run.current++;
      setCur((c) => ({ ...c, on: false, down: false, drag: false }));
      dz.current?.setDragOver(false);
      document.querySelectorAll('.press').forEach((n) => n.classList.remove('press'));
    };
    takeOverRef.current = take;
    const takeEv = (e: Event) => { if (e.isTrusted) take(); };
    const touch = (e: Event) => {
      if (!e.isTrusted) return;
      if (e.type === 'pointermove') { const p = e as PointerEvent; if (mx !== null && Math.abs(p.clientX - mx) + Math.abs(p.clientY - my) < 4) return; mx = p.clientX; my = p.clientY; }
      last = performance.now();
    };
    const down = (e: Event) => { if (e.isTrusted) pressed++; };
    const up = (e: Event) => { if (e.isTrusted) pressed = Math.max(0, pressed - 1); };
    const focus = () => { last = performance.now(); };
    const o = { capture: true, passive: true } as const;
    const evs = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'];
    ['pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, takeEv, { capture: true }));
    evs.forEach((ev) => addEventListener(ev, touch, o));
    addEventListener('pointerdown', down, o); ['pointerup', 'pointercancel'].forEach((ev) => addEventListener(ev, up, o));
    addEventListener('focus', focus);
    const iv = setInterval(() => {
      const uploading = dz.current?.items().some((f) => f.status === 'uploading');
      if (AUTOPLAY && modeRef.current === 'live' && !pressed && !uploading && !busy.current && performance.now() - last > IDLE_MS) {
        (document.activeElement as HTMLElement | null)?.blur?.();
        modeRef.current = 'demo'; setMode('demo'); dz.current?.clear(false); setReady(false); setPublished(false);
        setTimeout(demo, 400);
      }
    }, 250);
    return () => {
      ['pointerdown', 'keydown'].forEach((ev) => removeEventListener(ev, takeEv, { capture: true }));
      evs.forEach((ev) => removeEventListener(ev, touch, o));
      removeEventListener('pointerdown', down, o); ['pointerup', 'pointercancel'].forEach((ev) => removeEventListener(ev, up, o));
      removeEventListener('focus', focus);
      clearInterval(iv);
    };
  }, [demo]);

  const rm = RM();
  return (
    <>
      <div className="glow" aria-hidden="true" />
      <div className="win">
        <header className="bar">
          <div className="dots" aria-hidden="true"><i /><i /><i /></div>
          <div className="crumb">northline / releases / <b>v2.4.0</b></div>
          <div className="sp" />
          <a className="credit" href="https://qodesign.dev/?utm_source=github&utm_medium=demo&utm_campaign=upload_dropzone" target="_blank" rel="noopener">qodesign.dev ↗</a>
        </header>
        <main className="page">
          <div className="head">
            <div>
              <h1>Release <em>v2.4.0</em></h1>
              <p className="sub">Add the build, screenshots and notes. Files upload as soon as you drop them.</p>
            </div>
            <button
              ref={pubRef}
              key={pop}
              className={`pub${ready ? ' ready' : ''}${ready && pop ? ' pop' : ''}`}
              aria-disabled={!ready}
              onClick={publish}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" /></svg>
              <span>{published ? 'Published' : 'Publish release'}</span>
            </button>
          </div>
          <UploadDropzone
            ref={dz}
            onChange={(items) => { const all = items.length > 0 && items.every((f) => f.status === 'done'); setReady((r) => (r === all ? r : all)); busy.current = false; }}
            onAllDone={() => { setReady(true); if (!RM()) setPop((p) => p + 1); }}
            onUserActivity={() => takeOverRef.current()}
          />
        </main>
      </div>
      <div ref={curEl} className={`cursor${cur.on && mode === 'demo' ? ' on' : ''}${cur.down ? ' down' : ''}${cur.drag ? ' drag' : ''}`} aria-hidden="true"
        style={{ transform: `translate(${cur.x - 4}px,${cur.y - 3}px)`, transition: rm || !cur.ms ? 'opacity .3s' : `transform ${cur.ms}ms ${cur.ease},opacity .3s` }}>
        <div className="carry">
          <i style={{ ['--c' as string]: '#FF6B7A', transform: 'rotate(-16deg) translate(-18px,10px)' } as React.CSSProperties}>PDF</i>
          <i style={{ ['--c' as string]: '#B9A6FF', transform: 'rotate(-5deg) translate(-4px,0)' } as React.CSSProperties}>PNG</i>
          <i style={{ ['--c' as string]: '#FFC85E', transform: 'rotate(7deg) translate(12px,2px)' } as React.CSSProperties}>ZIP</i>
          <i style={{ ['--c' as string]: '#5EE1FF', transform: 'rotate(18deg) translate(28px,12px)' } as React.CSSProperties}>MD</i>
          <em>4</em>
        </div>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 2.5 19.5 12l-6.6 1.6 3.6 7-2.9 1.4-3.5-7.1L5 19.6Z" fill="#F4F4F6" stroke="#0A0A0D" strokeWidth="1.4" strokeLinejoin="round" /></svg>
      </div>
      {rings.map((r) => <i key={r.id} className="ringfx" style={{ left: r.x, top: r.y }} />)}
    </>
  );
}
