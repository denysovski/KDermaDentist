import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function HealthPersuasion() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);

  // useScroll to track the scroll position of the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scale the braces image from 0.75 to 1.15 smoothly on scroll down
  const scale = useTransform(scrollYProgress, [0.15, 0.7], [0.75, 1.2]);
  const circlePulseScale = useTransform(scrollYProgress, [0.05, 0.25, 0.45, 0.7, 0.9, 1], [0.96, 1.05, 0.99, 1.08, 1.01, 1.03]);
  const circlePulseOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.45, 0.7, 0.9, 1], [0.78, 1, 0.9, 1, 0.95, 1]);

  // Motion variants for staggering popup animation
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-slate-50 overflow-hidden relative border-t border-slate-100 select-none"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />

      {/* Background Watermark Section Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0">
        <span className="text-[12vw] font-display font-black text-slate-200/40 tracking-wider uppercase leading-none text-center block">
          Význam rovnátek
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Simple Header */}
        <div className="max-w-2xl mx-auto text-center mb-8 md:mb-12">
          <span className="text-brand-blue text-xs font-bold uppercase tracking-widest block mb-4">
            Prevence a Životní styl
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-[#0F172A] leading-tight">
            Pečujte o své <span className="text-brand-blue">zdraví</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
            Správně srovnané zuby pomáhají udržet hygienu jednodušší a každodenní péči přehlednější. Zároveň podporují pohodlí při skusu i dlouhodobou stabilitu úsměvu.
          </p>
        </div>

        {/* Responsive Content Container */}
        {isMobile ? (
          /* Mobile Stacked Layout */
          <div className="flex flex-col gap-8 items-center mt-6">
            {/* Central Braces Image with Scroll Zoom & Filled Blue Circle */}
            <div className="relative w-96 h-96 flex items-center justify-center my-6">
              {/* Solid filled bluebackground circle behind the braces */}
              <motion.div
                style={{ scale: circlePulseScale, opacity: circlePulseOpacity }}
                className="absolute w-[22rem] h-[22rem] rounded-full bg-blue-300/95 shadow-md pointer-events-none"
              />
              <div className="absolute w-[31rem] h-[31rem] rounded-full border border-brand-blue/10 pointer-events-none" />

              {/* Scaling Braces / Aligners Image without hover effect */}
              <motion.div 
                style={{ scale }}
                className="relative z-10 w-[22rem] h-auto flex items-center justify-center"
              >
                <img 
                  src="/rovnatka-spark-hero.png" 
                  alt="Invisible dental braces teeth aligner" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto drop-shadow-[0_15px_35px_rgba(59,130,246,0.15)] object-contain select-none pointer-events-none"
                />
              </motion.div>
            </div>

            {/* Mobile Benefit Cards */}
            <div className="flex flex-col gap-4 w-full">
              <div className="bg-white/45 backdrop-blur-lg border border-white/40 rounded-[1.8rem] p-6 shadow-xl shadow-slate-200/20 text-slate-900 font-medium text-sm leading-relaxed text-center">
                Dokonalé sladění zubů odstraňuje svalové pnutí, předchází bolestem krční páteře a přináší celkovou úlevu celému tělu.
              </div>

              <div className="bg-white/45 backdrop-blur-lg border border-white/40 rounded-[1.8rem] p-6 shadow-xl shadow-slate-200/20 text-slate-900 font-medium text-sm leading-relaxed text-center">
                Zpřesněním postavení zubů usnadníte každodenní hygienu, čímž zásadně omezíte tvorbu zubního plaku a dásňových zánětů.
              </div>
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full bg-[#0F172A] text-white px-8 py-4.5 rounded-full font-bold flex items-center justify-center gap-2.5 hover:bg-[#1E293B] cursor-pointer text-sm shadow-xl"
            >
              Začít dnes <ArrowRight size={16} />
            </button>

            <div className="w-full max-w-3xl mx-auto h-px bg-blue-200/90 mt-12" />

            <p className="text-xs md:text-sm text-slate-500 leading-relaxed text-center max-w-xl mt-4">
              Rovnátka jsou důležitým krokem k lepšímu skusu, snadnější hygieně a stabilnějšímu úsměvu. Včasná léčba často pomáhá předejít větším problémům v budoucnu.
            </p>
          </div>
        ) : (
          /* Desktop Architectured Layout */
          <div className="relative w-full max-w-5xl mx-auto h-[760px] mt-6">
            
            {/* Center Area (Background Circle & Scale-Animated Aligners) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-0">
              {/* Solid Blue Filled Circle Behind Braces with Inner Shadow styling */}
              <motion.div
                style={{ scale: circlePulseScale, opacity: circlePulseOpacity }}
                className="absolute w-[30rem] h-[30rem] rounded-full bg-blue-300/95 shadow-inner pointer-events-none"
              />
              <div className="absolute w-[38rem] h-[38rem] rounded-full border border-brand-blue/15 animate-spin-slow pointer-events-none" />
              
              {/* Scaling Braces / Aligners Image without any hover / tilt */}
              <motion.div 
                style={{ scale }}
                className="relative z-10 w-[38rem] h-auto flex items-center justify-center select-none pointer-events-none"
              >
                <img 
                  src="/rovnatka-spark-hero.png" 
                  alt="Invisible dental braces teeth aligner" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto drop-shadow-[0_25px_50px_rgba(59,130,246,0.18)] object-contain"
                />
              </motion.div>
            </div>

            {/* Top Left Card - Pop-up animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0
              }}
              style={{ opacity: 0 }}
              className="absolute left-[2vw] top-[10%] w-[330px] bg-white/45 backdrop-blur-lg border border-white/40 rounded-[2rem] p-7 shadow-xl shadow-slate-200/20 text-slate-900 font-medium text-sm leading-relaxed text-left hover:border-brand-blue/25 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all duration-300 z-10"
            >
              Dokonalé sladění zubů odstraňuje svalové pnutí, předchází bolestem krční páteře a přináší celkovou úlevu celému tělu.
            </motion.div>

            {/* Bottom Right Card - Pop-up animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.1
              }}
              style={{ opacity: 0 }}
              className="absolute right-[2vw] bottom-[10%] w-[330px] bg-white/45 backdrop-blur-lg border border-white/40 rounded-[2rem] p-7 shadow-xl shadow-slate-200/20 text-slate-900 font-medium text-sm leading-relaxed text-left hover:border-brand-blue/25 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all duration-300 z-10"
            >
              Zpřesněním postavení zubů usnadníte každodenní hygienu, čímž zásadně omezíte tvorbu zubního plaku a dásňových zánětů.
            </motion.div>

            {/* Bottom Left Button "Začít dnes" (no pulse animation) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.2
              }}
              style={{ opacity: 0 }}
              className="absolute left-[2vw] bottom-[12%] z-10"
            >
              <button
                onClick={() => {
                  document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#0F172A] text-white px-8 py-4.5 rounded-full font-bold flex items-center justify-center gap-2.5 hover:bg-[#1E293B] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200/50 cursor-pointer text-sm md:text-base border-0"
              >
                Začít dnes <ArrowRight size={16} />
              </button>
            </motion.div>

          </div>
        )}

      </div>
    </section>
  );
}
