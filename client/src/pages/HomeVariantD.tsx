import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Menu, X, Zap, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { trackEvent } from "@/lib/ab-test";
import { SalesChatWidget } from "@/components/SalesChatWidget";

// Variant D — Bold Neon, Dark, Price-Forward

const offers = [
  { emoji: "⚡", name: "Lite Web", price: "3 490", desc: "Profesionální web za cenu jedné zakázky", hot: false },
  { emoji: "🚀", name: "Lead Gen Web", price: "6 990", desc: "Web + systém na získávání zákazníků automaticky", hot: true },
  { emoji: "🤖", name: "AI Plná automatizace", price: "9 990", desc: "Web + AI chatbot + LeadOS dashboard", hot: false },
];

const proof = [
  { stat: "150+", label: "webů spuštěno" },
  { stat: "3×", label: "více poptávek průměrně" },
  { stat: "1–2 týdny", label: "od objednávky po spuštění" },
  { stat: "98%", label: "klientů doporučuje" },
];

const niches = ["☕ Kavárny", "✂️ Salony", "⚡ Elektrikáři", "🏋️ Fitness", "🏠 Reality", "🦷 Lékaři", "🎓 Kurzy", "🛒 E-shopy"];

export default function HomeVariantD() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const contactRef = useRef<HTMLElement>(null);
  const createInquiry = trpc.inquiries.create.useMutation();

  const scrollToContact = () => {
    trackEvent("hero_cta_click", { variant: "D" });
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@")) return toast.error("Vyplňte jméno a email");
    setSubmitting(true);
    try {
      await createInquiry.mutateAsync({ ...form, businessDescription: "", packageType: "variant-d", details: undefined, source: "web-variant-d" });
      trackEvent("form_submit", { variant: "D" });
      toast.success("Perfektní! Ozveme se do 24h.");
      setForm({ name: "", email: "", phone: "" });
    } catch { toast.error("Chyba. Zkuste znovu."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white font-[Inter,sans-serif]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050510]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-[#00ff88]">OPT</span>IVIO
          </span>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#offers" className="text-white/60 hover:text-white transition-colors">Nabídka</a>
            <a href="#proof" className="text-white/60 hover:text-white transition-colors">Výsledky</a>
            <a href="/agents" className="text-[#a78bfa] hover:text-[#c4b5fd] font-medium">✨ AI Agenti</a>
          </div>
          <Button
            className="hidden md:flex bg-[#00ff88] hover:bg-[#00e87a] text-[#050510] font-bold text-sm rounded-full px-6"
            onClick={scrollToContact}
          >
            Chci web →
          </Button>
          <button className="md:hidden text-white/60" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 flex flex-col gap-4 bg-[#050510]">
            <a href="#offers" className="text-sm text-white/70" onClick={() => setMobileOpen(false)}>Nabídka</a>
            <a href="/agents" className="text-sm text-[#a78bfa]" onClick={() => setMobileOpen(false)}>✨ AI Agenti</a>
            <Button className="bg-[#00ff88] text-[#050510] font-bold w-full rounded-full" onClick={() => { setMobileOpen(false); scrollToContact(); }}>
              Chci web →
            </Button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Neon glow bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-[#00ff88]/30 bg-[#00ff88]/5 rounded-full px-4 py-1.5 text-sm text-[#00ff88] mb-8">
            <Zap className="w-3.5 h-3.5" /> Web za 1–2 týdny · Platíte až po schválení
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold leading-none mb-6">
            Váš web.<br />
            <span className="text-[#00ff88]">Vaše pravidla.</span><br />
            <span className="text-white/30 text-3xl lg:text-4xl font-bold">od 3 490 Kč.</span>
          </h1>

          <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
            Weby pro české živnostníky a firmy. Profesionální, rychlé, měřitelné výsledky.
            Průměrně <span className="text-white font-semibold">+3× více poptávek</span> za 60 dní.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-[#00ff88] hover:bg-[#00e87a] text-[#050510] font-extrabold text-lg px-10 py-5 rounded-full shadow-[0_0_40px_rgba(0,255,136,0.3)] transition-shadow hover:shadow-[0_0_60px_rgba(0,255,136,0.5)]"
              onClick={scrollToContact}
            >
              Chci web zdarma konzultovat <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 justify-center text-sm text-white/40">
            {["Konzultace zdarma", "Platíte až po schválení", "Hotovo za 1–2 týdny", "Bez závazků"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#00ff88]" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="proof" className="border-y border-white/5 py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {proof.map(p => (
            <div key={p.label}>
              <div className="text-3xl font-extrabold text-[#00ff88] mb-1">{p.stat}</div>
              <div className="text-white/40 text-sm">{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OFFERS */}
      <section id="offers" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3">
              Vyberte si <span className="text-[#00ff88]">svůj start</span>
            </h2>
            <p className="text-white/40">Každý balíček zahrnuje design, hosting a SSL. Žádné skryté poplatky.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {offers.map(o => (
              <div
                key={o.name}
                className={`relative rounded-2xl p-6 border flex flex-col transition-all hover:-translate-y-1 ${
                  o.hot
                    ? "border-[#00ff88]/50 bg-[#00ff88]/5 shadow-[0_0_40px_rgba(0,255,136,0.1)]"
                    : "border-white/10 bg-white/3 hover:border-white/20"
                }`}
              >
                {o.hot && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ff88] text-[#050510] text-xs font-extrabold px-4 py-1 rounded-full">
                    NEJPOPULÁRNĚJŠÍ
                  </div>
                )}
                <div className="text-4xl mb-4">{o.emoji}</div>
                <h3 className="text-lg font-bold mb-1">{o.name}</h3>
                <p className="text-white/40 text-sm mb-4 flex-1">{o.desc}</p>
                <div className="text-3xl font-extrabold text-white mb-1">{o.price} <span className="text-base font-normal text-white/30">Kč</span></div>
                <div className="text-xs text-white/30 mb-5">jednorázově + provoz od 179 Kč/m</div>
                <Button
                  className={`w-full font-bold rounded-xl ${o.hot ? "bg-[#00ff88] hover:bg-[#00e87a] text-[#050510]" : "bg-white/10 hover:bg-white/20 text-white"}`}
                  onClick={scrollToContact}
                >
                  Chci tento →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NICHES */}
      <section className="py-10 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/30 text-sm mb-4">Specializujeme se na</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {niches.map(n => (
              <span key={n} className="border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60 hover:border-[#00ff88]/40 hover:text-white/80 transition-all cursor-default">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section ref={contactRef} id="contact" className="py-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold mb-3">
              Začněme <span className="text-[#00ff88]">hned.</span>
            </h2>
            <p className="text-white/40">Nezávazná konzultace · Návrh zdarma · Žádný spam</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              placeholder="Vaše jméno *"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
              required
            />
            <input
              placeholder="Telefon (volitelné)"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
            />
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#00ff88] hover:bg-[#00e87a] text-[#050510] font-extrabold py-4 rounded-xl text-base shadow-[0_0_30px_rgba(0,255,136,0.2)] hover:shadow-[0_0_50px_rgba(0,255,136,0.4)] transition-all"
            >
              {submitting ? "Odesílám..." : "Chci nezávaznou konzultaci →"}
            </Button>
            <p className="text-xs text-white/20 text-center">Ozveme se do 24 hodin. Bez závazků.</p>
          </form>
        </div>
      </section>

      {/* AI AGENTS PROMO */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl px-6 py-4">
            <span className="text-3xl">🤖</span>
            <div className="text-left">
              <div className="font-bold text-white">AI Agenti pro váš marketing</div>
              <div className="text-white/40 text-sm">Virtuální CMO, Copywriter, Email sekvence a 6 dalších agentů</div>
            </div>
            <a href="/agents">
              <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 ml-4 rounded-full">
                Vyzkoušet →
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-white/20 text-sm border-t border-white/5">
        © {new Date().getFullYear()} OPTIVIO
      </footer>

      <SalesChatWidget />
    </div>
  );
}
