import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, UsersRound, BriefcaseBusiness, CalendarDays, ArrowUpRight, Filter } from 'lucide-react';
import api from '../utils/api';
import { CompanyPortalLayout, PortalCard, StatusPill } from '../components/company/CompanyPortalLayout';

export default function CompanyApplications() {
  const [params] = useSearchParams();
  const initialJob = params.get('job_id') || '';
  const [apps,setApps]=useState([]); const [jobs,setJobs]=useState([]); const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState(''); const [status,setStatus]=useState('all'); const [jobId,setJobId]=useState(initialJob); const [error,setError]=useState('');

  useEffect(()=>{ api.get('/company/jobs',{skipCache:true}).then(r=>setJobs(Array.isArray(r.data)?r.data:[])).catch(()=>{}); },[]);
  useEffect(()=>{ const t=setTimeout(async()=>{ try{setLoading(true);setError('');const r=await api.get('/company/applications',{params:{search,status,job_id:jobId||undefined},skipCache:true});setApps(Array.isArray(r.data)?r.data:[]);}catch(err){setApps([]);setError(err.response?.data?.message||'Could not load applicants.');}finally{setLoading(false)}},160); return()=>clearTimeout(t);},[search,status,jobId]);

  return <CompanyPortalLayout title="Applicants" subtitle="Review candidate submissions only for jobs owned by your company">
    <div className="space-y-5">
      <PortalCard className="p-4 sm:p-5 cp-fade-up"><div className="grid lg:grid-cols-[1fr_220px_220px] gap-3"><div className="relative"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"/><input value={search} onChange={e=>setSearch(e.target.value)} className="cp-input pl-11" placeholder="Search applicant name or email…"/></div><select value={jobId} onChange={e=>setJobId(e.target.value)} className="cp-input"><option value="">All jobs</option>{jobs.map(j=><option key={j.id} value={j.id}>{j.title}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)} className="cp-input"><option value="all">All statuses</option>{['Pending','Reviewed','Shortlisted','Accepted','Rejected'].map(s=><option key={s}>{s}</option>)}</select></div></PortalCard>

      <div className="flex items-center justify-between"><div className="text-xs text-gray-600"><span className="font-bold text-white">{apps.length}</span> candidate{apps.length===1?'':'s'} in this view</div><div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-700"><Filter size={11}/>Live filters</div></div>

      {loading ? <div className="py-24 text-center text-gray-600">Loading applicants…</div> : error ? <PortalCard className="p-8 text-center text-red-300">{error}</PortalCard> : apps.length===0 ? <PortalCard className="p-12 text-center"><UsersRound size={30} className="text-gray-700 mx-auto mb-4"/><h2 className="text-lg font-black text-white">No applicants found</h2><p className="text-sm text-gray-600 mt-2">Applications submitted by CareerPath users will appear here automatically.</p></PortalCard> : <div className="space-y-3">{apps.map((app,i)=>{
        const name=app.personal_info?.full_name||app.user?.name||'Candidate'; const email=app.personal_info?.email||app.user?.email;
        return <Link key={app.id} to={`/company/applications/${app.id}`} className="block cp-fade-up" style={{animationDelay:`${i*.025}s`}}><PortalCard hover className="p-4 sm:p-5"><div className="flex flex-col md:flex-row md:items-center gap-4"><div className="flex items-center gap-4 min-w-0 flex-1"><div className="w-11 h-11 rounded-xl bg-[#14b8a6]/8 border border-[#14b8a6]/15 text-[#2dd4bf] font-black flex items-center justify-center shrink-0">{name.slice(0,1).toUpperCase()}</div><div className="min-w-0"><div className="flex items-center gap-2"><h3 className="font-black text-white truncate">{name}</h3><StatusPill status={app.status}/></div><p className="text-xs text-gray-600 truncate mt-1">{email}</p></div></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:w-[480px]"><div><div className="text-[9px] uppercase tracking-wider text-gray-700 mb-1">Applied for</div><div className="text-xs font-semibold text-gray-300 truncate flex items-center gap-1"><BriefcaseBusiness size={12}/>{app.job?.title}</div></div><div><div className="text-[9px] uppercase tracking-wider text-gray-700 mb-1">Submitted</div><div className="text-xs text-gray-400 flex items-center gap-1"><CalendarDays size={12}/>{app.applied_at?new Date(app.applied_at).toLocaleDateString():'—'}</div></div><div className="hidden sm:block"><div className="text-[9px] uppercase tracking-wider text-gray-700 mb-1">Skills</div><div className="text-xs text-gray-400 truncate">{(app.skills||[]).slice(0,3).join(', ')||'—'}</div></div></div><ArrowUpRight size={16} className="text-gray-700 shrink-0"/></div></PortalCard></Link>;
      })}</div>}
    </div>
  </CompanyPortalLayout>;
}
