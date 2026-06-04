import os
import sqlite3
import cv2
import logging
import subprocess

class BaseExtractor:
    def __init__(self, storage_base='storage'):
        self.storage_base = storage_base
        self.logger = logging.getLogger(self.__class__.__name__)

class PDFExtractor(BaseExtractor):
    def extract_text(self, file_path):
        """Extracts text from PDF. Fallback to empty if no library."""
        try:
            # Try PyMuPDF if available
            import fitz
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except ImportError:
            return ""

    def create_thumbnail(self, file_path, dest_path):
        """Generates a thumbnail from the first page of a PDF and saves as WebP."""
        try:
            import fitz
            import numpy as np
            doc = fitz.open(file_path)
            if doc.page_count > 0:
                page = doc.load_page(0)
                pix = page.get_pixmap(matrix=fitz.Matrix(0.5, 0.5))
                # Convert Pixmap to numpy array for OpenCV
                img_data = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
                # Convert RGB to BGR for OpenCV
                if pix.n == 3:
                    img_data = cv2.cvtColor(img_data, cv2.COLOR_RGB2BGR)
                elif pix.n == 4:
                    img_data = cv2.cvtColor(img_data, cv2.COLOR_RGBA2BGR)
                
                success = cv2.imwrite(dest_path, img_data)
                return success
            return False
        except Exception as e:
            self.logger.error(f"PDF Thumbnail error: {e}")
            return False

import numpy as np

class ImageExtractor(BaseExtractor):
    def extract_ocr(self, file_path):
        """Uses Tesseract CLI if available for OCR."""
        try:
            # Simple check if tesseract exists
            result = subprocess.run(['tesseract', file_path, 'stdout'], capture_output=True, text=True, check=True)
            return result.stdout
        except (subprocess.CalledProcessError, FileNotFoundError, Exception):
            return ""

    def create_thumbnail(self, file_path, dest_path, size=(300, 300)):
        try:
            # Use numpy to read file with UTF-8 path on Windows
            img_array = np.fromfile(file_path, np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            
            if img is None:
                self.logger.warning(f"Could not decode image: {file_path}")
                return False
            
            # Calculate aspect ratio
            h, w = img.shape[:2]
            scale = min(size[0]/w, size[1]/h)
            new_w, new_h = int(w * scale), int(h * scale)
            
            resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
            # Encode and save using imencode/tofile for UTF-8 path support
            ext = os.path.splitext(dest_path)[1]
            success, encoded_img = cv2.imencode(ext, resized)
            if success:
                encoded_img.tofile(dest_path)
            return success
        except Exception as e:
            self.logger.error(f"Thumbnail error: {e}")
            return False

class VideoExtractor(BaseExtractor):
    def extract_metadata(self, file_path):
        cap = cv2.VideoCapture(file_path)
        if not cap.isOpened():
            return {}
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = frame_count / fps if fps > 0 else 0
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        cap.release()
        return {
            'duration': duration,
            'resolution': f"{width}x{height}",
            'width': width,
            'height': height
        }

    def create_thumbnail(self, file_path, dest_path):
        cap = cv2.VideoCapture(file_path)
        success, frame = cap.read()
        if success:
            # Seek to 1 second or 10th frame if possible for better preview
            cap.set(cv2.CAP_PROP_POS_MSEC, 1000)
            success, frame = cap.read()
            if success:
                # Resize and save
                frame = cv2.resize(frame, (300, 168)) # 16:9 approx
                cv2.imwrite(dest_path, frame)
                return True
        cap.release()
        return False
