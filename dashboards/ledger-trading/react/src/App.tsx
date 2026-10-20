import LedgerDashboard from './components/ledger/LedgerDashboard';

// ?demo=0 turns the hands-free tour off
const demo = new URLSearchParams(location.search).get('demo') !== '0';

export default function App() {
  return <LedgerDashboard autoplayDemo={demo} />;
}
