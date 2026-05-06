"use client";

import { useCallback, useEffect, useRef } from "react";

type Point = { x: number; y: number; vx: number; vy: number };

function usePointer() {
  const ref = useRef({ x: 0.5, y: 0.5, active: false });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.x = e.clientX / window.innerWidth;
      ref.current.y = e.clientY / window.innerHeight;
      ref.current.active = true;
    };
    const onLeave = () => {
      ref.current.active = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return ref;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = usePointer();
  const pointsRef = useRef<Point[]>([]);
  const frameRef = useRef(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const count = Math.min(
      90,
      Math.floor((window.innerWidth * window.innerHeight) / 22000),
    );
    const pts: Point[] = [];
    for (let i = 0; i < count; i++) {
      pts.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00035,
        vy: (Math.random() - 0.5) * 0.00035,
      });
    }
    pointsRef.current = pts;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const tick = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const w = canvas.width;
      const h = canvas.height;
      const pts = pointsRef.current;
      const t = frameRef.current * 0.002;

      ctx.fillStyle = "rgba(9, 9, 11, 0.22)";
      ctx.fillRect(0, 0, w, h);

      const px = pointer.current.active ? pointer.current.x : 0.5 + Math.sin(t) * 0.15;
      const py = pointer.current.active ? pointer.current.y : 0.45 + Math.cos(t * 0.9) * 0.12;

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        const dx = px - p.x;
        const dy = py - p.y;
        const pull = pointer.current.active ? 0.00012 : 0.00004;
        p.vx += dx * pull;
        p.vy += dy * pull;
        p.vx *= 0.985;
        p.vy *= 0.985;
      }

      const distTh = pointer.current.active ? 0.11 : 0.085;
      ctx.lineWidth = 1 * dpr;

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < distTh) {
            const alpha = (1 - d / distTh) * 0.35;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        const alpha = 0.35 + Math.sin(t + p.x * 8) * 0.12;
        ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 1.2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current += 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pointer]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      aria-hidden
    />
  );
}
