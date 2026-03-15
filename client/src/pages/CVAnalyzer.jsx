import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Upload, FileText, CheckCircle, AlertCircle, Loader2, X,
  Sparkles, Target, TrendingUp, Zap, Award, Briefcase, Star, Lightbulb, ArrowRight
} from 'lucide-react';
import api from '../utils/api';

const InjectStyles = () => (
  <style>{`
    @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
    @keyframes borderGlow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
    @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    
    .slide-up { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
    .slide-down { animation: slideDown 0.6s cubic-bezier(0.16,1,0.3,1) both; }
    .scale-in { animation: scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in { animation: fadeIn 0.6s ease both; }
    .gradient-text { background: linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradientShift 4s ease infinite; }
    
    .glass { background: linear-gradient(135deg, rgba(10,26,34,0.92), rgba(7,16,21,0.96)); backdrop-filter: blur(20px); border: 1px solid rgba(30,58,66,0.4); transition: all 0.5s cubic-bezier(0.16,1,0.3,1); }
    .glass:hover { border-color: rgba(20,184,166,0.25); box-shadow: 0 16px 50px -12px rgba(20,184,166,0.1); }
    
    .dot-grid { background-image: radial-gradient(rgba(20,184,166,0.08) 1px, transparent 1px); background-size: 24px 24px; }
  `}</style>
);

