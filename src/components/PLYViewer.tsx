import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

// Global geometry cache - parsed geometries persist across mounts/tab switches
const geometryCache = new Map<string, THREE.BufferGeometry>();
const loadingPromises = new Map<string, Promise<THREE.BufferGeometry>>();

function loadPLY(url: string): Promise<THREE.BufferGeometry> {
  if (geometryCache.has(url)) {
    return Promise.resolve(geometryCache.get(url)!);
  }
  if (loadingPromises.has(url)) {
    return loadingPromises.get(url)!;
  }
  const promise = new Promise<THREE.BufferGeometry>((resolve) => {
    const loader = new PLYLoader();
    loader.load(url, (geo) => {
      geometryCache.set(url, geo);
      loadingPromises.delete(url);
      resolve(geo);
    });
  });
  loadingPromises.set(url, promise);
  return promise;
}

// Preload a model without rendering - call early to start fetching
export function preloadPLY(url: string) {
  loadPLY(url);
}

function PointCloud({ url, color = '#1a1a1a', initialRotation, spinSpeed = 1, scale = 1.05 }: { url: string; color?: string; initialRotation?: [number, number, number]; spinSpeed?: number; scale?: number }) {
  const ref = useRef<THREE.Points>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    setGeometry(null);
    loadPLY(url).then((geo) => {
      // Clone so transforms don't mutate the cached copy
      const clone = geo.clone();
      if (initialRotation) {
        clone.rotateX(initialRotation[0]);
        clone.rotateY(initialRotation[1]);
        clone.rotateZ(initialRotation[2]);
      }
      clone.center();
      clone.computeBoundingSphere();
      const s = scale / (clone.boundingSphere?.radius || 1);
      clone.scale(s, s, s);
      setGeometry(clone);
    });
  }, [url, initialRotation, scale]);

  const c = useMemo(() => new THREE.Color(color), [color]);

  // Adapt point size to vertex density - dense models need smaller dots
  const vertexCount = geometry?.attributes.position?.count || 20000;
  const densityScale = Math.min(1.0, 20000 / vertexCount);
  const adaptedSize = 1.2 * (0.3 + 0.7 * densityScale);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
      uniform float uSize;
      uniform float uPixelRatio;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        float sizeVariation = 0.7 + 0.6 * fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);
        gl_PointSize = uSize * uPixelRatio * sizeVariation * (3.0 / -mvPosition.z);
      }
    `,
        fragmentShader: `
      uniform vec3 uColor;
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        if (dot(center, center) > 0.25) discard;
        gl_FragColor = vec4(uColor, 0.6);
      }
    `,
        uniforms: {
          uSize: { value: adaptedSize },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uColor: { value: c },
        },
        transparent: true,
        depthWrite: false,
      }),
    [c, adaptedSize]
  );

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.012 * spinSpeed;
    }
  });

  if (!geometry) return null;

  return <points ref={ref} geometry={geometry} material={material} />;
}

interface PLYViewerProps {
  modelUrl: string;
  className?: string;
  color?: string;
  initialRotation?: [number, number, number];
  spinSpeed?: number;
  scale?: number;
}

export default function PLYViewer({ modelUrl, className, color, initialRotation, spinSpeed, scale }: PLYViewerProps) {
  return (
    <div className={`ply-viewer ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <PointCloud url={modelUrl} color={color} initialRotation={initialRotation} spinSpeed={spinSpeed} scale={scale} />
      </Canvas>
    </div>
  );
}
