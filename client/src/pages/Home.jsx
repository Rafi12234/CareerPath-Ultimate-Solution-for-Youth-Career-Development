import { Link } from 'react-router-dom';
import {
  ArrowRight, Briefcase, BookOpen, Users, TrendingUp, Target,
  Sparkles, ChevronLeft, ChevronRight, Shield, Zap, Award,
  CheckCircle, Star, Play, Globe, Code, Layers, ChevronDown,
  ArrowUpRight, Flame, Crown, Diamond, Clock, Eye, Heart,
  MessageSquare, Rocket, Compass, Lightbulb, BarChart3
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════
   INJECTED STYLES
   ═══════════════════════════════════════ */
const InjectStyles = () => (
  <style>{`
    @keyframes morphBlob1 {
      0%,100%{border-radius:42% 58% 70% 30%/45% 45% 55% 55%;transform:rotate(0) scale(1)}
      25%{border-radius:70% 30% 50% 50%/30% 60% 40% 70%;transform:rotate(90deg) scale(1.05)}
      50%{border-radius:30% 70% 40% 60%/55% 30% 70% 45%;transform:rotate(180deg) scale(.95)}
      75%{border-radius:55% 45% 60% 40%/40% 70% 30% 60%;transform:rotate(270deg) scale(1.02)}
    }
    @keyframes morphBlob2 {
      0%,100%{border-radius:58% 42% 30% 70%/55% 45% 55% 45%;transform:rotate(0)}
      33%{border-radius:40% 60% 60% 40%/60% 30% 70% 40%;transform:rotate(120deg)}
      66%{border-radius:60% 40% 45% 55%/35% 65% 35% 65%;transform:rotate(240deg)}
    }
    @keyframes orbFloat {
      0%{transform:translate(0,0) scale(1)}
      25%{transform:translate(30px,-40px) scale(1.1)}
      50%{transform:translate(-20px,-60px) scale(.92)}
      75%{transform:translate(40px,-20px) scale(1.05)}
      100%{transform:translate(0,0) scale(1)}
    }
    @keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(3deg)}}
    @keyframes floatMed{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(-2deg)}}
    @keyframes floatFast{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideRight{from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes cardEntrance{from{opacity:0;transform:translateY(40px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
    @keyframes borderRotate{from{--angle:0deg}to{--angle:360deg}}
    @keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(20,184,166,.3)}50%{box-shadow:0 0 0 10px rgba(20,184,166,0)}}
    @keyframes cardShine{0%{left:-100%}50%,100%{left:150%}}
    @keyframes rippleEffect{to{transform:scale(2.5);opacity:0}}
    @keyframes scanLine{0%{top:-10%}100%{top:110%}}
    @keyframes statusDot{0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}
    @keyframes marqueeScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes typeReveal{from{clip-path:inset(0 100% 0 0);opacity:0}to{clip-path:inset(0 0 0 0);opacity:1}}
    @keyframes numberRoll{0%{transform:translateY(100%);opacity:0;filter:blur(4px)}60%{filter:blur(0)}100%{transform:translateY(0);opacity:1;filter:blur(0)}}
    @keyframes bounceIn{0%{transform:scale(0);opacity:0}50%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
    @keyframes glowPulseText{0%,100%{text-shadow:0 0 8px rgba(20,184,166,.3)}50%{text-shadow:0 0 25px rgba(20,184,166,.6),0 0 50px rgba(20,184,166,.2)}}
    @keyframes waveMove{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes progressShine{0%{left:-30%}100%{left:130%}}
    @keyframes barGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    @keyframes lineTrace{from{stroke-dashoffset:500}to{stroke-dashoffset:0}}
    @keyframes donutFill{from{stroke-dasharray:0 283}}
    @keyframes particleDrift{0%,100%{transform:translateY(0) translateX(0);opacity:.3}25%{transform:translateY(-30px) translateX(15px);opacity:.7}50%{transform:translateY(-60px) translateX(-8px);opacity:.2}75%{transform:translateY(-30px) translateX(20px);opacity:.5}}
    @keyframes heroImagePan{0%{transform:scale(1.05) translateX(0)}50%{transform:scale(1.1) translateX(-10px)}100%{transform:scale(1.05) translateX(0)}}
    @keyframes textGradientFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes stepLine{from{transform:scaleY(0)}to{transform:scaleY(1)}}
    @keyframes revealUp{from{opacity:0;transform:translateY(30px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes counterFlip{0%{transform:translateY(100%);opacity:0}60%{transform:translateY(-8%)}100%{transform:translateY(0);opacity:1}}
    @keyframes ringPulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.3);opacity:0}}
    @keyframes tagFloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-4px) rotate(1deg)}}
    @keyframes scrollHint{0%,100%{transform:translateY(0);opacity:.6}50%{transform:translateY(8px);opacity:1}}
    @keyframes heroGlow{0%,100%{opacity:.3;filter:blur(60px)}50%{opacity:.6;filter:blur(80px)}}

    @property --angle{syntax:'<angle>';initial-value:0deg;inherits:false}

    .blob-1{animation:morphBlob1 15s ease-in-out infinite}
    .blob-2{animation:morphBlob2 18s ease-in-out infinite}
    .float-slow{animation:floatSlow 6s ease-in-out infinite}
    .float-med{animation:floatMed 4.5s ease-in-out infinite}
    .float-fast{animation:floatFast 3s ease-in-out infinite}

    .slide-up{animation:slideUp .7s cubic-bezier(.16,1,.3,1) both}
    .slide-down{animation:slideDown .6s cubic-bezier(.16,1,.3,1) both}
    .slide-right{animation:slideRight .6s cubic-bezier(.16,1,.3,1) both}
    .slide-left{animation:slideLeft .6s cubic-bezier(.16,1,.3,1) both}
    .scale-in{animation:scaleIn .5s cubic-bezier(.16,1,.3,1) both}
    .fade-in{animation:fadeIn .6s ease both}
    .card-entrance{animation:cardEntrance .6s cubic-bezier(.16,1,.3,1) both}
    .bounce-in{animation:bounceIn .6s cubic-bezier(.34,1.56,.64,1) both}
    .number-roll{animation:numberRoll .9s cubic-bezier(.16,1,.3,1) both}
    .reveal-up{animation:revealUp .7s cubic-bezier(.16,1,.3,1) both}
    .type-reveal{animation:typeReveal .8s cubic-bezier(.77,0,.175,1) both}

    .gradient-text{
      background:linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6);
      background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
      animation:gradientShift 4s ease infinite}
    .glow-text{animation:glowPulseText 3s ease-in-out infinite}

    .glass-card{
      background:linear-gradient(135deg,rgba(10,26,34,.88),rgba(7,16,21,.94));
      backdrop-filter:blur(20px);border:1px solid rgba(30,58,66,.4);
      transition:all .5s cubic-bezier(.16,1,.3,1)}
    .glass-card:hover{border-color:rgba(20,184,166,.3);box-shadow:0 20px 50px -12px rgba(20,184,166,.12),0 0 0 1px rgba(20,184,166,.08)}
    .glass-card-lift:hover{transform:translateY(-6px)}

    .shine-effect{position:relative;overflow:hidden}
    .shine-effect::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent);animation:cardShine 5s ease-in-out infinite}

    .glow-border{position:relative}
    .glow-border::before{content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1px;
      background:conic-gradient(from var(--angle,0deg),transparent 40%,#14b8a6 50%,transparent 60%);
      -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
      -webkit-mask-composite:xor;mask-composite:exclude;animation:borderRotate 4s linear infinite;
      opacity:0;transition:opacity .5s}
    .glow-border:hover::before{opacity:1}

    .ripple-container{position:relative;overflow:hidden}
    .ripple-circle{position:absolute;border-radius:50%;background:rgba(20,184,166,.25);transform:scale(0);animation:rippleEffect .6s ease-out;pointer-events:none}

    .dot-grid{background-image:radial-gradient(rgba(20,184,166,.06) 1px,transparent 1px);background-size:24px 24px}

    .pulse-glow{animation:pulseGlow 2s ease-in-out infinite}
    .status-dot{animation:statusDot 2s ease-in-out infinite}
    .tag-float{animation:tagFloat 3s ease-in-out infinite}

    .marquee-track{display:flex;width:max-content;animation:marqueeScroll 30s linear infinite}
    .marquee-track:hover{animation-play-state:paused}
    .marquee-group{display:flex;gap:2rem;flex-shrink:0;min-width:max-content;padding-right:2rem}

    .scan-line-overlay::after{content:'';position:absolute;left:0;width:100%;height:1px;
      background:linear-gradient(90deg,transparent,rgba(20,184,166,.1),transparent);animation:scanLine 8s linear infinite}

    .progress-shine{position:relative;overflow:hidden}
    .progress-shine::after{content:'';position:absolute;top:0;left:-30%;width:30%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);animation:progressShine 2s ease-in-out infinite}

    .bar-grow{animation:barGrow 1.2s cubic-bezier(.16,1,.3,1) both;transform-origin:left}
    .line-trace{animation:lineTrace 2s ease-out both;stroke-dasharray:500}
    .donut-fill{animation:donutFill 1.5s ease-out both}
    .step-line{animation:stepLine 1s ease-out both;transform-origin:top}

    .hero-glow{animation:heroGlow 6s ease-in-out infinite}
    .hero-image-pan{animation:heroImagePan 20s ease-in-out infinite}
    .scroll-hint{animation:scrollHint 2s ease-in-out infinite}
    .ring-pulse{animation:ringPulse 2s ease-in-out infinite}
    .particle-drift{animation:particleDrift 10s ease-in-out infinite}

    .input-glow{transition:all .3s ease}
    .input-glow:focus{border-color:rgba(20,184,166,.5);box-shadow:0 0 0 3px rgba(20,184,166,.08),0 0 20px rgba(20,184,166,.05)}

    .btn-primary{background:linear-gradient(135deg,#14b8a6,#0d9488);transition:all .3s cubic-bezier(.16,1,.3,1)}
    .btn-primary:hover{background:linear-gradient(135deg,#0d9488,#0f766e);transform:translateY(-2px);box-shadow:0 12px 30px -5px rgba(20,184,166,.35)}
    .btn-primary:active{transform:translateY(0) scale(.98)}

    .feature-card{transition:all .5s cubic-bezier(.16,1,.3,1)}
    .feature-card:hover{transform:translateY(-8px);border-color:rgba(20,184,166,.35);
      box-shadow:0 25px 60px -15px rgba(20,184,166,.15),0 0 0 1px rgba(20,184,166,.1)}
    .feature-card:hover .feature-icon{transform:scale(1.15) rotate(6deg)}
    .feature-card:hover .feature-title{color:#5eead4}
    .feature-card:hover .feature-accent{opacity:1}

    .step-card{transition:all .4s cubic-bezier(.16,1,.3,1)}
    .step-card:hover{transform:translateY(-4px);border-color:rgba(20,184,166,.25)}
    .step-card:hover .step-number{transform:scale(1.1);box-shadow:0 0 20px rgba(20,184,166,.3)}

    .testimonial-card{transition:all .4s cubic-bezier(.16,1,.3,1)}
    .testimonial-card:hover{transform:translateY(-4px);border-color:rgba(20,184,166,.3)}

    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#1e3a42;border-radius:10px}
    ::-webkit-scrollbar-thumb:hover{background:#14b8a6}
  `}</style>
);

/* ═══════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════ */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1, ...opts });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useAnimatedNumber(target, dur = 1200) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current || target == null) return;
    prev.current = target;
    const s = performance.now();
    const tick = (now) => { const p = Math.min((now - s) / dur, 1); setVal(Math.round(target * (1 - Math.pow(1 - p, 4)))); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, [target, dur]);
  return val;
}

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h);
  }, []);
  return pos;
}

