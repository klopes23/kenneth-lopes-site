/* global React, ReactDOM, Recharts */
const { useState, useEffect, useRef, useMemo } = React;
const {
  LineChart, BarChart, AreaChart, ComposedChart, ScatterChart,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceArea, ReferenceLine, Area, Bar, Line, Scatter,
  ResponsiveContainer,
} = Recharts;

/* ============================================================
   DATA
   ============================================================ */
const DEPT_COLORS = {
  Engineering:        "#58a6ff",
  Manufacturing:      "#3fb950",
  Product:            "#39d0d0",
  Operations:         "#f0a843",
  "People & Culture": "#bc8cff",
  Marketing:          "#ff7b72",
  Sales:              "#ffa657",
  Other:              "#4a5568",
};

const KPIS = {
  totalUsers: 41,
  totalDepartments: 13,
  totalQuestions: 435,
  totalSessions: 73,
  answerRate: 100,
  preAdoptionPeak: 8,
  adoptionPeak: 12,
  newFromAdoption: 23,
  weeks10Plus: 2,
  totalWeeks: 24,
};

const WEEKLY = [
  { wk: 1,  date: "Sep 01", users: 1,  q: 19, sessions: 1,  newU: 1, ret: 0, cum: 1,  adopt: false },
  { wk: 2,  date: "Sep 08", users: 8,  q: 52, sessions: 10, newU: 8, ret: 0, cum: 9,  adopt: false },
  { wk: 3,  date: "Sep 15", users: 4,  q: 42, sessions: 4,  newU: 3, ret: 0, cum: 12, adopt: false },
  { wk: 4,  date: "Sep 22", users: 5,  q: 44, sessions: 6,  newU: 1, ret: 2, cum: 13, adopt: false },
  { wk: 5,  date: "Sep 29", users: 1,  q: 10, sessions: 1,  newU: 0, ret: 1, cum: 13, adopt: false },
  { wk: 6,  date: "Oct 06", users: 2,  q: 2,  sessions: 1,  newU: 0, ret: 1, cum: 13, adopt: false },
  { wk: 7,  date: "Oct 13", users: 3,  q: 13, sessions: 1,  newU: 0, ret: 1, cum: 13, adopt: false },
  { wk: 8,  date: "Oct 20", users: 1,  q: 1,  sessions: 0,  newU: 0, ret: 0, cum: 13, adopt: false },
  { wk: 9,  date: "Oct 27", users: 1,  q: 1,  sessions: 0,  newU: 0, ret: 0, cum: 13, adopt: false },
  { wk: 11, date: "Nov 10", users: 1,  q: 12, sessions: 2,  newU: 0, ret: 1, cum: 13, adopt: false },
  { wk: 12, date: "Nov 17", users: 1,  q: 1,  sessions: 0,  newU: 0, ret: 0, cum: 13, adopt: false },
  { wk: 14, date: "Dec 01", users: 2,  q: 20, sessions: 1,  newU: 0, ret: 1, cum: 13, adopt: false },
  { wk: 15, date: "Dec 08", users: 3,  q: 13, sessions: 3,  newU: 3, ret: 0, cum: 16, adopt: false },
  { wk: 16, date: "Dec 15", users: 4,  q: 12, sessions: 3,  newU: 1, ret: 1, cum: 17, adopt: false },
  { wk: 17, date: "Dec 22", users: 1,  q: 1,  sessions: 1,  newU: 1, ret: 0, cum: 18, adopt: false },
  { wk: 18, date: "Dec 29", users: 3,  q: 3,  sessions: 2,  newU: 0, ret: 2, cum: 18, adopt: false },
  { wk: 19, date: "Jan 05", users: 3,  q: 8,  sessions: 3,  newU: 1, ret: 1, cum: 19, adopt: true  },
  { wk: 20, date: "Jan 12", users: 5,  q: 17, sessions: 3,  newU: 1, ret: 2, cum: 20, adopt: true  },
  { wk: 21, date: "Jan 19", users: 12, q: 48, sessions: 18, newU: 7, ret: 1, cum: 27, adopt: true  },
  { wk: 22, date: "Jan 26", users: 11, q: 39, sessions: 16, newU: 5, ret: 2, cum: 32, adopt: true  },
  { wk: 23, date: "Feb 02", users: 7,  q: 24, sessions: 8,  newU: 2, ret: 2, cum: 34, adopt: true  },
  { wk: 24, date: "Feb 09", users: 7,  q: 18, sessions: 5,  newU: 1, ret: 2, cum: 35, adopt: true  },
  { wk: 25, date: "Feb 16", users: 12, q: 33, sessions: 9,  newU: 6, ret: 2, cum: 41, adopt: true  },
  { wk: 26, date: "Feb 23", users: 3,  q: 3,  sessions: 1,  newU: 0, ret: 1, cum: 41, adopt: true  },
];

