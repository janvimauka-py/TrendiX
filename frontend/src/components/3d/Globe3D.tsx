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
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 210;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner Core Sphere
    const sphereGeo = new THREE.SphereGeometry(75, 48, 48);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x080D1C,
      transparent: true,
      opacity: 0.9,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(coreSphere);

    // Wireframe Outer Mesh (Latitude & Longitude grid)
    const wireGeo = new THREE.SphereGeometry(75.5, 32, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1E3A8A,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireSphere);

    // Atmosphere Glow Rim
    const glowGeo = new THREE.SphereGeometry(79, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x397BFF,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // Convert lat/long to 3D Vector
    const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 3. Surface Dot Matrix (Continents simulation)
    const dotPoints: number[] = [];
    const colors: number[] = [];
    for (let lat = -80; lat <= 80; lat += 4.5) {
      const radiusAtLat = Math.cos((lat * Math.PI) / 180);
      const numLong = Math.max(12, Math.floor(64 * radiusAtLat));
      for (let i = 0; i < numLong; i++) {
        const lon = (i / numLong) * 360 - 180;
        // Pseudo landmass masking filter
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
          // Neon cyan & blue accent dots
          if (isLand) {
            colors.push(0.15, 0.5, 0.95);
          } else {
            colors.push(0.08, 0.25, 0.5);
          }
        }
      }
    }

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotPoints, 3));
    dotGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const dotMaterial = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const dotMesh = new THREE.Points(dotGeometry, dotMaterial);
    globeGroup.add(dotMesh);

    // 4. Trending Hotspot Nodes (Interactive Cities)
    const hotspots = [
      { name: 'Local AI Silicon', country: 'San Francisco, US', lat: 37.77, lon: -122.41, growth: '+142%', color: 0x27D8F2 },
      { name: 'Quick Commerce Logistics', country: 'Bengaluru, IN', lat: 12.97, lon: 77.59, growth: '+215%', color: 0x8855FF },
      { name: 'Circular Tech Apparel', country: 'London, UK', lat: 51.50, lon: -0.12, growth: '-34%', color: 0x397BFF },
      { name: 'Home Battery CleanTech', country: 'Berlin, DE', lat: 52.52, lon: 13.40, growth: '+118%', color: 0x27D8F2 },
      { name: 'Titanium Smart Rings', country: 'Tokyo, JP', lat: 35.67, lon: 139.65, growth: '+86%', color: 0x8855FF },
      { name: 'GaN Modular Fast Power', country: 'Shenzhen, CN', lat: 22.54, lon: 114.05, growth: '+72%', color: 0x397BFF },
    ];

    const hotspotMeshes: THREE.Mesh[] = [];
    hotspots.forEach((spot) => {
      const pos = latLongToVector3(spot.lat, spot.lon, 77.5);
      // Hotspot core
      const nodeGeo = new THREE.SphereGeometry(1.8, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: spot.color });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = spot;
      globeGroup.add(nodeMesh);
      hotspotMeshes.push(nodeMesh);

      // Pulsing Ring around hotspot
      const ringGeo = new THREE.RingGeometry(2.4, 3.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);
    });

    // 5. Glowing Connecting Data Arcs (Arcs between major trend hubs)
    const createArc = (v1: THREE.Vector3, v2: THREE.Vector3, color: number) => {
      const distance = v1.distanceTo(v2);
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const midLength = mid.length();
      // Push mid-point outward for arc curvature
      mid.normalize().multiplyScalar(midLength + distance * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(36);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.55,
      });
      return new THREE.Line(arcGeo, arcMat);
    };

    const sf = latLongToVector3(37.77, -122.41, 77);
    const lon = latLongToVector3(51.50, -0.12, 77);
    const blr = latLongToVector3(12.97, 77.59, 77);
    const tyo = latLongToVector3(35.67, 139.65, 77);
    const ber = latLongToVector3(52.52, 13.40, 77);

    globeGroup.add(createArc(sf, lon, 0x397BFF));
    globeGroup.add(createArc(lon, blr, 0x8855FF));
    globeGroup.add(createArc(blr, tyo, 0x27D8F2));
    globeGroup.add(createArc(ber, sf, 0x27D8F2));

    // 6. Floating Ambient Particle Field
    const particleCount = 200;
    const partGeo = new THREE.BufferGeometry();
    const partPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      partPositions[i] = (Math.random() - 0.5) * 350;
      partPositions[i + 1] = (Math.random() - 0.5) * 350;
      partPositions[i + 2] = (Math.random() - 0.5) * 350;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x397BFF,
      size: 1.2,
      transparent: true,
      opacity: 0.45,
    });
    const particleField = new THREE.Points(partGeo, partMat);
    scene.add(particleField);

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
        // Hover Raycast
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

      // Rotate ambient particle dust slowly
      particleField.rotation.y = elapsedTime * 0.02;
      particleField.rotation.x = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 600;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
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

      {/* Tooltip Overlay */}
      {hoveredNode && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-lg glass-panel border border-cyan-400/40 shadow-xl"
          style={{ left: hoveredNode.x, top: hoveredNode.y }}
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            {hoveredNode.name}
          </div>
          <div className="text-[11px] text-slate-300">{hoveredNode.country}</div>
          <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
            Velocity: {hoveredNode.growth}
          </div>
        </div>
      )}

      {/* Interaction Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] glass-panel text-slate-400 flex items-center gap-2 border border-blue-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Interactive 3D Telemetry • Click hotspots to filter
      </div>
    </div>
  );
};
