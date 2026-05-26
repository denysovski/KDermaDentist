import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

const services = [
  {
    title: "Konzultace s ortodontistou",
    description: "Při Vaší první návštěvě v naší ordinaci provedeme základní vyšetření chrupu, které spočívá v prohlídce postavení zubů a v kontrole vzájemné polohy zubních oblouků. Sdělíme Vám informace o možnostech léčby a provedeme orientační návrh ortodontické léčby."
  },
  {
    title: "Vstupní vyšetření",
    description: "Cílem je získat standardní ortodontickou dokumentaci sloužící k sestavení diagnózy a přesného plánu léčby. Spočívá v odebrání anamnézy, zhotovení scanu zubů, fotografií zubů a obličeje a zhotovení obvykle dvou RTG snímků."
  },
  {
    title: "Seznámení s plánem léčby",
    description: "Budete informováni o možnostech terapie a nejvhodnějším řešení pro Váš chrup. Bereme v úvahu limity při posunech zubů, stabilitu dosaženého výsledku a náročnost léčby pro estetické a funkční postavení všech zubů."
  },
  {
    title: "Zahájení léčby",
    description: "Vlastní léčba začíná předáním buď snímacích rovnátek, nebo nalepením rovnátek fixních. Vždy Vám vysvětlíme, jak se o aparáty správně starat. Termíny kontrol je nutné dodržovat, aby nedocházelo ke zbytečnému prodlužování léčby."
  },
  {
    title: "Retence",
    description: "Po ukončení léčby je nutné zabránit recidivě vady, tzn. tendenci zubů vracet se do původní pozice. Proto dostanete fixní retainer (pružný drát na zadní plošky) a snímací retenční rovnátka nebo dlahy dle instrukcí lékaře."
  }
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

interface ServicesProps {
  onNavigateToStep: (stepIndex: number) => void;
}

export default function Services({ onNavigateToStep }: ServicesProps) {
  const isMobile = useIsMobile();

  return (
    <section id="postup-lecby" className="py-32 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <div className="flex flex-col items-start gap-1.5 mb-6">
            <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">
              Postup léčby
            </span>
            <div className="h-0.5 w-12 bg-brand-blue" />
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight text-[#0F172A] mb-8">
            Komplexní péče o <br />
            <span className="text-brand-blue">Váš úsměv.</span>
          </h2>
          <p className="text-lg text-slate-500">
            Provedeme Vás celým procesem od první konzultace až po upevnění výsledku. Profesionálně, moderně a s úctou k Vašim potřebám.
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={isMobile ? undefined : containerVariants}
          initial={isMobile ? undefined : "hidden"}
          whileInView={isMobile ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
        >
          {services.map((service, i) => {
            return (
              <motion.div
                key={service.title}
                variants={isMobile ? undefined : cardVariants}
                style={{ opacity: isMobile ? 1 : 0 }}
                className="bento-card group h-full flex flex-col"
              >
              <div className="w-14 h-14 rounded-full bg-brand-blue flex items-center justify-center mb-8 text-white font-display font-extrabold text-xl shadow-md border-0 transition-colors duration-300 group-hover:bg-blue-600">
                {i + 1}
              </div>
              <h3 className="text-2xl font-display font-medium text-[#0F172A] mb-4 group-hover:text-brand-blue transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 leading-relaxed mb-8">
                {service.description}
              </p>
              <button 
                className="mt-auto flex items-center justify-between group/btn cursor-pointer w-full text-left bg-transparent border-0 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToStep(i);
                }}
              >
                <span className="text-sm font-bold text-slate-400 group-hover:text-brand-blue transition-colors">
                  Zjistit více informací
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-blue group-hover:rotate-[-45deg] transition-all duration-300">
                  <ArrowRight size={18} className="text-slate-400 group-hover:text-white" />
                </div>
              </button>
            </motion.div>
          );
        })}
      </motion.div>
      </div>
    </section>
  );
}
