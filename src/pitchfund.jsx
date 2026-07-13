import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Rocket, ArrowRight, ArrowLeft, Check, ChevronDown, Upload,
  Landmark, Users, Sparkles, Globe2
} from "lucide-react";

/* ============================================================
   MOTION PRIMITIVES
   1) useInView + <Reveal> — fade/slide-up when a section scrolls
      into the viewport (this is what makes "THE CONTEST" headline
      and cards feel like they animate in as you scroll).
   2) <Marquee> — an infinite horizontal scroll of duplicated text,
      the exact technique behind "celebrating 12 years celebrating
      12 years celebrating 12 years" repeating on Innopreneurs.
   ============================================================ */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(el);
          }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.2,.7,.2,1) ${delay}s, transform 0.7s cubic-bezier(.2,.7,.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Marquee({ text, bg, color, speed = 22 }) {
  return (
    <div style={{ background: bg, overflow: "hidden" }} className="py-3 relative">
      <style>{`
        @keyframes pf-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .pf-marquee-track { display: flex; width: max-content; animation: pf-marquee ${speed}s linear infinite; }
      `}</style>
      <div className="pf-marquee-track">
        {[0, 1].map((rep) => (
          <span key={rep} className="flex items-center">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="mx-6 text-sm font-black uppercase tracking-widest whitespace-nowrap"
                style={{ color, fontFamily: T.display }}
              >
                {text} &nbsp;✦
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Parallax hook — shifts a layer's Y position at a fraction of scroll speed,
   used on the hero's background scene so it drifts slower than the page. */
function useParallax(factor = 0.25) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      el.style.transform = `translateY(${rect.top * -factor}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor]);
  return ref;
}

/* ============================================================
   DESIGN TOKENS — same system as v1, reused for consistency
   ============================================================ */
const T = {
  ink: "#0B1220",
  ink2: "#141B2E",
  paper: "#FAF9F5",
  paperDim: "#F1EEE6",
  marigold: "#F5A623",
  ember: "#E4572E",
  teal: "#1FB8A6",
  line: "rgba(11,18,32,0.12)",
  lineLight: "rgba(250,249,245,0.16)",
  textDark: "#12172A",
  textDim: "#4B5266",
  display: "'Space Grotesk', 'Arial Narrow', sans-serif",
  body: "'Inter', system-ui, sans-serif",
};

/* ---------------- CONTENT (Pitch Fund specifics) ---------------- */
const TRACKS = [
  "Atma Nirbhar Bharat / Deep Tech", "FinTech & InsurTech", "HealthTech & BioTech",
  "AgriTech & Rural Innovation", "EdTech & Skilling", "AI / ML / Data Science",
  "D2C, E-commerce & Retail", "Climate & Sustainability", "Web3 & Blockchain",
  "Mobility & EV", "Manufacturing & Industry 4.0", "Social Impact & Culture-Tech",
];

const ELIGIBILITY = [
  "Founder or co-founder aged 18 years or above",
  "Registered or unregistered Indian startups accepted",
  "Idea-stage, MVP, POC, and revenue-generating startups all welcome",
  "Teams of up to 4 members per application",
  "DPIIT recognition not mandatory, but preferred",
];

const REWARDS = [
  { icon: Rocket, title: "Funding Support", value: "₹100 Cr+", desc: "Access to investor capital pool across all city rounds" },
  { icon: Sparkles, title: "Prize Pool", value: "₹1 Cr+", desc: "Cash prizes, credits, and vouchers across all tracks" },
  { icon: Users, title: "Mentoring & Incubation", value: "1,500+", desc: "Mentors, investors and industry leaders on call" },
  { icon: Globe2, title: "Networking", value: "50+ Cities", desc: "Founders, jury and sponsors across the country" },
];

const FLOW = [
  ["Entry", "Registration & application for Pitch Fund"],
  ["Screening", "Applications reviewed by analysts & domain mentors"],
  ["City Rounds", "Shortlisted startups pitch in their regional round"],
  ["Selection of Top 150", "Best performers across all city rounds advance"],
  ["Commitment Fee", "Selected entries confirm their pitching slot"],
  ["Pre-Finale", "Top 150 pitch before a national jury panel"],
  ["Bootcamp", "Finalist readiness bootcamp for the Top 25"],
  ["Grand Finale", "Top 10 pitch live for the final investment round"],
  ["Awards & Funding", "Prize distribution and investor introductions"],
];

const PARTNERS = ["Startup India", "NASSCOM", "IIT Alumni Council", "CII", "TiE", "Invest India"];

const PAST = [
  { n: "10,000+", l: "Applications" },
  { n: "50+", l: "Cities Covered" },
  { n: "500+", l: "Startups Funded" },
];

const FAQS = [
  ["What is Pitch Fund?", "Pitch Fund is a nationwide, Shark Tank-inspired startup pitching platform connecting founders with investors, mentors, and institutions across India."],
  ["Is registration free?", "Yes. Registration is free. A nominal commitment fee applies only once you're shortlisted for a city pitching round, to confirm your slot."],
  ["Who can apply?", "Any founder or co-founder aged 18+, at any stage — idea, MVP, POC, or revenue-generating — can apply. Teams of up to 4 members are welcome."],
  ["How are city rounds selected?", "Applications are screened by our analyst and mentor panel, then shortlisted startups are invited to pitch live in their regional round."],
  ["What happens after the Grand Finale?", "Winning and finalist startups get direct investor introductions, incubation support, and continued mentorship through our partner network."],
];

/* ---------------- SHARED UI ---------------- */
function Btn({ children, variant = "solid", style, ...props }) {
  const base = "inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm tracking-wide transition-transform duration-200";
  const styles = {
    solid: { background: T.marigold, color: T.ink },
    outline: { background: "transparent", color: T.paper, border: `1.5px solid ${T.lineLight}` },
  };
  return (
    <button
      className={base}
      style={{ ...styles[variant], borderRadius: 2, ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      {...props}
    >
      {children}
    </button>
  );
}

function Eyebrow({ children, dark }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase mb-4"
         style={{ color: dark ? T.marigold : T.ember }}>
      <span style={{ width: 24, height: 2, background: dark ? T.marigold : T.ember }} />
      {children}
    </div>
  );
}

/* ---------------- NAV (white bar, yellow active-tab pill like Innopreneurs) ---------------- */
function Nav({ goApply, active = "home" }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "contest", label: "Contest" },
    { id: "flow", label: "Flow" },
    { id: "partners", label: "Partners" },
    { id: "faq", label: "FAQ" },
  ];
  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${T.line}` }} className="relative z-20">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        <div className="font-black text-xl tracking-tight" style={{ fontFamily: T.display, color: T.textDark }}>
          PITCH<span style={{ color: T.ember }}>FUND</span>
        </div>
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold" style={{ color: T.textDim }}>
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="px-4 py-2"
               style={active === l.id ? { background: T.marigold, color: T.ink, borderRadius: 2 } : {}}>
              {l.label}
            </a>
          ))}
          <button onClick={goApply} className="ml-2 px-4 py-2 font-bold" style={{ background: T.ink, color: T.paper, borderRadius: 2 }}>
            Apply Now
          </button>
        </nav>
      </div>
    </div>
  );
}