const DEPARTMENTS = [
  { name: "Engineering",        users: 16, q: 213, sessions: 216, avg: 13.3, pct: 49.0 },
  { name: "Manufacturing",      users: 6,  q: 70,  sessions: 70,  avg: 11.7, pct: 16.1 },
  { name: "Product",            users: 2,  q: 52,  sessions: 41,  avg: 26.0, pct: 12.0 },
  { name: "Operations",         users: 3,  q: 34,  sessions: 34,  avg: 11.3, pct: 7.8  },
  { name: "People & Culture",   users: 3,  q: 23,  sessions: 23,  avg: 7.7,  pct: 5.3  },
  { name: "Marketing",          users: 2,  q: 12,  sessions: 14,  avg: 6.0,  pct: 2.8  },
  { name: "Sales",              users: 1,  q: 12,  sessions: 5,   avg: 12.0, pct: 2.8  },
  { name: "Other",              users: 7,  q: 19,  sessions: 22,  avg: 2.7,  pct: 4.4  },
];

const ADOPT_DEPT_WEEKS = [
  { date: "Jan 05", Engineering: 1, Manufacturing: 1, Operations: 0, "People & Culture": 0, Product: 0, Other: 1 },
  { date: "Jan 12", Engineering: 1, Manufacturing: 1, Operations: 0, "People & Culture": 0, Product: 0, Other: 3 },
  { date: "Jan 19", Engineering: 4, Manufacturing: 0, Operations: 1, "People & Culture": 0, Product: 0, Other: 7 },
  { date: "Jan 26", Engineering: 2, Manufacturing: 1, Operations: 1, "People & Culture": 0, Product: 1, Other: 6 },
  { date: "Feb 02", Engineering: 2, Manufacturing: 2, Operations: 0, "People & Culture": 0, Product: 0, Other: 3 },
  { date: "Feb 09", Engineering: 2, Manufacturing: 0, Operations: 0, "People & Culture": 1, Product: 0, Other: 4 },
  { date: "Feb 16", Engineering: 8, Manufacturing: 0, Operations: 0, "People & Culture": 0, Product: 0, Other: 4 },
  { date: "Feb 23", Engineering: 0, Manufacturing: 1, Operations: 0, "People & Culture": 0, Product: 0, Other: 2 },
];

