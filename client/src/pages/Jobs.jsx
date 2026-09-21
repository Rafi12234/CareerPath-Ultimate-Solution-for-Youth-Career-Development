import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  CheckCircle,
  ChevronDown,
  Clock,
  Code2,
  Crown,
  DollarSign,
  Eye,
  Flame,
  Layers,
  Loader2,
  MapPin,
  Search,
  Send,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

/* =========================================================
   CONSTANTS
   ========================================================= */

const PROFICIENCY_RANK = {
  Beginner: 1,
  Intermediate: 2,
  Expert: 3,
  Professional: 4,
};

const JOB_LEVEL_RANK = {
  'Entry Level': 1,
  'Mid Level': 2,
  Senior: 3,
};

const SKILL_COLORS = [
  'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  'bg-blue-500/10 text-blue-300 border-blue-500/20',
  'bg-purple-500/10 text-purple-300 border-purple-500/20',
  'bg-amber-500/10 text-amber-300 border-amber-500/20',
];

/* =========================================================
   SAFE DATA HELPERS

   Important:
   Company jobs may contain:
   company: "ABC Ltd"

   or, from an older/broken API response:
   company: {
     id: 1,
     name: "ABC Ltd"
   }

   This page supports both and will not crash.
   ========================================================= */

function normalizeSkills(value) {
  if (Array.isArray(value)) {
    return value
      .map((skill) => {
        if (typeof skill === 'string') {
          return skill.trim();
        }

        if (skill && typeof skill === 'object') {
          return String(
            skill.name ??
            skill.skill_name ??
            skill.label ??
            ''
          ).trim();
        }

        return '';
      })
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return normalizeSkills(parsed);
      }
    } catch {
      // Normal comma-separated string.
    }

    return trimmed
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
}

function getCompanyName(job = {}) {
  if (typeof job.company === 'string' && job.company.trim()) {
    return job.company.trim();
  }

  if (
    job.company &&
    typeof job.company === 'object' &&
    typeof job.company.name === 'string'
  ) {
    return job.company.name;
  }

  if (
    job.employer_company &&
    typeof job.employer_company.name === 'string'
  ) {
    return job.employer_company.name;
  }

  if (
    job.employerCompany &&
    typeof job.employerCompany.name === 'string'
  ) {
    return job.employerCompany.name;
  }

  return 'Company';
}

function normalizeJob(job = {}) {
  return {
    ...job,

    id: job.id,

    title:
      typeof job.title === 'string' && job.title.trim()
        ? job.title.trim()
        : 'Untitled Position',

    company: getCompanyName(job),

    location:
      typeof job.location === 'string' && job.location.trim()
        ? job.location.trim()
        : 'Location not specified',

    type:
      typeof job.type === 'string' && job.type.trim()
        ? job.type.trim()
        : 'Not specified',

    level:
      typeof job.level === 'string' && job.level.trim()
        ? job.level.trim()
        : 'Entry Level',

    description:
      typeof job.description === 'string'
        ? job.description
        : '',

    track:
      typeof job.track === 'string'
        ? job.track
        : '',

    skills: normalizeSkills(job.skills),

    salary_min:
      job.salary_min !== null &&
      job.salary_min !== undefined &&
      job.salary_min !== ''
        ? Number(job.salary_min)
        : null,

    salary_max:
      job.salary_max !== null &&
      job.salary_max !== undefined &&
      job.salary_max !== ''
        ? Number(job.salary_max)
        : null,

    vacancies:
      job.vacancies !== null &&
      job.vacancies !== undefined
        ? Number(job.vacancies)
        : null,

    application_deadline:
      job.application_deadline || null,
  };
}

function getApiArray(response) {
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
}

function formatMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number.toLocaleString();
}

