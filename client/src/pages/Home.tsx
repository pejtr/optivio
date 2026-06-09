import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ArrowRight, Menu, X, ChevronDown, Star, Zap, Globe, BarChart3, Shield, TrendingUp, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { SalesChatWidget } from "@/components/SalesChatWidget";

// ─── Data ────────────────────────────────────────────────────────────────────

const niches = [
  { icon: "☕", label: "Kavárny & restaurace", desc: "Rezervace, menu online, věrnostní program", color: "from-amber-500/20 to-orange-500/10" },
  { icon: "✂️", label: "Kadeřnictví & salony", desc: "Online booking, galerie prací, recenze", color: "from-pink-500/20 to-rose-500/10" },
  { icon: "⚡", label: "Elektrikáři & řemeslníci", desc: "Poptávkový formulář, reference, ceník", color: "from-yellow-500/20 to-amber-500/10" },
  { icon: "🏋️", label: "Fitness & wellness", desc: "Rozvrh hodin, členství, lektoři", color: "from-green-500/20 to-emerald-500/10" },
  { icon: "🏠", label: "Reality & pronájmy", desc: "Katalog nemovitostí, kontaktní formulář", color: "from-blue-500/20 to-cyan-500/10" },
  { icon: "🦷", label: "Lékaři & kliniky", desc: "Objednávkový systém, tým, ceník výkonů", color: "from-teal-500/20 to-cyan-500/10" },
  { icon: "🎓", label: "Vzdělávání & kurzy", desc: "Přihlašování na kurzy, platby, certifikáty", color: "from-purple-500/20 to-violet-500/10" },
  { icon: "🛒", label: "E-shopy & obchody", desc: "Produktový katalog, košík, platební brána", color: "from-indigo-500/20 to-blue-500/10" },
];

