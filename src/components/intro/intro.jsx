import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const particles = useRef([]);

  const config = {
    particleCount: 150,
    particleSize: 2,
    connectionDistance: 100,
    colors: ["#7695EC", "#5A7BDC", "#9AB1FF"],
    maxSpeed: 0.5,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles.current = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * config.maxSpeed,
          vy: (Math.random() - 0.5) * config.maxSpeed,
          color:
            config.colors[Math.floor(Math.random() * config.colors.length)],
          connections: [],
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p1, i) => {
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, config.particleSize, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        p1.connections = [];
        particles.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDistance) {
            p1.connections.push({
              x: p2.x,
              y: p2.y,
              opacity: 1 - distance / config.connectionDistance,
            });
          }
        });

        p1.connections.forEach(conn => {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(conn.x, conn.y);
          ctx.strokeStyle = `rgba(118, 149, 236, ${conn.opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 4500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 text-center px-4">
        <h1 className="text-7xl md:text-9xl font-extrabold mb-6">
          <span className="text-primary">CODE</span>
          <span className="text-white">LEAP</span>
        </h1>

        <div className="w-full max-w-md mx-auto h-2 bg-gray-900 rounded-full overflow-hidden mb-8">
          <div className="h-full bg-gradient-to-r from-primary to-[#9ab1ff] progress-bar-animation" />
        </div>

        <p className="text-primary font-mono tracking-widest text-lg md:text-xl">
          INITIALIZING NETWORK...
        </p>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full opacity-10 blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primaryrounded-full opacity-10 blur-[80px] animate-pulse" />
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 5px #7695ec, 0 0 10px #7695ec, 0 0 15px #7695ec;
          animation: neon-pulse 1.5s infinite alternate;
        }

        .progress-bar-animation {
          animation: progress-expand 3s ease-out forwards;
        }

        @keyframes neon-pulse {
          from {
            text-shadow: 0 0 5px #7695ec, 0 0 10px #7695ec, 0 0 15px #7695ec;
          }
          to {
            text-shadow: 0 0 10px #7695ec, 0 0 20px #7695ec, 0 0 30px #7695ec;
          }
        }

        @keyframes progress-expand {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Intro;