// Each user: name, dept, q, sessions, weeksActive, firstWk, lastWk, badges
const USERS = [
  ["Eric B.","Engineering",117,36,14,3,25,["Power User","Most Loyal","Pioneer"]],
  ["Kenneth L.","Product",48,3,18,2,25,["Power User","Most Loyal","Pioneer"]],
  ["Digna N.","Engineering",42,3,4,3,24,["Power User","Pioneer"]],
  ["Elisa P.","Manufacturing",23,1,3,2,22,["Pioneer"]],
  ["Genaro F.","Manufacturing",20,2,4,22,26,[]],
  ["Elsa A.","People & Culture",19,1,1,1,1,["Pioneer"]],
  ["Keith O.","Operations",19,4,5,2,25,["Pioneer"]],
  ["Lucky Jay B.","Manufacturing",17,1,4,20,25,[]],
  ["Jay S.","Operations",14,1,1,2,2,["Pioneer"]],
  ["Husein N.","Engineering",12,2,2,21,25,[]],
  ["Rafael T.","Sales",12,1,4,20,24,[]],
  ["Hieu N.","Engineering",11,1,3,15,26,[]],
  ["Manuel R.","Engineering",10,1,2,21,22,[]],
  ["Ally N.","Marketing",8,8,1,21,21,[]],
  ["Malik A.","Management",7,2,2,2,20,["Pioneer"]],
  ["Jose G.","Engineering",6,1,2,21,22,[]],
  ["Amber F.","Marketing",4,2,2,16,21,[]],
  ["Arthur L.","Manufacturing",4,3,1,2,2,["Pioneer"]],
  ["Chris P.","Product",4,1,1,22,22,[]],
  ["Ozer F.","Manufacturing",4,2,3,23,26,[]],
  ["Brian K.","Engineering",3,1,2,15,16,[]],
  ["Ion B.","Purchasing",3,1,2,2,21,["Pioneer"]],
  ["Saleem S.","Solutions",3,1,1,21,21,[]],
  ["Aylah C.","Product Management",2,2,1,21,21,[]],
  ["Anil P.","Engineering",2,1,1,15,15,[]],
  ["Armen T.","Engineering",2,2,1,22,22,[]],
  ["Catrina B.","People & Culture",2,1,1,24,24,[]],
  ["Claudia F.","Accounting",2,1,1,3,3,["Pioneer"]],
  ["Edson L.","Manufacturing",2,1,1,19,19,[]],
  ["M. S.","Engineering",2,1,1,25,25,[]],
  ["Nancy M.","People & Culture",2,1,1,4,4,["Pioneer"]],
  ["B. S.","Engineering",1,1,1,25,25,[]],
  ["Jose R.","Operations",1,1,1,21,21,[]],
  ["Nestor O.","Solutions",1,1,1,2,2,["Pioneer"]],
  ["N. V.","Other",1,1,1,22,22,[]],
  ["R. A.","Engineering",1,1,1,25,25,[]],
  ["R. K.","Engineering",1,1,1,25,25,[]],
  ["R. Kh.","Engineering",1,1,1,25,25,[]],
  ["Steve H.","Engineering",1,1,1,23,23,[]],
  ["Siddharth S.","Engineering",1,1,1,25,25,[]],
  ["Tim M.","IT",1,1,1,17,17,[]],
].map(([name,dept,q,sessions,weeksActive,firstWk,lastWk,badges])=>({
  name, dept, q, sessions, weeksActive, firstWk, lastWk, badges,
  color: DEPT_COLORS[dept] || DEPT_COLORS.Other,
}));

/* ============================================================
   HELPERS
   ============================================================ */
const PRE = WEEKLY.filter(w => !w.adopt);
const ADOPT = WEEKLY.filter(w => w.adopt);
const sum = (arr, k) => arr.reduce((a,b) => a + b[k], 0);
const avg = (arr, k) => sum(arr,k) / arr.length;

const PRE_STATS = {
  weeks: PRE.length,
  totalUsers: sum(PRE,"users"),
  totalQ: sum(PRE,"q"),
  totalSessions: sum(PRE,"sessions"),
  avgUsers: avg(PRE,"users"),
  avgQ: avg(PRE,"q"),
  peakUsers: Math.max(...PRE.map(w=>w.users)),
};
const ADOPT_STATS = {
  weeks: ADOPT.length,
  totalUsers: sum(ADOPT,"users"),
  totalQ: sum(ADOPT,"q"),
  totalSessions: sum(ADOPT,"sessions"),
  avgUsers: avg(ADOPT,"users"),
  avgQ: avg(ADOPT,"q"),
  peakUsers: Math.max(...ADOPT.map(w=>w.users)),
};