export default function CVAnalyzer() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(selectedFile.type)) {
      setError('Please upload a PDF or image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const input = fileInputRef.current;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      input.files = dataTransfer.files;
      handleFileSelect({ target: input });
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('cv_file', file);

      const res = await api.post('/cv-analyze', formData);

      if (res.data?.analysis) {
        setAnalysis(res.data.analysis);
      } else {
        setError('Analysis returned unexpected format');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'CV analysis failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#050D11,#0A1A22,#071218)' }}>
        <div className="glass rounded-2xl p-10 text-center scale-in">
          <FileText size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg font-semibold">Please log in to analyze your CV</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <InjectStyles />
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#050D11 0%,#0A1A22 35%,#071218 100%)' }}>
        {/* Background layers */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-[15%] -right-[10%] w-[500px] h-[500px] bg-[#14b8a6]/[0.025] rounded-full blur-[100px]" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[550px] h-[550px] bg-[#06b6d4]/[0.025] rounded-full blur-[100px]" />
          <div className="dot-grid absolute inset-0 opacity-30" />
        </div>

        <div className="relative z-10 pt-24 pb-20">
          <div className="max-w-[900px] mx-auto px-6 sm:px-8 lg:px-12">

            {/* Hero Section */}
            <div className="mb-14 text-center slide-down">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#14b8a6]/[0.08] border border-[#14b8a6]/20 mb-6">
                <Sparkles size={14} className="text-[#14b8a6] animate-pulse" />
                <span className="text-xs font-bold text-[#2dd4bf] uppercase tracking-[0.2em]">AI CV Analyzer</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
                Analyze Your <span className="gradient-text">Professional CV</span>
              </h1>
              <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Upload your CV and get AI-powered insights to make it more professional, identify skill gaps, and receive career guidance
              </p>
            </div>

            {/* Main content */}
            {!analysis ? (
              <div className="slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="glass rounded-3xl p-8 sm:p-10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent" />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-[#1e3a42] rounded-2xl p-12 text-center cursor-pointer
                      hover:border-[#14b8a6]/40 hover:bg-[#14b8a6]/5 transition-all duration-300"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20">
                        <Upload size={32} className="text-white" />
                      </div>
                    </div>

                    {file ? (
                      <>
                        <p className="text-lg font-bold text-white mb-2">{file.name}</p>
                        <p className="text-sm text-gray-500 mb-4">({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                        {preview && <img src={preview} alt="Preview" className="max-w-xs mx-auto mb-4 rounded-lg max-h-48" />}
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-bold text-white mb-1">Drop your CV here or click to browse</p>
                        <p className="text-sm text-gray-600">Supports PDF, JPEG, PNG, GIF, WebP (up to 10MB)</p>
                      </>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {error && (
                    <div className="mt-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 slide-up">
                      <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {file && (
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#06b6d4]
                          text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#14b8a6]/20 disabled:opacity-50
                          transition-all duration-300 cursor-pointer"
                      >
                        {loading ? (
                          <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
                        ) : (
                          <><Sparkles size={18} /> Analyze CV</>
                        )}
                      </button>
                      <button
                        onClick={removeFile}
                        disabled={loading}
                        className="px-6 py-3 border border-[#1e3a42]/50 rounded-xl text-gray-400 hover:text-white
                          hover:border-[#14b8a6]/30 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Analysis Results */
              <div className="space-y-6 fade-in">
                {/* Header with close button */}
                <div className="flex items-center justify-between mb-8 slide-down">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981] to-[#14b8a6] flex items-center justify-center">
                      <CheckCircle size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">CV Analysis Complete</h2>
                      <p className="text-sm text-gray-600">Analysis for {analysis.name || 'Your CV'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setAnalysis(null); removeFile(); }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#1e3a42] transition-colors cursor-pointer"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                {/* Personal Info Card */}
                {(analysis.name || analysis.email || analysis.phone) && (
                  <div className="glass rounded-2xl p-6 slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Briefcase size={18} className="text-[#14b8a6]" /> Personal Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {analysis.name && <div><p className="text-xs text-gray-600 mb-1 uppercase tracking-wider font-bold">Name</p><p className="text-white font-semibold">{analysis.name}</p></div>}
                      {analysis.email && <div><p className="text-xs text-gray-600 mb-1 uppercase tracking-wider font-bold">Email</p><p className="text-white font-semibold">{analysis.email}</p></div>}
                      {analysis.phone && <div><p className="text-xs text-gray-600 mb-1 uppercase tracking-wider font-bold">Phone</p><p className="text-white font-semibold">{analysis.phone}</p></div>}
                      {analysis.location && <div><p className="text-xs text-gray-600 mb-1 uppercase tracking-wider font-bold">Location</p><p className="text-white font-semibold">{analysis.location}</p></div>}
                      {analysis.years_of_experience && <div><p className="text-xs text-gray-600 mb-1 uppercase tracking-wider font-bold">Experience</p><p className="text-white font-semibold">{analysis.years_of_experience} years</p></div>}
                    </div>
                  </div>
                )}

                {/* Quality Score */}
                {analysis.quality_score && (
                  <div className="glass rounded-2xl p-6 slide-up" style={{ animationDelay: '0.15s' }}>
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <Star size={18} className="text-yellow-400" /> CV Quality Score
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Overall', value: analysis.quality_score.overall, color: '#14b8a6' },
                        { label: 'Formatting', value: analysis.quality_score.formatting, color: '#06b6d4' },
                        { label: 'Content', value: analysis.quality_score.content, color: '#2dd4bf' },
                        { label: 'Professionalism', value: analysis.quality_score.professionalism, color: '#a855f7' },
                      ].map((score, i) => {
                        const percentage = Math.min(score.value, 100);
                        return (
                          <div key={i} className="text-center p-4 bg-[#071015]/50 rounded-xl border border-[#1e3a42]/25 scale-in" style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                            <div className="relative w-16 h-16 mx-auto mb-3">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                                <circle cx="28" cy="28" r="24" fill="none" stroke="#0F3A42" strokeWidth="3" />
                                <circle cx="28" cy="28" r="24" fill="none" stroke={score.color} strokeWidth="3"
                                  strokeDasharray={`${(percentage/100)*2*Math.PI*24} ${2*Math.PI*24}`} strokeLinecap="round"
                                  style={{ filter: `drop-shadow(0 0 4px ${score.color}40)` }} />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-black text-white">{score.value}%</span>
                              </div>
                            </div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{score.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Extracted Skills */}
                {analysis.extracted_skills && analysis.extracted_skills.length > 0 && (
                  <div className="glass rounded-2xl p-6 slide-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Award size={18} className="text-[#14b8a6]" /> Detected Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.extracted_skills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-[#14b8a6]/15 border border-[#14b8a6]/25 rounded-full
                          text-[#2dd4bf] text-sm font-semibold hover:bg-[#14b8a6]/20 transition-all cursor-default"
                          style={{ animationDelay: `${i * 0.05}s` }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {analysis.strengths && analysis.strengths.length > 0 && (
                  <div className="glass rounded-2xl p-6 slide-up" style={{ animationDelay: '0.25s' }}>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-[#10b981]" /> Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <CheckCircle size={16} className="text-[#10b981] shrink-0 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                  <div className="glass rounded-2xl p-6 slide-up" style={{ animationDelay: '0.3s' }}>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <AlertCircle size={18} className="text-yellow-400" /> Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((weakness, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <AlertCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvement Tips */}
                {analysis.improvement_tips && analysis.improvement_tips.length > 0 && (
                  <div className="glass rounded-2xl p-6 slide-up" style={{ animationDelay: '0.35s' }}>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Lightbulb size={18} className="text-yellow-400" /> Professional Tips
                    </h3>
                    <ul className="space-y-3">
                      {analysis.improvement_tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 bg-[#14b8a6]/5 border border-[#14b8a6]/10 rounded-xl">
                          <Zap size={16} className="text-[#2dd4bf] shrink-0 mt-0.5" />
                          <span className="text-gray-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills to Develop */}
                {analysis.skills_to_develop && analysis.skills_to_develop.length > 0 && (
                  <div className="glass rounded-2xl p-6 slide-up" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Target size={18} className="text-[#06b6d4]" /> Skills to Develop
                    </h3>
                    <div className="space-y-3">
                      {analysis.skills_to_develop.map((item, i) => (
                        <div key={i} className="p-4 bg-[#06b6d4]/5 border border-[#06b6d4]/10 rounded-xl">
                          <p className="text-white font-bold text-sm flex items-center gap-2">
                            <ArrowRight size={14} className="text-[#06b6d4]" /> {item.skill}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Career Guidance */}
                {analysis.career_guidance && (
                  <div className="glass rounded-2xl p-6 slide-up" style={{ animationDelay: '0.45s' }}>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Sparkles size={18} className="text-yellow-400" /> Career Guidance
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{analysis.career_guidance}</p>
                  </div>
                )}

                {/* Next Steps */}
                {analysis.next_steps && analysis.next_steps.length > 0 && (
                  <div className="glass rounded-2xl p-6 slide-up" style={{ animationDelay: '0.5s' }}>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-[#14b8a6]" /> Recommended Next Steps
                    </h3>
                    <ol className="space-y-3">
                      {analysis.next_steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]
                            flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-gray-300 pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 slide-up" style={{ animationDelay: '0.55s' }}>
                  <button
                    onClick={() => { setAnalysis(null); removeFile(); }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#06b6d4]
                      text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#14b8a6]/20
                      transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload size={16} /> Analyze Another CV
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
