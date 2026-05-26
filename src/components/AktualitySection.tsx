import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { fetchPublicArticles, formatArticleDate } from '../lib/kdermaApi';
import { defaultArticles } from '../../defaultArticles';

export interface Post {
  id: string | number;
  title: string;
  description: string;
  content?: string;
  date: string;
  category: string;
  readTime?: string;
}

export const placeholderPosts: Post[] = [
  {
    id: 1,
    title: "Otevírací doba o letních prázdninách",
    description: "Vážený pacienti, rádi bychom Vás informovali o plánované úpravě otevírací doby během letních měsíců. Od 1. července do 31. srpna bude ordinace otevřena pro akutní případy v upravených časech.",
    content: "Vážený pacienti,\n\nrádi bychom Vás s předstihem informovali o úpravě naší otevírací doby během nadcházejících letních měsíců. Od 1. července do 31. srpna 2026 bude ordinace K-DERMA v Telči fungovat v upraveném režimu:\n\n• Pondělí: 7:30 – 13:00\n• Úterý: 7:30 – 13:00\n• Středa: 7:30 – 13:00\n• Čtvrtek: 7:30 – 13:00\n• Pátek: Pouze pro objednané zákroky a akutní stavy (7:30 – 11:30)\n\nBěhem celých prázdnin budeme plně k dispozici pro akutní opravy zámků a potíže s aparáty, doporučujeme se však předem telefonicky objednat na konkrétní čas, abychom zamezili dlouhému čekání v čekárně.\n\nřejeme Vám krásné prožití léta a spoustu důvodů k úsměvu!\n\nTým K-DERMA",
    date: "22. května 2026",
    category: "Oznámení",
    readTime: "2 min čtení"
  },
  {
    id: 2,
    title: "Nové technologie v ordinaci: Ultra-přesný 3D intraorální scanner",
    description: "Zapomeňte na nepříjemné sádrové otisky. Pořídili jsme nejmodernější 3D scanner, který bleskově vytvoří digitální otisk Vašeho chrupu s maximální přesností.",
    content: "S radostí oznamujeme další velký technologický krok pro naši kliniku! Do ordinace v Telči jsme pořídili nejmodernější intraorální 3D scanner.\n\nCo to znamená pro Vás jako pacienty?\n\n1. Maximální komfort: Už žádné dávivé pocity při klasickém otiskování pomocí lžic a sádrové či silikonové hmoty. Celé skenování probíhá pomocí malé ruční kamery, kterou jemně přejíždíme po zubech.\n2. Rychlost: Digitální otisk je hotový během několika minut a okamžitě ho vidíte spolu s lékařem na monitoru počítače.\n3. Dokonalá přesnost: S přesností v řádu mikrometrů scanner zachytí i ty nejmenší detaily, což nám umožňuje navrhnout dokonale sedící fixní rovnátka i moderní neviditelné dlahy Foilix.\n\nTěšíme se na Vaši návštěvu, kde si technologii skenování sami vyzkoušíte!",
    date: "15. května 2026",
    category: "Technologie",
    readTime: "3 min čtení"
  },
  {
    id: 3,
    title: "Dentální hygiena jako základní stavební kámen ortodontické léčby",
    description: "Nošení rovnátek klade zvýšené nároky na čištění zubů. Čisté zuby se totiž pohybují rychleji, bezpečněji a bez rizika vzniku nevzhledných skvrn pod zámky.",
    content: "Začali jste nosit fixní rovnátka nebo na ně teprve čekáte? Pak vězte, že Vaším nejlepším přítelem na celé této cestě bude dentální hygienista.\n\nKolem zámků, drátků a gumiček se přirozeně zachytává mnohem více zbytků jídla a plaku než obvykle. Pokud plak pravidelně a správně neodstraňujete, hrozí demineralizace skloviny (která se po sundání rovnátek projeví jako bílé křídové skvrny) nebo vznik zánětu dásní.\n\nNaše doporučení pro pacienty s rovnátky:\n• Navštivte dentální hygienu ideálně každé 3 až 4 měsíce.\n• Používejte speciální jednosvazkový (Solo) kartáček a mezizubní kartáčky odpovídajících rozměrů.\n• Čistěte zuby po každém jídle.\n\nAbychom Vám tuto péči usnadnili, pro všechny stávající pacienty v ortodontické léčbě nabízíme zvýhodněnou cenu na dentální hygienu včetně nácviku domácího čištění.",
    date: "3. května 2026",
    category: "Poradenství",
    readTime: "4 min čtení"
  },
  {
    id: 4,
    title: "Přijímáme nové pacienty na ortodontické konzultace",
    description: "Máme aktuálně volné kapacity pro registraci a konzultace nových dětských i dospělých pacientů. Pomůžeme Vám dosáhnout vysněného úsměvu s nejmodernější péčí.",
    content: "Ráby byste pro sebe nebo své děti zajistili moderní rovnátka a špičkovou péči v Telči a okolí? Máme pro Vás skvělou zprávu.\n\nKlinika K-DERMA aktuálně otevírá nové kapacity pro registrace pacientů k ortodontické konzultaci a následné léčbě. Přijímáme pacienty všech věkových kategorií.\n\nJak postupovat?\n1. Vyplňte náš jednoduchý online formulář na webu nebo nám zatelefonujte.\n2. Nabídneme Vám termín úvodní konzultace, na které zhodnotíme stav zubů a navrhneme možnosti nápravy.\n3. Sestavíme individuální plán a přizpůsobíme léčbu Vašim časovým i finančním možnostem.\n\nNeváhejte nás kontaktovat, počet nových míst je limitovaný pro zachování maximálního standardu a rychlosti péče.",
    date: "20. dubna 2026",
    category: "Oznámení",
    readTime: "2 min čtení"
  },
  {
    id: 5,
    title: "Jak efektivně pečovat o neviditelná rovnátka Foilix",
    description: "Neviditelná rovnátka Foilix s sebou přinášejí obrovskou svobodu, vyžadují však správný režim. Přečtěte si základní doporučení pro dokonalý průběh léčby.",
    content: "Fóliový systém Foilix je revolucí v ortodoncii – je takřka neviditelný, nesmírně pohodlný a snadno vyjímatelný. Aby však zuby putovaly přesně tak, jak máme naplánováno v 3D simulaci, je nutné dodržovat několik zásad:\n\n• Noste dlahy poctivě 22 hodin denně: Sundávejte je pouze na jídlo a čištění zubů. Každá hodina navíc mimo ústa prodlužuje celkovou léčbu.\n• Pijte pouze čistou vodu: Před pitím kávy, slazených nápojů nebo čaje rovnátka vždy vyjměte, abyste předešli jejich zabarvení či usazování cukru pod dlahami.\n• Čištění dlah: Dlahy čistěte jemným kartáčkem a vlažnou vodou, případně speciálním čisticím mýdlem či tabletami. Nikdy nepoužívejte horkou vodu, mohla by plast deformovat.\n\nPokud se Vám náhodou dlaha poškodí nebo ji ztratíte, ihned nás kontaktujte, abychom zvolili další nejvhodnější postup.",
    date: "5. dubna 2026",
    category: "Poradenství",
    readTime: "3 min čtení"
  }
];

