"use client";
import { useEffect, useRef } from "react";

const CELL = 40;
const FADE_DURATION = 800;

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

        const [px, py] = key.split(",").map(Number);

        ctx.fillStyle = `rgba(255, 222, 89, ${alpha * 0.18})`;
        ctx.fillRect(px + 1, py + 1, CELL - 1, CELL - 1);

        ctx.strokeStyle = `rgba(255, 222, 89, ${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 0.5, py + 0.5, CELL - 1, CELL - 1);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    const onMove = (e) => {
      const absoluteX = e.clientX + window.scrollX;
      const absoluteY = e.clientY + window.scrollY;

      const col = Math.floor(absoluteX / CELL);
      const row = Math.floor(absoluteY / CELL);

      const cellKey = `${col},${row}`;
      if (cellKey === lastCellRef.current) return;
      lastCellRef.current = cellKey;

      const viewportX = col * CELL - window.scrollX;
      const viewportY = row * CELL - window.scrollY;

      cellsRef.current.set(cellKey, {
        enteredAt: performance.now(),
        vx: viewportX,
        vy: viewportY,
      });
    };

    const onLeave = () => {
      lastCellRef.current = null;
    };

    const onScroll = () => {
      for (const [key, cell] of cellsRef.current) {
        const [col, row] = key.split(",").map(Number);
        cell.vx = col * CELL - window.scrollX;
        cell.vy = row * CELL - window.scrollY;
      }
      lastCellRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    cancelAnimationFrame(rafRef.current);

    const render = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const [key, cell] of cellsRef.current) {
        const elapsed = now - cell.enteredAt;
        const alpha = Math.max(0, 1 - elapsed / FADE_DURATION);

        if (alpha <= 0) {
          cellsRef.current.delete(key);
          continue;
        }

        const x = cell.vx;
        const y = cell.vy;

        ctx.fillStyle = `rgba(255, 222, 89, ${alpha * 0.18})`;
        ctx.fillRect(x + 1, y + 1, CELL - 1, CELL - 1);

        ctx.strokeStyle = `rgba(255, 222, 89, ${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}