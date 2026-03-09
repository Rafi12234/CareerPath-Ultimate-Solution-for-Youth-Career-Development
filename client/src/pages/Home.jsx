import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, BookOpen, Users, TrendingUp, Target, Sparkles, ChevronLeft, ChevronRight, Shield, Zap, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

const heroSlides = [
  {
    title: 'Discover your path.',
    highlight: 'Shape your career.',
    desc: 'Match your skills to relevant jobs and learning resources â€” build a roadmap that leads to real opportunities.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
  },
  {
    title: 'Learn new skills.',
    highlight: 'Unlock your potential.',
    desc: 'Access curated courses and resources designed to accelerate your career growth and professional development.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
  },
  {
    title: 'Find your dream job.',
    highlight: 'Start today.',
    desc: 'AI-powered job matching connects you with opportunities that align with your skills, experience, and career goals.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
  },
];

const stats = [
  { value: '500+', label: 'Job Opportunities', icon: Briefcase },
  { value: '100+', label: 'Learning Resources', icon: BookOpen },
  { value: '1000+', label: 'Active Users', icon: Users },
];

const features = [
  {
    icon: Target,
    title: 'AI Job Matching',
    desc: 'Our smart algorithm matches your skills and experience to the most relevant job opportunities.',
    gradient: 'from-[#14b8a6] to-[#0d9488]',
    glow: '#14b8a6',
  },
  {
    icon: BookOpen,
    title: 'Curated Courses',
    desc: 'Access top-quality learning resources across technology, business, design, and more.',
    gradient: 'from-[#06b6d4] to-[#0891b2]',
    glow: '#06b6d4',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    desc: 'Track your skill development and see how you match with industry requirements.',
    gradient: 'from-[#10b981] to-[#059669]',
    glow: '#10b981',
  },
  {
    icon: Shield,
    title: 'Skill Assessment',
    desc: 'Evaluate your competencies and discover areas for improvement with our AI tools.',
    gradient: 'from-[#3b82f6] to-[#2563eb]',
    glow: '#3b82f6',
  },
  {
    icon: Zap,
    title: 'Real-Time Updates',
    desc: 'Get notified instantly about new jobs and courses that match your profile.',
    gradient: 'from-[#f59e0b] to-[#d97706]',
    glow: '#f59e0b',
  },
  {
    icon: Award,
    title: 'SDG 8 Aligned',
    desc: 'Supporting decent work and economic growth for youth career development.',
    gradient: 'from-[#5eead4] to-[#14b8a6]',
    glow: '#5eead4',
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideDirection('right');
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (dir) => {
    setSlideDirection(dir);
    setCurrentSlide((prev) =>
      dir === 'right'
        ? (prev + 1) % heroSlides.length
        : (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="hero-cinematic min-h-screen flex items-center">
        {/* Ambient haze orbs (Layer 3) */}
        <div className="hero-haze">
          <div className="haze-orb haze-orb--center" />
          <div className="haze-orb haze-orb--right" />
          <div className="haze-orb haze-orb--left" />
        </div>

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-8" key={currentSlide}>
              <div className="animate-fade-in-up">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-full text-sm text-[#2dd4bf] font-medium">
                  <Sparkles size={14} />
                  Aligned with SDG 8
                </span>
              </div>

              <div className="animate-fade-in-up delay-100" style={{ animationFillMode: 'both' }}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight">
                  {slide.title}
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight mt-1 gradient-text">
                  {slide.highlight}
                </h1>
              </div>

              <p className="text-lg text-gray-400 max-w-lg leading-relaxed animate-fade-in-up delay-200" style={{ animationFillMode: 'both' }}>
                {slide.desc}
              </p>

              <div className="flex flex-wrap gap-3 animate-fade-in-up delay-300" style={{ animationFillMode: 'both' }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-linear-to-r from-[#14b8a6] to-[#0d9488] rounded-full text-white font-semibold transition-all duration-300 shadow-lg shadow-[#14b8a6]/25 hover:shadow-[#14b8a6]/40 hover:scale-[1.03] active:scale-[0.98]"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#14b8a6]/30 hover:border-[#14b8a6]/60 rounded-full text-[#2dd4bf] font-semibold transition-all duration-300 hover:bg-[#14b8a6]/5"
                >
                  Explore Jobs
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 sm:gap-12 pt-6 animate-fade-in-up delay-400" style={{ animationFillMode: 'both' }}>
                {stats.map((s, i) => (
                  <div key={s.label} className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-extrabold gradient-text">{s.value}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:block relative animate-fade-in delay-200" style={{ animationFillMode: 'both' }}>
              <div className="relative rounded-2xl overflow-hidden border border-[#1e3a42]/50 shadow-2xl shadow-[#14b8a6]/10">
                <img
                  src={slide.image}
                  alt="Career Development"
                  className="w-full h-[460px] object-cover transition-all duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#071015]/70 via-transparent to-transparent" />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 glass rounded-xl px-4 py-3 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#14b8a6]/15 rounded-lg flex items-center justify-center">
                    <TrendingUp size={18} className="text-[#2dd4bf]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500">Career Growth</div>
                    <div className="text-sm font-bold text-white">85% Match</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-5 glass rounded-xl px-4 py-3 shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#06b6d4]/15 rounded-lg flex items-center justify-center">
                    <Award size={18} className="text-[#06b6d4]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500">Skills Gained</div>
                    <div className="text-sm font-bold text-white">12 New</div>
                  </div>
                </div>
              </div>

              {/* Slide dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setSlideDirection(i > currentSlide ? 'right' : 'left'); setCurrentSlide(i); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? 'w-8 bg-[#2dd4bf]' : 'w-1.5 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slide nav arrows */}
        <button
          onClick={() => goToSlide('left')}
          className="absolute z-10 left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => goToSlide('right')}
          className="absolute z-10 right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Features Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-linear-to-b from-[#03070A] via-[#071015]/80 to-[#03070A]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0F3A42]/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 sm:mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-full text-sm text-[#2dd4bf] font-medium mb-6">
              <Sparkles size={14} />
              Powerful Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
              Everything you need for your{' '}
              <span className="gradient-text">career journey</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              From skill assessment to job matching, we provide all the tools to accelerate your professional growth.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative bg-[#0A1A22]/80 border border-[#1e3a42]/60 rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:border-[#14b8a6]/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#14b8a6]/5"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  style={{ boxShadow: `0 8px 24px ${f.glow}20` }}
                >
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-linear-to-b from-[#03070A] to-[#071015]/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0F3A42]/20 rounded-full blur-[120px]" />

        <div className="relative max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to start your <span className="gradient-text">career journey</span>?
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of students and graduates who are already building their careers with CareerPath.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-linear-to-r from-[#14b8a6] to-[#06b6d4] rounded-full text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-[#14b8a6]/25 hover:shadow-[#14b8a6]/40 hover:scale-[1.03] active:scale-[0.98]"
          >
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
