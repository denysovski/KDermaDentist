/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import FeaturesGrid from './components/FeaturesGrid';
import About from './components/About';
import Services from './components/Services';
import AktualitySection from './components/AktualitySection';
import AktualitySubpage from './components/AktualitySubpage';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { Post } from './components/AktualitySection';
import Team from './components/Team';
import ModernEquipment from './components/ModernEquipment';
import Testimonials from './components/Testimonials';
import MapSection from './components/MapSection';
import ContactForm from './components/ContactForm';
import ScrollToTop from './components/ScrollToTop';
import PostupLecbySubpage from './components/PostupLecbySubpage';
import HealthPersuasion from './components/HealthPersuasion';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import {
  clearStoredAdminToken,
  fetchCurrentAdmin,
  getStoredAdminToken,
  loginAdmin,
  logoutAdmin,
  setStoredAdminToken,
} from './lib/kdermaApi';

type AdminSession = {
  token: string;
  username: string;
};

export default function App() {
  const getRouteFromLocation = () => {
    const hashRoute = window.location.hash.replace(/^#/, '');

    if (hashRoute) {
      return hashRoute.startsWith('/') ? hashRoute : `/${hashRoute}`;
    }

    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
    const pathname = window.location.pathname;

    if (basePath && pathname.startsWith(basePath)) {
      const relativePath = pathname.slice(basePath.length) || '/';
      return relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    }

    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  };

  const getPageFromLocation = () => {
    const route = getRouteFromLocation();

    if (route.startsWith('/admin')) return 'admin';
    if (route.startsWith('/postup')) return 'postup';
    if (route.startsWith('/aktuality')) return 'aktuality';
    return 'home';
  };

  const navigateToRoute = (route: string) => {
    window.location.hash = route === '/' ? '' : route;
  };

  const [currentPage, setCurrentPage] = useState<'home' | 'postup' | 'aktuality' | 'admin'>(getPageFromLocation);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Post | null>(null);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isAdminSessionReady, setIsAdminSessionReady] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPage(getPageFromLocation());
      setSelectedStep(null);
      setSelectedArticle(null);
    };

    window.addEventListener('hashchange', handleLocationChange);

    const storedToken = getStoredAdminToken();

    if (!storedToken) {
      setIsAdminSessionReady(true);
    } else {
      let isActive = true;

      async function restoreSession() {
        try {
          const user = await fetchCurrentAdmin(storedToken);
          if (!isActive) return;
          setAdminSession({ token: storedToken, username: user.username });
        } catch {
          if (!isActive) return;
          clearStoredAdminToken();
          setAdminSession(null);
        } finally {
          if (isActive) {
            setIsAdminSessionReady(true);
          }
        }
      }

      restoreSession();

      return () => {
        isActive = false;
        window.removeEventListener('hashchange', handleLocationChange);
      };
    }
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToHome = (sectionId?: string) => {
    setCurrentPage('home');
    setSelectedStep(null);
    setSelectedArticle(null);
    navigateToRoute('/');
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToPostup = (stepIndex?: number) => {
    setCurrentPage('postup');
    setSelectedArticle(null);
    navigateToRoute('/postup');
    if (stepIndex !== undefined) {
      setSelectedStep(stepIndex);
    } else {
      setSelectedStep(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAktuality = () => {
    setCurrentPage('aktuality');
    setSelectedArticle(null);
    navigateToRoute('/aktuality');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setCurrentPage('admin');
    navigateToRoute('/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = async (username: string, password: string) => {
    const response = await loginAdmin(username, password);
    setStoredAdminToken(response.token);
    setAdminSession({ token: response.token, username: response.user.username });
    setCurrentPage('admin');
    navigateToRoute('/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = async () => {
    if (adminSession?.token) {
      try {
        await logoutAdmin(adminSession.token);
      } catch {
        // Ignore logout errors and clear the local session anyway.
      }
    }

    clearStoredAdminToken();
    setAdminSession(null);
    setCurrentPage('home');
    navigateToRoute('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArticle = (post: Post) => {
    setSelectedArticle(post);
    setCurrentPage('aktuality');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen selection:bg-brand-blue selection:text-white bg-[#F8FAFC]">
      <Navbar 
        currentPage={currentPage}
        onNavigateToHome={navigateToHome}
        onNavigateToPostup={() => navigateToPostup()}
        onNavigateToAktuality={navigateToAktuality}
        onLogout={handleAdminLogout}
      />
      
      <main>
        {currentPage === 'home' ? (
          <>
            <Hero />
            <TrustBar />
            <About 
              onNavigateToPostup={() => navigateToPostup()} 
              onNavigateToTeam={() => navigateToHome('tym')} 
            />
            <Services onNavigateToStep={navigateToPostup} />
            <FeaturesGrid />
            <HealthPersuasion />
            <AktualitySection 
              onNavigateToAllNews={navigateToAktuality}
              onSelectArticle={navigateToArticle}
            />
            <Team />
            <ModernEquipment />
            <Testimonials />
            <MapSection />
            <ContactForm />
          </>
        ) : currentPage === 'postup' ? (
          <PostupLecbySubpage 
            onBack={() => navigateToHome()} 
            initialStep={selectedStep} 
          />
        ) : currentPage === 'admin' ? (
          <>
            {!isAdminSessionReady ? (
              <div className="min-h-[70vh] flex items-center justify-center text-slate-500">Načítám přihlášení…</div>
            ) : adminSession ? (
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.992 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <AdminDashboard token={adminSession.token} onLogout={handleAdminLogout} />
              </motion.div>
            ) : (
              <AdminLogin onLogin={handleAdminLogin} onBackHome={() => navigateToHome()} />
            )}
          </>
        ) : (
          <AktualitySubpage 
            onBack={() => navigateToHome()}
            initialSelectedPost={selectedArticle}
          />
        )}
      </main>

      <ScrollToTop />

      <footer className="pt-32 pb-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 text-slate-500">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-8 text-[#0F172A]">
                <span className="font-display font-bold text-3xl tracking-tighter">K-DERMA</span>
                <span className="text-brand-blue text-xs align-top">®</span>
              </div>
              <p className="text-sm leading-relaxed mb-8 max-w-xs">
                Prémiová ortodontická klinika v Praze poskytující špičkovou péči pro Váš dokonalý a zdravý úsměv už více než 10 let.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all"><Facebook size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all"><Youtube size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-[#0F172A] mb-8 text-lg">Rychlé odkazy</h4>
              <ul className="space-y-4 text-sm font-medium flex flex-col items-start">
                <li>
                  <button 
                    onClick={() => navigateToHome('o-nas')} 
                    className="hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-0 p-0 text-left font-medium"
                  >
                    O nás
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToPostup()} 
                    className="hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-0 p-0 text-left font-medium"
                  >
                    Postup léčby
                  </button>
                </li>
                <li>
                  <button 
                    onClick={navigateToAktuality} 
                    className="hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-0 p-0 text-left font-medium"
                  >
                    Aktuality
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToHome('tym')} 
                    className="hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-0 p-0 text-left font-medium"
                  >
                    Náš tým
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToHome('kontakt')} 
                    className="hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-0 p-0 text-left font-medium"
                  >
                    Kontakt
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToAdmin()}
                    className="hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-0 p-0 text-left font-medium"
                  >
                    Admin
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-[#0F172A] mb-8 text-lg">Kontaktujte nás</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-brand-blue" />
                  <a href="tel:+420607653315" className="hover:text-brand-blue transition-colors">607 653 315</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-brand-blue" />
                  <a href="mailto:ordinace.telc@outlook.cz" className="hover:text-brand-blue transition-colors">ordinace.telc@outlook.cz</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-brand-blue mt-1" />
                  <span>nám. Zachariáše z Hradce 50,<br />588 56 Telč-Vnitřní Město</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-[#0F172A] mb-8 text-lg">Ordinační hodiny</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex justify-between"><span>Pondělí</span> <span className="text-right text-[#0F172A]">7:30 - 12:00 &nbsp;&nbsp;&nbsp; 12:30 - 15:30</span></li>
                <li className="flex justify-between"><span>Úterý</span> <span className="text-[#0F172A]">12:30 - 18:00</span></li>
                <li className="flex justify-between"><span>Středa</span> <span className="text-[#0F172A]">7:00 - 13:00</span></li>
                <li className="flex justify-between"><span>Čtvrtek</span> <span className="text-right text-[#0F172A]">8:00 - 12:00 &nbsp;&nbsp;&nbsp; 12:30 - 15:30</span></li>
                <li className="flex justify-between"><span>Pátek</span> <span className="text-[#0F172A]">9:30 - 13:00</span></li>
                <li className="flex justify-between"><span>Sobota</span> <span className="text-brand-blue font-bold">Zavřeno</span></li>
                <li className="flex justify-between"><span>Neděle</span> <span className="text-brand-blue font-bold">Zavřeno</span></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-400">© 2026 K-DERMA Telč. Všechna práva vyhrazena.</p>
            <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-brand-blue transition-colors">Ochrana údajů</a>
              <a href="#" className="hover:text-brand-blue transition-colors">Všeobecné podmínky</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

