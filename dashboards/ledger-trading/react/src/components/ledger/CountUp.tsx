'use client';
import { animate, useReducedMotion } from 'framer-motion';
import { createElement, useEffect, useRef } from 'react';
import { fmt } from './store';

/** Eases from the last shown value to the new one. Instant under Reduce Motion. */
export function CountUp({ value, decimals = 2, duration = 0.6, firstDuration, prefix = '', suffix = '', className, as = 'b' }:
  { value: number; decimals?: number; duration?: number; firstDuration?: number; prefix?: string; suffix?: string; className?: string; as?: 'b' | 'span' }) {
  const ref = useRef<HTMLElement>(null);
  const from = useRef<number | null>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const node = ref.current; if (!node) return;
    const start = from.current ?? 0, first = from.current == null;
    const paint = (v: number) => { node.textContent = prefix + fmt(v, decimals) + suffix; };
    if (reduce) { paint(value); from.current = value; return; }
    const c = animate(start, value, { duration: first ? firstDuration ?? duration * 2.5 : duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { from.current = v; paint(v); } });
    return () => c.stop();
  }, [value, decimals, duration, firstDuration, prefix, suffix, reduce]);
  return createElement(as, { ref, className }, prefix + fmt(0, decimals) + suffix);
}
