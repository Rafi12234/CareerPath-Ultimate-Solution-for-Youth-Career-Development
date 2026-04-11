import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

/**
 * Enhanced Custom Dropdown Component
 * Replaces native select elements with styled dropdown matching the modern UI
 */
function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  label,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  name,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to { value, label } format
  const normalizedOptions = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const displayLabel = normalizedOptions.find(opt => opt.value === value)?.label || placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Adjust menu position to avoid cutoff
  useEffect(() => {
    if (isOpen && menuRef.current && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      
      if (spaceBelow < menuHeight + 20) {
        menuRef.current.style.top = 'auto';
        menuRef.current.style.bottom = `calc(100% + 8px)`;
      } else {
        menuRef.current.style.top = 'calc(100% + 8px)';
        menuRef.current.style.bottom = 'auto';
      }
    }
  }, [isOpen]);

  const filteredOptions = normalizedOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayValue = displayLabel;
  const hasValue = value && value !== '';

  const handleSelect = (selectedValue) => {
    onChange({ target: { value: selectedValue, name } });
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl
          text-white text-sm appearance-none cursor-pointer
          focus:outline-none focus:border-[#14b8a6]/40 focus:ring-2 focus:ring-[#14b8a6]/10
          transition-all duration-300 text-left flex items-center justify-between
          hover:border-[#1e3a42]/70 hover:bg-[#0A1A22]/90
          disabled:opacity-50 disabled:cursor-not-allowed
          group relative overflow-hidden`}
      >
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent 
          opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />

        {/* Left content */}
        <div className="flex items-center gap-2 relative z-10">
          {Icon && <Icon size={14} className="text-gray-500" />}
          <span className={hasValue ? 'text-white' : 'text-gray-500'}>
            {displayValue}
          </span>
        </div>

        {/* Right icon */}
        <div className={`relative z-10 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={14} className="text-gray-500" />
        </div>

        {/* Focus indicator */}
        <div className="absolute inset-0 rounded-xl opacity-0 focus-visible:opacity-100 transition-opacity
          border-2 border-[#14b8a6]/50 pointer-events-none" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 w-full z-50 mt-0 bg-[#0A1A22]/95 backdrop-blur-xl border border-[#1e3a42]/60
            rounded-2xl shadow-2xl shadow-black/50 overflow-hidden scale-in"
          style={{
            top: 'calc(100% + 8px)',
            minWidth: 'max-content',
          }}
        >
          {/* Search input for larger lists */}
          {normalizedOptions.length > 6 && (
            <div className="p-3 border-b border-[#1e3a42]/40 bg-[#071015]/50">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A1A22]/70 border border-[#1e3a42]/50 rounded-lg
                    text-white text-sm placeholder:text-gray-600
                    focus:outline-none focus:border-[#14b8a6]/50 focus:ring-1 focus:ring-[#14b8a6]/20
                    transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No options found
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option, index) => {
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={`${option.value}-${index}`}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`w-full px-4 py-3 text-left text-sm font-medium
                        transition-all duration-200 relative overflow-hidden group
                        flex items-center justify-between
                        ${isSelected
                          ? 'bg-[#14b8a6]/15 text-[#2dd4bf] border-l-2 border-l-[#14b8a6]'
                          : 'text-gray-300 hover:bg-[#14b8a6]/10 hover:text-white'
                        }`}
                    >
                      {/* Hover background shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Text content */}
                      <span className="relative z-10">{option.label}</span>

                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#14b8a6]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Gradient border effect */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 
            bg-gradient-to-b from-[#14b8a6]/10 via-transparent to-transparent" />
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #14b8a6;
          border-radius: 3px;
          opacity: 0.5;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}

export default CustomDropdown;
