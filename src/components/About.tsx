import { motion } from 'motion/react';
import { User, ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import aboutUsImage from '../assets/images/about-us-image.png';

interface AboutProps {
  onNavigateToPostup?: () => void;
  onNavigateToTeam?: () => void;
}

export default function About({ onNavigateToPostup = () => {}, onNavigateToTeam = () => {} }: AboutProps) {
  const isMobile = useIsMobile();

  const animLeft = isMobile
    ? { initial: { opacity: 1, x: 0 }, whileInView: { opacity: 1, x: 0 } }
    : { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 } };

  const animRight = isMobile
    ? { initial: { opacity: 1, x: 0 }, whileInView: { opacity: 1, x: 0 } }
    : { initial: { opacity: 0, x: 20 }, whileInView: { opacity: 1, x: 0 } };

  return (
    <section id="o-nas" className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            {...animLeft}
            viewport={{ once: true }}
            style={{ opacity: isMobile ? 1 : 0 }}
            className="relative"
          >
            <div className="relative aspect-3/4 rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src={aboutUsImage} 
                alt="Moderní ortodontická klinika K-Derma Telč - rovnátka a čelistní ortodontie" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-[44%] bg-linear-to-t from-slate-950/90 via-slate-950/55 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col items-start gap-3">
                <div className="max-w-[72%]">
                  <h4 className="text-sm md:text-base font-extrabold uppercase tracking-wider text-white mb-2">Zkušenosti:</h4>
                  <p className="text-sm md:text-[15px] text-white/90 font-medium leading-relaxed">
                    Přes dekádu elitní praxe, moderních technologických postupů a stovek úspěšně vyléčených ortodontických vad.
                  </p>
                </div>
                <span className="inline-flex items-center justify-center rounded-r-4xl rounded-l-[0.9rem] bg-brand-blue px-4 py-3 text-white font-display font-black text-xl md:text-2xl shadow-xl border-0">
                  10+ LET
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...animRight}
            viewport={{ once: true }}
            style={{ opacity: isMobile ? 1 : 0 }}
          >
            <div className="flex flex-col items-start gap-1.5 mb-6">
              <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">
                O nás
              </span>
              <div className="h-0.5 w-12 bg-brand-blue" />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-display font-medium leading-tight text-[#0F172A] mb-8">
              Pro váš <br />
              <span className="text-brand-blue font-semibold">perfektní úsměv.</span>
            </h2>

            <div className="inline-flex items-center gap-2 bg-[#F1F5F9]/80 border border-slate-200/50 px-4 py-2 rounded-2xl mb-8">
              <User size={16} className="text-brand-blue stroke-[2.5]" />
              <span className="text-[#0F172A] font-medium text-sm">Jsme tu pro Vás</span>
            </div>
            
            <div className="space-y-4 text-base md:text-lg text-slate-500 mb-10 leading-relaxed">
              <p>
                K-DERMA je moderní ortodontická klinika v Telči. Spojujeme špičkovou digitalizovanou 3D čelistní technologii s individuálním přístupem pro Váš maximální komfort a bezchybný výsledek.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2">
              <button 
                onClick={onNavigateToPostup}
                className="col-span-1 sm:col-span-3 group relative overflow-hidden bg-brand-blue hover:bg-[#2563EB] text-white p-6 rounded-[1.8rem] shadow-xl shadow-brand-blue/10 transition-all duration-300 flex flex-col justify-between text-left cursor-pointer border-0"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm0 8H7v-2h10v2z"/>
                  </svg>
                </div>
                <span className="text-white/80 text-xs uppercase font-extrabold tracking-widest mb-4 block">Detailní průvodce</span>
                <div className="flex items-end justify-between w-full">
                  <div>
                    <h4 className="text-2xl font-display font-semibold mb-2 group-hover:translate-x-1 transition-transform duration-300">Postup léčby</h4>
                    <p className="text-white/80 text-xs leading-relaxed max-w-55 md:max-w-60">
                      Projděte si krok za krokem celou cestu k vašemu vysněnému úsměvu.
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-white/20 group-hover:translate-x-1.5 transition-all duration-300 shrink-0">
                    <ArrowRight size={20} className="text-white" />
                  </div>
                </div>
              </button>

              <button 
                onClick={onNavigateToTeam}
                className="col-span-1 sm:col-span-2 group relative overflow-hidden bg-[#F8FAFC]/95 hover:bg-slate-50 border border-slate-200/60 p-6 rounded-[1.8rem] transition-all duration-300 flex flex-col justify-between text-left cursor-pointer shadow-sm shadow-slate-100/35"
              >
                <span className="text-[#0F172A]/50 text-xs uppercase font-extrabold tracking-widest mb-4 block">Kdo o vás pečuje</span>
                <div className="flex items-end justify-between w-full">
                  <div>
                    <h4 className="text-xl font-display font-semibold text-[#0F172A] mb-2 group-hover:translate-x-1 transition-transform duration-300">Náš tým</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Poznejte naše špičkové certifikované lékaře.
                    </p>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 group-hover:translate-x-1.5 shrink-0">
                    <ArrowRight size={18} className="text-slate-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
