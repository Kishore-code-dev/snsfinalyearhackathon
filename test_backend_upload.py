
import requests
import os

def test_file_upload():
    url = "http://localhost:8000/v1/process-invoice-file"
    # Create a dummy text file to test the pipeline
    test_file_path = "test_invoice.txt"
    with open(test_file_path, "w") as f:
        f.write("VENDOR: Test Corp\nINVOICE #INV-123\nTOTAL: $500.00")
    
    try:
        with open(test_file_path, "rb") as f:
            files = {"file": (test_file_path, f, "text/plain")}
            response = requests.post(url, files=files)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if os.path.exists(test_file_path):
            os.remove(test_file_path)

if __name__ == "__main__":
    test_file_upload()
