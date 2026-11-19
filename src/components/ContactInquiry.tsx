import React, { useState } from 'react';
import { Mail, Phone, Map, Building2, Layers, DollarSign, Send, CheckCircle2 } from 'lucide-react';

export default function ContactInquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    siteLocation: '',
    projectType: 'residential',
    materialFocus: 'concrete',
    approxBudget: 'budget-1m',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black border border-white/10 rounded-none shadow-2xl" id="architectural-inquiry-box">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="inquiry-grid">
        {/* Left Side: Editorial Pitch */}
        <div className="space-y-6 flex flex-col justify-between" id="inquiry-pitch-column">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#FF3B00] font-black uppercase">
              COLLABORATE OR HIRE
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-white font-sans uppercase tracking-tighter leading-none">
              GET IN TOUCH
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans uppercase tracking-wider">
              Computer Engineer & AI Engineer specializing in Python, Java, Three.js, React, and Generative AI engineering. Available for full-stack development, interactive 3D WebGL interfaces, or intelligent LLM pipeline integrations. Send a message to initiate collaboration.
            </p>
          </div>

          {/* Core Studio Coordinates */}
          <div className="space-y-3.5 border-t border-white/10 pt-6" id="studio-coordinates">
            <div className="flex items-center gap-3 text-neutral-300">
              <Building2 className="w-4 h-4 text-[#FF3B00]" />
              <div>
                <p className="text-[9px] font-mono text-neutral-500 uppercase font-bold">LOCATION</p>
                <p className="text-xs font-semibold uppercase">Indapur, Dist-Pune, Maharashtra, 413106</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <Mail className="w-4 h-4 text-[#FF3B00]" />
              <div>
                <p className="text-[9px] font-mono text-neutral-500 uppercase font-bold">EMAIL</p>
                <p className="text-xs font-semibold font-mono">munafshaikh0606@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <Phone className="w-4 h-4 text-[#FF3B00]" />
              <div>
                <p className="text-[9px] font-mono text-neutral-500 uppercase font-bold">PHONE / WHATSAPP</p>
                <p className="text-xs font-semibold font-mono">+91 7588757323</p>
              </div>
            </div>
          </div>

          <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
            © 2026 MUNAF SHAIKH. ALL RIGHTS RESERVED.
          </p>
        </div>

        {/* Right Side: Consultation Form */}
        <div className="bg-[#0A0A0A] p-6 rounded-none border border-white/10 relative" id="inquiry-form-column">
          {isSubmitted ? (
            <div className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center text-center p-6 rounded-none" id="success-screen">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 animate-bounce mb-4" />
              <h4 className="text-xl font-black text-white font-sans uppercase tracking-tighter">MESSAGE INGESTED</h4>
              <p className="text-xs text-neutral-400 mt-2 max-w-sm uppercase tracking-wider">
                Thank you, <strong className="text-white">{formData.name}</strong>. Your inquiry regarding <span className="text-[#FF3B00] font-bold">{formData.siteLocation || 'your project'}</span> has been submitted. Munaf will respond to your address <span className="text-white font-mono">{formData.email}</span> within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-6 px-6 py-2.5 border border-white/10 rounded-none text-xs font-mono uppercase text-neutral-400 hover:text-white hover:bg-[#FF3B00]/20 hover:border-[#FF3B00]/40 transition-all cursor-pointer font-bold"
                id="reset-form-btn"
              >
                SUBMIT NEW MESSAGE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" id="consult-form-element">
              {/* Name field */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">YOUR NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF3B00]"
                  id="form-input-name"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-3" id="form-contact-row">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="elena@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF3B00]"
                    id="form-input-email"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">PHONE NUMBER</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF3B00]"
                    id="form-input-phone"
                  />
                </div>
              </div>

              {/* Project or Role type */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-neutral-400 uppercase flex items-center gap-1 font-bold">
                  <Map className="w-3 h-3 text-[#FF3B00]" /> COMPANY OR PROJECT NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Tech Corporation"
                  value={formData.siteLocation}
                  onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF3B00]"
                  id="form-input-location"
                />
              </div>

              {/* Typology & Material selections */}
              <div className="grid grid-cols-2 gap-3" id="form-specs-row">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">ENGAGEMENT MODEL</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-none px-2.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#FF3B00]"
                    id="form-select-typology"
                  >
                    <option value="residential">FULL-TIME EMPLOYMENT</option>
                    <option value="commercial">FREELANCE CONTRACT</option>
                    <option value="cultural">COLLABORATIVE R&D</option>
                    <option value="civic">TECHNICAL INQUIRY</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">PRIMARY TECH INTENT</label>
                  <select
                    value={formData.materialFocus}
                    onChange={(e) => setFormData({ ...formData, materialFocus: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-none px-2.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#FF3B00]"
                    id="form-select-materials"
                  >
                    <option value="concrete">REACT + THREE.JS (3D WEB)</option>
                    <option value="timber">PYTHON + GEN AI ENGINE</option>
                    <option value="titanium">JAVA CORE SYSTEMS</option>
                    <option value="glass">FULL-STACK AR / GRAPHICS</option>
                  </select>
                </div>
              </div>

              {/* Approximate Budget Selection -> Project Scale */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold">ESTIMATED TIMELINE</label>
                <div className="grid grid-cols-3 gap-2" id="budget-selector-grid">
                  {[
                    { id: 'budget-1m', label: 'IMMEDIATE' },
                    { id: 'budget-5m', label: '1 - 3 MONTHS' },
                    { id: 'budget-20m', label: 'FLEXIBLE' },
                  ].map((budget) => {
                    const isSel = formData.approxBudget === budget.id;
                    return (
                      <button
                        key={budget.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, approxBudget: budget.id })}
                        className={`py-2 rounded-none text-[10px] font-mono border transition-all cursor-pointer font-bold ${
                          isSel 
                            ? 'bg-[#FF3B00]/25 text-white border-[#FF3B00]/45 font-bold' 
                            : 'bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                        id={`budget-btn-${budget.id}`}
                      >
                        {budget.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-white hover:bg-[#FF3B00] hover:text-white text-black font-black uppercase tracking-[0.2em] rounded-none text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                id="form-submit-btn"
              >
                <Send className="w-3.5 h-3.5" /> SEND MESSAGE TO MUNAF
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
