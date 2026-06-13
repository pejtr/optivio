import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star, Menu, X, ArrowRight, Users, TrendingUp, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { trackEvent } from "@/lib/ab-test";
import { SalesChatWidget } from "@/components/SalesChatWidget";

// Variant C — Social Proof First, Green palette

const testimonials = [
  { name: "Petra Svobodová", role: "Kavárna Espresso Praha", text: "Web nám přinesl zákazníky, které bychom jinak nikdy nezískali. Vrátil se nám za 3 týdny.", stars: 5, metric: "+47% rezervací", initial: "P" },
  { name: "Jiří Novák", role: "OSVČ elektrikář", text: "Investice 3 490 Kč se mi vrátila z první zakázky. Teď mám práci na 3 měsíce dopředu.", stars: 5, metric: "3× více zakázek", initial: "J" },
  { name: "Monika Králová", role: "Beauty Salon", text: "Zákaznice si rezervují samy, já se mohu věnovat práci. Přesně to jsem potřebovala.", stars: 5, metric: "0h ztracených", initial: "M" },
  { name: "Tomáš Veselý", role: "Autoservis Veselý", text: "Za 4 dny jsme měli hotový web. Profesionální přístup, férová cena.", stars: 5, metric: "+31% poptávek", initial: "T" },
];

const packages = [
  { name: "Lite Web", price: "3 490", monthly: "179", features: ["Jednostránkový web", "Responzivní design", "SEO", "Kontaktní formulář", "SSL + Hosting"], popular: false },
  { name: "Basic Web", price: "4 999", monthly: "179", features: ["Vícestrany (až 8)", "Blog", "Galerie", "Google Analytics", "Rychlostní opt."], popular: false },
  { name: "Web + Lead Gen", price: "6 990", monthly: "299", features: ["Lead capture", "Automatické emaily", "CRM integrace", "Scoring leadů", "Měsíční report"], popular: true },
  { name: "Web + Automatizace", price: "9 990", monthly: "499", features: ["AI chatbot 24/7", "Plná automatizace", "LeadOS dashboard", "Prioritní podpora", "Neomezené úpravy"], popular: false },
];

