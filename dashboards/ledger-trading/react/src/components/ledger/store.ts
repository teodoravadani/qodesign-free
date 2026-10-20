// Ledger's simulated market. Swap this file for your websocket / REST feed: the components only read
// the snapshot fields and call the action methods.
export const C = { up: '#C6FF3D', down: '#FF5C7A', violet: '#8B6CFF', cyan: '#5EE1FF', amber: '#FFB547', line: '#262A36', text: '#F4F4F6', muted: '#8A8FA3' };
function rng(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const R = rng(42);
const rand = (a: number, b: number) => a + (b - a) * R();
export const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const compact = (n: number) => (n >= 1e9 ? (n / 1e9).toFixed(2) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : n.toFixed(0));

export interface Asset { s: string; name: string; px: number; chg: number; col: string; g: string; hold: number; dp: number; vol: number; open: number; hist: number[] }
export interface Candle { t: number; o: number; h: number; l: number; c: number; v: number }
export interface BookRow { p: number; q: number; flash: number }
export interface Trade { id: number; ts: number; pair: string; side: 'buy' | 'sell'; price: number; amount: number; total: number; status: 'filled' | 'open' }
export type Tf = '1m' | '15m' | '1H' | '4H' | '1D';
export const TF: Record<Tf, { n: number; vol: number; sec: number }> = { '1m': { n: 72, vol: .0016, sec: 60 }, '15m': { n: 64, vol: .0042, sec: 900 }, '1H': { n: 60, vol: .0075, sec: 3600 }, '4H': { n: 56, vol: .012, sec: 14400 }, '1D': { n: 52, vol: .024, sec: 86400 } };
export const EXTRA_TICKER = [{ s: 'GOLD', px: 2391.4, chg: 0.22, dp: 2 }, { s: 'SPX', px: 5864.67, chg: 0.41, dp: 2 }, { s: 'DOGE', px: 0.1384, chg: -2.07, dp: 4 }];

function mkAssets(): Asset[] {
  const raw = [
    { s: 'BTC', name: 'Bitcoin', px: 67412.5, chg: 2.41, col: '#FFB547', g: '₿', hold: 0.412, dp: 2, vol: 28.4e9 },
    { s: 'ETH', name: 'Ethereum', px: 3284.18, chg: 1.12, col: '#8B6CFF', g: 'Ξ', hold: 3.9, dp: 2, vol: 14.1e9 },
    { s: 'SOL', name: 'Solana', px: 168.42, chg: -0.84, col: '#5EE1FF', g: 'S', hold: 28, dp: 2, vol: 3.2e9 },
    { s: 'AAPL', name: 'Apple', px: 228.31, chg: 0.37, col: '#F4F4F6', g: '', hold: 12, dp: 2, vol: 5.1e9 },
    { s: 'NVDA', name: 'Nvidia', px: 131.07, chg: 3.18, col: '#C6FF3D', g: 'N', hold: 20, dp: 2, vol: 31.7e9 },
    { s: 'EUR', name: 'Euro', px: 1.0842, chg: -0.12, col: '#FF5C7A', g: '€', hold: 0, dp: 4, vol: 1.9e9 },
  ];
  return raw.map((a) => {
    const open = a.px / (1 + a.chg / 100);
    const hist = Array.from({ length: 30 }, (_, i) => open * (1 + (R() - .45) * .02 + (i * a.chg) / 100 / 30));
    hist.push(a.px);
    return { ...a, open, hist };
  });
}

export function genCandles(a: Asset, key: Tf): Candle[] {
  const { n, vol, sec } = TF[key]; const out: Candle[] = [];
  let p = a.px * (1 - vol * n * .08 * Math.sign(a.chg || 1));
  const now = Math.floor(Date.now() / 1000 / sec) * sec;
  for (let i = 0; i < n; i++) {
    const o = p, drift = ((a.px - p) / (n - i)) * .9, c = o + drift + (R() - .5) * o * vol * 2;
    const h = Math.max(o, c) + R() * o * vol * .9, l = Math.min(o, c) - R() * o * vol * .9;
    out.push({ t: now - (n - 1 - i) * sec, o, h, l, c, v: rand(.4, 1.6) * (1 + Math.abs(c - o) / o / vol) });
    p = c;
  }
  const last = out[n - 1]; last.c = a.px; last.h = Math.max(last.h, a.px); last.l = Math.min(last.l, a.px);
  return out;
}

export class LedgerStore {
  assets = mkAssets();
  cur = this.assets[0];
  tf: Tf = '15m';
  candles: Candle[] = genCandles(this.cur, this.tf);
  rows = 9;
  book: { asks: BookRow[]; bids: BookRow[] } = { asks: [], bids: [] };
  cash = 24180;
  trades: Trade[] = [];
  tick = 0;
  version = 0;
  private tid = 0;
  private subs = new Set<() => void>();

  constructor(rows = 9) {
    this.rows = rows;
    this.buildBook();
    let t = Date.now();
    for (let i = 0; i < 46; i++) {
      t -= rand(40, 900) * 1000; const a = this.assets[Math.floor(R() * 5)];
      const price = a.px * (1 + (R() - .5) * .03), amount = a.px > 1000 ? rand(.002, .4) : rand(.5, 30);
      this.trades.push({ id: ++this.tid, ts: t, pair: a.s + '/USD', side: R() < .55 ? 'buy' : 'sell', price, amount, total: price * amount, status: 'filled' });
    }
    ([['ETH', 'buy', .98, 1.2], ['SOL', 'sell', 1.04, 12], ['BTC', 'buy', .985, .05]] as const).forEach(([s, side, k, q]) => {
      const a = this.assets.find((x) => x.s === s)!;
      this.trades.push({ id: ++this.tid, ts: Date.now() - rand(60, 600) * 1000, pair: s + '/USD', side, price: a.px * k, amount: q, total: a.px * k * q, status: 'open' });
    });
  }
  subscribe = (fn: () => void) => { this.subs.add(fn); return () => { this.subs.delete(fn); }; };
  getVersion = () => this.version;
  private emit() { this.version++; this.subs.forEach((f) => f()); }

  step() { const p = this.cur.px; return p > 1000 ? 0.5 : p > 10 ? 0.01 : 0.0001; }
  buildBook() {
    const s = this.step(), big = this.cur.px > 1000 ? 1 : 40;
    this.book = { asks: [], bids: [] };
    for (let i = 0; i < this.rows; i++) {
      this.book.asks.push({ p: this.cur.px + s * (i + 1), q: rand(.05, 2.4) * big, flash: 0 });
      this.book.bids.push({ p: this.cur.px - s * i, q: rand(.05, 2.4) * big, flash: 0 });
    }
  }
  setAsset(sym: string) {
    const a = this.assets.find((x) => x.s === sym); if (!a || a === this.cur) return;
    this.cur = a; this.candles = genCandles(a, this.tf); this.buildBook(); this.emit();
  }
  setTf(tf: Tf) { if (tf === this.tf) return; this.tf = tf; this.candles = genCandles(this.cur, tf); this.emit(); }
  marketTick() {
    this.tick++;
    const cur = this.cur;
    this.assets.forEach((a) => { const vol = a === cur ? .0009 : .0006; a.px = Math.max(a.px * .5, a.px * (1 + (R() - .48) * vol)); a.hist = [...a.hist.slice(1), a.px]; a.chg = ((a.px - a.open) / a.open) * 100; });
    const last = this.candles[this.candles.length - 1];
    const upd = { ...last, c: cur.px, h: Math.max(last.h, cur.px), l: Math.min(last.l, cur.px), v: last.v + rand(.01, .08) };
    this.candles = [...this.candles.slice(0, -1), upd];
    if (this.tick % 12 === 0) this.candles = [...this.candles.slice(1), { t: upd.t + TF[this.tf].sec, o: cur.px, h: cur.px, l: cur.px, c: cur.px, v: rand(.2, .5) }];
    const s = this.step();
    this.book = {
      asks: this.book.asks.map((r, i) => (R() < .35 ? { p: cur.px + s * (i + 1), q: Math.max(.01, r.q * rand(.6, 1.5)), flash: this.tick } : { ...r, p: cur.px + s * (i + 1) })),
      bids: this.book.bids.map((r, i) => (R() < .35 ? { p: cur.px - s * i, q: Math.max(.01, r.q * rand(.6, 1.5)), flash: this.tick } : { ...r, p: cur.px - s * i })),
    };
    if (this.tick % 5 === 0) {
      const a = this.assets[Math.floor(R() * 5)];
      this.addTrade({ pair: a.s + '/USD', side: R() < .5 ? 'buy' : 'sell', price: a.px, amount: a.px > 1000 ? rand(.002, .2) : rand(.5, 20), status: 'filled' }, false);
    }
    this.emit();
  }
  addTrade(t: Omit<Trade, 'id' | 'ts' | 'total'>, emit = true): Trade {
    const full: Trade = { ...t, id: ++this.tid, ts: Date.now(), total: t.price * t.amount };
    this.trades = [full, ...this.trades];
    if (emit) this.emit();
    return full;
  }
  /** Simulated order: fills when the limit crosses the market, otherwise rests as an open order. */
  place(side: 'buy' | 'sell', type: 'limit' | 'market', price: number, amount: number) {
    const cur = this.cur, p = type === 'market' ? cur.px : price, total = amount * p;
    const filled = type === 'market' || (side === 'buy' ? p >= cur.px : p <= cur.px);
    if (side === 'buy') { this.cash -= total; if (filled) cur.hold += amount; } else if (filled) { cur.hold -= amount; this.cash += total; }
    return { trade: this.addTrade({ pair: cur.s + '/USD', side, price: p, amount, status: filled ? 'filled' : 'open' }), filled };
  }
  cancel(id: number) {
    const t = this.trades.find((x) => x.id === id); if (!t) return null;
    if (t.side === 'buy') this.cash += t.total;
    this.trades = this.trades.filter((x) => x !== t); this.emit();
    return t;
  }
  holdings() {
    return [
      ...this.assets.filter((a) => a.hold > 0).map((a) => ({ s: a.s, name: a.name, col: a.col, g: a.g, hold: a.hold, chg: a.chg, px: a.px, v: a.hold * a.px })),
      { s: 'USD', name: 'Cash', col: '#5C6378', g: '$', hold: this.cash, chg: 0, px: 1, v: this.cash },
    ];
  }
}
