"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import { Hand, X, ScanFace, Target, Zap, Activity, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// ── Global MediaPipe Types ──────────────────────────────────────────────────
declare global {
    interface Window {
        Hands: any;
        drawConnectors: any;
        drawLandmarks: any;
        HAND_CONNECTIONS: any;
    }
}

// ── Types ───────────────────────────────────────────────────────────────────
interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    life: number; color: string; size: number;
}

interface GestureState {
    isPinching: boolean;
    isPointing: boolean;
    isFist: boolean;
    isOpen: boolean;
    fingerCount: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const dist2D = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── Component ────────────────────────────────────────────────────────────────
export default function VisualMouseLayer() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const previewRef = useRef<HTMLCanvasElement>(null);   // mini HUD preview
    const trailRef = useRef<HTMLCanvasElement>(null);   // fullscreen trail
    const cursorRef = useRef<HTMLDivElement>(null);
    const dwellRef = useRef<HTMLDivElement>(null);      // dwell ring

    // ── State ──────────────────────────────────────────────────────────────
    const [isActive, setIsActive] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [gesture, setGesture] = useState<GestureState>({
        isPinching: false, isPointing: false, isFist: false, isOpen: false, fingerCount: 0
    });
    const [fps, setFps] = useState(0);
    const [sensitivity, setSensitivity] = useState(1.0);

    // ── Refs (avoid stale closures) ────────────────────────────────────────
    const handsRef = useRef<any>(null);
    const rafRef = useRef<number | null>(null);
    const camRafRef = useRef<number>(0);
    const lastSeenRef = useRef(0);
    const posRef = useRef({ x: -300, y: -300 });
    const targetRef = useRef({ x: -300, y: -300 });
    const velRef = useRef({ x: 0, y: 0 });
    const lastPinchRef = useRef(false);
    const pinchStartRef = useRef(0);
    const particlesRef = useRef<Particle[]>([]);
    const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dwellPosRef = useRef({ x: -1, y: -1 });
    const dwellProgressRef = useRef(0);
    const fpsCountRef = useRef({ frames: 0, last: Date.now() });
    const gestureRef = useRef(gesture);
    const sensitivityRef = useRef(sensitivity);

    useEffect(() => { gestureRef.current = gesture; }, [gesture]);
    useEffect(() => { sensitivityRef.current = sensitivity; }, [sensitivity]);

    // ── Particle Engine ────────────────────────────────────────────────────
    const addParticle = (x: number, y: number, color: string, size = 2, vScale = 1) => {
        particlesRef.current.push({
            x, y,
            vx: (Math.random() - 0.5) * 4 * vScale,
            vy: (Math.random() - 0.5) * 4 * vScale,
            life: 1.0, color, size: Math.random() * size + 1,
        });
    };

