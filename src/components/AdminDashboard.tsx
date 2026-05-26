import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import ArticleEditor from './ArticleEditor';
import { Check, Plus, Trash2 } from 'lucide-react';
// @ts-ignore
import addIcon from '../../add.png';
// @ts-ignore
import composeIcon from '../../compose.png';
// @ts-ignore
import noResultsIcon from '../../no-results.png';
import {
  ArticleRecord,
  createAdminArticle,
  deleteAdminArticle,
  fetchAdminArticles,
  formatArticleDate,
  updateAdminArticle,
} from '../lib/kdermaApi';

type AdminDashboardProps = {
  token: string;
  onLogout: () => void;
};

export default function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [editing, setEditing] = useState<ArticleRecord | null>(null);
  const [editAnchor, setEditAnchor] = useState<string | 'create' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [pendingDiscardAnchor, setPendingDiscardAnchor] = useState<string | 'create' | null>(null);
  const [confirmDeleteArticle, setConfirmDeleteArticle] = useState<ArticleRecord | null>(null);
  const [successAlert, setSuccessAlert] = useState<{ show: boolean; message?: string }>({ show: false });
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'drafts'>('all');

  async function loadArticles() {
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchAdminArticles(token);
      setArticles(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nepodařilo se načíst články.';
      if (message.toLowerCase().includes('neautoriz') || message.toLowerCase().includes('401')) {
        onLogout();
        return;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, [token]);

  function onCreate() {
    setEditing({
      id: `article-${Date.now()}`,
      title: '',
      description: '',
      content: '',
      date: new Date().toISOString(),
      published: false,
      category: 'Oznámení',
      schedule: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setEditAnchor('create');
  }

  async function onSave(article: ArticleRecord) {
    setError('');

    try {
      const exists = articles.some((item) => item.id === article.id);
      if (exists) {
        await updateAdminArticle(token, article.id, article);
      } else {
        await createAdminArticle(token, article);
      }
      if (article.published) {
        setSuccessAlert({ show: true, message: 'Článek byl úspěšně publikován' });
        window.setTimeout(() => setSuccessAlert({ show: false }), 2500);
      }
      await loadArticles();
      setEditing(null);
      setEditAnchor(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Uložení článku selhalo.';
      if (message.toLowerCase().includes('neautoriz') || message.toLowerCase().includes('401')) {
        onLogout();
        return;
      }
      setError(message);
    }
  }

  function onDelete(article: ArticleRecord) {
    setConfirmDeleteArticle(article);
  }

  async function confirmDeleteArticleNow() {
    if (!confirmDeleteArticle) {
      return;
    }

    setError('');

    try {
      await deleteAdminArticle(token, confirmDeleteArticle.id);
      setConfirmDeleteArticle(null);
      await loadArticles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Smazání článku selhalo.';
      if (message.toLowerCase().includes('neautoriz') || message.toLowerCase().includes('401')) {
        onLogout();
        return;
      }
      setError(message);
    }
  }

  async function onTogglePublish(article: ArticleRecord) {
    setError('');

    try {
      await updateAdminArticle(token, article.id, {
        ...article,
        published: !article.published,
      });
      if (!article.published) {
        setSuccessAlert({ show: true, message: 'Článek byl úspěšně publikován' });
        window.setTimeout(() => setSuccessAlert({ show: false }), 2500);
      }
      await loadArticles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Změna publikace selhala.';
      if (message.toLowerCase().includes('neautoriz') || message.toLowerCase().includes('401')) {
        onLogout();
        return;
      }
      setError(message);
    }
  }

  function onEdit(id: string) {
    const article = articles.find((item) => item.id === id) || null;
    if (article) {
      setEditing(article);
      setEditAnchor(id);
    }
  }

  const publishedCount = articles.filter((item) => item.published).length;
  const draftCount = articles.length - publishedCount;
  const visibleArticles = articles.filter((article) => {
    if (activeFilter === 'published') return article.published;
    if (activeFilter === 'drafts') return !article.published;
    return true;
  });

  const stats = [
    { key: 'all' as const, label: 'Celkem článků', value: articles.length, hint: 'Všechny dostupné články', active: activeFilter === 'all' },
    { key: 'published' as const, label: 'Publikované', value: publishedCount, hint: 'Veřejně publikované články pro pacienty', active: activeFilter === 'published' },
    { key: 'drafts' as const, label: 'Koncepty', value: draftCount, hint: 'Uložene nezveřejněné články', active: activeFilter === 'drafts' },
  ];

  const hasFilteredOutEverything = !isLoading && articles.length > 0 && visibleArticles.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="container mx-auto max-w-7xl px-4 pb-12 pt-24 md:px-6 md:pb-16 md:pt-32 lg:pt-40"
    >
      {successAlert.show &&
        createPortal(
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="fixed left-1/2 top-6 z-[9999] mx-auto w-[min(92vw,42rem)] -translate-x-1/2" aria-live="polite" role="status" data-testid="publish-success-inline">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-2xl">
              <div className="rounded-full bg-blue-50 p-2 text-brand-blue">
                <Check size={18} />
              </div>
              <div className="text-sm font-medium text-black">{successAlert.message}</div>
            </div>
          </motion.div>,
          document.body
        )}
      {/* Success alert */}
      <AnimatePresence>
        {successAlert.show &&
          createPortal(
            <motion.div
              key="success-alert"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="fixed right-8 top-20 z-[9999]"
              role="status"
              aria-live="polite"
              data-testid="publish-success-fixed"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-md">
                <div className="rounded-full bg-blue-50 p-2 text-brand-blue">
                  <Check size={18} />
                </div>
                <div className="text-sm font-medium text-black">{successAlert.message}</div>
              </div>
            </motion.div>,
            document.body
          )}
      </AnimatePresence>

      {/* Confirm discard modal */}
      {createPortal(
        <AnimatePresence>
          {confirmDiscardOpen && (
            <motion.div key="confirm-discard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/45 backdrop-blur-md px-6 py-8">
              <motion.div initial={{ scale: 0.94, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.24 }} className="w-full max-w-2xl rounded-[2.5rem] bg-white p-8 md:p-12 shadow-2xl shadow-slate-950/25">
                <h3 className="text-2xl md:text-4xl font-bold text-black">Opravdu chcete zahodit změny?</h3>
                <p className="mt-4 text-base md:text-lg text-slate-600">Změny budou ztraceny a editor se zavře.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => {
                    setConfirmDiscardOpen(false);
                    setEditing(null);
                    setEditAnchor(null);
                    setPendingDiscardAnchor(null);
                  }} className="cursor-pointer rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110">Zahodit</button>
                  <button onClick={() => { setConfirmDiscardOpen(false); setPendingDiscardAnchor(null); }} className="cursor-pointer rounded-full border border-brand-blue bg-transparent px-6 py-3 text-sm font-semibold text-black transition hover:bg-blue-50">Zrušit</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {confirmDeleteArticle && (
            <motion.div key="confirm-delete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/45 backdrop-blur-md px-6 py-8">
              <motion.div initial={{ scale: 0.94, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.24 }} className="w-full max-w-xl rounded-[2.5rem] bg-white p-8 md:p-12 shadow-2xl shadow-slate-950/25">
                <h3 className="text-2xl md:text-3xl font-bold text-black">Opravdu chcete smazat tento článek?</h3>
                <p className="mt-3 text-base text-slate-600">Článek bude trvale odstraněn a nepůjde jej obnovit.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={confirmDeleteArticleNow} className="cursor-pointer rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110">Smazat</button>
                  <button onClick={() => setConfirmDeleteArticle(null)} className="cursor-pointer rounded-full border border-brand-blue bg-transparent px-6 py-3 text-sm font-semibold text-black transition hover:bg-blue-50">Ne</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5">
          <div className="max-w-2xl">
            <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">Lokální databáze</span>
            <h2 className="mt-3 text-3xl font-display font-bold text-[#0F172A] md:text-4xl">Article dashboard</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Spravujte články, koncepty i publikované příspěvky z jednoho místa.</p>
          </div>
        </div>
      </div>

      <button onClick={onCreate} className="mb-8 mt-8 flex min-h-[220px] w-full flex-col items-start justify-between rounded-[2rem] bg-brand-blue p-6 text-left text-white shadow-lg shadow-brand-blue/20 transition hover:bg-blue-700 cursor-pointer md:min-h-[250px] md:p-8">
        <div className="flex w-full items-center justify-between gap-8">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/90">
              <Plus size={13} strokeWidth={3} />
              Nový článek
            </div>
            <h3 className="mt-4 text-3xl font-display font-bold leading-tight md:text-4xl">Vytvořte nový článek rychle a přehledně</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
              Přidejte článek pro pacienty s novinkami, doporučením nebo oznámením, které chcete hned publikovat nebo uložit jako koncept.
            </p>
          </div>
          <img src={addIcon} alt="Přidat článek" className="ml-[-100px] h-[150px] w-auto shrink-0 object-contain self-center" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
        </div>
      </button>

      <AnimatePresence initial={false} mode="wait">
        {editing && editAnchor === 'create' && (
          <motion.div
            key="editor-create"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="overflow-hidden mb-6"
          >
            <ArticleEditor
              article={editing}
              onRequestClose={(isDirty) => {
                if (!isDirty) {
                    setEditing(null);
                    setEditAnchor(null);
                  } else {
                    setPendingDiscardAnchor(editAnchor);
                    setConfirmDiscardOpen(true);
                  }
              }}
              onSave={onSave}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 mt-8 flex w-full flex-wrap gap-3">
        {stats.map((stat) => (
          <button
            key={stat.key}
            onClick={() => setActiveFilter(stat.key)}
            className={`group flex min-w-[180px] flex-1 items-center gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition cursor-pointer ${stat.active ? 'border-brand-blue bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'border-blue-100 bg-blue-50/60 text-brand-blue hover:bg-blue-100/80 hover:shadow-md'}`}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-current/15 bg-white/15 text-2xl font-display font-bold transition group-hover:scale-[1.02]">
              {stat.value}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold uppercase tracking-wider">{stat.label}</div>
              <div className={`mt-1 text-xs font-medium ${stat.active ? 'text-white/80' : 'text-brand-blue/80'}`}>{stat.hint}</div>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      

      <div className="mt-10 space-y-8">
        <div className="relative">
          {isLoading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-500">Načítám články…</div>
          ) : hasFilteredOutEverything ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-10 md:px-10 md:py-14 flex flex-col items-center justify-center text-center">
              <h3 className="text-center text-xl md:text-2xl font-display font-bold text-[#0F172A]">Žádné články neodpovídají filtrování</h3>
              <img src={noResultsIcon} alt="No results" className="mt-6 h-[150px] w-auto max-w-full object-contain" />
            </div>
          ) : visibleArticles.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-500">Žádné články ještě neexistují.</div>
          ) : (
            <div className="space-y-4">
              {visibleArticles.map((article) => (
                <div key={article.id}>
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm shadow-brand-blue/20">
                      <Check size={12} strokeWidth={3} />
                      {article.published ? 'Publikováno' : 'Koncept'}
                    </div>
                    <div className="mt-4 text-lg font-display font-bold text-[#0F172A]">{article.title || '(bez názvu)'}</div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {formatArticleDate(article.date)}
                    </div>
                    <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                      {article.category}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">{article.description}</p>
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-[180px] lg:items-end">
                    <button onClick={() => onEdit(article.id)} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/20 transition hover:bg-blue-700 cursor-pointer lg:w-40">
                      <img src={composeIcon} alt="Upravit" className="h-4 w-4 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                      Upravit
                    </button>
                    <button onClick={() => onTogglePublish(article)} className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-brand-blue hover:text-brand-blue cursor-pointer lg:w-40">
                      {article.published ? 'Unpublish' : 'Publikovat'}
                    </button>
                    <button onClick={() => onDelete(article)} aria-label="Smazat článek" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-blue text-brand-blue transition hover:bg-blue-50 cursor-pointer lg:w-11">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
                  </div>

                  <AnimatePresence initial={false} mode="wait">
                    {editing && editAnchor === article.id && (
                      <motion.div
                        key={`editor-${article.id}`}
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="overflow-hidden mt-4 mb-4"
                      >
                        <ArticleEditor
                          article={editing}
                          onRequestClose={(isDirty) => {
                            if (!isDirty) {
                              setEditing(null);
                              setEditAnchor(null);
                            } else {
                              setPendingDiscardAnchor(editAnchor);
                              setConfirmDiscardOpen(true);
                            }
                          }}
                          onSave={onSave}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}