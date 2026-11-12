import React, { useEffect, useRef, useState } from 'react';
import { RadarPoint } from '../../types';

interface RadarVisualizerProps {
  points: RadarPoint[];
  onSelectPoint?: (point: RadarPoint) => void;
  className?: string;
}

export const RadarVisualizer: React.FC<RadarVisualizerProps> = ({
  points,
  onSelectPoint,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<RadarPoint | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let sweepAngle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) - 25;

      ctx.clearRect(0, 0, width, height);

      // 1. Concentric Range Circles
      const rings = [0.35, 0.65, 0.95];
      rings.forEach((rRatio) => {
        const r = maxRadius * rRatio;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(57, 123, 255, 0.22)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 2. Crosshair Grid Lines
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.strokeStyle = 'rgba(39, 216, 242, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. Sweeping Radar Beam (Sector)
      sweepAngle = (sweepAngle + 0.02) % (Math.PI * 2);
      const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, maxRadius);
      gradient.addColorStop(0, 'rgba(39, 216, 242, 0.45)');
      gradient.addColorStop(1, 'rgba(39, 216, 242, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, sweepAngle, sweepAngle + 0.35, false);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Leading beam ray
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + maxRadius * Math.cos(sweepAngle + 0.35),
        centerY + maxRadius * Math.sin(sweepAngle + 0.35)
      );
      ctx.strokeStyle = '#27D8F2';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 4. Render Trend Points
      points.forEach((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const dist = (p.distance / 100) * maxRadius;
        const px = centerX + dist * Math.cos(rad);
        const py = centerY + dist * Math.sin(rad);

        // Blip color based on status
        let blipColor = '#397BFF';
        if (p.status === 'rising') blipColor = '#27D8F2';
        if (p.status === 'falling') blipColor = '#F43F5E';

        // Outer pulsing aura
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fillStyle = blipColor + '33';
        ctx.fill();

        // Core blip
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = blipColor;
        ctx.shadowColor = blipColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label for rising trends
        if (p.status === 'rising') {
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#94A3B8';
          ctx.fillText(p.name.length > 18 ? p.name.substring(0, 16) + '..' : p.name, px + 9, py + 3);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [points]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 25;

    let found: RadarPoint | null = null;
    for (const p of points) {
      const rad = (p.angle * Math.PI) / 180;
      const dist = (p.distance / 100) * maxRadius;
      const px = centerX + dist * Math.cos(rad);
      const py = centerY + dist * Math.sin(rad);
      const d = Math.hypot(x - px, y - py);
      if (d < 12) {
        found = p;
        break;
      }
    }
    setHoveredPoint(found);
  };

  const handleClick = () => {
    if (hoveredPoint && onSelectPoint) {
      onSelectPoint(hoveredPoint);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={560}
        height={560}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="w-full max-w-[560px] aspect-square cursor-crosshair drop-shadow-2xl"
      />

      {/* Floating Tooltip */}
      {hoveredPoint && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-xl glass-panel border border-cyan-400/50 shadow-2xl backdrop-blur-md"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                hoveredPoint.status === 'rising' ? 'bg-cyan-400' : 'bg-rose-400'
              }`}
            />
            {hoveredPoint.name}
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5">{hoveredPoint.category}</div>
          <div className="text-[11px] font-mono flex items-center gap-2 mt-1">
            <span className="text-emerald-400 font-semibold">
              {hoveredPoint.growth_rate > 0 ? `+${hoveredPoint.growth_rate}%` : `${hoveredPoint.growth_rate}%`}
            </span>
            <span className="text-slate-400">Vol: {hoveredPoint.volume.toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-cyan-300 mt-1 font-mono">Click to inspect signal details →</div>
        </div>
      )}

      {/* Radar Ring Range Legend */}
      <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          Rising Momentum
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Stable Signals
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Declining Interest
        </span>
      </div>
    </div>
  );
};

