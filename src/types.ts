export type TimeOfDay = 'noon' | 'goldenHour' | 'night';
export type ViewMode = 'solid' | 'wireframe' | 'xray';

export interface InteractiveParams {
  height: number;      // Scaler for vertical height / scale
  twist: number;       // Twist angle for Helix
  floors: number;      // Number of floors
  spacing: number;     // Vertical spacing for exploded views
  facadeOpacity: number; // Facade transparency
  structuralScale: number; // Scale of steel columns / timber beams
}

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  location: string;
  area: string;
  client: string;
  materials: string[];
  narrative: string;
  highlights: string[];
  renderUrl: string;
  colorTheme: {
    accent: string;
    bgGradient: string;
    text: string;
  };
  cameraPresets: {
    hero: CameraPreset;
    detail: CameraPreset;
    interior: CameraPreset;
  };
  defaultParams: InteractiveParams;
}
