import { useState, useMemo, useEffect, useRef } from "react";

function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}
import { getSightlineData, getSectionForSeatType } from "./sightlineData";

// ─── Funny Shakespearean insults — linked to their plays ─────────────────────
const INSULTS = [
  { text: "You Banbury cheese",                                                           play: "Merry Wives of Windsor", url: "https://www.gutenberg.org/ebooks/1507" },
  { text: "You are a fishmonger",                                                         play: "Hamlet",                 url: "https://www.gutenberg.org/ebooks/1524" },
  { text: "Get you gone, you dwarf, you minimus of hindering knotgrass made, you bead, you acorn!", play: "A Midsummer Night's Dream", url: "https://www.gutenberg.org/ebooks/1514" },
  { text: "Your brain is as dry as the remainder biscuit after voyage",                   play: "As You Like It",         url: "https://www.gutenberg.org/ebooks/1522" },
  { text: "I do desire we may be better strangers",                                       play: "As You Like It",         url: "https://www.gutenberg.org/ebooks/1522" },
  { text: "Thou hast no more brain than I have in mine elbows",                           play: "Troilus and Cressida",   url: "https://www.gutenberg.org/ebooks/1527" },
  { text: "You are a saucy boy",                                                          play: "Romeo and Juliet",       url: "https://www.gutenberg.org/ebooks/1513" },
  { text: "The tartness of his face sours ripe grapes",                                   play: "Coriolanus",             url: "https://www.gutenberg.org/ebooks/1535" },
  { text: "Thou sodden-witted lord",                                                      play: "Troilus and Cressida",   url: "https://www.gutenberg.org/ebooks/1527" },
  { text: "Away, you three-inch fool",                                                    play: "Taming of the Shrew",    url: "https://www.gutenberg.org/ebooks/1511" },
  { text: "Away, you starvelling, you elf-skin, you dried neat's-tongue",                 play: "Henry IV Part 1",        url: "https://www.gutenberg.org/ebooks/1529" },
  { text: "You pygmy!",                                                                   play: "Comedy of Errors",       url: "https://www.gutenberg.org/ebooks/1504" },
  { text: "Thou wast the prettiest babe that e'er I nursed — pity thou art so little",   play: "Romeo and Juliet",       url: "https://www.gutenberg.org/ebooks/1513" },
  { text: "Thou art a very ragged Wart",                                                  play: "Henry IV Part 2",        url: "https://www.gutenberg.org/ebooks/1530" },
  { text: "Thou crusty botch of nature!",                                                 play: "Troilus and Cressida",   url: "https://www.gutenberg.org/ebooks/1527" },
  { text: "For your years, you are as full of envy as a rotten apple",                   play: "As You Like It",         url: "https://www.gutenberg.org/ebooks/1522" },
  { text: "You are old enough to know better, and yet you are not old enough for that",   play: "Twelfth Night",          url: "https://www.gutenberg.org/ebooks/1523" },
  { text: "Thou art as fat as butter — and half the height",                              play: "Henry IV Part 1",        url: "https://www.gutenberg.org/ebooks/1529" },
];

const FREE_PLAYS = [
  { label: "Hamlet",                    url: "https://www.gutenberg.org/ebooks/1524" },
  { label: "Macbeth",                   url: "https://www.gutenberg.org/ebooks/1533" },
  { label: "Romeo & Juliet",            url: "https://www.gutenberg.org/ebooks/1513" },
  { label: "A Midsummer Night's Dream", url: "https://www.gutenberg.org/ebooks/1514" },
  { label: "Othello",                   url: "https://www.gutenberg.org/ebooks/1531" },
  { label: "King Lear",                 url: "https://www.gutenberg.org/ebooks/1532" },
  { label: "The Tempest",               url: "https://www.gutenberg.org/ebooks/1540" },
  { label: "Twelfth Night",             url: "https://www.gutenberg.org/ebooks/1523" },
  { label: "Much Ado About Nothing",    url: "https://www.gutenberg.org/ebooks/1519" },
  { label: "As You Like It",            url: "https://www.gutenberg.org/ebooks/1522" },
  { label: "Richard III",               url: "https://www.gutenberg.org/ebooks/1503" },
  { label: "All plays →",               url: "https://www.gutenberg.org/ebooks/author/65" },
];

const CONTENT_W = 960; // must match #root max-width in index.css

function InsultColumn({ insults, side }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, bottom: 0,
      [side]: 0,
      width: `calc((100vw - ${CONTENT_W}px) / 2)`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      padding: "12px 8px",
      boxSizing: "border-box",
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }}>
      {insults.map((ins, i) => (
        <a
          key={i}
          href={ins.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`From ${ins.play} — click to read free`}
          style={{
            display: "block",
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "'Dancing Script', cursive",
            color: "#9E2B3A",
            opacity: 0.65,
            textDecoration: "none",
            lineHeight: 1.4,
            wordBreak: "break-word",
            textAlign: "center",
            transform: `rotate(${side === "left" ? -2 + (i % 3) : 2 - (i % 3)}deg)`,
            pointerEvents: "auto",
            cursor: "pointer",
            transition: "opacity 0.15s",
            padding: "0 6px",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "1"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "0.65"; }}
        >
          "{ins.text}"
          <span style={{ display: "block", fontSize: 12, fontFamily: "'Cinzel', serif", fontWeight: 400, opacity: 0.7, marginTop: 3 }}>
            — {ins.play}
          </span>
        </a>
      ))}
    </div>
  );
}

