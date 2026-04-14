import { useState, useRef } from "react";

const SCREENS = [
  { id: "home", name: "Homescreen", shortName: "Home", color: "#818CF8" },
  { id: "search", name: "Search & Filters", shortName: "Search", color: "#A78BFA" },
  { id: "restaurant-list", name: "Restaurant List", shortName: "Resto list", color: "#C084FC" },
  { id: "restaurant-page", name: "Restaurant Page", shortName: "Resto page", color: "#E879F9" },
  { id: "menu", name: "Menu / Dish view", shortName: "Menu", color: "#F472B6" },
  { id: "deals", name: "Deals & Vouchers", shortName: "Deals", color: "#FB923C" },
  { id: "cart-review", name: "Cart & Review", shortName: "Cart", color: "#34D399" },
  { id: "checkout", name: "Checkout", shortName: "Checkout", color: "#2DD4BF" },
];

const STAGES = [
  { id: 1, name: "Awareness & Exploration", color: "#818CF8",
    steps: [{ id: "awareness", name: "Awareness & exploration", easeOfUse: 49.1, screenIds: ["home"] }] },
  { id: 2, name: "Ordering", color: "#A78BFA",
    steps: [
      { id: "discovery", name: "Discovery", easeOfUse: 49.1, screenIds: ["home", "search", "restaurant-list"] },
      { id: "selection", name: "Selection", easeOfUse: 64.2, screenIds: ["restaurant-page", "menu", "deals"] },
      { id: "review", name: "Review", easeOfUse: 69.4, screenIds: ["cart-review"] },
      { id: "order", name: "Order", easeOfUse: 62.2, screenIds: ["checkout"] },
    ] },
  { id: 3, name: "Post ordering", color: "#F472B6",
    steps: [{ id: "post-order", name: "Post order", easeOfUse: 73.2, screenIds: [] }] },
  { id: 4, name: "Order fulfillment", color: "#34D399",
    steps: [
      { id: "tracking", name: "Order tracking", easeOfUse: 66.2, screenIds: [] },
      { id: "delivery", name: "Delivery", easeOfUse: 71.0, screenIds: [] },
    ] },
  { id: 5, name: "Feedback", color: "#FB923C",
    steps: [{ id: "ratings", name: "Ratings", easeOfUse: 68.5, screenIds: [] }] },
];

const VERTICALS = [
  { id: "multi", label: "Multi-vertical", icon: "◫" },
  { id: "food", label: "Food delivery", icon: "🍴" },
  { id: "qcom", label: "Q-Commerce", icon: "⚡" },
  { id: "pickup", label: "Pick-up", icon: "📦" },
];

const USER_TYPES = ["All", "New user", "Existing user"];

const TYPE_META = {
  pain: { label: "Pain point", dot: "#F87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)", text: "#FCA5A5" },
  observation: { label: "Observation", dot: "#A78BFA", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.25)", text: "#C4B5FD" },
  opportunity: { label: "Opportunity", dot: "#FBBF24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)", text: "#FDE68A" },
};

const TAG_COLORS = {
  "New user": { bg: "rgba(96,165,250,0.15)", color: "#93C5FD", border: "rgba(96,165,250,0.3)" },
  "Existing user": { bg: "rgba(52,211,153,0.15)", color: "#6EE7B7", border: "rgba(52,211,153,0.3)" },
  "New user, Existing user": { bg: "rgba(251,191,36,0.15)", color: "#FDE68A", border: "rgba(251,191,36,0.3)" },
  "All": { bg: "rgba(255,255,255,0.08)", color: "#94A3B8", border: "rgba(255,255,255,0.12)" },
};

