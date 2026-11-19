import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, TimeOfDay, ViewMode, InteractiveParams } from '../types';
import { MapPin, Calendar, Compass, Box, Layers, ArrowUpRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface ProjectShowcaseProps {
  project: Project;
  timeOfDay: TimeOfDay;
  viewMode: ViewMode;
  params: InteractiveParams;
  onChangeParams: (params: InteractiveParams) => void;
  onNextProject: () => void;
  onPrevProject: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function ProjectShowcase({
  project,
  timeOfDay,
  viewMode,
  params,
  onChangeParams,
  onNextProject,
  onPrevProject,
  isFirst,
  isLast,
}: ProjectShowcaseProps) {
  const [isPhotoViewOpen, setIsPhotoViewOpen] = useState(false);

  // Helper to adjust a single param
  const updateParam = (key: keyof InteractiveParams, value: number) => {
    onChangeParams({
      ...params,
      [key]: value,
    });
  };

  // Preset quick configurators for architectural parameters
  const setToExplodedView = () => {
    updateParam('spacing', params.spacing > 0 ? 0 : 0.25);
  };

  const setFacadeXRay = () => {
    updateParam('facadeOpacity', params.facadeOpacity > 0.1 ? 0.02 : 0.3);
  };

  return (
    <div 
      className="w-full lg:w-[460px] h-full flex flex-col justify-between p-6 pt-24 pb-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl border-r border-white/5 shadow-2xl relative"
      id={`project-showcase-${project.id}`}
    >
      {/* Scrollable specs & content */}
      <div className="flex-1 space-y-6" id="project-showcase-main-scroller">
        {/* Navigation header between projects */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4" id="project-nav-arrows">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">PROJECT PROFILE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevProject}
              disabled={isFirst}
              className={`p-1.5 rounded transition-all ${
                isFirst 
                  ? 'text-neutral-600 cursor-not-allowed' 
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
              title="Previous Architectural Design"
              id="prev-project-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNextProject}
              disabled={isLast}
              className={`p-1.5 rounded transition-all ${
                isLast 
                  ? 'text-neutral-600 cursor-not-allowed' 
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
              title="Next Architectural Design"
              id="next-project-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title, Subtitle and Category */}
        <div className="space-y-1" id="showcase-title-block">
          <span className="text-[10px] font-mono font-black tracking-[0.2em] text-[#FF3B00] uppercase">
            {project.category}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none uppercase font-sans">
            {project.title}
          </h2>
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            {project.subtitle}
          </p>
        </div>

        {/* Spec Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-none bg-white/5 border border-white/10" id="project-specs-grid">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide">LOCATION</p>
              <p className="text-xs font-semibold text-neutral-200">{project.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide">COMPLETED</p>
              <p className="text-xs font-semibold text-neutral-200">{project.year}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide">USABLE AREA</p>
              <p className="text-xs font-semibold text-neutral-200">{project.area}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Box className="w-4 h-4 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide">CLIENT</p>
              <p className="text-xs font-semibold text-neutral-200">{project.client}</p>
            </div>
          </div>
        </div>

        {/* Architectural Narrative Description */}
        <div className="space-y-2" id="project-narrative-section">
          <h3 className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">DESIGN BRIEF</h3>
          <p className="text-xs leading-relaxed text-neutral-300 font-sans tracking-wide">
            {project.narrative}
          </p>
        </div>

        {/* Dynamic Parameter Sliders for Architectural Prototyping */}
        <div className="space-y-4 pt-2 border-t border-white/5" id="parametric-sliders-panel">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">PARAMETRIC SCHEMA</h3>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-none bg-[#FF3B00]/10 text-[#FF3B00] font-bold">REAL-TIME WEBGL</span>
          </div>

          <div className="space-y-3" id="sliders-container">
            {/* Height Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                <span>STRUCTURAL HEIGHT</span>
                <span>{params.height.toFixed(1)}m</span>
              </div>
              <input
                type="range"
                min={project.id === 'light-pavilion' ? 2.5 : 4}
                max={project.id === 'helix-tower' ? 18 : 10}
                step="0.1"
                value={params.height}
                onChange={(e) => updateParam('height', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white"
                id="param-slider-height"
              />
            </div>

            {/* Twist Slider (only relevant for Helix or Dome) */}
            {(project.id === 'helix-tower' || project.id === 'parametric-dome') && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                  <span>FACADE TWIST ANGLE</span>
                  <span>{params.twist.toFixed(1)}° / Flr</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={params.twist}
                  onChange={(e) => updateParam('twist', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white"
                  id="param-slider-twist"
                />
              </div>
            )}

            {/* Structural Scale (Beam/Column Width) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                <span>BEAM/COLUMN GAUGE</span>
                <span>{params.structuralScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={params.structuralScale}
                onChange={(e) => updateParam('structuralScale', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white"
                id="param-slider-structural-scale"
              />
            </div>

            {/* Glass Facade Transparency */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                <span>FACADE SKIN OPACITY</span>
                <span>{(params.facadeOpacity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.8"
                step="0.01"
                value={params.facadeOpacity}
                onChange={(e) => updateParam('facadeOpacity', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white"
                id="param-slider-facade-opacity"
              />
            </div>
          </div>

          {/* Quick structural actions (exploded view, etc) */}
          <div className="grid grid-cols-2 gap-2 pt-1" id="quick-blueprint-actions">
            <button
              onClick={setToExplodedView}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-none text-[10px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                params.spacing > 0 
                  ? 'bg-[#FF3B00]/25 text-white border-[#FF3B00]/45 font-semibold' 
                  : 'bg-white/5 text-neutral-300 border-white/5 hover:bg-white/10'
              }`}
              id="showcase-action-exploded-view"
            >
              <Layers className="w-3.5 h-3.5" />
              {params.spacing > 0 ? 'COLLAPSE PLATES' : 'EXPLODED VIEW'}
            </button>
            <button
              onClick={setFacadeXRay}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-none text-[10px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                params.facadeOpacity <= 0.05 
                  ? 'bg-[#FF3B00]/25 text-white border-[#FF3B00]/45 font-semibold' 
                  : 'bg-white/5 text-neutral-300 border-white/5 hover:bg-white/10'
              }`}
              id="showcase-action-facade-xray"
            >
              <Compass className="w-3.5 h-3.5" />
              {params.facadeOpacity <= 0.05 ? 'SHOW FACADE' : 'FACADE X-RAY'}
            </button>
          </div>
        </div>

        {/* Photorealistic comparative render preview */}
        <div className="space-y-3 pt-2 border-t border-white/5 animate-fade-in" id="photorealistic-rendering-teaser-block">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">PHOTOREALISTIC RENDER</h3>
            <button 
              onClick={() => setIsPhotoViewOpen(true)}
              className="text-[9px] font-mono text-[#FF3B00] hover:text-white flex items-center gap-1 hover:underline cursor-pointer font-bold"
              id="btn-open-fullscreen-render"
            >
              EXPAND VIEW <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div 
            onClick={() => setIsPhotoViewOpen(true)}
            className="group relative h-28 w-full rounded overflow-hidden cursor-pointer border border-white/10 bg-black/40"
            id="rendering-thumbnail-container"
          >
            <img 
              src={project.renderUrl} 
              alt={`${project.title} High-Fidelity Architectural Visualisation`}
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              referrerPolicy="no-referrer"
              id="rendering-thumbnail-image"
            />
            <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
              <span className="text-[10px] font-mono tracking-widest text-white uppercase bg-slate-950/80 px-2.5 py-1 rounded border border-white/10">
                VIEW PHOTOREALISTIC RENDERING
              </span>
            </div>
          </div>
        </div>

        {/* Core Architectural Materials tags */}
        <div className="space-y-2 border-t border-white/5 pt-4" id="project-materials-section">
          <h3 className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">MATERIAL SPECIFICATION</h3>
          <div className="flex flex-wrap gap-1.5" id="materials-tags-container">
            {project.materials.map((mat, idx) => (
              <span 
                key={idx} 
                className="text-[9px] font-mono px-2 py-1 rounded bg-white/5 text-neutral-300 border border-white/5 hover:border-white/10"
                id={`material-tag-${idx}`}
              >
                {mat}
              </span>
            ))}
          </div>
        </div>

        {/* Milestone bullets */}
        <div className="space-y-2 border-t border-white/5 pt-4" id="project-highlights-section">
          <h3 className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">DESIGN EXCELLENCE</h3>
          <ul className="space-y-1.5" id="highlights-list">
            {project.highlights.map((hl, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300" id={`highlight-li-${idx}`}>
                <Check className="w-3.5 h-3.5 text-[#FF3B00] mt-0.5 shrink-0" />
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Navigation Reminder */}
      <div className="pt-4 border-t border-white/5 text-center" id="showcase-footer-pagination">
        <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.2em]">
          USE NAVIGATION HUD TO TOGGLE ENVIRONMENT & VIEWMODES
        </p>
      </div>

      {/* Expanded Comparative Render Lightbox Overlay */}
      <AnimatePresence>
        {isPhotoViewOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPhotoViewOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            id="photorealistic-lightbox-overlay"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full bg-slate-900 border border-white/10 rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl h-[90vh] md:h-auto max-h-[90vh]"
              id="photorealistic-lightbox-card"
            >
              {/* High resolution render */}
              <div className="flex-1 h-[50vh] md:h-[75vh] relative bg-black" id="lightbox-image-container">
                <img 
                  src={project.renderUrl} 
                  alt={project.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  id="lightbox-highres-image"
                />
                <div className="absolute top-4 left-4 bg-slate-950/80 px-2.5 py-1 rounded border border-white/10 text-[9px] font-mono tracking-widest text-white uppercase">
                  PHOTOREALISTIC RENDERING
                </div>
              </div>

              {/* Side Specs Narrative inside Lightbox */}
              <div className="w-full md:w-[320px] p-6 bg-slate-950 flex flex-col justify-between overflow-y-auto" id="lightbox-description-sidebar">
                <div className="space-y-4" id="lightbox-specs-top">
                  <div>
                    <span className="text-[9px] font-mono text-[#FF3B00] uppercase tracking-widest font-bold">{project.category}</span>
                    <h4 className="text-xl font-black text-white font-sans uppercase tracking-tight">{project.title}</h4>
                    <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">{project.subtitle}</p>
                  </div>

                  <div className="space-y-2 border-t border-white/10 pt-4" id="lightbox-concept-block">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">ARCHITECTURAL INTENT</p>
                    <p className="text-xs text-neutral-300 leading-relaxed">{project.narrative}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10" id="lightbox-specs-bottom">
                  <div className="grid grid-cols-2 gap-2 text-xs" id="lightbox-stats-panel">
                    <div>
                      <p className="text-[9px] font-mono text-neutral-500 uppercase">LOCATION</p>
                      <p className="font-semibold text-neutral-200">{project.location}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-neutral-500 uppercase">YEAR</p>
                      <p className="font-semibold text-neutral-200">{project.year}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsPhotoViewOpen(false)}
                    className="w-full py-3 bg-white text-black rounded-none text-xs font-bold tracking-[0.2em] hover:bg-[#FF3B00] hover:text-white transition-colors uppercase cursor-pointer"
                    id="lightbox-close-btn"
                  >
                    RETURN TO 3D INTERACTIVE CANVAS
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
