import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Briefcase, BookOpen, TrendingUp, Target, Award, ArrowRight,
  Users, Star, MapPin, Building2, Send, Zap, Clock,
  AlertTriangle, Lightbulb, CheckCircle, FileText, Sparkles,
  ChevronRight, Eye, GraduationCap, Layers, ArrowUpRight,
  Activity, Flame, Radio, CircleDot, Shield, Crown, Code2,
  Rocket, BarChart3, ChevronDown, Heart, Compass, Cpu,
  Binary, Hexagon, PieChart, GitBranch, Terminal, Wifi
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import api from '../utils/api';

/* ━━━ Animated counter ━━━ */
function Counter({ to, loaded, duration = 1800 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!loaded || typeof to !== 'number' || to === 0) { setV(0); return; }
    let start, raf;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 4)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, loaded, duration]);
  return v;
}

/* ━━━ Reveal hook ━━━ */
function useReveal(threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  const obsRef = useRef(null);
  const doneRef = useRef(false);
  const ref = useCallback((el) => {
    if (obsRef.current) { obsRef.current.disconnect(); obsRef.current = null; }
    if (!el || doneRef.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      doneRef.current = true;
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { doneRef.current = true; setVisible(true); obs.disconnect(); obsRef.current = null; }
    }, { threshold });
    obs.observe(el); obsRef.current = obs;
  }, [threshold]);
  useEffect(() => {
    const fallbackId = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setVisible(true);
      }
    }, 900);
    return () => clearTimeout(fallbackId);
  }, []);
  useEffect(() => () => { if (obsRef.current) obsRef.current.disconnect(); }, []);
  return { ref, visible };
}

/* ━━━ Ripple Button ━━━ */
function RippleBtn({ children, onClick, className, ...props }) {
  const ref = useRef(null);
  const handleClick = (e) => {
    const btn = ref.current, rect = btn.getBoundingClientRect();
    const c = document.createElement('span');
    const d = Math.max(rect.width, rect.height);
    c.style.cssText = `position:absolute;border-radius:50%;background:rgba(20,184,166,.2);width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px;transform:scale(0);animation:dsh-ripple .6s ease-out;pointer-events:none`;
    btn.appendChild(c);
    setTimeout(() => c.remove(), 600);
    onClick?.(e);
  };
  return <button ref={ref} onClick={handleClick} className={`relative overflow-hidden ${className}`} {...props}>{children}</button>;
}

/* ━━━ Hex Grid Background ━━━ */
function HexGrid() {
  const hexes = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: (i % 8) * 120 + (Math.floor(i / 8) % 2 === 0 ? 0 : 60),
    y: Math.floor(i / 8) * 105,
    delay: Math.random() * 8,
    dur: 4 + Math.random() * 6,
  })), []);
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      {hexes.map(h => (
        <polygon key={h.id} points="60,0 120,35 120,95 60,130 0,95 0,35"
          transform={`translate(${h.x},${h.y}) scale(0.4)`}
          fill="none" stroke="#14b8a6" strokeWidth="1"
          style={{ animation: `dsh-hexPulse ${h.dur}s ease-in-out ${h.delay}s infinite` }} />
      ))}
    </svg>
  );
}

/* ━━━ Data Particle Stream ━━━ */
function DataStream({ side = 'left' }) {
  const particles = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i, delay: i * 1.2, size: 2 + Math.random() * 3, dur: 6 + Math.random() * 4,
    x: side === 'left' ? 20 + Math.random() * 40 : 60 + Math.random() * 30,
  })), [side]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full"
          style={{
            left: `${p.x}%`, bottom: '-10px', width: p.size, height: p.size,
            background: side === 'left' ? '#14b8a6' : '#06b6d4',
            opacity: 0.15,
            animation: `dsh-streamUp ${p.dur}s linear ${p.delay}s infinite`,
          }} />
      ))}
    </div>
  );
}

/* ━━━ Pulse Ring ━━━ */
function PulseRing({ color = '#14b8a6', size = 60 }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute rounded-full border"
          style={{
            width: size, height: size, borderColor: `${color}20`,
            animation: `dsh-pulseExpand 3s ease-out ${i * 1}s infinite`,
          }} />
      ))}
    </div>
  );
}

