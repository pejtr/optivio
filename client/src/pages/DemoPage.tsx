import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ChevronRight, Phone, Mail, MapPin, Clock, Star, CheckCircle, ShoppingCart, Play, Zap } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DemoData {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  service1: string; price1: string;
  service2: string; price2: string;
  service3: string; price3: string;
  hours: string;
  cta: string;
}

interface Template {
  id: string;
  name: string;
  emoji: string;
  niche: string;
  palette: string;
  bg: string;
  accent: string;
  defaults: DemoData;
}

// ─── Templates metadata ───────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  {
    id: "kavarna",
    name: "Kavárna",
    emoji: "☕",
    niche: "Restaurace & Café",
    palette: "Teplá amber/hnědá",
    bg: "#FFF8F0",
    accent: "#D97706",
    defaults: {
      businessName: "Café Momento",
      tagline: "Kde každý šálek vypráví příběh.",
      phone: "+420 731 123 456",
      email: "hello@cafemomento.cz",
      address: "Náměstí Míru 12, Praha 2",
      description: "Útulná kavárna v srdci Prahy, kde se setkávají milovníci kávy, domácích dortů a dobré konverzace.",
      service1: "Filtrovaná káva", price1: "65 Kč",
      service2: "Domácí dort", price2: "89 Kč",
      service3: "Snídaňový set", price3: "185 Kč",
      hours: "Po–Pá 7:00–19:00 · So–Ne 8:00–18:00",
      cta: "Rezervovat stůl",
    },
  },
  {
    id: "kadernictvi",
    name: "Kadeřnictví",
    emoji: "✂️",
    niche: "Krása & Péče",
    palette: "Rose/pastelová",
    bg: "#FFF0F5",
    accent: "#DB2777",
    defaults: {
      businessName: "Studio Rose",
      tagline: "Váš styl, naše vášeň.",
      phone: "+420 605 987 654",
      email: "objednavky@studiorose.cz",
      address: "Štefánikova 44, Brno",
      description: "Moderní kadeřnický salon s 10 lety zkušeností. Střihy, barvy, melíry a péče na míru každému.",
      service1: "Střih + fén", price1: "390 Kč",
      service2: "Balayage/Melír", price2: "1 290 Kč",
      service3: "Keratinová péče", price3: "890 Kč",
      hours: "Út–Pá 9:00–18:00 · So 8:00–14:00",
      cta: "Objednat termín",
    },
  },
  {
    id: "elektrikar",
    name: "Elektrikář",
    emoji: "⚡",
    niche: "Řemeslo & Služby",
    palette: "Navy/oranžová",
    bg: "#F0F4FF",
    accent: "#EA580C",
    defaults: {
      businessName: "ELKO Novák",
      tagline: "Spolehlivý elektrikář. Do 2 hodin u vás.",
      phone: "+420 777 321 654",
      email: "info@elkonovak.cz",
      address: "Ostrava a okolí (30 km)",
      description: "Certifikovaný elektrikář s 15 lety praxe. Rozvody, revize, havarijní výjezdy. Záruka na práci 5 let.",
      service1: "Revize elektroinstalace", price1: "od 1 200 Kč",
      service2: "Nový rozvod", price2: "od 3 500 Kč",
      service3: "Havarijní výjezd 24/7", price3: "od 800 Kč",
      hours: "Po–Pá 7:00–17:00 · Havarijní linka 24/7",
      cta: "Zavolat nyní",
    },
  },
  {
    id: "fitness",
    name: "Fitness",
    emoji: "💪",
    niche: "Sport & Zdraví",
    palette: "Tmavá/limetkově zelená",
    bg: "#050F05",
    accent: "#84CC16",
    defaults: {
      businessName: "ProFit Training",
      tagline: "Výsledky za 90 dní — nebo vrátíme peníze.",
      phone: "+420 720 555 333",
      email: "trenink@profitraining.cz",
      address: "Online + Praha 6",
      description: "Osobní trenér s certifikací NASM. Tréninky online i v terénu. Výživový plán v ceně. Přes 200 spokojených klientů.",
      service1: "1 trénink (60 min)", price1: "890 Kč",
      service2: "Měsíční program", price2: "4 990 Kč",
      service3: "Online plán + výživa", price3: "1 990 Kč",
      hours: "Rezervace 24/7 online",
      cta: "Chci se zapsat",
    },
  },
  {
    id: "reality",
    name: "Reality",
    emoji: "🏠",
    niche: "Reality & Finance",
    palette: "Čistá slate/zlatá",
    bg: "#F8F9FA",
    accent: "#B45309",
    defaults: {
      businessName: "Reality Procházka",
      tagline: "Prodáme váš byt o 12 % výše než průměr trhu.",
      phone: "+420 800 123 456",
      email: "jan.prochazka@realtyprocházka.cz",
      address: "Praha & Středočeský kraj",
      description: "Realitní makléř s 18 lety zkušeností. Specializace na rodinné domy a byty v Praze. Bezplatná odhad nemovitosti.",
      service1: "Odhad nemovitosti", price1: "ZDARMA",
      service2: "Prodej bytu/domu", price2: "3 % z ceny",
      service3: "Pronájem", price3: "1 nájemné",
      hours: "Po–So 8:00–18:00 · Neděle dle dohody",
      cta: "Bezplatný odhad",
    },
  },
  {
    id: "lekar",
    name: "Lékař",
    emoji: "🩺",
    niche: "Zdravotnictví",
    palette: "Bílá/teal",
    bg: "#F0FDFA",
    accent: "#0D9488",
    defaults: {
      businessName: "MUDr. Jana Nováková",
      tagline: "Péče, které můžete věřit.",
      phone: "+420 224 567 890",
      email: "objednavky@drnovakova.cz",
      address: "Vinohradská 15, Praha 2",
      description: "Praktická lékařka pro dospělé. Přijímáme nové pacienty. Objednání online, výsledky v den návštěvy.",
      service1: "Preventivní prohlídka", price1: "ZDARMA (ZP)",
      service2: "Soukromá konzultace", price2: "1 200 Kč",
      service3: "Telefonická konzultace", price3: "350 Kč",
      hours: "Po,St,Pá 8:00–12:00 · Út,Čt 13:00–17:00",
      cta: "Objednat se online",
    },
  },
  {
    id: "eshop",
    name: "E-shop",
    emoji: "🛒",
    niche: "E-commerce",
    palette: "Fialová/korálová",
    bg: "#FAF0FF",
    accent: "#7C3AED",
    defaults: {
      businessName: "Přírodní Svět",
      tagline: "100% přírodní produkty. Rychle. Spolehlivě.",
      phone: "+420 800 NATURAL",
      email: "info@prirodni-svet.cz",
      address: "Doručujeme po celé ČR",
      description: "Český e-shop s prověřenými přírodními produkty. Více než 500 položek, doprava zdarma nad 800 Kč. Vrácení do 30 dní.",
      service1: "Bio kosmetika", price1: "od 189 Kč",
      service2: "Doplňky stravy", price2: "od 299 Kč",
      service3: "Dárková sada", price3: "od 690 Kč",
      hours: "Expedice Po–Pá · Doručení 1–2 dny",
      cta: "Přejít do obchodu",
    },
  },
  {
    id: "kurzy",
    name: "Online kurzy",
    emoji: "🎓",
    niche: "Vzdělávání",
    palette: "Indigo/žlutá",
    bg: "#F5F0FF",
    accent: "#4F46E5",
    defaults: {
      businessName: "AkademieProfi",
      tagline: "Naučíme vás to, co škola nestihla.",
      phone: "+420 775 888 000",
      email: "info@akademieprofi.cz",
      address: "100% online",
      description: "Online vzdělávací platforma s 30+ kurzy v oblasti marketingu, podnikání a produktivity. Certifikát po dokončení.",
      service1: "Marketing Pro", price1: "4 990 Kč",
      service2: "Podnikání od A do Z", price2: "7 990 Kč",
      service3: "AI Nástroje 2025", price3: "2 490 Kč",
      hours: "Přístup 24/7, doživotní",
      cta: "Začít zdarma",
    },
  },
];

