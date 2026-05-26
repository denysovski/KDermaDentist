import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';

export default function Hero() {
  const [satisfaction, setSatisfaction] = useState(0);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 180]);
  const yContent = useTransform(scrollY, [0, 800], [0, -120]);
  const opacityContent = useTransform(scrollY, [0, 600], [1, 0.1]);

  useEffect(() => {
    let start = 0;
    const end = 99;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    let animationFrame: number;
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * end);
      
      setSatisfaction(currentVal);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setSatisfaction(end);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="relative min-h-[110vh] pt-32 pb-4 overflow-hidden flex items-center">
      {/* Background with overlay and zoom-out entrance animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          style={{ y: yBg, opacity: 0 }}
          src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=2070&auto=format&fit=crop" 
          alt="Moderní zubní ordinace čelistní ortodontie Telč - K-Derma" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-950/30" />
        <div className="absolute inset-0 bg-linear-to-t from-blue-950 via-blue-950/60 to-transparent" />
      </div>

      <motion.div 
        style={{ y: yContent, opacity: opacityContent }}
        className="container mx-auto px-6 relative z-10 w-full"
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-end pt-32 lg:pt-0">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              style={{ opacity: 0 }}
              className="flex items-center gap-4 mb-10"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 124}`} 
                    alt="Spokojený pacient ortodontie K-Derma Telč" 
                    className="w-10 h-10 rounded-full border-2 border-white/20 shadow-xl relative"
                    style={{ zIndex: 10 - i }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-white/80">
                Důvěřuje nám <span className="text-white font-bold">přes 5 000 pacientů</span>
              </p>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 50, damping: 14 }}
              style={{ opacity: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-medium leading-[0.95] tracking-tight mb-8 text-white"
            >
              K-Derma Vám zajistí <br />
              <span className="text-white">dokonalý úsměv.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 50, damping: 14 }}
              style={{ opacity: 0 }}
              className="text-sm md:text-base text-white/80 max-w-xl mb-12 font-medium"
            >
              Jsme špičkový tým ortodontických specialistů, kteří se starají o zdraví a krásu Vašeho chrupu s využitím nejmodernějších technologií.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 50, damping: 14 }}
              style={{ opacity: 0 }}
              className="flex flex-wrap gap-4 items-center"
            >
              {/* Pulsing consultation button - periodic low opacity ripple with no scale change to keep text super crisp */}
              <motion.button 
                animate={{
                  boxShadow: [
                    "0px 0px 0px 0px rgba(255, 255, 255, 0.45)",
                    "0px 0px 0px 20px rgba(255, 255, 255, 0)",
                    "0px 0px 0px 0px rgba(255, 255, 255, 0)"
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 3.5,
                  ease: "easeInOut",
                  delay: 1
                }}
                onClick={() => document.getElementById('kontakty-mapa')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-black px-8 py-5 rounded-full font-bold flex items-center gap-2 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl cursor-pointer text-sm md:text-base relative z-10 border-0"
              >
                Nezávazná konzultace ↗
              </motion.button>
              <button 
                onClick={() => document.getElementById('postup-lecby')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent border-2 border-white text-white px-8 py-5 rounded-full font-bold hover:bg-white/10 transition-all cursor-pointer text-sm md:text-base"
              >
                Zjistit více
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex flex-row gap-4 md:gap-6 justify-start lg:justify-end items-end h-full">
            {/* Satisfaction Card with dynamic smooth count animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 15 }}
              style={{ opacity: 0 }}
              className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-blue-950/40 w-[140px] h-[140px] md:w-56 md:h-56 lg:w-64 lg:h-64 flex flex-col justify-between overflow-hidden text-left"
            >
              <div className="flex justify-between items-start">
                <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Spokojenost
                </p>
                <Star size={10} className="fill-brand-blue text-brand-blue hidden md:block" />
              </div>
              <div className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-[#0F172A]">
                {satisfaction}%
              </div>
              <p className="text-[9px] md:text-xs text-slate-500 leading-tight font-medium">
                Naši pacienti odcházejí s úsměvem.
              </p>
            </motion.div>

            {/* TOP Card where text grows smoothly onLoad */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 60, damping: 15 }}
              style={{ opacity: 0 }}
              className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-blue-950/40 w-[140px] h-[140px] md:w-56 md:h-56 lg:w-64 lg:h-64 flex flex-col justify-between overflow-hidden text-left"
            >
              <div className="flex gap-1 md:gap-2 flex-wrap">
                {['Moderní', 'Péče'].map((tag, idx) => (
                  <span 
                    key={tag} 
                    className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[6px] md:text-[8px] font-bold uppercase tracking-wider ${idx === 0 ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <motion.div 
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.9, 
                  type: "spring", 
                  stiffness: 80, 
                  damping: 11
                }}
                className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-[#0F172A] leading-none mb-1 origin-center"
              >
                TOP
              </motion.div>
              <p className="text-[9px] md:text-xs text-slate-500 font-bold leading-tight">
                Nejšpičkovější technologie pro precizní léčbu.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
