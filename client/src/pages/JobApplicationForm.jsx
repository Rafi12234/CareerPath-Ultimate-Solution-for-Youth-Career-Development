import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  X, Send, Loader2, Upload, Sparkles, AlertCircle, CheckCircle,
  ChevronRight, ChevronLeft, FileText, User, Briefcase, GraduationCap,
  Zap, Shield, Users, Globe, Plus, Trash2, Check, Star,
  Award, Clock, MapPin, Building2, Phone, Mail, Calendar, Flag,
  Link, Github, Linkedin, MessageSquare, HelpCircle, Brain, Wand2
} from 'lucide-react';
import api from '../utils/api';

/* ═══════════════════════════════════════════════════════════════
   STAGE 3: INTERMEDIATE
   — 6-step wizard with progress bar
   — Extracted reusable sub-components
   — Basic hover/focus transitions, dark glass cards
   — AI cover letter modal (basic)
   ═══════════════════════════════════════════════════════════════ */

const css = `
  .s3-input {
    width: 100%; padding: 12px 14px; background: rgba(10,26,34,0.6);
    border: 1px solid rgba(30,58,66,0.5); border-radius: 12px;
    color: #fff; font-size: 14px; outline: none; box-sizing: border-box;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .s3-input:focus {
    border-color: rgba(20,184,166,0.5);
    box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
  }
  .s3-input:hover:not(:focus) { border-color: rgba(30,58,66,0.8); }

  .s3-card {
    background: rgba(15,25,35,0.95); border: 1px solid rgba(30,58,66,0.4);
    border-radius: 20px; padding: 24px;
  }
  .s3-card-inner {
    background: rgba(20,40,50,0.5); border: 1px solid rgba(30,58,66,0.25);
    border-radius: 16px; padding: 20px;
    transition: box-shadow 0.3s, border-color 0.3s;
  }
  .s3-card-inner:hover {
    box-shadow: 0 0 20px rgba(20,184,166,0.08);
    border-color: rgba(20,184,166,0.2);
  }

  .s3-btn-primary {
    background: linear-gradient(135deg, #14b8a6, #0d9488); color: #fff;
    border: none; border-radius: 12px; padding: 14px 28px; font-weight: 700;
    cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 8;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .s3-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -8px rgba(20,184,166,0.4);
  }
  .s3-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .s3-btn-secondary {
    background: rgba(30,58,66,0.4); border: 1px solid rgba(30,58,66,0.6);
    border-radius: 12px; padding: 14px 24px; color: #fff; font-weight: 700;
    cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 8;
    transition: background 0.2s, border-color 0.2s;
  }
  .s3-btn-secondary:hover { background: rgba(30,58,66,0.6); border-color: rgba(20,184,166,0.3); }
  .s3-btn-secondary:disabled { opacity: 0.3; cursor: not-allowed; }

  .s3-btn-ai {
    background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(168,85,247,0.2));
    border: 1px solid rgba(139,92,246,0.3); border-radius: 12px; padding: 10px 18px;
    color: #c4b5fd; font-weight: 700; cursor: pointer; font-size: 14px;
    display: inline-flex; align-items: center; gap: 6;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .s3-btn-ai:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -8px rgba(139,92,246,0.25); }

  .s3-upload {
    border: 2px dashed rgba(30,58,66,0.6); border-radius: 16px; padding: 40px; text-align: center;
    cursor: pointer; transition: border-color 0.3s, background 0.3s;
  }
  .s3-upload:hover { border-color: rgba(20,184,166,0.4); background: rgba(20,184,166,0.03); }

  .s3-skill {
    display: inline-flex; align-items: center; gap: 8; padding: 6px 14px;
    border-radius: 12px; background: rgba(20,184,166,0.12); border: 1px solid rgba(20,184,166,0.3);
    color: #2dd4bf; font-size: 13px; font-weight: 600;
    transition: transform 0.2s;
  }
  .s3-skill:hover { transform: translateY(-2px); }

  .s3-progress-track { height: 8px; background: rgba(30,58,66,0.4); border-radius: 100px; overflow: hidden; margin-bottom: 20px; }
  .s3-progress-fill { height: 100%; background: linear-gradient(90deg, #14b8a6, #06b6d4); border-radius: 100px; transition: width 0.6s ease; }

  .s3-step-dot {
    width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; transition: all 0.3s;
  }
  .s3-step-dot.active { background: #14b8a6; color: #fff; box-shadow: 0 0 20px rgba(20,184,166,0.3); }
  .s3-step-dot.completed { background: linear-gradient(135deg, #14b8a6, #10b981); color: #fff; }
  .s3-step-dot.pending { background: rgba(30,58,66,0.4); color: #6b7280; }

  @keyframes spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }
`;

