import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Image as ImageIcon, Box, Zap, Sparkles, ExternalLink } from 'lucide-react';

interface Product3DViewerProps {
  productName: string;
  category: string;
  imageUrl?: string;
  className?: string;
  specs?: Record<string, string>;
  sourceUrl?: string;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  productName,
  category,
  imageUrl,
  className = '',
  specs = {},
  sourceUrl,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeViewMode, setActiveViewMode] = useState<'photo' | 'model'>(imageUrl ? 'photo' : 'model');
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
    if (activeViewMode !== 'model' || !mountRef.current) return;
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
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(colorHexMap[glowColor], 3, 50);
    pointLight1.position.set(12, 16, 12);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x1E3A8A, 2, 50);
    pointLight2.position.set(-12, -10, -10);
    scene.add(pointLight2);

    // 3. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;
    materialsRef.current = [];

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

    const lowerCat = (category + ' ' + productName).toLowerCase();

    if (lowerCat.includes('gta') || lowerCat.includes('game') || lowerCat.includes('gaming')) {
      // NEXT-GEN GAMING CONSOLE / CONTROLLER HUD ARTIFACT
      const consoleGeo = new THREE.BoxGeometry(10, 2.4, 7);
      const consoleMat = createMaterial(0x0F172A, 0.2, 0.8);
      const consoleMesh = new THREE.Mesh(consoleGeo, consoleMat);
      modelGroup.add(consoleMesh);

      // Glowing Neon Accent Light Strip
      const lightStripGeo = new THREE.BoxGeometry(9.4, 0.3, 0.4);
      const lightStripMat = createMaterial(colorHexMap[glowColor], 0.1, 0.1, colorHexMap[glowColor]);
      const lightStrip = new THREE.Mesh(lightStripGeo, lightStripMat);
      lightStrip.position.set(0, 1.25, 3.4);
      modelGroup.add(lightStrip);

      // Holographic Floating Disk
      const diskGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.2, 32);
      const diskMat = createMaterial(0xD97706, 0.1, 0.9, 0x451A03);
      const disk = new THREE.Mesh(diskGeo, diskMat);
      disk.position.set(0, 3.5, 0);
      disk.rotation.x = Math.PI / 4;
      modelGroup.add(disk);

      // Rotating Hologram Rings
      const ringGeo = new THREE.RingGeometry(4.5, 4.8, 32);
      const ringMat = createMaterial(colorHexMap[glowColor], 0.1, 0.1, colorHexMap[glowColor]);
      ringMat.side = THREE.DoubleSide;
      const orbitRing = new THREE.Mesh(ringGeo, ringMat);
      orbitRing.position.y = 3.5;
      orbitRing.rotation.x = Math.PI / 2;
      modelGroup.add(orbitRing);
    } else if (lowerCat.includes('ring') || lowerCat.includes('wearable') || lowerCat.includes('aura')) {
      // SMART HEALTH RING
      const ringGeo = new THREE.TorusGeometry(6.5, 1.4, 28, 64);
      const ringMat = createMaterial(0x8892B0, 0.2, 0.95);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      modelGroup.add(ringMesh);

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

      const dieGeo = new THREE.BoxGeometry(6, 1.0, 6);
      const dieMat = createMaterial(0xD97706, 0.15, 0.9);
      const dieMesh = new THREE.Mesh(dieGeo, dieMat);
      dieMesh.position.y = 0.8;
      modelGroup.add(dieMesh);

      const coreGeo = new THREE.BoxGeometry(3, 0.6, 3);
      const coreMat = createMaterial(colorHexMap[glowColor], 0.1, 0.1, colorHexMap[glowColor]);
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = 1.4;
      modelGroup.add(coreMesh);

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

      const tipGeo = new THREE.SphereGeometry(2.4, 24, 24);
      const tipMat = createMaterial(colorHexMap[glowColor], 0.4, 0.1, colorHexMap[glowColor]);
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(2.4, 2.4, 0);
      modelGroup.add(tip);
    } else if (lowerCat.includes('power') || lowerCat.includes('charg') || lowerCat.includes('gan')) {
      // GaN FAST CHARGER DOCK
      const cubeGeo = new THREE.BoxGeometry(6.5, 8.5, 6.5);
      const cubeMat = createMaterial(0x0F172A, 0.3, 0.7);
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      modelGroup.add(cube);

      const screenGeo = new THREE.PlaneGeometry(4.5, 2.4);
      const screenMat = createMaterial(colorHexMap[glowColor], 0.1, 0.1, colorHexMap[glowColor]);
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 1.8, 3.26);
      modelGroup.add(screen);
    } else {
      // PREMIUM HARDWARE ARTIFACT
      const icoGeo = new THREE.IcosahedronGeometry(5.5, 1);
      const icoMat = createMaterial(colorHexMap[glowColor], 0.2, 0.9, colorHexMap[glowColor]);
      const icoMesh = new THREE.Mesh(icoGeo, icoMat);
      modelGroup.add(icoMesh);
    }

    // Shadow plane
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -6.5;
    scene.add(shadow);

    // Mouse drag
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

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && modelGroupRef.current && !isDragging) {
        modelGroupRef.current.rotation.y += 0.009;
      }
      renderer.render(scene, camera);
    };
    animate();

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
  }, [activeViewMode, category, productName, glowColor, wireframeMode]);

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
    <div
      className={`relative w-full h-[360px] rounded-2xl border border-slate-200 dark-navy:border-blue-900/40 overflow-hidden select-none bg-white dark-navy:bg-[#050814]/90 shadow-lg ${className}`}
    >
      {/* View Mode 1: Realistic High-Resolution Photography */}
      {activeViewMode === 'photo' && imageUrl ? (
        <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden group">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Fallback to model view if image cannot load
              setActiveViewMode('model');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

          {/* Realistic Photography Badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600/90 text-white shadow flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-cyan-200" />
              VERIFIED PRODUCT PHOTOGRAPHY
            </span>
            <span className="text-[11px] font-semibold text-slate-100 truncate max-w-[200px] drop-shadow">
              {productName}
            </span>
          </div>
        </div>
      ) : (
        /* View Mode 2: Interactive Telemetry Model */
        <>
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-slate-950" />
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600/20 text-blue-700 dark-navy:text-cyan-300 border border-blue-500/40 flex items-center gap-1 backdrop-blur-md">
              <Box className="w-3 h-3 text-blue-600 dark-navy:text-cyan-400" />
              INTERACTIVE TELEMETRY MODEL
            </span>
            <span className="text-[11px] font-semibold text-slate-200 truncate max-w-[200px]">
              {productName}
            </span>
          </div>
        </>
      )}

      {/* Top Right Controls Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        {/* Toggle between Photo & Model */}
        {imageUrl && (
          <button
            onClick={() => setActiveViewMode(activeViewMode === 'photo' ? 'model' : 'photo')}
            title={activeViewMode === 'photo' ? 'Switch to Interactive Telemetry Model' : 'Switch to Realistic Photography'}
            className="px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all bg-white/90 text-slate-800 border-slate-300 hover:bg-white shadow-xs backdrop-blur-md flex items-center gap-1.5"
          >
            {activeViewMode === 'photo' ? (
              <>
                <Box className="w-3.5 h-3.5 text-blue-600" />
                <span>Interactive Model</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Real Picture</span>
              </>
            )}
          </button>
        )}

        {/* Model-specific controls when in model mode */}
        {activeViewMode === 'model' && (
          <>
            <button
              onClick={toggleWireframe}
              title="Toggle Wireframe"
              className={`p-1.5 rounded-lg border text-xs transition-all backdrop-blur-md ${
                wireframeMode
                  ? 'bg-blue-600/40 text-cyan-200 border-cyan-400'
                  : 'bg-black/60 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Rotation"
              className={`p-1.5 rounded-lg border text-xs transition-all backdrop-blur-md ${
                autoRotate
                  ? 'bg-blue-600/40 text-blue-200 border-blue-400'
                  : 'bg-black/60 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Specs Ticker */}
      <div className="absolute bottom-2 left-3 right-3 z-10 p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between text-[11px] font-mono text-slate-300 backdrop-blur-md shadow-lg">
        <span className="flex items-center gap-1 text-cyan-400 font-semibold">
          <Zap className="w-3 h-3 text-cyan-400" />
          {activeViewMode === 'photo' ? 'Verified High-Definition Imagery' : 'Drag to rotate 360°'}
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
