import OrbitDashboard from './components/orbit/OrbitDashboard';

// ?demo=0 turns the hands-free tour off
const demo = new URLSearchParams(location.search).get('demo') !== '0';

export default function App() {
  return <OrbitDashboard autoplayDemo={demo} />;
}
