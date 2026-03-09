import { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

export function usePracticeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    strokes.forEach((stroke) => {
      ctx.beginPath();
      stroke.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
    });
  }, [strokes]);

  const onPointerDown = (point: Point) => {
    setIsDrawing(true);
    setStrokes((s) => [...s, [point]]);
  };

  const onPointerMove = (point: Point) => {
    if (!isDrawing) return;
    setStrokes((s) => {
      const copy = [...s];
      copy[copy.length - 1] = [...copy[copy.length - 1], point];
      return copy;
    });
  };

  const onPointerUp = () => setIsDrawing(false);

  const undo = () => setStrokes((s) => s.slice(0, -1));
  const clear = () => setStrokes([]);

  return { canvasRef, strokes, onPointerDown, onPointerMove, onPointerUp, undo, clear };
}
