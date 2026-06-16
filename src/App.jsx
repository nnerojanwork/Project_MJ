import { useState } from "react";

// Feature gate: set VITE_ANTHROPIC_KEY in your Vercel/GitHub env to enable AI
const HAS_AI = Boolean(import.meta.env.VITE_ANTHROPIC_KEY);

// ─── Discount inference ──────────────────────────────────────────────────────
const WEST_END   = ["lyceum","adelphi","novello","phoenix","gillian lynne","savoy","prince edward","duke of york","cambridge","palace","her majesty","apollo victoria","dominion","shaftesbury","garrick","gielgud","harold pinter","noel coward","vaudeville","wyndham"];
const SUBSIDISED = ["national theatre","barbican","almeida","royal court","young vic","donmar","menier","soho theatre","bush theatre","hampstead"];

function inferDiscounts(venueName, minPrice, eventDate) {
  const v = (venueName || "").toLowerCase();
  const daysUntil = eventDate ? (new Date(eventDate) - new Date()) / 86400000 : 30;
  const out = [];
  if (WEST_END.some(x => v.includes(x)))   out.push({ type: "TKTS",        tip: "TKTS booth in Leicester Square sells same-day tickets up to 50% off. Open Mon–Sat 10am–6pm, Sun 11am–4:30pm." });
  if (SUBSIDISED.some(x => v.includes(x))) out.push({ type: "Day seats",   tip: "Day seats sold at box office from 10am — often £10–25. Check the venue website the morning of." });
  if (daysUntil < 30 && daysUntil > 0 && minPrice && minPrice < 30) out.push({ type: "Preview", tip: "This show may be in previews — prices typically lower before press night." });
  out.push({ type: "Student",     tip: "Most London theatres offer student standby. Show valid student ID at the box office 45 min before curtain — often £10–18." });
  out.push({ type: "Group",       tip: "Groups of 8+ usually get 10–25% off. Call the box office directly for the best deal." });
  if (daysUntil >= 0 && daysUntil < 3) out.push({ type: "Last-minute", tip: "Check TodayTix, Official London Theatre today's tickets, and the venue's own site for unsold releases." });
  return out.slice(0, 4);
}

// ─── Constants ───────────────────────────────────────────────────────────────
const SEAT_TYPES = ["Any", "Stalls", "Circle / Dress circle", "Upper circle / Balcony", "Gallery", "Pit", "Box", "Standing / GA"];
const CATEGORIES = ["Any", "Musical", "Drama", "Comedy", "Opera", "Dance", "Family", "Immersive"];
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
};

const SOURCE_COLORS = {
  "olt":      { bg: "#FBEAF0", color: "#72243E" },
  "tkts":     { bg: "#E6F1FB", color: "#0C447C" },
  "todaytix": { bg: "#EEEDFE", color: "#3C3489" },
  "timeout":  { bg: "#EAF3DE", color: "#27500A" },
};

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
      <div style={{ flex: 1, height: 4, background: "var(--color-border-tertiary)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color: col, minWidth: 32 }}>{score.toFixed(1)}/5</span>
    </div>
  );
}

