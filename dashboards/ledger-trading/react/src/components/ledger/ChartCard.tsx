'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { CountUp } from './CountUp';
import { C, TF, compact, fmt, type LedgerStore, type Tf } from './store';
import { cardMotion, spring } from './motionPresets';

export type ChartHandle = { hover: (i: number | null) => void; count: () => number };
const TFS: Tf[] = ['1m', '15m', '1H', '4H', '1D'];
const ma = (c: { c: number }[], k: number) => c.map((_, i) => (i < k - 1 ? null : c.slice(i - k + 1, i + 1).reduce((s, x) => s + x.c, 0) / k));

/** Candlesticks + volume + MA lines, crosshair with OHLC readout, live last-price tag. */
export const ChartCard = forwardRef<ChartHandle, { store: LedgerStore; index: number }>(function ChartCard({ store, index }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 700, h: 430 });
  const [hover, setHover] = useState<{ i: number; y: number | null } | null>(null);
  const [flash, setFlash] = useState<'fu' | 'fd' | ''>('');
  const [gen, setGen] = useState(0); // bumps when the series is regenerated, so candles stagger in again
  const reduce = useReducedMotion();
  const cur = store.cur, candles = store.candles, n = candles.length;
  const lastPx = useRef(cur.px), lastKey = useRef(cur.s + store.tf);

  useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth || 700, h: el.clientHeight || 430 }));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const key = cur.s + store.tf;
    if (key !== lastKey.current) { lastKey.current = key; setGen((g) => g + 1); lastPx.current = cur.px; return; }
    if (cur.px !== lastPx.current) { setFlash(cur.px > lastPx.current ? 'fu' : 'fd'); lastPx.current = cur.px; const t = setTimeout(() => setFlash(''), 700); return () => clearTimeout(t); }
  }, [cur.px, cur.s, store.tf]);

  const { w: W, h: H } = size, pr = 62, pt = 26, volH = H * .18, pb = 22;
  const lo = Math.min(...candles.map((c) => c.l)), hi = Math.max(...candles.map((c) => c.h)), pad = (hi - lo) * .08;
  const mn = lo - pad, mx = hi + pad, vmax = Math.max(...candles.map((c) => c.v));
  const cw = (W - pr) / n, bw = Math.max(2, cw * .62), plotH = H - pt - pb - volH - 8;
  const X = (i: number) => i * cw + cw / 2, Y = (v: number) => pt + (1 - (v - mn) / (mx - mn)) * plotH, VY = (v: number) => H - pb - (v / vmax) * volH;
  const path = (arr: (number | null)[]) => arr.map((v, i) => (v == null ? '' : `${arr[i - 1] == null ? 'M' : 'L'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`)).join('');
  const last = candles[n - 1], ly = Y(last.c), lup = last.c >= last.o;
  const hi_ = hover ? Math.min(hover.i, n - 1) : n - 1, hc = candles[hi_], hup = hc.c >= hc.o, hcls = hup ? 'up' : 'down';
  const hy = hover ? (hover.y ?? Y(hc.c)) : 0, hv = mx - ((hy - pt) / plotH) * (mx - mn);
  useImperativeHandle(ref, () => ({ hover: (i) => setHover(i == null ? null : { i, y: null }), count: () => n }), [n]);
  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) * (W / r.width), y = (e.clientY - r.top) * (H / r.height);
    if (x > W - pr) return setHover(null);
    setHover({ i: Math.max(0, Math.min(n - 1, Math.floor(x / cw))), y });
  };
  const chg = ((cur.px - cur.open) / cur.open) * 100;
  const labels = [0, Math.floor(n / 3), Math.floor((2 * n) / 3), n - 1];

  return (
    <motion.section className="card chart-card" aria-label="Price chart" {...cardMotion(index)}>
      <div className="mkt">
        <div className="pair"><span className="coin" style={{ background: cur.col }}>{cur.g || cur.s[0]}</span><div><b>{cur.s} / USD</b><small>{cur.name}</small></div></div>
        <div><CountUp key={cur.s} value={cur.px} decimals={cur.dp} duration={0.35} firstDuration={1.3} className={`price ${flash}`} as="span" /></div>
        <div className="stat"><small>24h change</small><b className={chg >= 0 ? 'up' : 'down'}>{chg >= 0 ? '+' : ''}{chg.toFixed(2)}%</b></div>
        <div className="stat hide-s"><small>24h high</small><b>{fmt(hi, cur.dp)}</b></div>
        <div className="stat hide-s"><small>24h low</small><b>{fmt(lo, cur.dp)}</b></div>
        <div className="stat"><small>24h volume</small><b>${compact(cur.vol)}</b></div>
        <div className="seg" role="radiogroup" aria-label="Candle interval" onKeyDown={(e) => {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          const i = TFS.indexOf(store.tf), nx = TFS[(i + (e.key === 'ArrowRight' ? 1 : TFS.length - 1)) % TFS.length];
          store.setTf(nx); (e.currentTarget.querySelector(`[data-tf="${nx}"]`) as HTMLElement | null)?.focus(); e.preventDefault();
        }}>
          {TFS.map((t) => (
            <button key={t} role="radio" data-tf={t} aria-checked={store.tf === t} tabIndex={store.tf === t ? 0 : -1} onClick={() => store.setTf(t)}>
              {store.tf === t && <motion.span layoutId="ledger-tf" className="seg-pill" transition={spring} />}{t}
            </button>
          ))}
        </div>
      </div>
      <div className="chart" ref={box} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Candlestick chart with volume">
          {[0, 1, 2, 3, 4, 5].map((k) => { const v = mn + ((mx - mn) * k) / 5, y = Y(v); return (
            <g key={k}><line className="gl" x1="0" x2={W - pr} y1={y} y2={y} /><text className="ax" x={W - pr + 8} y={y + 3}>{fmt(v, cur.dp)}</text></g>); })}
          {labels.map((i) => { const d = new Date(candles[i].t * 1000); return (
            <text key={i} className="ax" x={X(i)} y={H - 6} textAnchor="middle">{store.tf === '1D' ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</text>); })}
          <g key={gen}>
            {candles.map((c, i) => {
              const up = c.c >= c.o, col = up ? C.up : C.down, x = X(i), y1 = Y(Math.max(c.o, c.c)), y2 = Y(Math.min(c.o, c.c));
              return (
                <motion.g key={c.t} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: Math.min(i, n) * 0.014, ease: [0.16, 1, 0.3, 1] }}>
                  <rect x={x - bw / 2} y={VY(c.v)} width={bw} height={H - pb - VY(c.v)} fill={col} opacity=".16" rx="1" />
                  <line x1={x} x2={x} y1={Y(c.h)} y2={Y(c.l)} stroke={col} strokeWidth="1.2" />
                  <rect x={x - bw / 2} y={y1} width={bw} height={Math.max(1.2, y2 - y1)} fill={col} fillOpacity=".9" rx="1.5" />
                </motion.g>
              );
            })}
          </g>
          <path d={path(ma(candles, 20))} fill="none" stroke={C.violet} strokeWidth="1.6" />
          <path d={path(ma(candles, 50))} fill="none" stroke={C.cyan} strokeWidth="1.2" opacity=".75" />
          <line x1="0" x2={W - pr} y1={ly} y2={ly} stroke={lup ? C.up : C.down} strokeDasharray="3 3" opacity=".7" />
          <g transform={`translate(${W - pr + 2} ${ly - 10})`}><rect width={pr - 4} height="20" rx="5" fill={lup ? C.up : C.down} />
            <text x={(pr - 4) / 2} y="14" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="10.5" fontWeight="600" fill="#0A0A0D">{fmt(last.c, cur.dp)}</text></g>
          {!reduce && <motion.circle cx={X(n - 1)} cy={ly} r={3.5} initial={{ r: 3.5, opacity: 1 }} fill={lup ? C.up : C.down} animate={{ r: [3.5, 7, 3.5], opacity: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />}
          {reduce && <circle cx={X(n - 1)} cy={ly} r="3.5" fill={lup ? C.up : C.down} />}
          {hover && <g pointerEvents="none">
            <line x1={X(hi_)} x2={X(hi_)} y1={pt} y2={H - pb} stroke={C.muted} strokeDasharray="3 3" />
            <line x1="0" x2={W - pr} y1={hy} y2={hy} stroke={C.muted} strokeDasharray="3 3" />
            <g transform={`translate(${W - pr + 2} ${hy - 10})`}><rect width={pr - 4} height="20" rx="5" fill={C.text} />
              <text x={(pr - 4) / 2} y="14" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="10.5" fontWeight="600" fill="#0A0A0D">{fmt(hv, cur.dp)}</text></g>
          </g>}
        </svg>
        <div className="ohlc">
          <span>O <b className={hcls}>{fmt(hc.o, cur.dp)}</b></span><span>H <b className={hcls}>{fmt(hc.h, cur.dp)}</b></span>
          <span>L <b className={hcls}>{fmt(hc.l, cur.dp)}</b></span><span>C <b className={hcls}>{fmt(hc.c, cur.dp)}</b></span>
          <span className={hcls}>{hup ? '+' : ''}{(((hc.c - hc.o) / hc.o) * 100).toFixed(2)}%</span>
        </div>
      </div>
      <div className="legend" aria-hidden="true"><span><i style={{ background: C.violet }} />MA 20</span><span><i style={{ background: C.cyan }} />MA 50</span><span><i style={{ background: C.line, height: 8 }} />volume · {TF[store.tf].n} candles</span></div>
    </motion.section>
  );
});
