"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Eye, ShieldCheck, ShieldAlert, Camera, StopCircle } from "lucide-react";
import { toast } from "sonner";

export default function VisualControlCenter() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [status, setStatus] = useState<"SAFE" | "ALERT">("SAFE");
    const [detections, setDetections] = useState<any[]>([]);
    const [fps, setFps] = useState(0);
    const requestRef = useRef<number | null>(null);
    const processingRef = useRef(false);

    // Start Camera Stream
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: "environment" }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsMonitoring(true);
            toast.success("Visual Control System Active");
        } catch (err) {
            toast.error("Camera Access Denied: " + err);
        }
    };

    // Stop Camera
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsMonitoring(false);
        setDetections([]);
        setStatus("SAFE");
    };

    // Process Frames Loop
    useEffect(() => {
        if (!isMonitoring) return;

        const processFrame = async () => {
            if (processingRef.current) return;
            processingRef.current = true;

            const startTime = performance.now();

            try {
                if (!videoRef.current || !canvasRef.current) return;

                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                if (!context || video.readyState !== 4) {
                    processingRef.current = false;
                    return; // Video not ready
                }

                // Draw video frame to canvas
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert to Blob
                canvas.toBlob(async (blob) => {
                    if (!blob) return;

                    const formData = new FormData();
                    formData.append("file", blob, "frame.jpg");

                    // Send to AI Backend
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                    try {
                        const res = await fetch(`${API_URL}/v1/vision/analyze-frame`, {
                            method: "POST",
                            body: formData,
                        });

                        if (res.ok) {
                            const data = await res.json();
                            setDetections(data.analysis.detections || []);
                            setStatus(data.system_status === "MONITORING" ? "SAFE" : "ALERT");

                            // Advanced HUD Drawing
                            if (data.annotated_frame_base64) {
                                // Option A: Draw backend image (Perfect accuracy)
                                const img = new Image();
                                img.onload = () => {
                                    context.drawImage(img, 0, 0, canvas.width, canvas.height);

                                    // Draw HUD Overlay
                                    drawHUD(context, data.analysis.detections, data.system_status);
                                };
                                img.src = `data:image/jpeg;base64,${data.annotated_frame_base64}`;
                            }
                        }
                    } catch (err) {
                        console.error("AI Inference Error", err);
                    } finally {
                        const endTime = performance.now();
                        setFps(Math.round(1000 / (endTime - startTime)));
                        processingRef.current = false;

                        // Loop
                        if (isMonitoring) {
                            requestRef.current = requestAnimationFrame(processFrame);
                        }
                    }
                }, 'image/jpeg', 0.8); // 80% quality JPEG

            } catch (error) {
                processingRef.current = false;
            }
        };

        const timer = setInterval(() => {
            processFrame();
        }, 100); // Max 10 FPS to prevent overload

        return () => clearInterval(timer);
    }, [isMonitoring]);

    // Draw Futuristic HUD
    const drawHUD = (ctx: CanvasRenderingContext2D, objects: any[], sysStatus: string) => {
        // Overlay Grid
        ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        // Drawing logic handled by backend mostly, this adds extra UI flair
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Video Feed */}
                <Card className="md:col-span-2 border-primary/20 bg-black/95 relative overflow-hidden shadow-2xl shadow-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary animate-pulse" />
                            <CardTitle className="text-white font-mono tracking-widest">
                                LIVE VISION FEED <span className="text-xs text-muted-foreground ml-2">CAM-01</span>
                            </CardTitle>
                        </div>
                        <Badge className={`${status === "SAFE" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} animate-pulse text-white border-0`}>
                            {status === "SAFE" ? "SYSTEM NOMINAL" : "SECURITY ALERT"}
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0 relative aspect-video bg-black flex items-center justify-center">
                        {!isMonitoring && (
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mx-auto animate-spin-slow">
                                    <Camera className="w-10 h-10 text-white/50" />
                                </div>
                                <p className="text-white/60 font-mono text-sm">FEED DISCONNECTED</p>
                                <Button onClick={startCamera} className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50">
                                    Initialize System
                                </Button>
                            </div>
                        )}

                        {/* Hidden Source Video */}
                        <video ref={videoRef} autoPlay playsInline muted className="hidden" />

                        {/* Visible AI Canvas */}
                        <canvas
                            ref={canvasRef}
                            className={`w-full h-full object-contain ${!isMonitoring ? 'hidden' : ''}`}
                        />

                        {/* HUD Overlay Elements */}
                        {isMonitoring && (
                            <div className="absolute top-4 left-4 font-mono text-xs text-primary bg-black/50 p-2 rounded border border-primary/30 backdrop-blur-sm">
                                <p>FPS: {fps}</p>
                                <p>OBJ: {detections.length}</p>
                                <p>LAT: {(1000 / fps).toFixed(1)}ms</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Control Panel & Telemetry */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-background/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground flex items-center gap-2">
                                System Controls
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!isMonitoring ? (
                                <Button onClick={startCamera} className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20">
                                    <Camera className="w-5 h-5 mr-2" />
                                    ACTIVATE VISION
                                </Button>
                            ) : (
                                <Button onClick={stopCamera} className="w-full h-12 text-lg font-bold shadow-lg shadow-red-900/20 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                    <StopCircle className="w-5 h-5 mr-2" />
                                    TERMINATE FEED
                                </Button>
                            )}

                            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                                <h4 className="text-xs font-semibold mb-2">ACTIVE PROTOCOLS</h4>
                                <ul className="space-y-2 text-xs font-mono text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> YOLOv8n Object Detection
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Zone Intrusion Monitoring
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 10FPS Sampling Rate
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-background/50 backdrop-blur flex-1">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">
                                Live Detections
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {detections.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm italic">
                                        No objects in field of view
                                    </div>
                                ) : (
                                    detections.map((det, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded bg-secondary/20 border border-border/30 animate-in fade-in slide-in-from-left-4 duration-300">
                                            <span className="font-mono text-sm font-bold text-foreground capitalize">
                                                {det.label}
                                            </span>
                                            <Badge className="bg-background/50 border border-border text-foreground">
                                                {Math.round(det.confidence * 100)}%
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
