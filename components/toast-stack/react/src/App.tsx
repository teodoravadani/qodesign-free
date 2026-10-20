import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast, toastDrag, getToasts } from './components/ToastStack';
import './demo.css';

/* ---------------- the little app around the toaster (demo only) ---------------- */
type Dep = { sha: string; msg: string; st: 'Ready' | 'Building'; t: string; key: string; flash?: boolean; gone?: boolean };
type Inv = { id: string; who: string; amt: string; gone?: boolean; flash?: boolean };
const DEPLOYS0: Dep[] = [
  { key: 'a', sha: '9c1e07b', msg: 'Fix checkout rounding on yearly plans', st: 'Ready', t: '2h' },
  { key: 'b', sha: '52ad3f0', msg: 'Add region picker to settings', st: 'Ready', t: '5h' },
  { key: 'c', sha: 'e7704b2', msg: 'Bump image CDN cache to 30 days', st: 'Ready', t: '1d' },
  { key: 'd', sha: '0b9fd41', msg: 'Onboarding: skip step 3 for invited users', st: 'Ready', t: '2d' },
];
const INVOICES0: Inv[] = [
  { id: '#1042', who: 'Brightwater Studio', amt: '$1,240.00' },
  { id: '#1041', who: 'Halcyon Labs', amt: '$860.00' },
  { id: '#1040', who: 'Pine & Co', amt: '$2,115.50' },
  { id: '#1039', who: 'Stride Health', amt: '$499.00' },
];
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const RM = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IDLE_MS = 4000;

