'use client';
import { LayoutGroup, MotionConfig, motion } from 'framer-motion';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ChartCard, type ChartHandle } from './ChartCard';
import { OrderBook, Portfolio, Ticket, Trades, Watchlist, type PortfolioHandle, type TicketHandle, type TradesHandle } from './Panels';
import { EXTRA_TICKER, LedgerStore, fmt } from './store';
import { spring } from './motionPresets';
import './ledger.css';

const TABS = ['Trade', 'Portfolio', 'Markets', 'Earn'];

export interface LedgerDashboardProps {
  /** Run the hands-free tour while nobody touches the page (it pauses for 4 s after any input). Default true. */
  autoplayDemo?: boolean;
  /** Pass your own store (e.g. one fed by a websocket). Defaults to the built-in simulation. */
  store?: LedgerStore;
}

/** Ledger: a trading desk dashboard. Free, MIT, by qodesign.dev. Prices are simulated. */
export function LedgerDashboard(props: LedgerDashboardProps) {
  // Prices, trades and the clock are live and random, so the desk renders after mount.
  // This keeps the server HTML and the first client render identical (no hydration warning in Next.js).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="ledger" style={{ minHeight: '100vh' }} aria-busy="true" />;
  return <Desk {...props} />;
}

function Desk({ autoplayDemo = true, store: external }: LedgerDashboardProps) {
  const [store] = useState(() => external ?? new LedgerStore(typeof window !== 'undefined' && window.innerWidth < 900 ? 6 : 9));
  useSyncExternalStore(store.subscribe, store.getVersion, store.getVersion);
  const [tab, setTab] = useState('Trade');
  const [clock, setClock] = useState('--:--:--');
  const [toast, setToast] = useState<string | null>(null);
  const toastT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const chart = useRef<ChartHandle>(null);
  const ticket = useRef<TicketHandle | null>(null);
  const pf = useRef<PortfolioHandle | null>(null);
  const trades = useRef<TradesHandle | null>(null);

  const showToast = (m: string) => { setToast(m); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(null), 2600); };

  useEffect(() => {
    if (external) return;
    const id = setInterval(() => { if (!document.hidden) { store.marketTick(); setClock(new Date().toLocaleTimeString('en-GB', { hour12: false })); } }, 1000);
    setClock(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    return () => clearInterval(id);
  }, [store, external]);

  // hands-free tour; real input wins and the tour comes back 4 s after the last input
  useEffect(() => {
    if (!autoplayDemo) return;
    let lastInput = -1e9, stop = false;
    const mark = (e: Event) => { if (e.isTrusted) lastInput = performance.now(); };
    const markMove = (e: PointerEvent) => { if (e.pointerType === 'mouse') mark(e); };
    const evs = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    evs.forEach((t) => addEventListener(t, mark, { passive: true }));
    addEventListener('pointermove', markMove, { passive: true });
    const idle = () => performance.now() - lastInput > 4000;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const steps: (() => Promise<void>)[] = [
      async () => { const n = chart.current?.count() ?? 64; for (let i = Math.floor(n * 0.45); i < n - 2 && idle() && !stop; i++) { chart.current?.hover(i); await wait(reduce ? 140 : 60); } await wait(700); chart.current?.hover(null); },
      async () => { ticket.current?.setPct(25); await wait(500); ticket.current?.setPct(50); await wait(900); },
      async () => { pf.current?.hot('ETH'); await wait(1300); pf.current?.hot(null); },
      async () => { store.setTf('1H'); await wait(1800); },
      async () => { trades.current?.side('buy'); await wait(1400); trades.current?.side('all'); await wait(500); },
      async () => { ticket.current?.setPct(0); store.setTf('15m'); await wait(1400); },
    ];
    (async () => {
      await wait(2800);
      for (let s = 0; !stop; s++) {
        while ((!idle() || document.hidden) && !stop) await wait(500);
        if (stop) break;
        await steps[s % steps.length]();
        await wait(700);
      }
    })();
    return () => { stop = true; evs.forEach((t) => removeEventListener(t, mark)); removeEventListener('pointermove', markMove); };
  }, [autoplayDemo, store]);

  const tickerItems = [...store.assets.map((a) => ({ s: a.s, px: a.px, chg: a.chg, dp: a.dp })), ...EXTRA_TICKER];
  const tick = tickerItems.map((a) => (
    <span className="tk" key={a.s}><b>{a.s}</b><span className="num">{fmt(a.px, a.dp)}</span><span className={`num ${a.chg >= 0 ? 'up' : 'down'}`}>{a.chg >= 0 ? '▲' : '▼'} {Math.abs(a.chg).toFixed(2)}%</span></span>
  ));

  return (
    <MotionConfig reducedMotion="user">
      <div className="ledger">
        <div className="page">
          <header className="topbar">
            <div className="logo"><svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="2" y="2" width="22" height="22" rx="7" fill="#161821" stroke="#262A36" /><path d="M8 17V9M13 17v-5M18 17V7" stroke="#C6FF3D" strokeWidth="2.4" strokeLinecap="round" /></svg><span>ledger</span></div>
            <LayoutGroup id="ledger-tabs">
              <nav className="tabs" role="tablist" aria-label="Sections">
                {TABS.map((t) => (
                  <button key={t} role="tab" aria-selected={tab === t} tabIndex={tab === t ? 0 : -1} onClick={() => setTab(t)}>
                    {t}{tab === t && <motion.span layoutId="ledger-ink" className="tab-ink" transition={spring} aria-hidden="true" />}
                  </button>
                ))}
              </nav>
            </LayoutGroup>
            <div className="tb-r">
              <div className="pill"><i className="dot" aria-hidden="true" /><span>Markets open</span><b className="num">{clock}</b></div>
              <div className="pill"><span>Paper account</span></div>
              <div className="avatar" aria-label="Signed in as Ana Ilie" role="img">AI</div>
            </div>
          </header>
          <div className="ticker" aria-label="Market ticker"><div className="ticker-track">{tick}{tickerItems.map((a) => <span className="tk" key={a.s + '-2'} aria-hidden="true"><b>{a.s}</b><span className="num">{fmt(a.px, a.dp)}</span><span className={`num ${a.chg >= 0 ? 'up' : 'down'}`}>{a.chg >= 0 ? '▲' : '▼'} {Math.abs(a.chg).toFixed(2)}%</span></span>)}</div></div>

          <main className="wrap">
            <ChartCard ref={chart} store={store} index={0} />
            <OrderBook store={store} index={1} onPick={(p) => ticket.current?.setPrice(p)} />
            <Ticket store={store} index={2} onToast={showToast} api={ticket} />
            <Portfolio store={store} index={3} api={pf} />
            <Watchlist store={store} index={4} />
            <Trades store={store} index={5} onToast={showToast} api={trades} />
            <p className="foot-credit">Ledger is a free template by <a href="https://qodesign.dev/?utm_source=github&utm_medium=demo&utm_campaign=free_repo" target="_blank" rel="noopener">qodesign.dev</a>. Prices are simulated.</p>
          </main>
        </div>
        <div className={`toast${toast ? ' on' : ''}`} role="status" aria-live="polite"><i>✓</i><span>{toast}</span></div>
      </div>
    </MotionConfig>
  );
}

export default LedgerDashboard;
