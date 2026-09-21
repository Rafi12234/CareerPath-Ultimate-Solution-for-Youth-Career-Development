import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, UsersRound, Clock3, UserCheck, ArrowUpRight, Plus, MapPin, Activity } from 'lucide-react';
import api from '../utils/api';
import { CompanyPortalLayout, PortalCard, StatusPill } from '../components/company/CompanyPortalLayout';

const Stat = ({ icon: Icon, label, value, meta, delay = 0 }) => <PortalCard hover className="p-5 cp-fade-up" style={{animationDelay:`${delay}s`}}><div className="flex items-start justify-between"><div><div className="text-[10px] text-gray-600 font-bold uppercase tracking-[.16em]">{label}</div><div className="text-3xl font-black text-white mt-2 tabular-nums">{value ?? 0}</div><div className="text-xs text-gray-600 mt-2">{meta}</div></div><div className="w-11 h-11 rounded-xl bg-[#14b8a6]/8 border border-[#14b8a6]/15 flex items-center justify-center"><Icon size={20} className="text-[#2dd4bf]"/></div></div></PortalCard>;

export default function CompanyDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/company/dashboard', { skipCache: true }).then(r=>setData(r.data)).catch(err=>setError(err.response?.data?.message || 'Could not load the hiring overview.')).finally(()=>setLoading(false)); }, []);

  return <CompanyPortalLayout title="Hiring Overview" subtitle="Your live recruitment activity in one place" actions={<Link to="/company/jobs/new" className="hidden sm:flex cp-btn items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14b8a6] text-[#031014] font-black text-sm"><Plus size={16}/>Post Job</Link>}>
    {loading ? <div className="py-28 text-center text-gray-600">Loading hiring workspace…</div> : error ? <PortalCard className="p-8 text-center text-red-300">{error}</PortalCard> : <div className="space-y-6">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat icon={BriefcaseBusiness} label="Total Jobs" value={data?.jobs?.total} meta={`${data?.jobs?.published || 0} currently published`} />
        <Stat icon={UsersRound} label="Applications" value={data?.applications?.total} meta="Across your company roles" delay={.05}/>
        <Stat icon={Clock3} label="Pending Review" value={data?.applications?.pending} meta="Waiting for your team" delay={.1}/>
        <Stat icon={UserCheck} label="Shortlisted" value={data?.applications?.shortlisted} meta={`${data?.applications?.accepted || 0} accepted`} delay={.15}/>
      </div>

      <div className="grid xl:grid-cols-[1.25fr_.75fr] gap-6">
        <PortalCard className="overflow-hidden cp-fade-up">
          <div className="p-5 sm:p-6 border-b border-[#1e3a42]/35 flex items-center justify-between"><div><h2 className="text-lg font-black text-white">Recent applicants</h2><p className="text-xs text-gray-600 mt-1">Latest submissions to your jobs</p></div><Link to="/company/applications" className="text-xs font-bold text-[#2dd4bf] flex items-center gap-1">View all <ArrowUpRight size={13}/></Link></div>
          <div className="divide-y divide-[#1e3a42]/25">
            {(data?.recent_applications || []).length === 0 ? <div className="p-10 text-center text-gray-600">No applications yet. Your first candidate will appear here.</div> : data.recent_applications.map(app => <Link key={app.id} to={`/company/applications/${app.id}`} className="p-4 sm:p-5 flex items-center gap-4 hover:bg-white/[.018] transition group">
              <div className="w-10 h-10 rounded-xl bg-[#0f2a34] border border-[#1e3a42] flex items-center justify-center text-[#2dd4bf] font-black">{(app.personal_info?.full_name || app.user?.name || '?').slice(0,1).toUpperCase()}</div>
              <div className="min-w-0 flex-1"><div className="text-sm font-bold text-white truncate group-hover:text-[#2dd4bf] transition">{app.personal_info?.full_name || app.user?.name}</div><div className="text-xs text-gray-600 truncate">{app.job?.title} · {app.personal_info?.email || app.user?.email}</div></div>
              <StatusPill status={app.status}/>
            </Link>)}
          </div>
        </PortalCard>

        <PortalCard className="p-5 sm:p-6 cp-fade-up" style={{animationDelay:'.08s'}}>
          <div className="flex items-center gap-2 mb-5"><Activity size={18} className="text-[#2dd4bf]"/><h2 className="text-lg font-black text-white">Top roles</h2></div>
          <div className="space-y-3">{(data?.top_jobs || []).length === 0 ? <p className="text-sm text-gray-600 py-8 text-center">Post a job to start tracking performance.</p> : data.top_jobs.map((job,i)=><Link key={job.id} to={`/company/jobs/${job.id}/applications`} className="block p-3.5 rounded-xl bg-black/15 border border-[#1e3a42]/35 hover:border-[#14b8a6]/25 transition"><div className="flex items-start gap-3"><div className="text-[#14b8a6] font-black text-sm w-5">0{i+1}</div><div className="min-w-0 flex-1"><div className="text-sm font-bold text-white truncate">{job.title}</div><div className="flex items-center gap-2 mt-1 text-[11px] text-gray-600"><MapPin size={11}/>{job.location}<span>•</span><span>{job.applications_count} applicant{job.applications_count===1?'':'s'}</span></div></div><StatusPill status={job.status}/></div></Link>)}</div>
        </PortalCard>
      </div>
    </div>}
  </CompanyPortalLayout>;
}
