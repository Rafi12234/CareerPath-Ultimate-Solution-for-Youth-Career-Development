import { useState } from 'react';
import { Send, MapPin, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import api from '../utils/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contacts', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: 'Dhaka, Bangladesh', color: 'text-[#2dd4bf]', bg: 'bg-[#14b8a6]/12' },
    { icon: Phone, label: 'Phone', value: '+880 1700 000000', color: 'text-[#06b6d4]', bg: 'bg-[#06b6d4]/12' },
    { icon: Mail, label: 'Email', value: 'support@careerpath.dev', color: 'text-emerald-400', bg: 'bg-emerald-500/12' },
    { icon: MessageSquare, label: 'Live Chat', value: 'Available 9AM â€“ 6PM (BST)', color: 'text-amber-400', bg: 'bg-amber-500/12' },
  ];

  const inputClass = "w-full px-4 py-3 bg-[#0a1214]/70 border border-[#1e3a42] rounded-xl text-white placeholder-gray-600 focus:border-[#14b8a6]/50 focus:ring-1 focus:ring-[#14b8a6]/20 transition-all duration-200";

  return (
    <div className="min-h-screen pt-24 pb-16 page-enter">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Get in Touch</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-[#0f1d22]/80 border border-[#1e3a42]/60 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-2">Contact Information</h2>
              <p className="text-gray-500 text-sm mb-6">
                Reach out through any of these channels or fill out the form.
              </p>

              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <item.icon size={17} className={item.color} />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-semibold">{item.label}</h4>
                      <p className="text-gray-500 text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-[#0f1d22]/80 border border-[#1e3a42]/60 rounded-2xl overflow-hidden h-44 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#14b8a6]/12 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <MapPin size={20} className="text-[#2dd4bf]" />
                </div>
                <p className="text-gray-600 text-sm">Interactive Map</p>
                <p className="text-gray-700 text-xs mt-0.5">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-[#0f1d22]/80 border border-[#1e3a42]/60 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">Send a Message</h2>

              {success && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                  <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                  <p className="text-emerald-400 text-sm font-medium">Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us what you need..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-linear-to-r from-[#14b8a6] to-[#06b6d4] rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-[#14b8a6]/20 hover:shadow-[#14b8a6]/30 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
