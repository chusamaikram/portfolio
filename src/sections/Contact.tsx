import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Linkedin, Github, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'usama.code404@gmail.com',
    href: 'mailto:usama.code404@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+923098525906',
    href: 'tel:+923098525906',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Lahore, Pakistan',
    href: '#',
  },
];

const socialLinks = [
  { icon: Github, href: 'https://github.com/chusamaikram', label: 'GitHub' },
  { icon: Linkedin, href: 'www.linkedin.com/in/usama-ikram-252052182', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email to you
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

      // Send auto-reply to sender
      try {
        await emailjs.send(
          'service_g09wqkb',
          'template_hkmwp0z',
          {
            to_email: formData.email,
            name: formData.name,
            title: formData.subject,
          },
          'PuDH9f84JhCHa_L2u'
        );
      } catch (autoReplyError) {
        console.log('Auto-reply failed:', autoReplyError);
      }

      toast.success('Message Sent!', {
        description: 'Thank you for reaching out. I\'ll get back to you soon.',
        style: {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: '#f8fafc',
        },
        className: 'glass',
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.log('Main email failed:', error);
      toast.error('Failed to send message', {
        description: 'Please try again or contact me directly.',
        style: {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f8fafc',
        },
        className: 'glass',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-cyan-400 text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Have a project in mind or want to collaborate? I'd love to hear from you.
            Drop me a message and let's create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center group-hover:from-cyan-400/30 group-hover:to-blue-500/30 transition-all">
                      <item.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                      <div className="font-medium text-foreground">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Follow Me
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300 hover-lift"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="glass rounded-2xl p-8 bg-gradient-to-br from-cyan-400/10 to-blue-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-medium">Available for Work</span>
              </div>
              <p className="text-muted-foreground text-sm">
                I'm currently accepting new projects and freelance opportunities.
                Let's discuss how I can help bring your ideas to life.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Send a Message
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-cyan-400/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-cyan-400/20"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Project Inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-cyan-400/20 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-background font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
