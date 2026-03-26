import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  X, Send, Loader2, Upload, FileText, User, Briefcase, GraduationCap,
  Zap, Shield, Users, Globe, Plus, Trash2, CheckCircle, AlertCircle,
  MapPin, Building2, Phone, Mail, Calendar, Flag, Link, Github, Linkedin,
  HelpCircle, MessageSquare, Star, Award, Clock
} from 'lucide-react';
import api from '../utils/api';

/* ═══════════════════════════════════════════════════════════════
   STAGE 2: MID
   — Dark theme, organized sections with icons
   — Single scrollable page (no wizard)
   — References, screening questions, online profiles
   ═══════════════════════════════════════════════════════════════ */

const sectionStyle = {
  background: 'rgba(15,25,35,0.95)',
  border: '1px solid rgba(30,58,66,0.4)',
  borderRadius: 16,
  padding: 24,
  marginBottom: 24,
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(10,26,34,0.6)',
  border: '1px solid rgba(30,58,66,0.5)',
  borderRadius: 10,
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const btnPrimary = {
  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '12px 28px',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 14,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

const btnSecondary = {
  background: 'rgba(30,58,66,0.4)',
  border: '1px solid rgba(30,58,66,0.6)',
  borderRadius: 10,
  padding: '8px 16px',
  color: '#14b8a6',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 13,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

/* ── Section Header ── */
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(20,184,166,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={22} color="#14b8a6" />
    </div>
    <div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>{title}</h2>
      {subtitle && <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>{subtitle}</p>}
    </div>
  </div>
);

/* ── Input with icon ── */
const IconInput = ({ icon: Icon, type = 'text', placeholder, value, onChange, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && <Icon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563', pointerEvents: 'none' }} />}
    <input type={type} placeholder={placeholder} value={value || ''} onChange={onChange} style={{ ...inputStyle, paddingLeft: Icon ? 40 : 14 }} {...props} />
  </div>
);

/* ── Main Component ── */
const JobApplicationForm = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const [form, setForm] = useState({
    personal_info: {},
    work_experience: [],
    education_info: {},
    skills: [],
    cover_letter: '',
    references: [],
    online_profiles: {},
    work_eligibility: {},
    screening_responses: [],
    resume: null,
  });

  const [screeningQuestions, setScreeningQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/job-applications/init/${jobId}`);
        const d = res.data;
        setJob(d.job);
        setScreeningQuestions(d.screening_questions);
        setForm(prev => ({
          ...prev,
          personal_info: d.pre_filled.personal_info,
          work_experience: d.pre_filled.work_experience,
          education_info: d.pre_filled.education_info,
          skills: d.pre_filled.skills,
          work_eligibility: { authorized_to_work: true, visa_sponsorship_needed: false },
          online_profiles: { linkedin: user?.linkedin || '', portfolio: user?.portfolio || '', github: user?.github || '' },
        }));
      } catch (err) {
        if (err.response?.status === 401) { navigate('/login'); return; }
        if (err.response?.status === 403) { setError(err.response?.data?.message || 'Already applied.'); return; }
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId, user, navigate]);

  const updateForm = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const updatePersonal = (key, val) => updateForm('personal_info', { ...form.personal_info, [key]: val });
  const handleResumeUpload = (e) => { if (e.target.files?.[0]) updateForm('resume', e.target.files[0]); };

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      updateForm('skills', [...form.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const addReference = () => updateForm('references', [...form.references, { name: '', relationship: '', email: '', phone: '' }]);
  const updateReference = (idx, field, value) => {
    const updated = [...form.references];
    updated[idx][field] = value;
    updateForm('references', updated);
  };
  const removeReference = (idx) => updateForm('references', form.references.filter((_, i) => i !== idx));

  const updateScreeningResponse = (qid, response) => {
    const existing = form.screening_responses.find(r => r.question_id === qid);
    if (existing) existing.response = response;
    else form.screening_responses.push({ question_id: qid, response });
    setForm({ ...form });
  };

  const submitApplication = async () => {
    try {
      setSubmitting(true);
      setError('');
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('job_id', jobId);
      formData.append('personal_info', JSON.stringify(form.personal_info));
      formData.append('work_experience', JSON.stringify(form.work_experience));
      formData.append('education_info', JSON.stringify(form.education_info));
      formData.append('skills', JSON.stringify(form.skills));
      formData.append('cover_letter', form.cover_letter);
      formData.append('references', JSON.stringify(form.references));
      formData.append('online_profiles', JSON.stringify(form.online_profiles));
      formData.append('work_eligibility', JSON.stringify(form.work_eligibility));
      formData.append('screening_responses', JSON.stringify(form.screening_responses));
      if (form.resume) formData.append('resume', form.resume);

      await api.post('/job-applications', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Application submitted successfully!');
      setTimeout(() => window.location.assign('/jobs'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#030810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={36} color="#14b8a6" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (error && !job) return (
    <div style={{ minHeight: '100vh', background: '#030810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <AlertCircle size={48} color="#ef4444" />
      <p style={{ color: '#fca5a5', maxWidth: 400, textAlign: 'center' }}>{error}</p>
      <button onClick={() => navigate('/jobs')} style={btnPrimary}>Back to Jobs</button>
    </div>
  );

  if (!job) return (
    <div style={{ minHeight: '100vh', background: '#030810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: '#9ca3af' }}>Job not found</p>
      <button onClick={() => navigate('/jobs')} style={btnPrimary}>Back to Jobs</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#030810', padding: '100px 16px 40px', fontFamily: 'system-ui, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ ...sectionStyle, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(20,184,166,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Briefcase size={28} color="#14b8a6" />
          </div>
          <div>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.3)', color: '#2dd4bf', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Applying
            </span>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{job.title}</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 14, display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={14} color="#14b8a6" /> {job.company}</span>
              {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} color="#06b6d4" /> {job.location}</span>}
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div style={{ ...sectionStyle, borderColor: 'rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={20} color="#ef4444" />
            <span style={{ color: '#fca5a5' }}>{error}</span>
          </div>
        )}
        {success && (
          <div style={{ ...sectionStyle, borderColor: 'rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle size={20} color="#10b981" />
            <span style={{ color: '#6ee7b7' }}>{success}</span>
          </div>
        )}

        {/* ── Personal Info ── */}
        <div style={sectionStyle}>
          <SectionHeader icon={User} title="Personal Information" subtitle="Tell us about yourself" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <IconInput icon={User} placeholder="Full Name" value={form.personal_info.full_name} onChange={e => updatePersonal('full_name', e.target.value)} />
            </div>
            <IconInput icon={Mail} type="email" placeholder="Email" value={form.personal_info.email} onChange={e => updatePersonal('email', e.target.value)} />
            <IconInput icon={Phone} type="tel" placeholder="Phone" value={form.personal_info.phone} onChange={e => updatePersonal('phone', e.target.value)} />
            <div style={{ gridColumn: 'span 2' }}>
              <IconInput icon={MapPin} placeholder="Address" value={form.personal_info.address} onChange={e => updatePersonal('address', e.target.value)} />
            </div>
            <IconInput icon={Calendar} type="date" placeholder="DOB" value={form.personal_info.date_of_birth} onChange={e => updatePersonal('date_of_birth', e.target.value)} />
            <IconInput icon={Flag} placeholder="Nationality" value={form.personal_info.nationality} onChange={e => updatePersonal('nationality', e.target.value)} />
          </div>
        </div>

        {/* ── Resume ── */}
        <div style={sectionStyle}>
          <SectionHeader icon={FileText} title="Resume / CV" subtitle="Upload your latest resume" />
          <div style={{ border: '2px dashed rgba(30,58,66,0.6)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} id="resume-upload" style={{ display: 'none' }} />
            <label htmlFor="resume-upload" style={{ cursor: 'pointer' }}>
              {form.resume ? (
                <>
                  <CheckCircle size={36} color="#10b981" style={{ marginBottom: 8 }} />
                  <p style={{ color: '#10b981', fontWeight: 700 }}>{form.resume.name}</p>
                  <p style={{ color: '#6b7280', fontSize: 13 }}>Click to replace</p>
                </>
              ) : (
                <>
                  <Upload size={36} color="#14b8a6" style={{ marginBottom: 8 }} />
                  <p style={{ fontWeight: 700 }}>Drop your resume here or click to browse</p>
                  <p style={{ color: '#6b7280', fontSize: 13 }}>PDF, DOC, DOCX</p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* ── Work Experience ── */}
        <div style={sectionStyle}>
          <SectionHeader icon={Briefcase} title="Work Experience" subtitle="Your professional journey" />
          {form.work_experience.length > 0 ? form.work_experience.map((exp, idx) => (
            <div key={idx} style={{ background: 'rgba(20,40,50,0.5)', borderRadius: 12, padding: 16, marginBottom: 12, borderLeft: '4px solid #14b8a6' }}>
              <h4 style={{ margin: 0, fontWeight: 700 }}>{exp.job_title}</h4>
              <p style={{ margin: '4px 0 0', color: '#14b8a6', fontSize: 14 }}>{exp.company}</p>
              <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {exp.employment_dates}
              </p>
              {exp.description && <p style={{ margin: '8px 0 0', color: '#9ca3af', fontSize: 13 }}>{exp.description}</p>}
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: 24, color: '#6b7280' }}>
              <Briefcase size={28} style={{ marginBottom: 8 }} />
              <p style={{ fontWeight: 600 }}>Fresh Graduate — No work experience yet</p>
            </div>
          )}
        </div>

        {/* ── Education ── */}
        <div style={sectionStyle}>
          <SectionHeader icon={GraduationCap} title="Education" subtitle="Your academic background" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {form.education_info.ssc && (
              <div style={{ background: 'rgba(20,40,50,0.5)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Award size={16} color="#14b8a6" />
                  <h4 style={{ margin: 0, fontWeight: 700 }}>SSC</h4>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>{form.education_info.ssc.school_name}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Year: {form.education_info.ssc.year} | Result: {form.education_info.ssc.result}</p>
              </div>
            )}
            {form.education_info.hsc && (
              <div style={{ background: 'rgba(20,40,50,0.5)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Award size={16} color="#14b8a6" />
                  <h4 style={{ margin: 0, fontWeight: 700 }}>HSC</h4>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>{form.education_info.hsc.college_name}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Year: {form.education_info.hsc.year} | Result: {form.education_info.hsc.result}</p>
              </div>
            )}
            {form.education_info.university && (
              <div style={{ gridColumn: 'span 2', background: 'rgba(20,40,50,0.5)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <GraduationCap size={16} color="#14b8a6" />
                  <h4 style={{ margin: 0, fontWeight: 700 }}>University</h4>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>{form.education_info.university.name}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Status: {form.education_info.university.status} | CGPA: {form.education_info.university.cgpa}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Skills ── */}
        <div style={sectionStyle}>
          <SectionHeader icon={Zap} title="Skills" subtitle="Your expertise" />
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <IconInput icon={Plus} placeholder="Add a skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} />
            <button onClick={addSkill} style={btnPrimary}><Plus size={16} /> Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {form.skills.map((s, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10, background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.3)', color: '#2dd4bf', fontSize: 13, fontWeight: 600 }}>
                <Zap size={12} /> {s}
                <button onClick={() => updateForm('skills', form.skills.filter(x => x !== s))} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={10} color="#f87171" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ── Cover Letter ── */}
        <div style={sectionStyle}>
          <SectionHeader icon={FileText} title="Cover Letter" subtitle="Make a great first impression" />
          <textarea
            value={form.cover_letter}
            onChange={e => updateForm('cover_letter', e.target.value)}
            placeholder="Write your cover letter..."
            rows={10}
            style={{ ...inputStyle, minHeight: 200, resize: 'vertical' }}
          />
        </div>

        {/* ── Screening Questions ── */}
        {screeningQuestions.length > 0 && (
          <div style={sectionStyle}>
            <SectionHeader icon={HelpCircle} title="Screening Questions" subtitle="Answer employer questions" />
            {screeningQuestions.map(q => {
              const resp = form.screening_responses.find(r => r.question_id === q.id)?.response || '';
              return (
                <div key={q.id} style={{ background: 'rgba(20,40,50,0.5)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <MessageSquare size={16} color="#f59e0b" />
                    <p style={{ margin: 0, fontWeight: 700 }}>{q.question_text}{q.required && <span style={{ color: '#ef4444' }}> *</span>}</p>
                  </div>
                  {q.question_type === 'text' && (
                    <textarea style={{ ...inputStyle, minHeight: 80 }} value={resp} onChange={e => updateScreeningResponse(q.id, e.target.value)} />
                  )}
                  {q.question_type === 'yes_no' && (
                    <div style={{ display: 'flex', gap: 16 }}>
                      {['yes', 'no'].map(o => (
                        <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                          <input type="radio" name={`q-${q.id}`} value={o} checked={resp === o} onChange={e => updateScreeningResponse(q.id, e.target.value)} />
                          <span style={{ textTransform: 'capitalize' }}>{o}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.question_type === 'multiple_choice' && (q.options || []).map((o, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 4 }}>
                      <input type="radio" name={`q-${q.id}`} value={o} checked={resp === o} onChange={e => updateScreeningResponse(q.id, e.target.value)} />
                      {o}
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Work Eligibility ── */}
        <div style={sectionStyle}>
          <SectionHeader icon={Shield} title="Work Eligibility" subtitle="Legal authorization" />
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.work_eligibility?.authorized_to_work !== false} onChange={e => updateForm('work_eligibility', { ...form.work_eligibility, authorized_to_work: e.target.checked })} />
            <span>I am authorized to work in this country</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.work_eligibility?.visa_sponsorship_needed === true} onChange={e => updateForm('work_eligibility', { ...form.work_eligibility, visa_sponsorship_needed: e.target.checked })} />
            <span>I may need visa sponsorship</span>
          </label>
        </div>

        {/* ── References ── */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionHeader icon={Users} title="References" subtitle="Professional references (optional)" />
            <button onClick={addReference} style={btnSecondary}><Plus size={14} /> Add</button>
          </div>
          {form.references.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#6b7280' }}>
              <Users size={28} style={{ marginBottom: 8 }} />
              <p>No references added yet.</p>
            </div>
          ) : form.references.map((ref, idx) => (
            <div key={idx} style={{ background: 'rgba(20,40,50,0.5)', borderRadius: 12, padding: 16, marginBottom: 12, borderLeft: '3px solid rgba(30,58,66,0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 700 }}>Reference #{idx + 1}</span>
                <button onClick={() => removeReference(idx)} style={{ background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}>
                  <Trash2 size={14} color="#f87171" />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <IconInput icon={User} placeholder="Full Name" value={ref.name} onChange={e => updateReference(idx, 'name', e.target.value)} />
                <IconInput icon={Briefcase} placeholder="Relationship" value={ref.relationship} onChange={e => updateReference(idx, 'relationship', e.target.value)} />
                <IconInput icon={Mail} type="email" placeholder="Email" value={ref.email} onChange={e => updateReference(idx, 'email', e.target.value)} />
                <IconInput icon={Phone} type="tel" placeholder="Phone" value={ref.phone} onChange={e => updateReference(idx, 'phone', e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Online Profiles ── */}
        <div style={sectionStyle}>
          <SectionHeader icon={Globe} title="Online Profiles" subtitle="Your web presence" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <IconInput icon={Linkedin} type="url" placeholder="LinkedIn URL" value={form.online_profiles?.linkedin} onChange={e => updateForm('online_profiles', { ...form.online_profiles, linkedin: e.target.value })} />
            <IconInput icon={Link} type="url" placeholder="Portfolio URL" value={form.online_profiles?.portfolio} onChange={e => updateForm('online_profiles', { ...form.online_profiles, portfolio: e.target.value })} />
            <IconInput icon={Github} type="url" placeholder="GitHub URL" value={form.online_profiles?.github} onChange={e => updateForm('online_profiles', { ...form.online_profiles, github: e.target.value })} />
          </div>
        </div>

        {/* ── Submit ── */}
        <button onClick={submitApplication} disabled={submitting} style={{ ...btnPrimary, width: '100%', justifyContent: 'center', padding: 16, fontSize: 16, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : <><Send size={20} /> Submit Application</>}
        </button>
        <style>{`@keyframes spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  );
};

export default JobApplicationForm;
