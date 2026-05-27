import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useIsMobile } from '../hooks/useIsMobile';
import { 
  Search, 
  UserCheck, 
  BookOpen, 
  Activity, 
  Heart, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Calendar
} from 'lucide-react';

interface PostupLecbySubpageProps {
  onBack: () => void;
  initialStep: number | null;
}

const detailedSteps = [
  {
    step: "Krok 1",
    title: "Konzultace s ortodontistou",
    shortDesc: "Předběžné seznámení s možnostmi léčby a kontrola chrupu v srdci Telče.",
    duration: "20 - 30 minut",
    icon: Search,
    image: "https://images.unsplash.com/photo-1564420228450-d9a5bc8d6565?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    bgLight: "bg-blue-50/50",
    aspects: [
      "Osobní rozhovor o vašich přáních a očekáváních.",
      "Základní vizuální vyšetření dásní, zubů a jejich postavení.",
      "Identifikace hlavních ortodontických vad.",
      "Nástin orientačních možností léčby a časových obzorů."
    ],
    whyImportant: "Během první konzultace získáte jasnou představu o tom, co ortodontická léčba obnáší, jaké jsou vaše možnosti (včetně neviditelných rovnátek Foilix) a jaká cesta pro vás bude nejlepší.",
    faq: {
      q: "Budu na konzultaci potřebovat doporučení od zubního lékaře?",
      a: "Doporučení od vašeho praktického stomatologa je výhodou, ale není nutností. K léčbě v K-DERMA se můžete objednat zcela přímo a bez žádanky."
    }
  },
  {
    step: "Krok 2",
    title: "Vstupní vyšetření",
    shortDesc: "Precizní 3D skenování a zhotovení rentgenové dokumentace.",
    duration: "45 minut",
    icon: UserCheck,
    image: "https://images.unsplash.com/photo-1777443726993-8f9c8e96e46e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    bgLight: "bg-emerald-50/50",
    aspects: [
      "Digitální 3D scan chrupu bez nutnosti nepříjemných sádrových otisků.",
      "Zhotovení panoramatického OPG snímku a dálkového RTG lebky.",
      "Fotodokumentace zubních oblouků a profilu tváře.",
      "Zaznamenání kompletní osobní a zubní anamnézy."
    ],
    whyImportant: "Přesná data jsou základem úspěchu. Díky moderním 3D technologiím získáme dokonalou digitální kopii vašeho chrupu s přesností na zlomky milimetru.",
    faq: {
      q: "Je provádění rentgenu bezpečné?",
      a: "Ano. Využíváme nejnovější digitální RTG systémy, které vyzařují jen minimální dávku záření, jež je naprosto bezpečné jak pro děti, tak pro dospělé."
    }
  },
  {
    step: "Krok 3",
    title: "Seznámení s plánem léčby",
    shortDesc: "Vizualizace budoucího úsměvu a odsouhlasení rozpočtu.",
    duration: "30 minut",
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1777793636393-a0fec488f3fb?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "bg-violet-500",
    textColor: "text-violet-500",
    bgLight: "bg-violet-50/50",
    aspects: [
      "Prezentace 3D vizualizace vašeho chrupu a plánovaných pohybů zubů.",
      "Stanovení přesného počtu setů dlah nebo délky nošení fixního aparátu.",
      "Schválení finální kalkulace bez jakýchkoliv skrytých nákladů.",
      "Objasnění všech fází přesunů zubů a kontrol."
    ],
    whyImportant: "Na této schůzce uvidíte vizuální simulaci léčby, takže budete přesně vědět, jak bude váš finální úsměv vypadat ještě před zahájením nošení rovnátek.",
    faq: {
      q: "Co když se během léčby změní finanční plán?",
      a: "Cena schválená v plánu léčby je pro nás závazná a konečná. Žádné nečekané nebo skryté poplatky u nás nezažijete."
    }
  },
  {
    step: "Krok 4",
    title: "Zahájení léčby",
    shortDesc: "Nasazení vybraného ortodontického aparátu a zaškolení.",
    duration: "60  -  90 minut",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1674734198544-dc8dda539076?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "bg-brand-blue",
    textColor: "text-brand-blue",
    bgLight: "bg-blue-50/50",
    aspects: [
      "Aplikace fixního aparátu (lepení zámečků/kroužků) nebo předání prvních sad Foilix.",
      "Nácvik správného nasazování a snímání neviditelných dlah.",
      "Detailní instruktáž o správném čištění během léčby.",
      "Předání startovacího hygienického setu s pomůckami."
    ],
    whyImportant: "Den, kdy začíná vaše cesta za novým úsměvem. Vždy dbáme na maximální šetrnost lepení a podrobně vás naučíme, jak o aparáty pečovat, aby léčba probíhala bez komplikací.",
    faq: {
      q: "Budou zuby po nasazení bolet?",
      a: "Prvních mírných 3 až 5 dní po zahájení můžete pociťovat tlak nebo zvýšenou citlivost zubů na skus. To je známka toho, že zuby začínají správně pracovat. Potíže však brzy plně odezní."
    }
  },
  {
    step: "Krok 5",
    title: "Retence (Stabilizace výsledku)",
    shortDesc: "Zajištění trvalé stability vašeho nového dokonalého úsměvu.",
    duration: "20 minut",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1713207397803-3caa3f5434aa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "bg-rose-500",
    textColor: "text-rose-500",
    bgLight: "bg-rose-50/50",
    aspects: [
      "Sejmutí aparátu a šetrné očištění zubní skloviny.",
      "Nalepení tenkého estetického drátku (retaineru) na vnitřní stranu zubů.",
      "Předání nočního snímacího retenčního aparátu nebo dlahy.",
      "Sledování stability úsměvu při pravidelných kontrolách."
    ],
    whyImportant: "Po sundání rovnátek mají zuby tendenci vracet se do původních míst. Retenční dlahy a fixní retainery tomu dokonale brání a zabezpečí váš dokonalý vzhled po zbytek života.",
    faq: {
      q: "Jak dlouho musím retenční dlahy nosit?",
      a: "Délka retence je individuální, u dospělých pacientů se však pro dlouhodobou stoprocentní jistotu doporučuje fixní retainer ponechat dlouhodobě a noční dlahu nosit podle pokynů lékaře."
    }
  }
];

