import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
// @ts-ignore
import toothShowcase from '../../tooth-showcase.png';

export default function ContactForm() {
  const isMobile = useIsMobile();
  const animProps = isMobile
    ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 } };

  return (
    <section id="kontakt" className="relative overflow-hidden py-32 bg-white">
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        className="pointer-events-none absolute right-0 top-1/2 hidden h-[800px] w-[52vw] -translate-y-1/2 xl:block"
      >
        <motion.div
          aria-hidden="true"
          className="absolute right-[-140px] top-1/2 h-[740px] w-[740px] -translate-y-1/2 rounded-full bg-brand-blue/15 blur-3xl"
          initial={{ scale: 0.6, x: 150, opacity: 0 }}
          whileInView={{ scale: 1, x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.4 }}
        />

        <motion.div
          aria-hidden="true"
          className="absolute right-[-40px] top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full bg-brand-blue/12"
          initial={{ scale: 0.6, x: 120, opacity: 0 }}
          whileInView={{ scale: 1, x: 0, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.12, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.4 }}
        />

        <motion.img
          src={toothShowcase}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain object-right opacity-100 drop-shadow-2xl"
          initial={{ scale: 0.85 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.95, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.4 }}
        />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex flex-col items-start gap-1.5 mb-6">
            <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">
              Napište nám
            </span>
            <div className="h-0.5 w-12 bg-brand-blue" />
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-medium tracking-tight text-[#0F172A] mb-8">
            Objednejte se na <br />
            <span className="text-brand-blue">konzultaci ještě dnes.</span>
          </h2>
          <p className="text-lg text-slate-500">
            Vyplňte krátký formulář a my se Vám do 24 hodin ozveme s návrhem termínu.
          </p>
        </div>

        <motion.div
          {...animProps}
          viewport={{ once: true }}
          style={{ opacity: isMobile ? 1 : 0 }}
          className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-slate-100"
        >
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Jméno a příjmení</label>
                <input 
                  type="text" 
                  placeholder="Např. Jan Novák" 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">E-mailová adresa</label>
                <input 
                  type="email" 
                  placeholder="vas@email.cz" 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Telefonní kontakt</label>
              <input 
                type="tel" 
                placeholder="000 000 000" 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Vaše zpráva</label>
              <textarea 
                placeholder="Jak Vám můžeme pomoci?" 
                rows={4} 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all font-medium resize-none"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-brand-blue text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-brand-blue/20 cursor-pointer"
            >
              Odeslat žádost o konzultaci
              <Send size={20} />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
