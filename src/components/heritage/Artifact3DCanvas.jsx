import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const Artifact3DCanvas = ({
  artifact,
  isAutoRotating = true,
  isWireframe = false,
  lightingMode = 'day',
  resetTrigger = 0,
  onLoadStart,
  onLoadProgress,
  onLoadComplete,
  onError
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);
  const artifactGroupRef = useRef(null);
  const lightsGroupRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // transparent canvas to blend with parent background

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      artifact?.cameraConfig?.fov || 45,
      width / height,
      0.1,
      1000
    );
    const initialPos = artifact?.cameraConfig?.position || [0, 1.8, 5.0];
    camera.position.set(initialPos[0], initialPos[1], initialPos[2]);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent camera going under ground
    controls.minDistance = 1.5;
    controls.maxDistance = 12.0;
    controls.target.set(0, 0.8, 0);
    controls.update();
    controlsRef.current = controls;

    // 5. Lights setup group
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    setupLighting(lightsGroup, lightingMode);

    // 6. Artifact Group container
    const artifactGroup = new THREE.Group();
    scene.add(artifactGroup);
    artifactGroupRef.current = artifactGroup;

    // 7. Load model or create procedural fallback
    loadArtifactModel(artifact, artifactGroup);

    // 8. Animation loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update controls
      controls.update();

      // Auto rotation
      if (artifactGroupRef.current && isAutoRotating) {
        artifactGroupRef.current.rotation.y += delta * 0.35;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize listener
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 10. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      if (controls) controls.dispose();

      // Dispose scene objects
      if (scene) {
        scene.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      }
    };
  }, [artifact?.id]); // Re-mount when artifact changes

  // Update lighting mode
  useEffect(() => {
    if (lightsGroupRef.current) {
      setupLighting(lightsGroupRef.current, lightingMode);
    }
  }, [lightingMode]);

  // Toggle Wireframe
  useEffect(() => {
    if (!artifactGroupRef.current) return;
    artifactGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => (mat.wireframe = isWireframe));
        } else {
          child.material.wireframe = isWireframe;
        }
      }
    });
  }, [isWireframe]);

  // Handle Reset View trigger
  useEffect(() => {
    if (resetTrigger > 0 && cameraRef.current && controlsRef.current) {
      const initialPos = artifact?.cameraConfig?.position || [0, 1.8, 5.0];
      cameraRef.current.position.set(initialPos[0], initialPos[1], initialPos[2]);
      controlsRef.current.target.set(0, 0.8, 0);
      controlsRef.current.update();
      if (artifactGroupRef.current) {
        artifactGroupRef.current.rotation.set(0, 0, 0);
      }
    }
  }, [resetTrigger]);

  // Lighting configurations
  const setupLighting = (group, mode) => {
    // Clear old lights
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (mode === 'sunset') {
      const ambientLight = new THREE.AmbientLight(0xfdba74, 0.7);
      group.add(ambientLight);

      const mainSun = new THREE.DirectionalLight(0xf97316, 2.5);
      mainSun.position.set(6, 4, 5);
      mainSun.castShadow = true;
      group.add(mainSun);

      const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
      fillLight.position.set(-6, 2, -4);
      group.add(fillLight);
    } else if (mode === 'studio') {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      group.add(ambientLight);

      const spotLight = new THREE.SpotLight(0xfbbf24, 3.0, 20, Math.PI / 4, 0.3);
      spotLight.position.set(0, 7, 4);
      spotLight.castShadow = true;
      group.add(spotLight);

      const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.5);
      rimLight.position.set(-4, 3, -5);
      group.add(rimLight);
    } else {
      // Default: Day Light
      const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.8);
      group.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffedd5, 2.0);
      sunLight.position.set(5, 8, 5);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      group.add(sunLight);

      const bounceLight = new THREE.DirectionalLight(0xe0f2fe, 0.6);
      bounceLight.position.set(-4, -2, -3);
      group.add(bounceLight);
    }
  };

  // Model loading & procedural creation
  const loadArtifactModel = (artifactData, parentGroup) => {
    setIsLoading(true);
    setIsUsingFallback(false);
    setLoadError(null);
    if (onLoadStart) onLoadStart();

    // Clear previous children
    while (parentGroup.children.length > 0) {
      parentGroup.remove(parentGroup.children[0]);
    }

    // Try loading GLTF model
    if (artifactData?.modelPath) {
      const loader = new GLTFLoader();
      loader.load(
        artifactData.modelPath,
        (gltf) => {
          const model = gltf.scene;

          // Normalize model size and position
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.5 / (maxDim || 1);

          model.position.sub(center.multiplyScalar(scale));
          model.position.y += (size.y * scale) / 2;
          model.scale.set(scale, scale, scale);

          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          parentGroup.add(model);

          // Add subtle ground pedestal
          addPedestal(parentGroup, artifactData);

          setIsLoading(false);
          if (onLoadComplete) onLoadComplete();
        },
        (xhr) => {
          if (xhr.lengthComputable && onLoadProgress) {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            onLoadProgress(percent);
          }
        },
        (error) => {
          console.warn(
            `3D GLTF model not found or failed to load from "${artifactData.modelPath}". Rendering high-fidelity procedural heritage artifact fallback.`,
            error
          );
          setIsUsingFallback(true);
          setLoadError('3D model asset unavailable - displaying procedural model');

          // Render procedural fallback
          createProceduralArtifact(parentGroup, artifactData);
          setIsLoading(false);
          if (onError) onError(error);
          if (onLoadComplete) onLoadComplete();
        }
      );
    } else {
      createProceduralArtifact(parentGroup, artifactData);
      setIsLoading(false);
      setIsUsingFallback(true);
      if (onLoadComplete) onLoadComplete();
    }
  };

  // Add Stone Pedestal Platform
  const addPedestal = (parentGroup, artifactData) => {
    const pedestalGroup = new THREE.Group();

    // Base stone slab
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.25, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: artifactData?.colorPalette?.ground || '#292524',
      roughness: 0.85,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.125;
    baseMesh.receiveShadow = true;
    pedestalGroup.add(baseMesh);

    // Inner carved ring
    const ringGeo = new THREE.TorusGeometry(2.1, 0.05, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: artifactData?.colorPalette?.primary || '#d97706',
      roughness: 0.5,
      metalness: 0.3
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.01;
    pedestalGroup.add(ringMesh);

    parentGroup.add(pedestalGroup);
  };

  // Create authentic 3D Procedural Heritage Models
  const createProceduralArtifact = (parentGroup, artifactData) => {
    addPedestal(parentGroup, artifactData);

    const type = artifactData?.proceduralType || 'temple-wheel';
    const primaryColor = artifactData?.colorPalette?.primary || '#d97706';
    const secondaryColor = artifactData?.colorPalette?.secondary || '#78350f';
    const accentColor = artifactData?.colorPalette?.accent || '#fbbf24';

    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: primaryColor,
      roughness: 0.65,
      metalness: 0.15
    });

    const darkStoneMaterial = new THREE.MeshStandardMaterial({
      color: secondaryColor,
      roughness: 0.8,
      metalness: 0.1
    });

    const goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.3,
      metalness: 0.6
    });

    const artifactMeshGroup = new THREE.Group();

    if (type === 'temple-wheel') {
      // --- Konark Sun Temple Wheel ---
      // Outer Rim
      const outerRimGeo = new THREE.TorusGeometry(1.5, 0.18, 24, 64);
      const outerRim = new THREE.Mesh(outerRimGeo, stoneMaterial);
      outerRim.castShadow = true;
      artifactMeshGroup.add(outerRim);

      // Inner Hub
      const hubGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 32);
      hubGeo.rotateX(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, goldAccentMaterial);
      hub.castShadow = true;
      artifactMeshGroup.add(hub);

      // 8 Primary Carved Spokes
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const spokeGroup = new THREE.Group();

        const spokeGeo = new THREE.CylinderGeometry(0.06, 0.1, 1.3, 16);
        const spoke = new THREE.Mesh(spokeGeo, stoneMaterial);
        spoke.position.y = 0.75;
        spoke.castShadow = true;
        spokeGroup.add(spoke);

        // Medallion on spoke
        const orbGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const orb = new THREE.Mesh(orbGeo, goldAccentMaterial);
        orb.position.y = 0.75;
        spokeGroup.add(orb);

        spokeGroup.rotation.z = angle;
        artifactMeshGroup.add(spokeGroup);
      }

      // 8 Secondary Spokes
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + Math.PI / 8;
        const spokeGroup = new THREE.Group();

        const spokeGeo = new THREE.CylinderGeometry(0.03, 0.05, 1.25, 12);
        const spoke = new THREE.Mesh(spokeGeo, darkStoneMaterial);
        spoke.position.y = 0.7;
        spokeGroup.add(spoke);

        spokeGroup.rotation.z = angle;
        artifactMeshGroup.add(spokeGroup);
      }

      artifactMeshGroup.position.y = 1.6;
    } else if (type === 'lion-capital') {
      // --- Ashoka Lion Capital ---
      // Fluted Pillar Shaft Base
      const shaftGeo = new THREE.CylinderGeometry(0.45, 0.5, 1.0, 32);
      const shaft = new THREE.Mesh(shaftGeo, darkStoneMaterial);
      shaft.position.y = 0.5;
      shaft.castShadow = true;
      artifactMeshGroup.add(shaft);

      // Inverted Lotus Bell Capital
      const lotusGeo = new THREE.CylinderGeometry(0.65, 0.4, 0.6, 24);
      const lotus = new THREE.Mesh(lotusGeo, stoneMaterial);
      lotus.position.y = 1.3;
      lotus.castShadow = true;
      artifactMeshGroup.add(lotus);

      // Circular Abacus Drum
      const abacusGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.35, 32);
      const abacus = new THREE.Mesh(abacusGeo, stoneMaterial);
      abacus.position.y = 1.75;
      abacus.castShadow = true;
      artifactMeshGroup.add(abacus);

      // 4 Relief Chakras on Abacus
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const wheelGeo = new THREE.TorusGeometry(0.12, 0.02, 12, 24);
        const wheel = new THREE.Mesh(wheelGeo, goldAccentMaterial);
        wheel.position.x = Math.sin(angle) * 0.81;
        wheel.position.z = Math.cos(angle) * 0.81;
        wheel.position.y = 1.75;
        wheel.rotation.y = angle;
        artifactMeshGroup.add(wheel);
      }

      // 4 Lions Back-to-Back (Stylized sculpture forms)
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const lionGroup = new THREE.Group();

        // Lion Chest/Torso
        const torsoGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.65, 16);
        const torso = new THREE.Mesh(torsoGeo, stoneMaterial);
        torso.position.set(0, 2.25, 0.25);
        torso.castShadow = true;
        lionGroup.add(torso);

        // Lion Head & Mane
        const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
        const head = new THREE.Mesh(headGeo, goldAccentMaterial);
        head.position.set(0, 2.65, 0.3);
        head.scale.set(1, 1.1, 1.2);
        lionGroup.add(head);

        // Open Mouth
        const snoutGeo = new THREE.BoxGeometry(0.16, 0.12, 0.18);
        const snout = new THREE.Mesh(snoutGeo, stoneMaterial);
        snout.position.set(0, 2.6, 0.5);
        lionGroup.add(snout);

        lionGroup.rotation.y = angle;
        artifactMeshGroup.add(lionGroup);
      }
    } else if (type === 'taj-dome') {
      // --- Taj Mahal Onion Dome & Pavilion ---
      // Octagonal Base Pavilion
      const baseGeo = new THREE.CylinderGeometry(1.6, 1.7, 1.0, 8);
      const baseMesh = new THREE.Mesh(baseGeo, stoneMaterial);
      baseMesh.position.y = 0.5;
      baseMesh.castShadow = true;
      artifactMeshGroup.add(baseMesh);

      // Decorative Arch Entrances
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const archGeo = new THREE.BoxGeometry(0.7, 0.7, 0.1);
        const arch = new THREE.Mesh(archGeo, darkStoneMaterial);
        arch.position.set(Math.sin(angle) * 1.55, 0.5, Math.cos(angle) * 1.55);
        arch.rotation.y = angle;
        artifactMeshGroup.add(arch);
      }

      // Onion-shaped Central Dome (Lathe profile)
      const points = [];
      points.push(new THREE.Vector2(0, 1.0));
      points.push(new THREE.Vector2(1.2, 1.05));
      points.push(new THREE.Vector2(1.4, 1.4));
      points.push(new THREE.Vector2(1.3, 1.8));
      points.push(new THREE.Vector2(0.9, 2.2));
      points.push(new THREE.Vector2(0.3, 2.5));
      points.push(new THREE.Vector2(0.0, 2.7));

      const domeGeo = new THREE.LatheGeometry(points, 32);
      const domeMat = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.25,
        metalness: 0.1
      });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.castShadow = true;
      artifactMeshGroup.add(dome);

      // Lotus Crown & Brass Finial Spire
      const lotusCrown = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.4, 0.2, 16),
        goldAccentMaterial
      );
      lotusCrown.position.y = 2.75;
      artifactMeshGroup.add(lotusCrown);

      const finialSpire = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.6, 16),
        goldAccentMaterial
      );
      finialSpire.position.y = 3.15;
      artifactMeshGroup.add(finialSpire);

      // 4 Corner Minarets
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const minaretGroup = new THREE.Group();

        const towerGeo = new THREE.CylinderGeometry(0.12, 0.16, 2.2, 16);
        const tower = new THREE.Mesh(towerGeo, domeMat);
        tower.position.y = 1.1;
        tower.castShadow = true;
        minaretGroup.add(tower);

        const miniDome = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 16, 16),
          goldAccentMaterial
        );
        miniDome.position.y = 2.3;
        minaretGroup.add(miniDome);

        minaretGroup.position.set(Math.sin(angle) * 2.0, 0, Math.cos(angle) * 2.0);
        artifactMeshGroup.add(minaretGroup);
      }
    } else if (type === 'stone-chariot') {
      // --- Hampi Stone Chariot ---
      // Main Chariot Body
      const bodyGeo = new THREE.BoxGeometry(2.0, 1.1, 2.4);
      const body = new THREE.Mesh(bodyGeo, stoneMaterial);
      body.position.y = 0.85;
      body.castShadow = true;
      artifactMeshGroup.add(body);

      // Tiered Dravidian Roof Spire
      const roofGeo1 = new THREE.BoxGeometry(1.6, 0.5, 2.0);
      const roof1 = new THREE.Mesh(roofGeo1, darkStoneMaterial);
      roof1.position.y = 1.65;
      roof1.castShadow = true;
      artifactMeshGroup.add(roof1);

      const roofGeo2 = new THREE.BoxGeometry(1.1, 0.4, 1.4);
      const roof2 = new THREE.Mesh(roofGeo2, goldAccentMaterial);
      roof2.position.y = 2.05;
      roof2.castShadow = true;
      artifactMeshGroup.add(roof2);

      // 4 Large Stone Wheels
      const wheelPositions = [
        [-1.1, 0.45, 0.7],
        [1.1, 0.45, 0.7],
        [-1.1, 0.45, -0.7],
        [1.1, 0.45, -0.7]
      ];

      wheelPositions.forEach(([x, y, z]) => {
        const wheelGeo = new THREE.TorusGeometry(0.42, 0.1, 16, 32);
        const wheel = new THREE.Mesh(wheelGeo, darkStoneMaterial);
        wheel.rotation.y = Math.PI / 2;
        wheel.position.set(x, y, z);
        wheel.castShadow = true;
        artifactMeshGroup.add(wheel);

        const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16);
        hubGeo.rotateZ(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, goldAccentMaterial);
        hub.position.set(x, y, z);
        artifactMeshGroup.add(hub);
      });

      // Front Elephant Guards
      for (let i of [-0.5, 0.5]) {
        const elephantGeo = new THREE.BoxGeometry(0.35, 0.4, 0.6);
        const elephant = new THREE.Mesh(elephantGeo, darkStoneMaterial);
        elephant.position.set(i, 0.4, 1.4);
        artifactMeshGroup.add(elephant);
      }
    } else if (type === 'stupa') {
      // --- Great Stupa of Sanchi ---
      // Terrace Base (Medhi)
      const terraceGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.5, 32);
      const terrace = new THREE.Mesh(terraceGeo, darkStoneMaterial);
      terrace.position.y = 0.25;
      terrace.castShadow = true;
      artifactMeshGroup.add(terrace);

      // Main Hemispherical Dome (Anda)
      const domeGeo = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const dome = new THREE.Mesh(domeGeo, stoneMaterial);
      dome.position.y = 0.5;
      dome.castShadow = true;
      artifactMeshGroup.add(dome);

      // Square Harmika Box
      const harmikaGeo = new THREE.BoxGeometry(0.6, 0.35, 0.6);
      const harmika = new THREE.Mesh(harmikaGeo, darkStoneMaterial);
      harmika.position.y = 2.45;
      artifactMeshGroup.add(harmika);

      // Triple Chhatra Umbrellas
      for (let i = 0; i < 3; i++) {
        const umbrellaGeo = new THREE.CylinderGeometry(0.4 - i * 0.08, 0.4 - i * 0.08, 0.06, 16);
        const umbrella = new THREE.Mesh(umbrellaGeo, goldAccentMaterial);
        umbrella.position.y = 2.7 + i * 0.15;
        artifactMeshGroup.add(umbrella);
      }

      // 4 Torana Gateways at Cardinal Directions
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const toranaGroup = new THREE.Group();

        // 2 Pillars
        const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12), goldAccentMaterial);
        p1.position.set(-0.35, 0.6, 0);
        const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12), goldAccentMaterial);
        p2.position.set(0.35, 0.6, 0);
        toranaGroup.add(p1, p2);

        // 3 Horizontal Architraves
        for (let j = 0; j < 3; j++) {
          const architrave = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.08), stoneMaterial);
          architrave.position.set(0, 0.95 + j * 0.12, 0);
          toranaGroup.add(architrave);
        }

        toranaGroup.position.set(Math.sin(angle) * 2.5, 0, Math.cos(angle) * 2.5);
        toranaGroup.rotation.y = angle;
        artifactMeshGroup.add(toranaGroup);
      }
    } else if (type === 'bronze-sculpture') {
      // --- Nataraja Cosmic Dancer ---
      // Double Lotus Pedestal
      const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.4, 24);
      const pedestal = new THREE.Mesh(pedestalGeo, darkStoneMaterial);
      pedestal.position.y = 0.2;
      artifactMeshGroup.add(pedestal);

      // Flaming Halo Ring (Prabhamandala)
      const ringGeo = new THREE.TorusGeometry(1.4, 0.08, 16, 48);
      const ring = new THREE.Mesh(ringGeo, goldAccentMaterial);
      ring.position.y = 1.6;
      artifactMeshGroup.add(ring);

      // Flames along halo
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        const flameGeo = new THREE.ConeGeometry(0.06, 0.18, 8);
        const flame = new THREE.Mesh(flameGeo, stoneMaterial);
        flame.position.set(Math.sin(angle) * 1.45, 1.6 + Math.cos(angle) * 1.45, 0);
        flame.rotation.z = -angle;
        artifactMeshGroup.add(flame);
      }

      // Nataraja Central Figure Posture
      const bodyGroup = new THREE.Group();

      // Torso
      const torsoGeo = new THREE.CylinderGeometry(0.2, 0.14, 0.7, 16);
      const torso = new THREE.Mesh(torsoGeo, stoneMaterial);
      torso.position.y = 1.6;
      bodyGroup.add(torso);

      // Head with Crown
      const headGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const head = new THREE.Mesh(headGeo, goldAccentMaterial);
      head.position.y = 2.05;
      bodyGroup.add(head);

      // 4 Arms
      const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 12);

      const rightUpper = new THREE.Mesh(armGeo, stoneMaterial);
      rightUpper.position.set(0.35, 1.8, 0);
      rightUpper.rotation.z = -Math.PI / 4;

      const leftUpper = new THREE.Mesh(armGeo, stoneMaterial);
      leftUpper.position.set(-0.35, 1.8, 0);
      leftUpper.rotation.z = Math.PI / 4;

      const rightLower = new THREE.Mesh(armGeo, goldAccentMaterial);
      rightLower.position.set(0.3, 1.5, 0.15);
      rightLower.rotation.z = -Math.PI / 6;

      const leftLower = new THREE.Mesh(armGeo, goldAccentMaterial);
      leftLower.position.set(-0.25, 1.45, 0.1);
      leftLower.rotation.z = Math.PI / 3;

      bodyGroup.add(rightUpper, leftUpper, rightLower, leftLower);

      // Raised Dancing Leg & Standing Leg
      const legGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.65, 12);
      const standingLeg = new THREE.Mesh(legGeo, stoneMaterial);
      standingLeg.position.set(0.08, 1.05, 0);

      const raisedLeg = new THREE.Mesh(legGeo, goldAccentMaterial);
      raisedLeg.position.set(-0.25, 1.25, 0.2);
      raisedLeg.rotation.z = Math.PI / 3;

      bodyGroup.add(standingLeg, raisedLeg);

      // Apasmara Demon underfoot
      const demonGeo = new THREE.BoxGeometry(0.4, 0.15, 0.25);
      const demon = new THREE.Mesh(demonGeo, darkStoneMaterial);
      demon.position.set(0, 0.48, 0);
      bodyGroup.add(demon);

      artifactMeshGroup.add(bodyGroup);
    }

    parentGroup.add(artifactMeshGroup);
  };

  return (
    <div className="relative w-full h-full min-h-[350px] sm:min-h-[450px] rounded-xl overflow-hidden">
      {/* ThreeJS WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center text-white z-20 transition-opacity duration-300">
          <div className="w-14 h-14 border-4 border-saffron-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-display text-lg font-medium text-saffron-100 animate-pulse">
            Loading 3D Heritage Artifact...
          </p>
        </div>
      )}

      {/* Fallback Info Badge */}
      {isUsingFallback && !isLoading && (
        <div className="absolute top-3 left-3 bg-amber-950/80 backdrop-blur-md text-amber-200 border border-amber-500/30 text-xs px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg z-10">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Interactive Procedural 3D Geometry Mode</span>
        </div>
      )}
    </div>
  );
};