export default function PostupLecbySubpage({ onBack, initialStep }: PostupLecbySubpageProps) {
  const isMobile = useIsMobile();
  const [activeStep, setActiveStep] = useState<number>(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (initialStep !== null && initialStep >= 0 && initialStep < detailedSteps.length) {
      setActiveStep(initialStep);
      // Wait for page to mount and smoothly scroll
      const timer = setTimeout(() => {
        stepRefs.current[initialStep]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [initialStep]);

  const selectStepAndScroll = (idx: number) => {
    setActiveStep(idx);
    stepRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="pt-44 md:pt-52 pb-24 bg-[#F8FAFC]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Banner */}
        <div className="container mx-auto px-6 mb-16">

        <div className="max-w-3xl">
          <div className="flex flex-col items-start gap-1.5 mb-6">
            <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">
              Léčebná cesta v K-DERMA
            </span>
            <div className="h-0.5 w-12 bg-brand-blue" />
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-medium tracking-tight text-[#0F172A] mb-8">
            Kompletní <span className="text-brand-blue">postup léčby.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Abyste se cítili jistě a pohodlně, připravili jsme detailní průvodce každým krokem naší společné cesty. Od první nezávazné návštěvy v Telči až po zářivý, stabilní a zdravý úsměv.
          </p>
        </div>
      </div>

      {/* Navigace kroky / Sticky Timeline */}
      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Levá Side Navigace (Sticky na desktopu) */}
        <div className="lg:col-span-4 sticky top-36 hidden lg:block bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <h3 className="font-display font-bold text-[#0F172A] text-lg mb-6">Fáze léčby</h3>
          <div className="space-y-6">
            {detailedSteps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => selectStepAndScroll(idx)}
                  className={`flex items-center text-left gap-4 w-full group cursor-pointer transition-all relative ${
                    isActive ? 'text-brand-blue' : 'text-slate-400 hover:text-[#0F172A]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display transition-all shrink-0 ${
                    isActive 
                      ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-110 ring-4 ring-blue-50' 
                      : 'bg-brand-blue/85 text-white/90 group-hover:bg-brand-blue shadow-md group-hover:scale-105'
                  }`}>
                    <span className="text-xs font-bold font-mono">{idx + 1}</span>
                  </div>
                  <div>
                    <span className="block font-display font-semibold text-sm leading-tight">{s.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pravá detailní část */}
        <div className="lg:col-span-8 space-y-16">
          {detailedSteps.map((s, idx) => {
            const Icon = s.icon;
            const isEven = idx % 2 === 0;
            const cardAnim = isMobile
              ? { initial: false, animate: false, whileInView: false }
              : { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 } };

            return (
              <motion.div
                key={idx}
                ref={(el) => (stepRefs.current[idx] = el)}
                {...cardAnim}
                viewport={{ once: true, margin: "-100px" }}
                onViewportEnter={() => setActiveStep(idx)}
                style={isMobile ? undefined : { opacity: 0 }}
              >
                <div
                  className={`overflow-hidden bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/30 p-8 md:p-12 transition-all duration-300 ${
                    activeStep === idx ? 'border-brand-blue/30 ring-1 ring-brand-blue/10' : ''
                  }`}
                >
                  {/* Horní řádek s číslem a trváním */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-widest text-brand-blue">{s.step}</span>
                        <h2 className="text-2xl md:text-3.5xl font-display font-bold text-[#0F172A] leading-tight select-none">
                          {s.title}
                        </h2>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-brand-blue/90 text-xs font-bold text-white shadow-md border-0">
                      <Clock size={14} className="text-white" />
                      <span>{s.duration}</span>
                    </div>
                  </div>

                  {/* Grid pro obrázek a body */}
                  <div className="grid md:grid-cols-2 gap-10 items-stretch mb-8">
                    {/* Obrázek */}
                    <div className="rounded-4xl overflow-hidden aspect-4/3 bg-slate-100 relative group min-h-55">
                      <img 
                        src={s.image} 
                        alt={s.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Co vás konkrétně čeká */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h4 className="font-display font-bold text-sm text-[#0F172A] mb-4 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-brand-blue" />
                          Co vás během této fáze čeká:
                        </h4>
                        <ul className="space-y-3.5">
                          {s.aspects.map((aspect, asIdx) => (
                            <li key={asIdx} className="flex items-start gap-2.5 text-slate-500 text-sm leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-brand-blue" />
                              <span>{aspect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Detaily a texty */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 mb-6">
                    <h4 className="font-display font-semibold text-sm text-[#0F172A] mb-2">Proč je tato fáze klíčová?</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.whyImportant}</p>
                  </div>

                  {/* FAQ box */}
                  <div className="p-6 rounded-2xl bg-blue-50/30 border border-blue-100/50 flex gap-4 items-start">
                    <div className="p-2 rounded-xl bg-blue-50 text-brand-blue shrink-0 mt-0.5">
                      <HelpCircle size={18} />
                    </div>
                    <div>
                      <h5 className="font-display font-semibold text-sm text-[#0F172A] mb-1">{s.faq.q}</h5>
                      <p className="text-slate-500 text-xs leading-relaxed">{s.faq.a}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Spodní akční sekce */}
      <div className="container mx-auto px-6 mt-10 md:mt-20">
        <div className="bg-[#0F172A] text-white p-12 md:p-16 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
          {/* Kulaté dekorativní gradienty */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-blue/30 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-700/20 rounded-full blur-[100px]" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-slate-800/80 font-medium text-xs tracking-wider uppercase mb-6 text-brand-blue border border-slate-700">
              <Calendar size={12} />
              Nezávazná návštěva
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold mb-6 tracking-tight leading-tight">
              Udělejte první krok k vašemu novému já ještě dnes.
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-xl">
              Objednejte se na úvodní konzultaci v naší moderní klinice v srdci Telče. Navrhneme vám kompletní cestu k úsměvu snů.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  onBack();
                  setTimeout(() => {
                    document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                }}
                className="bg-brand-blue hover:brightness-110 text-white px-8 py-3 rounded-full text-sm font-semibold transition-all shadow-lg shadow-brand-blue/20 cursor-pointer"
              >
                Rezervovat konzultaci
              </button>
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
}
