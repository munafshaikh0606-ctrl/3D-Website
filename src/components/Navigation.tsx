import { Compass, Eye, Sun, Sunrise, Moon, Layers, Box, Maximize2 } from 'lucide-react';
import { Project, TimeOfDay, ViewMode } from '../types';

interface NavigationProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  timeOfDay: TimeOfDay;
  onChangeTimeOfDay: (tod: TimeOfDay) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  isOrbitMode: boolean;
  onToggleOrbitMode: () => void;
  cameraPresetName: 'hero' | 'detail' | 'interior';
  onChangeCameraPreset: (preset: 'hero' | 'detail' | 'interior') => void;
}

export default function Navigation({
  projects,
  activeProject,
  onSelectProject,
  timeOfDay,
  onChangeTimeOfDay,
  viewMode,
  onChangeViewMode,
  isOrbitMode,
  onToggleOrbitMode,
  cameraPresetName,
  onChangeCameraPreset,
}: NavigationProps) {
  return (
    <header 
      className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 select-none"
      id="main-app-header-nav"
    >
      {/* Brand Title */}
      <div className="flex items-center gap-3" id="nav-brand-section">
        <div className="relative w-8 h-8 flex items-center justify-center border border-white/20 rounded-none" id="brand-logo-container">
          <div className="w-4 h-4 bg-[#FF3B00] rotate-45 transform transition-transform hover:rotate-90 duration-500"></div>
          <div className="absolute inset-0 border border-white/5 scale-110"></div>
        </div>
        <div>
          <h1 className="text-xs font-black tracking-[0.3em] uppercase text-white flex items-center gap-1.5">
            MUNAF <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-none bg-[#FF3B00] text-white">SHAIKH</span>
          </h1>
          <p className="text-[9px] font-mono text-neutral-500 tracking-widest">3D AI & WEB LAB</p>
        </div>
      </div>

      {/* Center: Scroll Navigation Indicators */}
      <nav className="hidden lg:flex items-center gap-6" id="nav-project-selector-container">
        {projects.map((proj) => {
          const isActive = proj.id === activeProject.id;
          return (
            <button
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className={`relative py-1 text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              id={`nav-proj-btn-${proj.id}`}
            >
              {proj.title}
              {isActive && (
                <span 
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF3B00] rounded-none" 
                  id={`nav-proj-active-indicator-${proj.id}`}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: HUD Interactive Controls */}
      <div className="flex items-center gap-2 md:gap-3" id="hud-controls-dock">
        {/* Orbit Mode Switcher */}
        <button
          onClick={onToggleOrbitMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-mono tracking-wider uppercase transition-all duration-300 border ${
            isOrbitMode 
              ? 'bg-[#FF3B00]/20 text-white border-[#FF3B00]/45 font-bold' 
              : 'bg-white/5 text-neutral-300 border-white/5 hover:bg-white/10'
          }`}
          title="Toggle Manual Orbit Controls"
          id="hud-toggle-orbit-mode"
        >
          <Compass className={`w-3.5 h-3.5 ${isOrbitMode ? 'animate-spin text-[#FF3B00]' : ''}`} />
          <span className="hidden sm:inline">{isOrbitMode ? 'ORBIT ACTIVE' : 'ORBIT SCENE'}</span>
        </button>

        {/* View Mode Selection Dropdown / Selector */}
        <div className="flex bg-white/5 border border-white/10 rounded-none p-0.5" id="view-mode-selector-tabs">
          {(['solid', 'wireframe', 'xray'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onChangeViewMode(mode)}
              className={`px-2 py-1 rounded-none text-[10px] font-mono uppercase tracking-wider transition-all duration-200 ${
                viewMode === mode 
                  ? 'bg-[#FF3B00] text-white shadow font-semibold' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title={`View Mode: ${mode}`}
              id={`view-mode-btn-${mode}`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Camera Preset Position Selection */}
        <div className="flex bg-white/5 border border-white/10 rounded-none p-0.5" id="camera-preset-selector">
          {(['hero', 'detail', 'interior'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => onChangeCameraPreset(preset)}
              className={`px-2 py-1 rounded-none text-[10px] font-mono uppercase tracking-wider transition-all duration-200 ${
                cameraPresetName === preset 
                  ? 'bg-[#FF3B00] text-white font-semibold' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title={`Camera angle: ${preset}`}
              id={`camera-preset-btn-${preset}`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Time of Day Switcher */}
        <div className="flex bg-white/5 border border-white/10 rounded-none p-0.5" id="tod-selector-tabs">
          {(['noon', 'goldenHour', 'night'] as TimeOfDay[]).map((tod) => {
            const icons = {
              noon: <Sun className="w-3.5 h-3.5" />,
              goldenHour: <Sunrise className="w-3.5 h-3.5" />,
              night: <Moon className="w-3.5 h-3.5" />,
            };
            return (
              <button
                key={tod}
                onClick={() => onChangeTimeOfDay(tod)}
                className={`p-1 rounded-none text-xs transition-all duration-200 ${
                  timeOfDay === tod 
                    ? 'bg-[#FF3B00] text-white' 
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title={`Environment: ${tod}`}
                id={`tod-btn-${tod}`}
              >
                {icons[tod]}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
