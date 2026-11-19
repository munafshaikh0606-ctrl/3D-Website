import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Project, InteractiveParams } from '../types';
import { Activity, ShieldAlert, Zap, TrendingUp, DollarSign } from 'lucide-react';

interface BlueprintControlLabProps {
  project: Project;
  params: InteractiveParams;
}

export default function BlueprintControlLab({ project, params }: BlueprintControlLabProps) {
  const [metrics, setMetrics] = useState({
    solarHarvest: 0,
    windMitigation: 0,
    carbonFootprint: 0,
    costEstimate: 0,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Recalculate structural performance scores in real-time based on sliders
  useEffect(() => {
    let solarMultiplier = 150; // default kWh per sqm
    let carbonBase = 450; // kg CO2eq per sqm
    let baseCost = 2800; // USD per sqm

    if (project.id === 'helix-tower') {
      solarMultiplier = 110;
      carbonBase = 850; // Glass/steel skyscraper has high carbon
      baseCost = 4500;
    } else if (project.id === 'light-pavilion') {
      solarMultiplier = 70;
      carbonBase = 350; // Low-rise concrete
      baseCost = 3500; // Premium custom villa
    } else if (project.id === 'parametric-dome') {
      solarMultiplier = 180; // High surface area solar dome
      carbonBase = 600;
      baseCost = 5200;
    } else if (project.id === 'timber-canopy') {
      solarMultiplier = 260; // Photovoltaic mass timber
      carbonBase = -120; // Sequestration negative carbon!
      baseCost = 3200;
    }

    // Dynamic metrics calculations
    const volumeFactor = params.height * params.floors * params.structuralScale;
    
    // Wind Mitigation maximizes around 4.5 degrees of twist for Helix Skyscraper
    let windDamp = 12;
    if (project.id === 'helix-tower') {
      // parabolic peak around twist = 5
      windDamp = Math.max(5, 45 - Math.abs(5 - params.twist) * 8);
    } else if (project.id === 'parametric-dome') {
      windDamp = 35 + params.twist * 2; // dome curve optimizes wind flow
    } else if (project.id === 'light-pavilion') {
      windDamp = 8;
    } else {
      windDamp = 15;
    }

    // Solar harvest yield
    const solar = Math.round(volumeFactor * solarMultiplier * (1 + params.facadeOpacity * 0.5));
    
    // Embodied Carbon footprint
    const carbon = Math.round(carbonBase * params.structuralScale * (params.height / 6));

    // Construction Cost Estimation
    const cost = Math.round(baseCost * volumeFactor * 250);

    setMetrics({
      solarHarvest: solar,
      windMitigation: Math.round(windDamp),
      carbonFootprint: carbon,
      costEstimate: cost,
    });
  }, [project, params]);

  return (
    <div 
      className="fixed bottom-6 right-6 z-40 bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-none overflow-hidden shadow-2xl transition-all duration-300 w-80 select-none"
      id="blueprint-control-lab-hud"
    >
      {/* Header */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
        id="lab-hud-header"
      >
        <div className="flex items-center gap-2" id="lab-header-title">
          <Activity className="w-4 h-4 text-[#FF3B00] animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-neutral-300 uppercase font-black">
            BLUEPRINT LAB / GAUGES
          </span>
        </div>
        <button 
          className="text-[10px] font-mono text-[#FF3B00] hover:text-white font-bold cursor-pointer"
          id="lab-hud-toggle-btn"
        >
          {isCollapsed ? '[ EXPAND ]' : '[ COLLAPSE ]'}
        </button>
      </div>

      {/* Gauges Body */}
      {!isCollapsed && (
        <div className="p-4 space-y-4" id="lab-hud-body">
          {/* Gauge 1: Solar Harvest */}
          <div className="space-y-1" id="gauge-solar">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5 uppercase font-bold">
                <Zap className="w-3 h-3 text-[#FF3B00]" /> SOLAR ANNUAL YIELD
              </span>
              <span className="text-xs font-mono font-black text-white">
                {metrics.solarHarvest.toLocaleString()} kWh
              </span>
            </div>
            <div className="w-full h-1 bg-slate-900 rounded-none overflow-hidden">
              <div 
                className="h-full bg-[#FF3B00] transition-all duration-500" 
                style={{ width: `${Math.min(100, (metrics.solarHarvest / 150000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Gauge 2: Wind load Mitigation */}
          <div className="space-y-1" id="gauge-wind">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5 uppercase font-bold">
                <ShieldAlert className="w-3 h-3 text-white opacity-60" /> WIND DEFLECTION
              </span>
              <span className="text-xs font-mono font-black text-white">
                {metrics.windMitigation}% LOAD MITIGATION
              </span>
            </div>
            <div className="w-full h-1 bg-slate-900 rounded-none overflow-hidden">
              <div 
                className="h-full bg-white/70 transition-all duration-500" 
                style={{ width: `${metrics.windMitigation}%` }}
              />
            </div>
          </div>

          {/* Gauge 3: Embodied Carbon Footprint */}
          <div className="space-y-1" id="gauge-carbon">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5 uppercase font-bold">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> EMBODIED CARBON
              </span>
              <span className={`text-xs font-mono font-black ${metrics.carbonFootprint < 0 ? 'text-emerald-400' : 'text-neutral-200'}`}>
                {metrics.carbonFootprint.toLocaleString()} kg CO₂/m²
              </span>
            </div>
            <div className="w-full h-1 bg-slate-900 rounded-none overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${metrics.carbonFootprint < 0 ? 'bg-emerald-500' : 'bg-[#FF3B00]'}`} 
                style={{ width: `${Math.max(10, Math.min(100, (Math.abs(metrics.carbonFootprint) / 1200) * 100))}%` }}
              />
            </div>
            <p className="text-[8px] font-mono text-emerald-400 mt-1 uppercase tracking-wider">
              {project.id === 'helix-tower' && '✓ Optimizes API rotation & media pipelines'}
              {project.id === 'light-pavilion' && '✓ Low-latency Web Audio engine active'}
              {project.id === 'parametric-dome' && '✓ Real-time PyTorch & OpenCV segmenters'}
              {project.id === 'timber-canopy' && '✓ 60 FPS WebGL spatial physics solver'}
            </p>
          </div>

          {/* Gauge 4: Construction Budget Estimation */}
          <div className="space-y-1 border-t border-white/10 pt-3" id="gauge-budget">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5 uppercase font-bold">
                <DollarSign className="w-3 h-3 text-[#FF3B00]" /> ESTIMATED BUDGET
              </span>
              <span className="text-xs font-mono font-black text-[#FF3B00]">
                ${(metrics.costEstimate / 1000000).toFixed(2)}M USD
              </span>
            </div>
            <p className="text-[8px] font-mono text-neutral-500 uppercase tracking-wider">
              * Calculations based on active material specifications and volumetric calculations
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
