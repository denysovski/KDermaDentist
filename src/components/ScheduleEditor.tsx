import { useEffect, useState } from 'react';

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
}

export default function ScheduleEditor({ items = [], onChange }: { items?: ScheduleItem[]; onChange: (s: ScheduleItem[]) => void }) {
  const [list, setList] = useState<ScheduleItem[]>(items || []);
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const templates = [
    {
      name: 'Rectangle',
      html: '<div class="kderma-rectangle">\n  <div class="kderma-rectangle__dot"></div>\n  <div>\n    <div class="kderma-rectangle__title">Rectangle</div>\n    <div class="kderma-rectangle__text">Vložte vlastní text nebo upozornění do článku.</div>\n  </div>\n</div>',
    },
    {
      name: 'Poznámka',
      html: '<div class="kderma-note">\n  <div class="kderma-note__title">Poznámka</div>\n  <div class="kderma-note__text">Krátký blok pro praktické informace.</div>\n</div>',
    },
  ];

  useEffect(() => {
    setList(items || []);
    setActiveId(items[0]?.id ?? null);
  }, [items]);

  function add() {
    const nextItem = { id: Date.now().toString(), title: 'Nový záznam', time: '7:30 - 13:00' };
    const nxt = [...list, nextItem];
    setList(nxt);
    setActiveId(nextItem.id);
    onChange(nxt);
  }

  function remove(id: string) {
    const nxt = list.filter(i => i.id !== id);
    setList(nxt);
    setActiveId(nxt[0]?.id ?? null);
    onChange(nxt);
  }

  function onDragStart(e: any, idx: number) {
    e.dataTransfer.setData('text/plain', String(idx));
  }

  function onDrop(e: any, idx: number) {
    const from = Number(e.dataTransfer.getData('text/plain'));
    const to = idx;
    const copy = [...list];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    setList(copy);
    setActiveId(moved?.id ?? copy[to]?.id ?? null);
    onChange(copy);
    e.preventDefault();
  }

  function updateItem(id: string, patch: Partial<ScheduleItem>) {
    const next = list.map((item) => (item.id === id ? { ...item, ...patch } : item));
    setList(next);
    setActiveId(id);
    onChange(next);
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold text-[#0F172A]">Použitelné komponenty</div>
        </div>
        <div className="text-xs font-semibold text-brand-blue">{list.length} položek</div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {templates.map((template) => (
          <button
            key={template.name}
            type="button"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', template.html)}
            className="group w-full rounded-[1.35rem] border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-brand-blue/30 hover:shadow-md cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand-blue">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />
              {template.name}
            </div>
            <div className="mt-3 rounded-[1.1rem] border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-blue" />
                <div>
                  <div className="text-sm font-semibold text-[#0F172A]">{template.name}</div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Přetáhněte do obsahu článku.
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {list.map((it, idx) => (
          <div
            key={it.id}
            draggable
            onClick={() => setActiveId(it.id)}
            onDragStart={(e) => onDragStart(e, idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, idx)}
            className={`rounded-2xl border bg-white p-3 md:p-4 transition cursor-pointer ${activeId === it.id ? 'border-brand-blue shadow-md shadow-brand-blue/10 ring-2 ring-brand-blue/10' : 'border-slate-200 hover:border-brand-blue/30 hover:shadow-sm'}`}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-8 rounded-full bg-brand-blue/25" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-[#0F172A]">{it.title || 'Bez názvu'}</div>
                    {activeId === it.id && <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-blue">Použito</span>}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Zobrazuje se na detailu článku jako jedna z položek harmonogramu.</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:w-[360px]">
                <input
                  value={it.title}
                  onChange={(e) => updateItem(it.id, { title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 cursor-text"
                  placeholder="Název záznamu"
                />
                <input
                  value={it.time}
                  onChange={(e) => updateItem(it.id, { time: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 cursor-text"
                  placeholder="Časový rozsah"
                />
              </div>

              <div className="flex items-center justify-between gap-3 md:justify-end">
                <button onClick={() => setActiveId(it.id)} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:bg-slate-200 cursor-pointer">
                  Vybrat
                </button>
                <button onClick={() => remove(it.id)} aria-label="Smazat komponentu" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-blue text-brand-blue transition hover:bg-blue-50 cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M6 6l1 14h10l1-14" />
                    <path d="M10 11v5" />
                    <path d="M14 11v5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