// Funnel stages
const POWER = USERS.filter(u => u.q >= 10).length;
const REPEAT = USERS.filter(u => u.weeksActive >= 2).length;
const ACTIVE = USERS.filter(u => u.q >= 2).length;
const FUNNEL = [
  { stage: "Total Users",   value: 41,     color: "#58a6ff", desc: "all signed in" },
  { stage: "Active",        value: ACTIVE, color: "#39d0d0", desc: "≥ 2 questions" },
  { stage: "Repeat",        value: REPEAT, color: "#bc8cff", desc: "≥ 2 weeks active" },
  { stage: "Power Users",   value: POWER,  color: "#f0a843", desc: "≥ 10 questions" },
];

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */
function useCountUp(target, duration = 1400, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return decimals === 0 ? Math.round(val) : Number(val.toFixed(decimals));
}

function KpiCard({ label, value, suffix = "", decimals = 0, accent = "#58a6ff", sub, delay = 0 }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setShown(true), delay); return ()=>clearTimeout(t); }, [delay]);
  const v = useCountUp(shown ? value : 0, 1400, decimals);
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#0d1218] p-5 transition-all hover:border-white/10">
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-medium">{label}</div>
      <div className="mt-3 flex items-baseline gap-1">
        <div className="text-4xl font-semibold tabular-nums tracking-tight text-white" style={{ fontFeatureSettings: "'tnum'" }}>
          {v.toLocaleString()}
        </div>
        {suffix && <div className="text-xl font-medium text-slate-400">{suffix}</div>}
      </div>
      {sub && <div className="mt-1.5 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

/* ============================================================
   TOOLTIP
   ============================================================ */
function DarkTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0a0e13]/95 px-3 py-2 backdrop-blur shadow-2xl">
      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">{label}</div>
      <div className="space-y-1">
        {payload.map((p,i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-sm" style={{ background: p.color || p.fill }} />
            <span className="text-slate-400">{p.name}</span>
            <span className="ml-auto text-white font-medium tabular-nums">{p.value}{suffix}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SECTIONS
   ============================================================ */
function HeroKPIs() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      <KpiCard label="Total Users"      value={41}  accent="#58a6ff" sub="13 departments"     delay={0} />
      <KpiCard label="Questions Asked"  value={435} accent="#39d0d0" sub="across 24 weeks"    delay={80} />
      <KpiCard label="Sessions"         value={73}  accent="#bc8cff" sub="conversation threads" delay={160} />
      <KpiCard label="Answer Rate"      value={100} suffix="%" accent="#3fb950" sub="every question answered" delay={240} />
      <KpiCard label="Response CSAT"    value={84}  suffix="%" accent="#3fb950" sub="liked the RAG response" delay={320} />
      <KpiCard label="Adoption Peak"    value={12}  accent="#f0a843" sub="weekly users · 50% lift" delay={400} />
      <KpiCard label="New Users (8wk)"  value={23}  accent="#ff7b72" sub="56% of total roster" delay={480} />
    </div>
  );
}

function WeeklyTimeSeries() {
  const wauLift = ((ADOPT_STATS.avgUsers - PRE_STATS.avgUsers) / PRE_STATS.avgUsers) * 100;
  return (
    <Panel title="Weekly Activity" subtitle="Users and questions across 24 weeks · adoption program window shaded">
      <div className="mb-4 rounded-lg border p-4 flex items-center gap-5 flex-wrap" style={{
        borderColor: "rgba(63,185,80,0.28)",
        background: "linear-gradient(90deg, rgba(63,185,80,0.10), rgba(63,185,80,0.02) 60%, transparent)",
      }}>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums" style={{ color: "#3fb950" }}>
            +{wauLift.toFixed(0)}%
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Weekly active users</span>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex items-center gap-4 text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Pre-adoption</div>
            <div className="text-slate-300 tabular-nums mt-0.5">{PRE_STATS.avgUsers.toFixed(1)} <span className="text-slate-500">users / wk</span></div>
          </div>
          <span className="text-slate-600">→</span>
          <div>
            <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "#f0a843" }}>Adoption program</div>
            <div className="tabular-nums mt-0.5" style={{ color: "#f0a843" }}>{ADOPT_STATS.avgUsers.toFixed(1)} <span className="text-slate-500">users / wk</span></div>
          </div>
        </div>
        <div className="ml-auto text-[11px] text-slate-500 max-w-[260px]">
          Average weekly active users nearly tripled during the 8-week adoption push.
        </div>
      </div>
      <div className="h-[340px]">
        <ResponsiveContainer>
          <ComposedChart data={WEEKLY} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="qFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#39d0d0" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#39d0d0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="adoptFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#f0a843" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#f0a843" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1a2129" vertical={false} />
            <XAxis dataKey="date" stroke="#4a5568" tick={{ fill: "#64748b", fontSize: 11 }} interval={1} tickLine={false} axisLine={{ stroke: "#1a2129" }} />
            <YAxis yAxisId="left"  stroke="#4a5568" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#4a5568" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
            <ReferenceArea yAxisId="left" x1="Jan 05" x2="Feb 23" fill="url(#adoptFill)" stroke="#f0a843" strokeOpacity={0.4} strokeDasharray="3 4" />
            <Tooltip content={<DarkTooltip />} cursor={{ stroke: "#1f2937" }} />
            <Area  yAxisId="right" type="monotone" dataKey="q"     name="Questions" stroke="#39d0d0" strokeWidth={1.5} fill="url(#qFill)" />
            <Bar   yAxisId="left"  dataKey="users" name="Users"   barSize={14} radius={[2,2,0,0]}>
              {WEEKLY.map((w,i) => <Cell key={i} fill={w.adopt ? "#f0a843" : "#3b82f6"} fillOpacity={w.adopt ? 0.95 : 0.55} />)}
            </Bar>
            <Line  yAxisId="left"  type="monotone" dataKey="cum"   name="Cumulative" stroke="#bc8cff" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Legend2 items={[
        { color: "#3b82f6", label: "Weekly users (pre)" },
        { color: "#f0a843", label: "Weekly users (adoption)" },
        { color: "#39d0d0", label: "Questions" },
        { color: "#bc8cff", label: "Cumulative users" },
      ]} />
    </Panel>
  );
}