const INSIGHTS = [
  { id:"p1", text:"Users face issues with inaccurate search results when looking for a cuisine or q-comm items", source:"Fix The Basics Recurrent Issue", tag:"Existing user", type:"pain", screens:["search","home"], lens:"product" },
  { id:"p2", text:"Users (esp. new to the platform) are confused between verticals (Shops & Mart)", source:"#246 New Customer Journey Map, Fix The Basics Report 5", tag:"New user", type:"pain", screens:["home"], lens:"product" },
  { id:"p3", text:"Users are not as satisfied as they are with our competitors when it comes to Visual information / viewing dish images on menu", source:"Voice of Customer 4 data, SEQ dashboard", tag:"Existing user", type:"pain", screens:["menu","restaurant-page"], lens:"business" },
  { id:"p4", text:"Nested dishes – Users do not understand from which restaurant the dishes come from", source:"UXR#286 Dish-led Discovery", tag:"Existing user", type:"pain", screens:["search","menu"], lens:"design" },
  { id:"p5", text:"Users are unable to sort quickly based on delivery fee", source:"Voice of Customer 4 data, SEQ dashboard", tag:"Existing user", type:"pain", screens:["restaurant-list","search"], lens:"product" },
  { id:"p6", text:"Nested dishes – Ranking is not relevant for users in nested dishes, and image quality is often not good enough", source:"UXR#286 Dish-led Discovery", tag:"Existing user", type:"pain", screens:["search","menu"], lens:"design" },
  { id:"p7", text:"Users face certain issues when trying to find dishes that they want", source:"Voice of Customer 4 data, SEQ dashboard", tag:"Existing user", type:"pain", screens:["menu","search"], lens:"product" },
  { id:"p8", text:"Users find HomeScreen overwhelming or crowded with information due to amount of swim-lanes, banners, categories or its irrelevance", source:"#246 New Customer Journey Map, Fix The Basics Recurring Issue, #153 Modular Homescreen", tag:"New user", type:"pain", screens:["home"], lens:"design" },
  { id:"p9", text:"Users have issues with understanding Deals & Discounts. They might need some time to understand what are the requirements and could benefit from more clarity", source:"Fix The Basics Report 5", tag:"Existing user", type:"pain", screens:["deals","home"], lens:"business" },
  { id:"p10", text:"Voucher tag is not clear to New and Existing users", source:"#272 Price clarity moderated", tag:"New user, Existing user", type:"pain", screens:["deals","restaurant-page"], lens:"design" },
  { id:"p11", text:"Users, especially new users think that the menu is not accessible, there is a need to improve a11y in menu", source:"#246 New users Journey", tag:"New user", type:"pain", screens:["menu"], lens:"design" },
  { id:"p12", text:"Users face issues with Campaign Banners and its content", source:"#246 New users Journey, #211 Vendor Recommendations", tag:"New user", type:"pain", screens:["home"], lens:"design" },
  { id:"p13", text:"Users, especially new users are unclear incentives/voucher applicability (not clear which vendors accept the voucher)", source:"#246 New users Journey", tag:"New user", type:"pain", screens:["deals","restaurant-list"], lens:"product" },
  { id:"o1", text:"Most of the time users know in advance the vertical they want to use", source:"Modular home screen, Map View Discovery", tag:"Existing user", type:"observation", screens:["home"], lens:"product" },
  { id:"o2", text:"Users that do not transact, mainly drop off at the Homescreen (20% of users)", source:"Install to order project, New User Journey 1.0", tag:"New user", type:"observation", screens:["home"], lens:"business" },
  { id:"o3", text:"Users are often unaware and not using Favorite as an option", source:"#80UXR-Reorder, #249UXR – Favorite Restaurants", tag:"Existing user", type:"observation", screens:["home","restaurant-page"], lens:"product" },
  { id:"o4", text:"The main Homescreen Job To Be Done for users is to narrow down options and avoid the choice paradox", source:"UXR#153 Modular HomeScreen", tag:"Existing user", type:"observation", screens:["home"], lens:"product" },
  { id:"o5", text:"Indecisive user roles would check more restaurants in one session than decisive ones and are more likely to scroll through the whole menu", source:"UXR#44 Restaurant Discovery Stage 3", tag:"Existing user", type:"observation", screens:["restaurant-list","menu"], lens:"design" },
  { id:"o6", text:"Decisive and Indecisive users use search for different purposes", source:"UXR#44 Restaurant Discovery Stage 3", tag:"Existing user", type:"observation", screens:["search"], lens:"product" },
  { id:"o7", text:"Users decision-making process on which restaurant to choose is based on price, cuisine, ratings & reviews", source:"Voice of Customer 4 dashboard", tag:"Existing user", type:"observation", screens:["restaurant-list","restaurant-page"], lens:"business" },
  { id:"o8", text:"'Your Restaurant' swimlanes are the primary tool for reordering; Order History serves as secondary", source:"#291 UXR – Delivery Options, Past Order Journey", tag:"Existing user", type:"observation", screens:["home"], lens:"product" },
  { id:"o9", text:"New Deal category in Menu makes it easier for users to find and understand selected items deals", source:"#272 Price Clarity (Restaurants)", tag:"Existing user", type:"observation", screens:["menu","deals"], lens:"product" },
  { id:"x1", text:"Personalise information architecture based on decisiveness spectrum / user goals", source:"UXR#44 Restaurant Discovery", tag:"Existing user", type:"opportunity", screens:["home","restaurant-list"], lens:"design" },
  { id:"x2", text:"Provide more information / personalisation for healthy choices for health-conscious customer needs", source:"UXR#44, UXR#126, UXR239, Pillars Pilot Analysis", tag:"Existing user", type:"opportunity", screens:["home","menu","restaurant-page"], lens:"product" },
  { id:"x3", text:"Increase awareness of non-food delivery verticals", source:"Brand trackers", tag:"Existing user", type:"opportunity", screens:["home"], lens:"business" },
  { id:"x4", text:"Provide more personalised recommendations", source:"UXR#153 Modular home screen, UXR211 Vendor Recommendations", tag:"Existing user", type:"opportunity", screens:["home","restaurant-list"], lens:"product" },
  { id:"x5", text:"Improving swim-lanes naming to make it more clear and consistent", source:"UXR211, #246 New users Journey", tag:"Existing user", type:"opportunity", screens:["home"], lens:"design" },
  { id:"x6", text:"Highlight non-monetary benefits (save time, save efforts, get good quality foods)", source:"UXR#44 Restaurant Discovery", tag:"Existing user", type:"opportunity", screens:["home","restaurant-list"], lens:"business" },
  { id:"x7", text:"Recognise that a restaurant or dishes matched user previous habit", source:"UXR#222 Vendor Tiles", tag:"Existing user", type:"opportunity", screens:["restaurant-list","restaurant-page"], lens:"product" },
  { id:"x8", text:"Have vendor tiles with Grid view or Carousel views for better picture and price visibility", source:"UXR#286 Dish-led Discovery", tag:"Existing user", type:"opportunity", screens:["restaurant-list"], lens:"design" },
  { id:"x9", text:"Introduce (personalised) dish-centred discovery", source:"UXR#222 Vendor Tiles, Product Vision 2025", tag:"Existing user", type:"opportunity", screens:["home","search","restaurant-list"], lens:"product" },
  { id:"x10", text:"Introduce dish-led discovery early on in the flow to aid decision making for less decisive users", source:"UXR#286 Dish-led Discovery", tag:"Existing user", type:"opportunity", screens:["home","search"], lens:"product" },
  { id:"x11", text:"Introduce mood-based recommendations", source:"Product Vision 2025, UXR#239 GeoLocalisation Microsite", tag:"Existing user", type:"opportunity", screens:["home","search"], lens:"product" },
  { id:"x12", text:"Highlight offers and social proof elements, especially for new users", source:"#246 New Customer Journey Map", tag:"New user", type:"opportunity", screens:["home","restaurant-list","restaurant-page"], lens:"business" },
  { id:"x13", text:"Introduce dynamic favourites and improve the visibility of the favourite icon", source:"Product Vision 2025, #249UXR", tag:"Existing user", type:"opportunity", screens:["home","restaurant-page"], lens:"design" },
  { id:"x14", text:"Continue improve filter visibility & results", source:"Fix The Basics Report 5, UXR#162", tag:"Existing user", type:"opportunity", screens:["search","restaurant-list"], lens:"design" },
];

