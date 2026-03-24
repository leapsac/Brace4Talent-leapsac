import { useState, useEffect, useRef, FormEvent, RefObject } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Users, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Linkedin,
  Award,
  Briefcase,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IntersectionOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

// Custom hook for intersection observer
function useIntersection(ref: RefObject<HTMLElement | null>, options: IntersectionOptions = {}) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        if (options.triggerOnce) observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return isIntersecting;
}

// Counter Component
const Counter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isVisible = useIntersection(ref, { triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}</span>;
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'about', 'services', 'credentials', 'contact'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, you'd send data to a backend here
  };

  const navLinks = [
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Credentials', href: '#credentials', id: 'credentials' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-gold selection:text-white">
      {/* Navbar */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/95 backdrop-blur-md h-[80px] shadow-sm' : 'bg-white h-[100px]'
        } border-b border-border`}
      >
        <div className="container-custom h-full flex items-center justify-between">
          <a href="#home" className="flex items-center">
            {/* Element A — Logo Image Placeholder */}
            <div style={{
              width: '48px',
              height: '48px',
              background: '#E8EEF5',
              border: '1.5px dashed #94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img src="public/logo.png" alt="Logo" style={{width:'100%',height:'100%',objectFit:'contain'}} />
            </div>

            {/* Element B — Brand Text */}
            <div style={{ marginLeft: '12px' }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '18px',
                fontWeight: '800',
                color: '#0D1F3C',
                letterSpacing: '-0.01em',
                lineHeight: '1'
              }}>Brace4Talent</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px',
                fontWeight: '500',
                color: '#C9A84C',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginTop: '3px'
              }}>Consulting</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-[13px] font-bold uppercase tracking-[0.1em] transition-all hover:text-gold ${
                  activeSection === link.id ? 'text-gold' : 'text-navy'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a href="#contact" className="btn-primary">
              Book a Call
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-navy p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-border shadow-xl py-10 px-6 flex flex-col gap-8"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-bold uppercase tracking-widest text-navy"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact" 
                className="btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Book a Call
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-[180px] pb-24 lg:pb-32 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="section-label">Strategic Talent Acquisition</span>
              <h1 className="text-[42px] lg:text-[72px] font-black mb-8 text-navy leading-[1.1]">
                We help fast-growing companies hire right, so scaling <span className="italic text-blue-accent font-bold">doesn't break them.</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted leading-relaxed mb-10 max-w-[600px]">
                Boutique talent acquisition consulting for companies that can't afford to get hiring wrong. We build the systems, processes, and teams that power sustainable growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <a href="#contact" className="btn-primary flex items-center gap-3">
                  Schedule Consultation <ArrowRight size={16} />
                </a>
                <a href="#services" className="btn-secondary">
                  Our Services
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-off border border-border overflow-hidden relative group">
                <img 
                  src="public/lance-hero.jpg" 
                  alt="Lance Tripp" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 border-[15px] border-white/10 pointer-events-none"></div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-navy p-8 text-white hidden lg:block shadow-2xl">
                <div className="text-gold font-serif text-4xl mb-1">20+</div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">Years of Global<br/>TA Leadership</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="bg-navy py-20 text-white overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="text-center lg:text-left">
              <div className="text-gold font-serif text-5xl mb-3">
                <Counter end={500} />+
              </div>
              <div className="text-[11px] uppercase tracking-widest font-bold opacity-60">Executive Placements</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-gold font-serif text-5xl mb-3">
                <Counter end={12} />
              </div>
              <div className="text-[11px] uppercase tracking-widest font-bold opacity-60">Global Markets</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-gold font-serif text-5xl mb-3">
                $<Counter end={40} />M+
              </div>
              <div className="text-[11px] uppercase tracking-widest font-bold opacity-60">Hiring Budget Managed</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-gold font-serif text-5xl mb-3">
                <Counter end={100} />%
              </div>
              <div className="text-[11px] uppercase tracking-widest font-bold opacity-60">Client Retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-off">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-20 items-center">
            <div className="relative">
              <div className="aspect-[3/4] bg-white border border-border p-4 shadow-xl">
                <img 
                  src="public/lance-about.jpg" 
                  alt="Lance Tripp" 
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 border-t border-r border-gold"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 border-b border-l border-gold"></div>
            </div>
            <div>
              <span className="section-label">The Principal</span>
              <h2 className="text-4xl lg:text-5xl mb-8 leading-tight">
                Lance Tripp: A Global Perspective on Talent.
              </h2>
              <div className="gold-divider"></div>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  With over two decades of experience, Lance Tripp has led Talent Acquisition for some of the world's most recognizable high-growth brands. From Sabre Corporation to US Anesthesia Partners, his career has been defined by building scalable hiring engines in complex global markets.
                </p>
                <p>
                  Lance founded Brace4Talent to bring that same enterprise-grade strategic thinking to boutique firms and fast-scaling mid-market companies. He doesn't just fill roles; he builds the infrastructure that makes hiring a competitive advantage.
                </p>
              </div>
              <div className="mt-12 flex flex-wrap gap-4">
                {['Global TA Strategy', 'ATS Implementation', 'Executive Search', 'HR Operations'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-white border border-border text-[11px] font-bold uppercase tracking-wider text-navy">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-[700px] mx-auto mb-20">
            <span className="section-label mx-auto">Our Expertise</span>
            <h2 className="text-4xl lg:text-5xl mb-6">How We Help You Scale.</h2>
            <p className="text-muted">We provide the strategic framework and tactical execution needed to transform your hiring from a bottleneck into a growth engine.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Search className="w-8 h-8" />,
                title: "Strategic Sourcing",
                desc: "We don't wait for candidates to find you. We proactively identify and engage the top 1% of talent that fits your specific culture and goals."
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "TA Infrastructure",
                desc: "Building the systems, processes, and tech stacks (ATS/CRM) that allow your internal team to hire with speed, quality, and predictability."
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Growth Advisory",
                desc: "Fractional TA leadership for companies in transition. We help you navigate the complexities of rapid scaling without breaking your culture."
              }
            ].map((service, i) => (
              <div key={i} className="p-10 bg-white border border-border hover:border-gold transition-all duration-500 group">
                <div className="text-gold mb-8 group-hover:scale-110 transition-transform duration-500">{service.icon}</div>
                <h3 className="text-2xl mb-4">{service.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-8">{service.desc}</p>
                <a href="#contact" className="text-[11px] font-bold uppercase tracking-widest text-navy flex items-center gap-2 hover:text-gold transition-colors">
                  Learn More <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials / Experience */}
      <section id="credentials" className="section-padding bg-off">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-20">
            <div>
              <span className="section-label">Proven Track Record</span>
              <h2 className="text-4xl mb-8">Career Milestones.</h2>
              <p className="text-muted mb-10">A history of leading talent functions for global organizations and high-growth disruptors.</p>
              <div className="p-8 bg-navy text-white">
                <Award className="text-gold w-10 h-10 mb-6" />
                <h4 className="text-xl mb-2 font-serif">Global Reach</h4>
                <p className="text-xs opacity-70 leading-relaxed">Implemented enterprise hiring systems across US, Canada, UK, and Australia.</p>
              </div>
            </div>
            <div className="space-y-12">
              {[
                { company: "Enable", role: "Head of Talent Acquisition", period: "2022 - Present" },
                { company: "Securonix", role: "Global TA Leader", period: "2020 - 2022" },
                { company: "US Anesthesia Partners", role: "Director of Recruiting", period: "2016 - 2020" },
                { company: "Sabre Corporation", role: "Principal TA Consultant", period: "2012 - 2016" }
              ].map((exp, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-gold"></div>
                    <div className="w-[1px] h-full bg-border mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <span className="text-[11px] font-bold text-gold uppercase tracking-widest mb-2 block">{exp.period}</span>
                    <h3 className="text-2xl mb-1 group-hover:text-blue-accent transition-colors">{exp.company}</h3>
                    <p className="text-muted font-sans font-medium">{exp.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Brace4Talent */}
      <section className="section-padding bg-navy text-white">
        <div className="container-custom">
          <div className="text-center max-w-[800px] mx-auto mb-20">
            <span className="section-label mx-auto">The Difference</span>
            <h2 className="text-4xl lg:text-5xl mb-8">Why Leaders Trust Us.</h2>
            <div className="gold-divider mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10">
                <Users className="text-gold w-8 h-8" />
              </div>
              <h4 className="text-xl mb-4 font-serif">Embedded Partnership</h4>
              <p className="text-sm opacity-70 leading-relaxed">We don't work for you; we work with you. We embed ourselves in your culture to understand your true hiring needs.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10">
                <Briefcase className="text-gold w-8 h-8" />
              </div>
              <h4 className="text-xl mb-4 font-serif">Process-First Approach</h4>
              <p className="text-sm opacity-70 leading-relaxed">Placements are temporary; processes are permanent. We build the systems that make hiring sustainable long-term.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10">
                <CheckCircle2 className="text-gold w-8 h-8" />
              </div>
              <h4 className="text-xl mb-4 font-serif">Data-Driven Results</h4>
              <p className="text-sm opacity-70 leading-relaxed">We replace gut-feel with metrics. Every decision is backed by market data and performance analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="p-12 bg-off border-l-4 border-gold relative">
              <div className="text-6xl text-gold/20 font-serif absolute top-8 right-12">"</div>
              <p className="text-xl text-navy italic leading-relaxed mb-10 font-serif">
                "Lance transformed our hiring from a chaotic scramble into a predictable engine. We've scaled 40% this year without losing our culture. His enterprise experience was exactly what we needed."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy/10 rounded-full"></div>
                <div>
                  <div className="font-bold text-navy text-sm">CEO, High-Growth SaaS</div>
                  <div className="text-xs text-muted uppercase tracking-widest">Series B Fintech</div>
                </div>
              </div>
            </div>
            <div className="p-12 bg-off border-l-4 border-gold relative">
              <div className="text-6xl text-gold/20 font-serif absolute top-8 right-12">"</div>
              <p className="text-xl text-navy italic leading-relaxed mb-10 font-serif">
                "The depth of TA knowledge Brace4Talent brought was exceptional. They didn't just find us people; they fixed our entire process and implemented our first real ATS."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy/10 rounded-full"></div>
                <div>
                  <div className="font-bold text-navy text-sm">VP of People</div>
                  <div className="text-xs text-muted uppercase tracking-widest">Global Logistics Firm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-off">
        <div className="container-custom">
          <div className="max-w-[1000px] mx-auto bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-2/5 bg-navy p-12 lg:p-16 text-white">
              <span className="text-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-6 block">Get in Touch</span>
              <h2 className="text-4xl mb-10 leading-tight">Ready to build your hiring engine?</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <Mail className="text-gold w-6 h-6 mt-1" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Email</div>
                    <div className="text-sm font-bold">lance@brace4talent.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <Phone className="text-gold w-6 h-6 mt-1" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Phone</div>
                    <div className="text-sm font-bold">(817) 527-1602</div>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <MapPin className="text-gold w-6 h-6 mt-1" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Location</div>
                    <div className="text-sm font-bold">Southlake, Texas</div>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-white/10">
                <a href="https://linkedin.com" className="inline-flex items-center gap-3 text-gold hover:text-white transition-colors">
                  <Linkedin size={20} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Connect on LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="lg:w-3/5 bg-white" style={{ padding: '64px 56px' }}>
              {/* Block 1: Heading */}
              <p className="section-label">GET IN TOUCH</p>
              <h2 style={{
                fontFamily: "'Playfair Display'",
                fontSize: '48px',
                fontWeight: '800',
                color: '#0D1F3C',
                lineHeight: '1.1',
                marginTop: '12px',
                marginBottom: '40px'
              }}>Ready to build<br/>your hiring engine?</h2>

              {/* Block 2: Contact Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Row 1 — Email */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <Mail size={20} color="#C9A84C" strokeWidth={1.5} style={{ marginTop: '4px' }} />
                  <div>
                    <div style={{
                      fontFamily: "'DM Sans'",
                      fontSize: '10px',
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      marginBottom: '4px'
                    }}>EMAIL</div>
                    <a href="mailto:lance@brace4talent.com" style={{
                      fontFamily: "'DM Sans'",
                      fontSize: '16px',
                      color: '#0D1F3C',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease'
                    }} className="hover:text-gold">lance@brace4talent.com</a>
                  </div>
                </div>

                {/* Row 2 — Phone */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <Phone size={20} color="#C9A84C" strokeWidth={1.5} style={{ marginTop: '4px' }} />
                  <div>
                    <div style={{
                      fontFamily: "'DM Sans'",
                      fontSize: '10px',
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      marginBottom: '4px'
                    }}>PHONE</div>
                    <a href="tel:8175271602" style={{
                      fontFamily: "'DM Sans'",
                      fontSize: '16px',
                      color: '#0D1F3C',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease'
                    }} className="hover:text-gold">(817) 527-1602</a>
                  </div>
                </div>

                {/* Row 3 — Location */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <MapPin size={20} color="#C9A84C" strokeWidth={1.5} style={{ marginTop: '4px' }} />
                  <div>
                    <div style={{
                      fontFamily: "'DM Sans'",
                      fontSize: '10px',
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      marginBottom: '4px'
                    }}>LOCATION</div>
                    <div style={{
                      fontFamily: "'DM Sans'",
                      fontSize: '16px',
                      color: '#0D1F3C',
                      fontWeight: '600'
                    }}>Southlake, Texas</div>
                  </div>
                </div>
              </div>

              {/* Thin gold divider line */}
              <div style={{
                margin: '40px 0',
                height: '1px',
                background: '#C9A84C',
                opacity: '0.3',
                width: '100%'
              }}></div>

              {/* Block 3: LinkedIn CTA */}
              <a 
                href="https://www.linkedin.com/in/lancetripp/" 
                target="_blank"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  transition: 'opacity 0.15s ease',
                  cursor: 'pointer'
                }}
                className="hover:opacity-70"
              >
                <Linkedin size={20} color="#C9A84C" />
                <span style={{
                  fontFamily: "'DM Sans'",
                  fontSize: '12px',
                  fontWeight: '500',
                  letterSpacing: '0.15em',
                  color: '#C9A84C',
                  textTransform: 'uppercase'
                }}>CONNECT ON LINKEDIN</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-20 text-white border-t border-white/5">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[2fr_1fr_1.5fr] gap-20">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-white font-serif text-lg font-bold">
                  B
                </div>
                <span className="text-white font-serif text-xl font-bold tracking-tight">Brace4Talent</span>
              </div>
              <p className="text-sm opacity-50 leading-relaxed max-w-[300px] mb-10">
                Strategic talent acquisition consulting for companies that can't afford to get hiring wrong.
              </p>
              <div className="flex gap-6">
                <a 
                  href="https://www.linkedin.com/in/lancetripp/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-50 hover:opacity-100 hover:text-gold transition-all"
                >
                  <Linkedin size={20} />
                </a>
                <a href="#" className="opacity-50 hover:opacity-100 hover:text-gold transition-all"><Mail size={20} /></a>
              </div>
            </div>
            <div>
              <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold mb-8">Navigation</h5>
              <ul className="space-y-4">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm opacity-50 hover:opacity-100 hover:text-gold transition-all">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:text-right">
              <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold mb-8">Office</h5>
              <p className="text-sm opacity-50 mb-2">Southlake, Texas</p>
              <p className="text-sm opacity-50 mb-10">(817) 527-1602</p>
              <p className="text-[11px] opacity-30 uppercase tracking-widest">
                &copy; 2025 Brace4Talent Consulting. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