/* ---------------- HERO — full-bleed illustrated stage scene + dark overlay,
   giant badge headline, exactly the photo-hero composition Innopreneurs uses ---------------- */
function Hero({ goApply }) {
  const parallaxRef = useParallax(0.15);
  return (
    <section className="relative overflow-hidden" style={{ background: T.ink, minHeight: 640 }}>
      {/* illustrated "stage" scene standing in for a photograph — spotlight cones,
          a podium silhouette, and a crowd suggestion, so the composition reads
          as an event photo without using a real photograph. Drifts slower than
          the page on scroll (parallax) via the ref below. */}
      <svg ref={parallaxRef} className="absolute inset-0 w-full h-full" viewBox="0 0 1400 640" preserveAspectRatio="xMidYMax slice">
        <defs>
          <radialGradient id="glow" cx="50%" cy="10%" r="75%">
            <stop offset="0%" stopColor="#2A2410" stopOpacity="1" />
            <stop offset="100%" stopColor={T.ink} stopOpacity="1" />
          </radialGradient>
          <linearGradient id="spot1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.marigold} stopOpacity="0.28" />
            <stop offset="100%" stopColor={T.marigold} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="spot2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.teal} stopOpacity="0.18" />
            <stop offset="100%" stopColor={T.teal} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.ink} stopOpacity="0" />
            <stop offset="100%" stopColor={T.ink} stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="1400" height="640" fill="url(#glow)" />
        <polygon points="420,0 760,0 1040,640 140,640" fill="url(#spot1)" />
        <polygon points="900,0 1180,0 1400,500 700,500" fill="url(#spot2)" />
        {/* crowd silhouette suggestion */}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = (i * 37) % 1400;
          const h = 30 + ((i * 53) % 40);
          return <ellipse key={i} cx={x} cy={620} rx={16} ry={h} fill="#000" opacity="0.35" />;
        })}
        {/* podium + speaker silhouette, centered like the reference photo */}
        <rect x="660" y="430" width="80" height="140" rx="4" fill="#000" opacity="0.55" />
        <circle cx="700" cy="380" r="26" fill="#000" opacity="0.6" />
        <path d="M665 430 Q700 340 735 430 Z" fill="#000" opacity="0.6" />
        <rect x="0" y="560" width="1400" height="80" fill="url(#fade)" />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-10 text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(250,249,245,0.55)" }}>
          <span>An Initiative by Pitch Fund Foundation</span>
        </div>

        <div className="text-2xl md:text-3xl font-black tracking-tight mb-3" style={{ fontFamily: T.display, color: T.paper }}>
          PITCH<span style={{ color: T.marigold }}>FUND</span>
        </div>
        <div className="text-xs uppercase tracking-[0.3em] mb-10" style={{ color: T.teal }}>Where Every Founder Gets Heard</div>

        <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-8" style={{ fontFamily: T.display, color: T.marigold, letterSpacing: "-0.01em" }}>
          Celebrating<br />Season 04
        </h1>

        <p className="text-lg md:text-2xl max-w-3xl leading-snug mb-2" style={{ color: T.paper, fontFamily: T.display }}>
          INDIA'S MOST HAPPENING NATIONAL STARTUP PITCH CONTEST
        </p>
        <p className="text-sm md:text-base tracking-[0.15em] uppercase mb-10" style={{ color: "rgba(250,249,245,0.6)" }}>
          | Pitch Fund | Startup Contest |
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Btn onClick={goApply}>Register Now <ArrowRight size={16} /></Btn>
          <Btn variant="outline">Explore Tracks</Btn>
        </div>
      </div>
    </section>
  );
}

