'use client';
import { useEffect, useState } from 'react';
import DayNightToggle from './components/DayNightToggle';

// ?demo=0 turns the hands-free demo off
const demo = new URLSearchParams(location.search).get('demo') !== '0';

export default function App() {
  const [night, setNight] = useState(false);
  const [width, setWidth] = useState(() => Math.min(640, window.innerWidth - 40));

  useEffect(() => {
    const onResize = () => setWidth(Math.min(640, window.innerWidth - 40));
    addEventListener('resize', onResize);
    return () => removeEventListener('resize', onResize);
  }, []);

  // flips every 2.6 s while idle; any real input stops it, 4 s of quiet starts it again
  useEffect(() => {
    if (!demo) return;
    let last = -1e9;
    const mark = (e: Event) => { if (e.isTrusted) last = performance.now(); };
    const evs = ['pointerdown', 'keydown', 'touchstart'] as const;
    evs.forEach((t) => addEventListener(t, mark, { passive: true }));
    const start = setTimeout(() => setNight((n) => !n), 1200);
    const id = setInterval(() => { if (performance.now() - last > 4000 && !document.hidden) setNight((n) => !n); }, 2600);
    return () => { clearTimeout(start); clearInterval(id); evs.forEach((t) => removeEventListener(t, mark)); };
  }, []);

  return (
    <main
      className="grid min-h-screen place-items-center overflow-hidden transition-colors duration-[800ms] ease-in-out"
      style={{ background: night ? '#070B1A' : '#EAF4FF' }}
    >
      <div className="grid justify-items-center gap-10">
        <DayNightToggle night={night} onChange={setNight} width={width} />
        <p
          className="m-0 text-3xl font-bold tracking-[-0.5px] transition-colors duration-[800ms] sm:text-5xl"
          style={{ color: night ? '#E8ECFF' : '#14213D' }}
          aria-live="polite"
        >
          {night ? 'Dark mode' : 'Light mode'}
        </p>
      </div>
      <p className="fixed bottom-4 left-0 right-0 m-0 text-center text-sm transition-colors duration-[800ms]" style={{ color: night ? '#8A8FA3' : '#4A5A78' }}>
        Free from <a className="underline underline-offset-2" href="https://qodesign.dev/?utm_source=github&utm_medium=demo&utm_campaign=free_repo" target="_blank" rel="noopener">qodesign.dev</a>
      </p>
    </main>
  );
}