function formatDeadline(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/* =========================================================
   PAGE STYLES
   ========================================================= */

function JobsStyles() {
  return (
    <style>{`
      @keyframes jobsFadeUp {
        from {
          opacity: 0;
          transform: translateY(18px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes jobsFadeIn {
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
      }

      @keyframes jobsFloat {
        0%, 100% {
          transform: translateY(0px);
        }

        50% {
          transform: translateY(-12px);
        }
      }

      @keyframes jobsPulseGlow {
        0%, 100% {
          opacity: .25;
          transform: scale(1);
        }

        50% {
          opacity: .45;
          transform: scale(1.08);
        }
      }

      @keyframes jobsGradient {
        0% {
          background-position: 0% 50%;
        }

        50% {
          background-position: 100% 50%;
        }

        100% {
          background-position: 0% 50%;
        }
      }

      @keyframes jobsModalIn {
        from {
          opacity: 0;
          transform: translateY(30px) scale(.97);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .jobs-fade-up {
        animation: jobsFadeUp .55s cubic-bezier(.16,1,.3,1) both;
      }

      .jobs-fade-in {
        animation: jobsFadeIn .4s ease both;
      }

      .jobs-float {
        animation: jobsFloat 7s ease-in-out infinite;
      }

      .jobs-modal-in {
        animation: jobsModalIn .35s cubic-bezier(.16,1,.3,1) both;
      }

      .jobs-gradient-text {
        background: linear-gradient(
          120deg,
          #2dd4bf,
          #22d3ee,
          #5eead4,
          #14b8a6
        );

        background-size: 250% 250%;
        animation: jobsGradient 5s ease infinite;

        -webkit-background-clip: text;
        background-clip: text;

        -webkit-text-fill-color: transparent;
      }

      .jobs-card {
        background:
          linear-gradient(
            145deg,
            rgba(10,26,34,.92),
            rgba(6,17,23,.95)
          );

        border: 1px solid rgba(30,58,66,.55);
        backdrop-filter: blur(16px);

        transition:
          transform .3s cubic-bezier(.16,1,.3,1),
          border-color .3s ease,
          box-shadow .3s ease;
      }

      .jobs-card:hover {
        transform: translateY(-4px);

        border-color: rgba(45,212,191,.30);

        box-shadow:
          0 24px 55px -30px rgba(20,184,166,.45),
          0 0 0 1px rgba(20,184,166,.05);
      }

      .jobs-card-title {
        transition:
          color .25s ease,
          text-shadow .25s ease;
      }

      .jobs-card:hover .jobs-card-title {
        color: #5eead4;

        text-shadow:
          0 0 20px rgba(20,184,166,.15);
      }

      .jobs-dot-grid {
        background-image:
          radial-gradient(
            rgba(45,212,191,.065) 1px,
            transparent 1px
          );

        background-size: 28px 28px;
      }

      .jobs-scrollbar::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      .jobs-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }

      .jobs-scrollbar::-webkit-scrollbar-thumb {
        background: #1e3a42;
        border-radius: 20px;
      }

      .jobs-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #14b8a6;
      }
    `}</style>
  );
}

/* =========================================================
   CURSOR GLOW

   Important:
   This uses direct DOM style updates.
   It does NOT call setState on mousemove.
   Therefore moving the mouse does not rerender the page.
   ========================================================= */

function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    let animationFrame = null;

    const handleMouseMove = (event) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        if (!ref.current) {
          return;
        }

        ref.current.style.transform =
          `translate3d(${event.clientX - 220}px, ${event.clientY - 220}px, 0)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    });

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-0"
      style={{
        left: 0,
        top: 0,
        width: 440,
        height: 440,

        transform:
          'translate3d(-1000px,-1000px,0)',

        background:
          'radial-gradient(circle, rgba(20,184,166,.045) 0%, rgba(6,182,212,.015) 40%, transparent 72%)',

        willChange: 'transform',
      }}
    />
  );
}

/* =========================================================
   SCORE RING
   ========================================================= */

function ScoreRing({
  score = 0,
  size = 82,
}) {
  const safeScore = Math.max(
    0,
    Math.min(100, Number(score) || 0)
  );

  const strokeWidth = 5;
  const radius =
    (size - strokeWidth * 2) / 2;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    (safeScore / 100) * circumference;

  const color =
    safeScore >= 80
      ? '#10b981'
      : safeScore >= 60
        ? '#14b8a6'
        : '#f59e0b';

  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#12333c"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{
            transition:
              'stroke-dasharray .7s cubic-bezier(.16,1,.3,1)',
            filter:
              `drop-shadow(0 0 6px ${color}55)`,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg text-white font-black">
          {safeScore}%
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON
   ========================================================= */

function JobSkeleton() {
  return (
    <div className="jobs-card rounded-2xl p-6 overflow-hidden">
      <div className="flex gap-5">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#12333c]/40 animate-pulse" />

        <div className="flex-1">
          <div className="h-5 w-2/5 bg-[#12333c]/40 rounded-lg animate-pulse mb-3" />

          <div className="h-4 w-1/4 bg-[#12333c]/30 rounded-lg animate-pulse mb-5" />

          <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-[#12333c]/25 rounded-lg animate-pulse" />
            <div className="h-6 w-24 bg-[#12333c]/25 rounded-lg animate-pulse" />
            <div className="h-6 w-20 bg-[#12333c]/25 rounded-lg animate-pulse" />
          </div>

          <div className="h-3 w-full bg-[#12333c]/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MATCH BAR
   ========================================================= */

function MatchBar({
  label,
  value,
  max,
  color,
}) {
  const width =
    max > 0
      ? Math.min(
          100,
          Math.max(0, (value / max) * 100)
        )
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-gray-500">
          {label}
        </span>

        <span
          className="text-[11px] font-bold"
          style={{ color }}
        >
          {value}/{max}
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-[#12333c]/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${width}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   JOB CARD

   Declared OUTSIDE Jobs() so React does not recreate
   the component type during search/filter changes.
   ========================================================= */

function JobCard({
  job,
  user,
  match,
  applied,
  saved,
  index,
  onApply,
  onDetails,
  onSave,
}) {
  const [expanded, setExpanded] =
    useState(false);

  const score = match.total;

  const scoreColor =
    score >= 80
      ? '#10b981'
      : score >= 60
        ? '#14b8a6'
        : '#f59e0b';

  const matchLabel =
    score >= 80
      ? 'Excellent'
      : score >= 60
        ? 'Good'
        : 'Fair';

  const salaryMin =
    formatMoney(job.salary_min);

  const salaryMax =
    formatMoney(job.salary_max);

  const deadline =
    formatDeadline(job.application_deadline);

  return (
    <article
      className="jobs-card jobs-fade-up rounded-2xl relative overflow-hidden"
      style={{
        animationDelay:
          `${Math.min(index, 8) * 50}ms`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            user
              ? `linear-gradient(90deg, transparent, ${scoreColor}80, transparent)`
              : 'linear-gradient(90deg, transparent, rgba(20,184,166,.45), transparent)',
        }}
      />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
          {user && (
            <div className="shrink-0">
              <ScoreRing score={score} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex gap-4 justify-between items-start">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h2 className="jobs-card-title text-lg sm:text-xl text-white font-bold leading-snug">
                    {job.title}
                  </h2>

                  {user && (
                    <span
                      className="px-2 py-0.5 rounded-md border text-[9px] uppercase tracking-wider font-black"
                      style={{
                        color: scoreColor,
                        borderColor:
                          `${scoreColor}35`,
                        background:
                          `${scoreColor}12`,
                      }}
                    >
                      {matchLabel} Match
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Building2 size={12} />
                    {job.company}
                  </span>

                  <span className="text-gray-700">
                    •
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {job.location}
                  </span>
                </div>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={() =>
                    onSave(job.id)
                  }
                  className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    saved
                      ? 'bg-[#14b8a6]/15 border-[#14b8a6]/30 text-[#2dd4bf]'
                      : 'bg-[#0c2028]/50 border-[#1e3a42]/50 text-gray-500 hover:text-[#2dd4bf] hover:border-[#14b8a6]/30'
                  }`}
                  title={
                    saved
                      ? 'Remove saved job'
                      : 'Save job'
                  }
                >
                  {saved ? (
                    <BookmarkCheck size={17} />
                  ) : (
                    <Bookmark size={17} />
                  )}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f2c34]/50 border border-[#1e3a42]/40 text-[11px] text-gray-400">
                <Briefcase size={11} />
                {job.type}
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f2c34]/50 border border-[#1e3a42]/40 text-[11px] text-gray-400">
                <TrendingUp size={11} />
                {job.level}
              </span>

              {job.vacancies > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f2c34]/50 border border-[#1e3a42]/40 text-[11px] text-gray-400">
                  <Layers size={11} />
                  {job.vacancies}{' '}
                  {job.vacancies === 1
                    ? 'opening'
                    : 'openings'}
                </span>
              )}

              {deadline && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f2c34]/50 border border-[#1e3a42]/40 text-[11px] text-gray-400">
                  <Clock size={11} />
                  {deadline}
                </span>
              )}
            </div>

            {(salaryMin || salaryMax) && (
              <div className="flex items-center gap-2 mt-4 text-emerald-300 font-bold text-sm">
                <DollarSign size={15} />

                <span>
                  {salaryMin && salaryMax
                    ? `৳${salaryMin} – ৳${salaryMax}`
                    : salaryMin
                      ? `From ৳${salaryMin}`
                      : `Up to ৳${salaryMax}`}

                  <span className="text-emerald-300/40 text-xs font-normal ml-1">
                    /month
                  </span>
                </span>
              </div>
            )}

            {job.description && (
              <p className="mt-4 text-sm text-gray-500 leading-relaxed line-clamp-2">
                {job.description}
              </p>
            )}

            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {job.skills
                  .slice(0, 7)
                  .map((skill, skillIndex) => (
                    <span
                      key={`${job.id}-${skill}-${skillIndex}`}
                      className={`px-2.5 py-1 rounded-full text-[10px] border font-medium ${
                        SKILL_COLORS[
                          skillIndex %
                            SKILL_COLORS.length
                        ]
                      }`}
                    >
                      {skill}
                    </span>
                  ))}

                {job.skills.length > 7 && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] bg-[#12333c]/30 border border-[#1e3a42]/40 text-gray-500">
                    +{job.skills.length - 7}
                  </span>
                )}
              </div>
            )}

            {user && expanded && (
              <div className="jobs-fade-in mt-5 p-4 rounded-xl bg-[#06151b]/70 border border-[#1e3a42]/35">
                <div className="grid sm:grid-cols-3 gap-4">
                  <MatchBar
                    label="Skills"
                    value={match.skills}
                    max={60}
                    color="#14b8a6"
                  />

                  <MatchBar
                    label="Experience"
                    value={match.experience}
                    max={20}
                    color="#22d3ee"
                  />

                  <MatchBar
                    label="Career Fit"
                    value={match.track}
                    max={20}
                    color="#5eead4"
                  />
                </div>

                {match.matchedSkills.length >
                  0 && (
                  <div className="mt-4">
                    <div className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-2">
                      Matched skills
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {match.matchedSkills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px]"
                          >
                            <CheckCircle
                              size={10}
                            />
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <button
                type="button"
                disabled={applied}
                onClick={() =>
                  onApply(job.id)
                }
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  applied
                    ? 'bg-emerald-600/60 text-white cursor-default'
                    : 'bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-white hover:shadow-lg hover:shadow-[#14b8a6]/20 hover:scale-[1.02] active:scale-[.98] cursor-pointer'
                }`}
              >
                {applied ? (
                  <>
                    <CheckCircle size={14} />
                    Applied
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Apply
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  onDetails(job)
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1e3a42]/50 text-gray-400 hover:text-white hover:border-[#14b8a6]/30 hover:bg-[#14b8a6]/5 transition-all text-sm cursor-pointer"
              >
                <Eye size={14} />
                Details
              </button>

              {user && (
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(
                      (current) =>
                        !current
                    )
                  }
                  className="ml-auto inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-600 hover:text-[#2dd4bf] transition-colors cursor-pointer"
                >
                  {expanded
                    ? 'Hide Breakdown'
                    : 'Match Breakdown'}

                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-300 ${
                      expanded
                        ? 'rotate-180'
                        : ''
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   FEATURED CARD
   ========================================================= */

function FeaturedJob({
  job,
  score,
  applied,
  onApply,
  onDetails,
}) {
  const color =
    score >= 80
      ? '#10b981'
      : score >= 60
        ? '#14b8a6'
        : '#f59e0b';

  return (
    <div className="jobs-card rounded-2xl p-5 w-[310px] sm:w-[350px] shrink-0 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />

      <div className="flex items-center gap-4 mb-4">
        <ScoreRing
          score={score}
          size={64}
        />

        <div className="min-w-0">
          <h3 className="text-white font-bold truncate">
            {job.title}
          </h3>

          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Building2 size={11} />
            <span className="truncate">
              {job.company}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#12333c]/30 text-gray-400 text-[10px]">
          <MapPin size={10} />
          {job.location}
        </span>

        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#12333c]/30 text-gray-400 text-[10px]">
          <Briefcase size={10} />
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-5">
        {job.skills
          .slice(0, 4)
          .map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/15 text-[#5eead4] text-[10px]"
            >
              {skill}
            </span>
          ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={applied}
          onClick={() =>
            onApply(job.id)
          }
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold ${
            applied
              ? 'bg-emerald-600/60 text-white'
              : 'bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-white hover:shadow-lg hover:shadow-[#14b8a6]/20'
          }`}
        >
          {applied ? (
            <>
              <CheckCircle size={12} />
              Applied
            </>
          ) : (
            <>
              <Send size={12} />
              Apply
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            onDetails(job)
          }
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#1e3a42]/50 text-gray-500 hover:text-white hover:border-[#14b8a6]/30 transition-all"
        >
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   JOB DETAIL MODAL
   ========================================================= */

function JobDetailsModal({
  job,
  user,
  match,
  applied,
  onApply,
  onClose,
}) {
  useEffect(() => {
    const oldOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        oldOverflow;

      window.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [onClose]);

  const salaryMin =
    formatMoney(job.salary_min);

  const salaryMax =
    formatMoney(job.salary_max);

  const deadline =
    formatDeadline(job.application_deadline);

  const scoreColor =
    match.total >= 80
      ? '#10b981'
      : match.total >= 60
        ? '#14b8a6'
        : '#f59e0b';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      <div className="jobs-modal-in jobs-scrollbar relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#081a22] border border-[#1e3a42]/70 rounded-3xl shadow-2xl">
        <div className="h-1 bg-gradient-to-r from-[#14b8a6] via-[#22d3ee] to-[#2dd4bf] rounded-t-3xl" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 w-10 h-10 rounded-xl bg-[#0e2a33]/80 border border-[#1e3a42]/70 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#14b8a6]/30 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 pr-10">
            {user && (
              <ScoreRing
                score={match.total}
                size={96}
              />
            )}

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                {job.title}
              </h2>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12333c]/30 border border-[#1e3a42]/40 text-xs text-gray-400">
                  <Building2 size={11} />
                  {job.company}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12333c]/30 border border-[#1e3a42]/40 text-xs text-gray-400">
                  <MapPin size={11} />
                  {job.location}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12333c]/30 border border-[#1e3a42]/40 text-xs text-gray-400">
                  <Briefcase size={11} />
                  {job.type}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12333c]/30 border border-[#1e3a42]/40 text-xs text-gray-400">
                  <TrendingUp size={11} />
                  {job.level}
                </span>
              </div>

              {user && (
                <div
                  className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border text-xs font-bold"
                  style={{
                    color: scoreColor,
                    background:
                      `${scoreColor}10`,
                    borderColor:
                      `${scoreColor}28`,
                  }}
                >
                  <Sparkles size={11} />
                  {match.total}% Match
                </div>
              )}
            </div>
          </div>

          {(salaryMin ||
            salaryMax) && (
            <div className="mt-7 flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/[.04] border border-emerald-500/15">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <DollarSign
                  size={20}
                  className="text-emerald-300"
                />
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">
                  Salary Range
                </div>

                <div className="text-lg text-emerald-300 font-black mt-0.5">
                  {salaryMin &&
                  salaryMax
                    ? `৳${salaryMin} – ৳${salaryMax}`
                    : salaryMin
                      ? `From ৳${salaryMin}`
                      : `Up to ৳${salaryMax}`}

                  <span className="text-xs font-normal text-emerald-300/40 ml-1">
                    /month
                  </span>
                </div>
              </div>
            </div>
          )}

          {(job.vacancies ||
            deadline) && (
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {job.vacancies > 0 && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0b232c]/60 border border-[#1e3a42]/40">
                  <Layers
                    size={17}
                    className="text-[#2dd4bf]"
                  />

                  <div>
                    <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">
                      Openings
                    </div>

                    <div className="text-sm text-white font-semibold">
                      {job.vacancies}{' '}
                      {job.vacancies === 1
                        ? 'position'
                        : 'positions'}
                    </div>
                  </div>
                </div>
              )}

              {deadline && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0b232c]/60 border border-[#1e3a42]/40">
                  <Clock
                    size={17}
                    className="text-cyan-300"
                  />

                  <div>
                    <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">
                      Application Deadline
                    </div>

                    <div className="text-sm text-white font-semibold">
                      {deadline}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {job.description && (
            <section className="mt-7">
              <h3 className="text-xs text-white uppercase tracking-[.16em] font-black mb-3">
                Job Description
              </h3>

              <div className="text-sm text-gray-400 leading-7 whitespace-pre-line border-l-2 border-[#14b8a6]/20 pl-4">
                {job.description}
              </div>
            </section>
          )}

          {job.skills.length > 0 && (
            <section className="mt-7">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-xs text-white uppercase tracking-[.16em] font-black flex items-center gap-2">
                  <Star
                    size={14}
                    className="text-[#2dd4bf]"
                  />
                  Required Skills
                </h3>

                {user && (
                  <span className="text-[10px] text-gray-600">
                    {
                      match
                        .matchedSkills
                        .length
                    }{' '}
                    of{' '}
                    {job.skills.length}{' '}
                    matched
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {job.skills.map(
                  (skill, index) => {
                    const matched =
                      match.matchedSkills.includes(
                        skill.toLowerCase()
                      );

                    return (
                      <span
                        key={`${skill}-${index}`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${
                          user && matched
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                            : 'bg-[#12333c]/30 border-[#1e3a42]/40 text-gray-400'
                        }`}
                      >
                        {user &&
                          matched && (
                            <CheckCircle
                              size={11}
                            />
                          )}

                        {skill}
                      </span>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {user && (
            <section className="mt-7 p-5 rounded-2xl bg-[#06151b]/65 border border-[#1e3a42]/40">
              <h3 className="text-xs text-white uppercase tracking-[.16em] font-black mb-5 flex items-center gap-2">
                <Award
                  size={14}
                  className="text-[#2dd4bf]"
                />
                Match Breakdown
              </h3>

              <div className="space-y-4">
                <MatchBar
                  label="Skills Match"
                  value={match.skills}
                  max={60}
                  color="#14b8a6"
                />

                <MatchBar
                  label="Experience Level"
                  value={match.experience}
                  max={20}
                  color="#22d3ee"
                />

                <MatchBar
                  label="Career Compatibility"
                  value={match.track}
                  max={20}
                  color="#5eead4"
                />
              </div>
            </section>
          )}

          <div className="flex gap-3 mt-7">
            <button
              type="button"
              disabled={applied}
              onClick={() =>
                onApply(job.id)
              }
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${
                applied
                  ? 'bg-emerald-600/60 text-white cursor-default'
                  : 'bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-white hover:shadow-xl hover:shadow-[#14b8a6]/20 hover:scale-[1.01] active:scale-[.99] cursor-pointer'
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle
                    size={16}
                  />
                  Already Applied
                </>
              ) : (
                <>
                  <Send size={16} />
                  Apply Now
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3.5 rounded-xl border border-[#1e3a42]/50 text-gray-400 hover:text-white hover:border-[#14b8a6]/30 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function Jobs() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] =
    useState([]);

  const [userSkills, setUserSkills] =
    useState([]);

  const [appliedJobs, setAppliedJobs] =
    useState(() => new Set());

  const [savedJobs, setSavedJobs] =
    useState(() => {
      try {
        const stored =
          JSON.parse(
            localStorage.getItem(
              'careerpath_saved_jobs'
            ) || '[]'
          );

        return new Set(
          Array.isArray(stored)
            ? stored
            : []
        );
      } catch {
        return new Set();
      }
    });

  const [search, setSearch] =
    useState('');

  const [filter, setFilter] =
    useState('all');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [selectedJob, setSelectedJob] =
    useState(null);

  const [searchFocused, setSearchFocused] =
    useState(false);

  const featuredRef =
    useRef(null);

  /* =======================================================
     FETCH PUBLIC JOBS
     ======================================================= */

  const fetchJobs =
    useCallback(async () => {
      setLoading(true);
      setError('');

      try {
        const response =
          await api.get('/jobs');

        const data =
          getApiArray(response);

        const normalized =
          data
            .filter(
              (item) =>
                item &&
                typeof item ===
                  'object'
            )
            .map(normalizeJob);

        setJobs(normalized);
      } catch (requestError) {
        console.error(
          'Failed to load jobs:',
          requestError
        );

        setJobs([]);

        setError(
          requestError?.response?.data
            ?.message ||
            'Unable to load jobs right now.'
        );
      } finally {
        setLoading(false);
      }
    }, []);

  /* =======================================================
     FETCH USER PROFILE DATA
     ======================================================= */

  const fetchUserData =
    useCallback(async () => {
      if (!user?.id) {
        setUserSkills([]);
        setAppliedJobs(
          new Set()
        );

        return;
      }

      const [
        skillsResult,
        applicationsResult,
      ] =
        await Promise.allSettled([
          api.get(
            `/user-skills?user_id=${user.id}`
          ),

          api.get(
            `/job-applications?user_id=${user.id}`
          ),
        ]);

      if (
        skillsResult.status ===
        'fulfilled'
      ) {
        setUserSkills(
          getApiArray(
            skillsResult.value
          )
        );
      } else {
        console.error(
          'Failed to load user skills:',
          skillsResult.reason
        );

        setUserSkills([]);
      }

      if (
        applicationsResult.status ===
        'fulfilled'
      ) {
        const applications =
          getApiArray(
            applicationsResult.value
          );

        setAppliedJobs(
          new Set(
            applications
              .map(
                (application) =>
                  Number(
                    application.job_id
                  )
              )
              .filter(
                Number.isFinite
              )
          )
        );
      } else {
        console.error(
          'Failed to load applications:',
          applicationsResult.reason
        );

        setAppliedJobs(
          new Set()
        );
      }
    }, [user?.id]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  /* =======================================================
     SAVE JOBS
     ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      'careerpath_saved_jobs',
      JSON.stringify(
        [...savedJobs]
      )
    );
  }, [savedJobs]);

  const toggleSave =
    useCallback((jobId) => {
      setSavedJobs(
        (current) => {
          const next =
            new Set(current);

          if (next.has(jobId)) {
            next.delete(jobId);
          } else {
            next.add(jobId);
          }

          return next;
        }
      );
    }, []);

  /* =======================================================
     APPLICATION
     ======================================================= */

  const applyToJob =
    useCallback(
      (jobId) => {
        if (!user) {
          navigate('/login');
          return;
        }

        if (
          appliedJobs.has(jobId)
        ) {
          return;
        }

        navigate(
          `/apply-job/${jobId}`
        );
      },
      [
        user,
        appliedJobs,
        navigate,
      ]
    );

  /* =======================================================
     USER SKILL ANALYSIS
     ======================================================= */

  const userSkillNames =
    useMemo(() => {
      return userSkills
        .map((skill) =>
          String(
            skill?.skill_name ??
            skill?.name ??
            ''
          )
            .trim()
            .toLowerCase()
        )
        .filter(Boolean);
    }, [userSkills]);

  const avgProficiency =
    useMemo(() => {
      if (
        userSkills.length === 0
      ) {
        return 0;
      }

      const total =
        userSkills.reduce(
          (sum, skill) => {
            const level =
              PROFICIENCY_RANK[
                skill?.proficiency
              ] || 1;

            return sum + level;
          },
          0
        );

      return (
        total /
        userSkills.length
      );
    }, [userSkills]);

  const avgLevelLabel =
    useMemo(() => {
      if (
        avgProficiency >= 3.5
      ) {
        return 'Professional';
      }

      if (
        avgProficiency >= 2.5
      ) {
        return 'Expert';
      }

      if (
        avgProficiency >= 1.5
      ) {
        return 'Intermediate';
      }

      if (
        avgProficiency > 0
      ) {
        return 'Beginner';
      }

      return 'N/A';
    }, [avgProficiency]);

  /* =======================================================
     JOB MATCH CALCULATION
     ======================================================= */

  const getMatchDetails =
    useCallback(
      (job) => {
        if (
          !user ||
          userSkills.length === 0
        ) {
          return {
            total: 0,
            skills: 0,
            experience: 0,
            track: 0,
            matchedSkills: [],
          };
        }

        const jobSkills =
          normalizeSkills(
            job?.skills
          ).map((skill) =>
            skill.toLowerCase()
          );

        const matchedSkills =
          jobSkills.filter(
            (skill) =>
              userSkillNames.includes(
                skill
              )
          );

        const skillScore =
          jobSkills.length > 0
            ? Math.round(
                (matchedSkills.length /
                  jobSkills.length) *
                  60
              )
            : 0;

        const requiredLevel =
          JOB_LEVEL_RANK[
            job?.level
          ] || 1;

        let experienceScore =
          0;

        if (
          avgProficiency >=
          requiredLevel
        ) {
          experienceScore = 20;
        } else {
          const difference =
            requiredLevel -
            avgProficiency;

          if (difference <= 1) {
            experienceScore = 12;
          } else if (
            difference <= 2
          ) {
            experienceScore = 5;
          }
        }

        let trackScore = 0;

        if (
          matchedSkills.length > 0
        ) {
          if (
            matchedSkills.length >=
            jobSkills.length * 0.5
          ) {
            trackScore = 20;
          } else {
            trackScore = 10;
          }
        }

        return {
          total:
            skillScore +
            experienceScore +
            trackScore,

          skills:
            skillScore,

          experience:
            experienceScore,

          track:
            trackScore,

          matchedSkills,
        };
      },
      [
        user,
        userSkills.length,
        userSkillNames,
        avgProficiency,
      ]
    );

  const getMatchScore =
    useCallback(
      (job) =>
        getMatchDetails(job)
          .total,
      [getMatchDetails]
    );

  /* =======================================================
     FILTERING
     ======================================================= */

  const filteredJobs =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      const result =
        jobs.filter((job) => {
          const searchableValues = [
            job.title,
            job.company,
            job.location,
            job.type,
            job.level,
            job.track,
            ...job.skills,
          ];

          const matchesSearch =
            !query ||
            searchableValues.some(
              (value) =>
                String(
                  value ?? ''
                )
                  .toLowerCase()
                  .includes(query)
            );

          if (
            !matchesSearch
          ) {
            return false;
          }

          if (
            filter === 'all'
          ) {
            return true;
          }

          if (
            filter === 'saved'
          ) {
            return savedJobs.has(
              job.id
            );
          }

          const score =
            getMatchScore(job);

          if (
            filter ===
            'excellent'
          ) {
            return score >= 80;
          }

          if (
            filter === 'good'
          ) {
            return (
              score >= 60 &&
              score < 80
            );
          }

          if (
            filter === 'fair'
          ) {
            return score < 60;
          }

          return true;
        });

      if (!user) {
        return result;
      }

      return [...result].sort(
        (first, second) =>
          getMatchScore(
            second
          ) -
          getMatchScore(first)
      );
    }, [
      jobs,
      search,
      filter,
      savedJobs,
      user,
      getMatchScore,
    ]);

  /* =======================================================
     MATCH COUNTS
     ======================================================= */

  const excellentCount =
    useMemo(
      () =>
        jobs.filter(
          (job) =>
            getMatchScore(job) >=
            80
        ).length,
      [jobs, getMatchScore]
    );

  const goodCount =
    useMemo(
      () =>
        jobs.filter(
          (job) => {
            const score =
              getMatchScore(job);

            return (
              score >= 60 &&
              score < 80
            );
          }
        ).length,
      [jobs, getMatchScore]
    );

  const fairCount =
    useMemo(
      () =>
        jobs.filter(
          (job) =>
            getMatchScore(job) <
            60
        ).length,
      [jobs, getMatchScore]
    );

  const topMatches =
    useMemo(() => {
      if (!user) {
        return [];
      }

      return [...jobs]
        .sort(
          (first, second) =>
            getMatchScore(
              second
            ) -
            getMatchScore(first)
        )
        .filter(
          (job) =>
            getMatchScore(job) >
            0
        )
        .slice(0, 6);
    }, [
      jobs,
      user,
      getMatchScore,
    ]);

  const filters =
    useMemo(() => {
      const items = [
        {
          key: 'all',
          label: 'All Jobs',
          icon: Layers,
          count: jobs.length,
        },
      ];

      if (user) {
        items.push(
          {
            key: 'excellent',
            label: 'Excellent',
            icon: Crown,
            count:
              excellentCount,
          },
          {
            key: 'good',
            label: 'Good',
            icon: Zap,
            count: goodCount,
          },
          {
            key: 'fair',
            label: 'Fair',
            icon: Target,
            count: fairCount,
          },
          {
            key: 'saved',
            label: 'Saved',
            icon: Bookmark,
            count: savedJobs.size,
          }
        );
      }

      return items;
    }, [
      user,
      jobs.length,
      excellentCount,
      goodCount,
      fairCount,
      savedJobs.size,
    ]);

  const selectedMatch =
    useMemo(() => {
      if (!selectedJob) {
        return null;
      }

      return getMatchDetails(
        selectedJob
      );
    }, [
      selectedJob,
      getMatchDetails,
    ]);

  const clearFilters = () => {
    setSearch('');
    setFilter('all');
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      <JobsStyles />

      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, #050d11 0%, #081820 40%, #061117 100%)',
        }}
      >
        <CursorGlow />

        {/* Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="jobs-dot-grid absolute inset-0 opacity-60" />

          <div
            className="absolute -top-52 -left-40 w-[520px] h-[520px] rounded-full blur-[120px]"
            style={{
              background:
                'rgba(20,184,166,.055)',
              animation:
                'jobsPulseGlow 8s ease-in-out infinite',
            }}
          />

          <div
            className="absolute -bottom-52 -right-40 w-[600px] h-[600px] rounded-full blur-[130px]"
            style={{
              background:
                'rgba(6,182,212,.045)',
              animation:
                'jobsPulseGlow 10s ease-in-out infinite',
            }}
          />
        </div>

        <main className="relative z-10 pt-24 pb-20">
          {/* HERO */}
          <section className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="jobs-fade-up text-center pt-8 pb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14b8a6]/[.07] border border-[#14b8a6]/20 mb-6">
                <Sparkles
                  size={13}
                  className="text-[#2dd4bf]"
                />

                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[.18em] text-[#5eead4]">
                  {user
                    ? 'Intelligent Career Matching'
                    : 'Career Opportunities'}
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
                Find Your Next
                <br />

                <span className="jobs-gradient-text">
                  Career Opportunity
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-gray-500 text-sm sm:text-lg leading-relaxed mt-6">
                {user
                  ? 'Discover roles matched with your skills, experience and career profile.'
                  : 'Explore available opportunities and find the role that fits your career.'}
              </p>

              {user && (
                <div className="flex items-center justify-center flex-wrap gap-3 mt-8">
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0a1d25]/80 border border-[#1e3a42]/45">
                    <Shield
                      size={15}
                      className="text-[#2dd4bf]"
                    />

                    <div className="text-left">
                      <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">
                        Skills
                      </div>

                      <div className="text-sm text-white font-bold">
                        {
                          userSkills.length
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0a1d25]/80 border border-[#1e3a42]/45">
                    <Award
                      size={15}
                      className="text-cyan-300"
                    />

                    <div className="text-left">
                      <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">
                        Your Level
                      </div>

                      <div className="text-sm text-white font-bold">
                        {avgLevelLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0a1d25]/80 border border-[#1e3a42]/45">
                    <Briefcase
                      size={15}
                      className="text-[#5eead4]"
                    />

                    <div className="text-left">
                      <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">
                        Available
                      </div>

                      <div className="text-sm text-white font-bold">
                        {jobs.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
            {/* TOP MATCHES */}
            {user &&
              !loading &&
              topMatches.length >
                0 && (
                <div className="jobs-fade-up mb-12">
                  <div className="flex items-end justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center">
                          <Flame
                            size={17}
                            className="text-white"
                          />
                        </div>

                        <div>
                          <h2 className="text-white font-bold">
                            Top Matches
                          </h2>

                          <p className="text-[11px] text-gray-600">
                            Strongest matches
                            for your profile
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        featuredRef.current?.scrollBy(
                          {
                            left: 370,
                            behavior:
                              'smooth',
                          }
                        )
                      }
                      className="flex items-center gap-1 text-xs font-semibold text-[#2dd4bf] hover:text-[#5eead4] transition-colors cursor-pointer"
                    >
                      Scroll
                      <ArrowRight
                        size={13}
                      />
                    </button>
                  </div>

                  <div
                    ref={featuredRef}
                    className="jobs-scrollbar flex gap-4 overflow-x-auto pb-4"
                  >
                    {topMatches.map(
                      (job) => (
                        <FeaturedJob
                          key={job.id}
                          job={job}
                          score={getMatchScore(
                            job
                          )}
                          applied={appliedJobs.has(
                            Number(
                              job.id
                            )
                          )}
                          onApply={
                            applyToJob
                          }
                          onDetails={
                            setSelectedJob
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              )}

            {/* STAT CARDS */}
            {user && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {[
                  {
                    label:
                      'Total Jobs',
                    value: jobs.length,
                    icon: Briefcase,
                    color:
                      '#2dd4bf',
                  },
                  {
                    label:
                      'Excellent',
                    value:
                      excellentCount,
                    icon: Crown,
                    color:
                      '#10b981',
                  },
                  {
                    label:
                      'Good Match',
                    value:
                      goodCount,
                    icon: Zap,
                    color:
                      '#14b8a6',
                  },
                  {
                    label:
                      'Fair Match',
                    value:
                      fairCount,
                    icon: Target,
                    color:
                      '#f59e0b',
                  },
                ].map(
                  ({
                    label,
                    value,
                    icon: Icon,
                    color,
                  }) => (
                    <div
                      key={label}
                      className="jobs-card rounded-2xl p-4 sm:p-5 text-center"
                    >
                      <div
                        className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3"
                        style={{
                          background:
                            `${color}12`,
                        }}
                      >
                        <Icon
                          size={18}
                          style={{
                            color,
                          }}
                        />
                      </div>

                      <div
                        className="text-2xl sm:text-3xl font-black"
                        style={{
                          color,
                        }}
                      >
                        {value}
                      </div>

                      <div className="text-[9px] sm:text-[10px] uppercase tracking-[.14em] text-gray-600 font-bold mt-1">
                        {label}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* SEARCH */}
            <div className="jobs-fade-up mb-5">
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 ${
                    searchFocused
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                  style={{
                    background:
                      'rgba(20,184,166,.045)',
                  }}
                />

                <div className="relative">
                  <Search
                    size={18}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                      searchFocused
                        ? 'text-[#2dd4bf]'
                        : 'text-gray-600'
                    }`}
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target
                          .value
                      )
                    }
                    onFocus={() =>
                      setSearchFocused(
                        true
                      )
                    }
                    onBlur={() =>
                      setSearchFocused(
                        false
                      )
                    }
                    placeholder="Search title, company, location or skills..."
                    className="w-full bg-[#091c24]/90 border border-[#1e3a42]/55 rounded-2xl pl-12 pr-12 py-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#14b8a6]/40 focus:ring-2 focus:ring-[#14b8a6]/10 transition-all"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch('')
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#12333c]/60 flex items-center justify-center text-gray-500 hover:text-white transition-all cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* FILTERS */}
            <div className="jobs-scrollbar flex gap-2 overflow-x-auto pb-3 mb-6">
              {filters.map(
                ({
                  key,
                  label,
                  icon: Icon,
                  count,
                }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setFilter(key)
                    }
                    className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      filter === key
                        ? 'bg-[#14b8a6]/12 border-[#14b8a6]/30 text-[#5eead4]'
                        : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#12333c]/25'
                    }`}
                  >
                    <Icon size={13} />
                    {label}

                    <span className="px-1.5 py-0.5 rounded-md bg-[#12333c]/50 text-[10px]">
                      {count}
                    </span>
                  </button>
                )
              )}
            </div>

            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#14b8a6] to-[#22d3ee]" />

                <h2 className="text-xs sm:text-sm text-white uppercase tracking-[.14em] font-black">
                  Opportunities
                </h2>

                <span className="px-2 py-0.5 rounded-full bg-[#12333c]/40 text-gray-500 text-[10px] font-bold">
                  {
                    filteredJobs.length
                  }
                </span>
              </div>

              <button
                type="button"
                onClick={fetchJobs}
                className="text-[11px] text-gray-600 hover:text-[#2dd4bf] transition-colors cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/[.06] border border-red-500/20 text-red-300 text-sm flex items-center justify-between gap-3">
                <span>{error}</span>

                <button
                  type="button"
                  onClick={fetchJobs}
                  className="shrink-0 px-3 py-1.5 rounded-lg border border-red-500/25 hover:bg-red-500/10 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* CONTENT */}
            {loading ? (
              <div className="space-y-4">
                {[
                  1, 2, 3, 4,
                ].map((item) => (
                  <JobSkeleton
                    key={item}
                  />
                ))}
              </div>
            ) : filteredJobs.length ===
              0 ? (
              <div className="jobs-fade-up text-center py-24">
                <div className="jobs-float w-24 h-24 rounded-3xl bg-[#091c24] border border-[#1e3a42]/50 flex items-center justify-center mx-auto mb-6">
                  <Briefcase
                    size={35}
                    className="text-gray-700"
                  />
                </div>

                <h3 className="text-xl text-white font-bold">
                  No jobs found
                </h3>

                <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                  Try another keyword or
                  change the selected
                  filter.
                </p>

                {(search ||
                  filter !==
                    'all') && (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="mt-5 px-5 py-2.5 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#5eead4] text-sm font-bold hover:bg-[#14b8a6]/15 transition-all cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map(
                  (job, index) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      index={index}
                      user={user}
                      match={getMatchDetails(
                        job
                      )}
                      applied={appliedJobs.has(
                        Number(job.id)
                      )}
                      saved={savedJobs.has(
                        job.id
                      )}
                      onApply={
                        applyToJob
                      }
                      onDetails={
                        setSelectedJob
                      }
                      onSave={
                        toggleSave
                      }
                    />
                  )
                )}
              </div>
            )}

            {!loading &&
              filteredJobs.length >
                0 && (
                <div className="flex justify-center mt-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#091c24]/80 border border-[#1e3a42]/40 text-[11px] text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />

                    Showing

                    <span className="text-white font-bold">
                      {
                        filteredJobs.length
                      }
                    </span>

                    of

                    <span className="text-white font-bold">
                      {jobs.length}
                    </span>

                    jobs
                  </div>
                </div>
              )}
          </section>
        </main>

        {selectedJob &&
          selectedMatch && (
            <JobDetailsModal
              job={selectedJob}
              user={user}
              match={
                selectedMatch
              }
              applied={appliedJobs.has(
                Number(
                  selectedJob.id
                )
              )}
              onApply={
                applyToJob
              }
              onClose={() =>
                setSelectedJob(
                  null
                )
              }
            />
          )}
      </div>
    </>
  );
}