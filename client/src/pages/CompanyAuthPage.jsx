import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Mail, Lock, UserRound, MapPin, Globe2, Phone, BriefcaseBusiness,
  ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff, UsersRound, CheckCircle2
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

const AuthStyles = () => <style>{`
  @keyframes caUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes caFloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-16px) rotate(2deg)}}
  @keyframes caGlow{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:.45;transform:scale(1.08)}}
  @keyframes caSpin{to{transform:rotate(360deg)}}
  @keyframes caShimmer{0%{left:-120%}100%{left:150%}}
  .ca-up{animation:caUp .65s cubic-bezier(.16,1,.3,1) both}
  .ca-glass{background:linear-gradient(145deg,rgba(10,26,34,.91),rgba(5,13,18,.97));border:1px solid rgba(30,58,66,.45);backdrop-filter:blur(28px)}
  .ca-input{width:100%;background:rgba(3,8,12,.65);border:1px solid rgba(30,58,66,.7);border-radius:14px;padding:.85rem 1rem .85rem 2.8rem;color:#fff;outline:none;transition:.3s}
  .ca-input:focus{border-color:rgba(20,184,166,.55);box-shadow:0 0 0 3px rgba(20,184,166,.07),0 0 30px -18px rgba(20,184,166,.8)}
  .ca-input::placeholder{color:#4b5563}
  .ca-shimmer{position:relative;overflow:hidden}.ca-shimmer:after{content:'';position:absolute;top:0;bottom:0;left:-120%;width:50%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);animation:caShimmer 3.5s ease-in-out infinite}
`}</style>;

function Field({ icon: Icon, label, type = 'text', value, onChange, required, placeholder, children }) {
  return <label className="block">
    <span className="block mb-2 text-[11px] font-bold uppercase tracking-[.14em] text-gray-500">{label}</span>
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"/>
      <input type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} className="ca-input"/>
      {children}
    </div>
  </label>;
}

