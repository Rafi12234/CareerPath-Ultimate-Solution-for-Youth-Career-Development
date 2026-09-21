import { useEffect, useState } from 'react';
import { Building2, Globe2, MapPin, Phone, UsersRound, CalendarDays, UserRound, Mail, Lock, Save } from 'lucide-react';
import api from '../utils/api';
import { useCompany } from '../context/CompanyContext';
import { CompanyPortalLayout, PortalCard } from '../components/company/CompanyPortalLayout';

function F({icon:Icon,label,children}){return <label className="block"><span className="block text-[10px] font-black uppercase tracking-[.14em] text-gray-600 mb-2">{label}</span><div className="relative">{Icon&&<Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"/>}{children}</div></label>}

export default function CompanySettings(){
  const {companyUser,company,persist}=useCompany(); const [saving,setSaving]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState('');
  const [form,setForm]=useState({});
  useEffect(()=>setForm({contact_name:companyUser?.name||'',company_name:company?.name||'',email:companyUser?.email||'',industry:company?.industry||'',website:company?.website||'',phone:company?.phone||'',location:company?.location||'',company_size:company?.company_size||'',description:company?.description||'',logo_url:company?.logo_url||'',founded_year:company?.founded_year||'',current_password:'',new_password:'',new_password_confirmation:''}),[companyUser,company]);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=async(e)=>{e.preventDefault();setSaving(true);setError('');setMessage('');try{const r=await api.put('/company/profile',form);persist(r.data.user,r.data.company);set('current_password','');set('new_password','');set('new_password_confirmation','');setMessage('Company profile updated successfully.');}catch(err){const d=err.response?.data;const first=d?.errors?Object.values(d.errors).flat()[0]:null;setError(first||d?.message||'Could not update company profile.');}finally{setSaving(false)}};
  return <CompanyPortalLayout title="Company Profile" subtitle="Keep the employer identity used across your job posts up to date">
    <form onSubmit={submit} className="max-w-5xl mx-auto space-y-5">
      {message&&<div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-sm text-emerald-300">{message}</div>}{error&&<div className="p-4 rounded-xl border border-red-500/20 bg-red-500/8 text-sm text-red-300">{error}</div>}
      <PortalCard className="p-5 sm:p-7 cp-fade-up"><div className="flex items-center gap-3 mb-6"><div className="w-11 h-11 rounded-xl bg-[#14b8a6]/8 border border-[#14b8a6]/15 flex items-center justify-center"><Building2 size={20} className="text-[#2dd4bf]"/></div><div><h2 className="text-lg font-black text-white">Company information</h2><p className="text-xs text-gray-600 mt-1">Changing the company name also updates the display name on your existing jobs.</p></div></div><div className="grid md:grid-cols-2 gap-4">
        <F icon={Building2} label="Company name"><input className="cp-input pl-10" value={form.company_name||''} onChange={e=>set('company_name',e.target.value)}/></F>
        <F icon={UserRound} label="Primary contact"><input className="cp-input pl-10" value={form.contact_name||''} onChange={e=>set('contact_name',e.target.value)}/></F>
        <F icon={Mail} label="Login / contact email"><input type="email" className="cp-input pl-10" value={form.email||''} onChange={e=>set('email',e.target.value)}/></F>
        <F icon={Phone} label="Phone"><input className="cp-input pl-10" value={form.phone||''} onChange={e=>set('phone',e.target.value)}/></F>
        <F icon={Globe2} label="Website"><input type="url" className="cp-input pl-10" value={form.website||''} onChange={e=>set('website',e.target.value)} placeholder="https://company.com"/></F>
        <F icon={MapPin} label="Location"><input className="cp-input pl-10" value={form.location||''} onChange={e=>set('location',e.target.value)}/></F>
        <F icon={UsersRound} label="Company size"><select className="cp-input pl-10" value={form.company_size||''} onChange={e=>set('company_size',e.target.value)}><option value="">Select size</option>{['1-10','11-50','51-200','201-500','501-1000','1000+'].map(v=><option key={v}>{v}</option>)}</select></F>
        <F icon={CalendarDays} label="Founded year"><input type="number" className="cp-input pl-10" value={form.founded_year||''} onChange={e=>set('founded_year',e.target.value)}/></F>
        <F label="Industry"><input className="cp-input" value={form.industry||''} onChange={e=>set('industry',e.target.value)} placeholder="Technology, Finance, Education…"/></F>
        <F label="Logo URL"><input type="url" className="cp-input" value={form.logo_url||''} onChange={e=>set('logo_url',e.target.value)} placeholder="https://…"/></F>
        <label className="md:col-span-2"><span className="block text-[10px] font-black uppercase tracking-[.14em] text-gray-600 mb-2">About company</span><textarea rows="6" className="cp-input resize-none" value={form.description||''} onChange={e=>set('description',e.target.value)} placeholder="A short employer profile…"/></label>
      </div></PortalCard>

      <PortalCard className="p-5 sm:p-7 cp-fade-up"><div className="flex items-center gap-3 mb-6"><div className="w-11 h-11 rounded-xl bg-[#06b6d4]/8 border border-[#06b6d4]/15 flex items-center justify-center"><Lock size={20} className="text-cyan-300"/></div><div><h2 className="text-lg font-black text-white">Security</h2><p className="text-xs text-gray-600 mt-1">Leave these fields empty if you are not changing the password.</p></div></div><div className="grid md:grid-cols-3 gap-4"><F label="Current password"><input type="password" className="cp-input" value={form.current_password||''} onChange={e=>set('current_password',e.target.value)}/></F><F label="New password"><input type="password" className="cp-input" value={form.new_password||''} onChange={e=>set('new_password',e.target.value)}/></F><F label="Confirm new password"><input type="password" className="cp-input" value={form.new_password_confirmation||''} onChange={e=>set('new_password_confirmation',e.target.value)}/></F></div></PortalCard>

      <div className="flex justify-end"><button disabled={saving} className="cp-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-[#031014] font-black text-sm disabled:opacity-60"><Save size={16}/>{saving?'Saving…':'Save Profile'}</button></div>
    </form>
  </CompanyPortalLayout>
}