const I = {
  up: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>,
  box: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="5" rx="1.5" /><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M10 13h4" /></svg>,
  rot: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>,
  inv: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>,
};
const NAV = [
  ['Overview', <svg aria-hidden="true" key="o" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>],
  ['Deploys', <svg aria-hidden="true" key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></svg>],
  ['Invoices', <svg aria-hidden="true" key="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></svg>],
  ['API keys', <svg aria-hidden="true" key="k" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" /></svg>],
  ['Team', <svg aria-hidden="true" key="t" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>],
] as const;

export default function App() {
  const [deps, setDeps] = useState<Dep[]>(DEPLOYS0);
  const [invs, setInvs] = useState<Inv[]>(INVOICES0);
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [demoOpen, setDemoOpen] = useState(false);
  const [cur, setCur] = useState({ x: 700, y: 620, ms: 0, on: false, down: false });
  const [rings, setRings] = useState<{ id: number; x: number; y: number }[]>([]);
  const [press, setPress] = useState<string | null>(null);
  const modeRef = useRef(mode); modeRef.current = mode;

  /* ---- app actions (the real component API) ---- */
  const flash = (setter: typeof setDeps | typeof setInvs, key: string) => {
    (setter as (f: (l: (Dep | Inv)[]) => (Dep | Inv)[]) => void)((l) => l.map((r) => (('key' in r ? r.key : r.id) === key ? { ...r, flash: true } : r)));
    setTimeout(() => (setter as (f: (l: (Dep | Inv)[]) => (Dep | Inv)[]) => void)((l) => l.map((r) => (('key' in r ? r.key : r.id) === key ? { ...r, flash: false } : r))), 700);
  };
  const doDeploy = useCallback((ms = 2600) => {
    const key = 'n' + Date.now();
    setDeps((l) => [{ key, sha: '4f2a1c9', msg: 'Ship toast notifications', st: 'Building' as const, t: 'now' }, ...l].slice(0, 4));
    toast.promise(wait(ms), {
      loading: { title: 'Deploying web@4f2a1c9', description: 'Building 12 routes · iad1, fra1, sin1' },
      success: () => {
        setDeps((l) => l.map((r) => (r.key === key ? { ...r, st: 'Ready' as const } : r)));
        flash(setDeps, key);
        return { title: 'Deployed to production', description: <><span className="mono">4f2a1c9</span> · 38 s · 12 routes</> };
      },
    });
  }, []);
  const archivedRef = useRef<string | null>(null);
  const doArchive = useCallback(() => {
    let id: string | null = null;
    setInvs((l) => { const r = l.find((x) => !x.gone); id = r ? r.id : null; return l.map((x) => (x.id === id ? { ...x, gone: true } : x)); });
    setTimeout(() => {
      if (!id) { toast.info('Nothing left to archive', { description: 'All October invoices are archived' }); return; }
      const aid = id; archivedRef.current = aid;
      toast.success(`Invoice ${aid} archived`, {
        description: 'Brightwater Studio · $1,240.00',
        action: { label: 'Undo', onClick: () => {
          setInvs((l) => l.map((x) => (x.id === aid ? { ...x, gone: false } : x)));
          flash(setInvs, aid);
          setTimeout(() => toast.info(`Invoice ${aid} restored`, { description: 'Back in October invoices' }), 160);
        } },
      });
    }, 0);
  }, []);
  const doKey = useCallback(() => {
    toast.error("Couldn’t rotate the API key", {
      description: 'Your session expired. Sign in and try again.',
      action: { label: 'Retry', onClick: () => setTimeout(() => toast.success('API key rotated', { description: <><span className="mono">nl_live_••••7Q2c</span> · old key works for 24 h</> }), 160) },
    });
  }, []);
  const doInvite = useCallback(() => toast.info('Invite sent to mara@northline.dev', { description: 'They get Developer access when they join' }), []);

  /* ---- demo: a scripted cursor drives the real component ---- */
  const run = useRef(0);
  const posRef = useRef({ x: 700, y: 620 });
  const place = (x: number, y: number, ms: number) => { posRef.current = { x, y }; setCur((c) => ({ ...c, x, y, ms, on: true })); };
  const resetAll = useCallback((bump = true) => {
    if (bump) run.current++;
    toast.clear();
    getToasts().forEach((t) => toast.dismiss(t.id));
    setDeps(DEPLOYS0); setInvs(INVOICES0); setDemoOpen(false); setPress(null);
  }, []);

  const demo = useCallback(async () => {
    const id = ++run.current;
    const sleep = (ms: number) => new Promise<void>((res, rej) => setTimeout(() => (id === run.current ? res() : rej(new Error('stop'))), ms));
    const el = (sel: string) => document.querySelector<HTMLElement>(sel);
    const c = (e: HTMLElement, fx = 0.5, fy = 0.5) => { const r = e.getBoundingClientRect(); return [r.left + r.width * fx, r.top + r.height * fy] as const; };
    const moveTo = async (e: HTMLElement | null, ms = 520, fx = 0.5, fy = 0.5) => { if (!e) return; const [x, y] = c(e, fx, fy); place(x, y, ms); await sleep(RM() ? 120 : ms); };
    const click = async (name: string) => {
      setCur((k) => ({ ...k, down: true })); setPress(name);
      if (!RM()) { const p = posRef.current; const rid = Date.now(); setRings((r) => [...r, { id: rid, ...p }]); setTimeout(() => setRings((r) => r.filter((q) => q.id !== rid)), 520); }
      await sleep(130); setCur((k) => ({ ...k, down: false })); setPress(null);
    };
    const byTitle = (s: string) => [...document.querySelectorAll<HTMLElement>('.qd-toast')].find((n) => n.querySelector('.qd-t-title')?.textContent?.includes(s));
    const idOf = (s: string) => getToasts().find((t) => String(t.title).includes(s))?.id;
    try {
      place(innerWidth * 0.55, innerHeight * 0.78, 0);
      await sleep(350);
      await moveTo(el('#bDeploy'), 600); await click('bDeploy'); doDeploy(RM() ? 2400 : 3300);
      await sleep(380);
      await moveTo(el('#bArchive'), 420); await click('bArchive'); doArchive();
      await sleep(380);
      await moveTo(el('#bKey'), 420); await click('bKey'); doKey();
      await sleep(520);
      await moveTo(el('.qd-toast:not([inert])'), 600, 0.38, 0.5); setDemoOpen(true);
      await sleep(1650);
      const err = byTitle('rotate'); const errId = idOf('rotate');
      if (err && errId) {
        await moveTo(err, 420, 0.35, 0.5); setCur((k) => ({ ...k, down: true })); await sleep(120);
        const { x: x0, y: y0 } = posRef.current; const D = 230, N = RM() ? 3 : 24;
        for (let k = 1; k <= N; k++) { const e = 1 - Math.pow(1 - k / N, 2); place(x0 + D * e, y0, 0); toastDrag.move(errId, D * e); await sleep(16); }
        setCur((k) => ({ ...k, down: false })); toastDrag.release(errId, 1.2);
        await sleep(620);
      }
      const arc = byTitle('archived');
      const undo = arc?.querySelector<HTMLElement>('.qd-t-act');
      if (undo) { await moveTo(undo, 520); await click('undo'); undo.click(); }
      await sleep(950);
      if (getToasts().length > 1) { await moveTo(el('.qd-clear'), 520); await click('clear'); toast.clear(); }
      await sleep(300);
      place(posRef.current.x + 140, posRef.current.y + 120, 700); setDemoOpen(false);
      await sleep(450);
      resetAll(false); await sleep(300);
      if (modeRef.current === 'demo') demo();
    } catch { /* stopped by real input */ }
  }, [doDeploy, doArchive, doKey, resetAll]);

  useEffect(() => { const k = setTimeout(demo, 50); return () => { clearTimeout(k); run.current++; }; }, [demo]);

  /* real input takes over; 4 s after the last input the demo comes back */
  useEffect(() => {
    let last = performance.now(); let pressed = 0; let mx: number | null = null; let my = 0;
    const take = (e: Event) => {
      if (!e.isTrusted || modeRef.current !== 'demo') return;
      modeRef.current = 'live'; setMode('live'); run.current++;
      setCur((c) => ({ ...c, on: false, down: false })); setPress(null); setDemoOpen(false);
      getToasts().forEach((t) => toastDrag.release(t.id, 0));
    };
    const touch = (e: Event) => {
      if (!e.isTrusted) return;
      if (e.type === 'pointermove') { const p = e as PointerEvent; if (mx !== null && Math.abs(p.clientX - mx) + Math.abs(p.clientY - my) < 4) return; mx = p.clientX; my = p.clientY; }
      last = performance.now();
    };
    const down = (e: Event) => { if (e.isTrusted) pressed++; };
    const up = (e: Event) => { if (e.isTrusted) pressed = Math.max(0, pressed - 1); };
    const o = { capture: true, passive: true } as const;
    ['pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, take, { capture: true }));
    ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'].forEach((ev) => addEventListener(ev, touch, o));
    addEventListener('pointerdown', down, o); ['pointerup', 'pointercancel'].forEach((ev) => addEventListener(ev, up, o));
    const iv = setInterval(() => {
      const loading = getToasts().some((t) => t.type === 'loading' || t.resolving);
      if (modeRef.current === 'live' && !pressed && !loading && performance.now() - last > IDLE_MS) {
        (document.activeElement as HTMLElement | null)?.blur?.();
        modeRef.current = 'demo'; setMode('demo'); resetAll(); setTimeout(demo, 300);
      }
    }, 250);
    return () => {
      ['pointerdown', 'keydown'].forEach((ev) => removeEventListener(ev, take, { capture: true }));
      ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'].forEach((ev) => removeEventListener(ev, touch, o));
      removeEventListener('pointerdown', down, o); ['pointerup', 'pointercancel'].forEach((ev) => removeEventListener(ev, up, o));
      clearInterval(iv);
    };
  }, [demo, resetAll]);

  const rm = RM();
  return (
    <>
      <div className="glow" aria-hidden="true" />
      <div className="win">
        <header className="bar">
          <div className="dots" aria-hidden="true"><i /><i /><i /></div>
          <div className="crumb">northline / <b>web</b> / deploys</div>
          <div className="sp" />
          <a className="credit" href="https://qodesign.dev/?utm_source=github&utm_medium=demo&utm_campaign=toast_stack" target="_blank" rel="noopener">qodesign.dev ↗</a>
          <div className="ava" aria-hidden="true">MK</div>
        </header>
        <div className="body">
          <nav className="side" aria-label="Main">
            <div className="brand"><span>N</span>Northline</div>
            {NAV.map(([label, icon]) => (
              <a key={label} className={`nav${label === 'Deploys' ? ' on' : ''}`} aria-current={label === 'Deploys' ? 'page' : undefined}>{icon}{label}</a>
            ))}
            <div className="foot"><b>Pro plan</b>3 of 5 seats used · renews Nov 2</div>
          </nav>
          <main className="main">
            <div className="head">
              <div>
                <h1>Deploys <em>/ web</em></h1>
                <p className="sub"><span className="live" />production · 3 regions · last build 2 h ago</p>
              </div>
            </div>
            <div className="acts">
              <button id="bDeploy" className={`btn pri${press === 'bDeploy' ? ' press' : ''}`} onClick={() => doDeploy()}>{I.up}Deploy web</button>
              <button id="bArchive" className={`btn${press === 'bArchive' ? ' press' : ''}`} onClick={doArchive}>{I.box}Archive invoice</button>
              <button id="bKey" className={`btn${press === 'bKey' ? ' press' : ''}`} onClick={doKey}>{I.rot}Rotate API key</button>
              <button id="bInvite" className="btn" onClick={doInvite}>{I.inv}Invite teammate</button>
            </div>
            <div className="grid">
              <section className="card" aria-label="Recent deploys">
                <h2>Recent deploys <span>main</span></h2>
                <div>
                  {deps.map((d) => (
                    <motion.div key={d.key} className={`row dep${d.flash ? ' flash' : ''}`} initial={rm ? false : { height: 0, opacity: 0 }} animate={{ height: 54, opacity: 1 }} transition={{ duration: rm ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}>
                      <span className="mono">{d.sha}</span><span className="msg">{d.msg}</span>
                      <span className={`pill${d.st === 'Building' ? ' build' : ''}`}><i />{d.st}</span>
                      <span className="mono t" style={{ textAlign: 'right' }}>{d.t}</span>
                    </motion.div>
                  ))}
                </div>
              </section>
              <section className="card" aria-label="Invoices">
                <h2>Invoices <span>October</span></h2>
                <div>
                  {invs.map((v) => (
                    <div key={v.id} className={`row inv${v.gone ? ' gone' : ''}${v.flash ? ' flash' : ''}`}>
                      <span><span className="mono">{v.id}</span>&nbsp; {v.who}</span>
                      <span className="pill paid"><i />Paid</span>
                      <span className="amt">{v.amt}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
        <Toaster strategy="absolute" expanded={mode === 'demo' ? demoOpen : undefined} paused={mode === 'demo'} />
      </div>
      <div className={`cur${cur.on && mode === 'demo' ? ' on' : ''}${cur.down ? ' down' : ''}`} aria-hidden="true"
        style={{ transform: `translate(${cur.x - 4}px,${cur.y - 3}px)`, transition: rm || !cur.ms ? 'opacity .3s' : `transform ${cur.ms}ms cubic-bezier(.45,.05,.2,1),opacity .3s` }}>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 2.5 19.5 12l-6.6 1.6 3.6 7-2.9 1.4-3.5-7.1L5 19.6Z" fill="#F4F4F6" stroke="#0A0A0D" strokeWidth="1.4" strokeLinejoin="round" /></svg>
      </div>
      {rings.map((r) => <i key={r.id} className="ring" style={{ left: r.x, top: r.y }} />)}
    </>
  );
}
