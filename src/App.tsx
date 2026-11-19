import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { projects } from './data/projects';
import { TimeOfDay, ViewMode, InteractiveParams, Project } from './types';
import ThreeCanvas from './components/ThreeCanvas';
import Navigation from './components/Navigation';
import ProjectShowcase from './components/ProjectShowcase';
import BlueprintControlLab from './components/BlueprintControlLab';
import ContactInquiry from './components/ContactInquiry';
import { ArrowDown, Layers, Compass, Zap, Sparkles, Building2, Eye, Cpu } from 'lucide-react';

export default function App() {
  // Navigation & View States
  const [scrollIndex, setScrollIndex] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('noon');
  const [viewMode, setViewMode] = useState<ViewMode>('solid');
  const [isOrbitMode, setIsOrbitMode] = useState(false);
  const [cameraPresetName, setCameraPresetName] = useState<'hero' | 'detail' | 'interior'>('hero');

  // Multi-project parametric configs mapping
  const [projectParams, setProjectParams] = useState<Record<string, InteractiveParams>>(() => {
    const initial: Record<string, InteractiveParams> = {};
    projects.forEach((p) => {
      initial[p.id] = { ...p.defaultParams };
    });
    return initial;
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync scroll positioning with active project selection
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollTop = scrollContainerRef.current.scrollTop;
    const height = scrollContainerRef.current.clientHeight;
    // Calculate scroll index based on midpoint threshold
    const index = Math.round(scrollTop / height);
    if (index !== scrollIndex) {
      setScrollIndex(index);
      // Reset camera to wide heroic angle when entering a new project
      setCameraPresetName('hero');
      // Turn off orbit mode during transitions to let scenic camera take over smoothly
      setIsOrbitMode(false);
    }
  };

  // Determine active project based on scroll index
  // Index 0: Hero. Index 1-4: Projects. Index 5: Contact
  const activeProjectIndex = Math.max(0, Math.min(projects.length - 1, scrollIndex === 0 ? 0 : scrollIndex === 5 ? 3 : scrollIndex - 1));
  const activeProject = projects[activeProjectIndex];
  const activeParams = projectParams[activeProject.id];

  // Callback to update current project's parameters
  const handleParamsChange = (updated: InteractiveParams) => {
    setProjectParams((prev) => ({
      ...prev,
      [activeProject.id]: updated,
    }));
  };

  // Helper to scroll smoothly to a specific section index
  const scrollToSection = (index: number) => {
    if (!scrollContainerRef.current) return;
    const height = scrollContainerRef.current.clientHeight;
    scrollContainerRef.current.scrollTo({
      top: index * height,
      behavior: 'smooth',
    });
  };

  // Preset configuration jumps
  const startExploring = () => {
    scrollToSection(1);
  };

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0c] text-slate-100 overflow-hidden font-sans" id="app-root-container">
      {/* 1. BACKGROUND INTERACTIVE 3D WEBGL CANVAS */}
      <div className="absolute inset-0 z-0 pointer-events-auto" id="threejs-canvas-background-layer">
        <ThreeCanvas
          activeProject={activeProject}
          timeOfDay={timeOfDay}
          viewMode={viewMode}
          params={activeParams}
          isOrbitMode={isOrbitMode}
          cameraPresetName={cameraPresetName}
        />
      </div>

      {/* 2. ATMOSPHERIC OVERLAYS & NOISE */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/60 pointer-events-none z-10" id="ambient-lighting-filter" />

      {/* 3. PERSISTENT NAVIGATION HUD */}
      <Navigation
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => {
          const idx = projects.findIndex((proj) => proj.id === p.id);
          if (idx !== -1) {
            scrollToSection(idx + 1);
          }
        }}
        timeOfDay={timeOfDay}
        onChangeTimeOfDay={setTimeOfDay}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        isOrbitMode={isOrbitMode}
        onToggleOrbitMode={() => setIsOrbitMode(!isOrbitMode)}
        cameraPresetName={cameraPresetName}
        onChangeCameraPreset={setCameraPresetName}
      />

      {/* 4. PERFORMANCE BLUEPRINT GAUGES */}
      <BlueprintControlLab 
        project={activeProject} 
        params={activeParams} 
      />

      {/* 5. VERTICAL SMOOTH-SCROLL CONTROLLER OVERLAY */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-auto snap-y snap-mandatory scroll-smooth z-20 pointer-events-none"
        id="scroll-sections-container"
      >
        {/* --- SECTION 0: HERO ENTRY SCREEN --- */}
        <section 
          className="w-full h-screen snap-start relative flex flex-col justify-center items-center px-6 text-center"
          id="hero-intro-scroll-section"
        >
          <div className="max-w-4xl space-y-6 pointer-events-auto select-none mt-16" id="hero-headings-block">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-1"
              id="hero-tagline-container"
            >
              <span className="text-[11px] uppercase tracking-[0.4em] opacity-40 text-neutral-300">
                Computer Engineer + AI Engineer
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-[64px] md:text-[110px] leading-[0.85] font-black tracking-tighter uppercase font-sans text-white text-center"
              id="hero-title"
            >
              MUNAF<br/>SHAIKH
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-xs md:text-sm font-mono text-neutral-400 max-w-2xl mx-auto tracking-widest font-light uppercase"
              id="hero-subtext"
            >
              Full-Stack Developer, AI Engineer, & 3D Web Enthusiast crafting immersive digital systems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-6"
              id="hero-cta-group"
            >
              <button
                onClick={startExploring}
                className="bg-white text-black px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#FF3B00] hover:text-white transition-colors cursor-pointer"
                id="btn-hero-explore"
              >
                View 3D Projects
              </button>
              <button
                onClick={() => scrollToSection(5)}
                className="bg-transparent text-white border border-white/20 px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#FF3B00] hover:text-white hover:border-[#FF3B00] transition-colors cursor-pointer"
                id="btn-hero-contact"
              >
                Get In Touch
              </button>
            </motion.div>
          </div>

          {/* Scrolling Guide */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5" id="hero-scroll-reminder">
            <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-500 uppercase">SCROLL TO TRANSLATE SCENE</span>
            <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-[#FF3B00] rounded-full animate-bounce"></div>
            </div>
          </div>
        </section>

        {/* --- SECTIONS 1 - 4: ARCHITECTURAL PROJECTS SHOWCASES --- */}
        {projects.map((proj, idx) => {
          const isCurrentActive = activeProject.id === proj.id && scrollIndex === idx + 1;
          
          return (
            <section
              key={proj.id}
              className="w-full h-screen snap-start relative flex flex-col justify-between"
              id={`section-scroller-${proj.id}`}
            >
              {/* Floating Layout */}
              <div className="w-full h-full flex flex-row items-stretch justify-start" id={`section-flex-row-${proj.id}`}>
                {/* Showcase Sidebar Overlay (Interactions active) */}
                <div className="h-full pointer-events-auto" id={`showcase-sidebar-wrapper-${proj.id}`}>
                  <ProjectShowcase
                    project={proj}
                    timeOfDay={timeOfDay}
                    viewMode={viewMode}
                    params={projectParams[proj.id]}
                    onChangeParams={handleParamsChange}
                    onNextProject={() => scrollToSection(idx + 2)}
                    onPrevProject={() => scrollToSection(idx)}
                    isFirst={idx === 0}
                    isLast={idx === projects.length - 1}
                  />
                </div>

                {/* Ambient Right Spacing - Allows clicking/dragging background 3D model */}
                <div 
                  className="flex-1 hidden md:flex flex-col justify-between p-6 items-end pointer-events-none select-none relative"
                  id={`landscape-scenic-overlay-${proj.id}`}
                >
                  {/* Subtle 3D Navigation Watermark */}
                  <div className="text-right" id={`watermark-box-${proj.id}`}>
                    <p className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">ACTIVE GEOMETRY</p>
                    <h3 className="text-xl font-light text-white/40 tracking-wider uppercase font-serif">{proj.title}</h3>
                  </div>

                  {/* Corner stats decoration */}
                  <div className="flex gap-8 text-right bg-[#0A0A0A]/80 backdrop-blur-md p-4 border border-white/10 rounded-sm" id={`stats-deco-panel-${proj.id}`}>
                    <div>
                      <p className="text-[8px] font-mono text-neutral-400 uppercase">CORE ENGINE</p>
                      <p className="text-xs font-mono font-bold text-[#FF3B00]">ACTIVE</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-mono text-neutral-400 uppercase">COORDINATES</p>
                      <p className="text-xs font-mono font-bold text-white">18.11° N, 74.85° E</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-mono text-neutral-400 uppercase">SYS STABILITY</p>
                      <p className="text-xs font-mono font-bold text-emerald-400">100%</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* --- SECTION 5: CONTACT COMMISSION STUDIO --- */}
        <section 
          className="w-full h-screen snap-start relative flex flex-col justify-center items-center px-6"
          id="contact-form-scroll-section"
        >
          <div className="w-full max-w-4xl pointer-events-auto mt-16" id="form-container-box">
            <ContactInquiry />
          </div>
        </section>
      </div>

      {/* 6. STATIC SIDE PAGE DOT INDICATORS */}
      <div 
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-3 select-none pointer-events-auto"
        id="scrolling-pagination-indicator"
      >
        {/* Hero Dot */}
        <button
          onClick={() => scrollToSection(0)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            scrollIndex === 0 
              ? 'bg-[#FF3B00] scale-125 shadow-lg shadow-[#FF3B00]/50' 
              : 'bg-white/20 hover:bg-white/40'
          }`}
          title="Intro Landing"
          id="nav-dot-0"
        />

        {/* Project Dots */}
        {projects.map((proj, idx) => (
          <button
            key={proj.id}
            onClick={() => scrollToSection(idx + 1)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              scrollIndex === idx + 1 
                ? 'bg-[#FF3B00] scale-125 shadow-lg shadow-[#FF3B00]/50' 
                : 'bg-white/20 hover:bg-white/40'
            }`}
            title={proj.title}
            id={`nav-dot-${idx + 1}`}
          />
        ))}

        {/* Contact Dot */}
        <button
          onClick={() => scrollToSection(5)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            scrollIndex === 5 
              ? 'bg-[#FF3B00] scale-125 shadow-lg shadow-[#FF3B00]/50' 
              : 'bg-white/20 hover:bg-white/40'
          }`}
          title="Inquiry & Commission Studio"
          id="nav-dot-5"
        />
      </div>
    </div>
  );
}