/* ── Reusable Components ── */

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(20,184,166,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={22} color="#14b8a6" />
    </div>
    <div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff' }}>{title}</h2>
      {subtitle && <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: 13 }}>{subtitle}</p>}
    </div>
  </div>
);

const AnimatedInput = ({ icon: Icon, type = 'text', placeholder, value, onChange, ...props }) => (
  <div style={{ position: 'relative' }}>
    {Icon && <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4b5563', pointerEvents: 'none', zIndex: 1 }} />}
    <input type={type} placeholder={placeholder} value={value || ''} onChange={onChange} className="s3-input" style={{ paddingLeft: Icon ? 42 : 14 }} {...props} />
  </div>
);

const AnimatedTextarea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea value={value || ''} onChange={onChange} placeholder={placeholder} rows={rows} className="s3-input" style={{ resize: 'none' }} />
);

const StepProgress = ({ currentStep, totalSteps, stepLabels }) => (
  <div style={{ marginBottom: 32 }}>
    <div className="s3-progress-track">
      <div className="s3-progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {stepLabels.map((label, i) => {
        const num = i + 1;
        const cls = currentStep > num ? 'completed' : currentStep === num ? 'active' : 'pending';
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div className={`s3-step-dot ${cls}`}>{cls === 'completed' ? <Check size={16} /> : num}</div>
            <span style={{ fontSize: 11, fontWeight: 600, color: cls === 'active' ? '#14b8a6' : cls === 'completed' ? '#10b981' : '#6b7280' }}>{label}</span>
          </div>
        );
      })}
    </div>
  </div>
);

const FileUploadZone = ({ file, onUpload }) => (
  <div className="s3-upload">
    <input type="file" accept=".pdf,.doc,.docx" onChange={onUpload} id="resume-up" style={{ display: 'none' }} />
    <label htmlFor="resume-up" style={{ cursor: 'pointer', display: 'block' }}>
      {file ? (
        <>
          <CheckCircle size={36} color="#10b981" style={{ marginBottom: 8 }} />
          <p style={{ color: '#10b981', fontWeight: 700, fontSize: 16, margin: 0 }}>{file.name}</p>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>Click to replace</p>
        </>
      ) : (
        <>
          <Upload size={36} color="#14b8a6" style={{ marginBottom: 8 }} />
          <p style={{ fontWeight: 700, fontSize: 16, margin: 0, color: '#fff' }}>Drop your resume here</p>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>or click to browse — PDF, DOC, DOCX</p>
        </>
      )}
    </label>
  </div>
);

/* ── Step Panels ── */

const Step1Personal = ({ form, updateForm }) => {
  const up = (k, v) => updateForm('personal_info', { ...form.personal_info, [k]: v });
  return (
    <div>
      <SectionHeader icon={User} title="Personal Information" subtitle="Tell us about yourself" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ gridColumn: 'span 2' }}><AnimatedInput icon={User} placeholder="Full Name" value={form.personal_info.full_name} onChange={e => up('full_name', e.target.value)} /></div>
        <AnimatedInput icon={Mail} type="email" placeholder="Email" value={form.personal_info.email} onChange={e => up('email', e.target.value)} />
        <AnimatedInput icon={Phone} type="tel" placeholder="Phone" value={form.personal_info.phone} onChange={e => up('phone', e.target.value)} />
        <div style={{ gridColumn: 'span 2' }}><AnimatedInput icon={MapPin} placeholder="Address" value={form.personal_info.address} onChange={e => up('address', e.target.value)} /></div>
        <AnimatedInput icon={Calendar} type="date" placeholder="DOB" value={form.personal_info.date_of_birth} onChange={e => up('date_of_birth', e.target.value)} />
        <AnimatedInput icon={Flag} placeholder="Nationality" value={form.personal_info.nationality} onChange={e => up('nationality', e.target.value)} />
      </div>
    </div>
  );
};

