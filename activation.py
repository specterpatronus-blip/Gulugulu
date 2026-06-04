import hashlib
import os
import subprocess
import platform

class ActivationManager:
    """Gestiona la activación offline mediante códigos manuales pre-definidos."""
    
    # --- CONFIGURACIÓN PARA EL ADMINISTRADOR ---
    # Cambia este código para cada USB que entregues.
    # Es el código que imprimirás en el manual físico.
    MASTER_KEY = "GULU-ESCUELA-2026" 
    
    # Ubicación discreta de la licencia en el PC servidor
    LICENSE_PATH = "C:\\ProgramData\\Gulugulu\\system.lic"

    @staticmethod
    def get_hwid():
        """Obtiene una huella única del hardware del PC (BIOS + CPU)."""
        try:
            # Intentar obtener serial de BIOS y Procesador en Windows
            bios = subprocess.check_output('wmic bios get serialnumber', shell=True).decode().split('\n')[1].strip()
            cpu = subprocess.check_output('wmic cpu get processorid', shell=True).decode().split('\n')[1].strip()
            raw_id = f"{bios}-{cpu}"
        except:
            # Fallback a nombre de nodo y procesador si falla wmic
            raw_id = f"{platform.node()}-{platform.processor()}"
        
        return hashlib.sha256(raw_id.encode()).hexdigest().upper()

    @classmethod
    def validate_key(cls, user_input):
        """
        Valida el código ingresado. 
        Retorna (True/False, Mensaje)
        """
        user_input = user_input.strip().upper()

        # 1. ¿El código coincide con el maestro definido para esta USB?
        if user_input != cls.MASTER_KEY:
            return False, "El código es incorrecto. Verifica tu manual físico."

        # 2. Verificar si ya existe un 'Sello de Hardware' en este PC
        if os.path.exists(cls.LICENSE_PATH):
            try:
                with open(cls.LICENSE_PATH, "r") as f:
                    stored_hwid = f.read().strip()
                
                # Si el HWID guardado coincide con el actual, permitimos (es una reinstalación)
                if stored_hwid == cls.get_hwid():
                    return True, "Licencia válida reconocida."
                else:
                    # Si el HWID es diferente, significa que intentan usar la USB en otro PC
                    return False, "Este código ya fue activado en otro computador."
            except:
                return False, "Error al leer la licencia local."

        # 3. Si no hay sello, es la primera vez. Permitimos avanzar.
        # El sellado real ocurre al final de la instalación exitosa.
        return True, "Código aceptado."

    @classmethod
    def seal_hardware(cls):
        """Guarda el HWID del PC actual para bloquear futuras instalaciones en otros PCs."""
        try:
            os.makedirs(os.path.dirname(cls.LICENSE_PATH), exist_ok=True)
            with open(cls.LICENSE_PATH, "w") as f:
                f.write(cls.get_hwid())
            # Ocultar el archivo (Atributo de Windows)
            subprocess.run(['attrib', '+h', cls.LICENSE_PATH], shell=True)
            return True
        except:
            return False

if __name__ == "__main__":
    # Test simple
    print(f"HWID de este equipo: {ActivationManager.get_hwid()}")
    print(f"Código Maestro actual: {ActivationManager.MASTER_KEY}")
