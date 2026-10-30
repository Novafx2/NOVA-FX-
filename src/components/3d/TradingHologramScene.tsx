import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const TradingHologramScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<{ pair: string; price: string; flow: string } | null>({
    pair: 'XAU/USD',
    price: '$2,748.65',
    flow: '+18.4 Pips Bullish Inflow',
  });
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software-WebGL Guard (Three.js skill directive)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 2. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050914, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    container.appendChild(renderer.domElement);

    // 3. Studio PBR Lighting
    const keyLight = new THREE.DirectionalLight(0x087bff, 3.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d9ff, 2.0);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0x00d9ff, 0x050914, 1.2);
    scene.add(hemiLight);

    const pointLight = new THREE.PointLight(0x00e59b, 2.5, 8);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 4. Composite 3D Procedural Model: Holographic Liquidity Matrix (Group)
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Part 1: Central Core Crystal (Faceted Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x087bff,
      emissive: 0x052a66,
      roughness: 0.15,
      metalness: 0.9,
      transmission: 0.6,
      thickness: 1.2,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Part 2: Inner Pulsing Energy Core
    const innerGeo = new THREE.SphereGeometry(0.65, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      wireframe: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    masterGroup.add(innerMesh);

    // Part 3: Gyroscopic Orbital Rings (3 Concentric Rings)
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0x003366,
    });
    const ringGeo1 = new THREE.TorusGeometry(1.85, 0.03, 16, 100);
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    masterGroup.add(ringMesh1);

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x087bff,
      metalness: 0.9,
      roughness: 0.3,
    });
    const ringGeo2 = new THREE.TorusGeometry(2.3, 0.025, 16, 100);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    masterGroup.add(ringMesh2);

    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0x00e59b,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x002415,
    });
    const ringGeo3 = new THREE.TorusGeometry(2.75, 0.02, 16, 100);
    const ringMesh3 = new THREE.Mesh(ringGeo3, ringMat3);
    ringMesh3.rotation.z = Math.PI / 5;
    masterGroup.add(ringMesh3);

    // Part 4: Floating 3D Candlestick Price Arch
    const candleGroup = new THREE.Group();
    masterGroup.add(candleGroup);

    const candleCount = 14;
    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x00e59b,
      emissive: 0x005530,
      metalness: 0.6,
      roughness: 0.2,
    });
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xff3b69,
      emissive: 0x550a1a,
      metalness: 0.6,
      roughness: 0.2,
    });
    const wickMat = new THREE.MeshStandardMaterial({
      color: 0xaab5c5,
      metalness: 0.9,
      roughness: 0.1,
    });

    const candleBoxes: THREE.Mesh[] = [];
    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 1.5 - Math.PI * 0.75;
      const radius = 3.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const isGreen = i % 3 !== 1;
      const height = 0.3 + Math.abs(Math.sin(i * 1.3)) * 0.7;
      const y = Math.sin(i * 0.6) * 0.6;

      const bodyGeo = new THREE.BoxGeometry(0.18, height, 0.18);
      const bodyMesh = new THREE.Mesh(bodyGeo, isGreen ? greenMat : redMat);
      bodyMesh.position.set(x, y, z);
      bodyMesh.lookAt(0, y, 0);

      const wickHeight = height + 0.5;
      const wickGeo = new THREE.CylinderGeometry(0.015, 0.015, wickHeight, 8);
      const wickMesh = new THREE.Mesh(wickGeo, wickMat);
      wickMesh.position.set(x, y, z);

      candleGroup.add(bodyMesh);
      candleGroup.add(wickMesh);
      candleBoxes.push(bodyMesh);
    }

    // Part 5: Procedural Floating Data Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const pRadius = 1.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = pRadius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = pRadius * Math.sin(phi);
      positions[i * 3 + 2] = pRadius * Math.sin(theta) * Math.cos(phi);

      const isCyan = Math.random() > 0.4;
      colors[i * 3] = isCyan ? 0.0 : 0.03;
      colors[i * 3 + 1] = isCyan ? 0.85 : 0.48;
      colors[i * 3 + 2] = 1.0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleSystem);

    // 5. Mouse Parallax and Damped Rotation Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = mouseX * 0.6;
      targetRotationX = mouseY * 0.4;
    };

    container.addEventListener('mousemove', onMouseMove);

    // 6. Animation Loop with Clock & Exponential Damping
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Continuous harmonic rotation
      if (isRotating) {
        masterGroup.rotation.y += delta * 0.35;
      }

      // Orbital gimbal counter rotations
      ringMesh1.rotation.x += delta * 0.2;
      ringMesh1.rotation.y += delta * 0.3;
      ringMesh2.rotation.y -= delta * 0.25;
      ringMesh2.rotation.z += delta * 0.15;
      ringMesh3.rotation.z += delta * 0.4;

      // Pulsing central node
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.06;
      coreMesh.scale.set(pulse, pulse, pulse);
      innerMesh.rotation.y -= delta * 0.5;

      // Candlestick breathing
      candleBoxes.forEach((candle, idx) => {
        const floatOffset = Math.sin(elapsedTime * 2 + idx * 0.5) * 0.08;
        candle.position.y += floatOffset * delta;
      });

      // Mouse Parallax Damping: smooth camera / master group
      const dampingFactor = 1 - Math.exp(-5 * delta);
      masterGroup.rotation.x += (targetRotationX - masterGroup.rotation.x) * dampingFactor;
      camera.position.x += (mouseX * 0.5 - camera.position.x) * dampingFactor;
      camera.position.y += (2.5 + mouseY * 0.5 - camera.position.y) * dampingFactor;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // 8. Cleanup & Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      greenMat.dispose();
      redMat.dispose();
      wickMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [isRotating]);

  return (
    <div className="relative w-full h-[460px] lg:h-[540px] flex items-center justify-center select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Holographic HUD Controls (<= 15% viewport footprint per Three.js skill) */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#0A1224]/90 border border-[#087BFF]/30 text-white hover:border-[#00D9FF] hover:bg-[#087BFF]/20 transition-all flex items-center gap-1.5"
          title="Toggle 3D Rotation"
        >
          <span className={`w-2 h-2 rounded-full ${isRotating ? 'bg-[#00E59B] animate-pulse' : 'bg-gray-400'}`} />
          {isRotating ? 'ORBIT ACTIVE' : 'PAUSED'}
        </button>
      </div>

      {/* Interactive Hologram Telemetry Card */}
      {activeNode && (
        <div className="absolute bottom-4 left-4 z-20 p-3.5 rounded-xl bg-[#0A1224]/90 border border-[#087BFF]/40 shadow-xl shadow-[#087BFF]/10 max-w-xs">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-heading font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-ping" />
              {activeNode.pair}
            </span>
            <span className="font-mono text-[#00E59B] font-semibold">{activeNode.price}</span>
          </div>
          <div className="text-[11px] text-[#AAB5C5] mt-1 font-mono">{activeNode.flow}</div>
          <div className="w-full bg-[#050914] rounded-full h-1 mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-[#087BFF] to-[#00E59B] h-full w-[78%] animate-pulse" />
          </div>
        </div>
      )}

      {/* Futuristic Background Glow Gradient Ring */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-72 h-72 rounded-full bg-[#087BFF]/10 blur-3xl" />
        <div className="w-48 h-48 rounded-full bg-[#00D9FF]/10 blur-2xl" />
      </div>
    </div>
  );
};
