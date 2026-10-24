import LedgerDashboard from './components/ledger/LedgerDashboard';

// ?demo=0 turns the hands-free tour off
/* ?demo=0 or ?autoplay=0 turns the scripted demo off */
const demo = (() => { const p = new URLSearchParams(location.search); return p.get('demo') !== '0' && p.get('autoplay') !== '0'; })();

export default function App() {
  return <LedgerDashboard autoplayDemo={demo} />;
}