/* ━━━ Gauge Component ━━━ */
function Gauge({ value, max, label, color, icon: Icon, size = 100 }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ * 0.75; // 270deg arc
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-4 rounded-full blur-xl opacity-15" style={{ background: color }} />
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(135deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#0d2630" strokeWidth="6"
            strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}50)`, transition: 'stroke-dasharray 1.5s cubic-bezier(.16,1,.3,1)' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: 'rotate(0deg)' }}>
          <Icon size={16} style={{ color }} className="mb-0.5" />
          <span className="text-lg font-black text-white tabular-nums">{Math.round(pct)}%</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.12em]">{label}</span>
    </div>
  );
}

/* ━━━ Orbit Visualization ━━━ */
function OrbitViz({ skills, avgProf }) {
  const profRank = { Beginner: 1, Intermediate: 2, Expert: 3, Professional: 4 };
  const profColor = { Beginner: '#64748b', Intermediate: '#06b6d4', Expert: '#14b8a6', Professional: '#10b981' };
  const displayed = skills.slice(0, 8);
  const angleStep = (2 * Math.PI) / Math.max(displayed.length, 1);

  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto">
      {/* Orbit rings */}
      {[0.35, 0.55, 0.75, 0.95].map((s, i) => (
        <div key={i} className="absolute rounded-full border"
          style={{
            inset: `${(1 - s) / 2 * 100}%`,
            borderColor: `rgba(20,184,166,${0.04 + i * 0.02})`,
            borderStyle: i % 2 === 0 ? 'solid' : 'dashed',
          }} />
      ))}

      {/* Center core */}
      <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-[#14b8a6]/20 to-[#06b6d4]/10 border border-[#14b8a6]/15 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-2xl font-black text-white tabular-nums">{Math.round((avgProf / 4) * 100)}</div>
          <div className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Score</div>
        </div>
      </div>
      <PulseRing color="#14b8a6" size={120} />

      {/* Skill nodes */}
      {displayed.map((sk, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const rank = profRank[sk.proficiency] || 1;
        const radius = 38 + rank * 3;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        const c = profColor[sk.proficiency] || '#64748b';
        const nodeSize = 6 + rank * 2;

        return (
          <div key={sk.id} className="absolute z-20 group/node"
            style={{
              left: `${x}%`, top: `${y}%`,
              transform: 'translate(-50%,-50%)',
              animation: `dsh-nodeAppear 0.5s cubic-bezier(.34,1.56,.64,1) ${i * 0.08}s both`,
            }}>
            {/* Line to center */}
            <svg className="absolute pointer-events-none" style={{ width: 200, height: 200, left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
              <line x1="100" y1="100"
                x2={100 + (50 - x) / 100 * 200}
                y2={100 + (50 - y) / 100 * 200}
                stroke={c} strokeWidth="0.5" opacity="0.15" />
            </svg>

            <div className="relative cursor-default">
              <div className="rounded-full border-2 transition-all duration-300 group-hover/node:scale-150"
                style={{ width: nodeSize, height: nodeSize, backgroundColor: c, borderColor: `${c}60`, boxShadow: `0 0 8px ${c}40` }} />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg
                bg-[#0A1A22]/95 border border-[#1e3a42]/50 backdrop-blur-xl
                opacity-0 group-hover/node:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-30"
                style={{ animation: 'none' }}>
                <div className="text-[10px] font-bold text-white">{sk.skill_name}</div>
                <div className="text-[9px] font-medium" style={{ color: c }}>{sk.proficiency}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ━━━ Mini Sparkline ━━━ */
function Sparkline({ data, color = '#14b8a6', width = 80, height = 24 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}40)` }} />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - (data[data.length - 1] / max) * height}
        r="2.5" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

