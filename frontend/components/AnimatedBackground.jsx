'use client';

export default function AnimatedBackground() {
  const bubbles = [
    { size: 450, x: 15, y: 15, delay: 0, duration: 12, color: "rgba(99, 102, 241, 0.4)" },   
    { size: 350, x: 75, y: 25, delay: -5, duration: 17, color: "rgba(217, 70, 239, 0.4)" },  
    { size: 300, x: 50, y: 55, delay: -2, duration: 9, color: "rgba(59, 130, 246, 0.4)" },  
    { size: 250, x: 25, y: 75, delay: -10, duration: 15, color: "rgba(6, 182, 212, 0.4)" },  
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
      <style>{`
        @keyframes floatMetaserv {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .meta-bubble {
          filter: blur(40px);
          animation: floatMetaserv var(--duration) ease-in-out var(--delay) infinite;
        }
      `}</style>
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {bubbles.map((b, i) => (
          <circle
            key={i}
            r={b.size / 2}
            cx={`${b.x}%`}
            cy={`${b.y}%`}
            fill={b.color}
            className="meta-bubble"
            style={{
              // @ts-ignore
              '--duration': `${b.duration}s`,
              '--delay': `${b.delay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}