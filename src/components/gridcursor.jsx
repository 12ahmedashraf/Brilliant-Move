"use client";
import { useEffect, useRef } from "react";

const CELL = 40;
const FADE_DURATION = 300; 

export default function GridCursorEffect() {
  const canvasRef = useRef(null);
  const cellsRef = useRef(new Map()); 
  const lastCellRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const [key, cell] of cellsRef.current) {
        const elapsed = now - cell.enteredAt;
        const alpha = Math.max(0, 1 - elapsed / FADE_DURATION);

        if (alpha <= 0) {
          cellsRef.current.delete(key);
          continue;
        }

        const [col, row] = key.split(",").map(Number);
        const x = col * CELL;
        const y = row * CELL;

        ctx.fillStyle = `rgba(255, 222, 89, ${alpha * 0.18})`;
        ctx.fillRect(x + 1, y + 1, CELL - 1, CELL - 1);

        ctx.strokeStyle = `rgba(255, 222, 89, ${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    const onMove = (e) => {
      const col = Math.floor(e.clientX / CELL);
      const row = Math.floor(e.clientY / CELL);
      const key = `${col},${row}`;

      if (key === lastCellRef.current) return; 
      lastCellRef.current = key;

      cellsRef.current.set(key, { enteredAt: performance.now() });
    };

    const onLeave = () => {
      lastCellRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}