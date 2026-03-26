import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

/* ═══════════════════════════════════════════════════════════════
   STAGE 1: BASIC
   — Single-page form, plain inputs, minimal styling
   — Core functionality only: init, fill, upload, submit
   ═══════════════════════════════════════════════════════════════ */

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  /* ── Load data ── */
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

  const updatePersonal = (key, val) => {
    updateForm('personal_info', { ...form.personal_info, [key]: val });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) updateForm('resume', file);
  };

  const updateScreeningResponse = (questionId, response) => {
    const existing = form.screening_responses.find(r => r.question_id === questionId);
    if (existing) existing.response = response;
    else form.screening_responses.push({ question_id: questionId, response });
    setForm({ ...form });
  };

  /* ── Submit ── */
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

      await api.post('/job-applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Application submitted successfully!');
      setTimeout(() => window.location.assign('/jobs'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Renders ── */
  if (loading) return <div style={styles.center}><p>Loading...</p></div>;
  if (error && !job) return (
    <div style={styles.center}>
      <p style={{ color: '#ef4444' }}>{error}</p>
      <button onClick={() => navigate('/jobs')} style={styles.btn}>Back to Jobs</button>
    </div>
  );
  if (!job) return (
    <div style={styles.center}>
      <p>Job not found</p>
      <button onClick={() => navigate('/jobs')} style={styles.btn}>Back to Jobs</button>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <h1 style={styles.title}>Apply for: {job.title}</h1>
        <p style={styles.subtitle}>{job.company} {job.location ? `• ${job.location}` : ''}</p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        {/* Personal Info */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Personal Information</legend>
          <div style={styles.grid}>
            <input style={styles.input} placeholder="Full Name" value={form.personal_info.full_name || ''} onChange={e => updatePersonal('full_name', e.target.value)} />
            <input style={styles.input} placeholder="Email" type="email" value={form.personal_info.email || ''} onChange={e => updatePersonal('email', e.target.value)} />
            <input style={styles.input} placeholder="Phone" type="tel" value={form.personal_info.phone || ''} onChange={e => updatePersonal('phone', e.target.value)} />
            <input style={styles.input} placeholder="Address" value={form.personal_info.address || ''} onChange={e => updatePersonal('address', e.target.value)} />
            <input style={styles.input} placeholder="Date of Birth" type="date" value={form.personal_info.date_of_birth || ''} onChange={e => updatePersonal('date_of_birth', e.target.value)} />
            <input style={styles.input} placeholder="Nationality" value={form.personal_info.nationality || ''} onChange={e => updatePersonal('nationality', e.target.value)} />
          </div>
        </fieldset>

        {/* Resume */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Resume</legend>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
          {form.resume && <p style={{ marginTop: 8, color: '#10b981' }}>✓ {form.resume.name}</p>}
        </fieldset>

        {/* Cover Letter */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Cover Letter</legend>
          <textarea
            style={{ ...styles.input, minHeight: 160, resize: 'vertical' }}
            placeholder="Write your cover letter..."
            value={form.cover_letter}
            onChange={e => updateForm('cover_letter', e.target.value)}
          />
        </fieldset>

        {/* Screening Questions */}
        {screeningQuestions.length > 0 && (
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Screening Questions</legend>
            {screeningQuestions.map(q => (
              <div key={q.id} style={{ marginBottom: 16 }}>
                <label style={styles.label}>{q.question_text}{q.required && ' *'}</label>
                {q.question_type === 'text' && (
                  <textarea style={{ ...styles.input, minHeight: 80 }} value={form.screening_responses.find(r => r.question_id === q.id)?.response || ''} onChange={e => updateScreeningResponse(q.id, e.target.value)} />
                )}
                {q.question_type === 'yes_no' && (
                  <div style={{ display: 'flex', gap: 16 }}>
                    {['yes', 'no'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="radio" name={`q-${q.id}`} value={opt} checked={form.screening_responses.find(r => r.question_id === q.id)?.response === opt} onChange={e => updateScreeningResponse(q.id, e.target.value)} />
                        <span style={{ textTransform: 'capitalize' }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.question_type === 'multiple_choice' && (q.options || []).map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <input type="radio" name={`q-${q.id}`} value={opt} checked={form.screening_responses.find(r => r.question_id === q.id)?.response === opt} onChange={e => updateScreeningResponse(q.id, e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
          </fieldset>
        )}

        {/* Work Eligibility */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Work Eligibility</legend>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input type="checkbox" checked={form.work_eligibility?.authorized_to_work !== false} onChange={e => updateForm('work_eligibility', { ...form.work_eligibility, authorized_to_work: e.target.checked })} />
            I am authorized to work in this country
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.work_eligibility?.visa_sponsorship_needed === true} onChange={e => updateForm('work_eligibility', { ...form.work_eligibility, visa_sponsorship_needed: e.target.checked })} />
            I may need visa sponsorship
          </label>
        </fieldset>

        {/* Submit */}
        <button onClick={submitApplication} disabled={submitting} style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: 16 }}>
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
};

/* ── Inline styles ── */
const styles = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '40px 16px', fontFamily: 'system-ui, sans-serif' },
  container: { maxWidth: 700, margin: '0 auto' },
  center: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 4 },
  subtitle: { color: '#6b7280', marginBottom: 24 },
  fieldset: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, marginBottom: 20 },
  legend: { fontWeight: 700, fontSize: 16, padding: '0 8px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  label: { display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 14 },
  btn: { padding: '10px 24px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: '#e5e7eb' },
  btnPrimary: { background: '#14b8a6', color: '#fff' },
  error: { background: '#fef2f2', color: '#ef4444', padding: 12, borderRadius: 6, marginBottom: 16 },
  success: { background: '#ecfdf5', color: '#10b981', padding: 12, borderRadius: 6, marginBottom: 16 },
};

export default JobApplicationForm;
