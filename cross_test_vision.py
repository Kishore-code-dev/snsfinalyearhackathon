import requests
import cv2
import numpy as np
import base64
import json
import time

# Configuration
API_URL = "http://localhost:8000/v1/vision/analyze-frame"

def generate_test_frame():
    """Create a dummy black image to simulate a camera frame"""
    frame = np.zeros((480, 640, 3), dtype=np.uint8)
    # Draw a white rectangle (simulate an object)
    cv2.rectangle(frame, (100, 100), (300, 300), (255, 255, 255), -1)
    
    # Encode as JPEG
    _, buffer = cv2.imencode('.jpg', frame)
    return buffer.tobytes()

def test_vision_pipeline():
    print("🚀 STARTING VISION CROSS-TEST...")
    
    try:
        # 1. Generate Frame
        print("📸 1. Simulating Camera Capture...")
        img_bytes = generate_test_frame()
        print(f"   ✓ Frame generated ({len(img_bytes)} bytes)")
        
        # 2. Send to API
        print("🌐 2. Sending to Vision API...")
        start_time = time.time()
        
        files = {'file': ('test_frame.jpg', img_bytes, 'image/jpeg')}
        response = requests.post(API_URL, files=files)
        
        latency = (time.time() - start_time) * 1000
        print(f"   ✓ API Responded in {latency:.1f}ms")
        
        # 3. Analyze Response
        if response.status_code == 200:
            data = response.json()
            print("🧠 3. Analyzing AI Output:")
            print(f"   ✓ Status: {data.get('system_status')}")
            print(f"   ✓ Threat Level: {data.get('threat_level')}")
            
            analysis = data.get('analysis', {})
            print(f"   ✓ Model Used: {analysis.get('model')}")
            
            if 'annotated_frame_base64' in data:
                print("   ✓ Received Annotated Image Overlay")
            else:
                print("   ❌ Missing Annotated Image")
                
            print("\n✅ CROSS-TEST PASSED: Vision Pipeline is Active & Responsive.")
            return True
        else:
            print(f"❌ API Failed: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ CONNECTION ERROR: {e}")
        print("   Make sure backend is running on port 8000.")
        return False

if __name__ == "__main__":
    test_vision_pipeline()
