import { useState } from 'react';
import ScheduleEditor from './ScheduleEditor';
import { ArticleRecord, ScheduleItem } from '../lib/kdermaApi';

type ArticleEditorProps = {
  article: ArticleRecord;
  onSave: (article: ArticleRecord) => Promise<void> | void;
  onRequestClose: (isDirty: boolean) => void;
};

function getDateInputValue(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsed.toISOString().slice(0, 10);
}

export default function ArticleEditor({ article, onSave, onRequestClose }: ArticleEditorProps) {
  const [title, setTitle] = useState(article.title || '');
  const [description, setDescription] = useState(article.description || '');
  const [content, setContent] = useState(article.content || '');
  const [date, setDate] = useState(getDateInputValue(article.date));
  const [category, setCategory] = useState(article.category || 'Oznámení');
  const [schedule, setSchedule] = useState<ScheduleItem[]>(article.schedule || []);

  const categoryOptions = ['Oznámení', 'Technologie', 'Poradenství'];

  async function save(published: boolean) {
    await onSave({
      ...article,
      title: title.slice(0, 50),
      description,
      content,
      date: new Date(date).toISOString(),
      category,
      published,
      schedule,
      updatedAt: new Date().toISOString(),
    });
  }

  function insertTemplateHtml(html: string) {
    setContent((current) => {
      const next = current.trim() ? `${current.trim()}\n\n${html}` : html;
      return next;
    });
  }

  const isDirty = (
    title !== (article.title || '') ||
    description !== (article.description || '') ||
    content !== (article.content || '') ||
    getDateInputValue(article.date) !== date ||
    category !== (article.category || '') ||
    JSON.stringify(schedule || []) !== JSON.stringify(article.schedule || [])
  );

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50/70 to-white px-5 py-5 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">Editor článku</span>
            <h3 className="mt-2 text-xl font-display font-bold text-[#0F172A]">{title || 'Nový článek'}</h3>
            <p className="mt-2 text-sm text-slate-500">Tento obsah se používá na kartě aktualit, v detailu článku i v administraci.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span className={`rounded-full px-3 py-1 ${article.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{article.published ? 'Publikovaný' : 'Koncept'}</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-brand-blue">{category}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
        <div className="space-y-6 p-5 md:p-6">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Kategorie</label>
              <span className="text-[11px] font-semibold text-slate-400">Vyberte, kde se článek použije</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {categoryOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition cursor-pointer ${category === option ? 'border-brand-blue bg-blue-50 text-brand-blue ring-4 ring-brand-blue/10' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-blue/40 hover:text-brand-blue'}`}
                >
                  <div>{option}</div>
                  <div className="mt-1 text-[11px] font-medium opacity-70">Použije se ve filtru aktualit</div>
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Aktuálně vybraná kategorie: <span className="font-semibold text-[#0F172A]">{category}</span>. Zobrazí se v přehledu aktualit, v detailu článku i na admin kartě.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Nadpis (max 50 znaků)</label>
              <input maxLength={50} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 cursor-text" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Datum</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Popis karty</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 cursor-text" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Plný obsah článku</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const templateHtml = e.dataTransfer.getData('text/plain');
                if (templateHtml) {
                  insertTemplateHtml(templateHtml);
                }
              }}
              rows={12}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-relaxed focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 cursor-text"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/60 p-5 md:p-6 xl:border-t-0 xl:border-l">
          <div className="sticky top-6 space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Použitelné komponenty</label>
                <span className="text-[11px] font-semibold text-slate-400">Předpřipravené bloky i vlastní položky</span>
              </div>
              <ScheduleEditor items={schedule} onChange={setSchedule} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-5 md:flex-row md:items-center md:px-6">
        <button onClick={() => save(true)} className="rounded-full bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-blue/20 transition hover:brightness-110 cursor-pointer">
          Publikovat
        </button>
        <button onClick={() => save(false)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-brand-blue hover:text-brand-blue cursor-pointer">
          Uložit jako koncept
        </button>
        <button onClick={() => onRequestClose(isDirty)} className="rounded-full bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200 cursor-pointer md:ml-auto">
          Zrušit
        </button>
      </div>
    </div>
  );
}