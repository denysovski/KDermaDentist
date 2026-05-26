import { motion } from 'motion/react';
import { Cpu, Scan, LayoutPanelLeft, Zap, ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

const technologies = [
  {
    title: "3D Intraorální Scanner",
    description: "Zapomeňte na nepříjemné otisky. Naše digitální skenování je rychlé, přesné a naprosto bezbolestné.",
    icon: Scan
  },
  {
    title: "AI Diagnostika",
    description: "Využíváme pokročilý software pro analýzu růstu čelistí a predikci pohybu zubů v čase.",
    icon: Cpu
  },
  {
    title: "Moderní Rozšiřování",
    description: "Techniky MARPE a digitálně navržené aparáty pro efektivní a šetrné rozšiřování čelistí.",
    icon: LayoutPanelLeft
  },
  {
    title: "Neviditelná Rovnátka",
    description: "Špičkové fóliové sysyémy s nejnovějšími materiály pro maximální estetiku i komfort.",
    icon: Zap
  }
];

export default function ModernEquipment() {
  const isMobile = useIsMobile();

  const containerAnim = isMobile
    ? { initial: { opacity: 1, x: 0 }, whileInView: { opacity: 1, x: 0 } }
    : { initial: { opacity: 0, x: -15 }, whileInView: { opacity: 1, x: 0 } };

  const rightColumnAnim = isMobile
    ? { initial: { opacity: 1, scale: 1 }, whileInView: { opacity: 1, scale: 1 } }
    : { initial: { opacity: 0, scale: 0.98 }, whileInView: { opacity: 1, scale: 1 } };

  return (
    <section className="py-32 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            {...containerAnim}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-start gap-1.5 mb-6">
              <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">
                Inovace & Technologie
              </span>
              <div className="h-0.5 w-12 bg-brand-blue" />
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-medium leading-tight text-[#0F172A] mb-8">
              Léčíme budoucnost, <br />
              <span className="text-brand-blue">dnes.</span>
            </h2>
            <p className="text-lg text-slate-500 mb-12 leading-relaxed">
              Neustále investujeme do nejnovějšího vybavení a softwaru, abychom Vám mohli nabídnout tu nejvyšší úroveň ortodontické péče dostupnou na světovém trhu.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {technologies.map((tech, i) => {
                const cardAnim = isMobile
                  ? { initial: false, animate: false, whileInView: false }
                  : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, transition: { delay: i * 0.08 } };

                return (
                  <motion.div
                    key={tech.title}
                    {...cardAnim}
                    viewport={{ once: true }}
                    style={isMobile ? undefined : { opacity: 0 }}
                  >
                    <a
                      href="#kontakt"
                      className="p-6 rounded-[2rem] bg-brand-blue hover:bg-blue-600 shadow-xl shadow-blue-500/10 flex flex-col justify-between min-h-[160px] group border border-blue-400/20 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 block cursor-pointer h-full"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <div>
                        <h3 className="font-display font-bold text-white text-lg leading-tight mb-2">
                          {tech.title}
                        </h3>
                        <p className="text-xs text-blue-50/90 font-medium leading-relaxed">
                          {tech.description}
                        </p>
                      </div>
                      
                      {/* Keep only the bubble icon with an arrow at the bottom right */}
                      <div className="flex justify-end mt-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white group-hover:text-brand-blue flex items-center justify-center text-white transition-all duration-300">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            {...rightColumnAnim}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop" 
                alt="Špičková zubní ordinace v Telči – K-Derma čelistní ortodontie" 
                className="w-full h-full object-cover"
              />
              
              {/* Floating bubble overlay on the image with premium tooth outline SVG */}
              <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-3xl border border-white/50 shadow-xl flex items-center gap-3 max-w-[280px] pointer-events-none">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex flex-shrink-0 items-center justify-center text-brand-blue">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5"
                  >
                    <path d="M12 4C11.3 3.1 9.8 2 7.5 2 4.5 2 3 4.5 3 7.5c0 3 1.5 5.5 3 6.5.8.5 1.5 1.5 1.5 3 0 1.5-.5 3.5-.5 4.5 0 .5.5 1.5 1.5 1.5 1.2 0 1.8-.8 2.5-1.5.5-.5 1-1 1-1s1 .5 1.5 1c.7.7 1.3 1.5 2.5 1.5 1 0 1.5-1 1.5-1.5 0-1-.5-3-.5-4.5 0-1.5.7-2.5 1.5-3 1.5-1 3-3.5 3-6.5C21 4.5 19.5 2 16.5 2 14.2 2 12.7 3.1 12 4z" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-snug">
                  Naše nová ordinace vybavená moderním vybavením
                </p>
              </div>
            </div>
            
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full border-12 border-[#F8FAFC] shadow-2xl flex flex-col items-center justify-center text-center p-4 z-20 overflow-visible">
              {/* Animated glowing blue ring going around the border of the bubble with smooth fade-in / fade-out */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible -rotate-90" viewBox="0 0 160 160">
                <circle 
                  cx="80" 
                  cy="80" 
                  r="74" 
                  fill="none" 
                  stroke="#3B82F6" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  className="animate-draw-ring"
                />
              </svg>
              <div className="text-2xl font-display font-medium text-brand-blue relative z-10">20 Minut</div>
              <div className="text-[11px] font-sans text-slate-500 font-normal leading-tight mt-1 relative z-10">délka prohlídky</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