function InsultsBackground() {
  const left  = INSULTS.filter((_, i) => i % 2 === 0);
  const right = INSULTS.filter((_, i) => i % 2 === 1);
  return (
    <>
      <InsultColumn insults={left}  side="left"  />
      <InsultColumn insults={right} side="right" />
    </>
  );
}

const API_KEY  = import.meta.env.VITE_ANTHROPIC_KEY;
const PASSWORD = import.meta.env.VITE_PASSWORD;
const HAS_AI   = Boolean(API_KEY);
const HAS_PASS = Boolean(PASSWORD);

// ─── Discount inference ──────────────────────────────────────────────────────
const WEST_END   = ["lyceum","adelphi","novello","phoenix","gillian lynne","savoy","prince edward","duke of york","cambridge","palace","her majesty","apollo victoria","dominion","shaftesbury","garrick","gielgud","harold pinter","noel coward","vaudeville","wyndham"];
const SUBSIDISED = ["national theatre","barbican","almeida","royal court","young vic","donmar","menier","soho theatre","bush theatre","hampstead"];
const HAS_LOTTERY = ["hamilton","hamilton (musical)","hamilton the musical","les misérables","les miserables","the phantom of the opera","phantom of the opera","the lion king","lion king","mamma mia","back to the future","operation mincemeat","hadestown","next to normal"];

function inferDiscounts(venueName, minPrice, eventDate, showTitle) {
  const v = (venueName || "").toLowerCase();
  const t = (showTitle || "").toLowerCase();
  const daysUntil = eventDate ? (new Date(eventDate) - new Date()) / 86400000 : 30;
  const out = [];
  if (WEST_END.some(x => v.includes(x)))   out.push({ type: "TKTS",        tip: "TKTS booth in Leicester Square sells same-day tickets up to 50% off. Open Mon–Sat 10am–6pm, Sun 11am–4:30pm." });
  if (SUBSIDISED.some(x => v.includes(x))) out.push({ type: "Day seats",   tip: "Day seats sold at box office from 10am — often £10–25. Check the venue website the morning of." });
  if (daysUntil < 30 && daysUntil > 0 && minPrice && minPrice < 30) out.push({ type: "Preview", tip: "This show may be in previews — prices typically lower before press night." });
  out.push({ type: "Student",     tip: "Most London theatres offer student standby. Show valid student ID at the box office 45 min before curtain — often £10–18." });
  out.push({ type: "Group",       tip: "Groups of 8+ usually get 10–25% off. Call the box office directly for the best deal." });
  if (daysUntil >= 0 && daysUntil < 3) out.push({ type: "Last-minute", tip: "Check TodayTix, Official London Theatre today's tickets, and the venue's own site for unsold releases." });
  if (HAS_LOTTERY.some(x => t.includes(x) || v.includes(x)))
    out.push({ type: "Lottery", tip: "This show runs a ticket lottery — enter via TodayTix or the show's own app for a chance to win front-row or premium seats at heavily discounted prices (often £10–25). Results usually announced 2 days before the performance." });
  return out.slice(0, 5);
}

// ─── Constants ───────────────────────────────────────────────────────────────
const SEAT_TYPES   = ["Any", "Stalls", "Circle / Dress circle", "Upper circle / Balcony", "Gallery", "Pit", "Box", "Standing / GA"];
const CATEGORIES   = ["Any", "Musical", "Drama", "Comedy", "Opera", "Dance", "Family", "Immersive"];
const SORT_OPTIONS = ["Default", "Price (low–high)", "Price (high–low)", "Sightline rating", "Date (soonest)"];

const SOURCES = [
  { id: "all",      label: "All sources",             url: null },
  { id: "olt",      label: "Official London Theatre", url: "officiallondontheatre.com/theatre-tickets" },
  { id: "tkts",     label: "TKTS today",              url: "tkts.co.uk" },
  { id: "todaytix", label: "TodayTix",                url: "todaytix.com/london" },
  { id: "timeout",  label: "Time Out Theatre",        url: "timeout.com/london/theatre" },
];

const DISCOUNT_COLORS = {
  "TKTS":        { bg: "#E6F1FB", color: "#0C447C" },
  "Day seats":   { bg: "#EAF3DE", color: "#27500A" },
  "Preview":     { bg: "#FAEEDA", color: "#633806" },
  "Student":     { bg: "#EEEDFE", color: "#3C3489" },
  "Group":       { bg: "#E1F5EE", color: "#085041" },
  "Last-minute": { bg: "#FCEBEB", color: "#A32D2D" },
  "Lottery":     { bg: "#FEF3C7", color: "#92400E" },
};

const SOURCE_COLORS = {
  "olt":      { bg: "#E8DDD0", color: "#9E2B3A" },
  "tkts":     { bg: "#E8DDD0", color: "#9E2B3A" },
  "todaytix": { bg: "#E8DDD0", color: "#9E2B3A" },
  "timeout":  { bg: "#E8DDD0", color: "#9E2B3A" },
};

