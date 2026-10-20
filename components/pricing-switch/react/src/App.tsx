'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PricingSwitch, PricingSwitchHandle, Plan } from './components/PricingSwitch';
import './demo.css';

const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', note: '1 seat', description: 'For side projects and trying things out.', monthly: 12, yearly: 10, cta: 'Start free',
    features: ['3 projects', '10 GB storage', 'Basic analytics', 'Email support'] },
  { id: 'pro', name: 'Pro', note: 'up to 5 seats', description: 'For small teams shipping every week.', monthly: 30, yearly: 25, cta: 'Get Pro', featured: true,
    features: ['Unlimited projects', '100 GB storage', 'Advanced analytics', 'Custom domains', 'Priority support'] },
  { id: 'team', name: 'Team', note: '10 seats', description: 'For companies that need control and audit.', monthly: 84, yearly: 70, cta: 'Talk to sales',
    features: ['Everything in Pro', 'SSO and audit log', '1 TB storage', '99.9% uptime SLA', 'A named account manager'] },
];
const RM = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrow = () => window.matchMedia('(max-width:900px)').matches;
const IDLE_MS = 4000;

export default function App() {
  const [yearly, setYearly] = useState(false);
  const [hl, setHl] = useState<string | null>(null);
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [cur, setCur] = useState({ x: 640, y: 700, ms: 0, on: false, down: false });
  const [rings, setRings] = useState<{ id: number; x: number; y: number }[]>([]);
  const modeRef = useRef(mode); modeRef.current = mode;
  const ps = useRef<PricingSwitchHandle>(null);
  const run = useRef(0);
  const pos = useRef({ x: 640, y: 700 });

  const place = (x: number, y: number, ms: number) => { pos.current = { x, y }; setCur((c) => ({ ...c, x, y, ms, on: true })); };

  const demo = useCallback(async () => {
    const id = ++run.current;
    const sleep = (ms: number) => new Promise<void>((res, rej) => setTimeout(() => (id === run.current ? res() : rej(new Error('stop'))), ms));
    const q = (sel: string) => document.querySelector<HTMLElement>(sel);
    const moveTo = async (e: HTMLElement | null, ms = 520, fx = 0.5, fy = 0.5) => {
      if (!e) return; const r = e.getBoundingClientRect(); place(r.left + r.width * fx, r.top + r.height * fy, ms); await sleep(RM() ? 120 : ms);
    };
    const click = async (e: HTMLElement | null) => {
      setCur((k) => ({ ...k, down: true })); e?.classList.add('press');
      if (!RM()) { const rid = Date.now(); setRings((r) => [...r, { id: rid, ...pos.current }]); setTimeout(() => setRings((r) => r.filter((x) => x.id !== rid)), 520); }
      await sleep(130); setCur((k) => ({ ...k, down: false })); e?.classList.remove('press');
    };
    try {
      place(innerWidth * 0.5, innerHeight * 0.86, 0);
      await sleep(500);
      await moveTo(q('[data-bill="y"]'), 650); await click(q('[data-bill="y"]')); setYearly(true);
      await sleep(1300);
      if (narrow()) { ps.current?.centre('team'); await sleep(700); }
      await moveTo(q('[data-plan="team"]'), 600, 0.5, 0.3); setHl('team');
      await sleep(900);
      setHl(null);
      if (narrow()) { ps.current?.centre('pro'); await sleep(650); }
      const cta = q('[data-plan="pro"] .qd-cta');
      await moveTo(cta, 560); setHl('pro'); await click(cta); cta?.click();
      await sleep(1100);
      setHl(null);
      await moveTo(q('[data-bill="m"]'), 650); await click(q('[data-bill="m"]')); setYearly(false);
      await sleep(1300);
      place(pos.current.x - 60, pos.current.y + 160, 600);
      await sleep(400);
      if (modeRef.current === 'demo') demo();
    } catch { /* stopped by real input */ }
  }, []);

  useEffect(() => { const k = setTimeout(demo, 50); return () => { clearTimeout(k); run.current++; }; }, [demo]);

  /* real input takes over; 4 s after the last input the demo comes back */
  useEffect(() => {
    let last = performance.now(); let pressed = 0; let mx: number | null = null; let my = 0;
    const take = (e: Event) => {
      if (!e.isTrusted || modeRef.current !== 'demo') return;
      modeRef.current = 'live'; setMode('live'); run.current++;
      setCur((c) => ({ ...c, on: false, down: false })); setHl(null);
      document.querySelectorAll('.press').forEach((n) => n.classList.remove('press'));
    };
    const touch = (e: Event) => {
      if (!e.isTrusted) return;
      if (e.type === 'scroll' && modeRef.current === 'demo') return;
      if (e.type === 'pointermove') { const p = e as PointerEvent; if (mx !== null && Math.abs(p.clientX - mx) + Math.abs(p.clientY - my) < 4) return; mx = p.clientX; my = p.clientY; }
      last = performance.now();
    };
    const down = (e: Event) => { if (e.isTrusted) pressed++; };
    const up = (e: Event) => { if (e.isTrusted) pressed = Math.max(0, pressed - 1); };
    const o = { capture: true, passive: true } as const;
    const evs = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'];
    ['pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, take, { capture: true }));
    evs.forEach((ev) => addEventListener(ev, touch, o));
    addEventListener('pointerdown', down, o); ['pointerup', 'pointercancel'].forEach((ev) => addEventListener(ev, up, o));
    const iv = setInterval(() => {
      if (modeRef.current === 'live' && !pressed && performance.now() - last > IDLE_MS) {
        (document.activeElement as HTMLElement | null)?.blur?.();
        modeRef.current = 'demo'; setMode('demo'); setHl(null); setYearly(false);
        if (narrow()) ps.current?.centre('pro', false);
        setTimeout(demo, 600);
      }
    }, 250);
    return () => {
      ['pointerdown', 'keydown'].forEach((ev) => removeEventListener(ev, take, { capture: true }));
      evs.forEach((ev) => removeEventListener(ev, touch, o));
      removeEventListener('pointerdown', down, o); ['pointerup', 'pointercancel'].forEach((ev) => removeEventListener(ev, up, o));
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
          <div className="url"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>northline.dev/pricing</div>
          <div className="sp" />
          <a className="credit" href="https://qodesign.dev/?utm_source=github&utm_medium=demo&utm_campaign=pricing_switch" target="_blank" rel="noopener">qodesign.dev ↗</a>
        </header>
        <main className="page">
          <PricingSwitch
            ref={ps}
            plans={PLANS}
            yearly={yearly}
            onYearlyChange={setYearly}
            highlight={hl}
            header={(<><p className="eyebrow">Pricing</p><h1>Plans that grow <em>with your team</em></h1></>)}
          />
        </main>
      </div>
      <div className={`cursor${cur.on && mode === 'demo' ? ' on' : ''}${cur.down ? ' down' : ''}`} aria-hidden="true"
        style={{ transform: `translate(${cur.x - 4}px,${cur.y - 3}px)`, transition: rm || !cur.ms ? 'opacity .3s' : `transform ${cur.ms}ms cubic-bezier(.45,.05,.2,1),opacity .3s` }}>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 2.5 19.5 12l-6.6 1.6 3.6 7-2.9 1.4-3.5-7.1L5 19.6Z" fill="#F4F4F6" stroke="#0A0A0D" strokeWidth="1.4" strokeLinejoin="round" /></svg>
      </div>
      {rings.map((r) => <i key={r.id} className="ringfx" style={{ left: r.x, top: r.y }} />)}
    </>
  );
}
