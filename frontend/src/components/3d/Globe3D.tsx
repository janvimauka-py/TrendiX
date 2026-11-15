import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Globe3DProps {
  onSelectNode?: (nodeInfo: { name: string; country: string; growth: string }) => void;
  className?: string;
}

// Generate an equirectangular world map canvas with realistic continents and country names
function createRealisticWorldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  const W = canvas.width;
  const H = canvas.height;

  // 1. Deep Navy Oceanic Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, H);
  oceanGrad.addColorStop(0, '#070C1A');
  oceanGrad.addColorStop(0.5, '#0B1530');
  oceanGrad.addColorStop(1, '#070C1A');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Subtle Equirectangular Graticule Lines (Lat/Lon Grid)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;

  // Longitude lines every 30 degrees
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * W;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // Latitude lines every 15 degrees
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = ((90 - lat) / 180) * H;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Equator highlight
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, H / 2);
  ctx.lineTo(W, H / 2);
  ctx.stroke();

  // Helper to convert lat/lon to Canvas X/Y
  const mapPoint = (lat: number, lon: number): [number, number] => {
    const x = ((lon + 180) / 360) * W;
    const y = ((90 - lat) / 180) * H;
    return [x, y];
  };

  const drawLandmass = (
    coords: Array<[number, number]>,
    fillColor = '#172554',
    strokeColor = '#38BDF8',
    lineWidth = 1.8
  ) => {
    if (coords.length < 3) return;
    ctx.beginPath();
    const [startX, startY] = mapPoint(coords[0][0], coords[0][1]);
    ctx.moveTo(startX, startY);
    for (let i = 1; i < coords.length; i++) {
      const [ptX, ptY] = mapPoint(coords[i][0], coords[i][1]);
      ctx.lineTo(ptX, ptY);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  // 3. Realistic Continent Landmass Polygons (Equirectangular Lat/Lon paths)

  // North America
  drawLandmass(
    [
      [71, -156], [70, -135], [68, -100], [60, -75], [52, -55], [45, -63],
      [42, -70], [30, -81], [25, -80], [28, -96], [20, -97], [16, -92],
      [14, -86], [9, -79], [8, -83], [16, -94], [23, -106], [32, -117],
      [38, -123], [48, -125], [58, -135], [60, -145], [64, -165], [71, -156]
    ],
    '#1E293B',
    '#60A5FA',
    1.5
  );

  // Greenland
  drawLandmass(
    [
      [83, -30], [80, -18], [70, -22], [60, -43], [66, -53], [76, -65],
      [82, -50], [83, -30]
    ],
    '#1E293B',
    '#38BDF8',
    1.2
  );

  // South America
  drawLandmass(
    [
      [11, -75], [10, -62], [5, -52], [-2, -44], [-8, -35], [-18, -39],
      [-23, -43], [-32, -52], [-40, -62], [-54, -68], [-53, -73], [-42, -74],
      [-30, -71], [-18, -71], [-5, -81], [5, -77], [11, -75]
    ],
    '#1E293B',
    '#60A5FA',
    1.5
  );

  // Europe
  drawLandmass(
    [
      [71, 28], [68, 14], [62, 5], [58, 8], [54, 10], [53, 5],
      [48, -4], [43, -9], [37, -9], [36, -5], [37, 2], [43, 7],
      [44, 12], [38, 15], [40, 26], [45, 29], [46, 38], [55, 38],
      [60, 30], [70, 30], [71, 28]
    ],
    '#1E293B',
    '#60A5FA',
    1.5
  );

  // United Kingdom & Ireland
  drawLandmass(
    [[58, -5], [58, -2], [51, 1], [50, -5], [55, -4], [58, -5]],
    '#1E293B',
    '#93C5FD',
    1.2
  );
  drawLandmass(
    [[55, -8], [52, -6], [51, -10], [54, -10], [55, -8]],
    '#1E293B',
    '#93C5FD',
    1.0
  );

  // Africa
  drawLandmass(
    [
      [37, 10], [36, 1], [32, -5], [28, -13], [20, -17], [14, -17],
      [5, -8], [4, 8], [-5, 12], [-15, 12], [-28, 16], [-34, 19],
      [-34, 26], [-28, 32], [-15, 40], [-4, 39], [11, 51], [12, 44],
      [22, 37], [30, 32], [32, 25], [32, 13], [37, 10]
    ],
    '#1E293B',
    '#60A5FA',
    1.5
  );

  // Madagascar
  drawLandmass(
    [[-12, 49], [-16, 44], [-25, 47], [-21, 50], [-12, 49]],
    '#1E293B',
    '#38BDF8',
    1.0
  );

  // Asia / Eurasia Mainland
  drawLandmass(
    [
      [75, 45], [77, 100], [70, 140], [67, 175], [60, 165], [54, 156],
      [46, 142], [42, 131], [35, 128], [37, 122], [30, 122], [22, 114],
      [12, 109], [10, 100], [18, 97], [22, 91], [21, 87], [15, 80],
      [8, 77], [18, 73], [24, 68], [25, 62], [14, 53], [12, 44],
      [22, 38], [31, 35], [37, 36], [41, 29], [55, 38], [60, 50],
      [68, 60], [75, 45]
    ],
    '#1E293B',
    '#60A5FA',
    1.5
  );

  // India Subcontinent Accentuation
  drawLandmass(
    [
      [28, 70], [32, 76], [28, 88], [24, 88], [20, 86],
      [15, 80], [8, 77], [15, 74], [22, 70], [28, 70]
    ],
    '#1E293B',
    '#38BDF8',
    1.6
  );

  // Japan Islands
  drawLandmass(
    [[45, 142], [43, 145], [35, 140], [33, 131], [35, 133], [40, 140], [45, 142]],
    '#1E293B',
    '#93C5FD',
    1.2
  );

  // Australia & New Zealand
  drawLandmass(
    [
      [-12, 132], [-14, 136], [-12, 142], [-22, 150], [-32, 152],
      [-38, 145], [-35, 136], [-32, 128], [-34, 115], [-22, 114],
      [-16, 123], [-12, 132]
    ],
    '#1E293B',
    '#60A5FA',
    1.5
  );

  drawLandmass(
    [[-35, 173], [-39, 177], [-46, 170], [-46, 166], [-41, 172], [-35, 173]],
    '#1E293B',
    '#93C5FD',
    1.0
  );

  // Antarctica
  drawLandmass(
    [
      [-65, -60], [-68, 0], [-66, 60], [-65, 120], [-68, 180],
      [-72, -120], [-65, -60]
    ],
    '#0F172A',
    '#38BDF8',
    1.2
  );

  // 4. Country Name Labels rendered clearly on the geographic map
  const countries = [
    { name: 'UNITED STATES', lat: 38, lon: -97, size: 17, color: '#F1F5F9' },
    { name: 'CANADA', lat: 56, lon: -106, size: 16, color: '#CBD5E1' },
    { name: 'MEXICO', lat: 23, lon: -102, size: 13, color: '#94A3B8' },
    { name: 'BRAZIL', lat: -12, lon: -51, size: 16, color: '#F1F5F9' },
    { name: 'ARGENTINA', lat: -35, lon: -65, size: 13, color: '#94A3B8' },
    { name: 'UNITED KINGDOM', lat: 54, lon: -2, size: 12, color: '#38BDF8' },
    { name: 'GERMANY', lat: 51, lon: 10, size: 12, color: '#38BDF8' },
    { name: 'FRANCE', lat: 46, lon: 2, size: 12, color: '#38BDF8' },
    { name: 'INDIA', lat: 22, lon: 78, size: 17, color: '#F8FAFC' },
    { name: 'CHINA', lat: 34, lon: 104, size: 17, color: '#F1F5F9' },
    { name: 'JAPAN', lat: 37, lon: 138, size: 13, color: '#38BDF8' },
    { name: 'AUSTRALIA', lat: -25, lon: 134, size: 16, color: '#F1F5F9' },
    { name: 'SOUTH AFRICA', lat: -29, lon: 24, size: 13, color: '#94A3B8' },
    { name: 'UAE', lat: 24, lon: 54, size: 11, color: '#38BDF8' },
    { name: 'RUSSIA', lat: 60, lon: 95, size: 18, color: '#CBD5E1' },
  ];

  countries.forEach((c) => {
    const [x, y] = mapPoint(c.lat, c.lon);
    ctx.font = `bold ${c.size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text shadow for high contrast
    ctx.fillStyle = '#050B1B';
    ctx.fillText(c.name, x + 1.5, y + 1.5);

    // Text fill
    ctx.fillStyle = c.color;
    ctx.fillText(c.name, x, y);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

export const Globe3D: React.FC<Globe3DProps> = ({ onSelectNode, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<{
    name: string;
    country: string;
    growth: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 215;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Globe Main Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Ambient and Directional Lighting for Realistic Globe Shading
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x38BDF8, 1.2);
    sunLight.position.set(150, 80, 120);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x1E3A8A, 1.0);
    rimLight.position.set(-150, -40, -100);
    scene.add(rimLight);

    // 3. Realistic Continent & Country Globe Sphere
    const worldTexture = createRealisticWorldTexture();
    const sphereGeo = new THREE.SphereGeometry(75, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: worldTexture,
      roughness: 0.35,
      metalness: 0.15,
    });
    const globeSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeSphere);

    // Atmosphere Glow Rim
    const glowGeo = new THREE.SphereGeometry(78, 36, 36);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x2563EB,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // Outer Thin Orbit Horizon Wire
    const wireGeo = new THREE.SphereGeometry(75.8, 48, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireSphere);

    // Convert lat/long to 3D Vector on Globe Surface
    const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 4. Real Internet Market Hotspots (including GTA VI in USA & Quick Commerce in India)
    const hotspots = [
      { name: 'Grand Theft Auto VI (GTA VI)', country: 'United States', lat: 37.77, lon: -122.41, growth: '+382%', color: 0x38BDF8 },
      { name: 'Quick Commerce Logistics & AI', country: 'India', lat: 12.97, lon: 77.59, growth: '+215%', color: 0x60A5FA },
      { name: 'Smart Health Titanium Rings', country: 'United Kingdom', lat: 51.50, lon: -0.12, growth: '+86%', color: 0x38BDF8 },
      { name: 'Home CleanTech Energy Storage', country: 'Germany', lat: 52.52, lon: 13.40, growth: '+118%', color: 0x34D399 },
      { name: 'Local AI Hardware & Neural NPUs', country: 'Japan', lat: 35.67, lon: 139.65, growth: '+142%', color: 0x60A5FA },
      { name: 'Instant Digital FinTech Rails', country: 'Brazil', lat: -23.55, lon: -46.63, growth: '+94%', color: 0xFBBF24 },
      { name: 'Autonomous Robotics Hub', country: 'United Arab Emirates', lat: 25.20, lon: 55.27, growth: '+178%', color: 0x38BDF8 },
      { name: 'Circular Engineered Materials', country: 'Australia', lat: -33.86, lon: 151.20, growth: '+62%', color: 0xA78BFA },
    ];

    const hotspotMeshes: THREE.Mesh[] = [];
    hotspots.forEach((spot) => {
      const pos = latLongToVector3(spot.lat, spot.lon, 76.5);

      // Core Hotspot Node
      const nodeGeo = new THREE.SphereGeometry(1.9, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: spot.color });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = spot;
      globeGroup.add(nodeMesh);
      hotspotMeshes.push(nodeMesh);

      // Pulsing Base Ring
      const ringGeo = new THREE.RingGeometry(2.4, 3.8, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      // Vertical Signal Light Pillar
      const normal = pos.clone().normalize();
      const beamHeight = 10.0;
      const beamGeo = new THREE.CylinderGeometry(0.2, 0.45, beamHeight, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: spot.color,
        transparent: true,
        opacity: 0.7,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.copy(pos.clone().add(normal.clone().multiplyScalar(beamHeight / 2)));
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      globeGroup.add(beam);

      // Beacon Tip
      const tipGeo = new THREE.SphereGeometry(0.9, 8, 8);
      const tip = new THREE.Mesh(tipGeo, nodeMat);
      tip.position.copy(pos.clone().add(normal.clone().multiplyScalar(beamHeight)));
      globeGroup.add(tip);
    });

    // 5. Connecting Geodesic Flight Arcs with Travelling Data Packets
    const arcCurves: THREE.QuadraticBezierCurve3[] = [];
    const pulseMeshes: THREE.Mesh[] = [];

    const createArc = (v1: THREE.Vector3, v2: THREE.Vector3, color: number) => {
      const distance = v1.distanceTo(v2);
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const midLength = mid.length();
      mid.normalize().multiplyScalar(midLength + distance * 0.36);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      arcCurves.push(curve);

      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.65,
      });
      globeGroup.add(new THREE.Line(arcGeo, arcMat));

      // Moving Data Pulse Bead
      const pulseGeo = new THREE.SphereGeometry(1.2, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.userData = { curveIndex: arcCurves.length - 1, offset: Math.random() };
      globeGroup.add(pulse);
      pulseMeshes.push(pulse);
    };

    const usaPos = latLongToVector3(37.77, -122.41, 76.5);
    const ukPos = latLongToVector3(51.50, -0.12, 76.5);
    const indPos = latLongToVector3(12.97, 77.59, 76.5);
    const jpnPos = latLongToVector3(35.67, 139.65, 76.5);
    const gerPos = latLongToVector3(52.52, 13.40, 76.5);
    const uaePos = latLongToVector3(25.20, 55.27, 76.5);
    const brzPos = latLongToVector3(-23.55, -46.63, 76.5);

    createArc(usaPos, indPos, 0x38BDF8);
    createArc(ukPos, gerPos, 0x60A5FA);
    createArc(indPos, jpnPos, 0x38BDF8);
    createArc(indPos, uaePos, 0x34D399);
    createArc(usaPos, brzPos, 0x60A5FA);
    createArc(ukPos, indPos, 0x38BDF8);

    // 6. Equatorial Orbit Guides
    const ring1Geo = new THREE.RingGeometry(95, 96.2, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22,
    });
    const orbitalRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    orbitalRing1.rotation.x = Math.PI / 2.3;
    scene.add(orbitalRing1);

    // 7. Interactive Drag & Raycasting
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let autoRotate = true;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(hotspotMeshes);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const data = hit.userData;
          setHoveredNode({
            name: data.name,
            country: data.country,
            growth: data.growth,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          container.style.cursor = 'pointer';
        } else {
          setHoveredNode(null);
          container.style.cursor = 'grab';
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => {
        autoRotate = true;
      }, 2500);
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotMeshes);
      if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        if (onSelectNode && data.name) {
          onSelectNode({
            name: data.name,
            country: data.country || 'Global',
            growth: data.growth || '+50%',
          });
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate) {
        globeGroup.rotation.y += 0.0028;
      }

      orbitalRing1.rotation.z = elapsedTime * 0.04;

      pulseMeshes.forEach((pulse) => {
        const cIdx = pulse.userData.curveIndex;
        const curve = arcCurves[cIdx];
        if (curve) {
          const t = (elapsedTime * 0.35 + pulse.userData.offset) % 1.0;
          const pos = curve.getPoint(t);
          pulse.position.copy(pos);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 600;
      const newH = container.clientHeight || 520;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      worldTexture.dispose();
    };
  }, [onSelectNode]);

  return (
    <div className={`relative w-full h-[520px] select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hover Tooltip Overlay */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 rounded-xl bg-white/95 dark-navy:bg-[#080D1C]/95 border border-blue-200 dark-navy:border-cyan-400/60 shadow-xl backdrop-blur-xl animate-in zoom-in-95 text-slate-900 dark-navy:text-white"
          style={{ left: hoveredNode.x, top: hoveredNode.y }}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark-navy:text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark-navy:bg-cyan-400 animate-ping" />
            {hoveredNode.name}
          </div>
          <div className="text-[11px] text-slate-600 dark-navy:text-slate-300 font-medium">{hoveredNode.country}</div>
          <div className="text-[11px] font-mono text-emerald-600 dark-navy:text-emerald-400 font-bold mt-0.5">
            Velocity: {hoveredNode.growth}
          </div>
        </div>
      )}

      {/* Telemetry Center HUD */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-white/90 dark-navy:bg-[#0B132B]/90 border border-slate-200 dark-navy:border-cyan-500/30 text-blue-900 dark-navy:text-cyan-300 shadow-sm backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-blue-600 dark-navy:bg-cyan-400 animate-pulse" />
        TRENDIX GLOBAL TELEMETRY GLOBE
      </div>

      {/* Interaction Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full text-[11px] font-mono bg-white/90 dark-navy:bg-[#0B132B]/90 text-slate-700 dark-navy:text-slate-300 flex items-center gap-2 border border-slate-200 dark-navy:border-cyan-500/30 shadow-md backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Interactive World Orbit • Drag to rotate • Click beacons to inspect
      </div>
    </div>
  );
};
