import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Star, Check, ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessDescription: "",
    packageType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  const createInquiry = trpc.inquiries.create.useMutation();

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Vyplňte prosím vaše jméno");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Vyplňte prosím platný email");
      return false;
    }
    if (!formData.packageType) {
      toast.error("Vyberte prosím balíček");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createInquiry.mutateAsync(formData);
      toast.success("Vaše poptávka byla odeslána! Brzy se vám ozveme.");
      setFormData({ name: "", email: "", phone: "", businessDescription: "", packageType: "" });
    } catch (error) {
      toast.error("Chyba při odesílání. Zkuste to prosím znovu.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const portfolioProjects = [
    {
      id: 1,
      title: "Kavárna Espresso",
      category: "Kavárna",
      location: "Praha",
      image: "☕",
      description: "Moderní web s rezervačním systémem",
      result: "30% nových zákazníků za měsíc",
      testimonial: "Web nám přinesl spoustu nových hostů. Lidé si mohou rezervovat přes web, což je skvělé.",
      author: "Petra Svobodová",
    },
    {
      id: 2,
      title: "Elektrikář Novák",
      category: "Služby",
      location: "Brno",
      image: "⚡",
      description: "Web s portfoliem a online formulářem",
      result: "50% zvýšení poptávek",
      testimonial: "Měl jsem obavu, že za 3 500 Kč dostanu něco odfláknutého. Opak byl pravdou — web vypadá lépe než u konkurence.",
      author: "Tomáš Novák",
    },
    {
      id: 3,
      title: "Kadeřnice Bella",
      category: "Kadeřnictví",
      location: "Plzeň",
      image: "✂️",
      description: "Web s online rezervací a galerií",
      result: "40% zvýšení rezervací",
      testimonial: "Do týdne jsem měla web hotový. Hned první měsíc mě přes něj kontaktovaly 3 nové zákaznice.",
      author: "Lenka Marková",
    },
  ];

  const faqs = [
    {
      q: "Jak dlouho trvá web?",
      a: "Základní web je hotový za 48 hodin od schválení designu. Složitější projekty s více funkcemi mohou trvat déle. Návrh vám pošleme do 48 hodin od objednávky."
    },
    {
      q: "Mohu si web sám upravit?",
      a: "Ano, web je postaven tak, aby jej mohl spravovat i bez technických znalostí. Poskytneme vám přístup k editoru a školení. Pokud si nebudete jisti, pomůžeme vám."
    },
    {
      q: "Jaké jsou skryté poplatky?",
      a: "Žádné. Cena, kterou vidíte, je finální. Měsíční provoz je 179 Kč. Není nic dalšího. Pokud chcete rozšíření, řekneme vám cenu předem."
    },
    {
      q: "Mohu si web později rozšířit?",
      a: "Samozřejmě. Můžete přidat nové stránky, funkce nebo integraci kdykoliv. Kontaktujte nás a domluvíme si cenu."
    },
    {
      q: "Co když se mi web nelíbí?",
      a: "Máte 14 dní na vrácení. Pokud se vám web nelíbí, vrátíme vám peníze. Bez otázek."
    },
    {
      q: "Jaké jsou měsíční náklady?",
      a: "Měsíční provoz je 179 Kč. To zahrnuje hosting, SSL certifikát a základní podporu. Nic dalšího."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">OPTIVIO</div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition">Ceny</a>
            <a href="#process" className="text-slate-600 hover:text-blue-600 transition">Jak to funguje</a>
            <a href="#portfolio" className="text-slate-600 hover:text-blue-600 transition">Portfolio</a>
            <a href="#niche" className="text-slate-600 hover:text-blue-600 transition">Balíčky</a>
            <a href="#leados" className="text-slate-600 hover:text-blue-600 transition">LeadOS</a>
            <a href="#faq" className="text-slate-600 hover:text-blue-600 transition">FAQ</a>
            <a href="#contact" className="text-slate-600 hover:text-blue-600 transition">Kontakt</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

          {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition">Ceny</a>
              <a href="#process" className="text-slate-600 hover:text-blue-600 transition">Jak to funguje</a>
              <a href="#portfolio" className="text-slate-600 hover:text-blue-600 transition">Portfolio</a>
              <a href="#niche" className="text-slate-600 hover:text-blue-600 transition">Balíčky</a>
              <a href="#leados" className="text-slate-600 hover:text-blue-600 transition">LeadOS</a>
              <a href="#faq" className="text-slate-600 hover:text-blue-600 transition">FAQ</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition" onClick={() => setMobileMenuOpen(false)}>Kontakt</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Profesionální web za <span className="text-blue-600">3 490 Kč</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8">
            Bez agentury. Bez dlouhého čekání. Bez skrytých poplatků. Návrh zdarma, platíte až po schválení.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Chci návrh zdarma
            </Button>
            <Button size="lg" variant="outline">
              Podívat se na příklady
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">Proč OPTIVIO?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-2 md:px-4 font-semibold text-slate-900">Kritérium</th>
                  <th className="text-center py-4 px-2 md:px-4 font-semibold text-blue-600">OPTIVIO</th>
                  <th className="text-center py-4 px-2 md:px-4 font-semibold text-slate-600">Tradiční agentura</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-2 md:px-4 text-slate-900 font-medium">Cena</td>
                  <td className="text-center py-4 px-2 md:px-4 text-blue-600 font-bold">3 490 Kč</td>
                  <td className="text-center py-4 px-2 md:px-4 text-slate-600">20 000+ Kč</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-2 md:px-4 text-slate-900 font-medium">Doba realizace</td>
                  <td className="text-center py-4 px-2 md:px-4 text-blue-600 font-bold">1–2 týdny</td>
                  <td className="text-center py-4 px-2 md:px-4 text-slate-600">1–3 měsíce</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-2 md:px-4 text-slate-900 font-medium">Záloha</td>
                  <td className="text-center py-4 px-2 md:px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-2 md:px-4 text-slate-600">50% předem</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-2 md:px-4 text-slate-900 font-medium">Originální design</td>
                  <td className="text-center py-4 px-2 md:px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-2 md:px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-2 md:px-4 text-slate-900 font-medium">Podpora v ceně</td>
                  <td className="text-center py-4 px-2 md:px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-2 md:px-4 text-slate-600">Dodatečně</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-slate-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Naše balíčky</h2>
          <p className="text-center text-slate-300 mb-4 text-lg">Vyberte si balíček, který vyhovuje vaší firmě</p>
          <p className="text-center text-slate-400 mb-12 text-sm">Vše jsou modulární — kdykoliv můžete přidat libovolné technologické komponenty (API, e-shop, chatbot, CRM, atd.)</p>

          <div className="grid md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Lite Web */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Lite Web</CardTitle>
                <CardDescription className="text-slate-400 text-sm">Základní web bez automatizace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-6">3 490 Kč</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Jednostránkový web
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Responzivní design
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    SEO optimalizace
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Kontaktní formulář
                  </li>
                </ul>
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white mb-2 text-sm">Vybrat</Button>
                <p className="text-xs text-slate-400 text-center">Měsíční provoz: 179 Kč</p>
              </CardContent>
            </Card>

            {/* Basic Web */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Basic Web</CardTitle>
                <CardDescription className="text-slate-400 text-sm">Profesionální web</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-6">4 999 Kč</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Vše z Lite Web
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Vícestrany web
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Galerie/Portfolio
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Blog (volitelně)
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2 text-sm">Vybrat</Button>
                <p className="text-xs text-slate-400 text-center">Měsíční provoz: 179 Kč</p>
              </CardContent>
            </Card>

            {/* Web + Lead Gen */}
            <Card className="bg-slate-800 border-blue-500 border-2">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="text-white text-lg">Web + Lead Gen</CardTitle>
                    <CardDescription className="text-slate-400 text-sm">Nejpopulárnější</CardDescription>
                  </div>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded flex-shrink-0">Doporučeno</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-6">6 990 Kč</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Vše z Basic Web
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Lead capture form
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Email automatizace
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Webhook integrace
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2 text-sm">Vybrat</Button>
                <p className="text-xs text-slate-400 text-center">Měsíční provoz: 179 Kč</p>
              </CardContent>
            </Card>

            {/* Web + Automation */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Web + Automatizace</CardTitle>
                <CardDescription className="text-slate-400 text-sm">Plná automatizace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-6">9 990 Kč</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Vše z Web + Lead Gen
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    LeadOS CRM
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    LinkedIn automatizace
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Email sequences
                  </li>
                </ul>
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white mb-2 text-sm">Vybrat</Button>
                <p className="text-xs text-slate-400 text-center">Měsíční provoz: 179 Kč</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">Jak to funguje?</h2>
        <div className="grid md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            { step: 1, title: "Vyplníte formulář", desc: "Řeknete nám o vaší firmě a co chcete" },
            { step: 2, title: "Dostanete návrh", desc: "Za 48 hodin vám pošleme design" },
            { step: 3, title: "Schválíte design", desc: "Bez zálohy, bez závazku" },
            { step: 4, title: "Web je live", desc: "Na vaší doméně, hned" },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm md:text-base">{item.desc}</p>
              {idx < 3 && <ArrowRight className="w-6 h-6 text-slate-300 mx-auto mt-6 hidden md:block" />}
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="bg-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">Naše projekty</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {portfolioProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition">
                <div className="h-40 md:h-48 bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center text-5xl md:text-6xl">
                  {project.image}
                </div>
                <CardHeader>
                  <CardTitle className="text-slate-900 text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.category}, {project.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-3 text-sm">{project.description}</p>
                  <p className="text-green-600 font-semibold text-sm mb-3">Výsledek: {project.result}</p>
                  <p className="text-slate-600 italic text-sm mb-2">"{project.testimonial}"</p>
                  <p className="text-slate-900 font-medium text-sm">— {project.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modulární Weby Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">Modulární weby — rozšiřitelné bez limitů</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-slate-600 text-center mb-8">
            Všechny naše weby jsou postaveny na modulární architektuře. To znamená, že můžete kdykoliv přidat jakýkoliv technologický komponent — API integraci, AI chatbot, payment gateway, CRM, e-shop, nebo cokoliv dalšího. Bez nutnosti přepisovat web od nuly.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {["API Integrace", "E-shop", "AI Chatbot", "CRM", "Payment Gateway", "Email Automation", "Social Media", "Analytics"].map((component, idx) => (
              <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-slate-900">{component}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Niche Packages Section */}
      <section id="niche" className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Niche Balíčky — Zaměřené na váš obor</h2>
          <p className="text-center text-slate-600 mb-12 text-lg">Přidejte si automatizaci speciálně pro váš typ podnikání. Od rezervací přes lead management až po faktury.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Café Pro", price: "1 290 Kč", niche: "Kavárny & Restaurace", features: ["Online rezervace", "Instagram auto-posting", "Google Reviews", "WhatsApp notifikace"] },
              { name: "Lead Elektro", price: "1 490 Kč", niche: "Elektrikáři", features: ["Lead capture", "WhatsApp notifikace", "Invoice generátor", "Kanban board"] },
              { name: "Beauty Booking", price: "990 Kč", niche: "Kadeřnice & Holič", features: ["Online booking", "SMS reminders", "Loyalty program", "Instagram Stories"] },
              { name: "Commerce Automation", price: "1 890 Kč", niche: "E-shopy", features: ["Inventory sync", "Abandoned cart", "Email marketing", "AI recommendations"] },
              { name: "Service Manager", price: "1 390 Kč", niche: "Služby", features: ["Online kalkulátor", "Automatická nabídka", "Invoice + platby", "WhatsApp komunikace"] },
              { name: "Gym Pro", price: "1 190 Kč", niche: "Fitness & Wellness", features: ["Membership management", "SMS reminders", "Booking tréninků", "Newsletter"] },
              { name: "Real Estate Pro", price: "1 790 Kč", niche: "Realitní kanceláře", features: ["Lead capture", "Virtuální prohlídka", "Automatické follow-up", "CRM"] },
              { name: "Medical Pro", price: "1 590 Kč", niche: "Lékaři & Zubaři", features: ["Online rezervace", "SMS reminders", "GDPR komunikace", "Recenze management"] },
              { name: "Coach Pro", price: "1 290 Kč", niche: "Školitel & Koučing", features: ["Kurzy booking", "Automatické emaily", "Certifikáty", "Feedback formuláře"] },
            ].map((pkg, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">{pkg.name}</CardTitle>
                  <CardDescription className="text-sm text-slate-500">{pkg.niche}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-4">{pkg.price}/měsíc</div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-6">Kombinujte balíčky podle potřeby. Všechny fungují s vaším webem bez dalších nákladů.</p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Vybrat balíček
            </Button>
          </div>
        </div>
      </section>

      {/* LeadOS Section */}
      <section id="leados" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Chcete vlastní lead generation systém?</h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              LeadOS je AI platforma pro generování leads, email automatizaci a CRM. Modulární architektura umožňuje integraci s jakýmkoliv systémem. Používáme ji interně, teď ji nabízíme i ostatním.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 mb-12">
              Vyzkoušet LeadOS zdarma
            </Button>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { tier: "Starter", price: "990 Kč", features: ["100 leads/měsíc", "Email enrichment", "Základní CRM"] },
                { tier: "Growth", price: "1 990 Kč", features: ["500 leads/měsíc", "Pokročilé enrichment", "Email sequences", "Webhook integrace"] },
                { tier: "Pro", price: "3 990 Kč", features: ["Unlimited leads", "Všechny funkce", "AI SDR Agent", "Prioritní support"] },
              ].map((plan, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                  <h3 className="text-2xl font-bold mb-2">{plan.tier}</h3>
                  <p className="text-3xl font-bold mb-6">{plan.price}</p>
                  <ul className="space-y-2 text-left text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Pricing Model Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Měsíční provoz a podpora</h2>
          <p className="text-center text-slate-600 mb-12 text-lg">Po spuštění webu si můžete přidat měsíční služby pro automatizaci a správu.</p>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Maintenance */}
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">Základní správa</CardTitle>
                  <CardDescription>Ideální pro malé weby</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-6">199 Kč/měsíc</div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      Monitoring webu 24/7
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      Bezpečnostní updaty
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      Backup dat
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      Email podpora
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Automation & Management */}
              <Card className="border-2 border-blue-600 relative">
                <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Populární</div>
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">Automatizace & správa</CardTitle>
                  <CardDescription>Nejčastěji volená možnost</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-6">1 000 Kč/měsíc</div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      Vše z Základní správy
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      Email automatizace
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      Lead management
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      WhatsApp notifikace
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      Telefonní podpora
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Niche balíčky</h3>
              <p className="text-slate-600 mb-6">Máte specifické potřeby? Nabízíme i speciální balíčky pro jednotlivé obory — od online rezervací přes invoice generátor až po AI chatboty. Ceny od 990 Kč/měsíc.</p>
              <a href="#niche" className="text-blue-600 font-semibold hover:text-blue-700 transition">Prohlédnout niche balíčky →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">Chcete začít?</h2>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Vyplňte formulář</CardTitle>
              <CardDescription>Brzy se vám ozveme s nabídkou</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Jméno *</Label>
                  <Input
                    id="name"
                    placeholder="Vaše jméno"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vas@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+420 123 456 789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="business">Popis vaší firmy</Label>
                  <Textarea
                    id="business"
                    placeholder="Řekněte nám o vaší firmě..."
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="package">Jaký balíček vás zajímá? *</Label>
                  <Select value={formData.packageType} onValueChange={(value) => setFormData({ ...formData, packageType: value })}>
                    <SelectTrigger id="package">
                      <SelectValue placeholder="Vyberte balíček" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lite-web">Lite Web (3 490 Kč)</SelectItem>
                      <SelectItem value="basic-web">Basic Web (4 999 Kč)</SelectItem>
                      <SelectItem value="web-lead-gen">Web + Lead Gen (6 990 Kč)</SelectItem>
                      <SelectItem value="web-automation">Web + Automatizace (9 990 Kč)</SelectItem>
                      <SelectItem value="leados">LeadOS SaaS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Odesílám..." : "Odeslat poptávku"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">Často kladené otázky</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <Collapsible key={idx} open={openFaqs[idx]} onOpenChange={() => toggleFaq(idx)}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between text-left h-auto py-4 px-4">
                    <span className="font-semibold text-slate-900">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${openFaqs[idx] ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 p-4 bg-white border border-slate-200 rounded-lg">
                  <p className="text-slate-600">{faq.a}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">OPTIVIO</h3>
              <p className="text-sm">Webová agentura zaměřená na české SMB.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produkty</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#pricing" className="hover:text-white">Weby</a></li>
                <li><a href="#leados" className="hover:text-white">LeadOS</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Společnost</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">O nás</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: info@optivio.cz</li>
                <li>Tel: +420 XXX XXX XXX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>&copy; 2026 OPTIVIO. Všechna práva vyhrazena.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
