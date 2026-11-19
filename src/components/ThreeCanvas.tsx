import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Project, TimeOfDay, ViewMode, InteractiveParams } from '../types';

interface ThreeCanvasProps {
  activeProject: Project;
  timeOfDay: TimeOfDay;
  viewMode: ViewMode;
  params: InteractiveParams;
  isOrbitMode: boolean;
  cameraPresetName: 'hero' | 'detail' | 'interior';
}

export default function ThreeCanvas({
  activeProject,
  timeOfDay,
  viewMode,
  params,
  isOrbitMode,
  cameraPresetName,
}: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    activeProject,
    timeOfDay,
    viewMode,
    params,
    isOrbitMode,
    cameraPresetName,
  });

  // Sync state reference for the animation loop
  useEffect(() => {
    stateRef.current = {
      activeProject,
      timeOfDay,
      viewMode,
      params,
      isOrbitMode,
      cameraPresetName,
    };
  }, [activeProject, timeOfDay, viewMode, params, isOrbitMode, cameraPresetName]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.015);

    // --- CAMERA SETUP ---
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const initialPreset = activeProject.cameraPresets[cameraPresetName];
    camera.position.fromArray(initialPreset.position);
    
    const cameraTarget = new THREE.Vector3().fromArray(initialPreset.target);

    // --- RENDERER SETUP ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // --- CONTROLS SETUP ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.01; // Don't go below ground
    controls.minDistance = 2;
    controls.maxDistance = 30;
    controls.enabled = isOrbitMode;

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(15, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    const d = 15;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Decorative point lights for building interiors or accents
    const accentLight1 = new THREE.PointLight(0xff3b00, 1.5, 8); // Neon Red-Orange
    accentLight1.position.set(2, 2, 2);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0xffffff, 1.5, 8); // Stark White
    accentLight2.position.set(-2, 4, -2);
    scene.add(accentLight2);

    // --- WORLD ENVIRONMENT / BASE GRID ---
    const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x111111);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Ground plane to receive shadows
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- GROUPS ---
    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);

    // --- PROCEDURAL ARCHITECTURE BUILDERS ---

    // Materials Store
    const materials = {
      concrete: new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.7, metalness: 0.2 }),
      polishedConcrete: new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.3, metalness: 0.3 }),
      steel: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.2, metalness: 0.9 }),
      glass: new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.9,
      }),
      glowingGlass: new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfef08a,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
      }),
      larchWood: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6, metalness: 0.1 }),
      darkAlum: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 }),
      glowingAmber: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.8,
      }),
      emeraldGrass: new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.8, metalness: 0.0 }),
      solarBlue: new THREE.MeshStandardMaterial({ color: 0x172554, roughness: 0.1, metalness: 0.9 }),
    };

    // Keep track of current project sub-mesh structures so we can animate/modify them
    let buildingMeshes: {
      floors: THREE.Mesh[];
      columns: (THREE.Line | THREE.Mesh)[];
      cores: THREE.Mesh[];
      facades: THREE.Mesh[];
      landscapes: THREE.Mesh[];
    } = { floors: [], columns: [], cores: [], facades: [], landscapes: [] };

    // Function to clear modelsGroup
    const clearGroup = (group: THREE.Group) => {
      while (group.children.length > 0) {
        const obj = group.children[0];
        group.remove(obj);

        // Recursively dispose geometries and materials
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
      buildingMeshes = { floors: [], columns: [], cores: [], facades: [], landscapes: [] };
    };

    // --- 1. Helix Tower Skyscraper Builder ---
    const buildHelixTower = (p: InteractiveParams, mode: ViewMode) => {
      const group = new THREE.Group();

      const floorCount = Math.round(p.floors);
      const totalHeight = p.height;
      const floorHeight = totalHeight / floorCount;
      const baseRadius = 1.8;
      const twistPerFloor = (p.twist * Math.PI) / 180; // twist in radians

      // Central Concrete Core
      const coreGeo = new THREE.CylinderGeometry(0.5, 0.5, totalHeight, 16);
      const coreMat = mode === 'wireframe' ? 
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true }) : 
        materials.concrete;
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = totalHeight / 2;
      core.castShadow = true;
      core.receiveShadow = true;
      group.add(core);
      buildingMeshes.cores.push(core);

      // Steel Columns vertices
      const colVertices: THREE.Vector3[][] = Array.from({ length: 4 }, () => []);

      // Build individual floors
      for (let i = 0; i < floorCount; i++) {
        const yPos = i * (floorHeight + p.spacing);
        const rotationY = i * twistPerFloor;

        // Taper slightly as it goes up
        const scaleFactor = 1.0 - (i / floorCount) * 0.4;
        const radius = baseRadius * scaleFactor;

        // Floor slab
        const slabGeo = new THREE.CylinderGeometry(radius, radius, 0.15, 6);
        let slabMat;
        if (mode === 'wireframe') {
          slabMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
        } else if (mode === 'xray') {
          slabMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            transparent: true,
            opacity: 0.2,
            roughness: 0.3,
            metalness: 0.9,
          });
        } else {
          slabMat = materials.polishedConcrete;
        }

        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.set(0, yPos + 0.075, 0);
        slab.rotation.y = rotationY;
        slab.castShadow = true;
        slab.receiveShadow = true;
        group.add(slab);
        buildingMeshes.floors.push(slab);

        // Glass Facade Ring
        if (mode !== 'wireframe') {
          const facadeGeo = new THREE.CylinderGeometry(radius - 0.05, radius - 0.05, floorHeight * 0.85, 6, 1, true);
          const facadeMat = mode === 'xray' ? 
            new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.05, roughness: 0.1 }) :
            new THREE.MeshStandardMaterial({
              color: 0x93c5fd,
              transparent: true,
              opacity: p.facadeOpacity,
              roughness: 0.05,
              metalness: 0.9,
            });
          
          const facade = new THREE.Mesh(facadeGeo, facadeMat);
          facade.position.set(0, yPos + floorHeight / 2, 0);
          facade.rotation.y = rotationY;
          group.add(facade);
          buildingMeshes.facades.push(facade);

          // Random internal glowing offices
          if (Math.random() > 0.65 && mode === 'solid') {
            const glowGeo = new THREE.CylinderGeometry(radius * 0.4, radius * 0.4, floorHeight * 0.6, 6);
            const glow = new THREE.Mesh(glowGeo, materials.glowingGlass);
            glow.position.set(0, yPos + floorHeight / 2, 0);
            glow.rotation.y = rotationY;
            group.add(glow);
          }
        }

        // Trace paths for exterior helical steel columns
        for (let col = 0; col < 4; col++) {
          const angle = (col * Math.PI) / 2 + rotationY;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          colVertices[col].push(new THREE.Vector3(x, yPos, z));
        }
      }

      // Render the helical column tubes
      colVertices.forEach((vertices, colIdx) => {
        const curve = new THREE.CatmullRomCurve3(vertices);
        const tubeGeo = new THREE.TubeGeometry(curve, floorCount * 2, 0.06 * p.structuralScale, 8, false);
        const tubeMat = mode === 'wireframe' ?
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 }) :
          materials.steel;
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.castShadow = true;
        group.add(tube);
        buildingMeshes.columns.push(tube);
      });

      modelsGroup.add(group);
    };

    // --- 2. Pavilion of Light Villa Builder ---
    const buildLightPavilion = (p: InteractiveParams, mode: ViewMode) => {
      const group = new THREE.Group();

      const totalHeight = p.height;
      const width = 6;
      const depth = 4;
      const floorCount = Math.round(p.floors); // 1 or 2 floors

      // Concrete cantilever slabs (floating layout)
      for (let i = 0; i <= floorCount; i++) {
        const yPos = i * (totalHeight / floorCount + p.spacing);
        const slabWidth = width * (1.0 + i * 0.1); // cantilevers out further on upper floors
        const slabGeo = new THREE.BoxGeometry(slabWidth, 0.18, depth);
        
        const slabMat = mode === 'wireframe' ?
          new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true }) :
          materials.polishedConcrete;

        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.set(i * 0.4, yPos, 0); // Offset horizontally to create Cantilever
        slab.castShadow = true;
        slab.receiveShadow = true;
        group.add(slab);
        buildingMeshes.floors.push(slab);
      }

      // Vertical structural steel thin pillars
      const pillarCount = 8;
      for (let i = 0; i < pillarCount; i++) {
        const angle = (i / pillarCount) * Math.PI * 2;
        const colX = Math.cos(angle) * (width * 0.35);
        const colZ = Math.sin(angle) * (depth * 0.35);

        const pillarGeo = new THREE.CylinderGeometry(0.05 * p.structuralScale, 0.05 * p.structuralScale, totalHeight);
        const pillarMat = mode === 'wireframe' ?
          new THREE.MeshBasicMaterial({ color: 0xf59e0b }) :
          materials.steel;

        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(colX, totalHeight / 2, colZ);
        pillar.castShadow = true;
        group.add(pillar);
        buildingMeshes.columns.push(pillar);
      }

      // Extra-clear structural glass walls & warm interior wood partitions
      if (mode !== 'wireframe') {
        // Transparent Glazing
        const glassGeo = new THREE.BoxGeometry(width * 0.8, totalHeight * 0.95, depth * 0.8);
        const glassMat = mode === 'xray' ?
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.05 }) :
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: p.facadeOpacity,
            roughness: 0.01,
            metalness: 0.95,
          });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.set(0, totalHeight / 2, 0);
        group.add(glass);
        buildingMeshes.facades.push(glass);

        // Elegant interior larch timber divider
        const woodGeo = new THREE.BoxGeometry(0.12, totalHeight * 0.95, depth * 0.45);
        const wood = new THREE.Mesh(woodGeo, materials.larchWood);
        wood.position.set(-width * 0.15, totalHeight / 2, 0);
        wood.castShadow = true;
        group.add(wood);

        // Glowing Minimalist interior fireplace / light column
        if (mode === 'solid') {
          const fireplaceGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
          const fireplace = new THREE.Mesh(fireplaceGeo, materials.glowingAmber);
          fireplace.position.set(width * 0.15, 0.25, 0);
          group.add(fireplace);
        }
      }

      // Reflection Pool & Landscape
      if (mode === 'solid') {
        const poolGeo = new THREE.BoxGeometry(width * 1.5, 0.08, depth * 1.8);
        const poolMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.05,
          metalness: 0.9,
        });
        const pool = new THREE.Mesh(poolGeo, poolMat);
        pool.position.set(0, -0.04, 0);
        group.add(pool);

        // Modular low-poly background trees
        const treePositions = [
          [-5, 0, -3], [-6, 0, 1], [-4, 0, 4], [5, 0, -4], [6, 0, -1]
        ];
        treePositions.forEach(([tx, ty, tz]) => {
          const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.2, 5);
          const trunk = new THREE.Mesh(trunkGeo, materials.steel);
          trunk.position.set(tx, 0.6, tz);
          group.add(trunk);

          const foliageGeo = new THREE.ConeGeometry(0.8, 2.2, 5);
          const foliage = new THREE.Mesh(foliageGeo, materials.emeraldGrass);
          foliage.position.set(tx, 2.0, tz);
          foliage.castShadow = true;
          group.add(foliage);
        });
      }

      modelsGroup.add(group);
    };

    // --- 3. Geometric Shell Cultural Center (Dome) Builder ---
    const buildGeometricShell = (p: InteractiveParams, mode: ViewMode) => {
      const group = new THREE.Group();

      const span = 6;
      const totalHeight = p.height;
      const rows = 12;
      const segments = 24;

      // Outer parametric triangulated shell
      const vertices: THREE.Vector3[] = [];
      const index: number[] = [];

      // Procedurally generate a double-curved dome shape
      for (let r = 0; r <= rows; r++) {
        const theta = (r / rows) * (Math.PI / 2); // Angle down from top
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        // Apply a dynamic height scaler
        const y = totalHeight * cosTheta;

        for (let s = 0; s < segments; s++) {
          const phi = (s / segments) * Math.PI * 2;
          
          // Apply some wavy architectural ripples based on the 'twist' parameter
          const ripple = 1.0 + Math.sin(phi * 4) * (p.twist * 0.05) * sinTheta;
          const x = span * sinTheta * Math.cos(phi) * ripple;
          const z = span * sinTheta * Math.sin(phi) * ripple;

          vertices.push(new THREE.Vector3(x, y + p.spacing * (1.0 - r/rows), z));
        }
      }

      // Build triangulated faces
      for (let r = 0; r < rows; r++) {
        for (let s = 0; s < segments; s++) {
          const current = r * segments + s;
          const next = r * segments + ((s + 1) % segments);
          const below = (r + 1) * segments + s;
          const belowNext = (r + 1) * segments + ((s + 1) % segments);

          // Triangulate each quad grid panel
          index.push(current, next, below);
          index.push(next, belowNext, below);
        }
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
      geometry.setIndex(index);
      geometry.computeVertexNormals();

      // Materials for Shell
      let shellMat;
      if (mode === 'wireframe') {
        shellMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true });
      } else if (mode === 'xray') {
        shellMat = new THREE.MeshStandardMaterial({
          color: 0xa855f7,
          transparent: true,
          opacity: 0.1,
          roughness: 0.2,
          metalness: 0.9,
          side: THREE.DoubleSide,
        });
      } else {
        shellMat = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          roughness: 0.15,
          metalness: 0.85,
          side: THREE.DoubleSide,
        });
      }

      const shell = new THREE.Mesh(geometry, shellMat);
      shell.castShadow = true;
      shell.receiveShadow = true;
      group.add(shell);
      buildingMeshes.facades.push(shell);

      // Create structural wireframe overlay struts (Spaceframe)
      const spaceframeMat = mode === 'wireframe' ?
        new THREE.LineBasicMaterial({ color: 0xa855f7 }) :
        new THREE.LineBasicMaterial({ color: 0x3b0764 });

      const wireframeGeo = new THREE.WireframeGeometry(geometry);
      const spaceframe = new THREE.LineSegments(wireframeGeo, spaceframeMat);
      group.add(spaceframe);

      // Inside: Core auditoriums (concrete structures)
      if (mode !== 'wireframe') {
        const floorGeo = new THREE.CylinderGeometry(span * 0.95, span * 0.95, 0.2, 32);
        const floor = new THREE.Mesh(floorGeo, materials.concrete);
        floor.position.y = 0.1;
        floor.receiveShadow = true;
        group.add(floor);
        buildingMeshes.floors.push(floor);

        // Three sculptural performance pods
        const podCount = 3;
        for (let i = 0; i < podCount; i++) {
          const angle = (i / podCount) * Math.PI * 2;
          const px = Math.cos(angle) * (span * 0.4);
          const pz = Math.sin(angle) * (span * 0.4);

          const podGeo = new THREE.DodecahedronGeometry(1.2, 1);
          const podMat = mode === 'xray' ?
            new THREE.MeshStandardMaterial({ color: 0xc084fc, transparent: true, opacity: 0.2 }) :
            materials.concrete;
          const pod = new THREE.Mesh(podGeo, podMat);
          pod.position.set(px, 1.2, pz);
          pod.scale.set(1, 1.4, 1);
          pod.castShadow = true;
          group.add(pod);

          // Glowing internal auditoriums
          if (mode === 'solid') {
            const glowGeo = new THREE.SphereGeometry(0.8, 16, 16);
            const glow = new THREE.Mesh(glowGeo, materials.glowingAmber);
            glow.position.set(px, 1.2, pz);
            group.add(glow);
          }
        }
      }

      modelsGroup.add(group);
    };

    // --- 4. Sustainable Timber Canopy Builder ---
    const buildTimberCanopy = (p: InteractiveParams, mode: ViewMode) => {
      const group = new THREE.Group();

      const totalHeight = p.height;
      const cols = 3;
      const rows = 3;
      const spacingX = 3.5;
      const spacingZ = 3.5;

      // Base platforms
      const basePlatformGeo = new THREE.BoxGeometry(spacingX * 3, 0.2, spacingZ * 3);
      const basePlatformMat = mode === 'wireframe' ?
        new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true }) :
        materials.polishedConcrete;
      const basePlatform = new THREE.Mesh(basePlatformGeo, basePlatformMat);
      basePlatform.position.y = 0.1;
      basePlatform.receiveShadow = true;
      group.add(basePlatform);
      buildingMeshes.floors.push(basePlatform);

      // Branching Columns
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          const colX = x * spacingX;
          const colZ = z * spacingZ;

          // Main vertical trunk
          const trunkGeo = new THREE.CylinderGeometry(0.12 * p.structuralScale, 0.16 * p.structuralScale, totalHeight, 8);
          const trunkMat = mode === 'wireframe' ?
            new THREE.MeshBasicMaterial({ color: 0x22c55e }) :
            materials.larchWood;
          
          const trunk = new THREE.Mesh(trunkGeo, trunkMat);
          // Explode columns vertical offset
          const explodeY = (Math.abs(x) + Math.abs(z)) * p.spacing * 0.4;
          trunk.position.set(colX, totalHeight / 2 + explodeY, colZ);
          trunk.castShadow = true;
          group.add(trunk);
          buildingMeshes.columns.push(trunk);

          // Diagonal structural branches at the top
          if (mode !== 'wireframe') {
            const branchDirections = [
              [0.6, 0.6], [-0.6, 0.6], [0.6, -0.6], [-0.6, -0.6]
            ];
            branchDirections.forEach(([bx, bz]) => {
              const branchGeo = new THREE.CylinderGeometry(0.06 * p.structuralScale, 0.08 * p.structuralScale, 1.2);
              const branch = new THREE.Mesh(branchGeo, materials.larchWood);
              branch.position.set(colX + bx * 0.4, totalHeight - 0.3 + explodeY, colZ + bz * 0.4);
              // Rotate branch outward
              branch.rotation.z = bx * 0.6;
              branch.rotation.x = -bz * 0.6;
              branch.castShadow = true;
              group.add(branch);
            });
          }
        }
      }

      // Massive Interlocking Timber Roof Grid
      const roofSizeX = spacingX * 2.8;
      const roofSizeZ = spacingZ * 2.8;
      const gridDensity = 14;

      for (let r = 0; r <= gridDensity; r++) {
        const pct = r / gridDensity;
        
        // Wood Beams Along X
        const beamGeoX = new THREE.BoxGeometry(roofSizeX, 0.25, 0.05 * p.structuralScale);
        const beamMat = mode === 'wireframe' ?
          new THREE.MeshBasicMaterial({ color: 0x22c55e }) :
          materials.larchWood;
        const beamX = new THREE.Mesh(beamGeoX, beamMat);
        const beamY = totalHeight + p.spacing + (Math.sin(pct * Math.PI) * 0.4); // Swooping curved roof shape
        beamX.position.set(0, beamY, -roofSizeZ / 2 + pct * roofSizeZ);
        beamX.castShadow = true;
        group.add(beamX);

        // Wood Beams Along Z
        const beamGeoZ = new THREE.BoxGeometry(0.05 * p.structuralScale, 0.25, roofSizeZ);
        const beamZ = new THREE.Mesh(beamGeoZ, beamMat);
        beamZ.position.set(-roofSizeX / 2 + pct * roofSizeX, beamY + 0.1, 0);
        beamZ.castShadow = true;
        group.add(beamZ);
      }

      // Glass Solar Panels Overlay
      if (mode !== 'wireframe') {
        const panelGeo = new THREE.BoxGeometry(roofSizeX * 0.98, 0.05, roofSizeZ * 0.98);
        const panelMat = mode === 'xray' ?
          new THREE.MeshStandardMaterial({ color: 0x10b981, transparent: true, opacity: 0.1 }) :
          materials.solarBlue;
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.set(0, totalHeight + p.spacing + 0.42, 0);
        panel.castShadow = true;
        group.add(panel);
        buildingMeshes.facades.push(panel);
      }

      // Add biophilic hanging gardens & planters
      if (mode === 'solid') {
        for (let i = 0; i < 6; i++) {
          const px = (Math.random() - 0.5) * roofSizeX * 0.8;
          const pz = (Math.random() - 0.5) * roofSizeZ * 0.8;
          
          const planterGeo = new THREE.BoxGeometry(0.6, 0.3, 0.6);
          const planter = new THREE.Mesh(planterGeo, materials.polishedConcrete);
          planter.position.set(px, totalHeight + p.spacing + 0.1, pz);
          group.add(planter);

          const plantGeo = new THREE.SphereGeometry(0.4, 8, 8);
          const plant = new THREE.Mesh(plantGeo, materials.emeraldGrass);
          plant.position.set(px, totalHeight + p.spacing + 0.3, pz);
          group.add(plant);
        }
      }

      modelsGroup.add(group);
    };

    // --- 5. Office & Computer & Background Buildings Architecture Builder ---
    const buildOfficeAndTechBackground = (group: THREE.Group, mode: ViewMode, p: InteractiveParams) => {
      const bldGroup = new THREE.Group();

      // 1. Sleek Tech Workstation (Desk, Computer Monitor, Keyboard, Office Chair)
      const deskGroup = new THREE.Group();
      deskGroup.position.set(-3.5, 0, 3.5);
      deskGroup.rotation.y = Math.PI / 4; // Angle it towards the center

      // Table Top
      const tableGeo = new THREE.BoxGeometry(2.0, 0.08, 1.0);
      const tableMat = mode === 'wireframe' 
        ? new THREE.MeshBasicMaterial({ color: 0xff3b00, wireframe: true })
        : new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.8 });
      const table = new THREE.Mesh(tableGeo, tableMat);
      table.position.y = 0.8;
      table.castShadow = true;
      table.receiveShadow = true;
      deskGroup.add(table);

      // Desk Legs (4 legs)
      const legPositions = [
        [-0.9, 0.4, -0.4],
        [0.9, 0.4, -0.4],
        [-0.9, 0.4, 0.4],
        [0.9, 0.4, 0.4],
      ];
      legPositions.forEach(([lx, ly, lz]) => {
        const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
        const legMat = mode === 'wireframe'
          ? new THREE.MeshBasicMaterial({ color: 0xff3b00 })
          : new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 });
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(lx, ly, lz);
        leg.castShadow = true;
        deskGroup.add(leg);
      });

      // Computer Monitor Stand
      const standGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8);
      const standMat = mode === 'wireframe'
        ? new THREE.MeshBasicMaterial({ color: 0xffffff })
        : new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.1 });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.set(0, 0.8 + 0.04 + 0.11, -0.15);
      stand.castShadow = true;
      deskGroup.add(stand);

      const baseGeo = new THREE.BoxGeometry(0.22, 0.01, 0.22);
      const base = new THREE.Mesh(baseGeo, standMat);
      base.position.set(0, 0.8 + 0.04 + 0.005, -0.15);
      deskGroup.add(base);

      // Computer Monitor Screen (Wide display)
      const monitorGeo = new THREE.BoxGeometry(0.85, 0.48, 0.03);
      const monitorMat = mode === 'wireframe'
        ? new THREE.MeshBasicMaterial({ color: 0xff3b00, wireframe: true })
        : new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
      const monitor = new THREE.Mesh(monitorGeo, monitorMat);
      monitor.position.set(0, 0.8 + 0.04 + 0.22 + 0.24, -0.15);
      monitor.castShadow = true;
      deskGroup.add(monitor);

      // Glowing Screen Content (Developer Code / AI Grid)
      const screenContentGeo = new THREE.PlaneGeometry(0.82, 0.44);
      const screenContentMat = mode === 'wireframe'
        ? new THREE.MeshBasicMaterial({ color: 0xff3b00, side: THREE.DoubleSide })
        : new THREE.MeshBasicMaterial({
            color: 0x00d2ff, // Neon blue tech screen glow
            side: THREE.DoubleSide,
          });
      const screenContent = new THREE.Mesh(screenContentGeo, screenContentMat);
      screenContent.position.set(0, 0.8 + 0.04 + 0.22 + 0.24, -0.15 + 0.016);
      deskGroup.add(screenContent);

      // Screen decoration - tiny glowing lines representing code/metrics
      if (mode !== 'wireframe') {
        const lineColors = [0xffffff, 0xff3b00, 0x10b981];
        for (let i = 0; i < 8; i++) {
          const w = 0.2 + Math.random() * 0.4;
          const h = 0.015;
          const codeLineGeo = new THREE.PlaneGeometry(w, h);
          const randColor = lineColors[i % lineColors.length];
          const codeLineMat = new THREE.MeshBasicMaterial({
            color: randColor,
            side: THREE.DoubleSide,
          });
          const codeLine = new THREE.Mesh(codeLineGeo, codeLineMat);
          codeLine.position.set(
            (0.82 - w) * (Math.random() - 0.5),
            0.8 + 0.04 + 0.22 + 0.24 + (Math.random() - 0.5) * 0.32,
            -0.15 + 0.017
          );
          deskGroup.add(codeLine);
        }
      }

      // Keyboard
      const kbGeo = new THREE.BoxGeometry(0.42, 0.015, 0.14);
      const kbMat = mode === 'wireframe'
        ? new THREE.MeshBasicMaterial({ color: 0xffffff })
        : new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
      const kb = new THREE.Mesh(kbGeo, kbMat);
      kb.position.set(-0.05, 0.8 + 0.04 + 0.007, 0.1);
      kb.castShadow = true;
      deskGroup.add(kb);

      // Mouse
      const mouseGeo = new THREE.BoxGeometry(0.05, 0.015, 0.08);
      const mouseMat = kbMat;
      const mouse = new THREE.Mesh(mouseGeo, mouseMat);
      mouse.position.set(0.28, 0.8 + 0.04 + 0.007, 0.1);
      mouse.castShadow = true;
      deskGroup.add(mouse);

      // Tech Office Chair
      const chairGroup = new THREE.Group();
      chairGroup.position.set(0, 0, 0.65); // positioned behind desk

      // Chair Base/Caster
      const chairBaseGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 5);
      const chairBaseMat = mode === 'wireframe' ? new THREE.MeshBasicMaterial({ color: 0xff3b00 }) : materials.steel;
      const chairBase = new THREE.Mesh(chairBaseGeo, chairBaseMat);
      chairBase.position.y = 0.12;
      chairGroup.add(chairBase);

      const chairPillarGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.32, 8);
      const chairPillar = new THREE.Mesh(chairPillarGeo, chairBaseMat);
      chairPillar.position.y = 0.28;
      chairGroup.add(chairPillar);

      // Chair Seat
      const seatGeo = new THREE.BoxGeometry(0.44, 0.04, 0.44);
      const seatMat = mode === 'wireframe' 
        ? new THREE.MeshBasicMaterial({ color: 0xff3b00, wireframe: true })
        : new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
      const seat = new THREE.Mesh(seatGeo, seatMat);
      seat.position.y = 0.46;
      seat.castShadow = true;
      chairGroup.add(seat);

      // Chair Backrest
      const backGeo = new THREE.BoxGeometry(0.40, 0.44, 0.04);
      const back = new THREE.Mesh(backGeo, seatMat);
      back.position.set(0, 0.72, -0.19);
      back.rotation.x = -0.06;
      back.castShadow = true;
      chairGroup.add(back);

      deskGroup.add(chairGroup);
      bldGroup.add(deskGroup);

      // 2. City Skyline High-rise Buildings 3D Architecture
      // Place 10-12 high-rise towers as background architecture surrounding the office
      const towerCount = 12;
      const radius = 18.0;
      for (let i = 0; i < towerCount; i++) {
        const angle = (i / towerCount) * Math.PI * 2 + 0.25; 
        const tx = Math.cos(angle) * radius;
        const tz = Math.sin(angle) * radius;

        // Randomized building height and scale
        const tHeight = 8.0 + (Math.sin(i * 2.3) * 4.0) + (Math.cos(i * 1.7) * 3.0);
        const tWidth = 1.6 + Math.abs(Math.sin(i * 0.9)) * 1.2;
        const tDepth = 1.6 + Math.abs(Math.cos(i * 1.1)) * 1.2;

        const buildingGeo = new THREE.BoxGeometry(tWidth, tHeight, tDepth);
        let buildingMat;
        if (mode === 'wireframe') {
          buildingMat = new THREE.MeshBasicMaterial({ color: 0xff3b00, wireframe: true });
        } else if (mode === 'xray') {
          buildingMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            transparent: true,
            opacity: 0.12,
            roughness: 0.5,
            metalness: 0.5,
          });
        } else {
          buildingMat = new THREE.MeshStandardMaterial({
            color: 0x090d16,
            roughness: 0.7,
            metalness: 0.8,
          });
        }

        const bld = new THREE.Mesh(buildingGeo, buildingMat);
        bld.position.set(tx, tHeight / 2, tz);
        bld.castShadow = true;
        bld.receiveShadow = true;
        bldGroup.add(bld);

        // Add rows of glowing windows to the background skyscrapers
        if (mode === 'solid') {
          const floorLevels = Math.floor(tHeight / 0.8);
          const windowsPerSide = 3;
          
          const glowColor = i % 2 === 0 ? 0xff3b00 : 0x00d2ff;
          const windowMat = new THREE.MeshBasicMaterial({ color: glowColor });

          for (let f = 2; f < floorLevels - 1; f += 2) {
            const yOffset = f * 0.8;
            
            // Front & Back faces
            for (let w = 0; w < windowsPerSide; w++) {
              const xOffset = (w - (windowsPerSide - 1) / 2) * (tWidth / (windowsPerSide + 1));
              
              // Front window
              const winFrontGeo = new THREE.PlaneGeometry(0.12, 0.25);
              const winFront = new THREE.Mesh(winFrontGeo, windowMat);
              winFront.position.set(tx + xOffset, yOffset, tz + tDepth / 2 + 0.01);
              bldGroup.add(winFront);

              // Back window
              const winBack = new THREE.Mesh(winFrontGeo, windowMat);
              winBack.position.set(tx + xOffset, yOffset, tz - tDepth / 2 - 0.01);
              winBack.rotation.y = Math.PI;
              bldGroup.add(winBack);
            }

            // Left & Right faces
            for (let w = 0; w < windowsPerSide; w++) {
              const zOffset = (w - (windowsPerSide - 1) / 2) * (tDepth / (windowsPerSide + 1));

              // Right window
              const winRightGeo = new THREE.PlaneGeometry(0.12, 0.25);
              const winRight = new THREE.Mesh(winRightGeo, windowMat);
              winRight.position.set(tx + tWidth / 2 + 0.01, yOffset, tz + zOffset);
              winRight.rotation.y = Math.PI / 2;
              bldGroup.add(winRight);

              // Left window
              const winLeft = new THREE.Mesh(winRightGeo, windowMat);
              winLeft.position.set(tx - tWidth / 2 - 0.01, yOffset, tz + zOffset);
              winLeft.rotation.y = -Math.PI / 2;
              bldGroup.add(winLeft);
            }
          }
        }
      }

      // 3. Subtle outer architectural perimeter ring
      const boundaryGeo = new THREE.RingGeometry(15.5, 15.8, 32);
      const boundaryMat = new THREE.MeshBasicMaterial({ color: 0xff3b00, side: THREE.DoubleSide });
      const boundary = new THREE.Mesh(boundaryGeo, boundaryMat);
      boundary.rotation.x = -Math.PI / 2;
      boundary.position.y = 0.015;
      bldGroup.add(boundary);

      group.add(bldGroup);
    };

    // Master dispatcher for active project models
    const rebuildActiveModel = () => {
      const activeProj = stateRef.current.activeProject;
      const activeParams = stateRef.current.params;
      const activeViewMode = stateRef.current.viewMode;

      clearGroup(modelsGroup);

      // Build office and skyline architecture background
      buildOfficeAndTechBackground(modelsGroup, activeViewMode, activeParams);

      if (activeProj.id === 'helix-tower') {
        buildHelixTower(activeParams, activeViewMode);
      } else if (activeProj.id === 'light-pavilion') {
        buildLightPavilion(activeParams, activeViewMode);
      } else if (activeProj.id === 'parametric-dome') {
        buildGeometricShell(activeParams, activeViewMode);
      } else if (activeProj.id === 'timber-canopy') {
        buildTimberCanopy(activeParams, activeViewMode);
      }
    };

    rebuildActiveModel();

    // --- TIME OF DAY LIGHTING DYNAMICS ---
    const updateEnvironmentAndLights = (tod: TimeOfDay) => {
      if (tod === 'noon') {
        renderer.setClearColor(0x050505, 1);
        scene.fog!.color.setHex(0x050505);
        ambientLight.color.setHex(0xffffff);
        ambientLight.intensity = 0.45;

        dirLight.color.setHex(0xffffff);
        dirLight.intensity = 1.6;
        dirLight.position.set(15, 25, 10);

        accentLight1.intensity = 0.2;
        accentLight1.color.setHex(0xff3b00);
        accentLight2.intensity = 0.2;
        accentLight2.color.setHex(0xffffff);
      } else if (tod === 'goldenHour') {
        // Warm, glowing, orange sunset lighting
        renderer.setClearColor(0x0a0300, 1);
        scene.fog!.color.setHex(0x0a0300);
        ambientLight.color.setHex(0xff3b00);
        ambientLight.intensity = 0.25;

        dirLight.color.setHex(0xff3b00);
        dirLight.intensity = 1.8;
        dirLight.position.set(-20, 10, -5);

        accentLight1.color.setHex(0xff3b00);
        accentLight1.intensity = 2.5;
        accentLight2.color.setHex(0xffffff);
        accentLight2.intensity = 1.5;
      } else if (tod === 'night') {
        // High-contrast, moody deep dark midnight lighting with glowing accents
        renderer.setClearColor(0x000000, 1);
        scene.fog!.color.setHex(0x000000);
        ambientLight.color.setHex(0x111111);
        ambientLight.intensity = 0.15;

        dirLight.color.setHex(0xff3b00);
        dirLight.intensity = 0.4;
        dirLight.position.set(10, 15, -10);

        accentLight1.color.setHex(0xff3b00);
        accentLight1.intensity = 4.0; // Highly active glowing pods/fires
        accentLight2.color.setHex(0xffffff);
        accentLight2.intensity = 3.0; // Stark white interior glows
      }
    };

    updateEnvironmentAndLights(timeOfDay);

    // --- RESIZING ---
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    
    // Create a ResizeObserver to handle container-specific sizing perfectly
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // --- ANIMATION / INTERPOLATION LOOP ---
    let animationFrameId: number;
    let lastProjectId = activeProject.id;
    let lastViewMode = viewMode;

    const clock = new THREE.Clock();

    const tick = () => {
      const state = stateRef.current;
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Enable/Disable orbit controls interactively
      controls.enabled = state.isOrbitMode;

      // 1. Check if structural viewMode or project has changed -> Rebuild model
      if (state.activeProject.id !== lastProjectId || state.viewMode !== lastViewMode) {
        lastProjectId = state.activeProject.id;
        lastViewMode = state.viewMode;
        rebuildActiveModel();
      }

      // Redraw model if sliders change (height, twist, floors, spacing, structuralScale)
      // To keep performance high, we update mesh structures without deleting/recreating geometries where possible,
      // but for procedural models a rapid clear/rebuild works perfectly since counts are very low.
      rebuildActiveModel();

      // 2. Continuous environment lighting update
      updateEnvironmentAndLights(state.timeOfDay);

      // 3. Smooth Camera & Target LERP (Interpolation)
      if (!state.isOrbitMode) {
        const targetPreset = state.activeProject.cameraPresets[state.cameraPresetName];
        
        // Smoothly lerp camera position
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPreset.position[0], 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPreset.position[1], 0.05);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPreset.position[2], 0.05);

        // Smoothly lerp camera target
        cameraTarget.x = THREE.MathUtils.lerp(cameraTarget.x, targetPreset.target[0], 0.05);
        cameraTarget.y = THREE.MathUtils.lerp(cameraTarget.y, targetPreset.target[1], 0.05);
        cameraTarget.z = THREE.MathUtils.lerp(cameraTarget.z, targetPreset.target[2], 0.05);

        camera.lookAt(cameraTarget);
      } else {
        controls.update();
      }

      // 4. Subtle, calming architectural slow rotation when NOT in manual orbit
      if (!state.isOrbitMode) {
        modelsGroup.rotation.y = time * 0.05;
      } else {
        // Soft lock rotation
        modelsGroup.rotation.y = THREE.MathUtils.lerp(modelsGroup.rotation.y, 0, 0.05);
      }

      // 5. Pulsing lighting dynamics
      const glowIntensity = Math.sin(time * 2.5) * 0.15 + 0.85;
      accentLight1.intensity *= glowIntensity;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      clearGroup(modelsGroup);
      scene.remove(gridHelper);
      scene.remove(ground);
      groundGeo.dispose();
      groundMat.dispose();
      
      // Dispose of the core scene lights
      scene.remove(ambientLight);
      scene.remove(dirLight);
      scene.remove(accentLight1);
      scene.remove(accentLight2);

      // Dispose materials
      Object.values(materials).forEach((mat) => mat.dispose());

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#0a0a0c]" id="three-rendering-canvas-wrapper">
      <div ref={containerRef} className="w-full h-full" id="three-viewport-element" />

      {/* Subtle UI Ambient overlay instructions */}
      <div 
        className="absolute bottom-4 left-4 pointer-events-none text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2 select-none"
        id="canvas-status-badge"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isOrbitMode ? 'bg-amber-500 animate-pulse' : 'bg-sky-500 animate-pulse'}`}></span>
        {isOrbitMode ? 'INTERACTIVE ORBIT: DRAG TO ROTATE / PINCH TO ZOOM' : 'SCENIC PATH MODE: SYNCED WITH SCROLL'}
      </div>
    </div>
  );
}
