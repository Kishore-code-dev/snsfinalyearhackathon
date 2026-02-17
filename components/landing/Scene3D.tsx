"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function NetworkGlobe() {
    const ref = useRef<THREE.Points>(null!);

    const count = 5000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const radius = 6;

        for (let i = 0; i < count; i++) {
            // Distribute points on a sphere surface for a globe effect
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            // Add some noise to make it feel organic/living
            const r = radius + (Math.random() - 0.5) * 0.5;

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            // Slow rotation
            ref.current.rotation.y += delta / 15;
            // Subtle breathing
            // ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 6]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#22d3ee" // Neo Cyan base
                    size={0.025}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}

function FloatingParticles() {
    const ref = useRef<THREE.Points>(null!);
    const count = 1000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 50;
            ref.current.rotation.y -= delta / 60;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#a855f7" // Electric Purple
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.3}
            />
        </Points>
    )
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full bg-[#020005]">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <NetworkGlobe />
                <FloatingParticles />
            </Canvas>
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020005]/80 via-transparent to-[#020005] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020005]/50 to-[#020005] z-10 pointer-events-none" />
        </div>
    )
}