export default function HomeVariantC() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", packageType: "" });
  const [submitting, setSubmitting] = useState(false);
  const contactRef = useRef<HTMLElement>(null);
  const createInquiry = trpc.inquiries.create.useMutation();

  const scrollToContact = () => {
    trackEvent("hero_cta_click", { variant: "C" });
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Vyplňte jméno");
    if (!form.email.includes("@")) return toast.error("Zadejte platný email");
    setSubmitting(true);
    try {
      await createInquiry.mutateAsync({ ...form, businessDescription: "", packageType: form.packageType || undefined, details: undefined, source: "web-variant-c" });
      trackEvent("form_submit", { variant: "C" });
      toast.success("Ozveme se do 24 hodin!");
      setForm({ name: "", email: "", phone: "", packageType: "" });
    } catch { toast.error("Chyba. Zkuste to znovu."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-[Inter,sans-serif]">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-700">OPTIVIO</span>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#proof" className="hover:text-emerald-600 transition-colors">Výsledky</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">Ceny</a>
            <a href="/agents" className="text-violet-600 hover:text-violet-800 font-medium">✨ AI Agenti</a>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={scrollToContact}>
              Konzultace zdarma
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={scrollToContact}>
              Začít →
            </Button>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 bg-white">
            <a href="#proof" className="text-sm text-slate-600">Výsledky klientů</a>
            <a href="#pricing" className="text-sm text-slate-600">Ceny</a>
            <a href="/agents" className="text-sm text-violet-600">✨ AI Agenti</a>
            <Button className="bg-emerald-600 text-white w-full" onClick={() => { setMobileOpen(false); scrollToContact(); }}>Začít →</Button>
          </div>
        )}
      </nav>

      {/* HERO — social proof first */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* Social proof bar */}
          <div className="inline-flex items-center gap-3 bg-white border border-emerald-200 rounded-full px-5 py-2 mb-8 shadow-sm">
            <div className="flex -space-x-2">
              {["P", "J", "M", "T"].map(i => (
                <div key={i} className="w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">{i}</div>
              ))}
            </div>
            <span className="text-sm text-slate-700 font-medium">
              <span className="text-emerald-700 font-bold">150+ firem</span> už vydělává s OPTIVIO
            </span>
            <div className="flex text-amber-400">{"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}</div>
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 text-slate-900">
            Web, který<br />
            <span className="text-emerald-600">skutečně vydělává.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
            Průměrný klient OPTIVIO zaznamenal <strong className="text-slate-800">+3× více poptávek</strong> do 60 dní.
            Platíte až po schválení — bez rizika.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-full text-base shadow-lg shadow-emerald-200" onClick={scrollToContact}>
              Chci výsledky jako oni →
            </Button>
            <Button size="lg" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full" onClick={() => document.getElementById("proof")?.scrollIntoView({ behavior: "smooth" })}>
              Zobrazit výsledky klientů
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 justify-center text-sm text-slate-500">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Návrh zdarma</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Platíte až po schválení</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Hotovo za 1–2 týdny</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-emerald-700 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[["150+", "projektů dokončeno", Users], ["3×", "průměrný růst poptávek", TrendingUp], ["98%", "spokojenost klientů", Award]].map(([v, l, Icon]) => (
            <div key={String(l)}>
              <div className="text-3xl font-extrabold mb-1">{String(v)}</div>
              <div className="text-emerald-200 text-sm">{String(l)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF — testimonials */}
      <section id="proof" className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-1 text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-emerald-500" /> Ověřené výsledky
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Co říkají naši klienti</h2>
            <p className="text-slate-500">Skutečné výsledky, skuteční lidé. Bez retušování.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-400">{t.role}</div>
                  </div>
                  <div className="ml-auto bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1 text-sm font-bold text-emerald-700">
                    {t.metric}
                  </div>
                </div>
                <div className="flex mb-3">
                  {Array(t.stars).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Transparentní ceny</h2>
            <p className="text-slate-500">Žádné skryté poplatky. Platíte jen to, co vidíte.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {packages.map(pkg => (
              <div key={pkg.name} className={`rounded-2xl border p-6 flex flex-col transition-all hover:shadow-lg ${pkg.popular ? "border-emerald-500 ring-1 ring-emerald-500 shadow-emerald-100 shadow-md" : "border-slate-200"}`}>
                {pkg.popular && (
                  <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 text-center w-fit mx-auto">
                    Nejpopulárnější
                  </div>
                )}
                <h3 className="font-bold text-slate-900 mb-1">{pkg.name}</h3>
                <div className="text-3xl font-extrabold text-slate-900 mb-0.5">{pkg.price} <span className="text-base font-normal text-slate-400">Kč</span></div>
                <div className="text-sm text-slate-400 mb-5">+ {pkg.monthly} Kč/měsíc</div>
                <ul className="space-y-2 flex-1 mb-6">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={pkg.popular ? "bg-emerald-600 hover:bg-emerald-700 text-white w-full" : "w-full"}
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={scrollToContact}
                >
                  Vybrat →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section ref={contactRef} id="contact" className="py-16 bg-emerald-700 text-white">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-3">Začněte zdarma</h2>
          <p className="text-emerald-200 mb-8">Konzultace a návrh webu jsou zdarma. Platíte až po schválení.</p>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input
              placeholder="Vaše jméno *"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white"
              required
            />
            <input
              placeholder="Telefon (volitelné)"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white"
            />
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-bold py-3 rounded-xl text-base"
            >
              {submitting ? "Odesílám..." : "Chci nezávaznou konzultaci →"}
            </Button>
            <p className="text-xs text-emerald-300 text-center">Ozveme se do 24 hodin. Bez závazků.</p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} OPTIVIO · <a href="/agents" className="text-violet-400 hover:text-violet-300">AI Agenti</a></p>
      </footer>

      <SalesChatWidget />
    </div>
  );
}
