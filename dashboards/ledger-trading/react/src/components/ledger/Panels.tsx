import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CountUp } from './CountUp';
import { C, fmt, type LedgerStore, type Trade } from './store';
import { cardMotion, spring } from './motionPresets';

/* ---------- order book ---------- */
export function OrderBook({ store, index, onPick }: { store: LedgerStore; index: number; onPick: (p: number) => void }) {
  const cur = store.cur, qd = cur.px > 1000 ? 4 : 2;
  let a = 0; const cumA = store.book.asks.map((r) => (a += r.q));
  let b = 0; const cumB = store.book.bids.map((r) => (b += r.q));
  const max = Math.max(a, b), bp = Math.round((b / (a + b)) * 100);
  const mid = (store.book.asks[0].p + store.book.bids[0].p) / 2;
  const Row = ({ r, cum, k }: { r: { p: number; q: number; flash: number }; cum: number; k: string }) => (
    <div key={k + r.flash} className={`book-row${r.flash === store.tick ? ' flash' : ''}`} onClick={() => onPick(r.p)} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(r.p); } }} aria-label={`Use price ${fmt(r.p, cur.dp)}`}>
      <i style={{ width: `${(cum / max) * 100}%` }} /><span>{fmt(r.p, cur.dp)}</span><span>{fmt(r.q, qd)}</span><span>{fmt(cum, qd)}</span>
    </div>
  );
  return (
    <motion.section className="card book-card" aria-label="Order book" {...cardMotion(index)}>
      <div className="card-h"><h2>Order book</h2><div className="r"><span className="sub">step {store.step()}</span></div></div>
      <div className="book-head"><span>Price (USD)</span><span>Size ({cur.s})</span><span>Total</span></div>
      <div className="book-side asks">{store.book.asks.map((r, i) => ({ r, i })).reverse().map(({ r, i }) => <Row key={'a' + i} k={'a' + i} r={r} cum={cumA[i]} />)}</div>
      <div className="spread"><b className={`num ${cur.px >= cur.open ? 'up' : 'down'}`}>{fmt(mid, cur.dp)}</b><small>spread {fmt(store.book.asks[0].p - store.book.bids[0].p, cur.dp)}</small></div>
      <div className="book-side bids">{store.book.bids.map((r, i) => <Row key={'b' + i} k={'b' + i} r={r} cum={cumB[i]} />)}</div>
      <div className="ratio" aria-hidden="true"><i style={{ background: C.up, width: `${bp}%` }} /><i style={{ background: C.down, width: `${100 - bp}%` }} /></div>
      <div className="ratio-l"><span className="up">B {bp}%</span><span className="down">{100 - bp}% S</span></div>
    </motion.section>
  );
}