interface AktualitySectionProps {
  onNavigateToAllNews: () => void;
  onSelectArticle?: (post: Post) => void;
}

export default function AktualitySection({ onNavigateToAllNews, onSelectArticle }: AktualitySectionProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);

  const titleAnim = isMobile
    ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 } };

  useEffect(() => {
    let isActive = true;

    async function loadArticles() {
      setIsLoading(true);

      try {
        const articles = await fetchPublicArticles();
        if (!isActive) return;

        setPublishedPosts(
          articles.map((article) => ({
            id: article.id,
            title: article.title,
            description: article.description,
            content: article.content,
            date: formatArticleDate(article.date),
            category: article.category || 'Oznámení',
          }))
        );
      } catch {
        if (isActive) {
          setPublishedPosts([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      isActive = false;
    };
  }, []);

  const latestPosts = publishedPosts.length > 0 ? publishedPosts.slice(0, 3) : defaultArticles.slice(0, 3);

  return (
    <section id="aktuality" className="py-32 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex flex-col items-start gap-1.5 mb-6">
              <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">
                Aktuality & Rady
              </span>
              <div className="h-0.5 w-12 bg-brand-blue" />
            </div>
            <motion.h2
              {...titleAnim}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-display font-medium tracking-tight text-[#0F172A]"
            >
              Co je u nás <br />
              <span className="text-brand-blue">nového.</span>
            </motion.h2>
          </div>
          
          <button 
            onClick={onNavigateToAllNews}
            className="flex items-center gap-2 group cursor-pointer text-sm font-bold text-brand-blue hover:text-blue-600 transition-colors bg-white px-6 py-3 rounded-full shadow-md shadow-blue-950/5 self-start border border-slate-100"
          >
            Zobrazit starší aktuality
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col justify-between animate-pulse h-[430px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-6 w-20 bg-slate-100 rounded-full" />
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="h-6 w-11/12 bg-slate-100 rounded-lg" />
                    <div className="h-6 w-8/12 bg-slate-100 rounded-lg" />
                  </div>
                  <div className="space-y-2 mb-8">
                    <div className="h-3.5 w-full bg-slate-100 rounded" />
                    <div className="h-3.5 w-11/12 bg-slate-100 rounded" />
                    <div className="h-3.5 w-11/12 bg-slate-100 rounded" />
                    <div className="h-3.5 w-9/12 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-100" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.map((post, i) => {
              const cardAnim = isMobile
                ? { initial: false, animate: false, whileInView: false }
                : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, transition: { delay: i * 0.1 } };

              return (
                <motion.div
                  key={post.id}
                  {...cardAnim}
                  viewport={{ once: true }}
                  style={isMobile ? undefined : { opacity: 0 }}
                >
                  <article
                    onClick={() => onSelectArticle?.(post)}
                    className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col justify-between hover:border-brand-blue/30 hover:shadow-2xl hover:shadow-brand-blue/5 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1.5 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-display font-bold text-[#0F172A] mb-4 group-hover:text-brand-blue transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-4">
                        {post.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{post.date}</span>
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-blue text-slate-400 group-hover:text-white transition-all duration-300">
                        <BookOpen size={14} />
                      </div>
                    </div>
                  </article>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
