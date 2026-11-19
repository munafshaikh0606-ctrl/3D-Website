import { Project } from '../types';

import helixRender from '../assets/images/helix_tower_render_1782246842989.jpg';
import pavilionRender from '../assets/images/glass_pavilion_render_1782246858019.jpg';
import domeRender from '../assets/images/parametric_dome_render_1782246874375.jpg';
import canopyRender from '../assets/images/timber_canopy_render_1782246889407.jpg';

export const projects: Project[] = [
  {
    id: 'helix-tower',
    title: 'Qazyen AI Platform',
    subtitle: 'AI-Powered Media Generation',
    category: 'AI & 3D Web Engineering',
    year: '2025',
    location: 'Production Ready',
    area: '100% Platform Uptime',
    client: 'Independent R&D / Users',
    materials: ['React.js & Three.js WebGL', 'Generative Diffusion APIs', 'Automated API Rotation Engine'],
    narrative: 'Qazyen is a high-performance end-to-end AI platform engineered for on-demand high-quality video and image generation. The interface embeds an interactive 3D robot agent developed in Three.js, responding dynamically to user commands. Under the hood, an automated key-rotation pipeline guarantees full load balancing, optimizing API usage costs and maintaining 100% service uptime.',
    highlights: [
      'Automated API key rotation core',
      'Three.js animated robot avatar',
      'Low-latency image/video generation',
      'High-fidelity micro-interactions'
    ],
    renderUrl: helixRender,
    colorTheme: {
      accent: '#FF3B00',
      bgGradient: 'from-black via-[#050505] to-[#1A0600]',
      text: 'text-[#FF3B00]'
    },
    cameraPresets: {
      hero: { position: [12, 10, 12], target: [0, 4, 0] },
      detail: { position: [4, 8, 4], target: [0, 8, 0] },
      interior: { position: [2, 3, 2], target: [0, 3, 0] }
    },
    defaultParams: {
      height: 12,
      twist: 4.5,
      floors: 36,
      spacing: 0,
      facadeOpacity: 0.25,
      structuralScale: 1.0
    }
  },
  {
    id: 'light-pavilion',
    title: '3D Spotify Audio Space',
    subtitle: 'Audio Visualizer & Streaming',
    category: 'Full-Stack & 3D Web',
    year: '2024',
    location: 'Stable Beta',
    area: '44.1 kHz Live Streams',
    client: 'Music Community Showcase',
    materials: ['React.js + Express Server', 'Three.js Audio Analyzer', 'Secure PostgreSQL Database'],
    narrative: 'An immersive digital workspace combining fluid music streaming with raw WebGL computer graphics. The workspace streams high-quality audio through an optimized React web application. It features a custom 3D headspace animation using Three.js and custom shader elements that react in real-time to track frequencies, amplitudes, and user play controls, fully backed by relational database schemas.',
    highlights: [
      'WebGL real-time audio visualizer',
      'Robust relational schemas with PostgreSQL',
      'Interactive headspace 3D viewport',
      'Seamless track queuing & play state syncing'
    ],
    renderUrl: pavilionRender,
    colorTheme: {
      accent: '#FF3B00',
      bgGradient: 'from-black via-[#050505] to-[#111111]',
      text: 'text-[#FF3B00]'
    },
    cameraPresets: {
      hero: { position: [10, 5, 10], target: [0, 1.5, 0] },
      detail: { position: [4, 2.5, 4], target: [1, 1, -1] },
      interior: { position: [1.2, 1.5, 1.2], target: [0, 1.3, 0] }
    },
    defaultParams: {
      height: 3.5,
      twist: 0,
      floors: 2,
      spacing: 0,
      facadeOpacity: 0.15,
      structuralScale: 1.0
    }
  },
  {
    id: 'parametric-dome',
    title: 'Vision & Neural Lab',
    subtitle: 'Advanced Computer Vision Engines',
    category: 'Artificial Intelligence & ML',
    year: '2025',
    location: 'Research Lab',
    area: '98.4% Frame Accuracy',
    client: 'Academic & Applied ML',
    materials: ['Python, OpenCV & PyTorch', 'TensorFlow Core Layers', 'Streamlit Dashboard Integration'],
    narrative: 'High-speed object recognition and convolutional segmentation models built with PyTorch and OpenCV. Features include real-time live video edge detection, spatial object mapping, and telemetry tracking. Neural models are integrated into responsive developer sandboxes, offering robust metric logging, hyperparameter tweaking, and high frame-rate matrix execution.',
    highlights: [
      'Real-time object segmentation',
      'OpenCV multi-threaded stream parsing',
      'Custom PyTorch inference pipelines',
      'Responsive metric logging dashboards'
    ],
    renderUrl: domeRender,
    colorTheme: {
      accent: '#FF3B00',
      bgGradient: 'from-black via-[#050505] to-[#1A0600]',
      text: 'text-[#FF3B00]'
    },
    cameraPresets: {
      hero: { position: [11, 7, 11], target: [0, 1.5, 0] },
      detail: { position: [5, 4, 3], target: [0, 1.8, 0] },
      interior: { position: [0.5, 1.0, 0.5], target: [0, 2.0, 0] }
    },
    defaultParams: {
      height: 5.5,
      twist: 1.2,
      floors: 4,
      spacing: 0,
      facadeOpacity: 0.35,
      structuralScale: 1.2
    }
  },
  {
    id: 'timber-canopy',
    title: '3D Game & Physics Engines',
    subtitle: 'Interactive Unity & Java Graphics',
    category: 'Game Dev & Graphics',
    year: '2024',
    location: 'Completed Systems',
    area: '60 FPS Physics Engine',
    client: 'Barclays Lifeskills / Unity',
    materials: ['Unity, C# & HLSL Shaders', 'Java Game Development Core', 'Procedural Terrain Meshes'],
    narrative: 'High-fidelity virtual sandboxes developing modular physics systems, spatial colliders, and lighting pipelines. Includes procedural polygon generation and customized lighting shaders built using HLSL in Unity. Also includes Java-native 2D/3D custom rendering loops demonstrating mathematical matrix transformations and vector projections.',
    highlights: [
      '60 FPS physics-based colliders',
      'Procedural terrain generation in C#',
      'Custom pixel and vertex shader scripts',
      'Java graphic rasterization routines'
    ],
    renderUrl: canopyRender,
    colorTheme: {
      accent: '#FF3B00',
      bgGradient: 'from-black via-[#050505] to-[#111111]',
      text: 'text-[#FF3B00]'
    },
    cameraPresets: {
      hero: { position: [10, 6, 10], target: [0, 2.5, 0] },
      detail: { position: [4, 4, 4], target: [0, 2.5, 0] },
      interior: { position: [2.5, 2.0, 2.5], target: [0, 2.2, 0] }
    },
    defaultParams: {
      height: 6.0,
      twist: 0,
      floors: 3,
      spacing: 0,
      facadeOpacity: 0.30,
      structuralScale: 1.1
    }
  }
];
