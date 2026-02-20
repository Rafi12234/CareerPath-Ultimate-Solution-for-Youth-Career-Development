import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-[#2a2a5a]/50 bg-[#080818]">
      {/* Glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-linear-to-r from-transparent via-[#7c3aed]/40 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <img
                src="https://res.cloudinary.com/dnzjg9lq8/image/upload/v1771619628/a-modern-minimalist-logo-design-featurin_1uJsjrn8RAWcX1Q_cP56-A_L4ta2RDPTV60VCZaV-IRKA_cover_sd_q0fsvx.jpg"
                alt="CareerPath Logo"
                className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-[#7c3aed]/20 group-hover:shadow-[#7c3aed]/40 transition-all duration-300"
              />
              <span className="text-xl font-bold gradient-text">CareerPath</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Ultimate Solution for Youth Career Development. Aligned with SDG 8 — Decent Work and Economic Growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', to: '/' },
                { name: 'Jobs', to: '/jobs' },
                { name: 'Resources', to: '/resources' },
                { name: 'Contact', to: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="text-gray-500 hover:text-[#8b5cf6] text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#8b5cf6] transition-all duration-200" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Resources</h4>
            <ul className="space-y-3">
              {['Career Guide', 'Skill Assessment', 'Learning Paths', 'Community'].map((item) => (
                <li key={item}>
                  <span className="text-gray-500 text-sm flex items-center gap-1.5 cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Connect</h4>
            <div className="flex gap-2.5 mb-6">
              {[
                { Icon: Github, label: 'GitHub' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Mail, label: 'Email' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 bg-[#1a1a3e] border border-[#2a2a5a] rounded-xl flex items-center justify-center text-gray-500 hover:text-[#8b5cf6] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/10 transition-all duration-200"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">
              support@careerpath.dev
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2a2a5a]/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} CareerPath. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1.5">
            Made with <Heart size={13} className="text-[#ec4899]" /> for youth career development
          </p>
        </div>
      </div>
    </footer>
  );
}
