import os
import sys
from PIL import Image

def create_ico(source_png, target_ico):
    if not os.path.exists(source_png):
        print(f"Error: No se encontró {source_png}")
        return False
    
    img = Image.open(source_png)
    # PyInstaller prefiere múltiples tamaños en un .ico
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    img.save(target_ico, sizes=icon_sizes)
    print(f"Éxito: Icono creado en {target_ico}")
    return True

if __name__ == "__main__":
    create_ico("static/images/icono.png", "USB/gulugulu.ico")
