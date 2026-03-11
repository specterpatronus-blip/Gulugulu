import os
import json

class SearchEngine:
    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.index = []
        self.synonyms = self.load_synonyms()
        self.index_files()

    def load_synonyms(self):
        try:
            with open('synonyms.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}

    def index_files(self):
        """Scans the directory and builds an in-memory index."""
        self.index = []
        for root, dirs, files in os.walk(self.root_dir):
            for file in files:
                path = os.path.join(root, file)
                rel_path = os.path.relpath(path, self.root_dir)
                size = os.path.getsize(path)
                self.index.append({
                    'name': file,
                    'path': rel_path,
                    'type': self.get_file_type(file),
                    'size': size,
                    'size_display': self.format_size(size),
                    'ext': os.path.splitext(file)[1].lower().replace('.', '').upper()
                })
        print(f"Indexed {len(self.index)} files.")

    def get_file_type(self, filename):
        ext = os.path.splitext(filename)[1].lower()
        if ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']: return 'image'
        if ext in ['.mp4', '.avi', '.mov', '.mkv', '.wmv']: return 'video'
        if ext in ['.mp3', '.wav', '.ogg', '.flac', '.aac']: return 'audio'
        if ext in ['.pdf']: return 'pdf'
        if ext in ['.docx', '.doc']: return 'word'
        if ext in ['.pptx', '.ppt']: return 'presentation'
        if ext in ['.xlsx', '.xls']: return 'spreadsheet'
        if ext in ['.txt']: return 'text'
        return 'file'

    def format_size(self, size_bytes):
        if size_bytes < 1024:
            return f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes / 1024:.0f} KB"
        elif size_bytes < 1024 * 1024 * 1024:
            return f"{size_bytes / (1024*1024):.1f} MB"
        else:
            return f"{size_bytes / (1024*1024*1024):.1f} GB"

    def get_type_label(self, file_type):
        labels = {
            'image': 'Foto',
            'video': 'Video',
            'audio': 'Música',
            'pdf': 'Documento',
            'word': 'Documento',
            'presentation': 'Presentación',
            'spreadsheet': 'Hoja de cálculo',
            'text': 'Texto',
            'file': 'Archivo'
        }
        return labels.get(file_type, 'Archivo')

    def search(self, query, file_filter=None):
        query = query.lower().strip()
        if not query:
            return []
        
        results = []
        
        # Split query into individual words for multi-word matching
        query_words = query.split()
        
        # Expand query with synonyms
        search_terms = set(query_words)
        search_terms.add(query)  # Also add the full query
        for word in query_words:
            if word in self.synonyms:
                search_terms.update(self.synonyms[word])
        
        # Check against index
        for item in self.index:
            # Apply file type filter
            if file_filter and file_filter != 'all':
                if file_filter == 'image' and item['type'] != 'image':
                    continue
                elif file_filter == 'video' and item['type'] != 'video':
                    continue
                elif file_filter == 'document' and item['type'] not in ['pdf', 'word', 'text', 'presentation', 'spreadsheet']:
                    continue
                elif file_filter == 'audio' and item['type'] != 'audio':
                    continue
            
            score = 0
            # Normalize filename: remove extension, replace separators with spaces
            item_name_raw = os.path.splitext(item['name'])[0].lower()
            item_name_normalized = item_name_raw.replace('_', ' ').replace('-', ' ')
            
            for term in search_terms:
                term_lower = term.lower()
                # Check in raw filename
                if term_lower in item_name_raw:
                    if term_lower == item_name_raw:
                        score += 10
                    elif item_name_raw.startswith(term_lower):
                        score += 5
                    else:
                        score += 2
                # Check in normalized filename (spaces instead of _ or -)
                elif term_lower in item_name_normalized:
                    if term_lower == item_name_normalized:
                        score += 10
                    elif item_name_normalized.startswith(term_lower):
                        score += 5
                    else:
                        score += 2
            
            if score > 0:
                result = {**item, 'score': score, 'type_label': self.get_type_label(item['type'])}
                results.append(result)
        
        # Sort by score descending
        results.sort(key=lambda x: x['score'], reverse=True)
        return results

    def get_all_filenames(self):
        """Returns a list of all file names for autocomplete."""
        return [item['name'] for item in self.index]

if __name__ == "__main__":
    se = SearchEngine("BD")
    print(se.search("universo"))
    print(se.search("divisiones"))