function BeforeAfter() {
  const lift = (a,b) => ((b-a)/a*100);
  const rows = [
    { k: "Avg weekly users",     a: PRE_STATS.avgUsers,     b: ADOPT_STATS.avgUsers,     d: 1 },
    { k: "Avg weekly questions", a: PRE_STATS.avgQ,         b: ADOPT_STATS.avgQ,         d: 1 },
    { k: "Peak users",           a: PRE_STATS.peakUsers,    b: ADOPT_STATS.peakUsers,    d: 0 },
    { k: "Total sessions",       a: PRE_STATS.totalSessions, b: ADOPT_STATS.totalSessions, d: 0 },
  ];
  return (
    <Panel title="Before / After" subtitle="Pre-adoption (16 weeks) vs Adoption Program (8 weeks)" className="h-full flex flex-col">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg border border-white/5 bg-[#0a0e13] p-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Pre-adoption</div>
          <div className="mt-1 text-xs text-slate-400">Sep 1 – Dec 29 · 16 wks</div>
          <div className="mt-3 text-2xl font-semibold text-slate-300 tabular-nums">{PRE_STATS.totalQ}</div>
          <div className="text-xs text-slate-500">questions</div>
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: "rgba(240,168,67,0.25)", background: "linear-gradient(135deg, rgba(240,168,67,0.08), rgba(240,168,67,0.02))" }}>
          <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#f0a843" }}>Adoption program</div>
          <div className="mt-1 text-xs text-slate-400">Jan 5 – Feb 23 · 8 wks</div>
          <div className="mt-3 text-2xl font-semibold tabular-nums" style={{ color: "#f0a843" }}>{ADOPT_STATS.totalQ}</div>
          <div className="text-xs text-slate-500">questions</div>
        </div>
      </div>
      <div className="space-y-2.5 flex-1 flex flex-col justify-around">
        {rows.map((r,i) => {
          const pct = lift(r.a, r.b);
          const max = Math.max(r.a, r.b);
          return (
            <div key={i} className="grid grid-cols-[1fr_auto] gap-x-3 text-xs">
              <div className="text-slate-400">{r.k}</div>
              <div className="text-emerald-400 font-medium tabular-nums">+{pct.toFixed(0)}%</div>
              <div className="col-span-2 grid grid-cols-2 gap-2 mt-1">
                <Bar2 value={r.a} max={max} color="#334155" label={r.a.toFixed(r.d)} />
                <Bar2 value={r.b} max={max} color="#f0a843" label={r.b.toFixed(r.d)} />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Bar2({ value, max, color, label }) {
  const w = max ? (value / max) * 100 : 0;
  return (
    <div className="relative h-6 rounded bg-white/[0.03] overflow-hidden">
      <div className="absolute inset-y-0 left-0 transition-all duration-1000" style={{ width: `${w}%`, background: color, opacity: 0.85 }} />
      <div className="absolute inset-0 flex items-center px-2 text-[11px] text-white tabular-nums font-medium">{label}</div>
    </div>
  );
}

function DepartmentBubbles() {
  const data = DEPARTMENTS.map(d => ({ ...d, color: DEPT_COLORS[d.name] || DEPT_COLORS.Other }));
  return (
    <Panel title="Departments" subtitle="Users × Questions · bubble = avg questions/user" className="h-full flex flex-col">
      <div className="flex-1 min-h-[340px]">
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#1a2129" />
            <XAxis type="number" dataKey="users" name="Users" stroke="#4a5568" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#1a2129" }} domain={[0, 18]} label={{ value: "Users", position: "insideBottom", offset: -2, fill: "#475569", fontSize: 11 }} />
            <YAxis type="number" dataKey="q" name="Questions" stroke="#4a5568" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 240]} label={{ value: "Questions", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 11 }} />
            <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "#1f2937" }} content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-lg border border-white/10 bg-[#0a0e13]/95 px-3 py-2 backdrop-blur shadow-2xl text-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
                    <span className="text-white font-medium">{d.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-slate-400">
                    <span>Users</span><span className="text-white tabular-nums text-right">{d.users}</span>
                    <span>Questions</span><span className="text-white tabular-nums text-right">{d.q}</span>
                    <span>Avg Q/user</span><span className="text-white tabular-nums text-right">{d.avg}</span>
                    <span>Share</span><span className="text-white tabular-nums text-right">{d.pct}%</span>
                  </div>
                </div>
              );
            }} />
            <Scatter data={data} shape={(props) => {
              const { cx, cy, payload } = props;
              const r = 6 + Math.sqrt(payload.avg) * 3.6;
              return (
                <g>
                  <circle cx={cx} cy={cy} r={r} fill={payload.color} fillOpacity={0.18} stroke={payload.color} strokeWidth={1.5} />
                  <circle cx={cx} cy={cy} r={3} fill={payload.color} />
                </g>
              );
            }}>
              {data.map((d,i) => <Cell key={i} fill={d.color} />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
        {data.map((d,i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
            <span>{d.name}</span>
            <span className="text-slate-600 tabular-nums">{d.q}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Funnel() {
  const max = FUNNEL[0].value;
  return (
    <Panel title="User Funnel" subtitle="From signed-in to power users">
      <div className="space-y-2.5 mt-2">
        {FUNNEL.map((s, i) => {
          const w = (s.value / max) * 100;
          const dropPct = i > 0 ? Math.round((s.value / FUNNEL[i-1].value) * 100) : 100;
          return (
            <div key={i} className="group">
              <div className="flex items-baseline justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-300 font-medium">{s.stage}</span>
                  <span className="text-slate-500">· {s.desc}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-white text-base font-semibold tabular-nums">{s.value}</span>
                  <span className="text-slate-500 tabular-nums">{dropPct}%</span>
                </div>
              </div>
              <div className="h-9 rounded bg-white/[0.03] overflow-hidden relative">
                <div className="h-full transition-all duration-700 origin-left" style={{
                  width: `${w}%`,
                  background: `linear-gradient(90deg, ${s.color}cc, ${s.color}55)`,
                  borderRight: `2px solid ${s.color}`,
                }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center pt-4 border-t border-white/5">
        <Stat label="Signed → Power" value={`${Math.round(POWER/41*100)}%`} />
        <Stat label="Power users" value={POWER} />
        <Stat label="Top user share" value={`${Math.round(117/435*100)}%`} sub="Eric B." />
      </div>
    </Panel>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="text-xl font-semibold text-white tabular-nums mt-0.5">{value}</div>
      {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
    </div>
  );
}

/* ============================================================
   HEATMAP — 41 users x 24 weeks
   ============================================================ */
function Heatmap() {
  // Approximate per-user-per-week activity. We don't have exact week counts,
  // so we distribute each user's questions across their active span:
  // - first week and last week are guaranteed active
  // - if weeksActive > 2, sprinkle remaining active weeks evenly between
  const grid = useMemo(() => {
    const weekIdx = WEEKLY.map(w => w.wk);
    return USERS.map(u => {
      const active = new Set();
      active.add(u.firstWk);
      active.add(u.lastWk);
      if (u.weeksActive > 2) {
        const span = u.lastWk - u.firstWk;
        const step = span / (u.weeksActive - 1);
        for (let i = 1; i < u.weeksActive - 1; i++) {
          active.add(Math.round(u.firstWk + i * step));
        }
      }
      // questions per active week ≈ uniform
      const qPer = u.q / u.weeksActive;
      const cells = weekIdx.map(wk => {
        if (active.has(wk)) {
          const isAdopt = WEEKLY.find(w=>w.wk===wk)?.adopt;
          return { wk, q: qPer, adopt: isAdopt };
        }
        return { wk, q: 0, adopt: false };
      });
      return { ...u, cells };
    }).sort((a,b) => b.q - a.q);
  }, []);

  // shade scale
  const maxQ = Math.max(...grid.flatMap(g => g.cells.map(c => c.q)));
  const shade = (q) => {
    if (q === 0) return 0;
    return 0.18 + 0.82 * Math.pow(q / maxQ, 0.4);
  };

  return (
    <Panel title="User Activity Heatmap" subtitle={`41 users × 24 weeks · sorted by total questions · color intensity = activity`}>
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="min-w-[720px]">
          {/* week headers */}
          <div className="grid items-end gap-[2px] mb-1.5" style={{ gridTemplateColumns: `140px repeat(${WEEKLY.length}, minmax(0,1fr)) 60px` }}>
            <div />
            {WEEKLY.map((w,i) => (
              <div key={i} className="text-[8px] text-slate-600 text-center tabular-nums" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", height: 36, lineHeight: 1, fontFeatureSettings: "'tnum'" }}>
                {w.date}
              </div>
            ))}
            <div className="text-[9px] text-slate-600 text-right pr-1">Q</div>
          </div>
          {/* rows */}
          <div className="space-y-[2px]">
            {grid.map((u, ri) => (
              <div key={ri} className="grid items-center gap-[2px]" style={{ gridTemplateColumns: `140px repeat(${WEEKLY.length}, minmax(0,1fr)) 60px` }}>
                <div className="flex items-center gap-1.5 pr-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ background: u.color }} />
                  <span className="text-[10px] text-slate-300 truncate" title={u.name}>{u.name}</span>
                </div>
                {u.cells.map((c, ci) => {
                  const op = shade(c.q);
                  const inAdopt = c.adopt;
                  return (
                    <div key={ci} className="h-3.5 rounded-[2px]" style={{
                      background: op === 0
                        ? (inAdopt ? "rgba(240,168,67,0.04)" : "rgba(255,255,255,0.025)")
                        : `rgba(88,166,255,${op})`,
                      boxShadow: op > 0 && inAdopt ? "inset 0 0 0 1px rgba(240,168,67,0.55)" : "none",
                    }} title={`${u.name} · ${WEEKLY[ci].date} · ${c.q ? c.q.toFixed(1) : 0} q`} />
                  );
                })}
                <div className="text-[10px] text-slate-400 tabular-nums text-right pr-1">{u.q}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500">
        <div className="flex items-center gap-2">
          <span>less</span>
          {[0.1,0.3,0.5,0.7,1].map((o,i)=>(
            <span key={i} className="w-3.5 h-3.5 rounded-[2px]" style={{ background: `rgba(88,166,255,${o})` }} />
          ))}
          <span>more</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-[2px]" style={{ background: "rgba(88,166,255,0.6)", boxShadow: "inset 0 0 0 1px rgba(240,168,67,0.55)" }} />
          <span>adoption-program week</span>
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================
   ADOPTION DEPT BREAKDOWN (extra insight)
   ============================================================ */
function AdoptionDeptStack() {
  const keys = ["Engineering","Manufacturing","Operations","People & Culture","Product","Other"];
  return (
    <Panel title="Adoption Program · Departments by Week" subtitle="8-week active-user composition" className="h-full flex flex-col">
      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer>
          <BarChart data={ADOPT_DEPT_WEEKS} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#1a2129" vertical={false} />
            <XAxis dataKey="date" stroke="#4a5568" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#1a2129" }} />
            <YAxis stroke="#4a5568" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
            {keys.map((k,i) => (
              <Bar key={k} dataKey={k} stackId="a" fill={DEPT_COLORS[k]} radius={i === keys.length - 1 ? [3,3,0,0] : 0} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Legend2 items={keys.map(k => ({ color: DEPT_COLORS[k], label: k }))} />
    </Panel>
  );
}

/* ============================================================
   PRIMITIVES
   ============================================================ */
function Panel({ title, subtitle, children, className = "" }) {
  return (
    <div className={`rounded-xl border border-white/5 bg-[#0d1218] p-5 ${className}`}>
      <div className="flex items-baseline justify-between mb-4 gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Legend2({ items }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
      {items.map((it,i)=>(
        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: it.color }} />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   ROOT
   ============================================================ */
function Dashboard() {
  return (
    <div className="min-h-screen bg-[#080c10] text-slate-200" style={{
      backgroundImage: "radial-gradient(circle at 15% -10%, rgba(88,166,255,0.06), transparent 50%), radial-gradient(circle at 95% 0%, rgba(240,168,67,0.05), transparent 45%)",
      fontFamily: "'Inter', -apple-system, 'Segoe UI', sans-serif",
    }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        {/* HEADER */}
        <header className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Canoga Perkins · Internal AI</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white">
              Corporate Memory Copilot
            </h1>
            <div className="text-sm text-slate-400 mt-1.5">
              24-week usage report · <span className="text-slate-300">Sep 2025 — Feb 2026</span>
              <span className="mx-2 text-slate-700">|</span>
              <span style={{ color: "#f0a843" }}>● 8-week adoption program</span>
              <span className="text-slate-500"> Jan 5 – Feb 23, 2026</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Report generated</div>
            <div className="text-sm text-slate-300 tabular-nums mt-1">May 7, 2026</div>
          </div>
        </header>

        {/* KPIs */}
        <section className="mb-6">
          <HeroKPIs />
        </section>

        {/* ROW 1 — full width time series */}
        <section className="mb-6">
          <WeeklyTimeSeries />
        </section>

        {/* ROW 2 — before/after + bubble */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 items-stretch">
          <div className="lg:col-span-2 h-full"><BeforeAfter /></div>
          <div className="lg:col-span-3 h-full"><DepartmentBubbles /></div>
        </section>

        {/* ROW 3 — funnel + adoption stack */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 items-stretch">
          <div className="lg:col-span-2 h-full"><Funnel /></div>
          <div className="lg:col-span-3 h-full"><AdoptionDeptStack /></div>
        </section>

        {/* ROW 4 — heatmap */}
        <section className="mb-10">
          <Heatmap />
        </section>

        <footer className="border-t border-white/5 pt-5 text-xs text-slate-600 flex justify-between flex-wrap gap-2">
          <div>41 users · 13 departments · 435 questions · 73 sessions · 100% answer rate</div>
          <div>Data through Feb 23, 2026</div>
        </footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard />);
