import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, AlertCircle, CheckCircle2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import GlassCard from '../../components/ui/GlassCard.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import NeonButton from '../../components/ui/NeonButton.jsx';
import portfolioService from '../../services/portfolio.service.js';

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Primary Email',
    value: 'usama.code404@gmail.com',
    href: 'mailto:usama.code404@gmail.com',
  },
  {
    icon: Phone,
    label: 'Direct Phone / WhatsApp',
    value: '+92 309 8525906',
    href: 'tel:+923098525906',
  },
  {
    icon: MapPin,
    label: 'Operational Base',
    value: 'Lahore, Pakistan (GMT+5)',
    href: '#',
  },
];

const SOCIAL_LINKS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/chusamaikram' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/usama-ikram-252052182' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
];

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Engine
  const validateField = (name, value) => {
    let error = '';
    const trimmed = String(value || '').trim();

    if (name === 'name') {
      if (!trimmed) {
        error = 'Your name is required.';
      } else if (trimmed.length < 2) {
        error = 'Name must be at least 2 characters.';
      } else if (trimmed.length > 70) {
        error = 'Name cannot exceed 70 characters.';
      }
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!trimmed) {
        error = 'Email address is required.';
      } else if (!emailRegex.test(trimmed)) {
        error = 'Please provide a valid email format (e.g. name@domain.com).';
      }
    }

    if (name === 'subject') {
      if (!trimmed) {
        error = 'Inquiry subject is required.';
      } else if (trimmed.length < 3) {
        error = 'Subject must be at least 3 characters.';
      }
    }

    if (name === 'message') {
      if (!trimmed) {
        error = 'Message content is required.';
      } else if (trimmed.length < 10) {
        error = `Please write at least 10 characters (currently ${trimmed.length}).`;
      }
    }

    return error;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({ name: true, email: true, subject: true, message: true });
      toast.error('Validation Warning', {
        description: 'Please correct the highlighted form errors before dispatch.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Record message into Portfolio Service (API + LocalStorage for Admin Dashboard)
      await portfolioService.sendMessage(formData);

      // 2. Fire EmailJS notification if available
      try {
        await emailjs.send(
          'service_g09wqkb',
          'template_8eft0vb',
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
          'PuDH9f84JhCHa_L2u'
        );
      } catch (emailErr) {
        console.warn('EmailJS delivery fallback (stored in Admin Dashboard):', emailErr);
      }

      toast.success('Transmission Confirmed!', {
        description: 'Your message has been logged in Usama’s operations dashboard. Response ETA: < 24 Hours.',
        style: {
          background: '#080e1e',
          border: '1px solid rgba(34, 211, 238, 0.4)',
          color: '#ffffff',
        },
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
      setTouched({});
    } catch (error) {
      toast.error('Dispatch failed', {
        description: 'Please reach out directly via email at usama.code404@gmail.com',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="DIRECT CONTACT"
          title="Initialize"
          highlight="Collaboration"
          subtitle="Looking for a high-performance frontend engineer for your project, contract, or team? Transmit your query below."
        />

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Contact Info & Status Card (Equal Height) */}
          <div className="lg:col-span-5 flex flex-col">
            <GlassCard cyberCorners glowColor="cyan" className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                {/* Header Status Bar matching right card's header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      OPEN TO INQUIRIES
                    </span>
                  </div>
                  <div className="font-mono text-xs text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-400/30">
                    ONLINE GMT+5
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Direct Telemetry</h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6">
                  Available for Frontend Engineering roles, UI/UX replicas, and enterprise React contracts.
                </p>

                {/* Direct Channel Links */}
                <div className="space-y-3.5">
                  {CONTACT_INFO.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-400/30 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono text-slate-400">{item.label}</div>
                          <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {item.value}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Social Channels at Bottom matching Form button baseline */}
              <div className="pt-6 border-t border-white/10 mt-6">
                <div className="text-xs font-mono text-slate-400 mb-3">PUBLIC NETWORKS</div>
                <div className="flex gap-2">
                  {SOCIAL_LINKS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-all"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{s.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right: Interactive Contact Form with Real-time Validation (Equal Height) */}
          <div className="lg:col-span-7 flex flex-col">
            <GlassCard cyberCorners glowColor="cyan" className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white">Direct Message Transmission</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Instant sync to Usama’s Admin Dashboard & Email
                    </p>
                  </div>
                  <div className="font-mono text-xs text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-400/30">
                    ENCRYPTED TLS
                  </div>
                </div>

              <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col justify-between space-y-4 pt-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <label className="text-slate-300">YOUR IDENTITY / NAME *</label>
                      {touched.name && !errors.name && formData.name && (
                        <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Elena Vance"
                      className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans transition-all ${
                        touched.name && errors.name
                          ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-950/10'
                          : touched.name && formData.name
                          ? 'border-emerald-500/50 focus:border-emerald-400'
                          : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                      }`}
                    />
                    {touched.name && errors.name && (
                      <p className="text-rose-400 text-xs font-mono flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <label className="text-slate-300">RETURN EMAIL *</label>
                      {touched.email && !errors.email && formData.email && (
                        <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. elena@company.com"
                      className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans transition-all ${
                        touched.email && errors.email
                          ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-950/10'
                          : touched.email && formData.email
                          ? 'border-emerald-500/50 focus:border-emerald-400'
                          : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                      }`}
                    />
                    {touched.email && errors.email && (
                      <p className="text-rose-400 text-xs font-mono flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <label className="text-slate-300">PROJECT / INQUIRY TOPIC *</label>
                    {touched.subject && !errors.subject && formData.subject && (
                      <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Frontend Architecture or Contract Offer"
                    className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans transition-all ${
                      touched.subject && errors.subject
                        ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-950/10'
                        : touched.subject && formData.subject
                        ? 'border-emerald-500/50 focus:border-emerald-400'
                        : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.subject && errors.subject && (
                    <p className="text-rose-400 text-xs font-mono flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <label className="text-slate-300">PROJECT SPECIFICATIONS / MESSAGE *</label>
                    <span className="text-[10px] text-slate-400">
                      {formData.message.trim().length} chars (min 10)
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Provide details about timeline, deliverables, or technical stack..."
                    className={`w-full bg-slate-900/80 border rounded-xl p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans resize-none transition-all ${
                      touched.message && errors.message
                        ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-950/10'
                        : touched.message && formData.message.trim().length >= 10
                        ? 'border-emerald-500/50 focus:border-emerald-400'
                        : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.message && errors.message && (
                    <p className="text-rose-400 text-xs font-mono flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                <NeonButton
                  type="submit"
                  size="lg"
                  variant="primary"
                  isLoading={isSubmitting}
                  icon={Send}
                  iconPosition="right"
                  className="w-full mt-2"
                >
                  Send Encrypted Message
                </NeonButton>
              </form>
            </GlassCard>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