const DEMO_SHOWS = [
  {
    title: "Dear England",
    venue: "National Theatre",
    price: "£25–£75", priceFrom: 25, originalPrice: null, saving: null,
    date: "15 Aug 2026", rawDate: "2026-08-15", category: "Drama",
    description: "A gripping football drama in the Olivier Theatre with strong reviews and theatrical punch.",
    bookUrl: "https://officiallondontheatre.com/theatre-tickets", source: "olt",
  },
  {
    title: "Hamilton",
    venue: "Victoria Palace Theatre",
    price: "£35–£120", priceFrom: 35, originalPrice: "£150", saving: "Save up to 20%",
    date: "22 Jul 2026", rawDate: "2026-07-22", category: "Musical",
    description: "The award-winning musical with energetic staging and a strong ensemble.",
    bookUrl: "https://www.tkts.co.uk", source: "tkts",
  },
  {
    title: "The Mousetrap",
    venue: "St Martin's Theatre",
    price: "£18–£48", priceFrom: 18, originalPrice: null, saving: null,
    date: "31 Jul 2026", rawDate: "2026-07-31", category: "Drama",
    description: "The world-famous Agatha Christie whodunit in a compact West End house.",
    bookUrl: "https://www.todaytix.com/london/theatre", source: "todaytix",
  },
  {
    title: "A Midsummer Night's Dream",
    venue: "Donmar Warehouse",
    price: "£22–£45", priceFrom: 22, originalPrice: null, saving: null,
    date: "12 Jul 2026", rawDate: "2026-07-12", category: "Comedy",
    description: "A small-scale, immersive take on Shakespeare with excellent sightlines and a lively ensemble.",
    bookUrl: "https://www.timeout.com/london/theatre", source: "timeout",
  },
];

// ─── Components ──────────────────────────────────────────────────────────────
function Badge({ type, small, bg, color }) {
  const c = DISCOUNT_COLORS[type] || { bg: bg || "#F1EFE8", color: color || "#444441" };
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: small ? 10 : 11, fontWeight: 500, padding: small ? "1px 6px" : "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>
      {type}
    </span>
  );
}

function SightlineBar({ score }) {
  const pct = Math.round(((score - 1) / 4) * 100);
  const col = score >= 4.3 ? "#1D9E75" : score >= 3.8 ? "#BA7517" : score >= 3.2 ? "#D85A30" : "#A32D2D";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: "rgba(0,0,0,0.25)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color: col, minWidth: 32 }}>{score.toFixed(1)}/5</span>
    </div>
  );
}

const W = "#3D1A0A";
const W2 = "rgba(61,26,10,0.6)";
const DIV = "1px solid rgba(0,0,0,0.12)";

