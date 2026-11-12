import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Globe3DProps {
  onSelectNode?: (nodeInfo: { name: string; country: string; growth: string }) => void;
  className?: string;
}

export const Globe3D: React.FC<Globe3DProps> = ({ onSelectNode, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<{ name: string; country: string; growth: string; x: number; y: number } | null>(null);

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

    // Inner Core Sphere
    const sphereGeo = new THREE.SphereGeometry(75, 48, 48);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x050814,
      transparent: true,
      opacity: 0.94,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(coreSphere);

    // Wireframe Outer Mesh (Latitude & Longitude grid)
    const wireGeo = new THREE.SphereGeometry(75.6, 36, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00F2FE,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireSphere);

    // Double Atmosphere Glow Rims (Cyan & Violet)
    const glowGeo = new THREE.SphereGeometry(79, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00F2FE,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    const glowOuterGeo = new THREE.SphereGeometry(83, 32, 32);
    const glowOuterMat = new THREE.MeshBasicMaterial({
      color: 0x9D4EDD,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const glowOuterMesh = new THREE.Mesh(glowOuterGeo, glowOuterMat);
    globeGroup.add(glowOuterMesh);

    // Convert lat/long to 3D Vector
    const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 3. Surface Dot Matrix (Continents simulation with Cyberpunk Color Shift)
    const dotPoints: number[] = [];
    const colors: number[] = [];
    for (let lat = -80; lat <= 80; lat += 4.0) {
      const radiusAtLat = Math.cos((lat * Math.PI) / 180);
      const numLong = Math.max(12, Math.floor(70 * radiusAtLat));
      for (let i = 0; i < numLong; i++) {
        const lon = (i / numLong) * 360 - 180;
        const isLand =
          (lat > 15 && lat < 70 && lon > -130 && lon < -60) || // North America
          (lat > -55 && lat < 12 && lon > -80 && lon < -35) ||  // South America
          (lat > 35 && lat < 70 && lon > -10 && lon < 50) ||   // Europe
          (lat > 5 && lat < 60 && lon > 65 && lon < 140) ||    // Asia
          (lat > -35 && lat < 35 && lon > 10 && lon < 45) ||   // Africa
          (lat > -40 && lat < -10 && lon > 115 && lon < 155);  // Australia

        if (isLand || Math.random() < 0.08) {
          const v = latLongToVector3(lat, lon, 76);
          dotPoints.push(v.x, v.y, v.z);
          if (isLand) {
            // Gradient from Cyber Cyan to Neon Violet based on latitude
            const ratio = (lat + 80) / 160;
            colors.push(0.0 + ratio * 0.6, 0.95 - ratio * 0.3, 0.99);
          } else {
            colors.push(0.05, 0.18, 0.35);
          }
        }
      }
    }

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotPoints, 3));
    dotGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const dotMaterial = new THREE.PointsMaterial({
      size: 1.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const dotMesh = new THREE.Points(dotGeometry, dotMaterial);
    globeGroup.add(dotMesh);

    // 4. Trending Hotspot Nodes (Interactive Cities with Laser Beacons)
    const hotspots = [
      { name: 'Local AI Silicon', country: 'San Francisco, US', lat: 37.77, lon: -122.41, growth: '+142%', color: 0x00F2FE },
      { name: 'Quick Commerce Logistics', country: 'Bengaluru, IN', lat: 12.97, lon: 77.59, growth: '+215%', color: 0x9D4EDD },
      { name: 'Circular Tech Apparel', country: 'London, UK', lat: 51.50, lon: -0.12, growth: '-34%', color: 0xF72585 },
      { name: 'Home Battery CleanTech', country: 'Berlin, DE', lat: 52.52, lon: 13.40, growth: '+118%', color: 0x00FFA3 },
      { name: 'Titanium Smart Rings', country: 'Tokyo, JP', lat: 35.67, lon: 139.65, growth: '+86%', color: 0x00F2FE },
      { name: 'GaN Modular Fast Power', country: 'Shenzhen, CN', lat: 22.54, lon: 114.05, growth: '+72%', color: 0xFFB703 },
    ];

    const hotspotMeshes: THREE.Mesh[] = [];
    hotspots.forEach((spot) => {
      const pos = latLongToVector3(spot.lat, spot.lon, 77.5);

      // Hotspot core bead
      const nodeGeo = new THREE.SphereGeometry(1.8, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: spot.color });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = spot;
      globeGroup.add(nodeMesh);
      hotspotMeshes.push(nodeMesh);

      // Pulsing Base Ring
      const ringGeo = new THREE.RingGeometry(2.5, 3.5, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      // Vertical Laser Light Pillar rising outward from globe surface
      const normal = pos.clone().normalize();
      const beamHeight = 9.0;
      const beamGeo = new THREE.CylinderGeometry(0.2, 0.4, beamHeight, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: spot.color,
        transparent: true,
        opacity: 0.65,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.copy(pos.clone().add(normal.clone().multiplyScalar(beamHeight / 2)));
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      globeGroup.add(beam);

      // Beam beacon tip
      const tipGeo = new THREE.SphereGeometry(0.8, 8, 8);
      const tip = new THREE.Mesh(tipGeo, nodeMat);
      tip.position.copy(pos.clone().add(normal.clone().multiplyScalar(beamHeight)));
      globeGroup.add(tip);
    });

    // 5. Glowing Connecting Data Arcs with Moving Pulse Packets
    const arcCurves: THREE.QuadraticBezierCurve3[] = [];
    const pulseMeshes: THREE.Mesh[] = [];

    const createArc = (v1: THREE.Vector3, v2: THREE.Vector3, color: number) => {
      const distance = v1.distanceTo(v2);
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const midLength = mid.length();
      mid.normalize().multiplyScalar(midLength + distance * 0.38);

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

      // Moving Data Pulse Bead along Arc
      const pulseGeo = new THREE.SphereGeometry(1.2, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.userData = { curveIndex: arcCurves.length - 1, offset: Math.random() };
      globeGroup.add(pulse);
      pulseMeshes.push(pulse);
    };

    const sf = latLongToVector3(37.77, -122.41, 77);
    const lon = latLongToVector3(51.50, -0.12, 77);
    const blr = latLongToVector3(12.97, 77.59, 77);
    const tyo = latLongToVector3(35.67, 139.65, 77);
    const ber = latLongToVector3(52.52, 13.40, 77);

    createArc(sf, lon, 0x00F2FE);
    createArc(lon, blr, 0x9D4EDD);
    createArc(blr, tyo, 0x00FFA3);
    createArc(ber, sf, 0xF72585);
    createArc(tyo, sf, 0x00F2FE);

    // 6. Holographic Outer Orbital Rings (Rotating Independently)
    const ring1Geo = new THREE.RingGeometry(96, 97.2, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00F2FE,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
    });
    const orbitalRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    orbitalRing1.rotation.x = Math.PI / 2.3;
    scene.add(orbitalRing1);

    const ring2Geo = new THREE.RingGeometry(105, 106, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x9D4EDD,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const orbitalRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    orbitalRing2.rotation.y = Math.PI / 3;
    orbitalRing2.rotation.x = Math.PI / 6;
    scene.add(orbitalRing2);

    // 7. Ambient Particle Star Dust
    const particleCount = 280;
    const partGeo = new THREE.BufferGeometry();
    const partPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      partPositions[i] = (Math.random() - 0.5) * 400;
      partPositions[i + 1] = (Math.random() - 0.5) * 400;
      partPositions[i + 2] = (Math.random() - 0.5) * 400;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x00F2FE,
      size: 1.4,
      transparent: true,
      opacity: 0.5,
    });
    const particleField = new THREE.Points(partGeo, partMat);
    scene.add(particleField);

    // 8. Interactive Drag & Raycasting
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

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate) {
        globeGroup.rotation.y += 0.0032;
      }

      // Rotate orbital rings
      orbitalRing1.rotation.z = elapsedTime * 0.05;
      orbitalRing2.rotation.z = -elapsedTime * 0.04;

      // Animate data pulses along arcs
      pulseMeshes.forEach((pulse) => {
        const cIdx = pulse.userData.curveIndex;
        const curve = arcCurves[cIdx];
        if (curve) {
          const t = (elapsedTime * 0.35 + pulse.userData.offset) % 1.0;
          const pos = curve.getPoint(t);
          pulse.position.copy(pos);
        }
      });

      // Slowly rotate ambient particles
      particleField.rotation.y = elapsedTime * 0.015;

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
    };
  }, [onSelectNode]);

  return (
    <div className={`relative w-full h-[520px] select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hover Tooltip Overlay */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 rounded-xl glass-panel border border-cyan-400/60 shadow-2xl backdrop-blur-xl animate-in zoom-in-95"
          style={{ left: hoveredNode.x, top: hoveredNode.y }}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            {hoveredNode.name}
          </div>
          <div className="text-[11px] text-slate-300">{hoveredNode.country}</div>
          <div className="text-[11px] font-mono text-emerald-400 font-bold mt-0.5">
            Velocity: {hoveredNode.growth}
          </div>
        </div>
      )}

      {/* Telemetry Center HUD */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold glass-panel border border-cyan-500/30 text-cyan-300 shadow">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        TRENDIX CORE 3D TELEMETRY GLOBE
      </div>

      {/* Interaction Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full text-[11px] font-mono glass-panel text-slate-300 flex items-center gap-2 border border-cyan-500/30 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Interactive 3D Orbit • Drag to rotate • Click beacons to inspect
      </div>
    </div>
  );
};