function SightlineSection({ score, notes, venue }) {
  const validScore = typeof score === "number" && score >= 1 && score <= 5;
  const displayScore = validScore ? score : null;
  const label = score >= 4.5 ? "Excellent" : score >= 4.0 ? "Good" : score >= 3.5 ? "Fair" : "Poor";
  return (
    <div style={{ padding: "9px 14px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500 }}>
          Sightlines · {(venue || "Venue").split(" ").slice(0, 3).join(" ")}
        </span>
        {displayScore && (
          <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{label}</span>
        )}
      </div>
      {displayScore ? (
        <>
          <SightlineBar score={displayScore} />
          {notes && <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{notes}</p>}
        </>
      ) : (
        <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
          {notes || "Sightline data not available. Check SeatPlan.com for this venue."}
        </p>
      )}
    </div>
  );
}

function DiscountSection({ venueName, minPrice, eventDate }) {
  const [open, setOpen] = useState(false);
  const discounts = inferDiscounts(venueName, minPrice, eventDate);
  return (
    <div style={{ padding: "8px 14px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {discounts.map(d => <Badge key={d.type} type={d.type} />)}
      </div>
      {open && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 7 }}>
          {discounts.map(d => (
            <div key={d.type} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Badge type={d.type} small />
              <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{d.tip}</p>
            </div>
          ))}
        </div>
      )}
      <button style={{ marginTop: 8, background: "none", border: "none", padding: 0, fontSize: 12, color: "var(--color-text-secondary)", cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        {open ? "▲ Hide discount tips" : "▼ Discount tips"}
      </button>
    </div>
  );
}

function ShowCard({ show }) {
  const sc = SOURCE_COLORS[show.source] || { bg: "#F1EFE8", color: "#444441" };
  const sourceLabel = SOURCES.find(s => s.id === show.source)?.label || show.source;
  const score = typeof show.sightlineScore === "number" ? show.sightlineScore : null;
  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
          <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.3 }}>{show.title}</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
            {show.price && <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>{show.price}</span>}
            {show.originalPrice && <span style={{ fontSize: 11, color: "var(--color-text-secondary)", textDecoration: "line-through" }}>{show.originalPrice}</span>}
            {show.saving && <span style={{ fontSize: 11, color: "#0F6E56", fontWeight: 500 }}>{show.saving}</span>}
          </div>
        </div>
        <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--color-text-secondary)" }}>{show.venue}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          {show.date && <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{show.date}</span>}
          {show.category && <Badge type={show.category} small bg="#F1EFE8" color="#444441" />}
          <span style={{ fontSize: 10, marginLeft: "auto", padding: "1px 7px", borderRadius: 4, background: sc.bg, color: sc.color, fontWeight: 500 }}>{sourceLabel}</span>
        </div>
        {show.description && <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{show.description}</p>}
      </div>
      <SightlineSection score={score} notes={show.sightlineNotes} venue={show.venue} />
      <DiscountSection venueName={show.venue} minPrice={show.priceFrom} eventDate={show.rawDate} />
      {show.bookUrl && (
        <div style={{ padding: "8px 14px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <button style={{ fontSize: 12, padding: "5px 14px" }} onClick={() => window.open(show.bookUrl, "_blank")}>Book ↗</button>
        </div>
      )}
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

// Handles the multi-turn tool_use flow automatically, up to 4 turns
async function callClaudeWithSearch(messages, system) {
  if (!HAS_AI) throw new Error("AI disabled: no VITE_ANTHROPIC_KEY configured");
  const BASE = {
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    system,
  };
  let msgs = [...messages];
  for (let turn = 0; turn < 4; turn++) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...BASE, messages: msgs }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    if (data.stop_reason !== "tool_use") return data;
    // Continue the conversation — the API server handles actual web fetch
    msgs = [...msgs, { role: "assistant", content: data.content }];
  }
  throw new Error("Too many tool turns — please try again");
}

// ─── Main app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [shows, setShows]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [searched, setSearched] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

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

  async function searchShows() {
    setLoading(true); setError(""); setShows([]); setSearched(true);

    const src = SOURCES.find(s => s.id === source);
    const sites = source === "all"
      ? "officiallondontheatre.com/theatre-tickets, tkts.co.uk, todaytix.com/london, timeout.com/london/theatre"
      : src.url;

    const filters = [
      keyword  && `keyword: "${keyword}"`,
      category && category !== "Any" && `category: ${category}`,
      seatType && seatType !== "Any" && `seat type: ${seatType}`,
      dateFrom && `from date: ${dateFrom}`,
      dateTo   && `to date: ${dateTo}`,
      priceMin && `min price: £${priceMin}`,
      priceMax && `max price: £${priceMax}`,
    ].filter(Boolean).join(", ");

    const prompt = [
      `Search ${sites} for current London theatre shows and ticket deals.`,
      filters ? `User filters: ${filters}.` : "Return a broad selection of current shows.",
      "",
      "Also search reddit.com/r/londontheatre and seatplan.com for real audience sightline reviews for each venue found. Use those reviews PLUS your own architectural knowledge of each venue (seating rake, balcony overhangs, pillars, stage shape, house size) to produce a sightlineScore and sightlineNotes for each show.",
      "",
      "CRITICAL sightline scoring rules:",
      "- Scores MUST vary realistically between venues. Do NOT give all venues the same score.",
      "- Tiny studio theatres (Donmar, Almeida, Menier, Bush): 4.3–4.8",
      "- Mid-size modern/subsidised houses (National Theatre, Barbican, Young Vic): 4.0–4.6",
      "- Classic mid-size West End (Phoenix, Cambridge, Novello, Savoy): 3.8–4.3",
      "- Large Victorian West End with restricted side seats (Lyceum, Palace, Her Majesty's, Gillian Lynne, Shaftesbury): 3.4–4.0",
      "- Very large or problematic venues (Dominion, Eventim Apollo): 3.0–3.6",
      "- sightlineNotes must be 2–3 specific sentences: name best sections/rows, worst sections, any pillars/rails/overhangs, rake quality.",
      "",
      "Return ONLY a raw JSON array starting with [ and ending with ]. No preamble, no markdown, no trailing text.",
      "Each object: title, venue, price (string e.g. £25–£85), priceFrom (number|null), originalPrice (string|null), saving (string|null), date (human readable|null), rawDate (YYYY-MM-DD|null), category (string|null), description (string|null), bookUrl (string|null), source (one of: olt tkts todaytix timeout), sightlineScore (number 1.0–5.0), sightlineNotes (string).",
      "Return up to 20 shows. If nothing found, return [].",
    ].join("\n");

    const system = `You are a London theatre search and sightline expert. Search the web, then return ONLY a raw JSON array. The response must begin with [ and end with ]. No markdown, no explanation, no preamble.`;

    setLoadingMsg("Searching listings…");
    try {
      const data = await callClaudeWithSearch([{ role: "user", content: prompt }], system);
      setLoadingMsg("Analysing sightlines…");

      const allText = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
      if (!allText) throw new Error("No response received — please try again");

      const results = extractJSON(allText);
      if (!results || !Array.isArray(results)) throw new Error("Could not parse results — please try again");

      let sorted = [...results];
      if (sortBy === "Price (low–high)")  sorted.sort((a,b) => (a.priceFrom||9999)-(b.priceFrom||9999));
      if (sortBy === "Price (high–low)")  sorted.sort((a,b) => (b.priceFrom||0)   -(a.priceFrom||0));
      if (sortBy === "Sightline rating")  sorted.sort((a,b) => (b.sightlineScore||0)-(a.sightlineScore||0));
      if (sortBy === "Date (soonest)")    sorted.sort((a,b) => (a.rawDate||"9999") < (b.rawDate||"9999") ? -1 : 1);

      setShows(sorted);
    } catch (err) { setError(`Search failed: ${err.message}`); }
    setLoading(false);
    setLoadingMsg("");
  }

  async function askAI() {
    if (!aiQ.trim()) return;
    setAiLoading(true); setAiAnswer("");
    if (!HAS_AI) {
      setAiAnswer("AI is disabled in this build. Provide VITE_ANTHROPIC_KEY to enable.");
      setAiLoading(false);
      return;
    }
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are a London theatre expert. Practical, specific advice about seats, discounts, venues.
Seat types: stalls (ground level, closest), dress circle (elevated front balcony), upper circle (steep, cheaper), gallery (highest, cheapest), boxes (sides, intimate), pit (very front, angled up).
Discounts: TKTS Leicester Square up to 50% same-day (Mon–Sat 10am–6pm, Sun 11am–4:30pm), day seats at box office 10am £10–25, student standby 45 min before curtain with ID, TodayTix app, group 8+ direct to box office.
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
    flex: 1, padding: "7px 4px", fontSize: 12, fontWeight: source === id ? 500 : 400,
    background: source === id ? "var(--color-background-info)" : "var(--color-background-primary)",
    color: source === id ? "var(--color-text-info)" : "var(--color-text-secondary)",
    border: "none", borderLeft: id !== "all" ? "0.5px solid var(--color-border-tertiary)" : "none",
    borderRadius: 0, cursor: "pointer",
  });

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.25rem 0", maxWidth: 680 }}>
      <h2 className="sr-only">London Theatre Ticket Finder — live search, dynamic sightlines, no API key needed</h2>

      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)" }}>🎭 London theatre finder</h2>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>Live web search · No API key · Seat type · Discounts · Sightlines from Reddit + venue knowledge</p>
      </div>

      {/* AI assistant */}
      <div style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Ask about seats, discounts or venues</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value={aiQ} onChange={e => setAiQ(e.target.value)} onKeyDown={e => e.key === "Enter" && askAI()} placeholder="e.g. Best cheap seats at the National Theatre? TKTS vs day seats?" style={{ flex: 1, fontSize: 13 }} />
          <button onClick={askAI} disabled={!aiQ.trim() || aiLoading} style={{ padding: "0 14px", fontSize: 13 }}>{aiLoading ? "…" : "Ask ↗"}</button>
        </div>
        {aiAnswer && <div style={{ marginTop: 10, fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.7, whiteSpace: "pre-wrap", borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 10 }}>{aiAnswer}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {["Stalls vs upper circle?", "TKTS tips", "Student discounts tonight", "Best family shows under £40"].map(q => (
            <button key={q} onClick={() => setAiQ(q)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20 }}>{q}</button>
          ))}
        </div>
      </div>

      {/* Search panel */}
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
        <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Search &amp; filter</p>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Source</label>
          <div style={{ display: "flex", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>
            {SOURCES.map(s => <button key={s.id} onClick={() => setSource(s.id)} style={tabStyle(s.id)}>{s.label}</button>)}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Show or keyword</label>
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key === "Enter" && searchShows()} placeholder="e.g. Hamilton, Chekhov, immersive, ballet…" style={{ width: "100%", fontSize: 13, boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", fontSize: 13 }}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Seat type</label>
            <select value={seatType} onChange={e => setSeatType(e.target.value)} style={{ width: "100%", fontSize: 13 }}>{SEAT_TYPES.map(s => <option key={s}>{s}</option>)}</select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>From date</label>
            <input type="date" value={dateFrom} min={today} onChange={e => setDateFrom(e.target.value)} style={{ width: "100%", fontSize: 13, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>To date</label>
            <input type="date" value={dateTo} min={dateFrom || today} onChange={e => setDateTo(e.target.value)} style={{ width: "100%", fontSize: 13, boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
            Price range (£){priceMin || priceMax ? ` — £${priceMin || "0"} to £${priceMax || "any"}` : ""}
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="Min" min={0} style={{ flex: 1, fontSize: 13 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>to</span>
            <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Max" min={0} style={{ flex: 1, fontSize: 13 }} />
            {(priceMin || priceMax) && <button onClick={() => { setPriceMin(""); setPriceMax(""); }} style={{ fontSize: 12, padding: "5px 10px" }}>✕</button>}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Sort by</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: "100%", fontSize: 13 }}>{SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}</select>
        </div>

        <button onClick={searchShows} disabled={loading} style={{ width: "100%", padding: "10px 0", fontSize: 14, fontWeight: 500 }}>
          {loading ? (loadingMsg || "Searching…") : "Search shows ↗"}
        </button>
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
            Fetching shows + Reddit sightline reviews — this takes 10–20 seconds
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
            {shows.map((show, i) => <ShowCard key={i} show={show} />)}
          </div>
        </>
      )}

      {!loading && searched && shows.length === 0 && !error && (
        <p style={{ textAlign: "center", padding: "2.5rem 0", color: "var(--color-text-secondary)", fontSize: 14 }}>
          No shows found. Try broader search terms or a different source.
        </p>
      )}

      {/* Footer */}
      <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", flexWrap: "wrap", gap: 12 }}>
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
    </div>
  );
}
