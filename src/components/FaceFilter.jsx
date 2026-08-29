import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// This component relies on Jeeliz scripts loaded globally via index.html:
// - window.JEEFACEFILTERAPI
// - window.JeelizThreeHelper

const FaceFilter = () => {
  const canvasRef = useRef(null);
  const filterMeshRef = useRef(null);
  const threeStuffsRef = useRef(null);
  const detectionSmootherRef = useRef(0); // for smooth fade-in/out

  useEffect(() => {
    const start = () => {
      if (!window.JEEFACEFILTERAPI || !window.JeelizThreeHelper) {
        console.error('Jeeliz scripts not loaded. Ensure jeelizFaceFilter.js and JeelizThreeHelper.js are included in index.html');
        return;
      }

      window.JEEFACEFILTERAPI.init({
        canvasId: 'jeeFaceFilterCanvas',
        NNCpath: '/neuralNets/',
        followZRot: true,
        callbackReady: (errCode, spec) => {
          if (errCode) {
            console.error('JEEFACEFILTERAPI init error:', errCode);
            return;
          }
          initThreeScene(spec);
        },
        callbackTrack: (detectState) => {
          if (!threeStuffsRef.current) return;

          const detection = Math.max(0, Math.min(1, detectState.detected));
          detectionSmootherRef.current = detectionSmootherRef.current * 0.9 + detection * 0.1;

          if (filterMeshRef.current) {
            const isVisible = detectionSmootherRef.current > 0.3;
            filterMeshRef.current.visible = isVisible;
            if (isVisible) {
              const material = filterMeshRef.current.material;
              material.opacity = Math.min(1, Math.max(0, (detectionSmootherRef.current - 0.3) / 0.7));
            }
          }

          window.JeelizThreeHelper.render(detectState, threeStuffsRef.current.camera);
        },
      });
    };

    const initThreeScene = (spec) => {
      const threeStuffs = window.JeelizThreeHelper.init(spec, null);
      threeStuffsRef.current = threeStuffs;

      const faceObject = window.JeelizThreeHelper.create_faceFollower();
      threeStuffs.scene.add(faceObject);

      const loader = new THREE.TextureLoader();
      loader.load(
        '/assets/filters/turban.png',
        (texture) => {
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });

          // Base geometry; we'll scale it relative to face size automatically handled by helper
          const geometry = new THREE.PlaneGeometry(1.8, 1.0);
          const mesh = new THREE.Mesh(geometry, material);
          // Position above eyes: adjust Y to sit like a turban
          mesh.position.set(0, 0.9, 0);
          mesh.frustumCulled = false;

          filterMeshRef.current = mesh;
          faceObject.add(mesh);
        },
        undefined,
        (err) => {
          console.error('Failed to load filter texture', err);
        }
      );

      // Ensure renderer is transparent and canvas fills viewport
      threeStuffs.renderer.setClearColor(0x000000, 0);
      onResize();
      window.addEventListener('resize', onResize);

      function onResize() {
        const canvas = canvasRef.current;
        if (!canvas || !threeStuffs || !threeStuffs.camera) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        threeStuffs.renderer.setSize(width, height, false);
        threeStuffs.camera.aspect = width / height;
        threeStuffs.camera.updateProjectionMatrix();
      }
    };

    start();

    return () => {
      try {
        window.removeEventListener('resize', () => {});
        if (window.JEEFACEFILTERAPI) {
          window.JEEFACEFILTERAPI.destroy();
        }
      } catch (e) {
        // noop
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: 'transparent' }}>
      <canvas
        id="jeeFaceFilterCanvas"
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent' }}
      />
    </div>
  );
};

export default FaceFilter;