/* ━━━ Skeleton Blocks ━━━ */
function SkeletonBlock({ w = 'w-full', h = 'h-4', delay = 0 }) {
  return <div className={`${w} ${h} rounded-xl bg-[#1e3a42]/20`}
    style={{ animation: `dsh-skeletonPulse 1.5s ease-in-out ${delay}s infinite` }} />;
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════ */
export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, courses: 0, enrollments: 0, applications: 0 });
  const [allJobs, setAllJobs] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [expandedJob, setExpandedJob] = useState(null);
  const [activeMetric, setActiveMetric] = useState(null);
  const [showAllSkills, setShowAllSkills] = useState(false);

  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [jobsRes, coursesRes, enrollRes, skillsRes, appsRes] = await Promise.all([
          api.get('/jobs').catch(() => ({ data: [] })),
          api.get('/courses').catch(() => ({ data: [] })),
          user ? api.get(`/enrollments?user_id=${user.id}`).catch(() => ({ data: [] })) : { data: [] },
          user ? api.get(`/user-skills?user_id=${user.id}`).catch(() => ({ data: [] })) : { data: [] },
          user ? api.get(`/job-applications?user_id=${user.id}`).catch(() => ({ data: [] })) : { data: [] },
        ]);
        if (cancelled) return;
        const sk = Array.isArray(skillsRes.data) ? skillsRes.data : [];
        const jl = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const cl = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        const al = Array.isArray(appsRes.data) ? appsRes.data : [];
        setUserSkills(sk); setAllJobs(jl); setAllCourses(cl); setAppliedJobs(al);
        setStats({ jobs: jl.length, courses: cl.length, enrollments: Array.isArray(enrollRes.data) ? enrollRes.data.length : 0, applications: al.length });
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoaded(true); }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const proficiencyRank = { Beginner: 1, Intermediate: 2, Expert: 3, Professional: 4 };
  const avgProf = userSkills.length > 0 ? userSkills.reduce((s, sk) => s + (proficiencyRank[sk.proficiency] || 1), 0) / userSkills.length : 0;
  const avgLabel = avgProf >= 3.5 ? 'Professional' : avgProf >= 2.5 ? 'Expert' : avgProf >= 1.5 ? 'Intermediate' : avgProf > 0 ? 'Beginner' : 'N/A';
  const jobLevelRank = { 'Entry Level': 1, 'Mid Level': 2, Senior: 3 };
  const userSkillNames = userSkills.map(s => (s.skill_name || '').toLowerCase());

  const getMatch = (job) => {
    if (!user || !userSkills.length) return { total: 0, skills: 0, experience: 0, track: 0, matchedSkills: [] };
    const js = (Array.isArray(job.skills) ? job.skills : []).map(s => s.toLowerCase());
    const matched = js.filter(j => userSkillNames.includes(j));
    const skillScore = js.length ? Math.round((matched.length / js.length) * 60) : 0;
    const req = jobLevelRank[job.level] || 1;
    const expScore = avgProf >= req ? 20 : (req - avgProf <= 1 ? 12 : req - avgProf <= 2 ? 5 : 0);
    const trackScore = matched.length > 0 ? (matched.length >= js.length * 0.5 ? 20 : 10) : 0;
    return { total: skillScore + expScore + trackScore, skills: skillScore, experience: expScore, track: trackScore, matchedSkills: matched };
  };
  const scColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#14b8a6' : '#f59e0b';
  const scLabel = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : 'Fair';

  const recommended = useMemo(() =>
    [...allJobs].map(j => ({ ...j, match: getMatch(j) })).sort((a, b) => b.match.total - a.match.total).slice(0, 4),
    [allJobs, userSkills]
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();
  const r5 = useReveal(), r6 = useReveal(), r7 = useReveal();

  // Skill gap
  const skillGapData = useMemo(() => {
    if (!user || userSkills.length === 0 || allJobs.length === 0) return null;
    const freq = {};
    allJobs.forEach(j => (Array.isArray(j.skills) ? j.skills : []).forEach(sk => {
      const l = sk.toLowerCase();
      if (!userSkillNames.includes(l)) freq[sk] = (freq[sk] || 0) + 1;
    }));
    const missing = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
    if (!missing.length) return null;
    const maxFreq = missing[0]?.[1] || 1;

    const courseKw = { react:['web','react','frontend'],'node.js':['web','node','backend'],javascript:['web','javascript'],python:['python','data','machine'],sql:['data','python','backend'],docker:['cloud','devops'],aws:['cloud','aws'],kubernetes:['cloud','devops'],tensorflow:['machine learning','ai'],figma:['design','ui/ux'],'react native':['react native','mobile'] };
    const findCourse = (n) => {
      const kw = courseKw[n.toLowerCase()] || [n.toLowerCase()];
      let best = null, bestS = 0;
      allCourses.forEach(c => { const h = `${c.name||''} ${c.topic||''} ${c.description||''}`.toLowerCase(); let s = 0; kw.forEach(k => { if (h.includes(k)) s++; }); if (s > bestS) { bestS = s; best = c; } });
      return best;
    };
    const cMap = new Map();
    missing.forEach(([sk]) => { const c = findCourse(sk); if (c) { if (!cMap.has(c.id)) cMap.set(c.id, { course: c, skills: [], demand: 0 }); const e = cMap.get(c.id); e.skills.push(sk); e.demand += freq[sk]; } });
    const recs = [...cMap.values()].sort((a, b) => b.demand - a.demand).slice(0, 4);
    return { missing, recs, maxFreq, freq };
  }, [user, userSkills, allJobs, allCourses, userSkillNames]);

  // Fake sparkline data
  const sparkData = useMemo(() => ({
    jobs: [2, 5, 3, 8, 6, 12, stats.jobs],
    courses: [1, 3, 2, 5, 4, 7, stats.courses],
    enrolled: [0, 1, 1, 2, 2, 3, stats.enrollments],
    applied: [0, 1, 2, 2, 3, 4, stats.applications],
  }), [stats]);

  const profCounts = useMemo(() => {
    const c = { Beginner: 0, Intermediate: 0, Expert: 0, Professional: 0 };
    userSkills.forEach(s => { if (c[s.proficiency] !== undefined) c[s.proficiency]++; });
    return c;
  }, [userSkills]);

  return (
    <>
      <style>{`
        @keyframes dsh-morph1{0%,100%{border-radius:42% 58% 70% 30%/45% 45% 55% 55%;transform:rotate(0) scale(1)}25%{border-radius:70% 30% 50% 50%/30% 60% 40% 70%;transform:rotate(90deg) scale(1.06)}50%{border-radius:30% 70% 40% 60%/55% 30% 70% 45%;transform:rotate(180deg) scale(.94)}75%{border-radius:55% 45% 60% 40%/40% 70% 30% 60%;transform:rotate(270deg) scale(1.03)}}
        @keyframes dsh-morph2{0%,100%{border-radius:58% 42% 30% 70%/55% 45% 55% 45%;transform:rotate(0)}33%{border-radius:40% 60% 60% 40%/60% 30% 70% 40%;transform:rotate(120deg)}66%{border-radius:60% 40% 45% 55%/35% 65% 35% 65%;transform:rotate(240deg)}}
        @keyframes dsh-gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes dsh-fadeUp{from{opacity:0;transform:translateY(50px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes dsh-fadeIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
        @keyframes dsh-slideR{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none}}
        @keyframes dsh-slideL{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
        @keyframes dsh-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
        @keyframes dsh-rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes dsh-rotateR{from{transform:rotate(360deg)}to{transform:rotate(0)}}
        @keyframes dsh-glow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.4)}}
        @keyframes dsh-textShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes dsh-barGrow{from{transform:scaleX(0)}}
        @keyframes dsh-ripple{to{transform:scale(3);opacity:0}}
        @keyframes dsh-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes dsh-float2{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-6px) rotate(2deg)}}
        @keyframes dsh-hexPulse{0%,100%{opacity:.3;stroke-width:1}50%{opacity:1;stroke-width:1.5}}
        @keyframes dsh-streamUp{0%{transform:translateY(0) scale(1);opacity:0}10%{opacity:.3}90%{opacity:.3}100%{transform:translateY(-100vh) scale(0);opacity:0}}
        @keyframes dsh-pulseExpand{0%{transform:scale(1);opacity:.4}100%{transform:scale(2.5);opacity:0}}
        @keyframes dsh-nodeAppear{from{opacity:0;transform:translate(-50%,-50%) scale(0)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
        @keyframes dsh-skeletonPulse{0%,100%{opacity:.1}50%{opacity:.25}}
        @keyframes dsh-borderFlow{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes dsh-cardEnter{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dsh-shine{0%{left:-100%}50%,100%{left:150%}}
        @keyframes dsh-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        @keyframes dsh-dotPulse{0%,100%{box-shadow:0 0 0 0 currentColor}50%{box-shadow:0 0 0 6px transparent}}
        @keyframes dsh-waveBar{0%,100%{height:4px}50%{height:16px}}
        @keyframes dsh-counterPop{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
        @keyframes dsh-statusPulse{0%,100%{box-shadow:0 0 0 0 var(--sc)}50%{box-shadow:0 0 12px 2px var(--sc)}}

        .dsh-reveal{opacity:0;transform:translateY(50px) scale(.96);transition:all .9s cubic-bezier(.16,1,.3,1)}
        .dsh-reveal.vis{opacity:1;transform:none}
        .dsh-stagger>*{opacity:0;transform:translateY(25px)}
        .dsh-stagger.vis>*{animation:dsh-cardEnter .7s cubic-bezier(.16,1,.3,1) both}
        .dsh-stagger.vis>*:nth-child(1){animation-delay:.04s}
        .dsh-stagger.vis>*:nth-child(2){animation-delay:.1s}
        .dsh-stagger.vis>*:nth-child(3){animation-delay:.16s}
        .dsh-stagger.vis>*:nth-child(4){animation-delay:.22s}
        .dsh-stagger.vis>*:nth-child(5){animation-delay:.28s}
        .dsh-stagger.vis>*:nth-child(6){animation-delay:.34s}
        .dsh-stagger.vis>*:nth-child(7){animation-delay:.4s}
        .dsh-stagger.vis>*:nth-child(8){animation-delay:.46s}

        .dsh-grad{background:linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#8b5cf6,#14b8a6);background-size:400% 400%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:dsh-textShift 6s ease infinite}
        .dsh-glass{background:linear-gradient(145deg,rgba(10,26,34,.7),rgba(7,16,21,.8));backdrop-filter:blur(40px);border:1px solid rgba(30,58,66,.3)}
        .dsh-glass:hover{border-color:rgba(30,58,66,.5)}
        .dsh-card{transition:all .5s cubic-bezier(.16,1,.3,1)}
        .dsh-card:hover{transform:translateY(-5px);box-shadow:0 20px 60px -15px rgba(20,184,166,.08)}
        .dsh-shine{position:relative;overflow:hidden}
        .dsh-shine::after{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.025),transparent);animation:dsh-shine 7s ease-in-out infinite;pointer-events:none}
        .dsh-flow-border{position:relative}
        .dsh-flow-border::before{content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(90deg,transparent,#14b8a6,transparent,#06b6d4,transparent);background-size:200% 100%;animation:dsh-borderFlow 4s linear infinite;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .5s;pointer-events:none}
        .dsh-flow-border:hover::before{opacity:1}
        .dsh-bar{transform-origin:left;animation:dsh-barGrow 1.2s cubic-bezier(.16,1,.3,1) both}
        .dsh-wave{animation:dsh-waveBar var(--dur) ease-in-out var(--delay) infinite}

        .dsh-dot-grid{background-image:radial-gradient(rgba(20,184,166,.04) 1px,transparent 1px);background-size:32px 32px}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e3a42;border-radius:10px}::-webkit-scrollbar-thumb:hover{background:#14b8a6}
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden">
        {/* ══ BACKGROUND ══ */}
        <div className="fixed inset-0 z-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #050D11 0%, #0A1A22 40%, #071218 100%)' }}>
          <div className="absolute opacity-[0.06]" style={{ width: 550, height: 550, top: '-10%', right: '-5%', background: 'radial-gradient(circle,#14b8a6,transparent 70%)', animation: 'dsh-morph1 22s ease-in-out infinite' }} />
          <div className="absolute opacity-[0.04]" style={{ width: 480, height: 480, top: '45%', left: '-8%', background: 'radial-gradient(circle,#06b6d4,transparent 70%)', animation: 'dsh-morph2 28s ease-in-out infinite' }} />
          <div className="absolute opacity-[0.03]" style={{ width: 400, height: 400, bottom: '5%', right: '20%', background: 'radial-gradient(circle,#8b5cf6,transparent 70%)', animation: 'dsh-morph1 18s ease-in-out infinite reverse' }} />
          <div className="absolute w-[700px] h-[700px] rounded-full transition-all duration-[3s] ease-out opacity-[0.02]"
            style={{ background: 'radial-gradient(circle,#14b8a6,transparent 60%)', left: mouse.x - 350, top: mouse.y - 350 }} />
          <HexGrid />
          <div className="dsh-dot-grid absolute inset-0 opacity-40" />
          <DataStream side="left" />
          <DataStream side="right" />
        </div>

        {/* ══ CONTENT ══ */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-20">

          {/* ═══ 1 · HERO WELCOME ═══ */}
          <div ref={r1.ref} className={`dsh-reveal ${r1.visible ? 'vis' : ''} mb-16`}>
            {/* Date bar */}
            <div className="flex items-center gap-3 mb-8"
              style={{ animation: r1.visible ? 'dsh-slideR .7s cubic-bezier(.16,1,.3,1) .1s both' : 'none' }}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14b8a6]/[0.06] border border-[#14b8a6]/15">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-[#2dd4bf] font-bold uppercase tracking-[0.2em]">Live</span>
              </div>
              <span className="text-xs text-gray-600 font-mono tracking-wider">{currentDate}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#1a3540]/60 to-transparent" />
              {/* Sound wave indicator */}
              <div className="flex items-end gap-[2px] h-4 mr-2">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="w-[2px] rounded-full bg-[#14b8a6]/40 dsh-wave"
                    style={{ '--dur': `${0.8 + i * 0.15}s`, '--delay': `${i * 0.1}s`, height: '4px' }} />
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              {/* Left: Avatar + Greeting */}
              <div className="flex items-start gap-7" style={{ animation: r1.visible ? 'dsh-slideR .8s cubic-bezier(.16,1,.3,1) .2s both' : 'none' }}>
                {/* Avatar with orbital rings */}
                <div className="relative w-24 h-24 shrink-0">
                  <div className="absolute inset-[-16px] rounded-full border border-dashed border-[#14b8a6]/10"
                    style={{ animation: 'dsh-rotate 25s linear infinite' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#14b8a6] shadow-lg shadow-[#14b8a6]/50" />
                  </div>
                  <div className="absolute inset-[-28px] rounded-full border border-dotted border-[#06b6d4]/5"
                    style={{ animation: 'dsh-rotateR 35s linear infinite' }}>
                    <div className="absolute bottom-0 right-1/4 w-2 h-2 rounded-full bg-[#06b6d4]/50" />
                  </div>

                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-[#14b8a6] via-[#0d9488] to-[#06b6d4] flex items-center justify-center shadow-2xl shadow-[#14b8a6]/20 overflow-hidden"
                    style={{ animation: 'dsh-breathe 4s ease-in-out infinite' }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-black text-white">{user?.name?.[0]?.toUpperCase()}</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#10b981] border-[3px] border-[#04111a] z-10"
                    style={{ animation: 'dsh-pulse 2.5s ease infinite' }} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-[#14b8a6]" style={{ animation: 'dsh-float 3s ease-in-out infinite' }} />
                    <span className="text-sm text-[#2dd4bf] font-semibold">{greeting}</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4">
                    {user?.name?.split(' ')[0]}
                    <span className="dsh-grad">'s</span>
                    <br />
                    <span className="text-gray-500 font-light text-2xl sm:text-3xl lg:text-4xl">Command Center</span>
                  </h1>
                  <p className="text-gray-500 text-sm sm:text-base max-w-lg leading-relaxed">
                    Your career intelligence hub — track progress, discover opportunities, and accelerate growth.
                  </p>
                </div>
              </div>

              {/* Right: Quick gauges */}
              <div className="flex items-center gap-4 flex-wrap" style={{ animation: r1.visible ? 'dsh-slideL .8s cubic-bezier(.16,1,.3,1) .4s both' : 'none' }}>
                <Gauge value={avgProf} max={4} label="Skill Level" color="#14b8a6" icon={Shield} size={90} />
                <Gauge value={stats.applications} max={Math.max(stats.jobs, 1)} label="App Rate" color="#f59e0b" icon={Send} size={90} />
                <Gauge value={stats.enrollments} max={Math.max(stats.courses, 1)} label="Learn Rate" color="#06b6d4" icon={BookOpen} size={90} />
              </div>
            </div>
          </div>

          {/* ═══ 2 · METRICS GRID ═══ */}
          <div ref={r2.ref} className={`dsh-reveal ${r2.visible ? 'vis' : ''} mb-14`}>
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 dsh-stagger ${r2.visible ? 'vis' : ''}`}>
              {[
                { icon: Briefcase, label: 'Open Positions', value: stats.jobs, color: '#14b8a6', link: '/jobs', spark: sparkData.jobs },
                { icon: BookOpen, label: 'Learning Paths', value: stats.courses, color: '#06b6d4', link: '/resources', spark: sparkData.courses },
                { icon: Award, label: 'Enrolled', value: stats.enrollments, color: '#10b981', link: '/resources', spark: sparkData.enrolled },
                { icon: Flame, label: 'Applications', value: stats.applications, color: '#f59e0b', link: '/jobs', spark: sparkData.applied },
              ].map((m, i) => (
                <Link key={m.label} to={m.link}>
                  <div className={`group dsh-glass dsh-flow-border dsh-shine dsh-card rounded-2xl p-5 sm:p-6 cursor-pointer relative overflow-hidden
                    ${activeMetric === i ? 'ring-1' : ''}`}
                    style={activeMetric === i ? { ringColor: `${m.color}30` } : {}}
                    onMouseEnter={() => setActiveMetric(i)} onMouseLeave={() => setActiveMetric(null)}>
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                      style={{ background: `linear-gradient(90deg,transparent,${m.color},transparent)` }} />

                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                        style={{ background: `${m.color}12`, boxShadow: activeMetric === i ? `0 4px 20px ${m.color}15` : 'none' }}>
                        <m.icon size={18} style={{ color: m.color }} />
                      </div>
                      <Sparkline data={m.spark} color={m.color} width={60} height={20} />
                    </div>

                    <div className="text-3xl sm:text-4xl font-black text-white mb-1 tabular-nums"
                      style={activeMetric === i ? { animation: 'dsh-counterPop .3s ease' } : {}}>
                      {loaded ? <Counter to={m.value} loaded={loaded} /> : <SkeletonBlock w="w-14" h="h-8" />}
                    </div>
                    <div className="text-xs text-gray-400 font-semibold">{m.label}</div>
                    <ArrowUpRight size={14} className="absolute bottom-5 right-5 text-gray-700 group-hover:text-gray-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ═══ 3 · SKILL ORBIT & PROFILE ═══ */}
          <div ref={r3.ref} className={`dsh-reveal ${r3.visible ? 'vis' : ''} mb-14`}>
            <div className="grid lg:grid-cols-12 gap-5">
              {/* Orbit Visualization */}
              <div className="lg:col-span-5 dsh-glass dsh-flow-border rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent" />
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14b8a6]/[0.06] border border-[#14b8a6]/12">
                    <Cpu size={10} className="text-[#14b8a6]" />
                    <span className="text-[9px] text-[#14b8a6] font-bold uppercase tracking-[0.15em]">Skill Orbit</span>
                  </div>
                </div>

                {userSkills.length > 0 ? (
                  <OrbitViz skills={userSkills} avgProf={avgProf} />
                ) : (
                  <div className="text-center py-12 text-gray-600 text-sm">
                    <Compass size={28} className="mx-auto mb-3 text-gray-700" style={{ animation: 'dsh-float 4s ease-in-out infinite' }} />
                    No skills yet — <Link to="/profile" className="text-[#14b8a6] hover:underline">add skills</Link>
                  </div>
                )}

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {[
                    { l: 'Beginner', c: '#64748b' }, { l: 'Intermediate', c: '#06b6d4' },
                    { l: 'Expert', c: '#14b8a6' }, { l: 'Professional', c: '#10b981' },
                  ].map(leg => (
                    <div key={leg.l} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: leg.c }} />
                      <span className="text-[9px] text-gray-600 font-medium">{leg.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile + Skill bars */}
              <div className="lg:col-span-7 dsh-glass dsh-flow-border dsh-shine rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#06b6d4]/30 to-transparent" />

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#06b6d4]/[0.06] border border-[#06b6d4]/12">
                      <Activity size={10} className="text-[#06b6d4]" />
                      <span className="text-[9px] text-[#06b6d4] font-bold uppercase tracking-[0.15em]">Proficiency Map</span>
                    </div>
                  </div>
                  <Link to="/profile" className="group/e flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#14b8a6] border border-[#1a3540]/30 hover:border-[#14b8a6]/20 transition-all duration-300">
                    Edit <ArrowRight size={11} className="group-hover/e:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Distribution summary */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[
                    { l: 'Beginner', v: profCounts.Beginner, c: '#64748b' },
                    { l: 'Intermediate', v: profCounts.Intermediate, c: '#06b6d4' },
                    { l: 'Expert', v: profCounts.Expert, c: '#14b8a6' },
                    { l: 'Professional', v: profCounts.Professional, c: '#10b981' },
                  ].map(d => (
                    <div key={d.l} className="text-center p-3 rounded-xl bg-[#071015]/40 border border-[#1a3540]/20 group/stat hover:border-[#1a3540]/40 transition-all cursor-default">
                      <div className="text-lg font-black tabular-nums mb-0.5" style={{ color: d.c }}>{d.v}</div>
                      <div className="text-[8px] text-gray-600 uppercase tracking-wider font-bold">{d.l}</div>
                    </div>
                  ))}
                </div>

                {/* Skill bars */}
                {userSkills.length > 0 ? (
                  <div className="space-y-2.5">
                    {(showAllSkills ? userSkills : userSkills.slice(0, 5)).map((s, i) => {
                      const pct = ((proficiencyRank[s.proficiency] || 1) / 4) * 100;
                      const barColor = s.proficiency === 'Professional' ? '#10b981' : s.proficiency === 'Expert' ? '#14b8a6' : s.proficiency === 'Intermediate' ? '#06b6d4' : '#64748b';
                      return (
                        <div key={s.id} className="group/bar flex items-center gap-3 hover:bg-white/[0.01] -mx-2 px-2 py-1.5 rounded-xl transition-all duration-300">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 group-hover/bar:scale-110 transition-transform"
                            style={{ background: `${barColor}12` }}>
                            <Code2 size={11} style={{ color: barColor }} />
                          </div>
                          <span className="text-xs text-gray-300 font-semibold w-24 truncate group-hover/bar:text-white transition-colors">{s.skill_name}</span>
                          <div className="flex-1 h-2 bg-[#0d2630] rounded-full overflow-hidden">
                            <div className="h-full rounded-full dsh-bar" style={{
                              width: `${pct}%`, background: `linear-gradient(90deg,${barColor},${barColor}80)`,
                              boxShadow: `0 0 8px ${barColor}25`, animationDelay: `${i * 0.08}s`,
                            }} />
                          </div>
                          <span className="text-[10px] font-mono text-gray-600 w-16 text-right shrink-0">{s.proficiency.slice(0, 4)}</span>
                        </div>
                      );
                    })}
                    {userSkills.length > 5 && (
                      <button onClick={() => setShowAllSkills(!showAllSkills)}
                        className="flex items-center gap-1.5 text-xs text-[#14b8a6] hover:text-[#2dd4bf] font-semibold mt-1 cursor-pointer transition-colors">
                        {showAllSkills ? 'Show less' : `View all ${userSkills.length}`}
                        <ChevronDown size={12} className={`transition-transform duration-300 ${showAllSkills ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600 text-sm">
                    No skills — <Link to="/profile" className="text-[#14b8a6] hover:underline">add your first skill</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══ 4 · TOP MATCHES ═══ */}
          {user && recommended.length > 0 && (
            <div ref={r4.ref} className={`dsh-reveal ${r4.visible ? 'vis' : ''} mb-14`}>
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6]/20 to-[#06b6d4]/10 flex items-center justify-center relative">
                    <Zap size={18} className="text-[#14b8a6]" />
                    <div className="absolute inset-0 rounded-xl" style={{ animation: 'dsh-glow 3s ease infinite', boxShadow: '0 0 15px rgba(20,184,166,.12)' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Top Matches</h2>
                    <p className="text-[11px] text-gray-600">AI-curated for your profile</p>
                  </div>
                </div>
                <Link to="/jobs" className="group/l flex items-center gap-2 px-4 py-2 rounded-xl border border-[#1a3540]/30 text-xs text-gray-400 hover:text-white hover:border-[#14b8a6]/25 transition-all font-semibold">
                  All Jobs <ArrowRight size={12} className="group-hover/l:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className={`grid sm:grid-cols-2 gap-4 dsh-stagger ${r4.visible ? 'vis' : ''}`}>
                {recommended.map((job, idx) => {
                  const d = job.match;
                  const sc = scColor(d.total);
                  const sl = scLabel(d.total);
                  const skills = Array.isArray(job.skills) ? job.skills : [];
                  const isExpanded = expandedJob === job.id;
                  const isFeatured = idx === 0;

                  return (
                    <div key={job.id}
                      className={`group dsh-glass dsh-flow-border dsh-shine rounded-2xl relative overflow-hidden cursor-pointer transition-all duration-500 hover:translate-y-[-4px] ${isFeatured ? 'sm:col-span-2' : ''}`}
                      onClick={() => setExpandedJob(isExpanded ? null : job.id)}>
                      {/* Top accent */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] z-10"
                        style={{ background: `linear-gradient(90deg,transparent,${sc}60,transparent)` }} />
                      {/* Side accent */}
                      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full z-10 transition-all duration-500 group-hover:top-2 group-hover:bottom-2"
                        style={{ background: sc }} />

                      <div className={`p-5 sm:p-6 ${isFeatured ? 'sm:pl-8' : 'pl-6'}`}>
                        <div className={`flex ${isFeatured ? 'flex-col sm:flex-row sm:items-start' : 'items-center'} gap-5`}>
                          {/* Score */}
                          <div className={`relative shrink-0 ${isFeatured ? 'w-24 h-24' : 'w-14 h-14'}`}>
                            <svg className="w-full h-full" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                              <circle cx="50" cy="50" r="42" fill="none" stroke="#0d2630" strokeWidth={isFeatured ? 5 : 4} />
                              <circle cx="50" cy="50" r="42" fill="none" stroke={sc} strokeWidth={isFeatured ? 5 : 4}
                                strokeDasharray={`${(d.total / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                                strokeLinecap="round"
                                style={{ filter: `drop-shadow(0 0 6px ${sc}50)`, transition: 'stroke-dasharray 1s ease' }} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`font-black text-white tabular-nums ${isFeatured ? 'text-2xl' : 'text-sm'}`}>{d.total}%</span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <h3 className={`font-bold text-white group-hover:text-[#e2e8f0] transition-colors ${isFeatured ? 'text-xl' : 'text-sm'}`}>{job.title}</h3>
                                  {isFeatured && <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15"><Star size={8} /> Featured</span>}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                  <span className="flex items-center gap-1"><Building2 size={11} /> {job.company}</span>
                                  <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                                  {job.level && <span className="flex items-center gap-1"><TrendingUp size={11} /> {job.level}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                                  style={{ color: sc, background: `${sc}10`, border: `1px solid ${sc}20` }}>{sl}</span>
                                <ChevronDown size={14} className={`text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </div>

                            {/* Skills preview */}
                            {isFeatured && (
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {skills.slice(0, 6).map((sk, si) => {
                                  const m = d.matchedSkills.includes(sk.toLowerCase());
                                  return (
                                    <span key={si} className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border transition-all ${m ? 'bg-emerald-500/8 text-emerald-300 border-emerald-500/15' : 'bg-white/[0.02] text-gray-500 border-[#1a3540]/30'}`}>
                                      {m && <CheckCircle size={8} className="inline mr-1" />}{sk}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expandable detail */}
                        <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${isExpanded ? 'max-h-[500px] opacity-100 mt-5' : 'max-h-0 opacity-0'}`}>
                          <div className="pt-4 border-t border-[#1a3540]/25">
                            {!isFeatured && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {skills.slice(0, 5).map((sk, si) => {
                                  const m = d.matchedSkills.includes(sk.toLowerCase());
                                  return (
                                    <span key={si} className={`px-2 py-0.5 text-[10px] font-medium rounded-md border ${m ? 'bg-emerald-500/8 text-emerald-300 border-emerald-500/15' : 'bg-white/[0.01] text-gray-500 border-[#1a3540]/25'}`}>
                                      {m && '✓ '}{sk}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              {[{ l: 'Skills', v: d.skills, mx: 60, c: '#14b8a6' }, { l: 'Experience', v: d.experience, mx: 20, c: '#06b6d4' }, { l: 'Track', v: d.track, mx: 20, c: '#8b5cf6' }].map(b => (
                                <div key={b.l}>
                                  <div className="h-2 bg-[#0d2630] rounded-full overflow-hidden mb-1.5">
                                    <div className="h-full rounded-full transition-all duration-1000"
                                      style={{ width: `${(b.v / b.mx) * 100}%`, background: b.c, boxShadow: `0 0 6px ${b.c}25` }} />
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[9px] text-gray-600 uppercase tracking-wider font-medium">{b.l}</span>
                                    <span className="text-[9px] font-mono text-gray-500">{b.v}/{b.mx}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Link to="/jobs" onClick={e => e.stopPropagation()}>
                              <RippleBtn className="w-full py-3 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-white text-sm font-bold hover:shadow-lg hover:shadow-[#14b8a6]/20 transition-all cursor-pointer flex items-center justify-center gap-2">
                                <Send size={13} /> Apply Now
                              </RippleBtn>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ 5 · APPLICATIONS ═══ */}
          {user && appliedJobs.length > 0 && (
            <div ref={r5.ref} className={`dsh-reveal ${r5.visible ? 'vis' : ''} mb-14`}>
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center">
                    <FileText size={18} className="text-[#f59e0b]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Application Tracker</h2>
                    <p className="text-[11px] text-gray-600">{appliedJobs.length} active</p>
                  </div>
                </div>
              </div>

              <div className={`relative pl-8 space-y-4 dsh-stagger ${r5.visible ? 'vis' : ''}`}>
                {/* Timeline line */}
                <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#14b8a6] via-[#06b6d4] to-transparent rounded-full" />

                {appliedJobs.slice(0, 5).map((app, i) => {
                  const job = app.job;
                  if (!job) return null;
                  const statusMap = {
                    Pending: { color: '#f59e0b', icon: Clock },
                    Reviewed: { color: '#3b82f6', icon: Eye },
                    Shortlisted: { color: '#a855f7', icon: Star },
                    Accepted: { color: '#10b981', icon: CheckCircle },
                    Rejected: { color: '#ef4444', icon: AlertTriangle },
                  };
                  const st = statusMap[app.status] || statusMap.Pending;
                  const StIcon = st.icon;

                  return (
                    <div key={app.id} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-8 top-5 w-8 flex justify-center">
                        <div className="w-3 h-3 rounded-full border-[3px] border-[#04111a] z-10 transition-transform duration-300 group-hover:scale-150"
                          style={{ backgroundColor: st.color, '--sc': `${st.color}30`, animation: i === 0 ? 'dsh-statusPulse 2s ease infinite' : 'none' }} />
                      </div>

                      <div className="dsh-glass dsh-flow-border dsh-card rounded-2xl p-5 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                              style={{ background: `${st.color}10` }}>
                              <Briefcase size={16} style={{ color: st.color }} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-white truncate group-hover:text-[#2dd4bf] transition-colors">{job.title}</h3>
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500 mt-0.5">
                                <span className="flex items-center gap-1"><Building2 size={10} /> {job.company}</span>
                                <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border shrink-0 transition-all group-hover:scale-105"
                            style={{ background: `${st.color}06`, borderColor: `${st.color}15` }}>
                            <StIcon size={12} style={{ color: st.color }} />
                            <span className="text-[11px] font-bold" style={{ color: st.color }}>{app.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ 6 · SKILL GAP ═══ */}
          {skillGapData && (
            <div ref={r6.ref} className={`dsh-reveal ${r6.visible ? 'vis' : ''} mb-14`}>
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Lightbulb size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Skill Gap Analysis</h2>
                    <p className="text-[11px] text-gray-600">In-demand skills & learning paths</p>
                  </div>
                </div>
                <Link to="/resources" className="group/l flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors font-semibold">
                  Courses <ArrowRight size={12} className="group-hover/l:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                {/* Gap chart */}
                <div className="dsh-glass dsh-flow-border rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                  <h3 className="text-xs font-bold text-white mb-5 flex items-center gap-2 uppercase tracking-wider">
                    <AlertTriangle size={12} className="text-amber-400" /> Missing Skills
                  </h3>
                  <div className={`space-y-2.5 dsh-stagger ${r6.visible ? 'vis' : ''}`}>
                    {skillGapData.missing.map(([skill, count], i) => (
                      <div key={skill} className="group/sk flex items-center gap-3 hover:bg-white/[0.01] -mx-2 px-2 py-1 rounded-xl transition-all cursor-default">
                        <span className="text-xs text-amber-300/80 font-semibold w-28 truncate group-hover/sk:text-amber-300 transition-colors">{skill}</span>
                        <div className="flex-1 h-2.5 bg-[#0d2630] rounded-full overflow-hidden">
                          <div className="h-full rounded-full dsh-bar"
                            style={{
                              width: `${(count / skillGapData.maxFreq) * 100}%`,
                              background: 'linear-gradient(90deg,#f59e0b,#f59e0b80)',
                              boxShadow: '0 0 8px rgba(245,158,11,.15)',
                              animationDelay: `${i * 0.07}s`,
                            }} />
                        </div>
                        <span className="text-[10px] font-mono text-gray-600 w-8 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course recs */}
                <div className={`space-y-3 dsh-stagger ${r6.visible ? 'vis' : ''}`}>
                  {skillGapData.recs.map(({ course, skills, demand }) => (
                    <div key={course.id} className="group dsh-glass dsh-flow-border dsh-shine dsh-card rounded-2xl p-5 relative overflow-hidden">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6]/15 to-[#06b6d4]/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <GraduationCap size={16} className="text-[#14b8a6]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[#2dd4bf] transition-colors truncate">{course.name}</h4>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {skills.map(sk => (
                              <span key={sk} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/12">+ {sk}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[#0d2630] rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-[#14b8a6] to-[#06b6d4]"
                                style={{ width: `${Math.min((demand / allJobs.length) * 100, 100)}%`, transition: 'width 1s ease', boxShadow: '0 0 6px rgba(20,184,166,.2)' }} />
                            </div>
                            <span className="text-[10px] text-gray-500 shrink-0">Unlocks {demand} jobs</span>
                          </div>
                        </div>
                        <Link to="/resources" onClick={e => e.stopPropagation()} className="shrink-0 w-8 h-8 rounded-xl bg-white/[0.02] border border-[#1a3540]/30 flex items-center justify-center hover:bg-[#14b8a6]/10 hover:border-[#14b8a6]/20 transition-all group-hover:scale-110">
                          <ArrowUpRight size={12} className="text-gray-600 group-hover:text-[#14b8a6] transition-colors" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ 7 · QUICK ACTIONS ═══ */}
          <div ref={r7.ref} className={`dsh-reveal ${r7.visible ? 'vis' : ''}`}>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 flex items-center justify-center">
                <Rocket size={18} className="text-[#06b6d4]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Quick Launch</h2>
                <p className="text-[11px] text-gray-600">Jump to common tasks</p>
              </div>
            </div>

            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 dsh-stagger ${r7.visible ? 'vis' : ''}`}>
              {[
                { icon: Target, label: 'Find Jobs', desc: 'AI matching', link: '/jobs', color: '#14b8a6', emoji: '🎯' },
                { icon: GraduationCap, label: 'Learn', desc: 'Browse courses', link: '/resources', color: '#06b6d4', emoji: '📚' },
                { icon: Terminal, label: 'AI Chat', desc: 'Career advice', link: '/chatbot', color: '#8b5cf6', emoji: '🤖' },
                { icon: FileText, label: 'CV Analyze', desc: 'Get insights', link: '/cv-analyzer', color: '#f59e0b', emoji: '📄' },
              ].map((a) => (
                <Link key={a.label} to={a.link}>
                  <div className="group dsh-glass dsh-flow-border dsh-shine dsh-card rounded-2xl p-5 sm:p-6 cursor-pointer relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg,transparent,${a.color},transparent)` }} />
                    <div className="text-3xl mb-3" style={{ animation: 'dsh-float 3s ease-in-out infinite' }}>{a.emoji}</div>
                    <div className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{ background: `${a.color}12` }}>
                      <a.icon size={20} style={{ color: a.color }} />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-0.5">{a.label}</h3>
                    <p className="text-gray-600 text-[10px]">{a.desc}</p>
                    <div className="mt-3 w-7 h-7 rounded-full bg-white/[0.02] border border-[#1a3540]/25 flex items-center justify-center mx-auto group-hover:bg-white/[0.05] transition-all">
                      <ArrowUpRight size={12} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="h-12" />
        </div>
      </div>
    </>
  );
}