function ShowCard({ show, seatType }) {
  const sourceLabel = SOURCES.find(s => s.id === show.source)?.label || show.source;
  return (
    <div style={{ background: "#E8DDD0", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#9E2B3A", lineHeight: 1.3, fontFamily: "'Cinzel', serif" }}>{show.title}</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
            {show.price && <span style={{ fontSize: 15, fontWeight: 700, color: "#F0C060", whiteSpace: "nowrap" }}>{show.price}</span>}
            {show.originalPrice && <span style={{ fontSize: 12, color: W2, textDecoration: "line-through" }}>{show.originalPrice}</span>}
            {show.saving && <span style={{ fontSize: 12, color: "#27500A", fontWeight: 600 }}>{show.saving}</span>}
          </div>
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: W2, fontWeight: 600 }}>{show.venue}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          {show.date && <span style={{ fontSize: 13, color: W }}>{show.date}</span>}
          {show.category && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(0,0,0,0.07)", color: "#9E2B3A", fontWeight: 600 }}>{show.category}</span>}
          <span style={{ fontSize: 11, marginLeft: "auto", padding: "2px 8px", borderRadius: 4, background: "#9E2B3A", color: "#F0C060", fontWeight: 700 }}>{sourceLabel}</span>
        </div>
        {show.description && <p style={{ margin: "10px 0 0", fontSize: 14, color: W, lineHeight: 1.6 }}>{show.description}</p>}
      </div>
      <SightlineSection venue={show.venue} seatType={seatType} />
      <DiscountSection venueName={show.venue} showTitle={show.title} minPrice={show.priceFrom} eventDate={show.rawDate} />
      {show.bookUrl && (
        <div style={{ padding: "10px 16px", borderTop: DIV }}>
          <button style={{ fontSize: 13, padding: "7px 18px", background: "#9E2B3A", color: "#F0C060", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }} onClick={() => window.open(show.bookUrl, "_blank")}>Book ↗</button>
        </div>
      )}
    </div>
  );
}

// Pass colour context down to sightline / discount sections
function SightlineSection({ venue, seatType }) {
  const [expanded, setExpanded] = useState(false);
  const data = getSightlineData(venue);
  if (!data) return (
    <div style={{ padding: "10px 16px", borderTop: DIV }}>
      <p style={{ margin: 0, fontSize: 13, color: W2 }}>Sightline data not available. Check SeatPlan.com.</p>
    </div>
  );
  const highlightSection = getSectionForSeatType(data, seatType);
  const label = data.overall >= 4.5 ? "Excellent" : data.overall >= 4.0 ? "Good" : data.overall >= 3.5 ? "Fair" : "Poor";
  return (
    <div style={{ padding: "10px 16px", borderTop: DIV }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: W, fontWeight: 700 }}>Sightlines · {(venue || "").split(" ").slice(0, 3).join(" ")}</span>
        <span style={{ fontSize: 12, color: W2 }}>{label}</span>
      </div>
      <SightlineBar score={data.overall} />
      {highlightSection && (
        <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(0,0,0,0.06)", borderRadius: 8 }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#F0C060" }}>{highlightSection}</p>
          <SightlineBar score={data.sections[highlightSection].score} />
          <p style={{ margin: "5px 0 0", fontSize: 13, color: W, lineHeight: 1.5 }}>{data.sections[highlightSection].notes}</p>
        </div>
      )}
      <button style={{ marginTop: 8, background: "none", border: "none", padding: 0, fontSize: 13, color: W2, cursor: "pointer" }} onClick={() => setExpanded(o => !o)}>
        {expanded ? "▲ Hide all sections" : `▼ All sections (${Object.keys(data.sections).length})`}
      </button>
      {expanded && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(data.sections).map(([name, sec]) => (
            <div key={name}>
              <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700, color: W }}>{name}</p>
              <SightlineBar score={sec.score} />
              <p style={{ margin: "4px 0 0", fontSize: 13, color: W2, lineHeight: 1.5 }}>{sec.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DiscountSection({ venueName, showTitle, minPrice, eventDate }) {
  const [open, setOpen] = useState(false);
  const discounts = inferDiscounts(venueName, minPrice, eventDate, showTitle);
  return (
    <div style={{ padding: "10px 16px", borderTop: DIV }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {discounts.map(d => (
          <span key={d.type} style={{ fontSize: 12, fontWeight: 600, padding: "2px 9px", borderRadius: 4, background: "rgba(0,0,0,0.07)", color: "#9E2B3A" }}>{d.type}</span>
        ))}
      </div>
      {open && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {discounts.map(d => (
            <div key={d.type} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 4, background: "rgba(0,0,0,0.07)", color: "#9E2B3A", whiteSpace: "nowrap" }}>{d.type}</span>
              <p style={{ margin: 0, fontSize: 13, color: W, lineHeight: 1.5 }}>{d.tip}</p>
            </div>
          ))}
        </div>
      )}
      <button style={{ marginTop: 8, background: "none", border: "none", padding: 0, fontSize: 13, color: W2, cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        {open ? "▲ Hide discount tips" : "▼ Discount tips"}
      </button>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function extractJSON(text) {
  let t = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = t.indexOf("[");
  if (start === -1) return null;
  let depth = 0, end = -1;
  for (let i = start; i < t.length; i++) {
    if (t[i] === "[") depth++;
    else if (t[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) {
    t = t.slice(start);
    const lastGood = Math.max(t.lastIndexOf("},"), t.lastIndexOf("}]"));
    if (lastGood !== -1) t = t.slice(0, lastGood + 1) + "]";
    else t = t + "]";
  } else {
    t = t.slice(start, end + 1);
  }
  try { return JSON.parse(t); } catch {
    try { return JSON.parse(t.replace(/,\s*([}\]])/g, "$1")); } catch { return null; }
  }
}

// ─── Date helpers (DD/MM/YYYY ↔ YYYY-MM-DD) ──────────────────────────────────
function toISO(ddmmyyyy) {
  const parts = ddmmyyyy.replace(/[^0-9]/g, "");
  if (parts.length !== 8) return "";
  return `${parts.slice(4,8)}-${parts.slice(2,4)}-${parts.slice(0,2)}`;
}
function toBritish(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function formatDateInput(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0,2)}/${digits.slice(2)}`;
  return `${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4)}`;
}

function DateInput({ value, onChange, min }) {
  const [text, setText] = useState(toBritish(value));

  useEffect(() => { setText(toBritish(value)); }, [value]);

  function handleType(e) {
    const fmt = formatDateInput(e.target.value);
    setText(fmt);
    if (fmt.length === 0) { onChange(""); return; }
    if (fmt.length === 10) { const iso = toISO(fmt); if (iso) onChange(iso); }
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        value={text}
        onChange={handleType}
        placeholder="DD/MM/YYYY"
        inputMode="numeric"
        maxLength={10}
        style={{ width: "100%", fontSize: 15, background: "#fff", color: "#111", border: "none", borderRadius: 8, padding: "10px 40px 10px 12px", boxSizing: "border-box" }}
      />
      {/* Native date input sits over the icon — transparent, so clicking the icon opens the real picker */}
      <input
        type="date"
        value={value}
        min={min}
        onChange={e => onChange(e.target.value)}
        style={{
          position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
          width: 28, height: 28, opacity: 0, cursor: "pointer",
          fontSize: 0, padding: 0, border: "none",
        }}
        tabIndex={-1}
      />
      <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none", lineHeight: 1 }}>📅</span>
    </div>
  );
}

// ─── Search cache (localStorage, keyed by params + date) ─────────────────────
function cacheKey(params) {
  return `lta_${new Date().toISOString().slice(0, 10)}_${JSON.stringify(params)}`;
}
function cacheGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function cacheSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

async function callClaude(messages, system, model) {
  const useSearch = model === "claude-sonnet-4-6";
  const body = (msgs) => JSON.stringify({
    model,
    max_tokens: 2000,
    ...(useSearch ? { tools: [{ type: "web_search_20250305", name: "web_search" }] } : {}),
    system,
    messages: msgs,
  });
  const HEADERS = { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" };
  const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: HEADERS, body: body(messages) });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  let data = await res.json();
  let msgs = [...messages];
  for (let i = 0; i < 2 && data.stop_reason === "tool_use"; i++) {
    msgs = [...msgs, { role: "assistant", content: data.content }];
    const r2 = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: HEADERS, body: body(msgs) });
    if (!r2.ok) throw new Error(`API error ${r2.status}`);
    data = await r2.json();
  }
  return data;
}

function isLottery(show) {
  const hay = `${show.title} ${show.description} ${show.price} ${show.saving}`.toLowerCase();
  return hay.includes("lottery") || hay.includes("ballot") || hay.includes("lucky dip");
}

const MODELS = [
  { id: "claude-haiku-4-5-20251001", label: "Peasant",          desc: "Fast & cheap" },
  { id: "claude-sonnet-4-6",         label: "Make Nero Poorer", desc: "Smarter & slower" },
];

// ─── Main app ─────────────────────────────────────────────────────────────────
export default function App() {
  const vw = useWindowWidth();
  const isMobile = vw < 700;

  const [unlocked,    setUnlocked]   = useState(!HAS_PASS);
  const [pwInput,     setPwInput]    = useState("");
  const [model,       setModel]      = useState(MODELS[0].id);
  const [pwError,     setPwError]    = useState(false);

  const [shows,       setShows]      = useState([]);
  const [loading,     setLoading]    = useState(false);
  const [error,       setError]      = useState("");
  const [searched,    setSearched]   = useState(false);
  const [loadingMsg,  setLoadingMsg] = useState("");

  const [source,   setSource]   = useState("all");
  const [keyword,  setKeyword]  = useState("");
  const [category, setCategory] = useState("Any");
  const [seatType, setSeatType] = useState("Any");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy,   setSortBy]   = useState("Default");

  const [aiQ,      setAiQ]      = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  function tryUnlock() {
    if (pwInput === PASSWORD) { setUnlocked(true); setPwError(false); }
    else { setPwError(true); }
  }

  async function searchShows() {
    if (!HAS_AI) {
      setShows(DEMO_SHOWS); setSearched(true); return;
    }
    setLoading(true); setError(""); setShows([]); setSearched(true);

    const src  = SOURCES.find(s => s.id === source);
    const sites = source === "all"
      ? "officiallondontheatre.com/theatre-tickets, tkts.co.uk, todaytix.com/london, timeout.com/london/theatre"
      : src.url;

    const filters = [
      keyword  && `keyword:"${keyword}"`,
      category && category !== "Any" && `category:${category}`,
      seatType && seatType !== "Any" && `seat:${seatType}`,
      dateFrom && `from:${dateFrom}`,
      dateTo   && `to:${dateTo}`,
      priceMin && `min:£${priceMin}`,
      priceMax && `max:£${priceMax}`,
    ].filter(Boolean).join(" ");

    const prompt = [
      `List current London theatre shows available on ${sites}.`,
      filters ? `Filters: ${filters}.` : "Return a broad selection of what is currently running.",
      "IMPORTANT: Do NOT include any lottery tickets, ballot entries, or seats that require winning a draw to purchase.",
      "Return ONLY a JSON array starting with [ and ending with ]. No markdown, no explanation.",
      'Each object: title, venue, price (e.g."£25–£85"), priceFrom (number|null), originalPrice (string|null), saving (string|null), date (human-readable|null), rawDate (YYYY-MM-DD|null), category (string|null), description (1 sentence max|null), bookUrl (string|null), source (one of: olt tkts todaytix timeout).',
      "Up to 15 shows. Return [] if nothing found.",
    ].join("\n");

    const ck = cacheKey({ source, keyword, category, seatType, dateFrom, dateTo, priceMin, priceMax });
    const cached = cacheGet(ck);
    if (cached) {
      setShows(cached); setLoading(false); setLoadingMsg(""); return;
    }

    setLoadingMsg("Searching listings…");
    try {
      const data = await callClaude([{ role: "user", content: prompt }],
        "You are a London theatre search assistant. Search the web for current London theatre shows, then return ONLY a raw JSON array starting with [ and ending with ]. No markdown, no preamble. Never include lottery or ballot tickets.",
        model);
      setLoadingMsg("Loading sightline data…");

      const allText = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
      if (!allText) throw new Error("No response received — please try again");

      const results = extractJSON(allText);
      if (!results || !Array.isArray(results)) throw new Error("Could not parse results — please try again");

      let sorted = results.filter(s => !isLottery(s));
      if (sortBy === "Price (low–high)")  sorted.sort((a,b) => (a.priceFrom||9999)-(b.priceFrom||9999));
      if (sortBy === "Price (high–low)")  sorted.sort((a,b) => (b.priceFrom||0)-(a.priceFrom||0));
      if (sortBy === "Sightline rating") {
        sorted.sort((a,b) => {
          const as = getSightlineData(a.venue)?.overall || 0;
          const bs = getSightlineData(b.venue)?.overall || 0;
          return bs - as;
        });
      }
      if (sortBy === "Date (soonest)") sorted.sort((a,b) => (a.rawDate||"9999") < (b.rawDate||"9999") ? -1 : 1);

      cacheSet(ck, sorted);
      setShows(sorted);
    } catch (err) { setError(`Search failed: ${err.message}`); }
    setLoading(false);
    setLoadingMsg("");
  }

  async function askAI() {
    if (!aiQ.trim()) return;
    setAiLoading(true); setAiAnswer("");
    if (!HAS_AI) {
      setAiAnswer("AI is not available in this build.");
      setAiLoading(false);
      return;
    }
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model,
          max_tokens: 600,
          system: `You are a London theatre expert. Practical, specific advice about seats, discounts, venues.
Seat types: stalls (ground level, closest), dress circle (elevated front balcony), upper circle (steep, cheaper), gallery (highest, cheapest), boxes (sides), pit (very front).
Discounts: TKTS Leicester Square up to 50% same-day, day seats at box office 10am £10–25, student standby 45 min before curtain, TodayTix app, groups 8+ direct to box office.
3–4 punchy bullets. Be specific about prices and procedures.`,
          messages: [{ role: "user", content: aiQ }]
        })
      });
      const d = await res.json();
      setAiAnswer(d.content?.find(b => b.type === "text")?.text || "No response.");
    } catch { setAiAnswer("AI assistant unavailable. Check your connection and try again."); }
    setAiLoading(false);
  }

  const tabStyle = (id) => ({
    flex: 1, padding: "10px 4px", fontSize: 13, fontWeight: source === id ? 700 : 500,
    background: source === id ? "#9E2B3A" : "rgba(0,0,0,0.06)",
    color: source === id ? "#F0C060" : "#9E2B3A",
    border: "none", borderLeft: id !== "all" ? "1px solid rgba(0,0,0,0.1)" : "none",
    borderRadius: 0, cursor: "pointer",
  });

  // ── Password gate ────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div style={{ fontFamily: "'Cinzel', serif", padding: isMobile ? "1.5rem 0" : "3rem 0", position: "relative", zIndex: 1, textAlign: "center" }}>
        {!isMobile && <InsultsBackground />}
        <style>{`
          @keyframes witchDance {
            0%   { transform: translateY(0) rotate(-4deg) scaleX(1); }
            20%  { transform: translateY(-18px) rotate(4deg) scaleX(-1); }
            40%  { transform: translateY(-6px) rotate(-6deg) scaleX(1); }
            60%  { transform: translateY(-22px) rotate(6deg) scaleX(-1); }
            80%  { transform: translateY(-4px) rotate(-3deg) scaleX(1); }
            100% { transform: translateY(0) rotate(-4deg) scaleX(1); }
          }
        `}</style>

        {/* Heading + broom + witch — all centred in a flex column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
          <div style={{ background: "#9E2B3A", borderRadius: 16, padding: isMobile ? "8px 20px" : "10px 32px", marginBottom: 8 }}>
            <h2 style={{ margin: 0, fontSize: isMobile ? 22 : 34, fontWeight: 700, color: "#F0C060", letterSpacing: "0.5px", fontFamily: "'Cinzel', serif", whiteSpace: "nowrap" }}>London Theatre Finder</h2>
          </div>
          <svg viewBox="0 0 400 56" width={isMobile ? "90vw" : 480} xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <rect x="8" y="24" width="300" height="7" rx="3.5" fill="#6B3A1F" />
            <rect x="306" y="14" width="22" height="28" rx="3" fill="#9E2B3A" />
            <ellipse cx="310" cy="28" rx="6" ry="13" fill="#F0C060" />
            {[0,1,2,3,4,5,6,7,8,9].map(i => (
              <line key={i} x1={328} y1={17 + i * 2.8} x2={390 - (i % 4) * 8} y2={4 + i * 5.5} stroke="#6B3A1F" strokeWidth="2.2" strokeLinecap="round" />
            ))}
          </svg>
          {/* Dancing witch */}
          <div style={{ fontSize: isMobile ? 80 : 110, lineHeight: 1, marginTop: 8, animation: "witchDance 1.4s ease-in-out infinite" }}>
            🧙‍♀️
          </div>
        </div>

        {/* Password form */}
        <div style={{ display: "inline-block", width: "100%", maxWidth: 360, padding: "0 4px", boxSizing: "border-box" }}>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#9E2B3A", fontWeight: 600, letterSpacing: "0.05em" }}>Enter the password to enter</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="password" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && tryUnlock()}
              placeholder="Password" autoFocus
              style={{ flex: 1, fontSize: 15, padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${pwError ? "#9E2B3A" : "rgba(158,43,58,0.3)"}`, outline: "none", background: "#fff" }}
            />
            <button onClick={tryUnlock} style={{ padding: "0 20px", fontSize: 15, fontWeight: 700, background: "#9E2B3A", color: "#F0C060", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Cinzel', serif" }}>Enter</button>
          </div>
          {pwError && <p style={{ margin: "10px 0 0", fontSize: 13, color: "#9E2B3A", fontWeight: 600 }}>Wrong password — try again.</p>}
        </div>

        {/* Elizabeth I portrait */}
        <div style={{ marginTop: 32 }}>
          <a href="https://en.wikipedia.org/wiki/Spanish_Armada" target="_blank" rel="noopener noreferrer" style={{ display: "block", width: isMobile ? "85%" : "60%", maxWidth: 340, margin: "0 auto" }}>
            <img
              src="/elizabeth.png"
              alt="Elizabeth I — Armada Portrait"
              style={{ width: "100%", borderRadius: 12, border: "3px solid #9E2B3A", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", display: "block", cursor: "pointer", transition: "opacity 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            />
          </a>
          <p style={{ margin: "10px 0 0", fontSize: 11, color: "#9E2B3A", opacity: 0.6, letterSpacing: "0.08em" }}>ELIZABETH I — BY APPOINTMENT</p>
        </div>
      </div>
    );
  }

  // ── Main UI ──────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Cinzel', serif", padding: isMobile ? "1rem 0" : "1.25rem 0", position: "relative", zIndex: 1 }}>
      {!isMobile && <InsultsBackground />}
      <div style={{ marginBottom: isMobile ? "1.25rem" : "1.75rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ background: "#9E2B3A", borderRadius: 16, padding: isMobile ? "8px 18px" : "10px 32px", marginBottom: 8 }}>
            <h2 style={{ margin: 0, fontSize: isMobile ? 22 : 34, fontWeight: 700, color: "#F0C060", letterSpacing: "0.5px", fontFamily: "'Cinzel', serif", whiteSpace: "nowrap" }}>London Theatre Finder</h2>
          </div>
          <svg viewBox="0 0 400 56" width={isMobile ? "90vw" : 480} xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            {/* Handle */}
            <rect x="8" y="24" width="300" height="7" rx="3.5" fill="#6B3A1F" />
            {/* Bristle base band */}
            <rect x="306" y="14" width="22" height="28" rx="3" fill="#9E2B3A" />
            {/* Knot */}
            <ellipse cx="310" cy="28" rx="6" ry="13" fill="#F0C060" />
            {/* Bristles */}
            {[0,1,2,3,4,5,6,7,8,9].map(i => (
              <line key={i} x1={328} y1={17 + i * 2.8} x2={390 - (i % 4) * 8} y2={4 + i * 5.5} stroke="#6B3A1F" strokeWidth="2.2" strokeLinecap="round" />
            ))}
          </svg>
        </div>
      </div>

      {/* AI assistant */}
      <div style={{ background: "#E8DDD0", borderRadius: 14, padding: isMobile ? "1rem" : "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        <p style={{ margin: "0 0 12px", fontSize: isMobile ? 14 : 16, fontWeight: 700, color: "#9E2B3A" }}>Ask about seats, discounts or venues</p>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 8 }}>
          <input type="text" value={aiQ} onChange={e => setAiQ(e.target.value)} onKeyDown={e => e.key === "Enter" && askAI()} placeholder="e.g. Best cheap seats at the NT?" style={{ flex: 1, fontSize: 15, background: "#fff", color: "#111", border: "none", borderRadius: 8, padding: "10px 12px" }} />
          <button onClick={askAI} disabled={!aiQ.trim() || aiLoading} style={{ padding: isMobile ? "10px 0" : "0 18px", fontSize: 15, fontWeight: 700, background: "#9E2B3A", color: "#F0C060", border: "none", borderRadius: 8, cursor: "pointer" }}>{aiLoading ? "…" : "Ask ↗"}</button>
        </div>
        {aiAnswer && <div style={{ marginTop: 12, fontSize: 15, color: W, lineHeight: 1.75, whiteSpace: "pre-wrap", borderTop: DIV, paddingTop: 12 }}>{aiAnswer}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {["Stalls vs upper circle?", "TKTS tips", "Student discounts tonight", "Best family shows under £40"].map(q => (
            <button key={q} onClick={() => setAiQ(q)} style={{ fontSize: 13, padding: "5px 13px", borderRadius: 20, background: "rgba(0,0,0,0.06)", color: "#9E2B3A", border: "1px solid rgba(128,0,32,0.25)", cursor: "pointer" }}>{q}</button>
          ))}
        </div>
      </div>

      {/* Search panel */}
      <div style={{ background: "#E8DDD0", borderRadius: 14, padding: isMobile ? "1rem" : "1.5rem", marginBottom: "1.25rem" }}>
        <p style={{ margin: "0 0 18px", fontSize: 18, fontWeight: 700, color: "#9E2B3A", letterSpacing: "0.5px" }}>Search &amp; filter</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#9E2B3A", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Source</label>
          {isMobile ? (
            <select value={source} onChange={e => setSource(e.target.value)} style={{ width: "100%", fontSize: 15, background: "#fff", color: "#111", border: "none", borderRadius: 8, padding: "10px 12px", boxSizing: "border-box" }}>
              {SOURCES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          ) : (
            <div style={{ display: "flex", width: "100%", border: "1.5px solid rgba(158,43,58,0.3)", borderRadius: 8, overflow: "hidden" }}>
              {SOURCES.map(s => <button key={s.id} onClick={() => setSource(s.id)} style={tabStyle(s.id)}>{s.label}</button>)}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#9E2B3A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Show or keyword</label>
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key === "Enter" && searchShows()} placeholder="e.g. Hamilton, Chekhov, immersive, ballet…" style={{ width: "100%", fontSize: 15, background: "#fff", color: "#111", border: "none", borderRadius: 8, boxSizing: "border-box", background: "#fff", color: "#111", border: "none", borderRadius: 8 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#9E2B3A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", fontSize: 15, background: "#fff", color: "#111", border: "none", borderRadius: 8 }}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#9E2B3A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Seat type</label>
            <select value={seatType} onChange={e => setSeatType(e.target.value)} style={{ width: "100%", fontSize: 15, background: "#fff", color: "#111", border: "none", borderRadius: 8 }}>{SEAT_TYPES.map(s => <option key={s}>{s}</option>)}</select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#9E2B3A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>From date</label>
            <DateInput value={dateFrom} onChange={setDateFrom} min={today} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#9E2B3A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>To date</label>
            <DateInput value={dateTo} onChange={setDateTo} min={dateFrom || today} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#9E2B3A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Price range (£){priceMin || priceMax ? ` — £${priceMin || "0"} to £${priceMax || "any"}` : ""}
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", boxSizing: "border-box" }}>
            <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="Min" min={0} style={{ flex: 1, minWidth: 0, fontSize: 15, background: "#fff", color: "#111", border: "none", borderRadius: 8, padding: "8px" }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#9E2B3A", flexShrink: 0 }}>to</span>
            <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Max" min={0} style={{ flex: 1, minWidth: 0, fontSize: 15, background: "#fff", color: "#111", border: "none", borderRadius: 8, padding: "8px" }} />
            {(priceMin || priceMax) && <button onClick={() => { setPriceMin(""); setPriceMax(""); }} style={{ fontSize: 14, padding: "6px 10px", background: "#9E2B3A", color: "#F0C060", border: "none", borderRadius: 8, cursor: "pointer", flexShrink: 0 }}>✕</button>}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#9E2B3A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sort by</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: "100%", fontSize: 15, background: "#fff", color: "#111", border: "none", borderRadius: 8 }}>{SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}</select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#9E2B3A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Model</label>
          <div style={{ display: "flex", border: "1.5px solid rgba(158,43,58,0.3)", borderRadius: 8, overflow: "hidden" }}>
            {MODELS.map((m, i) => (
              <button key={m.id} onClick={() => setModel(m.id)} style={{
                flex: 1, padding: "9px 8px", fontSize: isMobile ? 12 : 13, fontWeight: model === m.id ? 700 : 400,
                background: model === m.id ? "#9E2B3A" : "rgba(0,0,0,0.04)",
                color: model === m.id ? "#F0C060" : "#9E2B3A",
                border: "none", borderLeft: i > 0 ? "1px solid rgba(158,43,58,0.2)" : "none",
                cursor: "pointer", fontFamily: "'Cinzel', serif",
                whiteSpace: isMobile ? "normal" : "nowrap", lineHeight: 1.3,
              }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={searchShows} disabled={loading} style={{ width: "100%", padding: "14px 0", fontSize: 17, fontWeight: 800, letterSpacing: "-0.2px", background: "#9E2B3A", color: "#F0C060", border: "none", borderRadius: 10, cursor: "pointer" }}>
          {loading ? (loadingMsg || "Searching…") : "Search shows ↗"}
        </button>
        {!HAS_AI && (
          <p style={{ marginTop: 12, fontSize: 14, color: W2 }}>
            Showing sample results — deploy with VITE_ANTHROPIC_KEY to enable live search.
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "var(--color-background-danger)", border: "0.5px solid var(--color-border-danger)", borderRadius: "var(--border-radius-md)", padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "var(--color-text-danger)" }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.5rem", textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", fontSize: 14, color: "var(--color-text-primary)" }}>{loadingMsg || "Searching live listings…"}</p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>
            Fetching shows from the web — this takes 10–20 seconds
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && shows.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{shows.length} show{shows.length !== 1 ? "s" : ""} found</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[...new Set(shows.map(s => s.source))].filter(Boolean).map(src => {
                const sc = SOURCE_COLORS[src] || {};
                const lbl = SOURCES.find(s => s.id === src)?.label || src;
                return <span key={src} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: sc.bg || "#F1EFE8", color: sc.color || "#444441", fontWeight: 500 }}>{lbl}</span>;
              })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {shows.map((show, i) => <ShowCard key={i} show={show} seatType={seatType} />)}
          </div>
        </>
      )}

      {!loading && searched && shows.length === 0 && !error && (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <p style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700, color: "#9E2B3A", letterSpacing: "0.5px" }}>Not today.</p>
          <img src="/lucky_picture.png.jpeg" alt="Lucky" style={{ width: "60%", maxWidth: 280, borderRadius: 12, border: "3px solid #9E2B3A", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", display: "block", margin: "0 auto" }} />
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Ticket sites</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          {[
            ["Official London Theatre", "https://officiallondontheatre.com/theatre-tickets/"],
            ["TKTS", "https://www.tkts.co.uk"],
            ["TodayTix", "https://www.todaytix.com/london"],
            ["Time Out Theatre", "https://www.timeout.com/london/theatre"],
            ["SeatPlan", "https://seatplan.com"],
            ["r/londontheatre", "https://reddit.com/r/londontheatre"],
          ].map(([l, u]) => (
            <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--color-text-info)" }}>{l} ↗</a>
          ))}
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Read the plays free</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {FREE_PLAYS.map(({ label, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--color-text-info)" }}>{label} ↗</a>
          ))}
        </div>
      </div>
    </div>
  );
}
