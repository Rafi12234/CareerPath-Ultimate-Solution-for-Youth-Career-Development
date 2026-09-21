import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, MapPin, BriefcaseBusiness, UsersRound, Pencil, Trash2,
  Eye, CalendarDays, WalletCards, MoreHorizontal, XCircle, CheckCircle2
} from 'lucide-react';
import api from '../utils/api';
import { CompanyPortalLayout, PortalCard, StatusPill } from '../components/company/CompanyPortalLayout';

export default function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/company/jobs', { params: { search, status }, skipCache: true });
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setJobs([]);
      setError(err.response?.data?.message || 'Could not load company jobs.');
    } finally { setLoading(false); }
  };

  useEffect(() => { const t = setTimeout(fetchJobs, 180); return () => clearTimeout(t); }, [search, status]);

  const updateStatus = async (job, next) => {
    try {
      setError('');
      await api.put(`/company/jobs/${job.id}`, { status: next });
      setMessage(next === 'published' ? 'Job published successfully.' : 'Job status updated.');
      fetchJobs();
      setTimeout(()=>setMessage(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update the job status.');
    }
  };

  const remove = async (job) => {
    if (!window.confirm(`Delete “${job.title}”? This is only allowed when no one has applied.`)) return;
    try { setError(''); await api.delete(`/company/jobs/${job.id}`); fetchJobs(); }
    catch (err) { setError(err.response?.data?.message || 'Could not delete this job.'); }
  };

  return <CompanyPortalLayout title="Jobs" subtitle="Create roles that appear directly in the CareerPath Jobs experience" actions={<Link to="/company/jobs/new" className="cp-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14b8a6] text-[#031014] font-black text-sm"><Plus size={16}/>Post Job</Link>}>
    <div className="space-y-5">
      {message && <div className="cp-fade-up px-4 py-3 rounded-xl border border-[#14b8a6]/20 bg-[#14b8a6]/7 text-sm text-[#99f6e4]">{message}</div>}
      {error && <div className="cp-fade-up px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/8 text-sm text-red-300">{error}</div>}

      <PortalCard className="p-4 sm:p-5 cp-fade-up">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="relative flex-1"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, location, or career track…" className="cp-input pl-11"/></div>
          <div className="flex gap-2 overflow-x-auto cp-soft-scroll pb-1 lg:pb-0">{['all','published','draft','closed'].map(s=><button key={s} onClick={()=>setStatus(s)} className={`px-4 py-2.5 rounded-xl text-xs font-bold border whitespace-nowrap transition ${status===s?'text-[#2dd4bf] bg-[#14b8a6]/10 border-[#14b8a6]/20':'text-gray-500 bg-black/10 border-[#1e3a42]/40 hover:text-white'}`}>{s[0].toUpperCase()+s.slice(1)}</button>)}</div>
        </div>
      </PortalCard>

      {loading ? <div className="py-24 text-center text-gray-600">Loading jobs…</div> : jobs.length === 0 ? <PortalCard className="p-12 text-center cp-fade-up"><div className="w-16 h-16 rounded-2xl bg-[#14b8a6]/8 border border-[#14b8a6]/15 flex items-center justify-center mx-auto mb-4"><BriefcaseBusiness size={28} className="text-[#2dd4bf]"/></div><h2 className="text-xl font-black text-white">No jobs found</h2><p className="text-sm text-gray-600 mt-2 mb-6">Create your first opening and it will be available to CareerPath candidates when published.</p><Link to="/company/jobs/new" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#14b8a6] text-[#031014] font-black text-sm"><Plus size={16}/>Post your first job</Link></PortalCard> : <div className="grid xl:grid-cols-2 gap-4">
        {jobs.map((job, idx)=><PortalCard key={job.id} hover className="p-5 sm:p-6 cp-fade-up" style={{animationDelay:`${idx*.035}s`}}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0f2a34] border border-[#1e3a42] flex items-center justify-center shrink-0"><BriefcaseBusiness size={21} className="text-[#2dd4bf]"/></div>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 items-center"><h2 className="text-lg font-black text-white truncate">{job.title}</h2><StatusPill status={job.status}/></div><div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600"><span className="flex items-center gap-1"><MapPin size={12}/>{job.location}</span><span>{job.type}</span><span>{job.level}</span><span>{job.track}</span></div></div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mt-5 line-clamp-2">{job.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">{(job.skills||[]).slice(0,6).map(s=><span key={s} className="px-2.5 py-1 rounded-lg bg-[#14b8a6]/7 border border-[#14b8a6]/10 text-[11px] text-[#5eead4]">{s}</span>)}{(job.skills||[]).length>6&&<span className="px-2.5 py-1 text-[11px] text-gray-600">+{job.skills.length-6}</span>}</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
            <div className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-3"><UsersRound size={14} className="text-[#2dd4bf] mb-2"/><div className="text-lg font-black text-white">{job.applications_count||0}</div><div className="text-[10px] text-gray-600 uppercase tracking-wider">Applicants</div></div>
            <div className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-3"><WalletCards size={14} className="text-[#2dd4bf] mb-2"/><div className="text-xs font-bold text-white truncate">{job.salary_min||job.salary_max ? `৳${Number(job.salary_min||0).toLocaleString()}+` : 'Flexible'}</div><div className="text-[10px] text-gray-600 uppercase tracking-wider mt-1">Salary</div></div>
            <div className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-3"><CalendarDays size={14} className="text-[#2dd4bf] mb-2"/><div className="text-xs font-bold text-white">{job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'Open'}</div><div className="text-[10px] text-gray-600 uppercase tracking-wider mt-1">Deadline</div></div>
            <div className="rounded-xl bg-black/15 border border-[#1e3a42]/30 p-3"><MoreHorizontal size={14} className="text-[#2dd4bf] mb-2"/><div className="text-xs font-bold text-white">{job.vacancies||1}</div><div className="text-[10px] text-gray-600 uppercase tracking-wider mt-1">Vacancies</div></div>
          </div>
          <div className="mt-5 pt-4 border-t border-[#1e3a42]/30 flex flex-wrap gap-2">
            <Link to={`/company/jobs/${job.id}/applications`} className="cp-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/15 text-[#2dd4bf] text-xs font-bold"><Eye size={14}/>Applicants</Link>
            <Link to={`/company/jobs/${job.id}/edit`} className="cp-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[.025] border border-[#1e3a42]/40 text-gray-300 text-xs font-bold"><Pencil size={14}/>Edit</Link>
            {job.status==='published' ? <button onClick={()=>updateStatus(job,'closed')} className="cp-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-500/20 text-gray-400 text-xs font-bold"><XCircle size={14}/>Close</button> : <button onClick={()=>updateStatus(job,'published')} className="cp-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/20 text-emerald-300 text-xs font-bold"><CheckCircle2 size={14}/>Publish</button>}
            <button onClick={()=>remove(job)} className="ml-auto cp-btn p-2.5 rounded-xl border border-red-500/15 text-red-400 hover:bg-red-500/8"><Trash2 size={15}/></button>
          </div>
        </PortalCard>)}
      </div>}
    </div>
  </CompanyPortalLayout>;
}