const LENS_CONFIG = {
  business: { label: "Business", icon: "📊", accent: "#60A5FA", glow: "rgba(96,165,250,0.3)" },
  product: { label: "Product", icon: "⚙️", accent: "#34D399", glow: "rgba(52,211,153,0.3)" },
  design: { label: "Design", icon: "🎨", accent: "#C084FC", glow: "rgba(192,132,252,0.3)" },
};

const glass = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const glassHover = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
};

function EaseGauge({ score, size = 48, showLabel = false }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score < 50 ? "#F87171" : score < 65 ? "#FBBF24" : score < 75 ? "#60A5FA" : "#34D399";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 6px ${color}40)` }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
          style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: size < 40 ? 10 : 12, fontWeight: 600, fill: color }}>
          {score}%
        </text>
      </svg>
      {showLabel && <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.35)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ease of use</span>}
    </div>
  );
}

function InsightCard({ insight }) {
  const [open, setOpen] = useState(false);
  const tm = TYPE_META[insight.type];
  const tags = insight.tag.split(", ");
  const relatedScreens = SCREENS.filter(s => insight.screens.includes(s.id));

  return (
    <div onClick={() => setOpen(!open)} style={{
      ...glass, borderRadius: 14, padding: "16px 18px", cursor: "pointer",
      transition: "all 0.25s ease",
      borderLeft: `2px solid ${tm.dot}50`,
      boxShadow: open ? `0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.06)` : "none",
      ...(open ? { background: "rgba(255,255,255,0.06)" } : {}),
    }}
    onMouseEnter={e => { if (!open) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}}
    onMouseLeave={e => { if (!open) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em",
          padding: "2px 8px", borderRadius: 6, background: tm.bg, color: tm.text, border: `1px solid ${tm.border}` }}>
          {tm.label}
        </span>
        {tags.map(t => {
          const tc = TAG_COLORS[t.trim()] || TAG_COLORS["All"];
          return <span key={t} style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 6,
            background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>{t.trim()}</span>;
        })}
        <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.3)", transform: open ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▼</span>
      </div>
      <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,0.8)", margin: 0 }}>{insight.text}</p>
      {open && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "0 0 8px" }}>
            <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>Source:</span> {insight.source}
          </p>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Screens:</span>
            {relatedScreens.map(s => (
              <span key={s.id} style={{ fontSize: 10, padding: "1px 7px", borderRadius: 5,
                background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>{s.shortName}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PurplePrint() {
  const [vertical, setVertical] = useState("food");
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [activeLens, setActiveLens] = useState("business");
  const [userFilter, setUserFilter] = useState("All");
  const [showJTBD, setShowJTBD] = useState(false);
  const detailRef = useRef(null);

  const handleStageClick = (stage) => {
    if (selectedStage?.id === stage.id) { setSelectedStage(null); setSelectedStep(null); setSelectedScreens([]); }
    else { setSelectedStage(stage); setSelectedStep(stage.steps[0]); setSelectedScreens([]); }
  };
  const handleStepClick = (step) => { setSelectedStep(step); setSelectedScreens([]); setUserFilter("All"); };
  const toggleScreen = (sid) => setSelectedScreens(p => p.includes(sid) ? p.filter(s => s !== sid) : [...p, sid]);

  const getFilteredInsights = () => {
    let pool = INSIGHTS.filter(i => i.lens === activeLens);
    if (selectedScreens.length > 0) pool = pool.filter(i => i.screens.some(s => selectedScreens.includes(s)));
    else if (selectedStep) pool = pool.filter(i => i.screens.some(s => (selectedStep.screenIds || []).includes(s)));
    if (userFilter !== "All") pool = pool.filter(i => i.tag.includes(userFilter));
    return pool;
  };

  const filteredInsights = getFilteredInsights();
  const allSteps = STAGES.flatMap(s => s.steps);
  const worstStep = allSteps.reduce((m, s) => s.easeOfUse < m.easeOfUse ? s : m, allSteps[0]);

  const getLensCounts = () => {
    let pool = INSIGHTS;
    if (selectedScreens.length > 0) pool = pool.filter(i => i.screens.some(s => selectedScreens.includes(s)));
    else if (selectedStep) pool = pool.filter(i => i.screens.some(s => (selectedStep.screenIds || []).includes(s)));
    if (userFilter !== "All") pool = pool.filter(i => i.tag.includes(userFilter));
    return { business: pool.filter(i => i.lens === "business").length, product: pool.filter(i => i.lens === "product").length, design: pool.filter(i => i.lens === "design").length };
  };

  const lensCounts = getLensCounts();
  const stepScreens = selectedStep ? SCREENS.filter(s => (selectedStep.screenIds || []).includes(s.id)) : [];
  const getStepInsightCount = (stepId) => {
    const step = allSteps.find(s => s.id === stepId);
    return step ? INSIGHTS.filter(i => i.screens.some(s => (step.screenIds || []).includes(s))).length : 0;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', -apple-system, sans-serif", minHeight: "100vh",
      background: "linear-gradient(145deg, #0B0D17 0%, #0F1223 30%, #131629 60%, #0E1020 100%)", color: "#E2E8F0",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-12px) } to { opacity:1; transform:translateX(0) } }
        @keyframes glow { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Ambient orbs */}
      <div style={{ position: "fixed", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -300, left: -200, width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(192,132,252,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "40%", right: "10%", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <header style={{
        ...glass, borderTop: "none", borderLeft: "none", borderRight: "none",
        padding: "16px 32px", position: "sticky", top: 0, zIndex: 100,
        background: "rgba(11,13,23,0.7)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1360, margin: "0 auto" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #818CF8, #C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              PurplePrint
            </h1>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
              Customer journey insights · Pandora brands · Updated 30/9/2025
            </p>
          </div>
          <div style={{ display: "flex", gap: 3, ...glass, borderRadius: 12, padding: 3 }}>
            {VERTICALS.map(v => (
              <button key={v.id} onClick={() => { setVertical(v.id); setSelectedScreens([]); setUserFilter("All"); }}
                style={{
                  padding: "7px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 500, fontFamily: "inherit", transition: "all 0.25s",
                  background: vertical === v.id ? "rgba(255,255,255,0.1)" : "transparent",
                  color: vertical === v.id ? "#fff" : "rgba(255,255,255,0.45)",
                  boxShadow: vertical === v.id ? "inset 0 0 0 1px rgba(255,255,255,0.12)" : "none",
                }}>{v.icon} {v.label}</button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1360, margin: "0 auto", padding: "28px 32px 80px", position: "relative", zIndex: 1 }}>

        {/* Stages */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {STAGES.map((stage, si) => {
            const isActive = selectedStage?.id === stage.id;
            const avgEase = Math.round(stage.steps.reduce((s, st) => s + st.easeOfUse, 0) / stage.steps.length);
            const totalInsights = stage.steps.reduce((s, st) => s + getStepInsightCount(st.id), 0);
            return (
              <div key={stage.id} onClick={() => handleStageClick(stage)}
                style={{
                  flex: si === 1 ? 2.5 : 1, ...glass, borderRadius: 16,
                  padding: "16px 18px", cursor: "pointer", transition: "all 0.3s ease",
                  position: "relative", overflow: "hidden",
                  ...(isActive ? {
                    background: "rgba(255,255,255,0.07)",
                    border: `1px solid ${stage.color}40`,
                    boxShadow: `0 8px 32px ${stage.color}15, inset 0 0 0 1px ${stage.color}20`,
                  } : {}),
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = isActive ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Top glow line */}
                <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
                  background: `linear-gradient(90deg, transparent, ${stage.color}${isActive ? "80" : "30"}, transparent)`,
                  transition: "all 0.3s" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: 9.5, fontWeight: 600, color: stage.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>Stage {stage.id}</span>
                    <h3 style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", lineHeight: 1.3, marginTop: 4 }}>{stage.name}</h3>
                  </div>
                  <EaseGauge score={avgEase} size={44} showLabel={true} />
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  <span>{totalInsights} insights</span><span>·</span>
                  <span>{stage.steps.length} step{stage.steps.length > 1 ? "s" : ""}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hotspot */}
        {!selectedStage && (
          <div style={{
            ...glass, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
            marginBottom: 20, animation: "fadeIn 0.5s ease",
            background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.15)",
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(248,113,113,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🔥</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#FCA5A5" }}>Needs attention: {worstStep.name} — {worstStep.easeOfUse}% ease of use</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Select a stage above to explore</p>
            </div>
          </div>
        )}

        {/* Level 1 */}
        {selectedStage && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {/* Steps */}
            <div style={{ display: "flex", gap: 4, marginBottom: 18, ...glass, borderRadius: 14, padding: 4 }}>
              {selectedStage.steps.map(step => {
                const isActive = selectedStep?.id === step.id;
                const count = getStepInsightCount(step.id);
                return (
                  <button key={step.id} onClick={() => handleStepClick(step)} style={{
                    flex: 1, padding: "14px 10px", borderRadius: 12, border: "none",
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.25s",
                    background: isActive ? `linear-gradient(135deg, ${selectedStage.color}30, ${selectedStage.color}15)` : "transparent",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                    boxShadow: isActive ? `inset 0 0 0 1px ${selectedStage.color}40` : "none",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{step.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 3 }}>{count} insights</div>
                    <div style={{ marginTop: 8 }}><EaseGauge score={step.easeOfUse} size={36} showLabel={isActive} /></div>
                  </button>
                );
              })}
            </div>

            {/* JTBD */}
            <div style={{ ...glass, borderRadius: 14, marginBottom: 18, overflow: "hidden" }}>
              <button onClick={() => setShowJTBD(!showJTBD)} style={{
                width: "100%", padding: "14px 20px", display: "flex", justifyContent: "space-between",
                alignItems: "center", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", color: "#fff",
              }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>💡 Why do users come here?</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", transform: showJTBD ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▼</span>
              </button>
              {showJTBD && (
                <div style={{ padding: "0 20px 18px", display: "flex", gap: 20, animation: "fadeIn 0.25s ease" }}>
                  {[
                    { label: "Functional", color: "#60A5FA", items: ["To save efforts", "To save time", "To narrow down options", "To find offers & discounts"] },
                    { label: "Emotional", color: "#C084FC", items: ["To satisfy craving & self-treat", "To discover new foods", "Get inspired exploring"] },
                    { label: "Social", color: "#34D399", items: ["To order with/for someone", "To celebrate"] },
                  ].map(cat => (
                    <div key={cat.label} style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 10, fontWeight: 600, color: cat.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{cat.label}</h4>
                      {cat.items.map((j, i) => <p key={i} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, marginBottom: 5 }}>• {j}</p>)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Screens */}
            {stepScreens.length > 0 && (
              <div style={{ ...glass, borderRadius: 16, padding: 22, marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>🎬 Storyboard & 📱 Product screens</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {selectedScreens.length > 0 && (
                      <button onClick={() => setSelectedScreens([])} style={{
                        fontSize: 11, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: 8,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                      }}>Clear</button>
                    )}
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                      {selectedScreens.length > 0 ? `${selectedScreens.length} selected — combined insights below` : "Select screens to filter"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 6 }}>
                  {stepScreens.map((screen, i) => {
                    const isSel = selectedScreens.includes(screen.id);
                    const cnt = INSIGHTS.filter(ins => ins.screens.includes(screen.id)).length;
                    return (
                      <div key={screen.id} onClick={() => toggleScreen(screen.id)}
                        style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                          minWidth: 170, animation: `slideIn 0.35s ease ${i * 0.07}s both` }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          {/* Storyboard */}
                          <div style={{
                            width: 100, height: 115, borderRadius: 12, overflow: "hidden", flexShrink: 0,
                            border: isSel ? `2px solid ${screen.color}` : "1px solid rgba(255,255,255,0.08)",
                            boxShadow: isSel ? `0 4px 20px ${screen.color}30, inset 0 0 0 1px ${screen.color}30` : "none",
                            transition: "all 0.25s", position: "relative",
                            background: isSel
                              ? `linear-gradient(160deg, ${screen.color}15, ${screen.color}08)`
                              : "rgba(255,255,255,0.03)",
                          }}>
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
                              <div style={{ fontSize: 22, opacity: isSel ? 1 : 0.5, transition: "opacity 0.2s" }}>🎬</div>
                              <span style={{ fontSize: 9, color: isSel ? screen.color : "rgba(255,255,255,0.3)", fontWeight: 500, transition: "color 0.2s" }}>Scene {i+1}</span>
                            </div>
                            {isSel && <div style={{ position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: "50%",
                              background: screen.color, display: "flex", alignItems: "center", justifyContent: "center",
                              boxShadow: `0 0 8px ${screen.color}50` }}>
                              <span style={{ color: "#0B0D17", fontSize: 11, fontWeight: 700 }}>✓</span>
                            </div>}
                          </div>
                          {/* Phone */}
                          <div style={{
                            width: 56, height: 115, borderRadius: 12, overflow: "hidden", flexShrink: 0,
                            border: isSel ? `2px solid ${screen.color}` : "1px solid rgba(255,255,255,0.08)",
                            boxShadow: isSel ? `0 4px 20px ${screen.color}30` : "none",
                            transition: "all 0.25s", position: "relative",
                            background: isSel ? `linear-gradient(180deg, ${screen.color}12, ${screen.color}05)` : "rgba(255,255,255,0.02)",
                          }}>
                            <div style={{ height: 12, background: `${screen.color}15`, borderBottom: `1px solid ${screen.color}20`,
                              display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 16, height: 2.5, borderRadius: 2, background: `${screen.color}30` }} />
                            </div>
                            <div style={{ padding: 4, display: "flex", flexDirection: "column", gap: 2.5 }}>
                              <div style={{ height: 3, width: "65%", background: "rgba(255,255,255,0.08)", borderRadius: 2 }} />
                              <div style={{ height: 3, width: "40%", background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
                              <div style={{ height: 16, background: `${screen.color}08`, borderRadius: 4, marginTop: 3 }} />
                              <div style={{ height: 10, background: "rgba(255,255,255,0.03)", borderRadius: 3 }} />
                              <div style={{ height: 10, background: "rgba(255,255,255,0.03)", borderRadius: 3 }} />
                              <div style={{ height: 10, background: "rgba(255,255,255,0.03)", borderRadius: 3 }} />
                            </div>
                            {isSel && <div style={{ position: "absolute", top: 16, right: 3, width: 14, height: 14, borderRadius: "50%",
                              background: screen.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ color: "#0B0D17", fontSize: 8, fontWeight: 700 }}>✓</span>
                            </div>}
                          </div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11.5, fontWeight: isSel ? 600 : 400, color: isSel ? screen.color : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
                            {screen.name}
                          </div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{cnt} insights</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lens tabs */}
            <div ref={detailRef}>
              <div style={{ display: "flex", gap: 0, marginBottom: 16, ...glass, borderRadius: 14, overflow: "hidden" }}>
                {Object.entries(LENS_CONFIG).map(([key, cfg]) => {
                  const isActive = activeLens === key;
                  const count = lensCounts[key];
                  return (
                    <button key={key} onClick={() => setActiveLens(key)} style={{
                      flex: 1, padding: "16px 16px", border: "none", cursor: "pointer",
                      fontFamily: "inherit", transition: "all 0.25s",
                      background: isActive ? `linear-gradient(180deg, ${cfg.accent}15, transparent)` : "transparent",
                      borderBottom: `2px solid ${isActive ? cfg.accent : "transparent"}`,
                      position: "relative",
                    }}>
                      {isActive && <div style={{ position: "absolute", bottom: 0, left: "25%", right: "25%", height: 1,
                        background: cfg.accent, boxShadow: `0 0 12px ${cfg.glow}`, filter: "blur(1px)" }} />}
                      <div style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? cfg.accent : "rgba(255,255,255,0.4)" }}>
                        {cfg.icon} {cfg.label}
                      </div>
                      <div style={{ fontSize: 11, color: isActive ? cfg.accent + "90" : "rgba(255,255,255,0.2)", marginTop: 3 }}>
                        {count} insight{count !== 1 ? "s" : ""}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* User filter */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>User type:</span>
                {USER_TYPES.map(ut => (
                  <button key={ut} onClick={() => setUserFilter(ut)} style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                    background: userFilter === ut ? "rgba(255,255,255,0.1)" : "transparent",
                    color: userFilter === ut ? "#fff" : "rgba(255,255,255,0.4)",
                    border: `1px solid ${userFilter === ut ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`,
                  }}>{ut}</button>
                ))}
              </div>

              {/* Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {filteredInsights.length > 0 ? (
                  filteredInsights.map((insight, i) => (
                    <div key={insight.id} style={{ animation: `fadeIn 0.35s ease ${i * 0.04}s both` }}>
                      <InsightCard insight={insight} />
                    </div>
                  ))
                ) : (
                  <div style={{
                    gridColumn: "1 / -1", padding: "52px 20px", textAlign: "center", ...glass, borderRadius: 16,
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }}>📭</div>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>
                      No {LENS_CONFIG[activeLens].label.toLowerCase()} insights{userFilter !== "All" ? ` for "${userFilter}"` : ""}{selectedScreens.length > 0 ? " for selected screens" : ""}
                    </p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 5 }}>Try a different lens, user type, or screen selection</p>
                  </div>
                )}
              </div>

              {filteredInsights.length > 0 && (
                <div style={{
                  marginTop: 16, padding: "12px 16px", ...glass, borderRadius: 12,
                  display: "flex", gap: 24, justifyContent: "center",
                }}>
                  {Object.entries(TYPE_META).map(([type, cfg]) => {
                    const count = filteredInsights.filter(i => i.type === type).length;
                    if (count === 0) return null;
                    return (
                      <span key={type} style={{ fontSize: 12, color: cfg.text, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 3, background: cfg.dot, display: "inline-block",
                          boxShadow: `0 0 6px ${cfg.dot}40` }} />
                        {count} {cfg.label}{count !== 1 ? "s" : ""}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
