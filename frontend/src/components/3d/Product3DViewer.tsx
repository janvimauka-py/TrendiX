import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Box, Shield, Zap } from 'lucide-react';

interface Product3DViewerProps {
  productName: string;
  category: string;
  className?: string;
  initialColor?: string;
  specs?: Record<string, string>;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  productName,
  category,
  className = '',
  specs = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [glowColor, setGlowColor] = useState<'cyan' | 'magenta' | 'emerald' | 'amber'>('cyan');

  // Three.js scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  const colorHexMap = {
    cyan: 0x00F2FE,
    magenta: 0xF72585,
    emerald: 0x00FFA3,
    amber: 0xFFB703,
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 350;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 26);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(colorHexMap[glowColor], 3, 50);
    pointLight1.position.set(12, 16, 12);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4361EE, 2, 50);
    pointLight2.position.set(-12, -10, -10);
    scene.add(pointLight2);

    // 3. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;
    materialsRef.current = [];

    // Helper to register and create stylized materials
    const createMaterial = (baseColor: number, roughness = 0.3, metalness = 0.8, emissive = 0x000000) => {
      const mat = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness,
        metalness,
        emissive,
        wireframe: wireframeMode,
      });
      materialsRef.current.push(mat);
      return mat;
    };

    // 4. Procedural 3D Geometry Based on Category / Name
    const lowerCat = (category + ' ' + productName).toLowerCase();

    if (lowerCat.includes('ring') || lowerCat.includes('wearable') || lowerCat.includes('aura')) {
      // SMART HEALTH RING (Titanium Beveled Ring with Inner Sensors)
      const ringGeo = new THREE.TorusGeometry(6.5, 1.4, 28, 64);
      const ringMat = createMaterial(0x8892B0, 0.2, 0.95);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      modelGroup.add(ringMesh);

      // Inner Biometric PPG Sensors
      for (let i = 0; i < 4; i++) {
        const sensorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
        const sensorMat = createMaterial(colorHexMap[glowColor], 0.1, 0.2, colorHexMap[glowColor]);
        const sensor = new THREE.Mesh(sensorGeo, sensorMat);
        const angle = (i * Math.PI) / 2;
        sensor.position.set(Math.cos(angle) * 5.2, Math.sin(angle) * 5.2, 0);
        sensor.rotation.x = Math.PI / 3;
        modelGroup.add(sensor);
      }
    } else if (lowerCat.includes('pc') || lowerCat.includes('chip') || lowerCat.includes('neural') || lowerCat.includes('ai')) {
      // AI CHIP / NEURAL MICRO-PC
      const baseGeo = new THREE.BoxGeometry(9, 1.2, 9);
      const baseMat = createMaterial(0x111827, 0.4, 0.6);
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      modelGroup.add(baseMesh);

      // Golden Silicon Die / Heatspreader
      const dieGeo = new THREE.BoxGeometry(6, 1.0, 6);
      const dieMat = createMaterial(0xD97706, 0.15, 0.9);
      const dieMesh = new THREE.Mesh(dieGeo, dieMat);
      dieMesh.position.y = 0.8;
      modelGroup.add(dieMesh);

      // Glowing Central NPU Neural Core
      const coreGeo = new THREE.BoxGeometry(3, 0.6, 3);
      const coreMat = createMaterial(colorHexMap[glowColor], 0.1, 0.1, colorHexMap[glowColor]);
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = 1.4;
      modelGroup.add(coreMesh);

      // Rotating Neural Orbit Rings
      const ringGeo = new THREE.RingGeometry(7.5, 7.8, 32);
      const ringMat = createMaterial(colorHexMap[glowColor], 0.1, 0.1, colorHexMap[glowColor]);
      ringMat.side = THREE.DoubleSide;
      const orbitRing = new THREE.Mesh(ringGeo, ringMat);
      orbitRing.rotation.x = Math.PI / 2;
      modelGroup.add(orbitRing);
    } else if (lowerCat.includes('audio') || lowerCat.includes('bud') || lowerCat.includes('acoustic')) {
      // STUDIO ANC EARBUDS
      const bodyGeo = new THREE.CapsuleGeometry(2.2, 4.0, 16, 24);
      const bodyMat = createMaterial(0x1E293B, 0.25, 0.85);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.z = Math.PI / 4;
      modelGroup.add(body);

      // Silicone Sound Chamber Tip
      const tipGeo = new THREE.SphereGeometry(2.4, 24, 24);
      const tipMat = createMaterial(colorHexMap[glowColor], 0.4, 0.1, colorHexMap[glowColor]);
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(2.4, 2.4, 0);
      modelGroup.add(tip);

      // Soundwave Acoustic Rings
      for (let i = 1; i <= 3; i++) {
        const waveGeo = new THREE.TorusGeometry(3.5 + i * 1.5, 0.12, 16, 32);
        const waveMat = createMaterial(colorHexMap[glowColor], 0.1, 0.1, colorHexMap[glowColor]);
        const wave = new THREE.Mesh(waveGeo, waveMat);
        wave.position.set(2.4, 2.4, 0);
        wave.rotation.y = Math.PI / 2;
        modelGroup.add(wave);
      }
    } else if (lowerCat.includes('power') || lowerCat.includes('charg') || lowerCat.includes('gan')) {
      // GaN FAST CHARGER DOCK
      const cubeGeo = new THREE.BoxGeometry(6.5, 8.5, 6.5);
      const cubeMat = createMaterial(0x0F172A, 0.3, 0.7);
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      modelGroup.add(cube);

      // Real-time OLED Wattage Readout Screen
      const screenGeo = new THREE.PlaneGeometry(4.5, 2.4);
      const screenMat = createMaterial(colorHexMap[glowColor], 0.1, 0.1, colorHexMap[glowColor]);
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 1.8, 3.26);
      modelGroup.add(screen);

      // USB-C Ports
      for (let i = -1; i <= 1; i++) {
        const portGeo = new THREE.BoxGeometry(1.8, 0.4, 0.6);
        const portMat = createMaterial(0x38BDF8, 0.2, 0.9);
        const port = new THREE.Mesh(portGeo, portMat);
        port.position.set(0, -0.6 + i * 1.2, 3.26);
        modelGroup.add(port);
      }
    } else if (lowerCat.includes('battery') || lowerCat.includes('energy') || lowerCat.includes('solar')) {
      // RESIDENTIAL CLEAN ENERGY STORAGE CELL
      const packGeo = new THREE.BoxGeometry(7, 10, 4);
      const packMat = createMaterial(0x1E293B, 0.35, 0.8);
      const pack = new THREE.Mesh(packGeo, packMat);
      modelGroup.add(pack);

      // LFP Cell Modules & State-Of-Charge Bar
      for (let i = 0; i < 5; i++) {
        const barGeo = new THREE.BoxGeometry(4.8, 0.8, 0.4);
        const barMat = createMaterial(colorHexMap[glowColor], 0.1, 0.1, colorHexMap[glowColor]);
        const bar = new THREE.Mesh(barGeo, barMat);
        bar.position.set(0, -3 + i * 1.5, 2.05);
        modelGroup.add(bar);
      }
    } else {
      // FUTURISTIC TECH ICON / ARTIFACT (Icosahedron Hologram)
      const icoGeo = new THREE.IcosahedronGeometry(5.5, 1);
      const icoMat = createMaterial(colorHexMap[glowColor], 0.2, 0.9, colorHexMap[glowColor]);
      const icoMesh = new THREE.Mesh(icoGeo, icoMat);
      modelGroup.add(icoMesh);

      // Inner Core
      const innerGeo = new THREE.OctahedronGeometry(3.0, 0);
      const innerMat = createMaterial(0xFFFFFF, 0.1, 0.2, 0xFFFFFF);
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      modelGroup.add(innerMesh);
    }

    // Floating Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -6.5;
    scene.add(shadow);

    // 5. Interactive Mouse Orbit Controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modelGroupRef.current) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      modelGroupRef.current.rotation.y += deltaX * 0.01;
      modelGroupRef.current.rotation.x += deltaY * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 6. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (modelGroupRef.current) {
        if (autoRotate && !isDragging) {
          modelGroupRef.current.rotation.y += 0.008;
          modelGroupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.5;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 400;
      const newH = container.clientHeight || 350;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [category, productName, glowColor, wireframeMode]);

  // Update wireframe mode dynamically
  const toggleWireframe = () => {
    setWireframeMode((prev) => {
      const next = !prev;
      materialsRef.current.forEach((m) => {
        (m as THREE.MeshStandardMaterial).wireframe = next;
      });
      return next;
    });
  };

  return (
    <div className={`relative w-full h-[360px] rounded-2xl glass-panel border border-cyan-500/30 overflow-hidden select-none bg-[#050814]/90 ${className}`}>
      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Telemetry Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1">
          <Box className="w-3 h-3 text-cyan-400 animate-spin-slow" />
          3D HARDWARE TELEMETRY
        </span>
        <span className="text-[11px] font-semibold text-slate-300 truncate max-w-[200px]">
          {productName}
        </span>
      </div>

      {/* Top Right Controls Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        {/* Wireframe / Hologram Mode Toggle */}
        <button
          onClick={toggleWireframe}
          title="Toggle Holographic Wireframe"
          className={`p-1.5 rounded-lg border text-xs transition-all ${
            wireframeMode
              ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400'
              : 'bg-[#111B35]/80 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Auto-spin Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle 360° Rotation"
          className={`p-1.5 rounded-lg border text-xs transition-all ${
            autoRotate
              ? 'bg-blue-600/30 text-blue-300 border-blue-500'
              : 'bg-[#111B35]/80 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* Glow Color Swatches */}
        {(['cyan', 'magenta', 'emerald', 'amber'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setGlowColor(c)}
            title={`Set ${c} light radiance`}
            className={`w-4 h-4 rounded-full border transition-all ${
              glowColor === c ? 'scale-125 border-white ring-2 ring-cyan-400' : 'border-transparent opacity-60 hover:opacity-100'
            } ${
              c === 'cyan'
                ? 'bg-cyan-400'
                : c === 'magenta'
                ? 'bg-pink-500'
                : c === 'emerald'
                ? 'bg-emerald-400'
                : 'bg-amber-400'
            }`}
          />
        ))}
      </div>

      {/* Bottom Specs Ticker */}
      <div className="absolute bottom-2 left-3 right-3 z-10 p-2 rounded-xl bg-[#080D1C]/85 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <span className="flex items-center gap-1 text-cyan-400">
          <Zap className="w-3 h-3 text-cyan-400" />
          Drag to orbit 360°
        </span>
        <div className="flex items-center gap-3 text-slate-400">
          {Object.entries(specs).slice(0, 2).map(([k, v]) => (
            <span key={k} className="hidden sm:inline">
              {k}: <strong className="text-white font-medium">{v}</strong>
            </span>
          ))}
          <span className="text-emerald-400 font-bold">Verified SKU</span>
        </div>
      </div>
    </div>
  );
};

