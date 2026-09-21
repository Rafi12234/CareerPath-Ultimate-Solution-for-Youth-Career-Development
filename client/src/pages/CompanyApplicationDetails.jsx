import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, UserRound, Mail, Phone, MapPin, CalendarDays, Globe2, FileText,
  BriefcaseBusiness, GraduationCap, Sparkles, ShieldCheck, UsersRound, ExternalLink,
  Save, Linkedin, Github, Link as LinkIcon, ListChecks, StickyNote, CheckCircle2
} from 'lucide-react';
import api from '../utils/api';
import { CompanyPortalLayout, PortalCard, StatusPill } from '../components/company/CompanyPortalLayout';

const show = (v) => (v === null || v === undefined || v === '' ? '—' : String(v));
const yesNo = (v) => (v === true ? 'Yes' : v === false ? 'No' : '—');

function Section({ icon: Icon, title, subtitle, children }) {
  return <PortalCard className="p-5 sm:p-6 cp-fade-up"><div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-[#14b8a6]/8 border border-[#14b8a6]/15 flex items-center justify-center"><Icon size={18} className="text-[#2dd4bf]"/></div><div><h2 className="text-base font-black text-white">{title}</h2>{subtitle&&<p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>}</div></div>{children}</PortalCard>;
}
function KV({ label, value }) { return <div><div className="text-[9px] uppercase tracking-[.14em] text-gray-700 font-bold mb-1">{label}</div><div className="text-sm text-gray-300 break-words">{show(value)}</div></div>; }

export default function CompanyApplicationDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [app,setApp]=useState(null); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState('');
  const [status,setStatus]=useState('Pending'); const [notes,setNotes]=useState('');

  const load=async()=>{try{setLoading(true);setError('');const r=await api.get(`/company/applications/${applicationId}`,{skipCache:true});setApp(r.data);setStatus(r.data.status||'Pending');setNotes(r.data.company_notes||'');}catch(err){setApp(null);setError(err.response?.data?.message||'Could not load this application.');}finally{setLoading(false)}};
  useEffect(()=>{load()},[applicationId]);
  const person=app?.personal_info||{};
  const screening=app?.screening_responses||[];
  const profileLinks=useMemo(()=>Object.entries(app?.online_profiles||{}).filter(([,v])=>v),[app]);
  const documents=useMemo(()=>Object.entries(app?.additional_documents||{}).filter(([,v])=>v),[app]);

  const saveReview=async()=>{setSaving(true);setError('');try{const r=await api.put(`/company/applications/${applicationId}`,{status,company_notes:notes});setApp(r.data.application);setMessage('Review updated successfully.');setTimeout(()=>setMessage(''),2500);}catch(err){setError(err.response?.data?.message||'Could not save this review.');}finally{setSaving(false)}};

  if(loading) return <CompanyPortalLayout title="Applicant Review"><div className="py-32 text-center text-gray-600">Loading application…</div></CompanyPortalLayout>;
  if(!app) return <CompanyPortalLayout title="Applicant Review"><div className="py-32 text-center text-gray-600">{error||'Application not found.'}</div></CompanyPortalLayout>;

  const name=person.full_name||app.user?.name||'Candidate';
  return <CompanyPortalLayout title={name} subtitle={`Application for ${app.job?.title || 'job'}`} actions={<button onClick={()=>navigate('/company/applications')} className="cp-btn flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#1e3a42]/50 text-gray-400 text-sm"><ArrowLeft size={15}/>Applicants</button>}>
    <div className="max-w-6xl mx-auto grid xl:grid-cols-[1fr_330px] gap-6 items-start">
      <div className="space-y-5">
        <PortalCard className="p-5 sm:p-6 cp-fade-up"><div className="flex flex-col sm:flex-row sm:items-center gap-5"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14b8a6]/15 to-[#06b6d4]/8 border border-[#14b8a6]/20 flex items-center justify-center text-2xl font-black text-[#2dd4bf]">{name.slice(0,1).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-black text-white">{name}</h1><StatusPill status={app.status}/></div><div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600"><span className="flex items-center gap-1"><Mail size={12}/>{person.email||app.user?.email}</span>{person.phone&&<span className="flex items-center gap-1"><Phone size={12}/>{person.phone}</span>}<span className="flex items-center gap-1"><CalendarDays size={12}/>{app.applied_at?new Date(app.applied_at).toLocaleString():'—'}</span></div></div>{app.resume_path&&<a href={app.resume_path} target="_blank" rel="noreferrer" className="cp-btn inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] text-sm font-bold"><FileText size={15}/>Open CV <ExternalLink size={13}/></a>}</div></PortalCard>

        <Section icon={UserRound} title="Personal information" subtitle="Snapshot submitted with the application"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"><KV label="Full name" value={name}/><KV label="Email" value={person.email||app.user?.email}/><KV label="Phone" value={person.phone}/><KV label="Address" value={person.address}/><KV label="Date of birth" value={person.date_of_birth}/><KV label="Nationality" value={person.nationality}/></div></Section>

        <Section icon={FileText} title="Cover letter" subtitle="Candidate's submitted statement"><div className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-4 sm:p-5 text-sm text-gray-400 leading-7 whitespace-pre-wrap">{app.cover_letter||'No cover letter submitted.'}</div></Section>

        <Section icon={Sparkles} title="Skills" subtitle="Candidate skill snapshot at application time"><div className="flex flex-wrap gap-2">{(app.skills||[]).length?(app.skills||[]).map(s=><span key={s} className="px-3 py-1.5 rounded-xl bg-[#14b8a6]/8 border border-[#14b8a6]/12 text-xs text-[#5eead4]">{s}</span>):<span className="text-sm text-gray-600">No skills submitted.</span>}</div></Section>

        <Section icon={BriefcaseBusiness} title="Work experience"><div className="space-y-3">{(app.work_experience||[]).length?(app.work_experience||[]).map((x,i)=><div key={i} className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-4"><div className="font-bold text-white">{show(x.job_title)}</div><div className="text-xs text-[#2dd4bf] mt-1">{show(x.company)}</div><div className="text-xs text-gray-600 mt-1">{show(x.employment_dates)}</div>{x.description&&<p className="text-sm text-gray-500 mt-3 leading-relaxed">{x.description}</p>}</div>):<div className="text-sm text-gray-600">No work experience submitted (candidate may be a fresher).</div>}</div></Section>

        <Section icon={GraduationCap} title="Education"><div className="grid md:grid-cols-3 gap-3">{Object.entries(app.education_info||{}).map(([key,v])=><div key={key} className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-4"><div className="text-[10px] uppercase tracking-[.14em] text-[#2dd4bf] font-black mb-3">{key}</div><div className="space-y-2">{Object.entries(v||{}).filter(([,val])=>val!==''&&val!==null&&val!==undefined).map(([k,val])=><div key={k}><div className="text-[9px] uppercase tracking-wider text-gray-700">{k.replaceAll('_',' ')}</div><div className="text-xs text-gray-400 mt-0.5">{show(val)}</div></div>)}</div></div>)}</div></Section>

        <Section icon={ListChecks} title="Screening responses" subtitle="Answers to questions configured on this job">{screening.length?<div className="space-y-3">{screening.map((r,i)=><div key={r.id||i} className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-4"><div className="text-xs font-bold text-gray-300">{r.screening_question?.question_text||`Question ${i+1}`}</div><div className="text-sm text-[#99f6e4] mt-2 whitespace-pre-wrap">{show(r.response_text)}</div></div>)}</div>:<div className="text-sm text-gray-600">This job had no screening questions.</div>}</Section>

        <Section icon={ShieldCheck} title="Work eligibility"><div className="grid sm:grid-cols-2 gap-3"><div className="rounded-xl p-4 border border-[#1e3a42]/30 bg-black/15"><div className="text-xs text-gray-500">Authorized to work</div><div className="font-black text-white mt-1">{yesNo(app.work_eligibility?.authorized_to_work)}</div></div><div className="rounded-xl p-4 border border-[#1e3a42]/30 bg-black/15"><div className="text-xs text-gray-500">Needs visa sponsorship</div><div className="font-black text-white mt-1">{yesNo(app.work_eligibility?.visa_sponsorship_needed)}</div></div></div></Section>

        <Section icon={UsersRound} title="References"><div className="grid md:grid-cols-2 gap-3">{(app.references||[]).length?(app.references||[]).map((r,i)=><div key={i} className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-4"><div className="font-bold text-white">{show(r.name)}</div><div className="text-xs text-gray-600 mt-1">{show(r.relationship)}</div><div className="text-xs text-gray-400 mt-3">{show(r.email)}</div><div className="text-xs text-gray-400 mt-1">{show(r.phone)}</div></div>):<div className="text-sm text-gray-600">No references supplied.</div>}</div></Section>

        <Section icon={Globe2} title="Online profiles"><div className="flex flex-wrap gap-2">{profileLinks.length?profileLinks.map(([kind,url])=><a key={kind} href={url} target="_blank" rel="noreferrer" className="cp-btn inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#1e3a42] bg-black/15 text-sm text-gray-300 hover:text-[#2dd4bf]">{kind==='linkedin'?<Linkedin size={15}/>:kind==='github'?<Github size={15}/>:<LinkIcon size={15}/>} {kind}<ExternalLink size={12}/></a>):<span className="text-sm text-gray-600">No online profiles supplied.</span>}</div></Section>
        {documents.length > 0 && <Section icon={FileText} title="Additional documents" subtitle="Extra links or files included with the application"><div className="grid sm:grid-cols-2 gap-3">{documents.map(([kind,value])=><div key={kind} className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-4"><div className="text-[9px] uppercase tracking-wider text-gray-700 mb-2">{kind.replaceAll('_',' ')}</div>{typeof value==='string' && /^https?:\/\//i.test(value)?<a href={value} target="_blank" rel="noreferrer" className="text-sm text-[#2dd4bf] inline-flex items-center gap-1 break-all">Open document <ExternalLink size={12}/></a>:<div className="text-sm text-gray-400 break-words">{Array.isArray(value)?value.join(', '):show(value)}</div>}</div>)}</div></Section>}

        {app.application_notes && <Section icon={StickyNote} title="Candidate notes"><div className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-4 text-sm text-gray-400 whitespace-pre-wrap">{app.application_notes}</div></Section>}
      </div>

      <aside className="xl:sticky xl:top-24 space-y-4">
        <PortalCard className="p-5 cp-fade-up"><div className="flex items-center gap-2 mb-4"><CheckCircle2 size={18} className="text-[#2dd4bf]"/><h2 className="font-black text-white">Hiring decision</h2></div><label><span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">Application status</span><select value={status} onChange={e=>setStatus(e.target.value)} className="cp-input mt-2">{['Pending','Reviewed','Shortlisted','Accepted','Rejected'].map(s=><option key={s}>{s}</option>)}</select></label><label className="block mt-4"><span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">Internal company notes</span><textarea rows="8" value={notes} onChange={e=>setNotes(e.target.value)} className="cp-input mt-2 resize-none" placeholder="Private notes for your hiring team…"/></label>{message&&<div className="mt-3 text-xs text-emerald-300">{message}</div>}{error&&<div className="mt-3 text-xs text-red-300">{error}</div>}<button onClick={saveReview} disabled={saving} className="cp-btn w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-[#031014] font-black text-sm disabled:opacity-60"><Save size={15}/>{saving?'Saving…':'Save Review'}</button></PortalCard>
        <PortalCard className="p-5"><div className="text-[10px] uppercase tracking-[.16em] text-gray-700 font-bold mb-3">Position</div><div className="font-black text-white">{app.job?.title}</div><div className="text-xs text-gray-600 mt-2 flex items-center gap-1"><MapPin size={12}/>{app.job?.location}</div><Link to={`/company/jobs/${app.job_id}/edit`} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#2dd4bf]">View job setup <ExternalLink size={11}/></Link></PortalCard>
      </aside>
    </div>
  </CompanyPortalLayout>;
}
