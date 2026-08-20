import React, { useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
  type: 'ember' | 'steam' | 'gold' | 'spark' | 'herb';
}

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentView, selectedCategoryId, categories } = useStore();

  // Determine current atmospheric theme
  const activeCategory = selectedCategoryId ? categories.find((c) => c.id === selectedCategoryId) : null;
  const theme = activeCategory?.atmosphereTheme || (
    currentView === 'best' ? 'best' :
    currentView === 'favorites' ? 'favorites' :
    currentView === 'categories' ? 'categories' : 'home'
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const maxParticles = window.innerWidth < 768 ? 28 : 55;

    const createParticle = (spawnType?: string): Particle => {
      const isEmber = theme === 'grill' || theme === 'home' || spawnType === 'ember';
      const isSteam = theme === 'meals' || theme === 'settlements' || spawnType === 'steam';
      const isGold = theme === 'best' || theme === 'platters' || spawnType === 'gold';
      const isHerb = theme === 'mixes' || theme === 'additions';

      let color = 'rgba(245, 158, 11, ';
      let type: Particle['type'] = 'gold';

      if (isEmber) {
        const colors = [
          'rgba(239, 68, 68, ', // Red
          'rgba(249, 115, 22, ', // Orange
          'rgba(245, 158, 11, ', // Amber
          'rgba(252, 211, 77, ', // Yellow
        ];
        color = colors[Math.floor(Math.random() * colors.length)];
        type = 'ember';
      } else if (isSteam) {
        color = 'rgba(214, 211, 209, ';
        type = 'steam';
      } else if (isGold) {
        color = 'rgba(251, 191, 36, ';
        type = 'gold';
      } else if (isHerb) {
        color = 'rgba(52, 211, 153, ';
        type = 'herb';
      } else if (theme === 'favorites') {
        color = 'rgba(244, 63, 94, ';
        type = 'spark';
      }

      return {
        x: Math.random() * width,
        y: isEmber || isSteam ? height + Math.random() * 40 : Math.random() * height,
        vx: (Math.random() - 0.5) * (theme === 'sandwiches' ? 1.4 : 0.6),
        vy: isEmber ? -(Math.random() * 1.5 + 0.5) : isSteam ? -(Math.random() * 0.8 + 0.3) : -(Math.random() * 0.4 + 0.1),
        size: isSteam ? Math.random() * 12 + 6 : isEmber ? Math.random() * 3 + 1.2 : Math.random() * 2.5 + 1,
        color,
        alpha: 0,
        maxLife: Math.random() * 180 + 120,
        life: 0,
        type,
      };
    };

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife; // Stagger ages
      p.y = Math.random() * height;
      particles.push(p);
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient gradient spotlight based on theme
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        10,
        width * 0.5,
        height * 0.25,
        Math.max(width, height) * 0.7
      );

      if (theme === 'grill') {
        grad.addColorStop(0, 'rgba(185, 28, 28, 0.08)');
        grad.addColorStop(0.5, 'rgba(120, 53, 15, 0.04)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else if (theme === 'best') {
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
        grad.addColorStop(0.5, 'rgba(180, 83, 9, 0.05)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else if (theme === 'favorites') {
        grad.addColorStop(0, 'rgba(225, 29, 72, 0.08)');
        grad.addColorStop(0.5, 'rgba(136, 19, 55, 0.04)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        grad.addColorStop(0, 'rgba(217, 119, 6, 0.07)');
        grad.addColorStop(0.6, 'rgba(69, 26, 3, 0.03)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.03) * 0.3;
        p.y += p.vy;

        // Calculate fade-in and fade-out alpha
        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.alpha = progress / 0.2;
        } else if (progress > 0.8) {
          p.alpha = (1 - progress) / 0.2;
        } else {
          p.alpha = 1;
        }

        // Modulate alpha based on particle type
        const renderAlpha = p.type === 'steam' ? p.alpha * 0.15 : p.alpha * 0.65;

        ctx.beginPath();
        if (p.type === 'steam') {
          ctx.arc(p.x, p.y, p.size * (1 + progress * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${renderAlpha})`;
          ctx.fill();
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${renderAlpha})`;
          ctx.shadowBlur = p.type === 'ember' ? 8 : 4;
          ctx.shadowColor = p.color.replace('(', 'a(') + '0.8)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Reset dead particle
        if (p.life >= p.maxLife || p.y < -30 || p.x < -30 || p.x > width + 30) {
          particles[i] = createParticle();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" id="ambient-atmosphere-layer">
      {/* Dynamic Background Canvas for living particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Atmospheric continuous light sweep beams */}
      <div className="absolute -inset-[100%] opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent animate-pulse-glow" />

      {/* Theme-specific visual accent overlay */}
      {theme === 'grill' && (
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/15 via-transparent to-stone-950/80 pointer-events-none" />
      )}
      {theme === 'best' && (
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/20 via-transparent to-amber-950/10 pointer-events-none" />
      )}
      {theme === 'favorites' && (
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/15 via-transparent to-stone-950/70 pointer-events-none" />
      )}
    </div>
  );
};
