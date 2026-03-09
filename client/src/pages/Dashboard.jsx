import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Briefcase, BookOpen, TrendingUp, Target, Award, ArrowRight,
  Users, Star, MapPin, Building2, Send, Zap, Clock,
  AlertTriangle, Lightbulb, CheckCircle, FileText, Sparkles,
  ChevronRight, Eye, GraduationCap, Layers, ArrowUpRight,
  Activity, Flame, Radio, CircleDot
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
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

/* ━━━ Fixed Intersection‑Observer hook (callback‑ref pattern) ━━━
   Works correctly with conditionally‑rendered elements. */
function useReveal(threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef(null);
  const revealedRef = useRef(false);          // avoids re-observing once revealed

  const ref = useCallback(
    (el) => {
      // tear down any previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // nothing to do if the node was removed or we already revealed
      if (!el || revealedRef.current) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            revealedRef.current = true;
            setVisible(true);
            obs.disconnect();
            observerRef.current = null;
          }
        },
        { threshold }
      );

      obs.observe(el);
      observerRef.current = obs;
    },
    [threshold]
  );

  // safety cleanup on unmount
  useEffect(() => () => { if (observerRef.current) observerRef.current.disconnect(); }, []);

  return { ref, visible };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, courses: 0, enrollments: 0, applications: 0 });
  const [allJobs, setAllJobs] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hoveredStat, setHoveredStat] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);

  /* mouse position for background glow */
  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  /* data fetching */
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
        setUserSkills(sk);
        setAllJobs(jl);
        setAllCourses(cl);
        setAppliedJobs(al);
        setStats({
          jobs: jl.length,
          courses: cl.length,
          enrollments: Array.isArray(enrollRes.data) ? enrollRes.data.length : 0,
          applications: al.length,
        });
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoaded(true); }
    })();
    return () => { cancelled = true; };
  }, [user]);

  /* ── computed values ── */
  const proficiencyRank = { Beginner: 1, Intermediate: 2, Expert: 3, Professional: 4 };
  const avgProf = userSkills.length > 0
    ? userSkills.reduce((s, sk) => s + (proficiencyRank[sk.proficiency] || 1), 0) / userSkills.length
    : 0;
  const avgLabel = avgProf >= 3.5 ? 'Professional'
    : avgProf >= 2.5 ? 'Expert'
    : avgProf >= 1.5 ? 'Intermediate'
    : avgProf > 0 ? 'Beginner' : 'N/A';
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

  const recommended = [...allJobs]
    .map(j => ({ ...j, match: getMatch(j) }))
    .sort((a, b) => b.match.total - a.match.total)
    .slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  /* reveal refs — safe with conditional rendering now */
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();
  const r5 = useReveal();
  const r6 = useReveal();
  const r7 = useReveal();

  /* ── skill gap computation ── */
  const skillGapData = (() => {
    if (!user || userSkills.length === 0 || allJobs.length === 0) return null;
    const freq = {};
    allJobs.forEach(j =>
      (Array.isArray(j.skills) ? j.skills : []).forEach(sk => {
        const l = sk.toLowerCase();
        if (!userSkillNames.includes(l)) freq[sk] = (freq[sk] || 0) + 1;
      })
    );
    const missing = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
    if (!missing.length) return null;

    const courseKw = {
      react:['web development','react','frontend'],'node.js':['web development','node','backend','api'],javascript:['web development','javascript','frontend'],typescript:['web development','typescript','react native'],python:['python','data science','machine learning'],sql:['data science','python','backend'],html:['web development'],css:['web development','design'],'tailwind css':['web development'],laravel:['laravel','api','backend'],'rest api':['laravel','api','web development','react native'],git:['web development'],docker:['cloud','devops','aws'],kubernetes:['cloud','devops','aws'],aws:['cloud','aws'],jenkins:['cloud','devops'],linux:['cloud','cybersecurity'],'react native':['react native','mobile'],figma:['design','ui/ux'],'adobe xd':['design','ui/ux'],'user research':['design','ui/ux'],prototyping:['design','ui/ux'],'design systems':['design','ui/ux'],tensorflow:['machine learning','ai','python'],pytorch:['machine learning','ai','python'],mlops:['machine learning','cloud'],'machine learning':['machine learning','ai'],excel:['data science'],'power bi':['data science'],statistics:['data science','python'],'network security':['cybersecurity','security'],siem:['cybersecurity'],'penetration testing':['cybersecurity','security'],postgresql:['backend','web development','laravel'],mongodb:['web development','backend'],'technical writing':['marketing','digital marketing'],seo:['marketing','digital marketing'],'content strategy':['marketing','digital marketing'],wordpress:['web development','marketing'],
    };
    const findCourse = (n) => {
      const kw = courseKw[n.toLowerCase()] || [n.toLowerCase()];
      let best = null, bestS = 0;
      allCourses.forEach(c => {
        const h = `${c.name || ''} ${c.topic || ''} ${c.description || ''}`.toLowerCase();
        let s = 0; kw.forEach(k => { if (h.includes(k)) s++; });
        if (s > bestS) { bestS = s; best = c; }
      });
      return best;
    };
    const cMap = new Map();
    missing.forEach(([sk]) => {
      const c = findCourse(sk);
      if (c) {
        if (!cMap.has(c.id)) cMap.set(c.id, { course: c, skills: [], demand: 0 });
        const e = cMap.get(c.id);
        e.skills.push(sk);
        e.demand += freq[sk];
      }
    });
    const recs = [...cMap.values()].sort((a, b) => b.demand - a.demand).slice(0, 4);
    const maxFreq = missing[0]?.[1] || 1;
    return { missing, recs, maxFreq, freq };
  })();

  /* ═══════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        @keyframes dsh-morph{0%,100%{border-radius:42% 58% 70% 30%/45% 45% 55% 55%}25%{border-radius:50% 50% 30% 70%/55% 35% 65% 45%}50%{border-radius:30% 70% 50% 50%/40% 60% 40% 60%}75%{border-radius:60% 40% 45% 55%/50% 50% 50% 50%}}
        @keyframes dsh-drift1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,-60px) scale(1.1)}66%{transform:translate(-50px,40px) scale(.95)}}
        @keyframes dsh-drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-60px,-80px) scale(1.08)}}
        @keyframes dsh-drift3{0%,100%{transform:translate(0,0)}40%{transform:translate(70px,50px)}80%{transform:translate(-30px,-20px)}}
        @keyframes dsh-fadeUp{from{opacity:0;transform:translateY(50px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes dsh-fadeIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}
        @keyframes dsh-slideR{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none}}
        @keyframes dsh-slideL{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
        @keyframes dsh-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes dsh-rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes dsh-glow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.3)}}
        @keyframes dsh-textShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes dsh-barGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes dsh-countPop{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}
        @keyframes dsh-borderRun{0%{background-position:0% 0%}100%{background-position:200% 0%}}
        @keyframes dsh-dotPulse{0%,100%{box-shadow:0 0 0 0 currentColor}50%{box-shadow:0 0 0 6px transparent}}
        @keyframes dsh-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

        /* reveal transition — starts hidden, becomes visible via class */
        .dsh-reveal{opacity:0;transform:translateY(50px) scale(.96);transition:all 1s cubic-bezier(.16,1,.3,1)}
        .dsh-reveal.visible{opacity:1;transform:none}

        /* stagger children — only animate when parent has .visible */
        .dsh-stagger>*{opacity:0;transform:translateY(30px)}
        .dsh-stagger.visible>*{animation:dsh-fadeUp .8s cubic-bezier(.16,1,.3,1) both}
        .dsh-stagger.visible>*:nth-child(1){animation-delay:.05s}
        .dsh-stagger.visible>*:nth-child(2){animation-delay:.12s}
        .dsh-stagger.visible>*:nth-child(3){animation-delay:.19s}
        .dsh-stagger.visible>*:nth-child(4){animation-delay:.26s}
        .dsh-stagger.visible>*:nth-child(5){animation-delay:.33s}
        .dsh-stagger.visible>*:nth-child(6){animation-delay:.4s}
        .dsh-stagger.visible>*:nth-child(7){animation-delay:.47s}
        .dsh-stagger.visible>*:nth-child(8){animation-delay:.54s}

        .dsh-gradient-text{
          background:linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#8b5cf6,#14b8a6);
          background-size:400% 400%;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;
          animation:dsh-textShift 8s ease infinite;
        }

        .dsh-glass{
          position:relative;
          background:linear-gradient(135deg,rgba(10,26,34,.55),rgba(7,16,21,.65));
          backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);
        }

        .dsh-card-hover{transition:all .5s cubic-bezier(.16,1,.3,1)}
        .dsh-card-hover:hover{transform:translateY(-6px) scale(1.01)}

        .dsh-shine{position:relative;overflow:hidden}
        .dsh-shine::after{
          content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;
          background:linear-gradient(45deg,transparent 40%,rgba(255,255,255,.03) 50%,transparent 60%);
          transform:translateX(-100%);transition:transform .8s ease;
          pointer-events:none;z-index:30;
        }
        .dsh-shine:hover::after{transform:translateX(100%)}

        .dsh-metric-bar{transform-origin:left;animation:dsh-barGrow 1.2s cubic-bezier(.16,1,.3,1) both}

        .dsh-timeline-line{
          position:absolute;left:19px;top:0;bottom:0;width:2px;
          background:linear-gradient(to bottom,#14b8a6,#06b6d4,transparent);
        }
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden">

        {/* ══════ BACKGROUND ══════ */}
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(160deg,#020a10 0%,#04111a 25%,#061820 45%,#040e18 65%,#020810 100%)' }}>
          <div className="absolute opacity-[.09]" style={{ width:600,height:600,top:'-8%',right:'-5%',background:'radial-gradient(circle,#14b8a6,transparent 70%)',animation:'dsh-morph 20s ease-in-out infinite, dsh-drift1 30s ease-in-out infinite' }} />
          <div className="absolute opacity-[.06]" style={{ width:500,height:500,top:'50%',left:'-8%',background:'radial-gradient(circle,#06b6d4,transparent 70%)',animation:'dsh-morph 25s ease-in-out infinite reverse, dsh-drift2 35s ease-in-out infinite' }} />
          <div className="absolute opacity-[.05]" style={{ width:450,height:450,bottom:'5%',right:'25%',background:'radial-gradient(circle,#10b981,transparent 70%)',animation:'dsh-morph 18s ease-in-out infinite, dsh-drift3 28s ease-in-out infinite' }} />
          <div className="absolute opacity-[.04] blur-[100px]" style={{ width:300,height:300,top:'30%',left:'40%',background:'#8b5cf6',animation:'dsh-drift2 40s ease-in-out infinite reverse' }} />
          <div className="absolute w-[800px] h-[800px] rounded-full transition-all duration-[3s] ease-out opacity-[.025]" style={{ background:'radial-gradient(circle,#14b8a6,transparent 60%)',left:mouse.x-400,top:mouse.y-400 }} />
          <div className="absolute inset-0 opacity-[.03]" style={{ backgroundImage:'linear-gradient(rgba(20,184,166,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,.3) 1px,transparent 1px)',backgroundSize:'60px 60px' }} />
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at 50% 50%,transparent 0%,rgba(2,8,16,.7) 100%)' }} />
        </div>

        {/* ══════ CONTENT ══════ */}
        <div className="relative z-10 max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-20">

          {/* ═══ 1 · WELCOME ═══ */}
          <div ref={r1.ref} className={`dsh-reveal ${r1.visible ? 'visible' : ''} mb-14`}>
            <div className="flex items-center gap-3 mb-6" style={{ animation: r1.visible ? 'dsh-slideR .8s cubic-bezier(.16,1,.3,1) .1s both' : 'none' }}>
              <div className="w-2 h-2 rounded-full bg-[#14b8a6]" style={{ animation:'dsh-dotPulse 2s ease-in-out infinite',color:'#14b8a6' }} />
              <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">{currentDate}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#1a3540] to-transparent" />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="relative w-20 h-20 shrink-0" style={{ animation: r1.visible ? 'dsh-fadeIn .8s cubic-bezier(.16,1,.3,1) .2s both' : 'none' }}>
                  <div className="absolute inset-[-12px] rounded-full border border-dashed border-[#14b8a6]/15" style={{ animation:'dsh-rotate 20s linear infinite' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#14b8a6] shadow-lg shadow-[#14b8a6]/40" />
                  </div>
                  <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#14b8a6] via-[#0d9488] to-[#06b6d4] flex items-center justify-center shadow-2xl shadow-[#14b8a6]/20 overflow-hidden">
                    <span className="text-3xl font-black text-white">{user?.name?.[0]?.toUpperCase()}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10b981] border-[3px] border-[#04111a]" style={{ animation:'dsh-pulse 2s ease infinite' }} />
                </div>

                <div style={{ animation: r1.visible ? 'dsh-slideR .8s cubic-bezier(.16,1,.3,1) .3s both' : 'none' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-[#14b8a6]" />
                    <span className="text-sm text-[#2dd4bf] font-medium">{greeting}</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-3">
                    {user?.name?.split(' ')[0]}<span className="dsh-gradient-text">&apos;s</span>
                    <br />
                    <span className="text-gray-400 font-light text-3xl sm:text-4xl">Command Center</span>
                  </h1>
                  <p className="text-gray-500 text-base max-w-md leading-relaxed">Track your career momentum, discover opportunities, and bridge skill gaps.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3" style={{ animation: r1.visible ? 'dsh-slideL .8s cubic-bezier(.16,1,.3,1) .5s both' : 'none' }}>
                {[
                  { label:'Level', value:avgLabel, icon:Activity, color:'#8b5cf6' },
                  { label:'Skills', value:userSkills.length, icon:Layers, color:'#14b8a6' },
                  { label:'Applied', value:stats.applications, icon:Send, color:'#f59e0b' },
                ].map((chip) => (
                  <div key={chip.label} className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#1a3540]/50 bg-[#0a1a22]/40 backdrop-blur-xl hover:border-[#1a3540]/80 transition-all duration-500 hover:-translate-y-1 cursor-default group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor:`${chip.color}15` }}>
                      <chip.icon size={15} style={{ color:chip.color }} className="group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">{chip.label}</div>
                      <div className="text-sm font-bold text-white">{chip.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ 2 · METRICS ═══ */}
          <div ref={r2.ref} className={`dsh-reveal ${r2.visible ? 'visible' : ''} mb-14`}>
            <div className="relative rounded-[28px] overflow-hidden">
              <div className="absolute inset-0 rounded-[28px] p-[1px] pointer-events-none z-20" style={{
                background:'linear-gradient(90deg,#14b8a6,#06b6d4,#8b5cf6,#f59e0b,#14b8a6)',
                backgroundSize:'200% 100%',
                animation:'dsh-borderRun 6s linear infinite',
                WebkitMask:'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
                mask:'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
                WebkitMaskComposite:'xor',
                maskComposite:'exclude',
              }} />
              <div className="dsh-glass rounded-[28px] p-2">
                <div className={`grid grid-cols-2 lg:grid-cols-4 gap-2 dsh-stagger ${r2.visible ? 'visible' : ''}`}>
                  {[
                    { icon:Briefcase, label:'Open Positions', value:stats.jobs, color:'#14b8a6', link:'/jobs', desc:'Available now' },
                    { icon:BookOpen, label:'Learning Paths', value:stats.courses, color:'#06b6d4', link:'/resources', desc:'Courses ready' },
                    { icon:Award, label:'Enrolled', value:stats.enrollments, color:'#10b981', link:'/resources', desc:'In progress' },
                    { icon:Flame, label:'Applications', value:stats.applications, color:'#f59e0b', link:'/jobs', desc:'Submitted' },
                  ].map((m, i) => (
                    <Link key={m.label} to={m.link}>
                      <div
                        className={`group relative rounded-[22px] p-6 sm:p-7 dsh-shine dsh-card-hover cursor-pointer overflow-hidden transition-all duration-500 ${hoveredStat === i ? 'bg-white/[.04]' : 'bg-white/[.01]'}`}
                        onMouseEnter={() => setHoveredStat(i)}
                        onMouseLeave={() => setHoveredStat(null)}
                      >
                        <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-all duration-700 z-10" style={{ background:`linear-gradient(90deg,transparent,${m.color},transparent)` }} />
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-[8deg]" style={{ backgroundColor:`${m.color}12`, boxShadow: hoveredStat === i ? `0 8px 30px ${m.color}20` : 'none' }}>
                            <m.icon size={22} style={{ color:m.color }} />
                          </div>
                          <ArrowUpRight size={16} className="text-gray-700 group-hover:text-gray-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                        </div>
                        <div className="text-4xl sm:text-5xl font-black text-white mb-1 tracking-tighter" style={hoveredStat === i ? { animation:'dsh-countPop .4s ease' } : {}}>
                          {loaded ? <Counter to={m.value} loaded={loaded} /> : <div className="w-14 h-10 rounded-xl bg-[#0F3A42]/50 animate-pulse" />}
                        </div>
                        <div className="text-sm text-gray-400 font-semibold mb-0.5">{m.label}</div>
                        <div className="text-xs text-gray-600">{m.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ 3 · PROFILE & SKILLS ═══ */}
          <div ref={r3.ref} className={`dsh-reveal ${r3.visible ? 'visible' : ''} mb-14`}>
            <div className="grid lg:grid-cols-12 gap-5">

              {/* Profile Panel (7 cols) */}
              <div className="lg:col-span-7 relative rounded-[28px] overflow-hidden dsh-card-hover dsh-shine">
                <div className="absolute inset-0 rounded-[28px] border border-[#1a3540]/30 pointer-events-none z-10" />
                <div className="dsh-glass rounded-[28px] p-7 sm:p-8 h-full">
                  <div className="flex items-center gap-2.5 mb-7">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14b8a6]/8 border border-[#14b8a6]/15">
                      <Radio size={10} className="text-[#14b8a6]" style={{ animation:'dsh-pulse 2s ease infinite' }} />
                      <span className="text-[10px] text-[#14b8a6] font-bold uppercase tracking-[.15em]">Profile</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-xl shadow-[#14b8a6]/15 shrink-0">
                      <span className="text-xl font-black text-white">{user?.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white tracking-tight">{user?.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="group/e flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-[#14b8a6] border border-[#14b8a6]/20 hover:bg-[#14b8a6]/8 hover:border-[#14b8a6]/40 transition-all duration-300">
                      Edit
                      <ArrowRight size={13} className="transition-transform duration-300 group-hover/e:translate-x-1" />
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-gray-500 uppercase tracking-[.15em] font-semibold">Skill Proficiency Map</span>
                      <span className="text-xs text-gray-600">{userSkills.length} total</span>
                    </div>
                    {userSkills.length > 0 ? (
                      <div className="space-y-3">
                        {userSkills.slice(0, 6).map((s, i) => {
                          const pct = ((proficiencyRank[s.proficiency] || 1) / 4) * 100;
                          const barColor = s.proficiency === 'Professional' ? '#10b981' : s.proficiency === 'Expert' ? '#14b8a6' : s.proficiency === 'Intermediate' ? '#06b6d4' : '#64748b';
                          return (
                            <div key={s.id} className="group/bar flex items-center gap-4 hover:bg-white/[.02] -mx-3 px-3 py-2 rounded-xl transition-all duration-300">
                              <span className="text-sm text-gray-300 font-medium w-28 truncate group-hover/bar:text-white transition-colors">{s.skill_name}</span>
                              <div className="flex-1 h-2 bg-[#0d2630] rounded-full overflow-hidden">
                                <div className="h-full rounded-full dsh-metric-bar" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${barColor},${barColor}88)`, boxShadow:`0 0 12px ${barColor}30`, animationDelay:`${i * 0.1}s` }} />
                              </div>
                              <span className="text-[11px] font-mono text-gray-500 w-20 text-right">{s.proficiency}</span>
                            </div>
                          );
                        })}
                        {userSkills.length > 6 && (
                          <Link to="/profile" className="inline-flex items-center gap-1.5 text-xs text-[#2dd4bf] hover:text-[#5eead4] font-medium mt-1 transition-colors">
                            View all {userSkills.length} skills <ChevronRight size={12} />
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-600 text-sm">
                        No skills yet — <Link to="/profile" className="text-[#14b8a6] hover:underline underline-offset-2">add your first skill</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skill Ring (5 cols) */}
              <div className="lg:col-span-5 relative rounded-[28px] overflow-hidden dsh-card-hover">
                <div className="absolute inset-0 rounded-[28px] border border-[#1a3540]/30 pointer-events-none z-10" />
                <div className="dsh-glass rounded-[28px] p-7 sm:p-8 h-full flex flex-col items-center justify-center relative">
                  <div className="absolute w-64 h-64 rounded-full border border-[#14b8a6]/5 pointer-events-none" style={{ animation:'dsh-rotate 40s linear infinite' }} />
                  <div className="absolute w-52 h-52 rounded-full border border-dashed border-[#06b6d4]/5 pointer-events-none" style={{ animation:'dsh-rotate 30s linear infinite reverse' }} />

                  <div className="relative w-44 h-44 mb-7">
                    <svg className="w-full h-full" viewBox="0 0 120 120" style={{ transform:'rotate(-90deg)' }}>
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#0d2630" strokeWidth="6" />
                      <circle cx="60" cy="60" r="44" fill="none" stroke="#0d2630" strokeWidth="3" strokeDasharray="4 8" />
                      <circle cx="60" cy="60" r="52" fill="none" stroke="url(#ringGrad)" strokeWidth="6"
                        strokeDasharray={`${(avgProf / 4) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                        strokeLinecap="round"
                        style={{ filter:'drop-shadow(0 0 10px rgba(20,184,166,.4))', transition:'stroke-dasharray 1.5s cubic-bezier(.16,1,.3,1)' }}
                      />
                      {[0, .25, .5, .75].map((p, i) => {
                        const a = p * 2 * Math.PI - Math.PI / 2;
                        const filled = avgProf / 4 >= p;
                        return <circle key={i} cx={60 + 52 * Math.cos(a)} cy={60 + 52 * Math.sin(a)} r="3" fill={filled ? '#14b8a6' : '#0d2630'} stroke={filled ? '#14b8a6' : '#1a3540'} strokeWidth="1" className="transition-all duration-700" />;
                      })}
                      <defs>
                        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="50%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white tabular-nums">{loaded ? Math.round((avgProf / 4) * 100) : '—'}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-[.2em] font-semibold -mt-0.5">percent</span>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14b8a6]/8 border border-[#14b8a6]/15 mb-2">
                      <CircleDot size={12} className="text-[#14b8a6]" />
                      <span className="text-sm font-bold text-[#2dd4bf]">{avgLabel}</span>
                    </div>
                    <p className="text-xs text-gray-500">{userSkills.length} skills contributing</p>
                  </div>

                  <Link to="/profile" className="group/m inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white text-sm font-bold shadow-xl shadow-[#14b8a6]/15 hover:shadow-[#14b8a6]/30 transition-all duration-500 hover:scale-[1.04] active:scale-[.98]">
                    <TrendingUp size={16} />
                    Manage Skills
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/m:translate-x-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ 4 · RECOMMENDED JOBS ═══ */}
          {user && recommended.length > 0 && (
            <div ref={r4.ref} className={`dsh-reveal ${r4.visible ? 'visible' : ''} mb-14`}>
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#14b8a6]/20 to-[#06b6d4]/10 flex items-center justify-center">
                      <Zap size={18} className="text-[#14b8a6]" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ animation:'dsh-glow 3s ease infinite', boxShadow:'0 0 20px rgba(20,184,166,.15)' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Top Matches</h2>
                    <p className="text-xs text-gray-500 mt-0.5">AI-curated based on your profile</p>
                  </div>
                </div>
                <Link to="/jobs" className="group/l flex items-center gap-2 px-4 py-2 rounded-xl border border-[#1a3540]/40 text-sm text-gray-400 hover:text-white hover:border-[#14b8a6]/30 transition-all duration-300 font-medium">
                  All Jobs <ArrowRight size={13} className="transition-transform duration-300 group-hover/l:translate-x-1" />
                </Link>
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                {/* Featured job (#1) */}
                {(() => {
                  const job = recommended[0];
                  if (!job) return null;
                  const d = job.match;
                  const sc = scColor(d.total);
                  const sl = scLabel(d.total);
                  const skills = Array.isArray(job.skills) ? job.skills : [];
                  const circ = 2 * Math.PI * 40;
                  return (
                    <div className="relative rounded-[28px] overflow-hidden dsh-card-hover dsh-shine group">
                      <div className="absolute inset-0 rounded-[28px] border border-[#1a3540]/30 group-hover:border-[#1a3540]/50 transition-colors duration-500 pointer-events-none z-10" />
                      <div className="absolute top-0 left-0 w-full h-[200px] opacity-[.03] pointer-events-none" style={{ background:`linear-gradient(180deg,${sc},transparent)` }} />
                      <div className="dsh-glass rounded-[28px] p-7 sm:p-8 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor:`${sc}30`, backgroundColor:`${sc}08` }}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor:sc, animation:'dsh-pulse 2s ease infinite' }} />
                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color:sc }}>{sl} Match</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-mono">
                            <Star size={11} className="text-[#f59e0b]" /> Featured
                          </div>
                        </div>

                        <div className="flex items-start gap-5 mb-6">
                          <div className="relative w-20 h-20 shrink-0">
                            <svg className="w-full h-full" viewBox="0 0 90 90" style={{ transform:'rotate(-90deg)' }}>
                              <circle cx="45" cy="45" r="40" fill="none" stroke="#0d2630" strokeWidth="4" />
                              <circle cx="45" cy="45" r="40" fill="none" stroke={sc} strokeWidth="4" strokeDasharray={`${(d.total / 100) * circ} ${circ}`} strokeLinecap="round" style={{ filter:`drop-shadow(0 0 8px ${sc}40)`, transition:'stroke-dasharray 1.2s ease' }} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-xl font-black text-white">{d.total}%</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-[#e2e8f0] transition-colors">{job.title}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1.5"><Building2 size={13} /> {job.company}</span>
                              <span className="flex items-center gap-1.5"><MapPin size={13} /> {job.location}</span>
                              {job.level && <span className="flex items-center gap-1.5"><TrendingUp size={13} /> {job.level}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {skills.slice(0, 6).map((sk, i) => {
                            const m = d.matchedSkills.includes(sk.toLowerCase());
                            return (
                              <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 ${m ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-white/[.02] text-gray-500 border border-[#1a3540]/40'}`}>
                                {m && <CheckCircle size={10} />}{sk}
                              </span>
                            );
                          })}
                          {skills.length > 6 && <span className="text-xs text-gray-600 self-center">+{skills.length - 6}</span>}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-7">
                          {[
                            { l:'Skills', v:d.skills, mx:60, c:'#14b8a6' },
                            { l:'Experience', v:d.experience, mx:20, c:'#06b6d4' },
                            { l:'Track Fit', v:d.track, mx:20, c:'#8b5cf6' },
                          ].map(b => (
                            <div key={b.l} className="text-center">
                              <div className="h-2 bg-[#0d2630] rounded-full overflow-hidden mb-2">
                                <div className="h-full rounded-full transition-all duration-1000" style={{ width:`${(b.v / b.mx) * 100}%`, background:b.c, boxShadow:`0 0 8px ${b.c}30` }} />
                              </div>
                              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{b.l}</span>
                              <span className="block text-xs font-mono text-gray-400">{b.v}/{b.mx}</span>
                            </div>
                          ))}
                        </div>

                        <Link to="/jobs" className="mt-auto">
                          <button className="group/btn w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-[#14b8a6] via-[#0d9488] to-[#06b6d4] text-white font-bold text-sm transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(20,184,166,.4)] hover:scale-[1.02] active:scale-[.98] relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                            <Send size={15} className="relative z-10" />
                            <span className="relative z-10">Apply Now</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })()}

                {/* Stacked jobs (#2, #3) */}
                <div className="flex flex-col gap-5">
                  {recommended.slice(1).map((job, idx) => {
                    const d = job.match;
                    const sc = scColor(d.total);
                    const sl = scLabel(d.total);
                    const skills = Array.isArray(job.skills) ? job.skills : [];
                    const isExpanded = expandedJob === job.id;
                    return (
                      <div
                        key={job.id}
                        className="relative rounded-[24px] overflow-hidden dsh-card-hover dsh-shine group cursor-pointer"
                        onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                      >
                        <div className="absolute inset-0 rounded-[24px] border border-[#1a3540]/30 group-hover:border-[#1a3540]/50 transition-colors duration-500 pointer-events-none z-10" />
                        <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-500 group-hover:top-3 group-hover:bottom-3 z-10" style={{ backgroundColor:sc }} />

                        <div className="dsh-glass rounded-[24px] p-6 pl-7">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-110" style={{ backgroundColor:`${sc}08`, borderColor:`${sc}20` }}>
                              <span className="text-lg font-black" style={{ color:sc }}>{d.total}%</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-white mb-0.5 group-hover:text-[#e2e8f0] transition-colors">{job.title}</h3>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Building2 size={11} />{job.company}</span>
                                <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider" style={{ color:sc, backgroundColor:`${sc}10` }}>{sl}</span>
                              <ChevronRight size={16} className={`text-gray-600 transition-all duration-300 ${isExpanded ? 'rotate-90 text-gray-400' : ''}`} />
                            </div>
                          </div>

                          <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${isExpanded ? 'max-h-[400px] opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'}`}>
                            <div className="pt-5 border-t border-[#1a3540]/30">
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {skills.slice(0, 5).map((sk, i) => {
                                  const m = d.matchedSkills.includes(sk.toLowerCase());
                                  return (
                                    <span key={i} className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border ${m ? 'bg-emerald-500/8 text-emerald-300 border-emerald-500/20' : 'bg-white/[.02] text-gray-500 border-[#1a3540]/40'}`}>
                                      {m && '✓ '}{sk}
                                    </span>
                                  );
                                })}
                              </div>
                              <div className="space-y-2 mb-4">
                                {[{ l:'Skills', v:d.skills, mx:60 }, { l:'Exp', v:d.experience, mx:20 }, { l:'Track', v:d.track, mx:20 }].map(b => (
                                  <div key={b.l} className="flex items-center gap-3">
                                    <span className="text-[11px] text-gray-500 w-10 font-medium">{b.l}</span>
                                    <div className="flex-1 h-1.5 bg-[#0d2630] rounded-full overflow-hidden">
                                      <div className="h-full rounded-full" style={{ width:`${(b.v / b.mx) * 100}%`, background:sc, transition:'width .8s ease' }} />
                                    </div>
                                    <span className="text-[10px] text-gray-600 w-9 text-right font-mono">{b.v}/{b.mx}</span>
                                  </div>
                                ))}
                              </div>
                              <Link to="/jobs" onClick={(e) => e.stopPropagation()}>
                                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white text-sm font-bold hover:shadow-lg hover:shadow-[#14b8a6]/20 transition-all duration-300 hover:scale-[1.02] active:scale-[.98] flex items-center justify-center gap-2">
                                  <Send size={13} /> Apply Now
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══ 5 · APPLICATIONS TIMELINE ═══ */}
          {user && appliedJobs.length > 0 && (
            <div ref={r5.ref} className={`dsh-reveal ${r5.visible ? 'visible' : ''} mb-14`}>
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#f59e0b]/10 flex items-center justify-center">
                    <FileText size={18} className="text-[#f59e0b]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Application Tracker</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{appliedJobs.length} active application{appliedJobs.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <Link to="/jobs" className="group/l flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">
                  Browse <ArrowRight size={13} className="transition-transform duration-300 group-hover/l:translate-x-1" />
                </Link>
              </div>

              <div className={`relative pl-10 space-y-0 dsh-stagger ${r5.visible ? 'visible' : ''}`}>
                <div className="dsh-timeline-line" />
                {appliedJobs.map((app, i) => {
                  const job = app.job;
                  if (!job) return null;
                  const statusMap = {
                    Pending:    { color:'#f59e0b', icon:Clock,         bg:'bg-amber-500/6'   },
                    Reviewed:   { color:'#3b82f6', icon:Eye,           bg:'bg-blue-500/6'    },
                    Shortlisted:{ color:'#a855f7', icon:Star,          bg:'bg-purple-500/6'  },
                    Accepted:   { color:'#10b981', icon:CheckCircle,   bg:'bg-emerald-500/6' },
                    Rejected:   { color:'#ef4444', icon:AlertTriangle, bg:'bg-red-500/6'     },
                  };
                  const st = statusMap[app.status] || statusMap.Pending;
                  const StIcon = st.icon;

                  return (
                    <div key={app.id} className="relative pb-6 last:pb-0">
                      <div className="absolute -left-10 top-5 w-10 flex justify-center">
                        <div className="w-4 h-4 rounded-full border-[3px] border-[#04111a] z-10" style={{ backgroundColor:st.color, animation: i === 0 ? 'dsh-pulse 2s ease infinite' : 'none' }} />
                      </div>
                      <div className={`rounded-[22px] overflow-hidden dsh-card-hover dsh-shine ${st.bg}`}>
                        <div className="dsh-glass rounded-[22px] p-5 sm:p-6 border border-[#1a3540]/20 hover:border-[#1a3540]/40 transition-all duration-500">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor:`${st.color}12` }}>
                                <Briefcase size={18} style={{ color:st.color }} />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-[15px] font-bold text-white truncate">{job.title}</h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center gap-1"><Building2 size={11} />{job.company}</span>
                                  <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                                  <span className="flex items-center gap-1 text-gray-600"><Clock size={11} />{new Date(app.applied_at || app.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border shrink-0 transition-all duration-300 hover:scale-105" style={{ backgroundColor:`${st.color}08`, borderColor:`${st.color}20` }}>
                              <StIcon size={13} style={{ color:st.color }} />
                              <span className="text-xs font-bold" style={{ color:st.color }}>{app.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ 6 · SKILL GAP ANALYSIS ═══ */}
          {skillGapData && (
            <div ref={r6.ref} className={`dsh-reveal ${r6.visible ? 'visible' : ''} mb-14`}>
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <Lightbulb size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Skill Gap Analysis</h2>
                    <p className="text-xs text-gray-500 mt-0.5">In-demand skills &amp; learning paths</p>
                  </div>
                </div>
                <Link to="/resources" className="group/l flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">
                  Courses <ArrowRight size={13} className="transition-transform duration-300 group-hover/l:translate-x-1" />
                </Link>
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                {/* Bar chart */}
                <div className="relative rounded-[28px] overflow-hidden">
                  <div className="absolute inset-0 rounded-[28px] border border-[#1a3540]/30 pointer-events-none z-10" />
                  <div className="dsh-glass rounded-[28px] p-7">
                    <div className="flex items-center gap-2 mb-6">
                      <AlertTriangle size={14} className="text-amber-400" />
                      <h3 className="text-sm font-bold text-white">Missing Skills Demand</h3>
                    </div>
                    <div className={`space-y-3 dsh-stagger ${r6.visible ? 'visible' : ''}`}>
                      {skillGapData.missing.map(([skill, count], i) => (
                        <div key={skill} className="group/sk flex items-center gap-4 hover:bg-white/[.02] -mx-2 px-2 py-1.5 rounded-xl transition-all duration-300 cursor-default">
                          <span className="text-sm text-amber-300/80 font-medium w-32 truncate group-hover/sk:text-amber-300 transition-colors">{skill}</span>
                          <div className="flex-1 h-3 bg-[#0d2630] rounded-full overflow-hidden">
                            <div className="h-full rounded-full dsh-metric-bar" style={{
                              width:`${(count / skillGapData.maxFreq) * 100}%`,
                              background:'linear-gradient(90deg, #f59e0b, #f59e0b88)',
                              boxShadow:'0 0 10px rgba(245,158,11,.2)',
                              animationDelay:`${i * 0.08}s`,
                            }} />
                          </div>
                          <span className="text-[11px] font-mono text-gray-500 w-12 text-right">{count} job{count !== 1 ? 's' : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Course recommendations */}
                <div className={`space-y-4 dsh-stagger ${r6.visible ? 'visible' : ''}`}>
                  {skillGapData.recs.map(({ course, skills, demand }) => (
                    <div key={course.id} className="relative rounded-[22px] overflow-hidden dsh-card-hover dsh-shine group">
                      <div className="absolute inset-0 rounded-[22px] border border-[#1a3540]/30 group-hover:border-[#14b8a6]/20 transition-colors duration-500 pointer-events-none z-10" />
                      <div className="dsh-glass rounded-[22px] p-5 sm:p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#14b8a6]/20 to-[#06b6d4]/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <GraduationCap size={18} className="text-[#14b8a6]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[#2dd4bf] transition-colors">{course.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                              <span>{course.topic}</span>
                              {course.duration && (
                                <>
                                  <span className="text-gray-700">·</span>
                                  <span className="flex items-center gap-1"><Clock size={10} />{course.duration}</span>
                                </>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {skills.map(sk => (
                                <span key={sk} className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/15">+ {sk}</span>
                              ))}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-[#0d2630] rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-[#14b8a6] to-[#06b6d4]" style={{ width:`${Math.min((demand / allJobs.length) * 100, 100)}%`, transition:'width 1s ease', boxShadow:'0 0 8px rgba(20,184,166,.3)' }} />
                              </div>
                              <span className="text-[11px] text-gray-500 whitespace-nowrap">Unlocks {demand} job{demand !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <Link to="/resources" onClick={e => e.stopPropagation()} className="shrink-0 w-9 h-9 rounded-xl bg-white/[.03] border border-[#1a3540]/40 flex items-center justify-center hover:bg-[#14b8a6]/10 hover:border-[#14b8a6]/30 transition-all duration-300 group-hover:scale-110">
                            <ArrowUpRight size={14} className="text-gray-500 group-hover:text-[#14b8a6] transition-colors" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ 7 · QUICK ACTIONS ═══ */}
          <div ref={r7.ref} className={`dsh-reveal ${r7.visible ? 'visible' : ''}`}>
            <div className="flex items-center gap-4 mb-7">
              <div className="w-10 h-10 rounded-2xl bg-[#06b6d4]/10 flex items-center justify-center">
                <Zap size={18} className="text-[#06b6d4]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Quick Actions</h2>
                <p className="text-xs text-gray-500 mt-0.5">Jump to common tasks</p>
              </div>
            </div>

            <div className={`flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x snap-mandatory dsh-stagger ${r7.visible ? 'visible' : ''}`} style={{ scrollbarWidth:'none' }}>
              {[
                { icon:Target,        label:'Find Jobs', desc:'AI-powered matching',   link:'/jobs',      color:'#14b8a6', emoji:'🎯' },
                { icon:GraduationCap, label:'Learn',     desc:'Browse courses',        link:'/resources', color:'#06b6d4', emoji:'📚' },
                { icon:Users,         label:'Support',   desc:'Get career help',       link:'/contact',   color:'#10b981', emoji:'💬' },
                { icon:Star,          label:'Profile',   desc:'Update your info',      link:'/profile',   color:'#f59e0b', emoji:'⭐' },
              ].map((a) => (
                <Link key={a.label} to={a.link} className="snap-start shrink-0 w-[220px] sm:w-auto sm:flex-1">
                  <div className="group relative rounded-[22px] overflow-hidden dsh-card-hover dsh-shine h-full">
                    <div className="absolute inset-0 rounded-[22px] border border-[#1a3540]/30 group-hover:border-[#1a3540]/50 transition-colors duration-500 pointer-events-none z-10" />
                    <div className="dsh-glass rounded-[22px] p-6 h-full flex flex-col items-center text-center">
                      <div className="text-3xl mb-3" style={{ animation:'dsh-float 3s ease-in-out infinite' }}>{a.emoji}</div>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor:`${a.color}10` }}>
                        <a.icon size={22} style={{ color:a.color }} />
                      </div>
                      <h3 className="text-white font-bold text-base mb-1">{a.label}</h3>
                      <p className="text-gray-500 text-xs mb-4">{a.desc}</p>
                      <div className="mt-auto w-8 h-8 rounded-full bg-white/[.03] flex items-center justify-center group-hover:bg-white/[.06] transition-all duration-300">
                        <ArrowUpRight size={14} className="text-gray-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="h-10" />
        </div>
      </div>
    </>
  );
}