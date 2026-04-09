import { useState, useEffect, useRef } from “react”;

const SYSTEM_PROMPT = `You are ARIA, an elite AI life coach. You are warm, direct, insightful, and motivating. You help users with productivity, fitness, mindset, habits, and goal achievement. Keep responses concise (2-4 sentences), actionable, and personal. Feel free to ask follow-up questions to understand the user better. Use a tone that feels like a brilliant, caring friend who happens to be an expert.`;

const plans = [
{ id: “free”, name: “Starter”, price: 0, sessions: 3, label: “Free forever” },
{ id: “pro”, name: “Pro”, price: 9.99, sessions: “Unlimited”, label: “Most popular ⭐” },
{ id: “elite”, name: “Elite”, price: 24.99, sessions: “Unlimited + Priority”, label: “Best results” },
];

const goals = [“🏋️ Fitness”, “🧠 Mindset”, “💼 Career”, “💰 Finance”, “😴 Sleep”, “🎯 Habits”];

const suggestions = [
“I want to wake up earlier but keep failing”,
“Help me build a morning routine”,
“I feel overwhelmed with my to-do list”,
“How do I stay motivated?”,
];

export default function App() {
const [screen, setScreen] = useState(“landing”); // landing | onboard | coach | pricing
const [selectedGoals, setSelectedGoals] = useState([]);
const [name, setName] = useState(””);
const [messages, setMessages] = useState([]);
const [input, setInput] = useState(””);
const [loading, setLoading] = useState(false);
const [plan, setPlan] = useState(“free”);
const [sessionsLeft, setSessionsLeft] = useState(3);
const [activePlan, setActivePlan] = useState(“free”);
const chatEndRef = useRef(null);

useEffect(() => {
chatEndRef.current?.scrollIntoView({ behavior: “smooth” });
}, [messages]);

const toggleGoal = (g) => {
setSelectedGoals((prev) =>
prev.includes(g) ? prev.filter((x) => x !== g) : […prev, g]
);
};

const startCoaching = () => {
setMessages([
{
role: “assistant”,
text: `Hey ${name || "there"} 👋 I'm ARIA, your personal AI coach. You've chosen to focus on ${selectedGoals.join(", ") || "your goals"} — great choices. What's the first thing on your mind today?`,
},
]);
setScreen(“coach”);
};

const sendMessage = async (text) => {
const userText = text || input.trim();
if (!userText) return;

```
if (activePlan === "free" && sessionsLeft <= 0) {
  setScreen("pricing");
  return;
}

setInput("");
const newMessages = [...messages, { role: "user", text: userText }];
setMessages(newMessages);
setLoading(true);

try {
  const apiMessages = newMessages.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.text,
  }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    }),
  });

  const data = await res.json();
  const reply = data.content?.[0]?.text || "Let me think about that…";
  setMessages([...newMessages, { role: "assistant", text: reply }]);
  if (activePlan === "free") setSessionsLeft((s) => s - 1);
} catch {
  setMessages([...newMessages, { role: "assistant", text: "Something went wrong. Try again in a moment." }]);
}
setLoading(false);
```

};

const upgradePlan = (id) => {
setActivePlan(id);
setSessionsLeft(id === “free” ? 3 : 999);
setScreen(“coach”);
};

// ─── LANDING ───────────────────────────────────────────────────────────────
if (screen === “landing”) return (
<div style={styles.page}>
<div style={styles.grain} />
<div style={styles.blob1} /><div style={styles.blob2} />

```
  <nav style={styles.nav}>
    <span style={styles.logo}>ARIA</span>
    <button style={styles.navBtn} onClick={() => setScreen("pricing")}>Pricing</button>
  </nav>

  <div style={styles.hero}>
    <div style={styles.badge}>✦ AI-Powered Life Coaching</div>
    <h1 style={styles.h1}>Your unfair<br /><em style={styles.em}>advantage</em><br />starts here.</h1>
    <p style={styles.sub}>ARIA is the AI coach that listens, learns, and pushes you toward the life you actually want.</p>
    <button style={styles.ctaBtn} onClick={() => setScreen("onboard")}>Start for Free →</button>
    <p style={styles.hint}>No credit card. 3 free sessions daily.</p>
  </div>

  <div style={styles.statsRow}>
    {[["50K+", "Users coached"], ["4.9★", "App rating"], ["93%", "Hit their goals"]].map(([n, l]) => (
      <div key={n} style={styles.stat}>
        <span style={styles.statNum}>{n}</span>
        <span style={styles.statLbl}>{l}</span>
      </div>
    ))}
  </div>
</div>
```

);

// ─── ONBOARD ───────────────────────────────────────────────────────────────
if (screen === “onboard”) return (
<div style={styles.page}>
<div style={styles.grain} /><div style={styles.blob1} />
<div style={styles.card}>
<div style={styles.logo} style={{…styles.logo, marginBottom: 24}}>ARIA</div>
<h2 style={styles.cardTitle}>Let’s personalize your coaching</h2>
<label style={styles.label}>Your first name</label>
<input
style={styles.input}
placeholder=“e.g. Alex”
value={name}
onChange={(e) => setName(e.target.value)}
/>
<label style={styles.label}>What do you want to improve?</label>
<div style={styles.goalGrid}>
{goals.map((g) => (
<button
key={g}
style={{ …styles.goalChip, …(selectedGoals.includes(g) ? styles.goalChipActive : {}) }}
onClick={() => toggleGoal(g)}
>
{g}
</button>
))}
</div>
<button
style={{ …styles.ctaBtn, width: “100%”, marginTop: 28 }}
onClick={startCoaching}
>
Meet ARIA →
</button>
</div>
</div>
);

// ─── COACH ─────────────────────────────────────────────────────────────────
if (screen === “coach”) return (
<div style={styles.coachPage}>
<div style={styles.coachNav}>
<span style={styles.logo}>ARIA</span>
<div style={styles.sessionBadge}>
{activePlan === “free”
? `${sessionsLeft} session${sessionsLeft !== 1 ? "s" : ""} left`
: “∞ Pro”}
</div>
<button style={styles.upgradeBtn} onClick={() => setScreen(“pricing”)}>
{activePlan === “free” ? “Upgrade ✦” : “Pro ✦”}
</button>
</div>

```
  <div style={styles.chatArea}>
    {messages.map((m, i) => (
      <div key={i} style={m.role === "user" ? styles.userBubble : styles.aiBubble}>
        {m.role === "assistant" && <div style={styles.ariaAvatar}>A</div>}
        <div style={m.role === "user" ? styles.userText : styles.aiText}>{m.text}</div>
      </div>
    ))}
    {loading && (
      <div style={styles.aiBubble}>
        <div style={styles.ariaAvatar}>A</div>
        <div style={{ ...styles.aiText, ...styles.typing }}>
          <span style={styles.dot} /><span style={{ ...styles.dot, animationDelay: "0.2s" }} /><span style={{ ...styles.dot, animationDelay: "0.4s" }} />
        </div>
      </div>
    )}
    <div ref={chatEndRef} />
  </div>

  {messages.length === 1 && (
    <div style={styles.suggestions}>
      {suggestions.map((s) => (
        <button key={s} style={styles.suggBtn} onClick={() => sendMessage(s)}>{s}</button>
      ))}
    </div>
  )}

  <div style={styles.inputRow}>
    <input
      style={styles.chatInput}
      placeholder="Ask ARIA anything…"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    />
    <button style={styles.sendBtn} onClick={() => sendMessage()}>↑</button>
  </div>

  <style>{dotAnim}</style>
</div>
```

);

// ─── PRICING ───────────────────────────────────────────────────────────────
if (screen === “pricing”) return (
<div style={styles.page}>
<div style={styles.grain} /><div style={styles.blob1} /><div style={styles.blob2} />
<nav style={styles.nav}>
<span style={styles.logo}>ARIA</span>
<button style={styles.navBtn} onClick={() => setScreen(messages.length ? “coach” : “landing”)}>← Back</button>
</nav>
<div style={{ textAlign: “center”, marginBottom: 48 }}>
<h2 style={{ …styles.h1, fontSize: 42 }}>Simple pricing.<br />Real results.</h2>
</div>
<div style={styles.plansRow}>
{plans.map((p) => (
<div key={p.id} style={{ …styles.planCard, …(p.id === “pro” ? styles.planCardFeatured : {}) }}>
<div style={styles.planLabel}>{p.label}</div>
<h3 style={styles.planName}>{p.name}</h3>
<div style={styles.planPrice}>
{p.price === 0 ? “Free” : `$${p.price}`}
{p.price > 0 && <span style={styles.planPer}>/mo</span>}
</div>
<div style={styles.planSessions}>
{typeof p.sessions === “number” ? `${p.sessions} sessions/day` : p.sessions}
</div>
<button
style={{ …styles.ctaBtn, …(p.id !== “pro” ? styles.ctaBtnSecondary : {}), marginTop: 20 }}
onClick={() => upgradePlan(p.id)}
>
{activePlan === p.id ? “Current Plan ✓” : `Choose ${p.name}`}
</button>
</div>
))}
</div>
</div>
);
}

