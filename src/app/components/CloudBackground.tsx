export function CloudBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient base */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #F7FFFC 0%, #EDFAF5 40%, #F0FFFE 100%)' }}
      />

      {/* Floating cloud 1 */}
      <svg
        className="absolute top-[-40px] left-[-60px] opacity-[0.12]"
        style={{ animation: 'floatCloud1 28s ease-in-out infinite', width: 320, height: 180 }}
        viewBox="0 0 320 180" fill="none"
      >
        <ellipse cx="160" cy="120" rx="140" ry="60" fill="#12B898" />
        <ellipse cx="100" cy="90" rx="80" ry="55" fill="#12B898" />
        <ellipse cx="220" cy="85" rx="75" ry="50" fill="#12B898" />
        <ellipse cx="160" cy="70" rx="65" ry="50" fill="#12B898" />
      </svg>

      {/* Floating cloud 2 */}
      <svg
        className="absolute top-[15%] right-[-80px] opacity-[0.08]"
        style={{ animation: 'floatCloud2 35s ease-in-out infinite', width: 280, height: 160 }}
        viewBox="0 0 280 160" fill="none"
      >
        <ellipse cx="140" cy="110" rx="120" ry="55" fill="#2AC59D" />
        <ellipse cx="90" cy="80" rx="70" ry="48" fill="#2AC59D" />
        <ellipse cx="190" cy="75" rx="65" ry="45" fill="#2AC59D" />
        <ellipse cx="140" cy="60" rx="55" ry="45" fill="#2AC59D" />
      </svg>

      {/* Floating cloud 3 */}
      <svg
        className="absolute bottom-[20%] left-[5%] opacity-[0.07]"
        style={{ animation: 'floatCloud3 42s ease-in-out infinite', width: 240, height: 140 }}
        viewBox="0 0 240 140" fill="none"
      >
        <ellipse cx="120" cy="95" rx="105" ry="48" fill="#70DAAA" />
        <ellipse cx="75" cy="68" rx="62" ry="44" fill="#70DAAA" />
        <ellipse cx="168" cy="65" rx="58" ry="40" fill="#70DAAA" />
        <ellipse cx="120" cy="52" rx="50" ry="40" fill="#70DAAA" />
      </svg>

      {/* Floating cloud 4 */}
      <svg
        className="absolute bottom-[5%] right-[10%] opacity-[0.09]"
        style={{ animation: 'floatCloud4 38s ease-in-out infinite', width: 200, height: 120 }}
        viewBox="0 0 200 120" fill="none"
      >
        <ellipse cx="100" cy="80" rx="88" ry="42" fill="#12B898" />
        <ellipse cx="62" cy="58" rx="52" ry="38" fill="#12B898" />
        <ellipse cx="140" cy="55" rx="48" ry="35" fill="#12B898" />
        <ellipse cx="100" cy="44" rx="42" ry="35" fill="#12B898" />
      </svg>

      {/* Small dot particles */}
      <div className="absolute top-[30%] left-[20%] w-2 h-2 rounded-full bg-[#12B898] opacity-[0.15]"
        style={{ animation: 'floatDot 6s ease-in-out infinite' }} />
      <div className="absolute top-[60%] left-[70%] w-1.5 h-1.5 rounded-full bg-[#2AC59D] opacity-[0.12]"
        style={{ animation: 'floatDot 8s ease-in-out infinite 2s' }} />
      <div className="absolute top-[45%] left-[85%] w-1 h-1 rounded-full bg-[#70DAAA] opacity-[0.15]"
        style={{ animation: 'floatDot 7s ease-in-out infinite 1s' }} />
      <div className="absolute top-[75%] left-[35%] w-2 h-2 rounded-full bg-[#12B898] opacity-[0.1]"
        style={{ animation: 'floatDot 9s ease-in-out infinite 3s' }} />

      <style>{`
        @keyframes floatCloud1 {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          33% { transform: translateY(-18px) translateX(8px) scale(1.02); }
          66% { transform: translateY(-10px) translateX(-5px) scale(0.98); }
        }
        @keyframes floatCloud2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          40% { transform: translateY(-22px) translateX(-10px); }
          70% { transform: translateY(-12px) translateX(6px); }
        }
        @keyframes floatCloud3 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-15px) translateX(12px) rotate(1deg); }
        }
        @keyframes floatCloud4 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          35% { transform: translateY(-20px) translateX(-8px); }
          65% { transform: translateY(-8px) translateX(5px); }
        }
        @keyframes floatDot {
          0%, 100% { transform: translateY(0px); opacity: 0.15; }
          50% { transform: translateY(-12px); opacity: 0.3; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(18, 184, 152, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(18, 184, 152, 0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes xiao-yun-float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .bounce-soft { animation: bounce-soft 3s ease-in-out infinite; }
        .xiao-yun-float { animation: xiao-yun-float 4s ease-in-out infinite; }
        .star-twinkle { animation: star-twinkle 2s ease-in-out infinite; }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }
        .glass-card-green {
          background: rgba(242, 254, 250, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(18, 184, 152, 0.2);
        }
        .qy-gradient {
          background: linear-gradient(135deg, #12B898, #2AC59D);
        }
        .qy-gradient-soft {
          background: linear-gradient(135deg, rgba(18,184,152,0.1), rgba(112,218,170,0.1));
        }
        .active-stage-card {
          background: linear-gradient(135deg, rgba(18,184,152,0.08), rgba(42,197,157,0.12));
          border: 1.5px solid rgba(18, 184, 152, 0.35);
        }
        .locked-stage-card {
          background: rgba(248, 250, 252, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .completed-stage-card {
          background: linear-gradient(135deg, rgba(18,184,152,0.06), rgba(112,218,170,0.08));
          border: 1.5px solid rgba(18, 184, 152, 0.25);
        }
        .xp-bar {
          background: linear-gradient(90deg, #12B898, #2AC59D, #70DAAA);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