/* ---------- order ticket ---------- */
export type TicketHandle = { setPct: (p: number) => void; setPrice: (p: number) => void };
export function Ticket({ store, index, onToast, api }: { store: LedgerStore; index: number; onToast: (m: string) => void; api?: React.MutableRefObject<TicketHandle | null> }) {
  const cur = store.cur;
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [type, setType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState(cur.px.toFixed(cur.dp));
  const [amt, setAmt] = useState('0.0000');
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [doneLabel, setDoneLabel] = useState('');
  const reduce = useReducedMotion();
  useEffect(() => { setPrice(cur.px.toFixed(cur.dp)); setAmt('0.0000'); }, [cur.s]); // eslint-disable-line react-hooks/exhaustive-deps
  const pv = type === 'market' ? cur.px : parseFloat(price) || 0;
  const maxAmt = side === 'buy' ? store.cash / (pv || cur.px) : cur.hold;
  const a = parseFloat(amt) || 0, total = a * pv;
  const pct = Math.max(0, Math.min(100, maxAmt ? (a / maxAmt) * 100 : 0));
  const err = a > maxAmt + 1e-9 ? (side === 'buy' ? 'Not enough USD for this amount.' : `You hold ${fmt(cur.hold, 4)} ${cur.s}.`) : '';
  const setPct = (p: number) => setAmt(((maxAmt * p) / 100).toFixed(4));
  if (api) api.current = { setPct, setPrice: (p) => { setType('limit'); setPrice(p.toFixed(cur.dp)); } };
  const submit = () => {
    if (!a || state !== 'idle' || err) return;
    setState('busy');
    setTimeout(() => {
      const { filled } = store.place(side, type, pv, a);
      setDoneLabel(filled ? 'Filled ✓' : 'Order placed ✓'); setState('done');
      onToast(`${side === 'buy' ? 'Bought' : 'Sold'} ${fmt(a, 4)} ${cur.s} at ${fmt(pv, cur.dp)}${filled ? '' : ' (open)'}`);
      setTimeout(() => { setState('idle'); setAmt('0.0000'); }, 1400);
    }, reduce ? 200 : 900);
  };
  return (
    <motion.section className={`card ticket-card${side === 'sell' ? ' sell-mode' : ''}`} aria-label="Place an order" {...cardMotion(index)}>
      <div className="side-t" role="radiogroup" aria-label="Side" onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); setSide((s) => (s === 'buy' ? 'sell' : 'buy')); } }}>
        <motion.span className="knob" aria-hidden="true" animate={{ x: side === 'sell' ? '100%' : '0%', backgroundColor: side === 'sell' ? C.down : C.up }} transition={spring} style={{ transform: 'none' }} />
        {(['buy', 'sell'] as const).map((s) => (
          <button key={s} role="radio" aria-checked={side === s} tabIndex={side === s ? 0 : -1} onClick={() => setSide(s)}>{s === 'buy' ? 'Buy' : 'Sell'}</button>
        ))}
      </div>
      <div className="otype" role="group" aria-label="Order type">
        {(['limit', 'market'] as const).map((t) => <button key={t} aria-pressed={type === t} onClick={() => setType(t)}>{t === 'limit' ? 'Limit' : 'Market'}</button>)}
      </div>
      <div className={`field${type === 'market' ? ' disabled' : ''}`}><label htmlFor="ledger-price">Price</label>
        <input id="ledger-price" inputMode="decimal" autoComplete="off" disabled={type === 'market'} value={type === 'market' ? cur.px.toFixed(cur.dp) : price} onChange={(e) => setPrice(e.target.value)} /><em>USD</em></div>
      <div className="field"><label htmlFor="ledger-amt">Amount</label>
        <input id="ledger-amt" inputMode="decimal" autoComplete="off" value={amt} onChange={(e) => setAmt(e.target.value)} /><em>{cur.s}</em></div>
      <div className="slider">
        <span className="rail" /><span className="fill" style={{ width: `${pct}%` }} />
        {[0, 25, 50, 75, 100].map((s) => <span key={s} className={`stop${s <= pct && pct > 0 ? ' on' : ''}`} style={{ left: `${s}%` }} />)}
        <input type="range" min={0} max={100} step={1} value={Math.round(pct)} aria-label="Share of available balance" onChange={(e) => setPct(+e.target.value)} />
        <span className="thumb" style={{ left: `${pct}%` }} />
      </div>
      <div className="pcts" aria-hidden="true"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
      <div className="ferr" role="alert">{err}</div>
      <div className="tot"><span>Total</span><b>{fmt(total)} USD</b></div>
      <button className={`go${state === 'busy' ? ' busy' : ''}${state === 'done' ? ' done' : ''}`} disabled={!!err || a <= 0 || state !== 'idle'} onClick={submit}>
        <span className="sp" aria-hidden="true" />
        <span>{state === 'busy' ? 'Placing order' : state === 'done' ? doneLabel : `${side === 'buy' ? 'Buy' : 'Sell'} ${cur.s}`}</span>
      </button>
      <div className="avail"><span>Available</span><b>{side === 'buy' ? `${fmt(store.cash)} USD` : `${fmt(cur.hold, 4)} ${cur.s}`}</b></div>
    </motion.section>
  );
}

