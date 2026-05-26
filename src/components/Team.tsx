import { motion } from 'motion/react';
import { User, ShieldCheck, Stethoscope } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

const team = [
  {
    name: "MDDr. Kateřina Poukarová",
    title: "Hlavní ortodontistka",
    description: "Specialistka s více než 15 lety praxe v oblasti fixních i neviditelných rovnátek.",
    icon: Stethoscope
  },
  {
    name: "MDDr. Marie Novotná",
    title: "Ortodontistka",
    description: "Specialistka na moderní estetické léčebné postupy, neviditelná rovnátka a precizní 3D plánování.",
    icon: Stethoscope
  },
  {
    name: "Klára Veselá",
    title: "Zdravotní sestra",
    description: "Zajišťuje hladký průběh Vašich návštěv a asistuje při náročných zákrocích.",
    icon: User
  }
];

export default function Team() {
  const isMobile = useIsMobile();

  return (
    <section id="tym" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <div className="flex flex-col items-start gap-1.5 mb-6">
            <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">
              Náš tým
            </span>
            <div className="h-0.5 w-12 bg-brand-blue" />
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight text-[#0F172A] mb-8">
            Lidé, kteří se o <br />
            <span className="text-brand-blue">Vás postarají.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {team.map((member, i) => {
            const animProps = isMobile
              ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 } }
              : { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, transition: { delay: i * 0.08 } };

            return (
              <motion.div
                key={member.name}
                {...animProps}
                viewport={{ once: true }}
                style={{ opacity: isMobile ? 1 : 0 }}
                className="flex gap-6 items-start"
              >
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-brand-blue border-2 border-slate-50 shadow-inner">
                <member.icon size={32} />
              </div>
              <div className="flex-grow pt-2">
                <h3 className="text-xl font-display font-medium text-[#0F172A] mb-1">{member.name}</h3>
                <p className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-3 leading-none">{member.title}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{member.description}</p>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
