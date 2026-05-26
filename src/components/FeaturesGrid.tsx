import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity, Sparkles, MapPin } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

function AnimatedCounter({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isIntersecting = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isIntersecting.current) {
            isIntersecting.current = true;
            const start = 0;
            const end = value;
            const duration = 1800; // 1.8 seconds format
            const startTime = performance.now();

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
              const currentVal = easeProgress * end;
              setCount(currentVal);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="inline-block">
      {count.toLocaleString('cs-CZ', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export default function FeaturesGrid() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);

  const titleAnim = isMobile
    ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 } };

  const getCardAnim = (delay = 0) => isMobile
    ? { initial: { opacity: 1, scale: 1, y: 0 }, whileInView: { opacity: 1, scale: 1, y: 0 } }
    : { initial: { opacity: 0, scale: 0.98, y: 10 }, whileInView: { opacity: 1, scale: 1, y: 0 }, transition: { delay } };

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            {...titleAnim}
            viewport={{ once: true }}
            style={{ opacity: isMobile ? 1 : 0 }}
            className="text-5xl md:text-7xl font-display font-medium tracking-tight max-w-4xl mx-auto text-[#0F172A]"
          >
            Aktuální statistiky <br />
            <span className="text-brand-blue">naší kliniky.</span>
          </motion.h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:grid-rows-2">
            {/* 1. Main Stats Card Skeleton */}
            <div className="bento-card col-span-1 md:col-span-2 row-span-1 animate-pulse bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-10">
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100" />
                    <div className="h-6 w-36 bg-slate-100 rounded-lg" />
                  </div>
                  <div className="h-4 w-8 bg-slate-100 rounded-md" />
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-slate-100 rounded-sm" />
                      <div className="h-10 w-24 bg-slate-100 rounded-md" />
                    </div>
                    <div className="space-y-2 flex flex-col items-end">
                      <div className="h-3 w-24 bg-slate-100 rounded-sm" />
                      <div className="h-10 w-24 bg-slate-100 rounded-md" />
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full" />
                </div>
              </div>
            </div>

            {/* 2. Success Rate Card Skeleton */}
            <div className="bento-card col-span-1 animate-pulse bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="h-6 w-28 bg-slate-100 rounded-lg" />
                  <div className="h-8 w-14 bg-slate-100 rounded-md" />
                </div>
                <div className="h-3.5 w-40 bg-slate-100 rounded-md mb-8" />
                <div className="h-12 w-20 bg-slate-100 rounded-lg mb-8" />
              </div>
              <div className="flex gap-1 items-end h-16">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                  <div key={i} className="flex-1 rounded-sm bg-slate-100" style={{ height: `${20 + (i % 4) * 20}%` }} />
                ))}
              </div>
            </div>

            {/* 3. Commitment Card Skeleton */}
            <div className="col-span-1 row-span-1 lg:row-span-2 bg-gradient-to-br from-blue-50/50 to-blue-100/30 border border-blue-500/5 col-span-1 animate-pulse p-10 rounded-[2.5rem] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100/50 mb-6" />
                <div className="h-8 w-11/12 bg-blue-100/50 rounded-lg mb-4" />
                <div className="h-8 w-9/12 bg-blue-100/50 rounded-lg mb-4" />
                <div className="h-4 w-full bg-blue-100/50 rounded-md mb-3" />
                <div className="h-4 w-10/12 bg-blue-100/50 rounded-md mb-10" />
                <div className="h-10 w-28 bg-blue-100/70 rounded-full" />
              </div>
              <div className="mt-8 pt-6 border-t border-blue-100/50 space-y-2">
                <div className="h-3.5 w-full bg-blue-100/40 rounded" />
                <div className="h-3.5 w-11/12 bg-blue-100/40 rounded" />
              </div>
            </div>

            {/* 4. Visitors Stats Skeleton */}
            <div className="bento-card col-span-1 md:col-span-2 animate-pulse bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div className="h-6 w-36 bg-slate-100 rounded-lg" />
                  <div className="h-6 w-24 bg-slate-100 rounded-full" />
                </div>
                <div className="h-24 w-full bg-slate-100/30 rounded-2xl mb-8 flex items-center justify-center">
                  <div className="w-11/12 h-1 bg-slate-200/30 rounded" />
                </div>
              </div>
              <div className="flex items-end justify-between pt-4 border-t border-slate-50">
                <div>
                  <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white" />
                    ))}
                  </div>
                </div>
                <div className="h-6 w-44 bg-slate-100 rounded-lg" />
              </div>
            </div>

            {/* 5. Find Doctors Card Skeleton */}
            <div className="bento-card col-span-1 animate-pulse bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="h-6 w-28 bg-slate-100 rounded-lg" />
                  <div className="h-4 w-6 bg-slate-100 rounded" />
                </div>
                <div className="h-3 w-40 bg-slate-100 rounded mb-8" />
                <div className="h-28 w-full bg-slate-100/30 rounded-full flex items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-slate-100" />
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <div className="h-8 w-24 bg-slate-100 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:grid-rows-2">
            {/* Main Stats Card */}
            <motion.div 
              {...getCardAnim(0)}
              viewport={{ once: true }}
              style={{ opacity: isMobile ? 1 : 0 }}
              className="bento-card col-span-1 md:col-span-2 row-span-1"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <Activity size={20} className="text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#0F172A]">Provedené zákroky</h3>
                </div>
                <div className="text-slate-300">•••</div>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1 tracking-widest">Plánované</p>
                    <div className="text-4xl font-display font-bold text-[#0F172A]"><AnimatedCounter value={3840} /> <span className="text-sm text-slate-300 font-normal whitespace-nowrap">/ rok</span></div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1 tracking-widest">Denní návštěvy</p>
                    <div className="text-4xl font-display font-medium text-[#0F172A]"><AnimatedCounter value={180} /> <span className="text-sm text-blue-600 font-normal whitespace-nowrap">↗ 5%</span></div>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    viewport={{ once: true }}
                    className="h-full bg-brand-blue" 
                  />
                </div>
              </div>
            </motion.div>

            {/* Success Rate Study Card */}
            <motion.div 
              {...getCardAnim(0.08)}
              viewport={{ once: true }}
              style={{ opacity: isMobile ? 1 : 0 }}
              className="bento-card col-span-1"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-display font-bold text-[#0F172A]">Úspěšnost léčby</h3>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest text-right">Studie <br /> 2025</span>
              </div>
              <p className="text-xs text-slate-400 mb-8 font-medium">Spokojenost pacientů po fixní léčbě</p>
              
              <div className="text-5xl font-display font-medium text-brand-blue mb-8"><AnimatedCounter value={97} suffix="%" /></div>
              
              <div className="flex gap-1 items-end h-16">
                {[0.4, 0.6, 0.8, 0.3, 0.5, 0.9, 0.7, 1.0, 0.8, 0.6, 0.4, 0.2].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex-1 rounded-sm ${i < 8 ? 'bg-brand-blue' : 'bg-slate-100'}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Commitment Card */}
            <motion.div 
              {...getCardAnim(0.16)}
              viewport={{ once: true }}
              style={{ opacity: isMobile ? 1 : 0 }}
              className="col-span-1 row-span-1 lg:row-span-2 bg-brand-blue rounded-[2.5rem] p-10 relative flex flex-col justify-between group overflow-hidden shadow-2xl shadow-blue-500/20"
            >
              <div className="absolute top-0 right-0 p-10 text-4xl font-display font-bold text-white opacity-20">01</div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-display font-bold text-white leading-tight mb-4">
                  Péče o Váš úsměv bez hranic
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-10">
                  Pravidelná kontrola a moderní technologie jsou klíčem k Vašemu sebevědomí.
                </p>
                <button 
                  onClick={() => document.getElementById('kontakty-mapa')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-brand-blue px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform cursor-pointer border-0"
                >
                  Začít léčbu
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20 text-xs text-white/85 leading-relaxed font-sans">
                Dopřejte svému chrupu pravidelnou péči, která pomáhá předcházet větším problémům i zbytečným nákladům v budoucnu. Objednejte se ještě dnes. 20 minut, které mají smysl pro vaše zdraví.
              </div>
            </motion.div>

            {/* Visitors Stats */}
            <motion.div 
              {...getCardAnim(0.24)}
              viewport={{ once: true }}
              style={{ opacity: isMobile ? 1 : 0 }}
              className="bento-card col-span-1 md:col-span-2"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-display font-bold text-[#0F172A]">Měsíční návštěvnost</h3>
                <div className="text-xs text-slate-400 border border-slate-200 rounded-full px-3 py-1 bg-slate-50 font-bold uppercase tracking-widest">Červen 2024</div>
              </div>
              
              <div className="relative h-24 w-full mb-8">
                <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d="M0,80 Q50,90 100,50 T200,20 T300,60 T400,10" 
                    fill="none" 
                    stroke="url(#grad)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                  <motion.circle 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 }}
                    cx="200" cy="20" r="6" fill="#3B82F6" />
                </svg>
                <div className="absolute top-0 left-[50%] translate-x-[-50%] -translate-y-full mb-2 bg-brand-blue text-white px-2 py-1 rounded text-[10px] font-bold shadow-lg">482</div>
              </div>
              
              <div className="flex items-end justify-between pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-2 tracking-widest font-sans">Tým specialistů</p>
                  <div className="flex -space-x-3">
                    {[
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=DrHana&mouth=smile&clothing=collarAndSweater&clothingColor=ffffff&backgroundColor=badefc",
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=DrKarel&mouth=smile&clothing=overall&clothingColor=ffffff&backgroundColor=d1e7dd",
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=DrEva&mouth=smile&clothing=shirtVNeck&clothingColor=ffffff&backgroundColor=f8d7da"
                    ].map((url, i) => (
                       <img 
                         key={i} 
                         src={url} 
                         className="w-10 h-10 rounded-full border-2 border-white shadow-sm relative" 
                         style={{ zIndex: 10 - i }}
                         alt="Člen ortodontického týmu specialistů K-Derma Telč" 
                       />
                    ))}
                  </div>
                </div>
                <div className="text-right pb-1">
                  <p className="font-display font-semibold text-brand-blue text-[#3B82F6] text-base md:text-lg leading-none">
                    Váš úsměv v dobrých rukou.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Find Best Doctors Card */}
            <motion.div 
              {...getCardAnim(0.32)}
              viewport={{ once: true }}
              style={{ opacity: isMobile ? 1 : 0 }}
              className="bento-card col-span-1"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display font-bold text-[#0F172A]">Naši specialisté</h3>
                <span className="text-slate-300">•••</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-8 uppercase font-bold tracking-widest font-sans">Všichni lékaři jsou atestováni v ČR</p>
              
              <div className="relative h-32 flex items-center justify-center">
                <div className="absolute inset-0 border border-slate-100 rounded-full" />
                <div className="absolute inset-4 border border-slate-100 rounded-full" />
                <div className="relative z-10 w-12 h-12 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-lg">
                    <MapPin size={22} className="text-brand-blue" />
                </div>
                
                {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                  const docAvatars = [
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=DrHana&mouth=smile&clothing=collarAndSweater&clothingColor=ffffff&backgroundColor=badefc",
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=DrKarel&mouth=smile&clothing=overall&clothingColor=ffffff&backgroundColor=d1e7dd",
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=DrEva&mouth=smile&clothing=shirtVNeck&clothingColor=ffffff&backgroundColor=f8d7da",
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=DrJan&mouth=smile&clothing=overall&clothingColor=ffffff&backgroundColor=fff3cd",
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=DrLucie&mouth=smile&clothing=collarAndSweater&clothingColor=ffffff&backgroundColor=cff4fc",
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=DrTomas&mouth=smile&clothing=shirtVNeck&clothingColor=ffffff&backgroundColor=e2e3e5"
                  ];
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      style={{ 
                        transform: `rotate(${deg}deg) translateY(-54px)`,
                        zIndex: 20 - i,
                        opacity: 0
                      }}
                      className="absolute"
                    >
                      <img 
                        src={docAvatars[i]} 
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md relative" 
                        alt="Atestovaný zubní lékař ortodontista - K-Derma Telč"
                        style={{ transform: `rotate(-${deg}deg)` }}
                      />
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => {
                    document.getElementById('tym')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[10px] font-bold text-brand-blue uppercase tracking-widest border border-blue-100 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors cursor-pointer bg-transparent"
                >
                  Více o nás
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
