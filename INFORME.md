# INFORME TÉCNICO DEL PROYECTO GULUGULU 🐧

Este documento proporciona una visión general técnica y funcional del sistema **Gulugulu**, una plataforma educativa diseñada para la gestión y búsqueda de recursos escolares.

---

### 1. ¿Qué lenguajes se están utilizando?
El proyecto es una aplicación web full-stack que utiliza:
*   **Python (Backend):** El "cerebro" del sistema, encargado de procesar datos, manejar la base de datos y servir las páginas.
*   **HTML5 (Estructura):** Define el esqueleto y contenido de todas las páginas web.
*   **CSS3 (Diseño):** Se utiliza para toda la estética, animaciones y el diseño responsivo (adaptable a móviles).
*   **JavaScript (Interactividad):** Maneja las funciones en tiempo real, como la carga dinámica de resultados sin recargar la página y animaciones avanzadas (GSAP).
*   **SQL (Base de Datos):** El lenguaje para hablar con la base de datos SQLite.

---

### 2. ¿Usa APIs? ¿Cuáles y para qué?
El proyecto utiliza dos tipos de APIs:

**APIs Internas (Propias):**
*   `/search`: Permite al frontend pedir resultados de búsqueda filtrados al servidor.
*   `/autocomplete`: Devuelve sugerencias de nombres de archivos mientras el usuario escribe.
*   `/admin/upload` y `/admin/delete`: Manejan la subida y borrado de archivos.

**APIs Externas (Servicios de terceros):**
*   **Google Fonts & Icons:** Para cargar la tipografía moderna y los iconos visuales.
*   **GSAP (GreenSock Animation Platform):** Una librería externa para lograr animaciones fluidas y profesionales.

---

### 3. ¿Qué hace Python y cómo abre el servidor?
Python utiliza un "framework" llamado **Flask**. Su función es:
1.  **Escuchar peticiones:** Cuando alguien entra a la web, Python recibe la orden.
2.  **Procesar lógica:** Decide qué archivos mostrar, verifica si un profesor tiene permiso para entrar, etc.
3.  **Servidor:** Abre el servidor usando el comando `app.run()`, lo que permite que la aplicación esté disponible en una dirección IP (como `localhost:5000`) para que los navegadores puedan entrar.

---

### 4. ¿Cómo se hizo la conexión con la base de datos?
Se utiliza la librería nativa de Python `sqlite3`. 
*   Se creó un archivo llamado `database.db`.
*   En `app.py`, existe una función llamada `get_db_connection()` que abre un "puente" hacia ese archivo cada vez que necesitamos leer o guardar información (como el nombre de un archivo o los datos de un profesor).

---

### 5. Archivos más importantes y su función
*   **`app.py`:** Es el archivo principal. Contiene todas las rutas (páginas) y la lógica de seguridad y navegación.
*   **`search_engine.py`:** Es el motor de búsqueda. Escanea la carpeta de archivos y permite encontrarlos rápidamente por nombre.
*   **`init_db.py`:** El instalador. Se usa una vez para crear las tablas de la base de datos (usuarios, roles, metadatos).
*   **`templates/index.html`:** La cara principal del proyecto (donde está el buscador).
*   **`templates/admin_dashboard.html`:** El panel de control para los profesores.

---

### 6. Explicación del proyecto (Lenguaje no técnico)
Imagina que **Gulugulu** es una gran biblioteca digital escolar. 
1.  **Los Profesores** tienen una llave (usuario/contraseña) para entrar a una oficina (Dashboard) donde pueden poner libros nuevos en los estantes (Subir archivos) y ponerles etiquetas (Grado y Materia).
2.  **Los Estudiantes** entran a la recepción (Página principal) y usan un buscador inteligente para pedirle al bibliotecario (Python) que les traiga exactamente lo que necesitan (por ejemplo: "Fotos de Tercero de Matemáticas").
3.  **El Sistema** busca en sus registros (Base de datos) y en las cajas de almacenamiento (Carpeta BD) para entregarle al estudiante una lista de archivos listos para ver o descargar.

---

### 7. ¿Cómo se gestiona la base de datos?
Se utiliza **SQLite**, que es una base de datos ligera que no necesita un servidor aparte. 
*   **Gestión:** Se maneja mediante tablas. Una tabla guarda los usuarios, otra los roles (admin o maestro) y otra guarda los "metadatos" de los archivos (quién lo subió, de qué grado es, qué materia es).
*   **Persistencia:** Aunque apagues el servidor, los datos se quedan guardados en el archivo `database.db`.

---

### 8. Utilización de POST y GET (Métodos HTTP)
*   **GET (Obtener):** Se usa cuando solo quieres "pedir" información. Ejemplo: Buscar un archivo o cargar la página de inicio. Es el método por defecto de los navegadores.
*   **POST (Enviar):** Se usa cuando quieres "enviar" datos sensibles o archivos para que el servidor los guarde. Ejemplo: Iniciar sesión (para que la contraseña no se vea en la URL) o subir una guía de estudio.
*   **¿Por qué otros?** A veces se usa **PUT** o **DELETE**, pero en este proyecto se prefirió simplificar todo usando POST para las acciones que modifican datos, por ser más compatible y fácil de manejar en formularios HTML básicos.

---

### 9. Estructura de carpetas y archivos (Rápido)
*   **`/BD`**: La caja fuerte donde se guardan físicamente todos los archivos subidos.
*   **`/static`**: Contiene los "estéticos" (imágenes del logo, archivos CSS de diseño).
*   **`/templates`**: Contiene todas las páginas HTML (los dibujos de la web).
    *   **`/juegos`**: Una subcarpeta con minijuegos educativos.
*   **`app.py`**: El jefe que coordina todo.
*   **`search_engine.py`**: El experto en encontrar archivos.
*   **`database.db`**: El archivo donde vive toda la información escrita.
*   **`init_db.py`**: El constructor de la base de datos.
*   **`requirements.txt`**: Lista de herramientas de Python que el proyecto necesita para funcionar.

---
*Informe generado por Antigravity AI - 2026*
