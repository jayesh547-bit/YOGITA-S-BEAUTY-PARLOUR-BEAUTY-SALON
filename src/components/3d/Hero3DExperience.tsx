"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Hero3DExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check mobile screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfff9f3, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfff9f3, 0.85);
    scene.add(ambientLight);

    // Warm Champagne Gold Key Light
    const keyLight = new THREE.DirectionalLight(0xc5a46d, 2.2);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    // Soft Blush Fill Light
    const fillLight = new THREE.DirectionalLight(0xf4dde2, 1.4);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    // Interactive Golden Point Light (Follows mouse subtly)
    const cursorLight = new THREE.PointLight(0xe8d3ab, 2.5, 12);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // Rim light from behind
    const rimLight = new THREE.PointLight(0xfff5ea, 1.8, 10);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Group for all floating objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- 1. LUXURY 3D PERFUME BOTTLE ---
    const perfumeGroup = new THREE.Group();

    // Bottle Glass Body (Rounded luxury fluted bottle)
    const bottleGeo = new THREE.CylinderGeometry(0.85, 0.95, 2.2, 48, 1);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.88,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      ior: 1.52,
      thickness: 1.4,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xc5a46d),
      envMapIntensity: 1.2,
    });
    const bottleMesh = new THREE.Mesh(bottleGeo, glassMat);
    perfumeGroup.add(bottleMesh);

    // Inner Liquid (Warm Rose-Gold Elixir)
    const liquidGeo = new THREE.CylinderGeometry(0.72, 0.82, 1.8, 32);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0xd9a4a8,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = -0.15;
    perfumeGroup.add(liquidMesh);

    // Gold Collar
    const collarGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.35, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc5a46d,
      roughness: 0.22,
      metalness: 0.88,
    });
    const collarMesh = new THREE.Mesh(collarGeo, goldMat);
    collarMesh.position.y = 1.25;
    perfumeGroup.add(collarMesh);

    // Crystal Octagonal Cap
    const capGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.65, 8);
    const capMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      roughness: 0.05,
      ior: 1.6,
      thickness: 1.2,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 1.7;
    perfumeGroup.add(capMesh);

    perfumeGroup.position.set(2.2, 0.1, 0.5);
    perfumeGroup.rotation.set(0.15, -0.4, 0.1);
    mainGroup.add(perfumeGroup);

    // --- 2. LUXURY COSMETIC CREAM JAR ---
    const jarGroup = new THREE.Group();

    // Jar Body (Frosted Blush Glass)
    const jarBodyGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.85, 48);
    const jarBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4dde2,
      transmission: 0.65,
      roughness: 0.25,
      thickness: 1.0,
      ior: 1.45,
    });
    const jarBodyMesh = new THREE.Mesh(jarBodyGeo, jarBodyMat);
    jarGroup.add(jarBodyMesh);

    // Jar Gold Mirror Lid
    const lidGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.35, 48);
    const lidMesh = new THREE.Mesh(lidGeo, goldMat);
    lidMesh.position.y = 0.55;
    jarGroup.add(lidMesh);

    jarGroup.position.set(-2.5, -1.1, 1.2);
    jarGroup.rotation.set(0.3, 0.5, -0.2);
    mainGroup.add(jarGroup);

    // --- 3. FLOATING SILK ROSE PETALS ---
    const petalCount = 22;
    const petals: {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      speed: number;
      rotSpeed: THREE.Vector3;
      phase: number;
    }[] = [];

    // Create realistic curved petal shape
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.3, 0.4, 0.35, 0.8);
    petalShape.quadraticCurveTo(0.2, 1.1, 0, 1.2);
    petalShape.quadraticCurveTo(-0.2, 1.1, -0.35, 0.8);
    petalShape.quadraticCurveTo(-0.3, 0.4, 0, 0);

    const petalGeo = new THREE.ShapeGeometry(petalShape, 12);
    // Add subtle curvature to petal vertices
    const posAttr = petalGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      posAttr.setZ(i, Math.sin((y / 1.2) * Math.PI) * 0.12);
    }
    petalGeo.computeVertexNormals();

    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf4dde2,
      roughness: 0.5,
      metalness: 0.05,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    });

    const petalMatGold = new THREE.MeshStandardMaterial({
      color: 0xe5c793,
      roughness: 0.35,
      metalness: 0.65,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    for (let i = 0; i < petalCount; i++) {
      const mesh = new THREE.Mesh(
        petalGeo,
        i % 4 === 0 ? petalMatGold : petalMat
      );
      const scale = 0.4 + Math.random() * 0.55;
      mesh.scale.set(scale, scale, scale);

      const basePos = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      );
      mesh.position.copy(basePos);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mainGroup.add(mesh);
      petals.push({
        mesh,
        basePos,
        speed: 0.008 + Math.random() * 0.015,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        phase: Math.random() * Math.PI * 2,
      });
    }

    // --- 4. FLOATING GOLD DUST PARTICLES ---
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0xc5a46d,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // --- MOUSE & PARALLAX TRACKING ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x;
      mouse.targetY = y;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Scroll tracking
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Cursor light movement
      cursorLight.position.x = mouse.x * 4;
      cursorLight.position.y = mouse.y * 3;

      // Group subtle parallax rotation
      mainGroup.rotation.y = mouse.x * 0.15;
      mainGroup.rotation.x = -mouse.y * 0.1;
      mainGroup.position.y = -scrollY * 0.0012;

      // Perfume Bottle floating & rotating
      perfumeGroup.position.y = 0.2 + Math.sin(elapsedTime * 0.8) * 0.18;
      perfumeGroup.rotation.y = -0.4 + Math.sin(elapsedTime * 0.5) * 0.25;
      perfumeGroup.rotation.z = 0.1 + Math.cos(elapsedTime * 0.6) * 0.05;

      // Cosmetic Jar floating
      jarGroup.position.y = -1.1 + Math.sin(elapsedTime * 0.9 + 1.5) * 0.15;
      jarGroup.rotation.y = 0.5 + Math.cos(elapsedTime * 0.4) * 0.2;

      // Petals aerodynamic fluttering
      petals.forEach((p) => {
        p.mesh.position.y =
          p.basePos.y + Math.sin(elapsedTime * 1.2 + p.phase) * 0.4;
        p.mesh.position.x =
          p.basePos.x + Math.cos(elapsedTime * 0.8 + p.phase) * 0.3;
        p.mesh.rotation.x += p.rotSpeed.x;
        p.mesh.rotation.y += p.rotSpeed.y;
        p.mesh.rotation.z += p.rotSpeed.z;
      });

      // Gold dust particles slow rotation
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", checkMobile);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-1000 ${
          webGLSupported ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* High-Performance Mobile / WebGL Fallback */}
      {(!webGLSupported || isMobile) && (
        <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-soft-light pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blush-200 via-gold-200 to-transparent blur-3xl animate-pulse-subtle" />
        </div>
      )}
    </div>
  );
}