const services = [
  { icon: <Globe className="w-6 h-6" />, title: "Tvorba webu", desc: "Profesionální web na míru za 1–2 týdny. Responzivní design, SEO, rychlost.", badge: "od 3 490 Kč" },
  { icon: <Zap className="w-6 h-6" />, title: "Automatizace", desc: "Automatické emaily, CRM integrace, chatbot. Váš web pracuje i ve 3 ráno.", badge: "od 6 990 Kč" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Lead Generation", desc: "Systém na sběr kontaktů, scoring leadů, automatické follow-upy.", badge: "od 6 990 Kč" },
  { icon: <TrendingUp className="w-6 h-6" />, title: "LeadOS SaaS", desc: "Kompletní AI orchestrace vašeho obchodu. Autonomní správa projektů.", badge: "na míru" },
  { icon: <MessageSquare className="w-6 h-6" />, title: "AI Chatbot", desc: "Inteligentní chatbot odpovídá zákazníkům 24/7 a sbírá kontakty.", badge: "addon" },
  { icon: <Shield className="w-6 h-6" />, title: "Správa & hosting", desc: "Hosting, SSL, zálohy, aktualizace. Staráme se o vše technické.", badge: "179 Kč/m" },
];

const caseStudies = [
  {
    tag: "Kavárna", tagColor: "bg-amber-100 text-amber-800",
    title: "Kavárna Espresso Praha: +47% rezervací za 6 týdnů",
    desc: "Majitelka kavárny neměla web. Po spuštění nového webu s online rezervacemi přišlo za první měsíc 89 nových zákazníků přímo přes web.",
    metric: "+47%", metricLabel: "více rezervací",
    author: "Petra Svobodová", role: "Majitelka, Kavárna Espresso",
    quote: "Web nám přinesl zákazníky, které bychom jinak nikdy nezískali. Vrátil se nám za 3 týdny.",
  },
  {
    tag: "Řemeslník", tagColor: "bg-blue-100 text-blue-800",
    title: "Elektrikář Novák: 3× více poptávek bez reklamy",
    desc: "Pan Novák fungoval jen na doporučení. Nový web s poptávkovým formulářem a SEO mu přinesl 3× více zakázek — bez jediné koruny do reklamy.",
    metric: "3×", metricLabel: "více zakázek",
    author: "Jiří Novák", role: "OSVČ elektrikář, Praha",
    quote: "Investice 3 490 Kč se mi vrátila z první zakázky. Teď mám práci na 3 měsíce dopředu.",
  },
  {
    tag: "Salon", tagColor: "bg-pink-100 text-pink-800",
    title: "Beauty Salon Monika: Plný diář bez telefonátů",
    desc: "Kadeřnice Monika trávila hodiny denně přijímáním rezervací po telefonu. Po zavedení online bookingu se tento čas zkrátil na nulu.",
    metric: "0h", metricLabel: "ztracených telefonáty",
    author: "Monika Králová", role: "Majitelka, Beauty Salon Monika",
    quote: "Zákaznice si rezervují samy, já se mohu věnovat práci. Přesně to jsem potřebovala.",
  },
];

const testimonials = [
  { name: "Tomáš Veselý", role: "Majitel, Autoservis Veselý", text: "Za 4 dny jsme měli hotový web. Profesionální přístup, férová cena. Doporučuji každému živnostníkovi.", stars: 5, initial: "T" },
  { name: "Jana Procházková", role: "Ředitelka, Jazyková škola Lingua", text: "Přihlašování na kurzy přes web nám ušetřilo hodiny administrativy týdně. Skvělá investice.", stars: 5, initial: "J" },
  { name: "Martin Blažek", role: "OSVČ, Malíř pokojů", text: "Myslel jsem, že web pro malíře nepotřebuji. Teď mi přináší 5–8 poptávek měsíčně.", stars: 5, initial: "M" },
  { name: "Lucie Horáková", role: "Majitelka, Dětský koutek Sluníčko", text: "Krásný web, rychlá komunikace, vše jak bylo domluveno. Přesně takový partner jsem hledala.", stars: 5, initial: "L" },
];

const faqs = [
  { q: "Jak dlouho trvá vytvoření webu?", a: "Standardně 1–2 týdny od schválení návrhu. U složitějších projektů (e-shop, automatizace) 2–4 týdny. Vždy vám dáme přesný harmonogram předem." },
  { q: "Platím celou částku předem?", a: "Ne. Platíte pouze 30% zálohu po schválení návrhu. Zbývajících 70% hradíte až po spuštění webu, když jste spokojeni s výsledkem." },
  { q: "Co je zahrnuto v měsíčním poplatku 179 Kč?", a: "Hosting, SSL certifikát, zálohy, technická podpora a drobné úpravy obsahu. Žádné skryté poplatky." },
  { q: "Mohu web kdykoliv upravit?", a: "Ano. Máte přístup do administrace a můžete upravovat texty, fotky a obsah sami. Nebo nám napište — drobné úpravy jsou v ceně provozu." },
  { q: "Co je LeadOS a potřebuji ho?", a: "LeadOS je naše AI platforma pro automatizaci obchodu — automatické emaily, scoring leadů, CRM integrace. Hodí se firmám, které chtějí růst bez přijímání dalších lidí." },
  { q: "Děláte weby i pro firmy mimo Prahu?", a: "Ano, pracujeme plně online. Máme klienty po celé ČR i v zahraničí. Vše řešíme přes video hovory a email." },
];

const packages = [
  {
    name: "Lite Web", price: "3 490", monthly: "179", color: "border-slate-200", badge: null,
    features: ["Jednostránkový web", "Responzivní design", "SEO optimalizace", "Kontaktní formulář", "SSL certifikát", "Hosting v ceně"],
    cta: "Začít s Lite",
  },
  {
    name: "Basic Web", price: "4 999", monthly: "179", color: "border-slate-200", badge: null,
    features: ["Vše z Lite Web", "Vícestrany (až 8)", "Galerie / Portfolio", "Blog (volitelně)", "Google Analytics", "Rychlostní optimalizace"],
    cta: "Začít s Basic",
  },
  {
    name: "Web + Lead Gen", price: "6 990", monthly: "299", color: "border-violet-500 border-2", badge: "Nejpopulárnější",
    features: ["Vše z Basic Web", "Lead capture systém", "Automatické emaily", "CRM integrace", "Scoring leadů", "Měsíční report"],
    cta: "Mám zájem",
  },
  {
    name: "Web + Automatizace", price: "9 990", monthly: "499", color: "border-slate-200", badge: null,
    features: ["Vše z Lead Gen", "AI chatbot 24/7", "Plná automatizace", "LeadOS dashboard", "Prioritní podpora", "Neomezené úpravy"],
    cta: "Mám zájem",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", businessDescription: "", packageType: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});
  const [scrolled, setScrolled] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [billingAnnual, setBillingAnnual] = useState(true);
  const contactRef = useRef<HTMLElement>(null);

  const createInquiry = trpc.inquiries.create.useMutation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = () => contactRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Vyplňte prosím vaše jméno");
    if (!formData.email.includes("@")) return toast.error("Zadejte platný email");
    if (!formData.packageType) return toast.error("Vyberte balíček");
    setIsSubmitting(true);
    try {
      await createInquiry.mutateAsync(formData);
      toast.success("Poptávka odeslána! Ozveme se do 24 hodin.");
      setFormData({ name: "", email: "", phone: "", businessDescription: "", packageType: "" });
    } catch { toast.error("Chyba při odesílání. Zkuste to znovu."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans,Inter,sans-serif] bg-white text-slate-900">

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#1a0a3c]/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-white tracking-tight">OPTIVIO</span>
          <div className="hidden md:flex items-center gap-8">
            {["Řešení", "Ceny", "Případové studie", "O nás"].map(item => (
              <a key={item} href={`#${item === "Ceny" ? "pricing" : item === "Případové studie" ? "cases" : item === "Řešení" ? "niche" : "contact"}`}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors">{item}</a>
            ))}
            <a href="/agents" className="text-violet-300 hover:text-violet-100 text-sm font-medium transition-colors flex items-center gap-1">
              ✨ AI Agenti
            </a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 text-sm" onClick={scrollToContact}>
              Domluvit konzultaci
            </Button>
            <Button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold px-5 rounded-full" onClick={scrollToContact}>
              14 dní zdarma →
            </Button>
          </div>
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1a0a3c] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
            {["#niche", "#pricing", "#cases", "#contact"].map((href, i) => (
              <a key={i} href={href} className="text-white/80 text-sm" onClick={() => setMobileMenuOpen(false)}>
                {["Řešení", "Ceny", "Případové studie", "Kontakt"][i]}
              </a>
            ))}
            <a href="/agents" className="text-violet-300 text-sm font-medium">✨ AI Agenti</a>
            <Button className="bg-[#7c3aed] text-white w-full rounded-full" onClick={() => { setMobileMenuOpen(false); scrollToContact(); }}>
              14 dní zdarma →
            </Button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative bg-[#0f0628] text-white overflow-hidden min-h-[90vh] flex items-center">
        {/* Background glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
              Nový web za 1–2 týdny · Platíte až po schválení
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Váš web,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                vaše pravidla.
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
              Pomáháme českým firmám a živnostníkům získat profesionální web, který skutečně vydělává — správně nastavený, plně automatizovaný a připravený škálovat.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button size="lg" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-8 rounded-full text-base shadow-lg shadow-violet-900/40 active:scale-95 transition-transform" onClick={scrollToContact}>
                Domluvit konzultaci
              </Button>
              <Button size="lg" variant="ghost" className="text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-full text-base" onClick={scrollToContact}>
                14 dní zkušební verze zdarma →
              </Button>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 text-sm text-white/60">
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Návrh zdarma</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> 30% záloha, zbytek po spuštění</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Bez skrytých poplatků</span>
            </div>
          </div>

          {/* Right — mock dashboard */}
          <div className="hidden lg:block relative">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-white/40 text-xs">optivio.cz/dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[["89", "Nové leady"], ["3×", "Více poptávek"], ["47%", "Růst rezervací"]].map(([v, l]) => (
                  <div key={l} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-violet-300">{v}</div>
                    <div className="text-xs text-white/50 mt-1">{l}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {["Kavárna Espresso — web spuštěn ✓", "Elektrikář Novák — 3 nové poptávky", "Beauty Salon — booking aktivní ✓"].map(t => (
                  <div key={t} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-xs text-white/70">
                    <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl px-4 py-3 shadow-xl text-center">
              <div className="text-2xl font-extrabold text-white">150+</div>
              <div className="text-xs text-white/80">projektů</div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 gap-4 text-center">
            {[["150+", "projektů dokončeno"], ["5 let", "zkušeností"], ["98%", "spokojenost klientů"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-xl font-bold text-violet-300">{v}</div>
                <div className="text-xs text-white/50">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NICHE SOLUTIONS ── */}
      <section id="niche" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
              Řešení pro obory, kde web<br />
              <span className="text-violet-600">funguje nejlépe</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">Specializujeme se na obory, kde záleží na prvním dojmu, rychlé odezvě a měřitelných výsledcích.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {niches.map(n => (
              <button key={n.label} onClick={scrollToContact}
                className={`bg-gradient-to-br ${n.color} border border-slate-200 hover:border-violet-300 rounded-2xl p-5 text-left transition-all hover:shadow-md hover:-translate-y-0.5 group`}>
                <div className="text-3xl mb-3">{n.icon}</div>
                <div className="font-semibold text-slate-900 text-sm mb-1">{n.label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{n.desc}</div>
                <div className="mt-3 text-xs text-violet-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Zobrazit řešení →</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Naše hlavní služby</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Od jednoduchého webu až po plnou AI automatizaci vašeho obchodu.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map(s => (
              <div key={s.title} className="border border-slate-100 hover:border-violet-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer" onClick={scrollToContact}>
                <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-100 transition-colors">
                  {s.icon}
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900">{s.title}</h3>
                  <span className="text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">{s.badge}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                <div className="mt-4 text-sm text-violet-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Zjistit více <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 bg-[#0f0628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-6">
              Nejsme jen webová agentura.<br />
              <span className="text-violet-400">Jsme váš dlouhodobý partner.</span>
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              Rozumíme obchodu, automatizaci i tomu, jak české firmy skutečně fungují. Proto neděláme jen weby — stavíme systémy, které vám přinášejí zákazníky i ve 3 ráno.
            </p>
            <div className="space-y-4 mb-8">
              {[
                ["Vlastní AI nástroje a automatizace", "LeadOS, chatbot, scoring leadů — vše pod jednou střechou."],
                ["Silný důraz na výsledky", "Každý web měříme. Víme, co funguje a co ne."],
                ["Zkušenosti z reálného prostředí", "150+ projektů pro české živnostníky a firmy."],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-violet-500/20 border border-violet-400/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-violet-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{title}</div>
                    <div className="text-white/50 text-sm">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full px-8 font-bold" onClick={scrollToContact}>
              Domluvit konzultaci
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "150+", l: "dokončených projektů", icon: "🚀" },
              { v: "5 let", l: "na trhu", icon: "📅" },
              { v: "98%", l: "spokojených klientů", icon: "⭐" },
              { v: "24/7", l: "monitoring & podpora", icon: "🛡️" },
            ].map(({ v, l, icon }) => (
              <div key={l} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-3xl font-extrabold text-violet-300 mb-1">{v}</div>
                <div className="text-xs text-white/50">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section id="cases" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Případové studie</h2>
              <p className="text-slate-500">Reálné výsledky reálných klientů.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-violet-600 font-medium text-sm hover:text-violet-700" onClick={scrollToContact}>
              Zobrazit vše <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Featured case */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-3xl p-8 lg:p-12 mb-6">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${caseStudies[activeCase].tagColor}`}>
                  {caseStudies[activeCase].tag}
                </span>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-4">{caseStudies[activeCase].title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{caseStudies[activeCase].desc}</p>
                <blockquote className="border-l-4 border-violet-400 pl-4 italic text-slate-600 text-sm mb-6">
                  „{caseStudies[activeCase].quote}"
                  <footer className="mt-2 not-italic font-semibold text-slate-800 text-xs">
                    — {caseStudies[activeCase].author}, {caseStudies[activeCase].role}
                  </footer>
                </blockquote>
                <Button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full" onClick={scrollToContact}>
                  Chci podobné výsledky
                </Button>
              </div>
              <div className="text-center">
                <div className="text-8xl font-extrabold text-violet-600 mb-2">{caseStudies[activeCase].metric}</div>
                <div className="text-slate-500 font-medium">{caseStudies[activeCase].metricLabel}</div>
              </div>
            </div>
          </div>

          {/* Case tabs */}
          <div className="flex gap-3 flex-wrap">
            {caseStudies.map((c, i) => (
              <button key={i} onClick={() => setActiveCase(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCase === i ? "bg-violet-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {c.tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 text-center mb-12">Co říkají naši klienti</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">„{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Vyberte si nejlepší plán</h2>
            <p className="text-slate-500 mb-6">Platíte pouze 30% zálohu. Zbytek až po spuštění.</p>
            {/* Billing toggle */}
            <div className="inline-flex items-center bg-slate-100 rounded-full p-1 gap-1">
              <button onClick={() => setBillingAnnual(false)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!billingAnnual ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>Jednorázově</button>
              <button onClick={() => setBillingAnnual(true)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billingAnnual ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>
                Roční provoz <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Ušetříte 20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {packages.map(pkg => (
              <div key={pkg.name} className={`border ${pkg.color} rounded-2xl p-6 relative flex flex-col ${pkg.badge ? "shadow-xl shadow-violet-100" : ""}`}>
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {pkg.badge}
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-bold text-slate-900 mb-1">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">{pkg.price}</span>
                    <span className="text-slate-400 text-sm">Kč</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    + {billingAnnual ? Math.round(parseInt(pkg.monthly) * 0.8) : pkg.monthly} Kč/měsíc provoz
                  </div>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-violet-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full font-semibold ${pkg.badge ? "bg-violet-600 hover:bg-violet-700 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
                  onClick={scrollToContact}
                >
                  {pkg.cta}
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">Ceny jsou bez DPH. Roční provoz zahrnuje hosting, SSL, zálohy a technickou podporu.</p>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="py-20 bg-[#0f0628] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">Jste připraveni začít?</h2>
          <p className="text-white/70 mb-8 text-lg leading-relaxed">
            Objednejte si konzultaci a získejte doporučení na míru, přehled o vašem obchodním procesu a jasný plán realizace — nebo si vyzkoušejte naše služby 14 dní zdarma vlastním tempem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-10 rounded-full shadow-lg shadow-violet-900/40" onClick={scrollToContact}>
              Domluvit konzultaci
            </Button>
            <Button size="lg" variant="ghost" className="text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-full" onClick={scrollToContact}>
              14-denní zkušební verze zdarma →
            </Button>
          </div>
        </div>
      </section>

      {/* ── AI AGENTS PROMO ── */}
      <section className="py-20 bg-gradient-to-br from-violet-950 via-[#1a0a3c] to-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-5">
              <span>✨</span>
              <span className="text-violet-200">Nové — AI Marketing Suite</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
              Váš tým AI agentů.<br />
              <span className="text-violet-300">Vždy připravených.</span>
            </h2>
            <p className="text-violet-200 text-lg max-w-xl mx-auto">
              Každý agent nese znalosti nejlepších světových marketérů. Vy říkáte CO — on ví JAK.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: "🧠", name: "Virtuální CMO", desc: "Orchestruje vše" },
              { icon: "✍️", name: "Copywriter", desc: "Ogilvy + Halbert styl" },
              { icon: "📧", name: "Email Sekvence", desc: "Frank Kern přístup" },
              { icon: "🎯", name: "Landing Page", desc: "Hook-Story-Offer" },
              { icon: "🔍", name: "SEO Obsah", desc: "E-E-A-T + konverze" },
              { icon: "📢", name: "Ads Expert", desc: "Meta + Google" },
              { icon: "🧲", name: "Lead Magnet", desc: "List building" },
              { icon: "🎙️", name: "Webinar Script", desc: "Perfect Webinar" },
            ].map(agent => (
              <div key={agent.name} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all">
                <div className="text-2xl mb-2">{agent.icon}</div>
                <div className="font-semibold text-sm text-white">{agent.name}</div>
                <div className="text-violet-300 text-xs mt-0.5">{agent.desc}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
              <blockquote className="text-violet-100 text-lg italic">
                „Bez Brand Memory je to jako kdybyste každé ráno přišli do agentury a museli novému stážistovi vysvětlovat, co děláte, komu prodáváte a jak mluvíte. S Brand Memory přijdete — a tým už VÍ."
              </blockquote>
            </div>
            <a href="/agents">
              <Button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-4 text-base rounded-full shadow-lg shadow-violet-900/40">
                Vyzkoušet AI Agenty zdarma →
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 text-center mb-12">Často kladené otázky</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaqs(p => ({ ...p, [i]: !p[i] }))}
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaqs[i] ? "rotate-180" : ""}`} />
                </button>
                {openFaqs[i] && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="text-violet-600 font-medium text-sm hover:text-violet-700 flex items-center gap-1 mx-auto" onClick={scrollToContact}>
              Zobrazit více otázek <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" ref={contactRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Domluvme si konzultaci</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Vyplňte formulář a my se vám ozveme do 24 hodin s konkrétním návrhem a cenou. Konzultace je zdarma a nezávazná.
            </p>
            <div className="space-y-4">
              {[
                { icon: "✅", title: "Návrh webu zdarma", desc: "Ukážeme vám, jak by váš web mohl vypadat, ještě před podpisem smlouvy." },
                { icon: "💳", title: "30% záloha, zbytek po spuštění", desc: "Platíte až když jste spokojeni s výsledkem." },
                { icon: "⚡", title: "Hotovo za 1–2 týdny", desc: "Žádné měsíce čekání. Rychlá realizace bez kompromisů." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 p-4 bg-violet-50 rounded-xl">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-100">
            <h3 className="font-bold text-slate-900 text-xl mb-6">Vyplňte poptávku</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">Jméno *</Label>
                  <Input id="name" placeholder="Vaše jméno" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email *</Label>
                  <Input id="email" type="email" placeholder="vas@email.cz" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="mt-1 rounded-xl" />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Telefon</Label>
                <Input id="phone" type="tel" placeholder="+420 123 456 789" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="package" className="text-sm font-medium text-slate-700">Jaký balíček vás zajímá? *</Label>
                <Select value={formData.packageType} onValueChange={v => setFormData({ ...formData, packageType: v })}>
                  <SelectTrigger id="package" className="mt-1 rounded-xl">
                    <SelectValue placeholder="Vyberte balíček" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lite-web">Lite Web (3 490 Kč)</SelectItem>
                    <SelectItem value="basic-web">Basic Web (4 999 Kč)</SelectItem>
                    <SelectItem value="web-lead-gen">Web + Lead Gen (6 990 Kč)</SelectItem>
                    <SelectItem value="web-automation">Web + Automatizace (9 990 Kč)</SelectItem>
                    <SelectItem value="konzultace">Pouze konzultace (zdarma)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="business" className="text-sm font-medium text-slate-700">O vaší firmě</Label>
                <Textarea id="business" placeholder="Čím se zabýváte? Co od webu očekáváte?" value={formData.businessDescription} onChange={e => setFormData({ ...formData, businessDescription: e.target.value })} rows={3} className="mt-1 rounded-xl resize-none" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl py-3 text-base active:scale-95 transition-transform">
                {isSubmitting ? "Odesílám..." : "Odeslat poptávku →"}
              </Button>
              <p className="text-xs text-slate-400 text-center">Ozveme se do 24 hodin. Konzultace je zdarma a nezávazná.</p>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a0520] text-white/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2">
            <img src="/manus-storage/optivio-logo_d4a4757c.png" alt="OPTIVIO" className="h-8" />
          </div>
              <p className="text-sm leading-relaxed">Webová agentura zaměřená na české firmy a živnostníky. Weby, automatizace, LeadOS.</p>
              <div className="flex gap-3 mt-4">
                {["LinkedIn", "Facebook", "Instagram"].map(s => (
                  <a key={s} href="#" className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-xs transition-colors">{s[0]}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Produkty</h4>
              <ul className="space-y-2 text-sm">
                {["Tvorba webu", "Lead Generation", "Automatizace", "LeadOS SaaS"].map(i => (
                  <li key={i}><a href="#" className="hover:text-white transition-colors">{i}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Obory</h4>
              <ul className="space-y-2 text-sm">
                {["Kavárny & restaurace", "Kadeřnictví & salony", "Řemeslníci", "E-shopy"].map(i => (
                  <li key={i}><a href="#" className="hover:text-white transition-colors">{i}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Kontakt</h4>
              <ul className="space-y-2 text-sm">
                <li>info@optivio.cz</li>
                <li>+420 XXX XXX XXX</li>
                <li><a href="#" className="hover:text-white transition-colors">Případové studie</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 OPTIVIO. Všechna práva vyhrazena.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Zásady ochrany osobních údajů</a>
              <a href="#" className="hover:text-white transition-colors">Obchodní podmínky</a>
            </div>
          </div>
        </div>
      </footer>

      {/* AI prodejní chatbot */}
      <SalesChatWidget />
    </div>
  );
}
