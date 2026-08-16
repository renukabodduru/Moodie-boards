import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { Star, Settings } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setViewMode } = useBoard();

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans text-slate-900 bg-[#C8B8A6]">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#A8988C] via-[#D1C2B5] to-[#B6A699] opacity-80" />
      
      {/* Glowing Ambient Line */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg 
          viewBox="0 0 1440 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="absolute min-w-[150vw] min-h-[150vh] opacity-70 blur-[2px]"
          preserveAspectRatio="xMidYMid slice"
        >
          <path 
            d="M -200 400 Q 500 700 1200 100 T 2000 -100" 
            stroke="url(#glowGradient)" 
            strokeWidth="30" 
            strokeLinecap="round" 
            style={{ filter: 'drop-shadow(0px 0px 40px rgba(255,255,255,0.8)) drop-shadow(0px 0px 80px rgba(255,255,255,0.6))' }}
          />
          <path 
            d="M -200 400 Q 500 700 1200 100 T 2000 -100" 
            stroke="#ffffff" 
            strokeWidth="10" 
            strokeLinecap="round" 
            style={{ filter: 'drop-shadow(0px 0px 10px rgba(255,255,255,1))' }}
          />
          <defs>
            <linearGradient id="glowGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded-md shadow-sm" />
          <span className="text-white font-medium text-xl tracking-tight">Logopany</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-white/90 hover:text-white text-sm font-medium transition-colors">About</a>
          <a href="#" className="text-white/90 hover:text-white text-sm font-medium transition-colors">Services</a>
          <a href="#" className="text-white/90 hover:text-white text-sm font-medium transition-colors">Contact</a>
          <button 
            onClick={() => setViewMode('dashboard')}
            className="px-5 py-2 rounded-full border border-white/50 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Signin
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 -mt-20">
        <div className="px-4 py-1.5 rounded-full border border-white/30 text-white/90 text-[11px] uppercase tracking-[0.2em] font-semibold mb-6 backdrop-blur-sm">
          DISCOVER
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
          Start your journey
        </h1>
        
        <p className="max-w-2xl text-white/90 text-lg md:text-xl font-light leading-relaxed mb-10 drop-shadow-sm">
          Quisque at tortor dignissim, suscipit sem in, iaculis purus.
          <br className="hidden sm:block" />
          Fusce pharetra velit at velit dictum tincidunt.
        </p>

        <button 
          onClick={() => setViewMode('dashboard')}
          className="px-8 py-3.5 bg-white text-[#9c897a] rounded-full font-bold text-base shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:scale-105 transition-all active:scale-95"
        >
          Get Started
        </button>
      </main>

      {/* Bottom Cards */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-[#f2ece6]/95 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-left">
          <div className="flex gap-1 mb-4 text-[#8a7b6c]">
            {[1, 2, 3, 4].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
            <div className="relative">
              <Star className="w-5 h-5 text-[#8a7b6c]" />
              <div className="absolute inset-0 overflow-hidden w-[80%]">
                <Star className="w-5 h-5 fill-current text-[#8a7b6c]" />
              </div>
            </div>
            <span className="ml-2 font-semibold text-lg text-[#6d6155]">4.8</span>
          </div>
          <p className="text-[#6d6155] font-medium leading-relaxed mb-4 text-[15px]">
            Aenean consequat saipien ut arcu malesuada interdum.
          </p>
          <p className="text-[#968777] text-xs font-bold uppercase tracking-wider">
            Anonymous
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#f2ece6]/95 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#bda997] text-white rounded-full">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#6d6155]">Feature headline</h3>
          </div>
          <p className="text-[#6d6155] font-medium leading-relaxed text-[15px]">
            Mauris sodales magna ut erat volutpat, quis gravida ligula.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#f2ece6]/95 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-left">
          <h2 className="text-5xl font-black text-[#6d6155] mb-4 tracking-tighter">87%</h2>
          <p className="text-[#6d6155] font-medium leading-relaxed text-[15px]">
            Vestibulum posuere felis id orci ultrices, ac viverra magna efficitur.
          </p>
        </div>

      </div>
    </div>
  );
};