/* ---------- portfolio ---------- */
export type PortfolioHandle = { hot: (s: string | null) => void };
export function Portfolio({ store, index, api }: { store: LedgerStore; index: number; api?: React.MutableRefObject<PortfolioHandle | null> }) {
  const [hot, setHot] = useState<string | null>(null);
  const [drawn, setDrawn] = useState(false);
  if (api) api.current = { hot: setHot };
  useEffect(() => { const t = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true))); return () => cancelAnimationFrame(t); }, []);
  const hs = store.holdings(), total = hs.reduce((s, h) => s + h.v, 0);
  const r = 52, circ = 2 * Math.PI * r; let off = 0;
  const h = hs.find((x) => x.s === hot);
  return (
    <motion.section className="card pf-card" aria-label="Portfolio" {...cardMotion(index)}>
      <div className="card-h"><h2>Portfolio</h2><div className="r"><span className="sub">paper money</span></div></div>
      <div className="bal"><small>Total balance</small><CountUp value={total} prefix="$" firstDuration={1.5} /><span className="up">+$1,284.20 (2.74%) today</span></div>
      <div className="donut">
        <svg viewBox="-70 -70 140 140" role="img" aria-label="Allocation by asset" onPointerLeave={() => setHot(null)}>
          {hs.map((x, i) => {
            const frac = x.v / total, len = Math.max(0, frac * circ - 3), o = off; off += frac * circ;
            return <circle key={x.s} className={`seg-arc${hot && hot !== x.s ? ' dim' : ''}${hot === x.s ? ' hot' : ''}`} r={r} stroke={x.col} transform="rotate(-90)"
              strokeDasharray={drawn ? `${len} ${circ - len}` : `0 ${circ}`} strokeDashoffset={-o}
              style={{ transition: `stroke-dasharray 1.1s ${i * 90}ms cubic-bezier(.16,1,.3,1), stroke-width .25s, opacity .25s` }} onPointerEnter={() => setHot(x.s)} />;
          })}
          <text y="-2" fontSize="15" fontWeight="600">{h ? ((h.v / total) * 100).toFixed(1) + '%' : hs.length - 1}</text>
          <text y="14" fontSize="9" fill={C.muted}>{h ? h.s : 'assets'}</text>
        </svg>
        <div className="alloc" onPointerLeave={() => setHot(null)}>
          {hs.map((x) => <button key={x.s} className={hot === x.s ? 'hot' : ''} onPointerEnter={() => setHot(x.s)} onFocus={() => setHot(x.s)} onBlur={() => setHot(null)}><i style={{ background: x.col }} />{x.s}<b>{((x.v / total) * 100).toFixed(1)}%</b></button>)}
        </div>
      </div>
      <div className="assets">
        {hs.filter((x) => x.s !== 'USD').slice(0, 4).map((x) => (
          <div className="asset" key={x.s}><span className="coin" style={{ background: x.col }}>{x.g || x.s[0]}</span>
            <div><b>{x.name}</b><small>{fmt(x.hold, x.px > 1000 ? 4 : 2)} {x.s}</small></div>
            <div className="v">${fmt(x.v)}<small className={x.chg >= 0 ? 'up' : 'down'}>{x.chg >= 0 ? '+' : ''}{x.chg.toFixed(2)}%</small></div></div>
        ))}
      </div>
    </motion.section>
  );
}

/* ---------- watchlist ---------- */
const spark = (h: number[], w = 70, ht = 26) => { const mn = Math.min(...h), mx = Math.max(...h); return h.map((v, i) => `${i ? 'L' : 'M'}${((i / (h.length - 1)) * w).toFixed(1)} ${(ht - 2 - ((v - mn) / (mx - mn || 1)) * (ht - 4)).toFixed(1)}`).join(''); };
export function Watchlist({ store, index }: { store: LedgerStore; index: number }) {
  return (
    <motion.section className="card watch-card" aria-label="Watchlist" {...cardMotion(index)}>
      <div className="card-h"><h2>Watchlist</h2><div className="r"><span className="sub">tap to chart</span></div></div>
      <div className="wl">
        {store.assets.map((a) => { const up = a.px >= a.open, ch = ((a.px - a.open) / a.open) * 100; return (
          <button key={a.s} aria-pressed={a === store.cur} onClick={() => store.setAsset(a.s)} aria-label={`${a.name}, ${fmt(a.px, a.dp)} US dollars, ${ch >= 0 ? 'up' : 'down'} ${Math.abs(ch).toFixed(2)} percent`}>
            <span className="coin" style={{ background: a.col }}>{a.g || a.s[0]}</span><div><b>{a.s}</b><small>{a.name}</small></div>
            <svg viewBox="0 0 70 26" aria-hidden="true"><path d={spark(a.hist)} fill="none" stroke={up ? C.up : C.down} strokeWidth="1.5" /></svg>
            <div className="px">{fmt(a.px, a.dp)}<small className={up ? 'up' : 'down'}>{ch >= 0 ? '+' : ''}{ch.toFixed(2)}%</small></div>
          </button>); })}
      </div>
    </motion.section>
  );
}

