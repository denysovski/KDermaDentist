import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, LoaderCircle, ShieldCheck } from 'lucide-react';

type AdminLoginProps = {
  onLogin: (username: string, password: string) => Promise<void>;
  onBackHome: () => void;
};

export default function AdminLogin({ onLogin, onBackHome }: AdminLoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onLogin(username.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Přihlášení selhalo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-6 pb-20 pt-48 md:pt-56"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,1))]" />
      <div className="container mx-auto max-w-md relative z-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/40 backdrop-blur-xl md:p-10">
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-blue">
              <ShieldCheck size={14} /> Lokální správa obsahu
            </div>
            <h1 className="text-3xl font-display font-bold text-[#0F172A]">Přihlášení administrátora</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Přístup k editoru článků je chráněný lokálním účtem uloženým v databázovém souboru na tomto zařízení.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Uživatelské jméno</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Heslo</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-brand-blue px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer active:scale-[0.98] active:shadow-md"
            >
              {isSubmitting ? 'Přihlašování…' : 'Přihlásit se'}
            </button>
          </form>

          <button
            type="button"
            onClick={onBackHome}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-blue cursor-pointer"
          >
            <ArrowLeft size={16} />
            Zpět na web
          </button>
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/30 bg-white/95 p-6 text-center shadow-2xl shadow-slate-950/20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-brand-blue">
              <LoaderCircle size={30} className="animate-spin" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#0F172A]">Otevírám dashboard</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Kontroluji přístup a připravuji administraci článků.</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}