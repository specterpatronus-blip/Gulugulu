import customtkinter as ctk
import tkinter as tk
from PIL import Image
import os
import sys
import threading
from activation import ActivationManager
from automation import AutomationSystem

class GuluguluLauncher(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Verificar permisos de administrador al inicio
        if not AutomationSystem.is_admin():
            # Intentar elevar privilegios si no los tiene
            # En un entorno real, esto mostraría el prompt de UAC de Windows
            pass

        self.title("Gulugulu - Instalador Oficial")
        self.geometry("800x600")
        self.resizable(False, False)

        # Cargar icono oficial si existe
        if os.path.exists("gulugulu.ico"):
            self.iconbitmap("gulugulu.ico")
        elif os.path.exists("USB/gulugulu.ico"):
            self.iconbitmap("USB/gulugulu.ico")

        # Configuración de apariencia
        ctk.set_appearance_mode("light")
        ctk.set_default_color_theme("blue")

        # Contenedor principal para las pantallas
        self.main_container = ctk.CTkFrame(self, fg_color="transparent")
        self.main_container.pack(fill="both", expand=True, padx=40, pady=40)

        # Estado del instalador
        self.is_server = True
        self.activation_code = ""
        self.create_hotspot = False
        
        # Iniciar en la pantalla de bienvenida
        self.show_welcome()

    def clear_container(self):
        for widget in self.main_container.winfo_children():
            widget.destroy()

    def show_welcome(self):
        self.clear_container()
        
        # Logo (🦉)
        logo_label = ctk.CTkLabel(self.main_container, text="🦉", font=("Arial", 80))
        logo_label.pack(pady=(40, 10))
        
        title_label = ctk.CTkLabel(self.main_container, text="Gulugulu", font=("Plus Jakarta Sans", 48, "bold"))
        title_label.pack()
        
        subtitle_label = ctk.CTkLabel(self.main_container, 
                                     text="Convierte este computador en una\nbiblioteca educativa offline.",
                                     font=("Plus Jakarta Sans", 18),
                                     text_color="gray")
        subtitle_label.pack(pady=20)
        
        start_button = ctk.CTkButton(self.main_container, 
                                    text="Comenzar Instalación", 
                                    font=("Plus Jakarta Sans", 16, "bold"),
                                    height=50,
                                    width=250,
                                    corner_radius=10,
                                    command=self.show_role_selection)
        start_button.pack(pady=40)

    def show_role_selection(self):
        self.clear_container()
        
        back_btn = ctk.CTkButton(self.main_container, text="← Volver", width=80, height=30, 
                                 fg_color="transparent", text_color="gray", command=self.show_welcome)
        back_btn.pack(anchor="nw")

        title = ctk.CTkLabel(self.main_container, text="Configuración de Servidor", font=("Plus Jakarta Sans", 24, "bold"))
        title.pack(pady=(20, 10))
        
        desc = ctk.CTkLabel(self.main_container, 
                           text="¿Este computador será el servidor principal?\n"
                                "El servidor almacena todo el contenido y permite que otros\n"
                                "dispositivos se conecten a él.",
                           font=("Plus Jakarta Sans", 14),
                           text_color="gray")
        desc.pack(pady=10)

        # Botones de opción
        btn_server = ctk.CTkButton(self.main_container, 
                                  text="Sí, este será el servidor", 
                                  height=60, width=400, corner_radius=15,
                                  command=lambda: self.set_role(True))
        btn_server.pack(pady=10)
        
        btn_client = ctk.CTkButton(self.main_container, 
                                    text="No, solo quiero conectarme a un servidor existente", 
                                    height=60, width=400, corner_radius=15,
                                    fg_color="#f0f0f0", text_color="black", hover_color="#e0e0e0",
                                    command=lambda: self.set_role(False))
        btn_client.pack(pady=10)

    def set_role(self, is_server):
        self.is_server = is_server
        if is_server:
            self.show_license()
        else:
            # Flujo de cliente (simplemente crear acceso directo a la IP)
            self.show_success(is_client=True)

    def show_license(self):
        self.clear_container()
        
        title = ctk.CTkLabel(self.main_container, text="Políticas y Privacidad", font=("Plus Jakarta Sans", 24, "bold"))
        title.pack(pady=(0, 10))
        
        textbox = ctk.CTkTextbox(self.main_container, width=600, height=250)
        textbox.pack(pady=10)
        textbox.insert("0.0", "TÉRMINOS DE USO DE GULUGULU\n\n"
                             "1. USO EDUCATIVO: Este software está diseñado para fortalecer el aprendizaje en entornos rurales y urbanos.\n"
                             "2. LICENCIA ÚNICA: El código de activación es personal para esta institución y está vinculado al hardware de este servidor.\n"
                             "3. PRIVACIDAD TOTAL: Gulugulu no requiere conexión a internet. Ningún dato sale de este computador.\n"
                             "4. SEGURIDAD: Se prohíbe la modificación de los archivos del núcleo del sistema.\n\n"
                             "Al continuar, usted acepta que Gulugulu realice cambios en la configuración de red para permitir la conexión de estudiantes.")
        textbox.configure(state="disabled")

        check_var = tk.BooleanVar()
        check = ctk.CTkCheckBox(self.main_container, text="He leído y acepto las condiciones", variable=check_var,
                               command=lambda: self.toggle_next_btn(check_var, next_btn))
        check.pack(pady=10)

        next_btn = ctk.CTkButton(self.main_container, text="Siguiente", state="disabled", 
                                command=self.show_activation)
        next_btn.pack(pady=10)

    def toggle_next_btn(self, var, btn):
        if var.get():
            btn.configure(state="normal")
        else:
            btn.configure(state="disabled")

    def show_activation(self):
        self.clear_container()
        
        title = ctk.CTkLabel(self.main_container, text="Activación de Gulugulu", font=("Plus Jakarta Sans", 24, "bold"))
        title.pack(pady=(20, 10))
        
        desc = ctk.CTkLabel(self.main_container, text="Ingresa el código que se encuentra en tu manual físico.",
                           text_color="gray")
        desc.pack()

        self.code_entry = ctk.CTkEntry(self.main_container, placeholder_text="GULU-XXXX-XXXX-XXXX",
                                     width=400, height=50, font=("Courier New", 20), justify="center")
        self.code_entry.pack(pady=30)
        
        self.error_label = ctk.CTkLabel(self.main_container, text="", text_color="red")
        self.error_label.pack()

        validate_btn = ctk.CTkButton(self.main_container, text="Verificar Código", 
                                    height=50, width=200, command=self.validate_code)
        validate_btn.pack(pady=10)

    def validate_code(self):
        code = self.code_entry.get().upper()
        success, message = ActivationManager.validate_key(code)
        if success:
            self.activation_code = code
            self.show_network_config()
        else:
            self.error_label.configure(text=message)

    def show_network_config(self):
        self.clear_container()
        
        title = ctk.CTkLabel(self.main_container, text="Configuración de Red", font=("Plus Jakarta Sans", 24, "bold"))
        title.pack(pady=(20, 10))
        
        desc = ctk.CTkLabel(self.main_container, 
                           text="¿Cómo se conectarán los estudiantes a este servidor?",
                           font=("Plus Jakarta Sans", 14))
        desc.pack(pady=10)

        btn_wifi = ctk.CTkButton(self.main_container, 
                               text="Ya tengo una red Wi-Fi o LAN\n(Los estudiantes ya están conectados)", 
                               height=80, width=450, corner_radius=15,
                               command=lambda: self.start_installation(hotspot=False))
        btn_wifi.pack(pady=10)
        
        btn_hotspot = ctk.CTkButton(self.main_container, 
                                  text="Crear una nueva red Wi-Fi\n(El computador emitirá la señal 'Gulugulu')", 
                                  height=80, width=450, corner_radius=15,
                                  fg_color="#2b5ce7",
                                  command=lambda: self.start_installation(hotspot=True))
        btn_hotspot.pack(pady=10)

    def start_installation(self, hotspot=False):
        self.create_hotspot = hotspot
        self.clear_container()
        
        self.progress_label = ctk.CTkLabel(self.main_container, text="Iniciando instalación...", 
                                         font=("Plus Jakarta Sans", 18))
        self.progress_label.pack(pady=(100, 20))
        
        self.progress_bar = ctk.CTkProgressBar(self.main_container, width=500)
        self.progress_bar.set(0)
        self.progress_bar.pack(pady=10)
        
        # Ejecutar la instalación pesada en un hilo separado para no congelar la UI
        threading.Thread(target=self.installation_worker, daemon=True).start()

    def installation_worker(self):
        """Hilo de trabajo que ejecuta la lógica de AutomationSystem."""
        steps = [
            ("Copiando archivos del sistema...", 0.2, lambda: AutomationSystem.deploy_payload(".data")),
            ("Configurando red local...", 0.5, lambda: AutomationSystem.create_wifi_hotspot() if self.create_hotspot else True),
            ("Registrando servicios de inicio...", 0.7, lambda: AutomationSystem.register_startup_task()),
            ("Sellando licencia en este equipo...", 0.9, lambda: ActivationManager.seal_hardware()),
            ("Finalizando configuración...", 1.0, lambda: True)
        ]

        for msg, progress, func in steps:
            self.progress_label.configure(text=msg)
            self.progress_bar.set(progress)
            success = func()
            if not success and progress < 0.8: # El hotspot puede fallar y aún así continuar
                print(f"Advertencia en paso: {msg}")
            
            # Pequeña pausa para que el usuario vea el progreso
            import time
            time.sleep(1)

        self.after(0, self.show_success)

    def show_success(self, is_client=False):
        self.clear_container()
        
        success_label = ctk.CTkLabel(self.main_container, text="🎉", font=("Arial", 80))
        success_label.pack(pady=(40, 10))
        
        title_text = "¡Gulugulu está listo!" if not is_client else "¡Conexión Configurada!"
        title = ctk.CTkLabel(self.main_container, text=title_text, font=("Plus Jakarta Sans", 32, "bold"))
        title.pack()
        
        info_frame = ctk.CTkFrame(self.main_container, fg_color="#f8f9fa", corner_radius=10)
        info_frame.pack(pady=30, padx=50, fill="x")
        
        local_ip = AutomationSystem.get_local_ip()
        info_text = f"Los estudiantes pueden acceder en:\nhttp://{local_ip}"
        if self.create_hotspot:
            info_text += "\n\nRed Wi-Fi: Gulugulu_Escuela\nContraseña: GuluPassword2026"

        url_label = ctk.CTkLabel(info_frame, text=info_text, 
                                font=("Plus Jakarta Sans", 16, "bold"), text_color="#2b5ce7")
        url_label.pack(pady=20)
        
        finish_btn = ctk.CTkButton(self.main_container, text="Terminar y Abrir", height=50, width=250,
                                  command=self.quit)
        finish_btn.pack()

if __name__ == "__main__":
    app = GuluguluLauncher()
    app.mainloop()

if __name__ == "__main__":
    app = GuluguluLauncher()
    app.mainloop()
