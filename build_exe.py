import os
import subprocess
import shutil

def build():
    print("--- INICIANDO CONSTRUCCIÓN DE GULUGULU LAUNCHER ---")
    
    # 1. Asegurar que el icono esté en la raíz para PyInstaller
    if os.path.exists("USB/gulugulu.ico"):
        shutil.copy("USB/gulugulu.ico", "gulugulu.ico")
    
    # 2. Comando de PyInstaller
    # --onefile: Un solo ejecutable
    # --windowed: Sin consola CMD al abrir
    # --icon: El icono oficial
    # --add-data: Incluir scripts secundarios
    # --name: Nombre profesional
    
    distpath = "USB"
    pyinstaller_cmd = [
        "pyinstaller",
        "--onefile",
        "--windowed",
        f"--icon=gulugulu.ico",
        "--add-data=activation.py;.",
        "--add-data=automation.py;.",
        "--name=Iniciar Gulugulu",
        "--distpath=USB",
        "launcher.py"
    ]
    
    print(f"Ejecutando: {' '.join(pyinstaller_cmd)}")
    
    try:
        subprocess.run(pyinstaller_cmd, check=True)
        print("\n--- ¡CONSTRUCCIÓN EXITOSA! ---")
        print("El ejecutable se encuentra en la carpeta: USB/Iniciar Gulugulu.exe")
        
        # Limpieza de archivos temporales de build
        if os.path.exists("build"): shutil.rmtree("build")
        if os.path.exists("Iniciar Gulugulu.spec"): os.remove("Iniciar Gulugulu.spec")
        
    except subprocess.CalledProcessError as e:
        print(f"\nError durante la construcción: {e}")

if __name__ == "__main__":
    build()
