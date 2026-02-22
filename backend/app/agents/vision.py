from ultralytics import YOLO
import cv2
import numpy as np
import base64
from typing import List, Dict, Any, Tuple
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VisionAgent:
    """
    Advanced Computer Vision Agent powered by YOLOv8.
    Handles real-time object detection, safety monitoring, and visual analytics.
    """
    
    def __init__(self, model_name: str = "yolov8n.pt"):
        """
        Initialize YOLO model. Uses Nano (n) model for CPU speed, 
        or move to Large (l/x) for GPU accuracy if available.
        """
        try:
            logger.info(f"👁️ Loading Vision Model: {model_name}...")
            self.model = YOLO(model_name)  # Auto-downloads weights on first run
            logger.info("✅ Vision Model Loaded Successfully")
        except Exception as e:
            logger.error(f"❌ Failed to load Vision Model: {e}")
            self.model = None

    def detect_objects(self, image_bytes: bytes) -> Tuple[Dict[str, Any], bytes]:
        """
        Perform inference on a single image frame.
        Returns:
            - Analysis Dict: Counts, detected classes, confidence scores.
            - Processed Image: Frame with bounding boxes drawn (JPEG bytes).
        """
        if not self.model:
            return {"error": "Model not loaded"}, image_bytes

        # Convert bytes to OpenCV Image
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return {"error": "Invalid image data"}, image_bytes

        # Run Inference
        results = self.model(frame, verbose=False)[0]

        # Extract Analytics
        detections = []
        counts = {}
        
        for box in results.boxes:
            cls_id = int(box.cls[0])
            label = self.model.names[cls_id]
            conf = float(box.conf[0])
            
            # Count objects
            counts[label] = counts.get(label, 0) + 1
            
            # Store details
            detections.append({
                "label": label,
                "confidence": round(conf, 2),
                "box": box.xyxy[0].tolist()  # [x1, y1, x2, y2]
            })

        # Draw Advanced HUD (Heads-Up Display)
        annotated_frame = results.plot()  # Ultralytics built-in plotter is fast & clean
        
        # Add timestamp & system status overlay
        h, w = annotated_frame.shape[:2]
        cv2.putText(annotated_frame, "VISION CONTROL ACTIVE", (20, 40), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        
        # Encode back to JPEG
        _, buffer = cv2.imencode('.jpg', annotated_frame)
        processed_bytes = buffer.tobytes()

        analysis_result = {
            "status": "active",
            "model": "YOLOv8n",
            "object_counts": counts,
            "total_detections": len(detections),
            "detections": detections,  # Detailed list for frontend
            "safety_alert": "person" in counts  # Example rule: alert if person seen
        }

        return analysis_result, processed_bytes

# Singleton instance
vision_engine = VisionAgent()
