# 👁️ DEPLOYING THE VISUAL CONTROL MODULE

## ⚠️ RESOURCE REQUIREMENTS

**Computer Vision is resource-intensive.** Deploying YOLOv8 on a free tier server (512MB RAM) **will pass**, but might be slow or crash.

For **Production Deployment** of the Visual module, you need:

1.  **RAM**: Minimum 1GB (ideally 2GB+).
2.  **CPU**: Ideally 2+ vCPUs, or GPU access.
3.  **Latency**: Server must be physically close to users (to reduce WebRTC lag).

---

## 🚀 RAILWAY DEPLOYMENT UPDATE

If you deploy to Railway, add more RAM/vCPU in the "Settings" tab:
- **Service Size**: Not "Starter" (too small).
- **Custom Dockerfile**: Ensure `libgl1-mesa-glx` is installed (required for OpenCV).

### Updated Dockerfile Instructions

I have already updated your `Dockerfile` to include the necessary system dependencies (`libgl1-mesa-glx` via `opencv-python-headless`) but double check your `apt-get install` includes:
```dockerfile
RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6
```
(I will add this for you now).

---

## ⚡ LOCAL PERFORMANCE TIPS

Running Vision AI locally is **FASTER** than cloud because:
1.  **Zero Network Latency**: No need to upload images to server.
2.  **Local Hardware**: Your webcam is directly connected.

For the absolute best performance, consider moving the AI inference to the **Frontend (Browser)** using **TensorFlow.js** or **ONNX Runtime Web** in the future.
Currently, it runs on the **Backend (Python)** for maximum accuracy and ease of development.