/* reward strip, sitting below the hero as its own band */
function RewardStrip() {
  return (
    <section style={{ background: T.ink2 }} className="py-6">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {REWARDS.map(({ icon: Icon, title, value }) => (
          <div key={title} className="p-4 flex items-center gap-3" style={{ border: `1px solid ${T.lineLight}`, borderRadius: 4 }}>
            <Icon size={18} style={{ color: T.marigold }} />
            <div>
              <div className="text-base font-black leading-none" style={{ fontFamily: T.display, color: T.paper }}>{value}</div>
              <div className="text-[10px] uppercase tracking-wide mt-1" style={{ color: "rgba(250,249,245,0.5)" }}>{title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- THE CONTEST — giant headline, two columns,
   illustrated "photo" card on the right + numbered track list beneath it,
   matching the Innopreneurs "THE CONTEST" section composition ---------------- */
function ContestOverview() {
  return (
    <section id="contest" style={{ background: "#F3F7EE" }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <h2 className="text-6xl md:text-8xl font-black uppercase leading-none mb-14"
              style={{ fontFamily: T.display, color: "#2B5233", letterSpacing: "-0.02em" }}>
            The Contest
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
        <div className="grid md:grid-cols-2 gap-14">
          <div>
            <p className="text-base leading-relaxed mb-6" style={{ color: T.textDark }}>
              Are you an innovation freak? Do you have an idea worth building? Pitch Fund
              is a one-of-a-kind national competition for entrepreneurs — more than a
              contest, it's a guided founder journey, <em>"where mentors guide you, and
              founders inspire you."</em>
            </p>
            <ul className="space-y-3 mb-8">
              {[
                ["Exclusive Mentorship:", "one-on-one guidance from domain experts, plus direct access to Pitch Fund's founders and jury."],
                ["Expert Training", "on pitch decks and stage presence from professional coaches and orators."],
                ["Direct Interactions", "with past winners and alumni founders — learn from real journeys."],
                ["Continuous Guidance", "throughout every round, from city pitch to grand finale."],
              ].map(([bold, rest]) => (
                <li key={bold} className="text-sm leading-relaxed" style={{ color: T.textDim }}>
                  <span className="font-bold" style={{ color: "#2B5233" }}>{bold}</span> {rest}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed mb-3" style={{ color: T.textDim }}>
              <span className="font-bold" style={{ color: "#2B5233" }}>Pitch Fund Season 04</span> runs
              across 8 months with 50+ city pitching rounds nationwide. Top performers
              from every round are promoted to the Top 150 league, who then compete in
              the pre-finale and grand finale for national prizes and funding.
            </p>
            <p className="text-xs uppercase tracking-wide font-bold" style={{ color: T.ember }}>
              Registrations for Season 04 are live!
            </p>
          </div>

          <div>
            {/* illustrated "winners photo" card, standing in for an event photograph */}
            <div className="mb-6 p-6" style={{ background: T.ink, borderRadius: 4 }}>
              <svg viewBox="0 0 400 220" className="w-full">
                <rect width="400" height="220" fill="#141B2E" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <g key={i}>
                    <circle cx={35 + i * 45} cy="120" r="16" fill={i % 2 ? T.marigold : T.teal} opacity="0.85" />
                    <rect x={19 + i * 45} y="136" width="32" height="55" rx="6" fill={i % 2 ? T.marigold : T.teal} opacity="0.6" />
                  </g>
                ))}
                <rect x="130" y="30" width="140" height="45" rx="3" fill="#fff" opacity="0.92" />
                <text x="200" y="58" textAnchor="middle" fontSize="14" fontWeight="900" fill={T.ink}>WINNER — ₹1,00,000</text>
              </svg>
              <p className="text-xs mt-3" style={{ color: "rgba(250,249,245,0.55)" }}>
                Season 03 city-round winners with the jury panel
              </p>
            </div>

            <div className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: "#2B5233" }}>
              All rounds accept entries in the following tracks
            </div>
            <div className="space-y-1">
              {TRACKS.map((t, i) => (
                <div key={t} className="flex items-center gap-3 text-sm py-1.5" style={{ color: T.textDark, borderBottom: i < TRACKS.length - 1 ? "1px solid rgba(43,82,51,0.12)" : "none" }}>
                  <span className="text-xs font-bold" style={{ color: T.ember }}>{i + 1}.</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- ELIGIBILITY ---------------- */
function Eligibility() {
  return (
    <section style={{ background: T.paperDim }} className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
        <Eyebrow>Eligibility</Eyebrow>
        <h2 className="text-3xl font-black mb-10 max-w-lg" style={{ fontFamily: T.display, color: T.textDark }}>
          Passion for innovation matters more than stage
        </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          {ELIGIBILITY.map((e) => (
            <div key={e} className="flex items-start gap-3 p-4" style={{ background: T.paper, borderRadius: 3 }}>
              <Check size={16} style={{ color: T.teal, marginTop: 3, flexShrink: 0 }} />
              <span className="text-sm" style={{ color: T.textDark }}>{e}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- REWARDS GRID (detailed) ---------------- */
function Rewards() {
  return (
    <section style={{ background: T.ink, color: T.paper }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <Eyebrow dark>Rewards</Eyebrow>
        <h2 className="text-3xl font-black mb-12 max-w-lg" style={{ fontFamily: T.display }}>
          What you walk away with — win or not
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {REWARDS.map(({ icon: Icon, title, value, desc }) => (
            <div key={title} className="p-6" style={{ border: `1px solid ${T.lineLight}`, borderRadius: 4 }}>
              <Icon size={20} style={{ color: T.marigold }} className="mb-4" />
              <div className="text-2xl font-black mb-1" style={{ fontFamily: T.display }}>{value}</div>
              <div className="text-sm font-semibold mb-2">{title}</div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(250,249,245,0.55)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTEST FLOW (long stepper, like Innopreneurs) ---------------- */
function ContestFlow() {
  return (
    <section id="flow" style={{ background: T.paper }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
        <Eyebrow>Contest Flow</Eyebrow>
        <h2 className="text-3xl font-black mb-14" style={{ fontFamily: T.display, color: T.textDark }}>
          From application to the grand finale
        </h2>
        </Reveal>
        <div className="relative">
          <div className="hidden md:block absolute left-0 right-0" style={{ top: 22, height: 2, background: T.line }} />
          <div className="grid md:grid-cols-9 gap-6 md:gap-2">
            {FLOW.map(([title, desc], i) => (
              <div key={title} className="relative">
                <div className="w-11 h-11 flex items-center justify-center text-sm font-black mb-3 relative z-10"
                     style={{ background: i === FLOW.length - 1 ? T.marigold : T.ink, color: i === FLOW.length - 1 ? T.ink : T.paper, borderRadius: "50%", fontFamily: T.display }}>
                  {i + 1}
                </div>
                <div className="font-bold text-sm mb-1" style={{ fontFamily: T.display, color: T.textDark }}>{title}</div>
                <p className="text-xs leading-relaxed" style={{ color: T.textDim }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PARTNERS ---------------- */
function Partners() {
  return (
    <section id="partners" style={{ background: T.paperDim }} className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center text-xs uppercase tracking-[0.3em] mb-8" style={{ color: T.textDim }}>Our Partners</div>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {PARTNERS.map((p) => (
            <div key={p} className="text-sm font-bold" style={{ fontFamily: T.display, color: T.textDark, opacity: 0.6 }}>{p}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PAST EDITIONS STATS ---------------- */
function PastEditions() {
  return (
    <section style={{ background: T.ink }} className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center text-xs uppercase tracking-[0.3em] mb-10" style={{ color: T.teal }}>Past Editions</div>
        <Reveal>
        <div className="grid grid-cols-3 gap-4">
          {PAST.map(({ n, l }) => (
            <div key={l} className="text-center">
              <div className="text-3xl md:text-5xl font-black tabular-nums" style={{ fontFamily: T.display, color: T.marigold }}>{n}</div>
              <div className="text-xs md:text-sm mt-2 uppercase tracking-wide" style={{ color: "rgba(250,249,245,0.55)" }}>{l}</div>
            </div>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FAQ ACCORDION ---------------- */
function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" style={{ background: T.paper }} className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Eyebrow>Frequently Asked Questions</Eyebrow>
        <h2 className="text-3xl font-black mb-10" style={{ fontFamily: T.display, color: T.textDark }}>Good to know</h2>
        <div>
          {FAQS.map(([q, a], i) => (
            <div key={q} style={{ borderBottom: `1px solid ${T.line}` }}>
              <button className="w-full flex items-center justify-between py-5 text-left" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="font-semibold text-sm" style={{ color: T.textDark, fontFamily: T.display }}>{q}</span>
                <ChevronDown size={18} style={{ color: T.textDim, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {open === i && <p className="text-sm leading-relaxed pb-5" style={{ color: T.textDim }}>{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ goApply }) {
  return (
    <section style={{ background: T.ink, color: T.paper }} className="py-24 text-center">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-black mb-4" style={{ fontFamily: T.display }}>
          Your city round is waiting.<br /><span style={{ color: T.marigold }}>Register today.</span>
        </h2>
        <Btn onClick={goApply}>Register Your Startup <ArrowRight size={16} /></Btn>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: T.ink2, color: "rgba(250,249,245,0.55)" }} className="py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-sm">
        <div>
          <div className="font-black mb-1" style={{ fontFamily: T.display, color: T.paper }}>PITCHFUND</div>
          India's National Startup Pitching Platform
        </div>
        <div>hello@pitchfund.in · +91 98765 43210</div>
        <div>© 2026 Pitch Fund. All rights reserved.</div>
      </div>
    </footer>
  );
}

/* ============================================================
   REGISTRATION FORM (unchanged flow from v1, kept concise here)
   ============================================================ */
function Field({ label, hint, children }) {
  return (
    <label className="block mb-5">
      <span className="block text-sm font-semibold mb-1" style={{ color: T.textDark }}>{label}</span>
      {hint && <span className="block text-xs mb-2" style={{ color: T.textDim }}>{hint}</span>}
      {children}
    </label>
  );
}
const inputStyle = { width: "100%", padding: "10px 12px", border: `1.5px solid ${T.line}`, borderRadius: 3, fontSize: 14, background: "#fff", color: T.textDark };
function TextField({ label, hint, ...props }) {
  return <Field label={label} hint={hint}><input style={inputStyle} {...props} /></Field>;
}
function SelectField({ label, hint, options, ...props }) {
  return (
    <Field label={label} hint={hint}>
      <select style={inputStyle} {...props}>
        <option value="">Select</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}
function WordCountArea({ label, minWords, value, onChange }) {
  const words = useMemo(() => (value.trim() ? value.trim().split(/\s+/).length : 0), [value]);
  const ok = words >= minWords;
  return (
    <Field label={label} hint={`Minimum ${minWords} words`}>
      <textarea rows={4} style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} />
      <span className="text-xs mt-1 block" style={{ color: ok ? T.teal : T.ember }}>{words} / {minWords} words</span>
    </Field>
  );
}
function UploadBox({ label, hint }) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-3 p-4 border-2 border-dashed" style={{ borderColor: T.line, borderRadius: 3, color: T.textDim }}>
        <Upload size={18} /> <span className="text-sm">Drop file or click to upload</span>
      </div>
    </Field>
  );
}
const FORM_STEPS = ["Founder", "Business", "Track & IP", "Financial", "Media & Submit"];

function RegistrationForm({ back }) {
  const [step, setStep] = useState(0);
  const [bio, setBio] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: T.paper }}>
        <div className="text-center max-w-md px-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: T.ink }}>
            <Check color={T.marigold} />
          </div>
          <h2 className="text-2xl font-black mb-3" style={{ fontFamily: T.display, color: T.textDark }}>Application received</h2>
          <p className="text-sm mb-8" style={{ color: T.textDim }}>Our screening panel will review your startup and notify you by email.</p>
          <Btn onClick={back}>Back to Home</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.paper, minHeight: "100vh" }}>
      <div style={{ background: T.ink, color: T.paper }} className="py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={back} className="text-xs flex items-center gap-1 mb-6" style={{ color: "rgba(250,249,245,0.6)" }}>
            <ArrowLeft size={14} /> Back to home
          </button>
          <Eyebrow dark>Season 04 Application</Eyebrow>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: T.display }}>Register your startup for your city round</h1>
          <p className="text-sm" style={{ color: "rgba(250,249,245,0.55)" }}>Estimated completion time: 20–30 minutes</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <div className="flex gap-2 mb-10">
          {FORM_STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className="h-1 mb-2" style={{ background: i <= step ? T.marigold : T.line, borderRadius: 2 }} />
              <div className="text-[11px] uppercase tracking-wide" style={{ color: i === step ? T.textDark : T.textDim, fontWeight: i === step ? 700 : 400 }}>
                {String(i + 1).padStart(2, "0")} {s}
              </div>
            </div>
          ))}
        </div>

        <div className="pb-16">
          {step === 0 && (
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: T.display }}>Primary Founder Details</h3>
              <div className="grid md:grid-cols-2 gap-x-6">
                <TextField label="Full Name" />
                <TextField label="Age" type="number" />
                <TextField label="Email Address" type="email" />
                <TextField label="Mobile Number" type="tel" />
                <TextField label="City" />
                <TextField label="State" />
              </div>
              <WordCountArea label="Founder Bio" minWords={100} value={bio} onChange={setBio} />
            </div>
          )}
          {step === 1 && (
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: T.display }}>Startup Overview</h3>
              <div className="grid md:grid-cols-2 gap-x-6">
                <TextField label="Startup Name" />
                <SelectField label="Track" options={TRACKS} />
                <TextField label="Stage" placeholder="Idea / MVP / POC / Revenue" />
                <TextField label="Number of Co-founders" type="number" />
              </div>
              <WordCountArea label="Problem Statement" minWords={100} value={problem} onChange={setProblem} />
              <WordCountArea label="Solution" minWords={100} value={solution} onChange={setSolution} />
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: T.display }}>Track Alignment & IP</h3>
              <SelectField label="Primary Track" options={TRACKS} />
              <div className="grid md:grid-cols-2 gap-x-6">
                <TextField label="Patent / Trademark (if any)" />
                <TextField label="DPIIT Recognition Number" />
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: T.display }}>Financials & Funding Ask</h3>
              <div className="grid md:grid-cols-2 gap-x-6">
                <TextField label="Monthly Revenue" />
                <TextField label="Funding Amount Requested" />
                <TextField label="Equity Offered (%)" />
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: T.display }}>Showcase Your Venture</h3>
              <UploadBox label="Pitch Deck Upload" hint="PDF, max 25 MB" />
              <TextField label="Pitch Video Link" hint="YouTube / Drive link, max 3 minutes" />
              <div className="mt-6 p-4" style={{ background: T.paperDim, borderRadius: 3 }}>
                <label className="flex items-start gap-2 text-sm" style={{ color: T.textDark }}>
                  <input type="checkbox" className="mt-1" />
                  I declare that all information submitted is true and accurate.
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pb-16">
          <Btn variant="outline" style={{ color: T.textDark, borderColor: T.line }} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft size={16} /> Back
          </Btn>
          {step < FORM_STEPS.length - 1 ? (
            <Btn onClick={() => setStep((s) => s + 1)}>Continue <ArrowRight size={16} /></Btn>
          ) : (
            <Btn onClick={() => setSubmitted(true)}>Submit Application <Check size={16} /></Btn>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- ROOT ---------------- */
export default function PitchFundContestPage() {
  const [view, setView] = useState("home");
  return (
    <div style={{ fontFamily: T.body }}>
      {view === "home" ? (
        <>
          <Nav goApply={() => setView("apply")} active="home" />
          <Hero goApply={() => setView("apply")} />
          <Marquee text="Season 04 Now Live" bg={T.marigold} color={T.ink} />
          <RewardStrip />
          <ContestOverview />
          <Eligibility />
          <Rewards />
          <ContestFlow />
          <Partners />
          <PastEditions />
          <FAQ />
          <FinalCTA goApply={() => setView("apply")} />
          <Footer />
        </>
      ) : (
        <RegistrationForm back={() => setView("home")} />
      )}
    </div>
  );
}