const Step2Resume = ({ form, handleResumeUpload }) => (
  <div>
    <SectionHeader icon={FileText} title="Resume / CV" subtitle="Upload your latest resume" />
    <FileUploadZone file={form.resume} onUpload={handleResumeUpload} />
    <div className="s3-card-inner" style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Star size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: '#fff' }}>Pro Tip</p>
          <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: 13 }}>Tailor your resume to this specific role for the best results.</p>
        </div>
      </div>
    </div>
  </div>
);

const Step3Experience = ({ form, updateForm }) => {
  const [newSkill, setNewSkill] = useState('');
  const addSkill = () => { if (newSkill.trim() && !form.skills.includes(newSkill.trim())) { updateForm('skills', [...form.skills, newSkill.trim()]); setNewSkill(''); } };

  return (
    <div>
      {/* Work Experience */}
      <SectionHeader icon={Briefcase} title="Work Experience" subtitle="Your professional journey" />
      {form.work_experience.length > 0 ? form.work_experience.map((exp, i) => (
        <div key={i} className="s3-card-inner" style={{ marginBottom: 12, borderLeft: '4px solid #14b8a6' }}>
          <h4 style={{ margin: 0, fontWeight: 700, color: '#fff' }}>{exp.job_title}</h4>
          <p style={{ margin: '4px 0', color: '#14b8a6', fontSize: 14, fontWeight: 600 }}>{exp.company}</p>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {exp.employment_dates}</p>
          {exp.description && <p style={{ margin: '8px 0 0', color: '#9ca3af', fontSize: 13 }}>{exp.description}</p>}
        </div>
      )) : (
        <div style={{ textAlign: 'center', padding: 32, color: '#6b7280' }}>
          <Briefcase size={32} style={{ marginBottom: 8 }} />
          <p style={{ fontWeight: 600, margin: 0 }}>Fresh Graduate</p>
          <p style={{ fontSize: 13, margin: '4px 0 0', color: '#4b5563' }}>No work experience yet</p>
        </div>
      )}

      {/* Education */}
      <div style={{ marginTop: 32 }}>
        <SectionHeader icon={GraduationCap} title="Education" subtitle="Academic background" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {form.education_info.ssc && (
            <div className="s3-card-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><Award size={16} color="#14b8a6" /><h4 style={{ margin: 0, fontWeight: 700, color: '#fff' }}>SSC</h4></div>
              <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>{form.education_info.ssc.school_name}</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280' }}>Year: {form.education_info.ssc.year} | Result: {form.education_info.ssc.result}</p>
            </div>
          )}
          {form.education_info.hsc && (
            <div className="s3-card-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><Award size={16} color="#14b8a6" /><h4 style={{ margin: 0, fontWeight: 700, color: '#fff' }}>HSC</h4></div>
              <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>{form.education_info.hsc.college_name}</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280' }}>Year: {form.education_info.hsc.year} | Result: {form.education_info.hsc.result}</p>
            </div>
          )}
          {form.education_info.university && (
            <div className="s3-card-inner" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><GraduationCap size={16} color="#14b8a6" /><h4 style={{ margin: 0, fontWeight: 700, color: '#fff' }}>University</h4></div>
              <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>{form.education_info.university.name}</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280' }}>Status: {form.education_info.university.status} | CGPA: {form.education_info.university.cgpa}</p>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div style={{ marginTop: 32 }}>
        <SectionHeader icon={Zap} title="Skills" subtitle="Your expertise" />
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <AnimatedInput icon={Plus} placeholder="Add a skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} />
          </div>
          <button className="s3-btn-primary" onClick={addSkill}><Plus size={16} /> Add</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {form.skills.map((s, i) => (
            <span key={i} className="s3-skill">
              <Zap size={12} /> {s}
              <button onClick={() => updateForm('skills', form.skills.filter(x => x !== s))} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={10} color="#f87171" />
              </button>
            </span>
          ))}
          {form.skills.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No skills added yet.</p>}
        </div>
      </div>
    </div>
  );
};

const Step4CoverLetter = ({ form, updateForm, onAI, generatingCoverLetter }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <SectionHeader icon={FileText} title="Cover Letter" subtitle="Make a great impression" />
        <button className="s3-btn-ai" onClick={() => setShowModal(true)}><Sparkles size={16} /> AI Assist</button>
      </div>
      <AnimatedTextarea value={form.cover_letter} onChange={e => updateForm('cover_letter', e.target.value)} placeholder="Write your cover letter here..." rows={12} />
      <div className="s3-card-inner" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Wand2 size={18} color="#a78bfa" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#fff' }}>AI-Powered Writing</p>
            <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: 13 }}>Click "AI Assist" to generate a personalized cover letter.</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)} />
          <div className="s3-card" style={{ position: 'relative', maxWidth: 480, width: '100%', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wand2 size={22} color="#a78bfa" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 800, color: '#fff' }}>AI Cover Letter</h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Powered by GPT</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(30,58,66,0.4)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} color="#9ca3af" />
              </button>
            </div>
            <div className="s3-card-inner" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Brain size={18} color="#14b8a6" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, color: '#d1d5db', fontSize: 14, lineHeight: 1.6 }}>
                  I'll analyze the <span style={{ color: '#14b8a6', fontWeight: 600 }}>job requirements</span> and your <span style={{ color: '#14b8a6', fontWeight: 600 }}>profile</span> to craft a personalized cover letter.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="s3-btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="s3-btn-ai" style={{ flex: 1, justifyContent: 'center' }} disabled={generatingCoverLetter} onClick={() => { onAI(); setShowModal(false); }}>
                {generatingCoverLetter ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Sparkles size={16} /> Generate</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Step5Screening = ({ screeningQuestions, form, updateScreeningResponse }) => {
  const getResp = (qid) => form.screening_responses.find(r => r.question_id === qid)?.response || '';
  return (
    <div>
      <SectionHeader icon={HelpCircle} title="Screening Questions" subtitle="Answer employer questions" />
      {screeningQuestions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          <CheckCircle size={36} color="#10b981" style={{ marginBottom: 8 }} />
          <p style={{ fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>No Screening Questions</p>
          <p style={{ fontSize: 13, margin: 0, color: '#6b7280' }}>You can proceed to the next step!</p>
        </div>
      ) : (
        screeningQuestions.map(q => (
          <div key={q.id} className="s3-card-inner" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <MessageSquare size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 3 }} />
              <p style={{ margin: 0, fontWeight: 700, color: '#fff' }}>{q.question_text}{q.required && <span style={{ color: '#ef4444' }}> *</span>}</p>
            </div>
            {q.question_type === 'text' && <AnimatedTextarea value={getResp(q.id)} placeholder="Type your answer..." onChange={e => updateScreeningResponse(q.id, e.target.value)} rows={4} />}
            {q.question_type === 'yes_no' && (
              <div style={{ display: 'flex', gap: 16 }}>
                {['yes', 'no'].map(o => (
                  <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="radio" name={`q-${q.id}`} value={o} checked={getResp(q.id) === o} onChange={e => updateScreeningResponse(q.id, e.target.value)} />
                    <span style={{ color: '#fff', textTransform: 'capitalize' }}>{o}</span>
                  </label>
                ))}
              </div>
            )}
            {q.question_type === 'multiple_choice' && (q.options || []).map((o, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 6 }}>
                <input type="radio" name={`q-${q.id}`} value={o} checked={getResp(q.id) === o} onChange={e => updateScreeningResponse(q.id, e.target.value)} />
                <span style={{ color: '#fff' }}>{o}</span>
              </label>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

const Step6Additional = ({ form, updateForm, addReference, updateReference, removeReference }) => (
  <div>
    {/* Work Eligibility */}
    <SectionHeader icon={Shield} title="Work Eligibility" subtitle="Legal authorization" />
    <div className="s3-card-inner" style={{ marginBottom: 32 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', color: '#fff' }}>
        <input type="checkbox" checked={form.work_eligibility?.authorized_to_work !== false} onChange={e => updateForm('work_eligibility', { ...form.work_eligibility, authorized_to_work: e.target.checked })} />
        I am authorized to work in this country
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#fff' }}>
        <input type="checkbox" checked={form.work_eligibility?.visa_sponsorship_needed === true} onChange={e => updateForm('work_eligibility', { ...form.work_eligibility, visa_sponsorship_needed: e.target.checked })} />
        I may need visa sponsorship
      </label>
    </div>

    {/* References */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <SectionHeader icon={Users} title="References" subtitle="Professional references (optional)" />
      <button className="s3-btn-secondary" onClick={addReference} style={{ padding: '8px 14px', fontSize: 13 }}><Plus size={14} /> Add</button>
    </div>
    {form.references.length === 0 ? (
      <div style={{ textAlign: 'center', padding: 32, color: '#6b7280' }}>
        <Users size={28} style={{ marginBottom: 8 }} /><p style={{ margin: 0 }}>No references added yet.</p>
      </div>
    ) : form.references.map((ref, idx) => (
      <div key={idx} className="s3-card-inner" style={{ marginBottom: 12, borderLeft: '3px solid rgba(30,58,66,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, color: '#fff' }}>Reference #{idx + 1}</span>
          <button onClick={() => removeReference(idx)} style={{ background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}><Trash2 size={14} color="#f87171" /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <AnimatedInput icon={User} placeholder="Full Name" value={ref.name} onChange={e => updateReference(idx, 'name', e.target.value)} />
          <AnimatedInput icon={Briefcase} placeholder="Relationship" value={ref.relationship} onChange={e => updateReference(idx, 'relationship', e.target.value)} />
          <AnimatedInput icon={Mail} type="email" placeholder="Email" value={ref.email} onChange={e => updateReference(idx, 'email', e.target.value)} />
          <AnimatedInput icon={Phone} type="tel" placeholder="Phone" value={ref.phone} onChange={e => updateReference(idx, 'phone', e.target.value)} />
        </div>
      </div>
    ))}

    {/* Online Profiles */}
    <div style={{ marginTop: 32 }}>
      <SectionHeader icon={Globe} title="Online Profiles" subtitle="Your web presence" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatedInput icon={Linkedin} type="url" placeholder="LinkedIn URL" value={form.online_profiles?.linkedin} onChange={e => updateForm('online_profiles', { ...form.online_profiles, linkedin: e.target.value })} />
        <AnimatedInput icon={Link} type="url" placeholder="Portfolio URL" value={form.online_profiles?.portfolio} onChange={e => updateForm('online_profiles', { ...form.online_profiles, portfolio: e.target.value })} />
        <AnimatedInput icon={Github} type="url" placeholder="GitHub URL" value={form.online_profiles?.github} onChange={e => updateForm('online_profiles', { ...form.online_profiles, github: e.target.value })} />
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const JobApplicationForm = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);

  const TOTAL_STEPS = 6;
  const stepLabels = ['Personal', 'Resume', 'Experience', 'Cover Letter', 'Screening', 'Additional'];

  const [form, setForm] = useState({
    personal_info: {}, work_experience: [], education_info: {}, skills: [],
    cover_letter: '', references: [], online_profiles: {}, work_eligibility: {},
    screening_responses: [], resume: null,
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
          ...prev, personal_info: d.pre_filled.personal_info, work_experience: d.pre_filled.work_experience,
          education_info: d.pre_filled.education_info, skills: d.pre_filled.skills,
          work_eligibility: { authorized_to_work: true, visa_sponsorship_needed: false },
          online_profiles: { linkedin: user?.linkedin || '', portfolio: user?.portfolio || '', github: user?.github || '' },
        }));
      } catch (err) {
        if (err.response?.status === 401) { navigate('/login'); return; }
        if (err.response?.status === 403) { setError(err.response?.data?.message || 'Already applied.'); return; }
        setError(err.response?.data?.message || err.message);
      } finally { setLoading(false); }
    };
    load();
  }, [jobId, user, navigate]);

  const updateForm = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);
  const handleResumeUpload = (e) => { if (e.target.files?.[0]) updateForm('resume', e.target.files[0]); };
  const addReference = () => updateForm('references', [...form.references, { name: '', relationship: '', email: '', phone: '' }]);
  const updateReference = (idx, field, value) => { const u = [...form.references]; u[idx][field] = value; updateForm('references', u); };
  const removeReference = (idx) => updateForm('references', form.references.filter((_, i) => i !== idx));
  const updateScreeningResponse = (qid, resp) => {
    const ex = form.screening_responses.find(r => r.question_id === qid);
    if (ex) ex.response = resp; else form.screening_responses.push({ question_id: qid, response: resp });
    setForm({ ...form });
  };

  const generateCoverLetterWithAI = async () => {
    try {
      setGeneratingCoverLetter(true);
      const res = await api.post('/job-applications/generate-cover-letter', {
        job_id: jobId, user_profile: { name: user.name, email: user.email, skills: form.skills, years_of_experience: user.years_of_experience || 0, education: `${user.university_name} - ${user.university_status}` },
      });
      updateForm('cover_letter', res.data.cover_letter);
      setSuccess('AI cover letter generated! Feel free to edit.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) { setError('Failed to generate: ' + (err.response?.data?.message || err.message)); }
    finally { setGeneratingCoverLetter(false); }
  };

  const submitApplication = async () => {
    try {
      setSubmitting(true); setError('');
      const fd = new FormData();
      fd.append('user_id', user.id); fd.append('job_id', jobId);
      fd.append('personal_info', JSON.stringify(form.personal_info));
      fd.append('work_experience', JSON.stringify(form.work_experience));
      fd.append('education_info', JSON.stringify(form.education_info));
      fd.append('skills', JSON.stringify(form.skills));
      fd.append('cover_letter', form.cover_letter);
      fd.append('references', JSON.stringify(form.references));
      fd.append('online_profiles', JSON.stringify(form.online_profiles));
      fd.append('work_eligibility', JSON.stringify(form.work_eligibility));
      fd.append('screening_responses', JSON.stringify(form.screening_responses));
      if (form.resume) fd.append('resume', form.resume);
      await api.post('/job-applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Application submitted successfully!');
      setTimeout(() => window.location.assign('/jobs'), 2000);
    } catch (err) {
      if (err.response?.status === 409) setError('You have already applied.');
      else setError(err.response?.data?.error || err.response?.data?.message || err.message);
    } finally { setSubmitting(false); }
  };

  const nextStep = () => setCurrentStep(Math.min(TOTAL_STEPS, currentStep + 1));
  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#030810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{css}</style>
      <Loader2 size={40} color="#14b8a6" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (error && !job) return (
    <div style={{ minHeight: '100vh', background: '#030810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <style>{css}</style>
      <AlertCircle size={48} color="#ef4444" />
      <p style={{ color: '#fca5a5', maxWidth: 400, textAlign: 'center' }}>{error}</p>
      <button className="s3-btn-primary" onClick={() => navigate('/jobs')}><ChevronLeft size={16} /> Back to Jobs</button>
    </div>
  );

  if (!job) return (
    <div style={{ minHeight: '100vh', background: '#030810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <style>{css}</style>
      <p style={{ color: '#9ca3af' }}>Job not found</p>
      <button className="s3-btn-primary" onClick={() => navigate('/jobs')}>Back to Jobs</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#030810', padding: '100px 16px 40px', fontFamily: 'system-ui, sans-serif', color: '#fff' }}>
      <style>{css}</style>
      <div style={{ maxWidth: 850, margin: '0 auto' }}>

        {/* Header */}
        <div className="s3-card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(20,184,166,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Briefcase size={28} color="#14b8a6" />
          </div>
          <div>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.3)', color: '#2dd4bf', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Applying</span>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{job.title}</h1>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>{job.company}{job.location ? ` • ${job.location}` : ''}</p>
          </div>
        </div>

        {/* Progress */}
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} stepLabels={stepLabels} />

        {/* Messages */}
        {error && (
          <div className="s3-card" style={{ borderColor: 'rgba(239,68,68,0.3)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={20} color="#ef4444" /><span style={{ color: '#fca5a5' }}>{error}</span>
          </div>
        )}
        {success && (
          <div className="s3-card" style={{ borderColor: 'rgba(16,185,129,0.3)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle size={20} color="#10b981" /><span style={{ color: '#6ee7b7' }}>{success}</span>
          </div>
        )}

        {/* Step Content */}
        <div className="s3-card" style={{ marginBottom: 24 }}>
          {currentStep === 1 && <Step1Personal form={form} updateForm={updateForm} />}
          {currentStep === 2 && <Step2Resume form={form} handleResumeUpload={handleResumeUpload} />}
          {currentStep === 3 && <Step3Experience form={form} updateForm={updateForm} />}
          {currentStep === 4 && <Step4CoverLetter form={form} updateForm={updateForm} onAI={generateCoverLetterWithAI} generatingCoverLetter={generatingCoverLetter} />}
          {currentStep === 5 && <Step5Screening screeningQuestions={screeningQuestions} form={form} updateScreeningResponse={updateScreeningResponse} />}
          {currentStep === 6 && <Step6Additional form={form} updateForm={updateForm} addReference={addReference} updateReference={updateReference} removeReference={removeReference} />}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <button className="s3-btn-secondary" onClick={prevStep} disabled={currentStep === 1}><ChevronLeft size={18} /> Previous</button>
          {currentStep === TOTAL_STEPS ? (
            <button className="s3-btn-primary" onClick={submitApplication} disabled={submitting}>
              {submitting ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : <><Send size={18} /> Submit Application</>}
            </button>
          ) : (
            <button className="s3-btn-primary" onClick={nextStep}>Continue <ChevronRight size={18} /></button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;
