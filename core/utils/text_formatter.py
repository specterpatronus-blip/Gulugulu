import re

def prettify_title(filename):
    """
    Transforms a messy filename into a beautiful, child-friendly title.
    Example: '02-CIENCIAS-NATURALES-2°-P.E.pdf' -> 'Ciencias Naturales 2°'
    """
    # 1. Remove extension
    name = re.sub(r'\.[a-zA-Z0-9]+$', '', filename)
    
    # 2. Replace separators with spaces
    name = name.replace('_', ' ').replace('-', ' ')
    
    # 2b. Heuristic for run-together words (PascalCase)
    # Insert space before capital letters if not already preceded by space
    name = re.sub(r'([a-z])([A-Z])', r'\1 \2', name)
    
    # 3. Remove leading numbers (e.g., '01 ', '02 ')
    name = re.sub(r'^\d+[\s\.\-]*', '', name)
    
    # 4. Remove common redundant technical suffixes/tags
    redundant_patterns = [
        r'P\.E\.?', r'P E', r'Guias de aprendizaje', r'Guia de aprendizaje',
        r'Cuaderno del Alumno', r'Cuadernillo', r'optimizado', r'Parte\d+',
        r'Grado\d+', r'basico', r'primaria'
    ]
    for pattern in redundant_patterns:
        name = re.sub(pattern, '', name, flags=re.IGNORECASE)
    
    # 5. Standardize grades (2o, 2ro, 2 grado -> 2°)
    name = re.sub(r'(\d+)\s*(o|°|ro|er|do|to|mo|vo|no|grado)', r'\1°', name, flags=re.IGNORECASE)
    
    # 6. Clean up multiple spaces and trim
    name = re.sub(r'\s+', ' ', name).strip()
    
    # 7. Title Case (but keep '°' and certain particles lowercase if desired)
    name = name.title()
    
    # Fix '°' lowercase issue with title() (sometimes '2°' -> '2°' is fine, but title() can be weird)
    name = name.replace('°', '°')
    
    # 8. Final polish: if empty or too short, use the original without extension
    if len(name) < 3:
        name = re.sub(r'\.[a-zA-Z0-9]+$', '', filename).replace('_', ' ').replace('-', ' ').title()
        
    return name

if __name__ == "__main__":
    test_cases = [
        "01-CIENCIAS-NATURALES-1°-P.E.pdf",
        "2°-cs.naturales_cuaderno-de-actividades.pdf",
        "Ciencias-naturales-y-educacion-ambiental-2o-Guias-de-aprendizaje.pdf",
        "videoplayback (2).mp4",
        "8aa3929a4ad3ad4048f64a7dbc5ddbbc.jpg"
    ]
    for tc in test_cases:
        print(f"Original: {tc}")
        print(f"Pretty:   {prettify_title(tc)}\n")