export default function CompanyAuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const { login, register } = useCompany();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    contact_name: '', company_name: '', email: '', password: '', password_confirmation: '',
    industry: '', location: '', website: '', phone: '', company_size: '', description: '',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister && form.password !== form.password_confirmation) {
      setError('Password confirmation does not match.'); return;
    }
    try {
      setLoading(true);
      if (isRegister) await register(form);
      else await login(form.email, form.password);
      navigate('/company/dashboard');
    } catch (err) {
      const data = err.response?.data;
      const first = data?.errors ? Object.values(data.errors).flat()[0] : null;
      setError(first || data?.message || 'Unable to continue. Please check your details.');
    } finally { setLoading(false); }
  };

  return <div className="min-h-screen bg-[#03070A] text-gray-200 relative overflow-hidden">
    <AuthStyles/>
    <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(rgba(20,184,166,.04) 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
    <div className="absolute -top-24 -left-20 w-[500px] h-[500px] rounded-full bg-[#14b8a6]/[.065] blur-[120px]" style={{animation:'caGlow 8s ease-in-out infinite'}}/>
    <div className="absolute -bottom-24 -right-16 w-[520px] h-[520px] rounded-full bg-[#06b6d4]/[.05] blur-[130px]" style={{animation:'caFloat 10s ease-in-out infinite'}}/>

    <div className="relative z-10 min-h-screen grid lg:grid-cols-[1.05fr_.95fr] items-center max-w-[1250px] mx-auto px-4 sm:px-8 py-10 gap-10">
      <section className="hidden lg:block ca-up">
        <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
          <div className="w-11 h-11 rounded-2xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 flex items-center justify-center"><Building2 className="text-[#2dd4bf]"/></div>
          <div><div className="text-xl font-black text-white">Career<span className="text-[#2dd4bf]">Path</span></div><div className="text-[10px] text-gray-600 uppercase tracking-[.2em]">Company Portal</div></div>
        </Link>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14b8a6]/7 border border-[#14b8a6]/15 text-[#2dd4bf] text-[10px] uppercase tracking-[.18em] font-bold mb-6"><Sparkles size={12}/>Recruit with clarity</div>
        <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.05] max-w-[680px]">Turn every opening into a <span className="bg-gradient-to-r from-[#14b8a6] via-[#06b6d4] to-[#2dd4bf] bg-clip-text text-transparent">focused hiring pipeline.</span></h1>
        <p className="mt-6 max-w-[610px] text-gray-500 leading-relaxed">Publish roles directly to CareerPath, receive the complete candidate application in one workspace, review screening answers and CVs, then move applicants through your hiring stages.</p>
        <div className="grid grid-cols-3 gap-3 mt-9 max-w-[650px]">
          {[
            [BriefcaseBusiness,'Post jobs','Live on the user Jobs page'],
            [UsersRound,'Review applicants','Every submitted field in one place'],
            [ShieldCheck,'Private workspace','Only your company sees your pipeline'],
          ].map(([Icon,t,d],i)=><div key={t} className="ca-glass rounded-2xl p-4 ca-up" style={{animationDelay:`${.15+i*.08}s`}}><Icon size={20} className="text-[#2dd4bf] mb-3"/><div className="text-sm font-bold text-white">{t}</div><div className="text-[11px] text-gray-600 mt-1 leading-relaxed">{d}</div></div>)}
        </div>
      </section>

      <section className="ca-up" style={{animationDelay:'.08s'}}>
        <div className="ca-glass rounded-[26px] overflow-hidden shadow-[0_30px_90px_-50px_rgba(20,184,166,.45)]">
          <div className="h-[3px] bg-gradient-to-r from-[#14b8a6] via-[#06b6d4] to-[#2dd4bf]"/>
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-7">
              <div className="relative w-12 h-12 rounded-2xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 flex items-center justify-center shrink-0"><Building2 size={22} className="text-[#2dd4bf]"/><div className="absolute -inset-2 border border-[#14b8a6]/10 rounded-[20px]" style={{animation:'caSpin 12s linear infinite'}}/></div>
              <div><h2 className="text-2xl font-black text-white">{isRegister ? 'Create company workspace' : 'Company sign in'}</h2><p className="text-sm text-gray-600 mt-1">{isRegister ? 'Set up your hiring portal in a minute.' : 'Access jobs and candidate applications.'}</p></div>
            </div>

            {error && <div className="mb-5 p-3.5 rounded-xl bg-red-500/8 border border-red-500/20 text-sm text-red-300">{error}</div>}

            <form onSubmit={submit} className="space-y-4">
              {isRegister && <div className="grid sm:grid-cols-2 gap-4">
                <Field icon={UserRound} label="Contact person" value={form.contact_name} onChange={e=>set('contact_name',e.target.value)} required placeholder="Hiring manager name"/>
                <Field icon={Building2} label="Company name" value={form.company_name} onChange={e=>set('company_name',e.target.value)} required placeholder="Acme Ltd."/>
              </div>}
              <Field icon={Mail} label="Work email" type="email" value={form.email} onChange={e=>set('email',e.target.value)} required placeholder="hr@company.com"/>
              <Field icon={Lock} label="Password" type={showPassword?'text':'password'} value={form.password} onChange={e=>set('password',e.target.value)} required placeholder="Minimum 6 characters">
                <button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-[#2dd4bf]">{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button>
              </Field>
              {isRegister && <>
                <Field icon={Lock} label="Confirm password" type={showPassword?'text':'password'} value={form.password_confirmation} onChange={e=>set('password_confirmation',e.target.value)} required placeholder="Repeat password"/>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field icon={BriefcaseBusiness} label="Industry" value={form.industry} onChange={e=>set('industry',e.target.value)} placeholder="Software / Fintech"/>
                  <Field icon={MapPin} label="Location" value={form.location} onChange={e=>set('location',e.target.value)} placeholder="Dhaka, Bangladesh"/>
                  <Field icon={Globe2} label="Website" type="url" value={form.website} onChange={e=>set('website',e.target.value)} placeholder="https://company.com"/>
                  <Field icon={Phone} label="Phone" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+880 ..."/>
                </div>
              </>}

              <button disabled={loading} className="ca-shimmer w-full mt-2 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-[#031014] py-3.5 font-black flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? 'Please wait…' : isRegister ? 'Create Company Portal' : 'Open Company Portal'} <ArrowRight size={17}/>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#1e3a42]/35 flex flex-wrap gap-3 justify-between items-center text-sm">
              <Link to="/login" className="text-gray-500 hover:text-white transition">Candidate / Admin login</Link>
              <span className="text-gray-600">{isRegister ? 'Already registered?' : 'New employer?'} <Link to={isRegister?'/company/login':'/company/register'} className="text-[#2dd4bf] font-bold hover:text-white transition">{isRegister?'Sign in':'Create account'}</Link></span>
            </div>
            <div className="mt-5 flex items-center gap-2 text-[11px] text-gray-700"><CheckCircle2 size={13} className="text-[#14b8a6]"/>Jobs you publish use the same CareerPath job and application pipeline candidates already use.</div>
          </div>
        </div>
      </section>
    </div>
  </div>;
}
