"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  ease?: number;
  color?: string;
  refresh?: boolean;
}

export const Particles: React.FC<ParticlesProps> = ({
  className,
  quantity = 50,
  ease = 50,
  color,
  refresh = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    handleResize();

    // Generate particles with stable IDs
    const particles: Particle[] = Array.from({ length: quantity }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
    }));

    // Use ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
      // Reposition particles that are outside the new bounds
      particles.forEach((particle: Particle) => {
        if (particle.x > canvas.width) particle.x = Math.random() * canvas.width;
        if (particle.y > canvas.height) particle.y = Math.random() * canvas.height;
      });
    });

    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
    }

    // Also listen to window resize as fallback
    window.addEventListener("resize", handleResize);

    const particleColor = color || (resolvedTheme === "dark" ? "#ffffff" : "#000000");

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Keep particles within canvas bounds
          if (particle.x < 0) {
            particle.x = 0;
            particle.vx *= -1;
          }
          if (particle.x > canvas.width) {
            particle.x = canvas.width;
            particle.vx *= -1;
          }
          if (particle.y < 0) {
            particle.y = 0;
            particle.vy *= -1;
          }
          if (particle.y > canvas.height) {
            particle.y = canvas.height;
            particle.vy *= -1;
          }

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.fill();
        });      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted, quantity, color, resolvedTheme, refresh]);

  if (!mounted) {
    return <div className={cn("pointer-events-none absolute inset-0", className)} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      suppressHydrationWarning
    />
  );
};