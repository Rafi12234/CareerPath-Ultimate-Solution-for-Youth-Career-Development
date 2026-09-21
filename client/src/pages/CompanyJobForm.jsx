import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, BriefcaseBusiness, MapPin, Layers3, WalletCards, Sparkles, Plus,
  Trash2, HelpCircle, CalendarDays, UsersRound, Save, Send, ListChecks
} from 'lucide-react';
import api from '../utils/api';
import { CompanyPortalLayout, PortalCard } from '../components/company/CompanyPortalLayout';

const emptyQuestion = () => ({ question_text: '', question_type: 'text', options: [], required: true });
const initial = {
  title: '', location: '', type: 'Full-time', level: 'Entry Level', description: '',
  salary_min: '', salary_max: '', track: '', skills_text: '', status: 'published',
  application_deadline: '', vacancies: 1, screening_questions: [],
};

function Label({ children }) { return <span className="block mb-2 text-[10px] font-black uppercase tracking-[.16em] text-gray-600">{children}</span>; }

export default function CompanyJobForm() {
  const { jobId } = useParams();
  const edit = Boolean(jobId);
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(edit);
  const [saving, setSaving] = useState(false);
  const [screeningLocked, setScreeningLocked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!edit) return;
    api.get(`/company/jobs/${jobId}`, { skipCache: true }).then(({data}) => {
      setScreeningLocked(Number(data.applications_count || 0) > 0);
      setForm({
        title: data.title || '', location: data.location || '', type: data.type || 'Full-time', level: data.level || 'Entry Level',
        description: data.description || '', salary_min: data.salary_min ?? '', salary_max: data.salary_max ?? '', track: data.track || '',
        skills_text: (data.skills || []).join(', '), status: data.status || 'published', application_deadline: data.application_deadline ? String(data.application_deadline).slice(0,10) : '',
        vacancies: data.vacancies || 1,
        screening_questions: (data.screening_questions || []).map(q=>({ question_text:q.question_text, question_type:q.question_type, options:q.options || [], required:Boolean(q.required) })),
      });
    }).catch(err=>setError(err.response?.data?.message || 'Could not load this job.')).finally(()=>setLoading(false));
  }, [edit, jobId]);

  const set = (key, value) => setForm(prev=>({...prev,[key]:value}));
  const questions = form.screening_questions;
  const updateQuestion = (i, patch) => set('screening_questions', questions.map((q,idx)=>idx===i?{...q,...patch}:q));
  const removeQuestion = (i) => set('screening_questions', questions.filter((_,idx)=>idx!==i));

  const skills = useMemo(() => form.skills_text.split(',').map(s=>s.trim()).filter(Boolean), [form.skills_text]);
  const payload = (statusOverride) => ({
    title: form.title, location: form.location, type: form.type, level: form.level, description: form.description,
    salary_min: form.salary_min === '' ? null : Number(form.salary_min), salary_max: form.salary_max === '' ? null : Number(form.salary_max),
    track: form.track, skills, status: statusOverride || form.status,
    application_deadline: form.application_deadline || null, vacancies: Number(form.vacancies || 1),
    ...(!screeningLocked ? { screening_questions: questions.map(q=>({ ...q, options: q.question_type === 'multiple_choice' ? (Array.isArray(q.options)?q.options:[]).filter(Boolean) : [] })) } : {}),
  });

  const save = async (statusOverride) => {
    setError(''); setSaving(true);
    try {
      if (edit) await api.put(`/company/jobs/${jobId}`, payload(statusOverride));
      else await api.post('/company/jobs', payload(statusOverride));
      navigate('/company/jobs');
    } catch (err) {
      const d = err.response?.data;
      const first = d?.errors ? Object.values(d.errors).flat()[0] : null;
      setError(first || d?.message || 'Could not save this job.');
    } finally { setSaving(false); }
  };

  if (loading) return <CompanyPortalLayout title={edit?'Edit Job':'Post a Job'}><div className="py-32 text-center text-gray-600">Loading job…</div></CompanyPortalLayout>;

  return <CompanyPortalLayout title={edit?'Edit Job':'Post a Job'} subtitle="Use the same fields candidates already see on the CareerPath Jobs page" actions={<button onClick={()=>navigate('/company/jobs')} className="cp-btn flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#1e3a42]/50 text-gray-400 text-sm"><ArrowLeft size={15}/>Jobs</button>}>
    <div className="max-w-5xl mx-auto space-y-5">
      {error && <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/8 text-sm text-red-300 cp-fade-up">{error}</div>}

      <PortalCard className="p-5 sm:p-7 cp-fade-up">
        <div className="flex items-center gap-3 mb-6"><div className="w-11 h-11 rounded-xl bg-[#14b8a6]/8 border border-[#14b8a6]/15 flex items-center justify-center"><BriefcaseBusiness size={20} className="text-[#2dd4bf]"/></div><div><h2 className="text-lg font-black text-white">Role details</h2><p className="text-xs text-gray-600 mt-1">These values map directly to the current user-facing job cards and job detail modal.</p></div></div>
        <div className="grid md:grid-cols-2 gap-4">
          <label><Label>Job title *</Label><input className="cp-input" value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Frontend Developer"/></label>
          <label><Label>Location *</Label><div className="relative"><MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"/><input className="cp-input pl-10" value={form.location} onChange={e=>set('location',e.target.value)} placeholder="Dhaka / Remote"/></div></label>
          <label><Label>Employment type *</Label><select className="cp-input" value={form.type} onChange={e=>set('type',e.target.value)}>{['Full-time','Part-time','Internship','Contract','Remote'].map(v=><option key={v}>{v}</option>)}</select></label>
          <label><Label>Experience level *</Label><select className="cp-input" value={form.level} onChange={e=>set('level',e.target.value)}>{['Entry Level','Mid Level','Senior'].map(v=><option key={v}>{v}</option>)}</select></label>
          <label><Label>Career track *</Label><div className="relative"><Layers3 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"/><input className="cp-input pl-10" value={form.track} onChange={e=>set('track',e.target.value)} placeholder="Software Engineering"/></div></label>
          <label><Label>Vacancies</Label><div className="relative"><UsersRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"/><input type="number" min="1" className="cp-input pl-10" value={form.vacancies} onChange={e=>set('vacancies',e.target.value)}/></div></label>
          <label><Label>Minimum salary (BDT / month)</Label><div className="relative"><WalletCards size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"/><input type="number" min="0" className="cp-input pl-10" value={form.salary_min} onChange={e=>set('salary_min',e.target.value)} placeholder="40000"/></div></label>
          <label><Label>Maximum salary (BDT / month)</Label><input type="number" min="0" className="cp-input" value={form.salary_max} onChange={e=>set('salary_max',e.target.value)} placeholder="70000"/></label>
          <label><Label>Application deadline</Label><div className="relative"><CalendarDays size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"/><input type="date" className="cp-input pl-10" value={form.application_deadline} onChange={e=>set('application_deadline',e.target.value)}/></div></label>
          <label><Label>Publishing status</Label><select className="cp-input" value={form.status} onChange={e=>set('status',e.target.value)}><option value="published">Published</option><option value="draft">Draft</option><option value="closed">Closed</option></select></label>
          <label className="md:col-span-2"><Label>Required skills — comma separated</Label><input className="cp-input" value={form.skills_text} onChange={e=>set('skills_text',e.target.value)} placeholder="React, JavaScript, REST API, Git"/><div className="flex flex-wrap gap-2 mt-2">{skills.map(s=><span key={s} className="px-2.5 py-1 rounded-lg bg-[#14b8a6]/8 border border-[#14b8a6]/12 text-[11px] text-[#5eead4]">{s}</span>)}</div></label>
          <label className="md:col-span-2"><Label>Job description *</Label><textarea rows="9" className="cp-input resize-y leading-relaxed" value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Describe responsibilities, requirements, team context, and what success looks like…"/></label>
        </div>
      </PortalCard>

      <PortalCard className="p-5 sm:p-7 cp-fade-up" style={{animationDelay:'.06s'}}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-[#06b6d4]/8 border border-[#06b6d4]/15 flex items-center justify-center"><ListChecks size={20} className="text-cyan-300"/></div><div><h2 className="text-lg font-black text-white">Screening questions</h2><p className="text-xs text-gray-600 mt-1">{screeningLocked ? 'Locked after the first application so submitted answers can never be lost.' : 'Candidate answers are stored with the application and shown in your applicant detail view.'}</p></div></div><button disabled={screeningLocked} onClick={()=>set('screening_questions',[...questions,emptyQuestion()])} className="cp-btn inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#14b8a6]/20 bg-[#14b8a6]/8 text-[#2dd4bf] text-xs font-bold disabled:opacity-35 disabled:cursor-not-allowed"><Plus size={15}/>Add question</button></div>

        {questions.length===0 ? <div className="rounded-2xl border border-dashed border-[#1e3a42] p-9 text-center"><HelpCircle size={25} className="text-gray-700 mx-auto mb-3"/><p className="text-sm text-gray-500">No screening questions. Candidates can apply using their profile, CV, cover letter, eligibility, references and online profiles.</p></div> : <div className="space-y-4">{questions.map((q,i)=><div key={i} className="p-4 sm:p-5 rounded-2xl bg-black/15 border border-[#1e3a42]/40">
          <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-lg bg-[#14b8a6]/8 text-[#2dd4bf] flex items-center justify-center text-xs font-black shrink-0">{i+1}</div><div className="flex-1 grid md:grid-cols-[1fr_180px] gap-3"><input disabled={screeningLocked} className="cp-input disabled:opacity-55" value={q.question_text} onChange={e=>updateQuestion(i,{question_text:e.target.value})} placeholder="e.g. Are you available to work from our Dhaka office 3 days/week?"/><select disabled={screeningLocked} className="cp-input disabled:opacity-55" value={q.question_type} onChange={e=>updateQuestion(i,{question_type:e.target.value,options:e.target.value==='multiple_choice'?(q.options?.length?q.options:['']):[]})}><option value="text">Text answer</option><option value="yes_no">Yes / No</option><option value="multiple_choice">Multiple choice</option></select></div><button disabled={screeningLocked} onClick={()=>removeQuestion(i)} className="p-2.5 rounded-xl text-red-400 border border-red-500/10 hover:bg-red-500/8 disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 size={15}/></button></div>
          {q.question_type==='multiple_choice' && <div className="mt-3 ml-11"><Label>Options</Label><input disabled={screeningLocked} className="cp-input disabled:opacity-55" value={(q.options||[]).join(', ')} onChange={e=>updateQuestion(i,{options:e.target.value.split(',').map(v=>v.trim())})} placeholder="Option A, Option B, Option C"/></div>}
          <label className="ml-11 mt-3 inline-flex items-center gap-2 text-xs text-gray-500 cursor-pointer"><input type="checkbox" disabled={screeningLocked} checked={q.required!==false} onChange={e=>updateQuestion(i,{required:e.target.checked})} className="accent-[#14b8a6]"/>Required response</label>
        </div>)}</div>}
      </PortalCard>

      <div className="sticky bottom-4 z-20 cp-fade-up"><div className="cp-card rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between shadow-[0_18px_55px_-30px_rgba(0,0,0,.9)]"><div className="flex items-center gap-2 text-xs text-gray-600"><Sparkles size={14} className="text-[#2dd4bf]"/>Published jobs immediately become eligible for the user Jobs page.</div><div className="flex gap-2"><button disabled={saving} onClick={()=>save('draft')} className="cp-btn flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#1e3a42] text-gray-300 text-sm font-bold"><Save size={15}/>Save Draft</button><button disabled={saving} onClick={()=>save('published')} className="cp-btn flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-[#031014] text-sm font-black disabled:opacity-60"><Send size={15}/>{saving?'Saving…':edit?'Save & Publish':'Publish Job'}</button></div></div></div>
    </div>
  </CompanyPortalLayout>;
}
