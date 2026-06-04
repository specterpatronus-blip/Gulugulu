import os
import hashlib
import shutil
import logging
from datetime import datetime

class StorageManager:
    """
    Gulugulu V2 Storage Manager
    Handles hierarchical storage, SHA256 deduplication, and naming conventions.
    """
    BASE_DIR = 'storage'
    CATEGORIES = {
        'document': 'documents',
        'video': 'videos',
        'audio': 'audio',
        'image': 'images',
        'interactive': 'interactive'
    }

    def __init__(self, base_dir=None):
        if base_dir:
            self.BASE_DIR = base_dir
        self._ensure_base_structure()
        
        # Setup logging
        self.logger = logging.getLogger("StorageManager")
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)

    def _ensure_base_structure(self):
        """Ensures that the basic category directories exist."""
        for cat_dir in self.CATEGORIES.values():
            os.makedirs(os.path.join(self.BASE_DIR, cat_dir), exist_ok=True)
        os.makedirs(os.path.join(self.BASE_DIR, 'thumbnails'), exist_ok=True)
        os.makedirs(os.path.join(self.BASE_DIR, 'temp'), exist_ok=True)

    def calculate_sha256(self, file_path):
        """Calculates SHA256 checksum of a file."""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def generate_internal_name(self, subject_code, grade_level, correlative, category, extension):
        """
        Generates name: [SUBJECT]-[GRADE]-[CORRELATIVE]-[TYPE].[EXT]
        Example: CNT-G2-0001-PDF.pdf
        """
        type_code = category[:3].upper()
        # Ensure correlative is 4 digits
        corr_str = str(correlative).zfill(4)
        return f"{subject_code.upper()}-G{grade_level}-{corr_str}-{type_code}.{extension.lower()}"

    def get_relative_path(self, category, subject_slug, grade_level, internal_name):
        """
        Calculates the relative path within storage.
        Example: documents/ciencias-naturales/g2/CNT-G2-0001-PDF.pdf
        """
        cat_dir = self.CATEGORIES.get(category, 'documents')
        return os.path.join(cat_dir, subject_slug, f"g{grade_level}", internal_name).replace("\\", "/")

    def store_file(self, source_path, category, subject_code, subject_slug, grade_level, correlative):
        """
        Main entry point to save a file into the V2 storage.
        1. Calculate Hash
        2. Generate Name
        3. Resolve Path
        4. Copy (deduplication check should be done by the caller using hash)
        """
        extension = os.path.splitext(source_path)[1].replace('.', '').lower()
        internal_name = self.generate_internal_name(subject_code, grade_level, correlative, category, extension)
        rel_path = self.get_relative_path(category, subject_slug, grade_level, internal_name)
        full_dest_path = os.path.join(self.BASE_DIR, rel_path)

        # Ensure destination directory exists
        os.makedirs(os.path.dirname(full_dest_path), exist_ok=True)

        # Copy file
        shutil.copy2(source_path, full_dest_path)
        
        file_size = os.path.getsize(full_dest_path)
        sha256 = self.calculate_sha256(full_dest_path)

        self.logger.info(f"Stored: {source_path} -> {rel_path} (Size: {file_size}, Hash: {sha256[:10]}...)")
        
        return {
            'internal_name': internal_name,
            'internal_path': rel_path,
            'file_size': file_size,
            'sha256': sha256
        }

    def exists(self, internal_path):
        return os.path.exists(os.path.join(self.BASE_DIR, internal_path))

    def get_full_path(self, internal_path):
        return os.path.abspath(os.path.join(self.BASE_DIR, internal_path))