/* ---------- trades table ---------- */
type SortKey = 'ts' | 'pair' | 'side' | 'price' | 'amount' | 'total' | 'status';
const COLS: [SortKey, string, boolean][] = [['ts', 'Time', false], ['pair', 'Pair', false], ['side', 'Side', false], ['price', 'Price', true], ['amount', 'Amount', true], ['total', 'Total', true], ['status', 'Status', false]];
const PER = 7;
export type TradesHandle = { side: (s: 'all' | 'buy' | 'sell') => void };
export function Trades({ store, index, onToast, api }: { store: LedgerStore; index: number; onToast: (m: string) => void; api?: React.MutableRefObject<TradesHandle | null> }) {
  const [view, setView] = useState<'history' | 'open'>('history');
  const [side, setSide] = useState<'all' | 'buy' | 'sell'>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'ts', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [anim, setAnim] = useState(0);
  const seen = useRef<number | null>(null);
  if (api) api.current = { side: (s) => { setSide(s); setPage(1); setAnim((x) => x + 1); } };
  const rows = useMemo(() => {
    const s = sort.dir === 'asc' ? 1 : -1, k = sort.key, ql = q.trim().toLowerCase();
    return store.trades.filter((t) => (view === 'open' ? t.status === 'open' : t.status === 'filled') && (side === 'all' || t.side === side) && (!ql || t.pair.toLowerCase().includes(ql)))
      .sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * s);
  }, [store.trades, view, side, q, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / PER)), pg = Math.min(page, pages), sl = rows.slice((pg - 1) * PER, pg * PER);
  const newest = store.trades[0]?.id ?? null;
  const flashId = seen.current !== null && newest !== seen.current ? newest : null;
  useEffect(() => { seen.current = newest; }, [newest]);
  const nums: (number | '…')[] = [];
  for (let p = 1; p <= pages; p++) { if (p === 1 || p === pages || Math.abs(p - pg) <= 1) nums.push(p); else if (nums[nums.length - 1] !== '…') nums.push('…'); }
  const go = (p: number) => { setPage(p); setAnim((x) => x + 1); };
  const openN = store.trades.filter((t) => t.status === 'open').length;
  const dp = (p: number) => (p > 10 ? 2 : 4);
  const cancel = (t: Trade) => { const c = store.cancel(t.id); if (c) onToast(`Cancelled ${c.side} ${c.pair}`); };
  return (
    <motion.section className="card trades-card" aria-label="Orders and trades" {...cardMotion(index)}>
      <div className="tt">
        <div className="tabs2" role="tablist" aria-label="Table">
          <button role="tab" aria-selected={view === 'history'} onClick={() => { setView('history'); go(1); }}>Trade history</button>
          <button role="tab" aria-selected={view === 'open'} onClick={() => { setView('open'); go(1); }}>Open orders <span className="num">{openN}</span></button>
        </div>
        <div className="chips" role="group" aria-label="Side filter">
          {(['all', 'buy', 'sell'] as const).map((s) => <button key={s} aria-pressed={side === s} onClick={() => { setSide(s); go(1); }}>{s === 'all' ? 'All' : s === 'buy' ? 'Buys' : 'Sells'}</button>)}
        </div>
        <label className="tsearch">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <span className="sr">Filter by pair</span><input value={q} onChange={(e) => { setQ(e.target.value); go(1); }} placeholder="Filter by pair" autoComplete="off" />
        </label>
      </div>
      <div className="tbl-wrap">
        <table aria-label="Trades">
          <thead><tr>{COLS.map(([k, label, right]) => (
            <th key={k} className={right ? 'r' : undefined} aria-sort={sort.key === k ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
              <button onClick={() => { setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 'asc' ? 'desc' : 'asc') : ['ts', 'price', 'amount', 'total'].includes(k) ? 'desc' : 'asc' })); setAnim((x) => x + 1); }}>
                {label}<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg></button>
            </th>))}</tr></thead>
          <tbody key={anim}>
            <AnimatePresence initial={false}>
              {sl.length ? sl.map((t, i) => (
                <tr key={t.id} className={t.id === flashId ? 'new' : 'enter'} style={{ ['--r' as string]: i }}>
                  <td className="m">{new Date(t.ts).toLocaleTimeString('en-GB', { hour12: false })}</td><td><b style={{ fontWeight: 600 }}>{t.pair}</b></td>
                  <td><span className={`side-tag ${t.side}`}>{t.side.toUpperCase()}</span></td>
                  <td className="r">{fmt(t.price, dp(t.price))}</td><td className="r">{fmt(t.amount, t.price > 1000 ? 4 : 2)}</td><td className="r">${fmt(t.total)}</td>
                  <td>{t.status === 'open' ? <><span className="st open">open</span> <button className="cancel" aria-label={`Cancel ${t.side} ${t.pair} order`} onClick={() => cancel(t)}>Cancel</button></> : <span className="st filled">filled</span>}</td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="empty">{view === 'open' ? 'No open orders. Place a limit order away from the price to see one here.' : `No trades match “${q || side}”.`}</td></tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <div className="pager">
        <span className="num">{rows.length ? (pg - 1) * PER + 1 : 0}–{Math.min(rows.length, pg * PER)} of {rows.length}</span>
        <div className="pages">
          <button aria-label="Previous page" disabled={pg === 1} onClick={() => go(pg - 1)}>‹</button>
          {nums.map((p, i) => p === '…' ? <span key={'e' + i} aria-hidden="true">…</span> : <button key={p} aria-label={`Page ${p}`} aria-current={p === pg ? 'page' : undefined} onClick={() => go(p)}>{p}</button>)}
          <button aria-label="Next page" disabled={pg === pages} onClick={() => go(pg + 1)}>›</button>
        </div>
      </div>
    </motion.section>
  );
}
