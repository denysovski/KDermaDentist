import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, Menu, X, Clock } from 'lucide-react';
// @ts-ignore
import toothIcon from '../../tooth.png';
// @ts-ignore
import logoutIcon from '../../logout.png';

interface NavbarProps {
  currentPage: 'home' | 'postup' | 'aktuality' | 'admin';
  onNavigateToHome: (sectionId?: string) => void;
  onNavigateToPostup: () => void;
  onNavigateToAktuality: () => void;
  onLogout: () => void;
}

export default function Navbar({ currentPage, onNavigateToHome, onNavigateToPostup, onNavigateToAktuality, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'O nás', action: () => onNavigateToHome('o-nas'), active: currentPage === 'home' },
    { name: 'Postup léčby', action: () => onNavigateToPostup(), active: currentPage === 'postup' },
    { name: 'Aktuality', action: () => onNavigateToAktuality(), active: currentPage === 'aktuality' },
    { name: 'Kontakt', action: () => onNavigateToHome('kontakty-mapa'), active: false }
  ];

  return (
    <motion.nav 
      initial={{ y: -120, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 55, 
        damping: 18, 
        delay: 0.1 
      }}
      className="fixed top-6 left-1/2 z-50 w-[95%] max-w-7xl"
    >
      <div className="glass rounded-full px-6 md:px-8 py-4 flex items-center justify-between shadow-2xl shadow-blue-900/5 relative z-50">
        <button 
          onClick={() => {
            onNavigateToHome();
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0 text-left select-none outline-hidden group"
        >
          <img
            src={toothIcon}
            alt="K-DERMA tooth logo"
            className="h-6 w-6 object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(54%) sepia(90%) saturate(1858%) hue-rotate(190deg) brightness(101%) contrast(101%)' }}
          />
          <span className="font-display font-bold text-2xl tracking-tighter text-[#0F172A]">K-DERMA</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => {
                item.action();
                setIsMenuOpen(false);
              }}
              className={`text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 ${
                item.active 
                  ? 'text-brand-blue' 
                  : 'text-slate-500 hover:text-brand-blue'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {currentPage === 'admin' ? (
            <button
              onClick={onLogout}
              aria-label="Odhlásit se"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/20 transition hover:brightness-110 cursor-pointer border-0"
            >
              <span>Odhlásit se</span>
              <img
                src={logoutIcon}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </button>
          ) : (
            <>
              <div className="hidden lg:flex items-center gap-6 mr-4 text-xs font-semibold text-slate-400">
                <a href="tel:+420607653315" className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                  <Phone size={14} />
                  <span>607 653 315</span>
                </a>
                <a href="mailto:ordinace.telc@outlook.cz" className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                  <Mail size={14} />
                  <span>ordinace.telc@outlook.cz</span>
                </a>
              </div>

              <button 
                onClick={() => onNavigateToHome('kontakty-mapa')}
                className="hidden md:block bg-brand-blue hover:brightness-110 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-brand-blue/20 cursor-pointer border-0"
              >
                Objednat se
              </button>

              <button 
                onClick={() => {
                  onNavigateToHome('kontakty-mapa');
                  setIsMenuOpen(false);
                }}
                className="md:hidden w-10 h-10 rounded-full bg-brand-blue inline-flex items-center justify-center text-white cursor-pointer hover:bg-blue-600 transition-colors shadow-md shrink-0 border-0 p-0"
              >
                <Clock size={16} />
              </button>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 rounded-full bg-brand-blue inline-flex items-center justify-center text-white cursor-pointer hover:bg-blue-600 transition-colors shadow-md shrink-0 border-0 mr-1 p-0"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </>
          )}
        </div>
      </div>

      {currentPage !== 'admin' && (
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ transformOrigin: "top right" }}
              className="absolute top-full left-0 right-0 mt-3 glass rounded-[2.5rem] p-6 flex flex-col items-center gap-3 shadow-2xl border border-white/20 z-40"
            >
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  className={`w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer border-0 ${
                    item.active
                      ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/15'
                      : 'bg-slate-50/50 text-slate-700 hover:bg-slate-100/70 hover:text-brand-blue'
                  }`}
                >
                  {item.name}
                </button>
              ))}

              <div className="w-full border-t border-slate-100/50 pt-4 mt-2 flex flex-col items-center gap-3 text-xs font-semibold text-slate-500">
                <a href="tel:+420607653315" className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                  <Phone size={14} className="text-brand-blue" />
                  <span>+420 607 653 315</span>
                </a>
                <a href="mailto:ordinace.telc@outlook.cz" className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                  <Mail size={14} className="text-brand-blue" />
                  <span>ordinace.telc@outlook.cz</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.nav>
  );
}