// ─── Template preview components ──────────────────────────────────────────────

function KavarnaTemplate({ d }: { d: DemoData }) {
  return (
    <div className="bg-[#FFF8F0] min-h-screen font-sans text-[#1C1008]">
      <nav className="bg-[#D97706] px-6 py-3 flex justify-between items-center">
        <span className="font-extrabold text-white text-lg">☕ {d.businessName}</span>
        <span className="text-amber-100 text-xs">{d.phone}</span>
      </nav>
      <div className="px-6 py-12 text-center bg-gradient-to-b from-[#FFF0D0] to-[#FFF8F0]">
        <p className="text-amber-700 text-xs font-semibold tracking-widest uppercase mb-2">Vítejte</p>
        <h1 className="text-3xl font-extrabold text-[#7C3400] mb-3">{d.businessName}</h1>
        <p className="text-[#92400E] text-base italic mb-6">"{d.tagline}"</p>
        <button className="bg-[#D97706] text-white rounded-full px-6 py-2.5 text-sm font-bold hover:bg-amber-600 transition-colors">{d.cta}</button>
      </div>
      <div className="px-6 py-8 max-w-lg mx-auto">
        <h2 className="text-center font-extrabold text-lg text-[#7C3400] mb-4">Nabídka</h2>
        <div className="space-y-3">
          {[[d.service1, d.price1], [d.service2, d.price2], [d.service3, d.price3]].map(([s, p]) => (
            <div key={s} className="flex justify-between items-center border-b border-amber-200 pb-3">
              <span className="text-[#78350F] text-sm">{s}</span>
              <span className="font-bold text-amber-700 text-sm">{p}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[#92400E] text-sm text-center leading-relaxed">{d.description}</p>
      </div>
      <div className="bg-[#7C3400] text-amber-100 px-6 py-6 text-center">
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="flex items-center justify-center gap-2"><Clock className="w-4 h-4" />{d.hours}</span>
          <span className="flex items-center justify-center gap-2"><MapPin className="w-4 h-4" />{d.address}</span>
          <span className="flex items-center justify-center gap-2"><Phone className="w-4 h-4" />{d.phone}</span>
        </div>
      </div>
    </div>
  );
}

function KadernictviTemplate({ d }: { d: DemoData }) {
  return (
    <div className="bg-[#FFF0F5] min-h-screen font-sans">
      <nav className="bg-white border-b border-pink-100 px-6 py-3 flex justify-between items-center">
        <span className="font-extrabold text-[#DB2777] text-lg">✂️ {d.businessName}</span>
        <button className="bg-[#DB2777] text-white rounded-full px-4 py-1.5 text-xs font-bold">{d.cta}</button>
      </nav>
      <div className="px-6 py-14 text-center">
        <h1 className="text-3xl font-extrabold text-[#831843] mb-2">{d.businessName}</h1>
        <p className="text-pink-500 text-sm mb-6 italic">{d.tagline}</p>
        <div className="flex justify-center gap-1 mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-[#DB2777] text-[#DB2777]" />)}
          <span className="text-xs text-pink-400 ml-2 self-center">127 recenzí</span>
        </div>
        <p className="text-[#9D174D] text-sm max-w-xs mx-auto">{d.description}</p>
      </div>
      <div className="px-6 pb-8">
        <h2 className="text-center font-extrabold text-[#831843] mb-4">Ceník</h2>
        <div className="grid gap-3 max-w-sm mx-auto">
          {[[d.service1, d.price1], [d.service2, d.price2], [d.service3, d.price3]].map(([s, p]) => (
            <div key={s} className="bg-white rounded-2xl border border-pink-100 p-4 flex justify-between items-center shadow-sm">
              <span className="text-[#9D174D] text-sm font-medium">{s}</span>
              <span className="bg-[#FDF2F8] text-[#DB2777] font-bold text-sm px-2 py-0.5 rounded-full">{p}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#DB2777] text-white px-6 py-5 text-center">
        <p className="text-xs opacity-80 mb-1">{d.address} · {d.hours}</p>
        <p className="text-sm font-bold">{d.phone}</p>
      </div>
    </div>
  );
}

function ElektrikarTemplate({ d }: { d: DemoData }) {
  return (
    <div className="bg-[#0F172A] min-h-screen font-sans text-white">
      <nav className="bg-[#EA580C] px-6 py-3 flex justify-between items-center">
        <span className="font-extrabold text-white text-lg">⚡ {d.businessName}</span>
        <span className="text-orange-100 text-xs font-bold">{d.phone}</span>
      </nav>
      <div className="px-6 py-12 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5 text-xs text-orange-400 mb-4 font-semibold">
          ⚡ HAVARIJNÍ LINKA 24/7
        </div>
        <h1 className="text-3xl font-extrabold mb-2">{d.businessName}</h1>
        <p className="text-orange-400 text-sm mb-6">{d.tagline}</p>
        <button className="bg-[#EA580C] text-white rounded-xl px-6 py-3 font-bold text-sm hover:bg-orange-600 transition-colors">{d.cta}</button>
      </div>
      <div className="px-6 pb-8 max-w-lg mx-auto">
        <h2 className="font-extrabold text-orange-400 mb-4 text-sm uppercase tracking-widest">Služby</h2>
        <div className="space-y-3">
          {[[d.service1, d.price1], [d.service2, d.price2], [d.service3, d.price3]].map(([s, p]) => (
            <div key={s} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-sm text-white/80">{s}</span>
              </div>
              <span className="text-orange-400 font-bold text-sm">{p}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-white/40 text-xs leading-relaxed text-center">{d.description}</p>
        <p className="mt-3 text-white/30 text-xs text-center">{d.address} · {d.hours}</p>
      </div>
    </div>
  );
}

function FitnessTemplate({ d }: { d: DemoData }) {
  return (
    <div className="bg-[#050F05] min-h-screen font-sans text-white">
      <nav className="border-b border-lime-900/30 px-6 py-3 flex justify-between items-center">
        <span className="font-extrabold text-lime-400 text-lg">💪 {d.businessName}</span>
        <button className="bg-lime-400 text-black rounded-full px-4 py-1.5 text-xs font-extrabold">{d.cta}</button>
      </nav>
      <div className="px-6 py-14 text-center">
        <div className="inline-block bg-lime-400/10 border border-lime-400/30 rounded-full px-3 py-1 text-xs text-lime-400 mb-4 font-bold uppercase tracking-widest">
          Garance výsledků
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-3 leading-tight">{d.businessName}</h1>
        <p className="text-lime-400 text-sm mb-4">{d.tagline}</p>
        <p className="text-white/40 text-xs max-w-xs mx-auto mb-6">{d.description}</p>
      </div>
      <div className="px-6 pb-8 max-w-sm mx-auto">
        <div className="grid gap-3">
          {[[d.service1, d.price1], [d.service2, d.price2], [d.service3, d.price3]].map(([s, p], i) => (
            <div key={s} className={`rounded-2xl p-4 border ${i === 1 ? "bg-lime-400/10 border-lime-400/40" : "bg-white/5 border-white/10"}`}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">{s}</span>
                <span className={`font-extrabold text-sm ${i === 1 ? "text-lime-400" : "text-white/60"}`}>{p}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-white/20 text-xs text-center mt-4">{d.hours} · {d.phone}</p>
      </div>
    </div>
  );
}

function RealityTemplate({ d }: { d: DemoData }) {
  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans text-[#1A1A2E]">
      <nav className="bg-[#1A1A2E] px-6 py-3 flex justify-between items-center">
        <span className="font-extrabold text-white text-lg">🏠 {d.businessName}</span>
        <span className="text-amber-400 text-xs font-semibold">{d.phone}</span>
      </nav>
      <div className="px-6 py-12 bg-gradient-to-r from-[#1A1A2E] to-[#2D2B55] text-white text-center">
        <h1 className="text-2xl font-extrabold mb-2">{d.businessName}</h1>
        <p className="text-amber-400 text-sm mb-4 italic">"{d.tagline}"</p>
        <button className="bg-amber-500 text-white rounded-lg px-6 py-2.5 text-sm font-bold hover:bg-amber-600 transition-colors">{d.cta}</button>
      </div>
      <div className="px-6 py-8 max-w-lg mx-auto">
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          {[["18 let", "praxe"], ["500+", "prodejů"], ["98%", "spokojenost"]].map(([v, l]) => (
            <div key={l} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <div className="text-xl font-extrabold text-[#B45309]">{v}</div>
              <div className="text-xs text-slate-400 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        <h2 className="font-extrabold text-[#1A1A2E] mb-3">Služby</h2>
        {[[d.service1, d.price1], [d.service2, d.price2], [d.service3, d.price3]].map(([s, p]) => (
          <div key={s} className="flex justify-between py-2.5 border-b border-slate-100">
            <span className="text-sm text-slate-600">{s}</span>
            <span className="text-sm font-bold text-[#B45309]">{p}</span>
          </div>
        ))}
        <p className="mt-4 text-slate-400 text-xs">{d.address} · {d.hours}</p>
      </div>
    </div>
  );
}

function LekarTemplate({ d }: { d: DemoData }) {
  return (
    <div className="bg-[#F0FDFA] min-h-screen font-sans">
      <nav className="bg-white border-b border-teal-100 px-6 py-3 flex justify-between items-center">
        <span className="font-extrabold text-[#0D9488] text-base">🩺 {d.businessName}</span>
        <button className="bg-[#0D9488] text-white rounded-lg px-4 py-1.5 text-xs font-bold">{d.cta}</button>
      </nav>
      <div className="px-6 py-10 text-center bg-white border-b border-teal-50">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🩺</div>
        <h1 className="text-2xl font-extrabold text-[#134E4A] mb-1">{d.businessName}</h1>
        <p className="text-teal-600 text-sm mb-1 italic">{d.tagline}</p>
        <p className="text-slate-400 text-xs">{d.address}</p>
      </div>
      <div className="px-6 py-8 max-w-sm mx-auto">
        <h2 className="font-extrabold text-[#134E4A] mb-4 text-sm uppercase tracking-wide">Ordinační hodiny</h2>
        <div className="bg-white rounded-2xl border border-teal-100 p-4 mb-6 flex items-center gap-3 shadow-sm">
          <Clock className="w-4 h-4 text-teal-500 shrink-0" />
          <span className="text-xs text-slate-600">{d.hours}</span>
        </div>
        <h2 className="font-extrabold text-[#134E4A] mb-3 text-sm uppercase tracking-wide">Ceník</h2>
        {[[d.service1, d.price1], [d.service2, d.price2], [d.service3, d.price3]].map(([s, p]) => (
          <div key={s} className="flex justify-between items-center py-3 border-b border-teal-50">
            <span className="text-sm text-slate-600">{s}</span>
            <span className="text-sm font-bold text-[#0D9488]">{p}</span>
          </div>
        ))}
        <p className="mt-4 text-slate-400 text-xs leading-relaxed">{d.description}</p>
      </div>
    </div>
  );
}

function EshopTemplate({ d }: { d: DemoData }) {
  return (
    <div className="bg-[#FAF0FF] min-h-screen font-sans">
      <nav className="bg-[#7C3AED] px-6 py-3 flex justify-between items-center">
        <span className="font-extrabold text-white text-lg">🛒 {d.businessName}</span>
        <div className="flex items-center gap-3">
          <span className="text-purple-200 text-xs">{d.phone}</span>
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
      </nav>
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-6 py-10 text-white text-center">
        <h1 className="text-2xl font-extrabold mb-2">{d.businessName}</h1>
        <p className="text-purple-200 text-sm mb-4">{d.tagline}</p>
        <button className="bg-white text-[#7C3AED] rounded-full px-6 py-2 text-sm font-extrabold">{d.cta}</button>
      </div>
      <div className="px-6 py-8 max-w-lg mx-auto">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[[d.service1, d.price1, "🌿"], [d.service2, d.price2, "💊"], [d.service3, d.price3, "🎁"]].map(([s, p, e]) => (
            <div key={String(s)} className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm text-center">
              <div className="text-2xl mb-2">{String(e)}</div>
              <div className="text-xs text-slate-600 mb-1 font-medium leading-tight">{String(s)}</div>
              <div className="text-[#7C3AED] font-extrabold text-sm">{String(p)}</div>
              <button className="mt-2 w-full bg-[#7C3AED] text-white rounded-lg text-[10px] py-1 font-bold">Do košíku</button>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 text-xs text-slate-400">
          {["🚚 Doprava zdarma", "↩️ 30 dní vrácení", "🔒 Bezpečná platba"].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <p className="mt-4 text-slate-400 text-xs text-center">{d.address}</p>
      </div>
    </div>
  );
}

function KurzymTemplate({ d }: { d: DemoData }) {
  return (
    <div className="bg-[#F5F0FF] min-h-screen font-sans">
      <nav className="bg-[#4F46E5] px-6 py-3 flex justify-between items-center">
        <span className="font-extrabold text-white text-lg">🎓 {d.businessName}</span>
        <button className="bg-yellow-400 text-black rounded-full px-4 py-1.5 text-xs font-extrabold">{d.cta}</button>
      </nav>
      <div className="px-6 py-12 text-center bg-gradient-to-b from-[#EDE9FF] to-[#F5F0FF]">
        <div className="inline-flex items-center gap-1.5 bg-yellow-100 border border-yellow-200 rounded-full px-3 py-1 text-xs text-yellow-800 font-semibold mb-4">
          <Play className="w-3 h-3 fill-yellow-600 text-yellow-600" /> 30+ kurzů dostupných
        </div>
        <h1 className="text-3xl font-extrabold text-[#312E81] mb-2">{d.businessName}</h1>
        <p className="text-indigo-600 text-sm mb-4 italic">{d.tagline}</p>
        <p className="text-slate-500 text-xs max-w-xs mx-auto mb-6">{d.description}</p>
      </div>
      <div className="px-6 pb-8 max-w-sm mx-auto">
        <div className="grid gap-3">
          {[[d.service1, d.price1, "📊"], [d.service2, d.price2, "🚀"], [d.service3, d.price3, "🤖"]].map(([s, p, e], i) => (
            <div key={String(s)} className={`rounded-2xl p-4 border ${i === 1 ? "bg-[#4F46E5] text-white border-[#4F46E5]" : "bg-white border-indigo-100"}`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg mb-0.5">{String(e)}</div>
                  <div className={`text-sm font-semibold ${i === 1 ? "text-white" : "text-[#312E81]"}`}>{String(s)}</div>
                </div>
                <div className={`text-right`}>
                  <div className={`font-extrabold ${i === 1 ? "text-yellow-300" : "text-[#4F46E5]"}`}>{String(p)}</div>
                  <div className={`text-xs ${i === 1 ? "text-indigo-200" : "text-slate-400"}`}>jednorázově</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-xs text-center mt-4">{d.hours}</p>
      </div>
    </div>
  );
}

const RENDERERS: Record<string, React.ComponentType<{ d: DemoData }>> = {
  kavarna: KavarnaTemplate,
  kadernictvi: KadernictviTemplate,
  elektrikar: ElektrikarTemplate,
  fitness: FitnessTemplate,
  reality: RealityTemplate,
  lekar: LekarTemplate,
  eshop: EshopTemplate,
  kurzy: KurzymTemplate,
};

// ─── Form field ────────────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all"
      />
    </div>
  );
}

// ─── Main DemoPage ─────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [selected, setSelected] = useState<Template | null>(null);
  const [data, setData] = useState<DemoData | null>(null);

  const selectTemplate = useCallback((t: Template) => {
    setSelected(t);
    setData({ ...t.defaults });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const updateField = useCallback(<K extends keyof DemoData>(key: K, value: DemoData[K]) => {
    setData(prev => prev ? { ...prev, [key]: value } : prev);
  }, []);

  const Renderer = selected ? RENDERERS[selected.id] : null;

  // ── Customizer view ──────────────────────────────────────────────────────────
  if (selected && data && Renderer) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSelected(null); setData(null); }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Zpět na šablony
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-white text-sm font-semibold">{selected.emoji} {selected.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:block">Zadejte svá data — náhled se aktualizuje živě</span>
            <a href="/#pricing">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white text-xs rounded-full px-4">
                Objednat tento web <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </a>
          </div>
        </div>

        {/* Split layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Form panel */}
          <div className="w-80 shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-4 space-y-3">
              <div className="pb-2 border-b border-slate-100 mb-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Základní info</p>
              </div>
              <Field label="Název firmy" value={data.businessName} onChange={v => updateField("businessName", v)} />
              <Field label="Tagline / slogan" value={data.tagline} onChange={v => updateField("tagline", v)} placeholder="Krátký výstižný slogan" />
              <Field label="Telefon" value={data.phone} onChange={v => updateField("phone", v)} />
              <Field label="E-mail" value={data.email} onChange={v => updateField("email", v)} />
              <Field label="Adresa / oblast" value={data.address} onChange={v => updateField("address", v)} />
              <Field label="Otevírací doba" value={data.hours} onChange={v => updateField("hours", v)} />

              <div className="pb-2 border-b border-slate-100 pt-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Popis</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">O nás</label>
                <textarea
                  value={data.description}
                  onChange={e => updateField("description", e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all resize-none"
                />
              </div>

              <div className="pb-2 border-b border-slate-100 pt-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Služby & ceny</p>
              </div>
              {([["service1", "price1"], ["service2", "price2"], ["service3", "price3"]] as const).map(([sKey, pKey], i) => (
                <div key={sKey} className="flex gap-2">
                  <div className="flex-1">
                    <Field label={`Služba ${i + 1}`} value={data[sKey]} onChange={v => updateField(sKey, v)} />
                  </div>
                  <div className="w-24">
                    <Field label="Cena" value={data[pKey]} onChange={v => updateField(pKey, v)} placeholder="990 Kč" />
                  </div>
                </div>
              ))}

              <div className="pb-2 border-b border-slate-100 pt-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Tlačítko CTA</p>
              </div>
              <Field label="Text tlačítka" value={data.cta} onChange={v => updateField("cta", v)} placeholder="Objednat" />

              <div className="pt-4 pb-2">
                <a href="/#pricing" className="block w-full">
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl">
                    Objednat tento web →
                  </Button>
                </a>
                <p className="text-[10px] text-slate-400 text-center mt-2">Hotovo do 5 pracovních dní · Záruka spokojenosti</p>
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <div className="flex-1 overflow-auto bg-slate-100 flex flex-col items-center py-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex gap-1.5">
                {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => (
                  <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-1.5 text-xs text-slate-400 flex items-center gap-2 min-w-[200px]">
                🔒 {data.businessName.toLowerCase().replace(/\s+/g, "")}.cz
              </div>
            </div>
            <div
              className="bg-white shadow-2xl overflow-hidden rounded-lg"
              style={{ width: 390, transformOrigin: "top center" }}
            >
              <Renderer d={data} />
            </div>
            <p className="mt-4 text-slate-400 text-xs text-center">Mobilní náhled · 390px</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Gallery view ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-violet-400">OPT</span>IVIO
          </a>
          <div className="flex items-center gap-4 text-sm">
            <a href="/agents" className="text-violet-400 hover:text-violet-200">✨ AI Agenti</a>
            <a href="/" className="text-white/50 hover:text-white">← Zpět</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-violet-400/30 bg-violet-400/5 rounded-full px-4 py-1.5 text-sm text-violet-400 mb-6 font-semibold">
            <Zap className="w-3.5 h-3.5" /> 8 niche šablon · Živý náhled · Vaše data
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-4 leading-tight">
            Vyzkoušejte svůj web<br />
            <span className="text-violet-400">zdarma.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-4">
            Vyberte šablonu pro váš obor, vyplňte svá data — a ihned uvidíte, jak bude váš web vypadat.
            Žádná registrace, žádná kreditní karta.
          </p>
          <div className="flex justify-center gap-6 text-sm text-white/30">
            {["✓ Živý náhled", "✓ Vaše vlastní data", "✓ Do 5 dní hotovo"].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Template gallery */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-white/40 text-sm uppercase tracking-widest mb-10">Vyberte svůj obor</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                className="group relative rounded-2xl border border-white/10 bg-white/3 overflow-hidden text-left hover:border-white/25 hover:bg-white/6 transition-all hover:-translate-y-1"
              >
                {/* Template color preview */}
                <div
                  className="h-40 relative overflow-hidden"
                  style={{ background: t.bg }}
                >
                  {/* Mini mockup */}
                  <div className="absolute inset-2 rounded-lg overflow-hidden shadow-lg border border-white/10" style={{ fontSize: "22%" }}>
                    {(() => {
                      const R = RENDERERS[t.id];
                      return <R d={t.defaults} />;
                    })()}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{t.emoji}</span>
                    <span className="font-bold text-white text-sm">{t.name}</span>
                  </div>
                  <p className="text-white/40 text-xs mb-3">{t.niche} · {t.palette}</p>
                  <div className="flex items-center gap-1.5 text-violet-400 text-xs font-semibold group-hover:gap-2.5 transition-all">
                    Vyzkoušet <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            Nevidíte svůj obor? <span className="text-violet-400">Nevadí.</span>
          </h2>
          <p className="text-white/40 mb-8">
            Vytvoříme vám web na míru pro jakýkoliv byznys. Stačí nám říct, co potřebujete.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#pricing">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3 rounded-full">
                Objednat web na míru →
              </Button>
            </a>
            <a href="/agents">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-3">
                ✨ Vyzkoušet AI Agenty
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-white/20 text-sm border-t border-white/5">
        © {new Date().getFullYear()} OPTIVIO · <a href="/" className="hover:text-white/40">Domů</a> · <a href="/agents" className="text-violet-400 hover:text-violet-300">AI Agenti</a>
      </footer>
    </div>
  );
}
