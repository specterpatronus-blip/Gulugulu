import os
import subprocess
import shutil
import ctypes
import sys
from activation import ActivationManager

class AutomationSystem:
    """Maneja las configuraciones críticas de Windows: Red, Archivos y Servicios."""

    INSTALL_PATH = "C:\\ProgramData\\Gulugulu"
    
    @staticmethod
    def is_admin():
        """Verifica si el proceso tiene permisos de administrador."""
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            return False

    @staticmethod
    def run_as_admin():
        """Reinicia el script actual con privilegios de administrador."""
        ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, " ".join(sys.argv), None, 1)

    # --- GESTIÓN DE RED ---
    
    @classmethod
    def create_wifi_hotspot(cls, ssid="Gulugulu_Escuela", password="GuluPassword2026"):
        """Crea un punto de acceso Wi-Fi local en Windows."""
        try:
            # Configurar la red hospedada
            subprocess.run(f'netsh wlan set hostednetwork mode=allow ssid={ssid} key={password}', shell=True, check=True)
            # Iniciar la red
            subprocess.run('netsh wlan start hostednetwork', shell=True, check=True)
            return True, f"Red '{ssid}' creada con éxito."
        except subprocess.CalledProcessError as e:
            return False, f"Error al crear la red: El hardware podría no soportar Hosted Network."

    @staticmethod
    def get_local_ip():
        """Obtiene la IP local actual para mostrar al usuario."""
        try:
            output = subprocess.check_output('ipconfig').decode('latin-1')
            for line in output.split('\n'):
                if "IPv4" in line:
                    return line.split(':')[-1].strip()
            return "127.0.0.1"
        except:
            return "127.0.0.1"

    # --- INSTALACIÓN SILENCIOSA ---

    @classmethod
    def deploy_payload(cls, source_path=".data"):
        """Copia el payload de la USB al disco local de forma silenciosa."""
        if not os.path.exists(cls.INSTALL_PATH):
            os.makedirs(cls.INSTALL_PATH, exist_ok=True)
        
        try:
            # Usamos robocopy por ser más robusto y rápido para grandes volúmenes
            subprocess.run(f'robocopy "{source_path}" "{cls.INSTALL_PATH}" /E /MT /R:5 /W:5 /NP', shell=True)
            return True
        except Exception as e:
            print(f"Error en despliegue: {e}")
            return False

    # --- AUTO-INICIO (Persistence) ---

    @classmethod
    def register_startup_task(cls):
        """Registra Gulugulu en el Programador de Tareas para que inicie con Windows."""
        task_name = "GuluguluServer"
        # Ruta al ejecutable de python dentro de la instalación y el script app.py
        python_exe = os.path.join(cls.INSTALL_PATH, "python", "python.exe")
        app_script = os.path.join(cls.INSTALL_PATH, "core", "app.py")
        
        # Comando para crear la tarea programada (Ejecutar al iniciar sesión, con privilegios máximos)
        cmd = (f'schtasks /create /tn "{task_name}" /tr "\"{python_exe}\" \"{app_script}\"" '
               f'/sc onlogon /rl highest /f')
        
        try:
            subprocess.run(cmd, shell=True, check=True)
            return True
        except subprocess.CalledProcessError:
            return False

    # --- LIMPIEZA / DESINSTALACIÓN ---

    @classmethod
    def uninstall(cls):
        """Elimina rastros del sistema."""
        try:
            subprocess.run(f'schtasks /delete /tn "GuluguluServer" /f', shell=True)
            if os.path.exists(cls.INSTALL_PATH):
                shutil.rmtree(cls.INSTALL_PATH)
            return True
        except:
            return False

if __name__ == "__main__":
    # Test de administrador
    if not AutomationSystem.is_admin():
        print("Solicitando permisos de administrador...")
        # AutomationSystem.run_as_admin() # Descomentar para probar elevación real
    else:
        print("Ejecutando con permisos de administrador.")
        # print(AutomationSystem.get_local_ip())