/* ═══════════════════════════════════════
   RIPPLE BUTTON
   ═══════════════════════════════════════ */
function RippleButton({ children, className = '', ...props }) {
  const ref = useRef(null);
  const handleClick = (e) => {
    const btn = ref.current, rect = btn.getBoundingClientRect(), d = Math.max(rect.width, rect.height);
    const c = document.createElement('span');
    c.style.width = c.style.height = d + 'px';
    c.style.left = e.clientX - rect.left - d / 2 + 'px';
    c.style.top = e.clientY - rect.top - d / 2 + 'px';
    c.className = 'ripple-circle'; btn.appendChild(c); setTimeout(() => c.remove(), 600);
  };
  return <button ref={ref} onClick={handleClick} className={`ripple-container ${className}`} {...props}>{children}</button>;
}

/* ═══════════════════════════════════════
   SPARKLINE
   ═══════════════════════════════════════ */
function Sparkline({ data, color = '#14b8a6', w = 80, h = 28 }) {
  if (!data || data.length < 2) return null;
  const mx = Math.max(...data), mn = Math.min(...data), rng = mx - mn || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / rng) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs><linearGradient id={`sp-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".25" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sp-${color.slice(1)})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="line-trace" style={{ filter: `drop-shadow(0 0 3px ${color}40)` }} />
    </svg>
  );
}

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */
const heroSlides = [
  { title: 'Discover your path.', highlight: 'Shape your career.', desc: 'Match your skills to relevant jobs and learning resources — build a roadmap that leads to real opportunities.', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop' },
  { title: 'Learn new skills.', highlight: 'Unlock your potential.', desc: 'Access curated courses and resources designed to accelerate your career growth and professional development.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop' },
  { title: 'Find your dream job.', highlight: 'Start today.', desc: 'AI-powered job matching connects you with opportunities that align with your skills, experience, and career goals.', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop' },
];

const stats = [
  { value: 500, suffix: '+', label: 'Job Opportunities', icon: Briefcase, color: '#14b8a6', spark: [12,18,22,19,28,25,32,30,38,42,40,48] },
  { value: 100, suffix: '+', label: 'Learning Courses', icon: BookOpen, color: '#06b6d4', spark: [5,8,6,10,12,9,14,16,13,18,20,22] },
  { value: 1000, suffix: '+', label: 'Active Users', icon: Users, color: '#2dd4bf', spark: [20,35,30,45,50,42,60,55,65,70,68,80] },
  { value: 85, suffix: '%', label: 'Match Accuracy', icon: Target, color: '#10b981', spark: [60,65,68,72,75,78,80,82,83,84,85,85] },
];

const features = [
  { icon: Target, title: 'AI Job Matching', desc: 'Smart algorithm matches your skills and experience to the most relevant opportunities.', gradient: 'from-[#14b8a6] to-[#0d9488]', color: '#14b8a6' },
  { icon: BookOpen, title: 'Curated Courses', desc: 'Top-quality learning resources across technology, business, design, and more.', gradient: 'from-[#06b6d4] to-[#0891b2]', color: '#06b6d4' },
  { icon: TrendingUp, title: 'Career Growth', desc: 'Track your skill development and see how you match with industry requirements.', gradient: 'from-[#10b981] to-[#059669]', color: '#10b981' },
  { icon: Shield, title: 'Skill Assessment', desc: 'Evaluate your competencies and discover areas for improvement with AI tools.', gradient: 'from-[#3b82f6] to-[#2563eb]', color: '#3b82f6' },
  { icon: Zap, title: 'Real-Time Updates', desc: 'Get notified instantly about new jobs and courses that match your profile.', gradient: 'from-[#f59e0b] to-[#d97706]', color: '#f59e0b' },
  { icon: Award, title: 'SDG 8 Aligned', desc: 'Supporting decent work and economic growth for youth career development.', gradient: 'from-[#5eead4] to-[#14b8a6]', color: '#5eead4' },
];

const steps = [
  { number: '01', title: 'Create Profile', desc: 'Sign up and add your skills, education, and career preferences.', icon: Users, color: '#14b8a6' },
  { number: '02', title: 'Get Matched', desc: 'Our AI analyzes your profile and finds the best job and course matches.', icon: Target, color: '#06b6d4' },
  { number: '03', title: 'Learn & Grow', desc: 'Take courses to build missing skills and increase your match scores.', icon: BookOpen, color: '#10b981' },
  { number: '04', title: 'Land Your Job', desc: 'Apply with confidence and track your applications in real-time.', icon: Rocket, color: '#f59e0b' },
];

const testimonials = [
  { name: 'Sarah Ahmed', role: 'Software Engineer', quote: 'CareerPath matched me with my dream job within weeks. The skill assessment was incredibly accurate.', avatar: 'S', color: '#14b8a6' },
  { name: 'Rafiq Hassan', role: 'UI/UX Designer', quote: 'The curated courses helped me bridge skill gaps I didn\'t even know I had. Landed a 40% salary increase!', avatar: 'R', color: '#06b6d4' },
  { name: 'Nusrat Jahan', role: 'Data Analyst', quote: 'From a fresh graduate to a data analyst in 3 months. The AI matching is genuinely game-changing.', avatar: 'N', color: '#8b5cf6' },
];

const marqueeSkills = ['React', 'Python', 'UI/UX Design', 'Data Science', 'Machine Learning', 'Node.js', 'DevOps', 'Cloud Computing', 'Cybersecurity', 'Project Management', 'Digital Marketing', 'TypeScript', 'Flutter', 'Blockchain', 'AI Engineering'];

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const mousePos = useMousePosition();

  const [heroRef, heroVisible] = useInView();
  const [statsRef, statsVisible] = useInView();
  const [featuresRef, featuresVisible] = useInView();
  const [stepsRef, stepsVisible] = useInView();
  const [testimonialsRef, testimonialsVisible] = useInView();
  const [ctaRef, ctaVisible] = useInView();

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <>
      <InjectStyles />

      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #050D11 0%, #0A1A22 40%, #071218 100%)' }}>

        {/* Cursor glow */}
        <div className="fixed pointer-events-none z-50 mix-blend-screen"
          style={{ left: mousePos.x - 200, top: mousePos.y - 200, width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(20,184,166,0.03) 0%, transparent 70%)',
            transition: 'left 0.3s ease-out, top 0.3s ease-out' }} />

        {/* Background layers */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="blob-1 absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#14b8a6]/[.03]" />
          <div className="blob-2 absolute -bottom-[10%] -right-[15%] w-[600px] h-[600px] bg-[#06b6d4]/[.03]" />
          <div className="absolute top-[30%] left-[60%] w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(45,212,191,.025)_0%,transparent_70%)]" style={{ animation: 'orbFloat 20s ease-in-out infinite' }} />
          <div className="dot-grid absolute inset-0 opacity-40" />
        </div>

        {/* ═════════════════════════════════
            HERO SECTION
           ═════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 pb-16">
          {/* Hero glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#14b8a6]/[.06] rounded-full hero-glow pointer-events-none" />

          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Text */}
              <div className="space-y-7" key={currentSlide}>
                {/* Badge */}
                <div className={`${heroVisible ? 'slide-down' : 'opacity-0'}`}>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14b8a6]/[.08] border border-[#14b8a6]/20 rounded-full text-xs text-[#2dd4bf] font-bold uppercase tracking-[.15em]">
                    <Sparkles size={12} className="animate-pulse" /> Aligned with SDG 8
                    <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] status-dot" />
                  </span>
                </div>

                {/* Heading */}
                <div className={`${heroVisible ? 'slide-up' : 'opacity-0'}`} style={{ animationDelay: '.1s' }}>
                  <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-white leading-[1.08] tracking-tight">
                    {slide.title}
                  </h1>
                  <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.08] tracking-tight mt-1 gradient-text glow-text">
                    {slide.highlight}
                  </h1>
                </div>

                {/* Description */}
                <p className={`text-lg text-gray-400 max-w-lg leading-relaxed ${heroVisible ? 'slide-up' : 'opacity-0'}`} style={{ animationDelay: '.2s' }}>
                  {slide.desc}
                </p>

                {/* CTAs */}
                <div className={`flex flex-wrap gap-3 ${heroVisible ? 'slide-up' : 'opacity-0'}`} style={{ animationDelay: '.3s' }}>
                  <Link to="/register"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 btn-primary rounded-full text-white font-bold shadow-lg shadow-[#14b8a6]/25 group">
                    Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/jobs"
                    className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#14b8a6]/25 hover:border-[#14b8a6]/50 rounded-full text-[#2dd4bf] font-semibold transition-all duration-300 hover:bg-[#14b8a6]/5 group">
                    Explore Jobs <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Mini stats */}
                <div className={`flex gap-8 pt-4 ${heroVisible ? 'slide-up' : 'opacity-0'}`} style={{ animationDelay: '.4s' }}>
                  {[{ v: '500+', l: 'Jobs' }, { v: '100+', l: 'Courses' }, { v: '85%', l: 'Match Rate' }].map(s => (
                    <div key={s.l}>
                      <div className="text-2xl font-black gradient-text">{s.v}</div>
                      <div className="text-[10px] text-gray-600 uppercase tracking-[.15em] font-bold mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Image */}
              <div className={`hidden lg:block relative ${heroVisible ? 'slide-left' : 'opacity-0'}`} style={{ animationDelay: '.2s' }}>
                <div className="relative rounded-2xl overflow-hidden border border-[#1e3a42]/40 shadow-2xl shadow-[#14b8a6]/10 group">
                  <div className="overflow-hidden">
                    <img src={slide.image} alt="Career Development" className="w-full h-[460px] object-cover hero-image-pan" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071015]/80 via-transparent to-transparent" />

                  {/* Slide dots */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {heroSlides.map((_, i) => (
                      <button key={i} onClick={() => setCurrentSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-400 cursor-pointer ${i === currentSlide ? 'w-8 bg-[#2dd4bf]' : 'w-1.5 bg-white/25 hover:bg-white/50'}`} />
                    ))}
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-5 -left-5 glass-card shine-effect rounded-xl px-4 py-3 shadow-xl float-slow border border-[#1e3a42]/40 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#14b8a6]/12 rounded-lg flex items-center justify-center"><TrendingUp size={18} className="text-[#2dd4bf]" /></div>
                    <div><div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Career Growth</div><div className="text-sm font-bold text-white">85% Match</div></div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 glass-card shine-effect rounded-xl px-4 py-3 shadow-xl float-med border border-[#1e3a42]/40 z-10" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#06b6d4]/12 rounded-lg flex items-center justify-center"><Award size={18} className="text-[#06b6d4]" /></div>
                    <div><div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Skills Gained</div><div className="text-sm font-bold text-white">12 New</div></div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-6 glass-card shine-effect rounded-xl px-3 py-2 shadow-xl float-fast border border-[#1e3a42]/40 z-10" style={{ animationDelay: '3s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-500/15 rounded-md flex items-center justify-center"><CheckCircle size={12} className="text-emerald-400" /></div>
                    <span className="text-[10px] font-bold text-emerald-400">Job Applied!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide arrows */}
            <button onClick={() => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass-card rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all cursor-pointer hover:scale-110 z-10 border border-[#1e3a42]/30">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrentSlide(p => (p + 1) % heroSlides.length)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass-card rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all cursor-pointer hover:scale-110 z-10 border border-[#1e3a42]/30">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-hint">
            <span className="text-[9px] text-gray-600 uppercase tracking-[.2em] font-bold">Scroll</span>
            <ChevronDown size={16} className="text-[#14b8a6]" />
          </div>
        </section>

        {/* ═════════════════════════════════
            SKILLS MARQUEE
           ═════════════════════════════════ */}
        <div className="relative py-4 border-y border-[#1e3a42]/15 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050D11] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050D11] to-transparent z-10" />
          <div className="marquee-track">
            {[0, 1].map(g => (
              <div key={g} className="marquee-group" aria-hidden={g === 1}>
                {marqueeSkills.map((skill, i) => (
                  <span key={`${g}-${i}`} className="shrink-0 px-4 py-1.5 border border-[#1e3a42]/30 rounded-full text-xs font-semibold text-gray-500 hover:text-[#2dd4bf] hover:border-[#14b8a6]/30 transition-all cursor-default whitespace-nowrap tag-float" style={{ animationDelay: `${i * .2}s` }}>
                    {skill}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════
            STATS SECTION
           ═════════════════════════════════ */}
        <section ref={statsRef} className="relative py-20">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => {
                const animVal = useAnimatedNumber(statsVisible ? stat.value : 0);
                return (
                  <div key={stat.label} className={`glass-card glow-border shine-effect rounded-2xl p-5 group cursor-default glass-card-lift relative overflow-hidden ${statsVisible ? 'card-entrance' : 'opacity-0'}`}
                    style={{ animationDelay: `${i * .1}s` }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: stat.color }} />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ background: `${stat.color}18` }}>
                          <stat.icon size={18} style={{ color: stat.color }} />
                        </div>
                        <Sparkline data={stat.spark} color={stat.color} />
                      </div>
                      <div className="text-3xl font-black text-white tabular-nums">{animVal.toLocaleString()}{stat.suffix}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-[.15em] font-bold mt-1">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════
            FEATURES SECTION
           ═════════════════════════════════ */}
        <section ref={featuresRef} className="relative py-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0F3A42]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
            {/* Header */}
            <div className={`text-center mb-16 ${featuresVisible ? 'slide-up' : 'opacity-0'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14b8a6]/[.08] border border-[#14b8a6]/20 rounded-full text-xs text-[#2dd4bf] font-bold uppercase tracking-[.15em] mb-5">
                <Zap size={12} /> Powerful Features
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
                Everything for your <span className="gradient-text">career journey</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                From skill assessment to job matching — all the tools to accelerate your growth.
              </p>
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div key={f.title} className={`feature-card glass-card glow-border shine-effect rounded-2xl p-6 relative overflow-hidden cursor-default group ${featuresVisible ? 'card-entrance' : 'opacity-0'}`}
                  style={{ animationDelay: `${i * .08}s` }}>
                  {/* Accent line */}
                  <div className="feature-accent absolute top-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
                  {/* Corner glow */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-[.06] transition-opacity duration-700" style={{ background: `radial-gradient(circle,${f.color},transparent)` }} />

                  <div className={`feature-icon w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg transition-all duration-500`}
                    style={{ boxShadow: `0 8px 24px ${f.color}20` }}>
                    <f.icon size={22} className="text-white" />
                  </div>
                  <h3 className="feature-title text-lg font-bold text-white mb-2 transition-colors duration-300">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════
            HOW IT WORKS
           ═════════════════════════════════ */}
        <section ref={stepsRef} className="relative py-24">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className={`text-center mb-16 ${stepsVisible ? 'slide-up' : 'opacity-0'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14b8a6]/[.08] border border-[#14b8a6]/20 rounded-full text-xs text-[#2dd4bf] font-bold uppercase tracking-[.15em] mb-5">
                <Compass size={12} /> How It Works
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
                Four simple <span className="gradient-text">steps</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">Your career transformation starts here — follow the path.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#14b8a6]/20 via-[#06b6d4]/20 to-[#f59e0b]/20" />

              {steps.map((step, i) => (
                <div key={step.number} className={`step-card glass-card rounded-2xl p-6 text-center relative cursor-default border border-[#1e3a42]/40 group ${stepsVisible ? 'card-entrance' : 'opacity-0'}`}
                  style={{ animationDelay: `${i * .12}s` }}>
                  <div className="step-number w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl font-black text-white transition-all duration-500 shadow-lg relative z-10"
                    style={{ background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`, boxShadow: `0 4px 15px ${step.color}15` }}>
                    {step.number}
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-2xl ring-pulse" style={{ border: `2px solid ${step.color}30` }} />
                  </div>
                  <div className="w-8 h-8 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: `${step.color}12` }}>
                    <step.icon size={16} style={{ color: step.color }} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════
            TESTIMONIALS
           ═════════════════════════════════ */}
        <section ref={testimonialsRef} className="relative py-24">
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-[#14b8a6]/[.03] rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className={`text-center mb-16 ${testimonialsVisible ? 'slide-up' : 'opacity-0'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14b8a6]/[.08] border border-[#14b8a6]/20 rounded-full text-xs text-[#2dd4bf] font-bold uppercase tracking-[.15em] mb-5">
                <Heart size={12} /> Success Stories
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
                Loved by <span className="gradient-text">professionals</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <div key={t.name} className={`testimonial-card glass-card shine-effect rounded-2xl p-6 relative overflow-hidden border border-[#1e3a42]/40 ${testimonialsVisible ? 'card-entrance' : 'opacity-0'}`}
                  style={{ animationDelay: `${i * .1}s` }}>
                  {/* Quote */}
                  <div className="absolute top-4 right-4 text-4xl font-black opacity-[.05] text-[#14b8a6]">"</div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5 relative z-10">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${t.color}40, ${t.color}20)` }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{t.role}</div>
                    </div>
                  </div>
                  {/* Stars */}
                  <div className="flex gap-0.5 mt-4">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════
            CTA SECTION
           ═════════════════════════════════ */}
        <section ref={ctaRef} className="relative py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1A22]/50 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-[#14b8a6]/[.06] rounded-full blur-[100px] pointer-events-none" />

          <div className={`relative max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-center ${ctaVisible ? 'slide-up' : 'opacity-0'}`}>
            {/* Floating decorations */}
            <div className="absolute -top-8 left-1/4 float-slow opacity-30"><div className="w-3 h-3 rounded-full bg-[#14b8a6]/40 blur-[2px]" /></div>
            <div className="absolute -top-4 right-1/4 float-med opacity-20"><div className="w-2 h-2 rounded-full bg-[#06b6d4]/60" /></div>
            <div className="absolute top-10 left-[15%] float-fast opacity-15"><div className="w-4 h-4 rounded bg-[#2dd4bf]/20 rotate-45" /></div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14b8a6]/[.08] border border-[#14b8a6]/20 rounded-full text-xs text-[#2dd4bf] font-bold uppercase tracking-[.15em] mb-6">
              <Rocket size={12} /> Start Now
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              Ready to start your <span className="gradient-text glow-text">career journey</span>?
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of students and graduates building their careers with CareerPath.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 btn-primary rounded-full text-white font-bold text-lg shadow-lg shadow-[#14b8a6]/25 group">
                Get Started Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 border border-[#1e3a42]/40 hover:border-[#14b8a6]/30 rounded-full text-gray-400 hover:text-[#2dd4bf] font-semibold transition-all duration-300 hover:bg-[#14b8a6]/5 text-lg">
                Browse Courses
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
              {[
                { icon: Shield, text: 'Secure Platform' },
                { icon: Zap, text: 'AI-Powered' },
                { icon: Globe, text: 'SDG 8 Aligned' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 text-xs text-gray-600">
                  <b.icon size={13} className="text-[#14b8a6]" />
                  <span className="font-semibold">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#14b8a6]/20 to-transparent" />
      </div>
    </>
  );
}