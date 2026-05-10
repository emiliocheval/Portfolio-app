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
        vx: (Math.random() - 0.5) * 0.0014,
        vy: (Math.random() - 0.5) * 0.0014,
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

      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;

        if (pointer.current.active) {
          const dx = pointer.current.x - p.x;
          const dy = pointer.current.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 0.3 && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            if (dist < 0.06) {
              // bounce away gently when too close
              const force = (0.06 - dist) / 0.06 * 0.0004;
              p.vx -= nx * force;
              p.vy -= ny * force;
            } else if (dist < 0.2) {
              // weak pull in the outer zone
              const force = (1 - dist / 0.2) * 0.000018;
              p.vx += nx * force;
              p.vy += ny * force;
            }
          }
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
      }

      const distTh = pointer.current.active ? 0.1 : 0.085;
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
            ctx.strokeStyle = `rgba(200, 200, 210, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        const alpha = 0.35 + Math.sin(t + p.x * 8) * 0.12;
        ctx.fillStyle = `rgba(210, 210, 220, ${alpha})`;
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
