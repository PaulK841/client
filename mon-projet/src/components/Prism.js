import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.3;
    
    // Fond noir par défaut
    vec3 color = vec3(0.0, 0.0, 0.0);
    
    // Créer plusieurs vagues fines
    float wave1 = uv.y + sin(uv.x * 6.0 + time * 2.0) * 0.05;
    float wave2 = uv.y + sin(uv.x * 8.0 - time * 1.5) * 0.03 + 0.2;
    float wave3 = uv.y + sin(uv.x * 4.0 + time * 1.8) * 0.04 + 0.4;
    float wave4 = uv.y + sin(uv.x * 10.0 - time * 2.2) * 0.02 + 0.6;
    float wave5 = uv.y + sin(uv.x * 5.0 + time * 1.3) * 0.06 + 0.8;
    
    // Ajouter du bruit subtil pour les rendre organiques
    float noise = snoise(vec3(uv.x * 3.0, uv.y * 2.0, time * 0.5)) * 0.02;
    
    // Couleur des lignes violettes
    vec3 lineColor = vec3(0.6, 0.3, 1.0);
    
    // Épaisseur des lignes très fine
    float lineWidth = 0.003;
    
    // Créer les lignes fines
    float line1 = 1.0 - smoothstep(0.0, lineWidth, abs(wave1 - uv.y + noise));
    float line2 = 1.0 - smoothstep(0.0, lineWidth, abs(wave2 - uv.y + noise * 0.5));
    float line3 = 1.0 - smoothstep(0.0, lineWidth, abs(wave3 - uv.y + noise * 0.7));
    float line4 = 1.0 - smoothstep(0.0, lineWidth, abs(wave4 - uv.y + noise * 0.3));
    float line5 = 1.0 - smoothstep(0.0, lineWidth, abs(wave5 - uv.y + noise * 0.8));
    
    // Combiner toutes les lignes
    float allLines = max(max(max(max(line1, line2), line3), line4), line5);
    
    // Ajouter un léger effet de lueur aux lignes
    float glow = 0.0;
    glow += (1.0 - smoothstep(0.0, lineWidth * 3.0, abs(wave1 - uv.y + noise))) * 0.3;
    glow += (1.0 - smoothstep(0.0, lineWidth * 3.0, abs(wave2 - uv.y + noise * 0.5))) * 0.2;
    glow += (1.0 - smoothstep(0.0, lineWidth * 3.0, abs(wave3 - uv.y + noise * 0.7))) * 0.25;
    glow += (1.0 - smoothstep(0.0, lineWidth * 3.0, abs(wave4 - uv.y + noise * 0.3))) * 0.15;
    glow += (1.0 - smoothstep(0.0, lineWidth * 3.0, abs(wave5 - uv.y + noise * 0.8))) * 0.3;
    
    // Mélanger les lignes avec le fond noir
    color = mix(color, lineColor, allLines);
    
    // Ajouter la lueur subtile
    color += lineColor * glow * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const ShaderPlane = () => {
    const materialRef = useRef();
    
    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    return (
        <mesh>
            <planeGeometry args={[10, 10, 1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                }}
            />
        </mesh>
    );
};

const Prism = () => {
    return (
        <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
            <ShaderPlane />
        </Canvas>
    );
};

export default Prism;
