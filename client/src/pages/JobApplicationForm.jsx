import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  X, Send, Loader2, Upload, FileUp, Sparkles, AlertCircle, CheckCircle,
  ChevronRight, ChevronLeft, FileText, User, Briefcase, GraduationCap,
  Zap, Shield, Users, Globe, Plus, Trash2, Edit3
} from 'lucide-react';
import api from '../utils/api';

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(''); // 'uploading', 'validating', 'submitting'
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    personal_info: {},
    work_experience: [],
    education_info: {},
    skills: [],
    cover_letter: '',
    references: [],
    online_profiles: {},
    work_eligibility: {},
    additional_documents: {},
    screening_responses: [],
    resume: null,
  });

  const [screeningQuestions, setScreeningQuestions] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadApplicationData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/job-applications/init/${jobId}`);
        const data = response.data;

        setJob(data.job);
        setScreeningQuestions(data.screening_questions);

        // Pre-fill form with user data
        setForm(prev => ({
          ...prev,
          personal_info: data.pre_filled.personal_info,
          work_experience: data.pre_filled.work_experience,
          education_info: data.pre_filled.education_info,
          skills: data.pre_filled.skills,
          work_eligibility: {
            authorized_to_work: true,
            visa_sponsorship_needed: false,
          },
          online_profiles: {
            linkedin: user?.linkedin || '',
            portfolio: user?.portfolio || '',
            github: user?.github || '',
          },
          references: [],
        }));
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        if (err.response?.status === 403) {
          setError(err.response?.data?.message || 'You have already applied for this position.');
          return;
        }
        setError('Failed to load job application form: ' + (err.response?.data?.message || err.message));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadApplicationData();
  }, [jobId, user]);

  // Update form field
  const updateForm = useCallback((field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle file upload
  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      updateForm('resume', file);
    }
  };

  // Add reference
  const addReference = () => {
    updateForm('references', [...form.references, {
      name: '',
      relationship: '',
      email: '',
      phone: '',
    }]);
  };

  // Update reference
  const updateReference = (index, field, value) => {
    const updated = [...form.references];
    updated[index][field] = value;
    updateForm('references', updated);
  };

  // Remove reference
  const removeReference = (index) => {
    updateForm('references', form.references.filter((_, i) => i !== index));
  };

  // Add screening response
  const updateScreeningResponse = (questionId, response) => {
    const existing = form.screening_responses.find(r => r.question_id === questionId);
    if (existing) {
      existing.response = response;
    } else {
      form.screening_responses.push({ question_id: questionId, response });
    }
    setForm({ ...form });
  };

  // Generate cover letter with AI
  const generateCoverLetterWithAI = async () => {
    try {
      setGeneratingCoverLetter(true);
      const response = await api.post('/job-applications/generate-cover-letter', {
        job_id: jobId,
        user_profile: {
          name: user.name,
          email: user.email,
          skills: form.skills,
          years_of_experience: user.years_of_experience || 0,
          education: `${user.university_name} - ${user.university_status}`,
        },
      });

      updateForm('cover_letter', response.data.cover_letter);
      setShowAIModal(false);
      setSuccess('AI-generated cover letter added! Feel free to edit.');
    } catch (err) {
      setError('Failed to generate cover letter: ' + (err.response?.data?.message || err.message));
    } finally {
      setGeneratingCoverLetter(false);
    }
  };

  // Submit application
  const submitApplication = async () => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      setSubmissionStatus('Preparing form data...');

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

      if (form.resume) {
        setSubmissionStatus('Uploading resume to Filestack...');
        formData.append('resume', form.resume);
      }

      setSubmissionStatus('Submitting application...');

      const response = await api.post('/job-applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Job application submitted successfully!');
      setSubmissionStatus('');
      
      setTimeout(() => {
        window.location.assign('/jobs');
      }, 2000);
    } catch (err) {
      setSubmissionStatus('');

      const backendMessage = err.response?.data?.message;
      const backendError = err.response?.data?.error;
      const errorMessage = backendError
        || backendMessage
        || err.response?.data?.errors
        || err.response?.status
        || err.message
        || 'An unexpected error occurred';
      
      let displayError = 'Failed to submit application';
      
      if (typeof errorMessage === 'object') {
        const messages = Object.values(errorMessage).flat();
        displayError += ': ' + messages.join(', ');
      } else if (errorMessage === 409 || errorMessage === '409') {
        displayError = 'You have already applied for this position';
      } else if (errorMessage === 500 || errorMessage === '500') {
        displayError = displayError + ': Server error. Please try again or contact support.';
      } else {
        displayError += ': ' + errorMessage;
      }
      
      setError(displayError);
      console.error('Application submission error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        formDataKeys: Array.from(formData.keys()),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mb-4 mx-auto" size={48} />
          <p className="text-gray-400">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-xl px-6">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-white mb-2">Unable to proceed</p>
          <p className="text-red-300 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
            >
              Back to Jobs
            </button>
            {error.includes('already applied') && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                View My Applications
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-white mb-4">Job not found</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const TOTAL_STEPS = 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Apply for Position</h1>
          <p className="text-gray-400">{job.title} at {job.company}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Step {currentStep} of {TOTAL_STEPS}</span>
            <span className="text-sm text-gray-400">{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 text-red-300 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-lg flex items-start gap-3">
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p>{success}</p>
          </div>
        )}
        {submissionStatus && (
          <div className="mb-6 p-4 bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-lg flex items-start gap-3">
            <Loader2 size={20} className="flex-shrink-0 mt-0.5 animate-spin" />
            <p>{submissionStatus}</p>
          </div>
        )}

        {/* Form steps */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 mb-8">
          {currentStep === 1 && <PersonalInfoStep form={form} updateForm={updateForm} />}
          {currentStep === 2 && <ResumeStep form={form} handleResumeUpload={handleResumeUpload} />}
          {/* Experience & Education Step */}
        {currentStep === 3 && <ExperienceEducationStep form={form} updateForm={updateForm} />}
          {currentStep === 4 && <CoverLetterStep form={form} updateForm={updateForm} showAIModal={showAIModal} setShowAIModal={setShowAIModal} generatingCoverLetter={generatingCoverLetter} generateCoverLetter={generateCoverLetterWithAI} />}
          {currentStep === 5 && <ScreeningQuestionsStep screeningQuestions={screeningQuestions} form={form} updateScreeningResponse={updateScreeningResponse} />}
          {currentStep === 6 && (
            <div className="space-y-6">
              <WorkEligibilityStep form={form} updateForm={updateForm} />
              <div className="border-t border-slate-700 pt-6">
                <ReferencesStep form={form} addReference={addReference} updateReference={updateReference} removeReference={removeReference} />
              </div>
              <div className="border-t border-slate-700 pt-6">
                <OnlineProfilesStep form={form} updateForm={updateForm} />
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-600 text-white rounded-lg flex items-center gap-2 transition-all"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {currentStep === TOTAL_STEPS ? (
            <button
              onClick={submitApplication}
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 transition-all"
              title={submitting ? "Please wait while we process your application..." : "Submit your job application"}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {submissionStatus || 'Processing...'}
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Application
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(TOTAL_STEPS, currentStep + 1))}
              className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg flex items-center gap-2 transition-all"
            >
              Next
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Step Components
const PersonalInfoStep = ({ form, updateForm }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-6">
      <User className="text-teal-400" />
      <h2 className="text-2xl font-bold text-white">Personal Information</h2>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Full Name"
        value={form.personal_info.full_name || ''}
        onChange={(e) => updateForm('personal_info', { ...form.personal_info, full_name: e.target.value })}
        className="col-span-2 bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.personal_info.email || ''}
        onChange={(e) => updateForm('personal_info', { ...form.personal_info, email: e.target.value })}
        className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
      />
      <input
        type="tel"
        placeholder="Phone"
        value={form.personal_info.phone || ''}
        onChange={(e) => updateForm('personal_info', { ...form.personal_info, phone: e.target.value })}
        className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
      />
      <input
        type="text"
        placeholder="Address"
        value={form.personal_info.address || ''}
        onChange={(e) => updateForm('personal_info', { ...form.personal_info, address: e.target.value })}
        className="col-span-2 bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
      />
      <input
        type="date"
        placeholder="Date of Birth"
        value={form.personal_info.date_of_birth || ''}
        onChange={(e) => updateForm('personal_info', { ...form.personal_info, date_of_birth: e.target.value })}
        className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
      />
      <input
        type="text"
        placeholder="Nationality"
        value={form.personal_info.nationality || ''}
        onChange={(e) => updateForm('personal_info', { ...form.personal_info, nationality: e.target.value })}
        className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
      />
    </div>
  </div>
);

const ResumeStep = ({ form, handleResumeUpload }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-6">
      <FileText className="text-teal-400" />
      <h2 className="text-2xl font-bold text-white">Resume / CV</h2>
    </div>
    <div className="border-2 border-dashed border-slate-600 hover:border-teal-500 rounded-lg p-8 text-center cursor-pointer transition-colors">
      <input
        type="file"
        onChange={handleResumeUpload}
        accept=".pdf,.doc,.docx"
        className="hidden"
        id="resume-upload"
      />
      <label htmlFor="resume-upload" className="cursor-pointer block">
        <Upload className="mx-auto mb-3 text-teal-400" size={32} />
        <p className="text-white font-medium mb-1">Upload your resume or CV</p>
        <p className="text-gray-400 text-sm">PDF or DOC format, max 5MB</p>
        {form.resume && <p className="text-teal-400 mt-2">✓ {form.resume.name}</p>}
      </label>
    </div>
  </div>
);

const ExperienceEducationStep = ({ form, updateForm }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      updateForm('skills', [...form.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    updateForm('skills', form.skills.filter(skill => skill !== skillToRemove));
  };

  return (
  <div className="space-y-6">
    {/* Work Experience */}
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Briefcase className="text-teal-400" />
        <h3 className="text-lg font-bold text-white">Work Experience</h3>
      </div>
      {form.work_experience.length > 0 ? (
        <div className="space-y-3">
          {form.work_experience.map((exp, idx) => (
            <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <p className="text-white font-bold text-lg">{exp.job_title}</p>
              <p className="text-teal-400 font-medium">{exp.company}</p>
              <p className="text-gray-400 text-sm mt-1">{exp.employment_dates}</p>
              {exp.description && <p className="text-gray-300 text-sm mt-2">{exp.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">Fresher - No work experience</p>
      )}
    </div>

    {/* Education Details */}
    <div>
      <div className="flex items-center gap-3 mb-4">
        <GraduationCap className="text-teal-400" />
        <h3 className="text-lg font-bold text-white">Educational Qualifications</h3>
      </div>
      
      <div className="space-y-4">
        {/* SSC */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <h4 className="text-white font-bold mb-3">Secondary School Certificate (SSC)</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400">School Name</p>
              <p className="text-white">{form.education_info.ssc?.school_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Year</p>
              <p className="text-white">{form.education_info.ssc?.year || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Group</p>
              <p className="text-white">{form.education_info.ssc?.group || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Board</p>
              <p className="text-white">{form.education_info.ssc?.board || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400">Result (GPA/Grade)</p>
              <p className="text-white">{form.education_info.ssc?.result || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* HSC */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <h4 className="text-white font-bold mb-3">Higher Secondary Certificate (HSC)</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400">College Name</p>
              <p className="text-white">{form.education_info.hsc?.college_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Year</p>
              <p className="text-white">{form.education_info.hsc?.year || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Group</p>
              <p className="text-white">{form.education_info.hsc?.group || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Board</p>
              <p className="text-white">{form.education_info.hsc?.board || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400">Result (GPA/Grade)</p>
              <p className="text-white">{form.education_info.hsc?.result || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* University */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <h4 className="text-white font-bold mb-3">University / Degree</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="col-span-2">
              <p className="text-gray-400">University Name</p>
              <p className="text-white">{form.education_info.university?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="text-white">{form.education_info.university?.status || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Current Year</p>
              <p className="text-white">{form.education_info.university?.current_year || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Expected Graduation</p>
              <p className="text-white">{form.education_info.university?.graduation_year || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">CGPA</p>
              <p className="text-white">{form.education_info.university?.cgpa || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Skills Section */}
    <div className="border-t border-slate-700 pt-6">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="text-teal-400" />
        <h3 className="text-lg font-bold text-white">Professional Skills</h3>
      </div>
      
      <div className="space-y-4">
        {/* Add new skill */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill (e.g., JavaScript, React, Python)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1 bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add
          </button>
        </div>

        {/* Display skills */}
        {form.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-teal-600/20 border border-teal-500/50 text-teal-300 px-3 py-1 rounded-full flex items-center gap-2 group hover:border-teal-400/80 transition-colors"
              >
                <span className="text-sm">{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-300 transition-colors ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">No skills added yet. Add your professional skills to stand out!</p>
        )}
      </div>
    </div>
  </div>
  );
};

const CoverLetterStep = ({ form, updateForm, showAIModal, setShowAIModal, generatingCoverLetter, generateCoverLetter }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <FileText className="text-teal-400" />
        <h2 className="text-2xl font-bold text-white">Cover Letter</h2>
      </div>
      <button
        onClick={() => setShowAIModal(true)}
        className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg flex items-center gap-2 transition-colors border border-purple-500/30"
      >
        <Sparkles size={16} />
        AI Assist
      </button>
    </div>

    <textarea
      value={form.cover_letter}
      onChange={(e) => updateForm('cover_letter', e.target.value)}
      placeholder="Write your cover letter here... or use AI to generate one!"
      className="w-full h-64 bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-teal-500 resize-none"
    />

    {/* AI Modal */}
    {showAIModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-purple-400" />
              Generate Cover Letter
            </h3>
            <button onClick={() => setShowAIModal(false)} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-300 mb-6">
            I'll analyze the job requirements and your profile to generate a professional, personalized cover letter for you.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAIModal(false)}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={generateCoverLetter}
              disabled={generatingCoverLetter}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {generatingCoverLetter ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

const ScreeningQuestionsStep = ({ screeningQuestions, form, updateScreeningResponse }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-6">
      <AlertCircle className="text-teal-400" />
      <h2 className="text-2xl font-bold text-white">Screening Questions</h2>
    </div>

    {screeningQuestions.length === 0 ? (
      <p className="text-gray-400">No screening questions for this job.</p>
    ) : (
      <div className="space-y-4">
        {screeningQuestions.map((q) => (
          <div key={q.id} className="bg-slate-800/50 p-4 rounded-lg">
            <label className="text-white font-medium block mb-3">
              {q.question_text}
              {q.required && <span className="text-red-400"> *</span>}
            </label>

            {q.question_type === 'text' && (
              <textarea
                placeholder="Your answer..."
                onChange={(e) => updateScreeningResponse(q.id, e.target.value)}
                className="w-full h-24 bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 resize-none"
              />
            )}

            {q.question_type === 'yes_no' && (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value="yes"
                    onChange={(e) => updateScreeningResponse(q.id, e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value="no"
                    onChange={(e) => updateScreeningResponse(q.id, e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">No</span>
                </label>
              </div>
            )}

            {q.question_type === 'multiple_choice' && (
              <div className="space-y-2">
                {(q.options || []).map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      onChange={(e) => updateScreeningResponse(q.id, e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-white">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const WorkEligibilityStep = ({ form, updateForm }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-6">
      <Shield className="text-teal-400" />
      <h2 className="text-2xl font-bold text-white">Work Eligibility</h2>
    </div>

    <div className="space-y-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.work_eligibility?.authorized_to_work !== false}
          onChange={(e) => updateForm('work_eligibility', { ...form.work_eligibility, authorized_to_work: e.target.checked })}
          className="w-5 h-5"
        />
        <span className="text-white">I am authorized to work in this country</span>
      </label>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.work_eligibility?.visa_sponsorship_needed === true}
          onChange={(e) => updateForm('work_eligibility', { ...form.work_eligibility, visa_sponsorship_needed: e.target.checked })}
          className="w-5 h-5"
        />
        <span className="text-white">I might need visa sponsorship</span>
      </label>
    </div>
  </div>
);

const ReferencesStep = ({ form, addReference, updateReference, removeReference }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Users className="text-teal-400" />
        <h2 className="text-2xl font-bold text-white">References</h2>
      </div>
      <button
        onClick={addReference}
        className="px-3 py-1 bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 rounded-lg flex items-center gap-1 text-sm transition-colors border border-teal-500/30"
      >
        <Plus size={16} />
        Add Reference
      </button>
    </div>

    {form.references.length === 0 ? (
      <p className="text-gray-400">No references added yet. Add professional references if desired.</p>
    ) : (
      <div className="space-y-3">
        {form.references.map((ref, idx) => (
          <div key={idx} className="bg-slate-800/50 p-4 rounded-lg space-y-2">
            <input
              type="text"
              placeholder="Reference Name"
              value={ref.name}
              onChange={(e) => updateReference(idx, 'name', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
            />
            <input
              type="text"
              placeholder="Relationship (e.g., Manager, Professor)"
              value={ref.relationship}
              onChange={(e) => updateReference(idx, 'relationship', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={ref.email}
              onChange={(e) => updateReference(idx, 'email', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={ref.phone}
              onChange={(e) => updateReference(idx, 'phone', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={() => removeReference(idx)}
              className="w-full px-3 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

const OnlineProfilesStep = ({ form, updateForm }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-6">
      <Globe className="text-teal-400" />
      <h2 className="text-2xl font-bold text-white">Online Profiles</h2>
    </div>

    <input
      type="url"
      placeholder="LinkedIn Profile URL"
      value={form.online_profiles?.linkedin || ''}
      onChange={(e) => updateForm('online_profiles', { ...form.online_profiles, linkedin: e.target.value })}
      className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
    />

    <input
      type="url"
      placeholder="Portfolio / Personal Website"
      value={form.online_profiles?.portfolio || ''}
      onChange={(e) => updateForm('online_profiles', { ...form.online_profiles, portfolio: e.target.value })}
      className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
    />

    <input
      type="url"
      placeholder="GitHub Profile"
      value={form.online_profiles?.github || ''}
      onChange={(e) => updateForm('online_profiles', { ...form.online_profiles, github: e.target.value })}
      className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500"
    />
  </div>
);

export default JobApplicationForm;