// ─── STYLES ────────────────────────────────────────────────────────────────
const styles = {
page: { minHeight: “100vh”, background: “#08080f”, color: “#f0ede8”, fontFamily: “‘Georgia’, serif”, padding: “0 20px”, position: “relative”, overflow: “hidden”, display: “flex”, flexDirection: “column”, alignItems: “center” },
grain: { position: “fixed”, inset: 0, backgroundImage: “url("data:image/svg+xml,%3Csvg viewBox=‘0 0 256 256’ xmlns=‘http://www.w3.org/2000/svg’%3E%3Cfilter id=‘noise’%3E%3CfeTurbulence type=‘fractalNoise’ baseFrequency=‘0.9’ numOctaves=‘4’ stitchTiles=‘stitch’/%3E%3C/filter%3E%3Crect width=‘100%25’ height=‘100%25’ filter=‘url(%23noise)’ opacity=‘0.04’/%3E%3C/svg%3E")”, zIndex: 0, pointerEvents: “none” },
blob1: { position: “fixed”, top: -200, right: -200, width: 600, height: 600, borderRadius: “50%”, background: “radial-gradient(circle, #c9a84c22 0%, transparent 70%)”, pointerEvents: “none” },
blob2: { position: “fixed”, bottom: -200, left: -200, width: 500, height: 500, borderRadius: “50%”, background: “radial-gradient(circle, #7c3aed18 0%, transparent 70%)”, pointerEvents: “none” },
nav: { width: “100%”, maxWidth: 900, display: “flex”, justifyContent: “space-between”, alignItems: “center”, padding: “28px 0”, zIndex: 10 },
logo: { fontFamily: “‘Georgia’, serif”, fontSize: 22, fontWeight: 700, letterSpacing: 6, color: “#c9a84c” },
navBtn: { background: “none”, border: “1px solid #c9a84c44”, color: “#c9a84c”, padding: “8px 18px”, borderRadius: 99, cursor: “pointer”, fontSize: 13 },
hero: { zIndex: 10, textAlign: “center”, marginTop: 60, maxWidth: 600 },
badge: { display: “inline-block”, background: “#c9a84c18”, border: “1px solid #c9a84c44”, color: “#c9a84c”, padding: “6px 16px”, borderRadius: 99, fontSize: 12, letterSpacing: 1, marginBottom: 28 },
h1: { fontSize: 62, fontWeight: 700, lineHeight: 1.1, margin: “0 0 20px”, color: “#f0ede8” },
em: { fontStyle: “italic”, color: “#c9a84c” },
sub: { fontSize: 17, color: “#9e9b94”, marginBottom: 36, lineHeight: 1.6 },
ctaBtn: { background: “#c9a84c”, color: “#08080f”, border: “none”, padding: “16px 36px”, borderRadius: 99, fontSize: 16, fontWeight: 700, cursor: “pointer”, letterSpacing: 0.5 },
ctaBtnSecondary: { background: “transparent”, color: “#c9a84c”, border: “1px solid #c9a84c” },
hint: { fontSize: 12, color: “#5a5753”, marginTop: 12 },
statsRow: { display: “flex”, gap: 60, marginTop: 80, zIndex: 10, paddingBottom: 60 },
stat: { textAlign: “center”, display: “flex”, flexDirection: “column”, gap: 4 },
statNum: { fontSize: 32, fontWeight: 700, color: “#c9a84c” },
statLbl: { fontSize: 13, color: “#6b6862” },
// onboard card
card: { zIndex: 10, background: “#11111a”, border: “1px solid #ffffff0f”, borderRadius: 20, padding: “40px 36px”, maxWidth: 440, width: “100%”, marginTop: 80 },
cardTitle: { fontSize: 22, fontWeight: 700, marginBottom: 28, color: “#f0ede8” },
label: { display: “block”, fontSize: 12, color: “#c9a84c”, letterSpacing: 1, marginBottom: 8, textTransform: “uppercase” },
input: { width: “100%”, background: “#1a1a28”, border: “1px solid #ffffff12”, borderRadius: 10, padding: “12px 16px”, color: “#f0ede8”, fontSize: 15, marginBottom: 24, boxSizing: “border-box”, outline: “none” },
goalGrid: { display: “flex”, flexWrap: “wrap”, gap: 10 },
goalChip: { background: “#1a1a28”, border: “1px solid #ffffff12”, color: “#9e9b94”, padding: “10px 16px”, borderRadius: 99, cursor: “pointer”, fontSize: 14 },
goalChipActive: { background: “#c9a84c22”, border: “1px solid #c9a84c”, color: “#c9a84c” },
// coach
coachPage: { display: “flex”, flexDirection: “column”, height: “100vh”, background: “#08080f”, fontFamily: “‘Georgia’, serif” },
coachNav: { display: “flex”, alignItems: “center”, justifyContent: “space-between”, padding: “16px 24px”, borderBottom: “1px solid #ffffff0a”, background: “#08080f” },
sessionBadge: { fontSize: 12, color: “#6b6862”, background: “#1a1a28”, padding: “4px 12px”, borderRadius: 99 },
upgradeBtn: { background: “#c9a84c”, color: “#08080f”, border: “none”, padding: “8px 18px”, borderRadius: 99, cursor: “pointer”, fontSize: 13, fontWeight: 700 },
chatArea: { flex: 1, overflowY: “auto”, padding: “24px 20px”, display: “flex”, flexDirection: “column”, gap: 16, maxWidth: 680, width: “100%”, margin: “0 auto” },
aiBubble: { display: “flex”, gap: 12, alignItems: “flex-start” },
userBubble: { display: “flex”, justifyContent: “flex-end” },
ariaAvatar: { width: 32, height: 32, borderRadius: “50%”, background: “#c9a84c”, color: “#08080f”, display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 13, fontWeight: 700, flexShrink: 0 },
aiText: { background: “#11111a”, border: “1px solid #ffffff0a”, borderRadius: “4px 16px 16px 16px”, padding: “12px 16px”, color: “#d4d0c8”, fontSize: 15, lineHeight: 1.6, maxWidth: 480 },
userText: { background: “#c9a84c”, color: “#08080f”, borderRadius: “16px 4px 16px 16px”, padding: “12px 16px”, fontSize: 15, lineHeight: 1.6, maxWidth: 380 },
typing: { display: “flex”, alignItems: “center”, gap: 5, padding: “16px” },
dot: { width: 8, height: 8, background: “#c9a84c”, borderRadius: “50%”, display: “inline-block”, animation: “bounce 1s infinite” },
suggestions: { display: “flex”, flexWrap: “wrap”, gap: 8, padding: “0 20px 16px”, maxWidth: 680, margin: “0 auto”, width: “100%” },
suggBtn: { background: “#1a1a28”, border: “1px solid #ffffff10”, color: “#9e9b94”, borderRadius: 99, padding: “8px 16px”, fontSize: 13, cursor: “pointer” },
inputRow: { display: “flex”, gap: 10, padding: “16px 20px”, borderTop: “1px solid #ffffff0a”, maxWidth: 680, width: “100%”, margin: “0 auto”, boxSizing: “border-box” },
chatInput: { flex: 1, background: “#11111a”, border: “1px solid #ffffff12”, borderRadius: 99, padding: “12px 20px”, color: “#f0ede8”, fontSize: 15, outline: “none” },
sendBtn: { background: “#c9a84c”, color: “#08080f”, border: “none”, width: 46, height: 46, borderRadius: “50%”, fontSize: 20, cursor: “pointer”, fontWeight: 700 },
// pricing
plansRow: { display: “flex”, gap: 20, flexWrap: “wrap”, justifyContent: “center”, zIndex: 10, paddingBottom: 80 },
planCard: { background: “#11111a”, border: “1px solid #ffffff0f”, borderRadius: 20, padding: “32px 28px”, width: 240, textAlign: “center” },
planCardFeatured: { border: “1px solid #c9a84c”, background: “#14120a” },
planLabel: { fontSize: 11, color: “#c9a84c”, letterSpacing: 1, marginBottom: 12, textTransform: “uppercase” },
planName: { fontSize: 22, fontWeight: 700, color: “#f0ede8”, margin: “0 0 8px” },
planPrice: { fontSize: 36, fontWeight: 700, color: “#c9a84c”, margin: “0 0 8px” },
planPer: { fontSize: 14, color: “#6b6862” },
planSessions: { fontSize: 13, color: “#6b6862” },
};

const dotAnim = `@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-6px); opacity: 1; } }`;