    const spawnBurst = (x: number, y: number, color = '#00ff9d', count = 16) => {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = Math.random() * 8 + 3;
            particlesRef.current.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0, color,
                size: Math.random() * 5 + 2,
            });
        }
    };

    const renderParticles = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
        for (const p of particlesRef.current) {
            p.x += p.vx; p.y += p.vy;
            p.vx *= 0.96; p.vy *= 0.96;
            p.life -= 0.028;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10; ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    };

    // ── DOM Ripple ─────────────────────────────────────────────────────────
    const spawnRipple = (x: number, y: number, color = '#00ff9d') => {
        const el = document.createElement('div');
        el.style.cssText = `
            position:fixed;left:${x}px;top:${y}px;
            width:12px;height:12px;border-radius:50%;
            border:2px solid ${color};
            transform:translate(-50%,-50%) scale(0);
            opacity:1;pointer-events:none;z-index:999998;
            transition:transform 0.55s cubic-bezier(0.2,0,0,1),opacity 0.55s ease-out;
        `;
        document.body.appendChild(el);
        requestAnimationFrame(() => {
            el.style.transform = 'translate(-50%,-50%) scale(6)';
            el.style.opacity = '0';
        });
        setTimeout(() => el.remove(), 580);
    };

    // ── Gesture Classifier ─────────────────────────────────────────────────
    const classifyGesture = (lm: any[]): GestureState => {
        const tip = [lm[8], lm[12], lm[16], lm[20]]; // finger tips
        const pip = [lm[6], lm[10], lm[14], lm[18]]; // PIP joints
        const thumb = lm[4]; const thumbBase = lm[2];

        const extended = tip.map((t, i) => t.y < pip[i].y);
        const fingerCount = extended.filter(Boolean).length + (dist2D(thumb, thumbBase) > 0.08 ? 1 : 0);
        const pinchDist = dist2D(lm[8], lm[4]);

        return {
            isPinching: pinchDist < 0.05,
            isPointing: extended[0] && !extended[1] && !extended[2] && !extended[3],
            isFist: fingerCount <= 1,
            isOpen: fingerCount >= 4,
            fingerCount,
        };
    };

    // ── Click Dispatcher ───────────────────────────────────────────────────
    const fireClick = useCallback((x: number, y: number, type: string) => {
        const el = document.elementFromPoint(x, y);
        if (!el) return;
        el.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true, clientX: x, clientY: y }));
        if (type === 'click' && el instanceof HTMLElement) { el.click(); el.focus(); }
    }, []);

    // ── Dwell-to-Click ─────────────────────────────────────────────────────
    const startDwell = (x: number, y: number) => {
        const DWELL_MS = 1200;
        const MOVE_THRESHOLD = 30;

        if (Math.hypot(x - dwellPosRef.current.x, y - dwellPosRef.current.y) > MOVE_THRESHOLD) {
            dwellPosRef.current = { x, y };
            dwellProgressRef.current = 0;
            if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
        }

        if (!dwellTimerRef.current) {
            const start = Date.now();
            const tick = () => {
                dwellProgressRef.current = Math.min(1, (Date.now() - start) / DWELL_MS);
                if (dwellProgressRef.current >= 1) {
                    fireClick(dwellPosRef.current.x, dwellPosRef.current.y, 'click');
                    spawnBurst(dwellPosRef.current.x, dwellPosRef.current.y, '#facc15', 12);
                    spawnRipple(dwellPosRef.current.x, dwellPosRef.current.y, '#facc15');
                    dwellProgressRef.current = 0;
                    dwellTimerRef.current = null;
                } else {
                    dwellTimerRef.current = setTimeout(tick, 16);
                }
            };
            dwellTimerRef.current = setTimeout(tick, 16);
        }
    };

    const cancelDwell = () => {
        if (dwellTimerRef.current) { clearTimeout(dwellTimerRef.current); dwellTimerRef.current = null; }
        dwellProgressRef.current = 0;
    };

    // ── MediaPipe Results ──────────────────────────────────────────────────
    const onResults = useCallback((results: any) => {
        // FPS counter
        fpsCountRef.current.frames++;
        const now = Date.now();
        if (now - fpsCountRef.current.last >= 1000) {
            setFps(fpsCountRef.current.frames);
            fpsCountRef.current = { frames: 0, last: now };
        }

        // Draw preview canvas
        if (previewRef.current && results.image) {
            const ctx = previewRef.current.getContext('2d');
            if (ctx) {
                ctx.save();
                ctx.clearRect(0, 0, previewRef.current.width, previewRef.current.height);
                ctx.scale(-1, 1);
                ctx.translate(-previewRef.current.width, 0);
                ctx.drawImage(results.image, 0, 0, previewRef.current.width, previewRef.current.height);
                if (window.drawConnectors && results.multiHandLandmarks) {
                    for (const lm of results.multiHandLandmarks) {
                        window.drawConnectors(ctx, lm, window.HAND_CONNECTIONS, { color: '#22d3ee', lineWidth: 2 });
                        window.drawLandmarks(ctx, lm, { color: '#00ff9d', lineWidth: 1, radius: 2 });
                    }
                }
                ctx.restore();
            }
        }

        if (results.multiHandLandmarks?.length > 0) {
            setIsTracking(true);
            lastSeenRef.current = now;

            const lm = results.multiHandLandmarks[0];
            const tip = lm[8]; // Index fingertip

            const rawX = (1 - tip.x) * window.innerWidth;
            const rawY = tip.y * window.innerHeight;

            // Apply sensitivity scaling from screen center
            const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
            const sx = cx + (rawX - cx) * sensitivityRef.current;
            const sy = cy + (rawY - cy) * sensitivityRef.current;

            targetRef.current = {
                x: Math.max(0, Math.min(window.innerWidth, sx)),
                y: Math.max(0, Math.min(window.innerHeight, sy)),
            };

            const g = classifyGesture(lm);
            setGesture(g);

            // Hover detection
            const el = document.elementFromPoint(targetRef.current.x, targetRef.current.y);
            const hovering = !!el?.closest('button,a,input,select,textarea,[role="button"],[tabindex]');
            setIsHovering(hovering);

            // ── Pinch = Click ──
            if (g.isPinching && !lastPinchRef.current) {
                fireClick(targetRef.current.x, targetRef.current.y, 'mousedown');
                pinchStartRef.current = now;
                spawnBurst(targetRef.current.x, targetRef.current.y, '#00ff9d', 16);
            } else if (!g.isPinching && lastPinchRef.current) {
                fireClick(targetRef.current.x, targetRef.current.y, 'mouseup');
                if (now - pinchStartRef.current < 400) {
                    fireClick(targetRef.current.x, targetRef.current.y, 'click');
                    spawnRipple(targetRef.current.x, targetRef.current.y);
                }
                cancelDwell();
            }
            lastPinchRef.current = g.isPinching;

            // ── Dwell-to-click (when hovering over button, not pinching) ──
            if (hovering && !g.isPinching) {
                startDwell(targetRef.current.x, targetRef.current.y);
            } else {
                cancelDwell();
            }

            // ── Fist = Scroll Down, Open = Scroll Up ──
            if (g.isFist) window.scrollBy(0, 20);
            if (g.isOpen && g.fingerCount >= 5) window.scrollBy(0, -20);

            // ── Edge Scroll ──
            const { x, y } = targetRef.current;
            if (y < 40) window.scrollBy(0, -12);
            else if (y > window.innerHeight - 40) window.scrollBy(0, 12);

            // Trail particles
            addParticle(targetRef.current.x, targetRef.current.y,
                g.isPinching ? '#00ff9d' : '#38bdf8', 3, 0.8);

        } else {
            if (now - lastSeenRef.current > 600) {
                setIsTracking(false);
                cancelDwell();
            }
        }
    }, [fireClick]);

    // ── Init / Teardown ────────────────────────────────────────────────────
    useEffect(() => {
        if (!isActive || !isLoaded || !window.Hands) return;

        const hands = new window.Hands({
            locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
        });
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.55, minTrackingConfidence: 0.55 });
        hands.onResults(onResults);
        handsRef.current = hands;

        const startCam = async () => {
            if (!videoRef.current) return;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } });
                videoRef.current.srcObject = stream;
                await videoRef.current.play();

                const loop = async () => {
                    if (videoRef.current && handsRef.current) {
                        try { await handsRef.current.send({ image: videoRef.current }); } catch (_) { }
                    }
                    camRafRef.current = requestAnimationFrame(loop);
                };
                loop();
            } catch (e) { console.error('Cam error', e); }
        };
        startCam();

        // 60 FPS render loop
        const render = () => {
            const smooth = gestureRef.current.isPinching ? 0.5 : 0.18;
            const dx = targetRef.current.x - posRef.current.x;
            const dy = targetRef.current.y - posRef.current.y;
            posRef.current.x += dx * smooth;
            posRef.current.y += dy * smooth;
            velRef.current = { x: dx * smooth, y: dy * smooth };

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${posRef.current.x}px,${posRef.current.y}px,0)`;
            }

            // Dwell ring
            if (dwellRef.current) {
                const p = dwellProgressRef.current;
                if (p > 0) {
                    dwellRef.current.style.opacity = '1';
                    dwellRef.current.style.transform = `translate3d(${posRef.current.x}px,${posRef.current.y}px,0)`;
                    const circle = dwellRef.current.querySelector('circle') as SVGCircleElement | null;
                    if (circle) {
                        const r = 28, circ = 2 * Math.PI * r;
                        circle.style.strokeDashoffset = String(circ * (1 - p));
                    }
                } else {
                    dwellRef.current.style.opacity = '0';
                }
            }

            if (trailRef.current) {
                const ctx = trailRef.current.getContext('2d');
                if (ctx) renderParticles(ctx);
            }

            rafRef.current = requestAnimationFrame(render);
        };
        rafRef.current = requestAnimationFrame(render);

        return () => {
            if (handsRef.current) handsRef.current.close();
            if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            cancelAnimationFrame(camRafRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            cancelDwell();
        };
    }, [isActive, isLoaded, onResults]);

    // Resize trail canvas
    useEffect(() => {
        const resize = () => {
            if (trailRef.current) {
                trailRef.current.width = window.innerWidth;
                trailRef.current.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', resize);
        resize();
        return () => window.removeEventListener('resize', resize);
    }, []);

    // ── Cursor color / size based on gesture ──────────────────────────────
    const cursorColor = gesture.isPinching ? '#00ff9d' : isHovering ? '#facc15' : '#38bdf8';
    const cursorScale = gesture.isPinching ? 0.65 : isHovering ? 1.35 : 1;
    const cursorGlow = `0 0 24px 6px ${cursorColor}88`;

    return (
        <>
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" strategy="lazyOnload" onLoad={() => setIsLoaded(true)} />
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" strategy="lazyOnload" />

            {/* ── Fullscreen Particle Trail ── */}
            {isActive && <canvas ref={trailRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 99997 }} />}

            {/* ── Dwell Progress Ring ── */}
            {isActive && (
                <div
                    ref={dwellRef}
                    className="fixed top-0 left-0 pointer-events-none"
                    style={{ zIndex: 99999, opacity: 0, willChange: 'transform', marginLeft: '-32px', marginTop: '-32px' }}
                >
                    <svg width="64" height="64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="#facc1533" strokeWidth="3" />
                        <circle
                            cx="32" cy="32" r="28" fill="none"
                            stroke="#facc15" strokeWidth="3"
                            strokeDasharray={String(2 * Math.PI * 28)}
                            strokeDashoffset={String(2 * Math.PI * 28)}
                            strokeLinecap="round"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '32px 32px', transition: 'stroke-dashoffset 0.05s linear' }}
                        />
                    </svg>
                </div>
            )}

            {/* ── Main Cursor ── */}
            {isActive && (
                <>
                    <video ref={videoRef} className="hidden" playsInline muted />

                    <div
                        ref={cursorRef}
                        className="fixed top-0 left-0 pointer-events-none"
                        style={{ zIndex: 100000, willChange: 'transform', marginLeft: '-24px', marginTop: '-24px' }}
                    >
                        {/* Outer ring */}
                        <div style={{
                            width: 48, height: 48, borderRadius: '50%',
                            border: `3px solid ${cursorColor}`,
                            boxShadow: cursorGlow,
                            transform: `scale(${cursorScale})`,
                            transition: 'transform 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease',
                            borderStyle: isHovering && !gesture.isPinching ? 'dashed' : 'solid',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative',
                        }}>
                            {/* Center dot */}
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: cursorColor,
                                boxShadow: `0 0 8px 3px ${cursorColor}`,
                                transition: 'background 0.12s ease',
                            }} />

                            {/* Hover ping */}
                            {isHovering && !gesture.isPinching && (
                                <div className="animate-ping" style={{
                                    position: 'absolute', inset: -8, borderRadius: '50%',
                                    border: '1px solid #facc1555',
                                }} />
                            )}
                        </div>

                        {/* Crosshair */}
                        <div style={{ position: 'absolute', top: '50%', left: -14, right: -14, height: 1, background: `${cursorColor}33`, transform: 'translateY(-50%)' }} />
                        <div style={{ position: 'absolute', left: '50%', top: -14, bottom: -14, width: 1, background: `${cursorColor}33`, transform: 'translateX(-50%)' }} />

                        {/* Gesture label */}
                        <div style={{ position: 'absolute', top: 54, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 10, fontWeight: 700 }}>
                            {!isTracking
                                ? <span style={{ background: '#ef444490', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>SEARCHING…</span>
                                : gesture.isPinching
                                    ? <span style={{ color: '#00ff9d', letterSpacing: 2 }}>● CLICK</span>
                                    : gesture.isFist
                                        ? <span style={{ color: '#f97316', letterSpacing: 2 }}>✊ SCROLL↓</span>
                                        : gesture.isOpen
                                            ? <span style={{ color: '#a78bfa', letterSpacing: 2 }}>✋ SCROLL↑</span>
                                            : isHovering
                                                ? <span style={{ color: '#facc15', letterSpacing: 2 }}>◎ TARGET</span>
                                                : null
                            }
                        </div>
                    </div>
                </>
            )}

            {/* ── Control Panel ── */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end" style={{ zIndex: 100001 }}>
                {isActive && (
                    <div className="bg-black/85 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl w-80 shadow-2xl animate-in slide-in-from-right-10 duration-300">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-white/70 tracking-widest flex items-center gap-2">
                                <ScanFace className="w-4 h-4 text-cyan-400" />
                                VISION OS 3.0
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-white/30">{fps} FPS</span>
                                <Badge variant="outline" className={`text-[10px] bg-transparent ${isTracking ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400 animate-pulse'}`}>
                                    {isTracking ? '● LOCKED' : '○ NO HAND'}
                                </Badge>
                            </div>
                        </div>

                        {/* Gesture Telemetry */}
                        <div className="grid grid-cols-4 gap-1.5 mb-3">
                            {[
                                { label: 'PINCH', active: gesture.isPinching, color: 'text-green-400' },
                                { label: 'POINT', active: gesture.isPointing, color: 'text-cyan-400' },
                                { label: 'FIST', active: gesture.isFist, color: 'text-orange-400' },
                                { label: 'OPEN', active: gesture.isOpen, color: 'text-purple-400' },
                            ].map(({ label, active, color }) => (
                                <div key={label} className={`bg-white/5 rounded-lg p-2 flex flex-col items-center gap-0.5 border transition-all duration-200 ${active ? 'border-white/20 bg-white/10' : 'border-transparent'}`}>
                                    <span className={`text-xs font-bold ${active ? color : 'text-white/20'}`}>{active ? '●' : '○'}</span>
                                    <span className="text-[8px] text-white/30 uppercase tracking-wider">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Sensitivity Slider */}
                        <div className="mb-3">
                            <div className="flex justify-between text-[10px] text-white/40 mb-1">
                                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Sensitivity</span>
                                <span className="text-cyan-400 font-mono">{sensitivity.toFixed(1)}×</span>
                            </div>
                            <input
                                type="range" min="0.5" max="2.0" step="0.1"
                                value={sensitivity}
                                onChange={e => setSensitivity(parseFloat(e.target.value))}
                                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                                style={{ accentColor: '#22d3ee' }}
                            />
                        </div>

                        {/* Gesture Guide */}
                        <div className="text-[10px] font-mono text-white/40 space-y-1 mb-3 border-t border-white/5 pt-3">
                            <div className="flex justify-between"><span>☝ Index Finger</span><span className="text-cyan-400">Move Cursor</span></div>
                            <div className="flex justify-between"><span>🤌 Thumb Pinch</span><span className="text-green-400">Click</span></div>
                            <div className="flex justify-between"><span>✊ Fist</span><span className="text-orange-400">Scroll Down</span></div>
                            <div className="flex justify-between"><span>✋ Open Hand</span><span className="text-purple-400">Scroll Up</span></div>
                            <div className="flex justify-between"><span>⏱ Hover 1.2s</span><span className="text-yellow-400">Dwell Click</span></div>
                        </div>

                        {/* Live Feed */}
                        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-video">
                            <canvas ref={previewRef} width={320} height={240} className="w-full h-full object-cover opacity-75" />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
                            <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyan-500/15" />
                            <div className="absolute bottom-1 right-2 text-[9px] text-green-400 font-mono flex items-center gap-1">
                                <Activity className="w-2 h-2" />
                                {isTracking ? 'hand_detected' : 'scanning…'}
                            </div>
                            <div className="absolute top-1 left-2 text-[9px] text-cyan-400/60 font-mono flex items-center gap-1">
                                <Eye className="w-2 h-2" />
                                {gesture.fingerCount} fingers
                            </div>
                        </div>
                    </div>
                )}

                {/* Toggle Button */}
                <button
                    onClick={() => setIsActive(v => !v)}
                    className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{
                        background: isActive ? '#0891b2' : '#18181b',
                        border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: isActive ? '0 0 40px rgba(8,145,178,0.6)' : 'none',
                    }}
                >
                    {isActive && <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping" />}
                    {isActive ? <X className="w-6 h-6 text-white" /> : <Hand className="w-6 h-6 text-cyan-400" />}
                </button>
            </div>
        </>
    );
}
