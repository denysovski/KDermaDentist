import { motion } from 'motion/react';

const brands = ['mPohoda', 'Dentamed', 'DentalCore', 'SmileDirect'];

export default function TrustBar() {
  return (
    <div className="py-20 border-y border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="container mx-auto px-6 text-center mb-10">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-[0.2em]">Spolupracujeme s předními pojišťovnami a partnery</p>
      </div>
      
      <div className="flex overflow-hidden group">
        <div className="flex animate-scroll hover:[animation-play-state:paused] gap-12 items-center min-w-[200%]">
          {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
            <span 
              key={i} 
              className="text-2xl md:text-4xl font-display font-semibold text-slate-200 hover:text-brand-blue transition-colors whitespace-nowrap cursor-default"
            >
              • {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
