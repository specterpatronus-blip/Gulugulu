# HISTORIAL TÉCNICO: PROYECTO GULUGULU (EXPLORADOR ESCOLAR)

Este documento detalla la evolución, arquitectura y mejoras implementadas en el proyecto **Gulugulu / Explorador Escolar**, diseñado para instituciones y colegios publicos y privados. Sirve como contexto técnico para desarrolladores y agentes de IA.

---

## 1. Visión General del Proyecto
🌐 ¿Qué es Gulugulu? (pagina web)

Gulugulu es un buscador educativo local y offline, diseñado para funcionar como una especie de “internet sin internet” dentro de una comunidad (especialmente una escuela rural).
No depende de conexión externa: todo el conocimiento está almacenado localmente y accesible desde cualquier dispositivo conectado a la red interna.

🧠 La idea central

La idea de Gulugulu nace de un problema real:

El acceso al conocimiento no debería depender de tener internet.

En muchos contextos rurales o con infraestructura limitada:

El internet es inestable o inexistente

Los niños no pueden investigar, explorar o aprender libremente

La educación queda limitada a libros físicos y clases tradicionales

Gulugulu rompe esa barrera creando un entorno donde:

El conocimiento ya está ahí

El estudiante solo necesita curiosidad

El aprendizaje ocurre sin depender del mundo exterior

🖥️ ¿Cómo funciona Gulugulu?
1. Un servidor local (el “cerebro”)

Un computador central almacena:

Contenidos educativos (PDFs, videos, audios, textos)

Bases de datos de información

Un sistema de búsqueda optimizado

Este servidor crea una red local privada (Wi-Fi o LAN).

2. Dispositivos conectados (los “exploradores”)

Los estudiantes se conectan desde:

Otros PCs

Laptops

Tablets

Celulares

Abren un navegador y acceden a Gulugulu como si fuera Google, pero 100% local.

3. El buscador (el corazón del sistema)

El buscador:

Indexa todos los contenidos

Permite buscar por palabras clave

Muestra resultados claros y rápidos

No distrae, no rastrea, no muestra publicidad

Aquí Gulugulu no solo muestra archivos, sino que organiza el conocimiento.

🤖 ¿Por qué Gulugulu tiene identidad?

Gulugulu no es solo un sistema técnico, tiene una identidad pedagógica y emocional:

Es amigable → pensado para niños

Es curioso → invita a explorar

Es tranquilo → no abruma con información

Es seguro → contenido controlado y educativo

El robot/mascota y las animaciones no son decoración:
👉 humanizan el conocimiento y hacen que aprender sea una experiencia cercana.

🎓 ¿Qué problema educativo soluciona?

Gulugulu:

Reduce la brecha digital

Democratiza el acceso a la información

Fomenta el aprendizaje autónomo

Permite investigar sin miedo a “equivocarse”

Funciona incluso donde no hay nada más

Es especialmente poderoso en:

Escuelas rurales

Comunidades apartadas

Aulas sin internet

Proyectos educativos sociales

🧩 Lo profundo de la idea

Lo más importante de Gulugulu no es la tecnología.

Lo profundo es esto:

El conocimiento deja de ser algo que “se pide” a internet
y pasa a ser algo que “vive” en la comunidad.

Gulugulu:

Convierte un computador en una biblioteca viva

Convierte una red local en un ecosistema de aprendizaje

Convierte a los niños en exploradores, no solo receptores

🚀 En una frase

Gulugulu es un buscador offline que lleva el espíritu de internet a lugares donde internet nunca llegó.

## 2. Arquitectura del Sistema
El proyecto sigue una arquitectura monolítica ligera pero robusta:

- **Backend:** Flask (Python) con procesamiento multihilo para tareas en segundo plano.
- **Base de Datos:** SQLite3 para persistencia de usuarios, roles y metadatos de archivos.
- **Frontend:** HTML5, CSS3 con estética premium y JavaScript moderno (Vanilla/Vue.js).
- **Motor de Búsqueda:** Motor personalizado en memoria con lógica de puntuación y expansión por sinónimos.

---

## 3. Mejoras Implementadas (Historial de Desarrollo)

### A. Motor de Búsqueda Inteligente (Search Engine V2)
- **Indexación en Memoria:** Los archivos del directorio `BD/` se indexan al arrancar y tras cada cambio, permitiendo búsquedas instantáneas.
- **Sistema de Sinónimos:** Implementación de `synonyms.json` que permite encontrar resultados relacionados (ej. buscar "sumas" y encontrar archivos de "matemáticas").
- **Algoritmo de Scoring:** Prioriza coincidencias exactas en el nombre (10 pts), prefijos (5 pts) y subcadenas (2 pts).
- **Filtrado Avanzado:** Capacidad de filtrar por categorías: Imágenes, Videos, Documentos (PDF, Word, Excel, PPT) y Audio.

### B. Dashboard Administrativo Profesional
- **Estadísticas en Tiempo Real:** Visualización de archivos totales, peso total del repositorio, distribución por tipo y cantidad de usuarios activos.
- **Gestión de Archivos con Trazabilidad:** Al subir un archivo, se registra automáticamente el nombre del docente que lo subió y la fecha exacta en la base de datos (`file_metadata`).
- **Gestión de Usuarios:** CRUD completo para cuentas de "Maestros", permitiendo al Administrador crear, editar y eliminar accesos.

### C. Sistema de Backups y Resiliencia
- **Backups Automáticos:** Un hilo secundario (`threading`) realiza copias de seguridad de la base de datos y archivos semanalmente.
- **Backups Manuales:** Interfaz en el dashboard para generar snapshots instantáneos en formato `.db` y `.zip`.
- **Restauración Inteligente:** Sistema de recuperación ante desastres que permite restaurar la base de datos o el repositorio de archivos desde la interfaz.
- **Modo de Recuperación:** Si la base de datos se corrompe o desaparece, el sistema redirige a una página de error (`db_error.html`) que permite restaurar un backup sin necesidad de acceso manual al servidor.

### D. Experiencia de Usuario (UX/UI)
- **Interfaz "Gulugulu":** Diseño moderno con fondos dinámicos, glassmorphism y micro-animaciones.
- **Sección de Minijuegos:** Estructura modular para juegos educativos organizados por grado y nivel.
- **Autocompletado:** Buscador con sugerencias inteligentes basadas en el índice de archivos actual.

---

## 4. Migración Arquitectónica: Gulugulu V2 (Ecosistema Pedagógico)

En mayo de 2026, se implementó una migración estructural completa para evolucionar el sistema de un "gestor de archivos" a un "ecosistema de conocimiento conectado".

### A. Capa Fundacional y Modelo de Datos
- **Enfoque en Recursos (Resource-First):** Transición de una arquitectura centrada en archivos físicos a una centrada en **Objetos de Aprendizaje (Learning Objects)**.
- **Nuevo Esquema SQLite V2:** Introducción de tablas normalizadas: `learning_objects`, `resources`, `knowledge_graph`, `subjects`, `grades`, `file_types` y `search_tokens`.
- **Sistema de IDs Dual:** Implementación de IDs técnicos (UUID) e IDs pedagógicos legibles (ej. `LO-MAT-G3-4C87`).

### B. Refactorización de Almacenamiento (Storage Manager)
- **Gestión Centralizada:** Creación del `StorageManager` para abstraer operaciones de archivos.
- **Naming Profesional:** Adopción del estándar `[SUBJECT]-[GRADE]-[CORRELATIVE]-[TYPE].[EXT]`.
- **Deduplicación por Hardware:** Uso de hashes **SHA256** para evitar la duplicidad física de archivos y garantizar la integridad de los datos.
- **Estructura Jerárquica:** Organización física por categorías y niveles (ej. `storage/videos/matematicas/g5/`).

### C. Pipeline de Ingestión Inteligente
- **Procesamiento Asíncrono:** Pipeline basado en `threading` para procesamiento en segundo plano sin bloquear la aplicación.
- **Extracción de Contenido:** 
    - **PDF:** Extracción de texto completo.
    - **Imágenes:** OCR automático vía Tesseract.
    - **Videos:** Extracción de metadatos técnicos y generación de frames de preview.
- **Generación de Visuales:** Creación automática de miniaturas en formato **WebP** para optimización de carga.

### D. Motor de Búsqueda Avanzado (Search V2)
- **Núcleo FTS5:** Implementación de tablas virtuales de SQLite para búsqueda de texto completo de alto rendimiento.
- **Expansión Pedagógica:** Sistema de sinónimos educativos (ej. buscar "fauna" encuentra "animales") mediante `search_tokens`.
- **Scoring Híbrido:** Algoritmo de ranking que combina relevancia textual (BM25), curación pedagógica y estado de verificación.
- **Snippets Contextuales:** Visualización de fragmentos de texto resaltados en los resultados de búsqueda.

### E. Grafo de Conocimiento (Knowledge Graph)
- **Relaciones Educativas:** Capacidad de definir prerrequisitos, continuaciones y contenido relacionado entre lecciones.
- **Motor de Recomendaciones:** Sugerencias basadas en proximidad temática y progresión de grados.
- **Learning Paths:** Estructura para definir rutas de aprendizaje secuenciales y guiadas.

### F. Expansión y Linealización de Minijuegos (Grados 3-5)
- **Escalabilidad de Niveles:** Expansión del catálogo de 10 a **20 juegos por grado** para los niveles de 3º, 4º y 5º primaria.
- **Nuevo Modelo de Progresión Lineal:** Implementación de un flujo de juego secuencial (del 1 al 20) obligatorio para grados superiores, eliminando la selección libre para fomentar la persistencia académica.
- **Lógica de Tolerancia a Errores:** Ajuste del motor de evaluación para aceptar respuestas incorrectas sin reiniciar el nivel actual, permitiendo el avance al siguiente juego pero penalizando el puntaje total acumulado (persistido en `sessionStorage`).
- **Eliminación de Cronómetros:** Remoción de los contadores de tiempo en todos los minijuegos para reducir el estrés cognitivo y priorizar la precisión del aprendizaje sobre la velocidad de respuesta.
- **Interfaz de Progreso Dinámica:** Actualización de la UI para mostrar indicadores de avance "Juego X de 20" y resúmenes de rendimiento final (ej. `[[ totalScore ]]/20`).

### G. Persistencia de Interfaz y Enrutador SPA (Fullscreen Engine)
- **Motor SPA Router Nativo:** Desarrollo de un enrutador híbrido (`fullscreen.js`) basado en `fetch` y `DOMParser` que intercepta las navegaciones para reemplazar dinámicamente el `body`, evitando las recargas totales del navegador.
- **Persistencia de Pantalla Completa:** Sistema que permite al usuario mantener el modo "Pantalla Completa" ininterrumpido a través de todo el entorno educativo (buscador, dashboard y minijuegos), sorteando las restricciones de seguridad estándar de los navegadores.
- **Resolución de Conflictos JS:** Implementación de estrategias de aislamiento (IIFE) para todos los scripts en línea y scripts externos de juegos, evitando colisiones de ámbito léxico (`SyntaxError`) al reutilizar la instancia de memoria global.
- **Sincronización de Dependencias (Head Scripts):** Optimización del inyector del SPA para identificar, pre-cargar y sincronizar dependencias de `<head>` faltantes (como el core de Vue.js) en transiciones de páginas sin causar desgarros visuales.
- **Unificación de UI:** Estandarización de los controles de la cabecera e inyección del estado de persistencia de forma global, incluyendo vistas de administradores y pantallas de login de maestros.

### H. Refinamiento de Relevancia Pedagógica (Search Engine Precision)
- **Massive Boosting de Títulos y Materias:** Reconfiguración del algoritmo de ranking (BM25) para otorgar un peso **50x mayor al título** y **100x mayor a la materia** comparado con el contenido extraído. Esto soluciona falsos positivos donde búsquedas como "mate" devolvían archivos de otras materias que mencionaban "material".
- **Búsqueda por Prefijos (*) Dinámica:** Implementación de expansión automática de términos con comodines al final de cada palabra, facilitando la búsqueda para usuarios infantiles que no terminan de escribir los términos.
- **Normalización de Filtros Indestructible:** Rediseño de la lógica de filtrado para aceptar indistintamente IDs numéricos o nombres de materias/grados, garantizando que los controles de la interfaz web funcionen siempre, sin importar el formato enviado.
- **Formateo Visual de Títulos (UX Infantil):** Integración de un formateador de texto dinámico que limpia nombres de archivos técnicos (elimina guiones, códigos y extensiones) para mostrar títulos legibles y amigables.
- **Resiliencia de Fallback (LIKE Search):** Implementación de un motor de búsqueda de respaldo basado en coincidencias parciales (LIKE) que se activa automáticamente si la consulta FTS5 falla o no arroja resultados, asegurando que el buscador "siempre responda".

### I. Optimización Integral y Depuración de Estabilidad
- **Eliminación de Animaciones Críticas:** Remoción completa de librerías de animación pesadas (GSAP) y efectos de entrada ("split text", opacidades progresivas) para lograr una carga instantánea y reducir el consumo de CPU/RAM en hardware antiguo.
- **Motor SPA V4 (Anti-Flicker):** Rediseño del enrutador nativo para implementar sincronización inteligente de estilos CSS y reemplazo atómico del DOM, eliminando los parpadeos blancos (FOUC) durante la navegación entre secciones.
- **Auto-Recuperación de Pantalla Completa:** Implementación de lógica de restauración automática del modo "Full Screen" basada en la primera interacción del usuario tras un cambio de página, garantizando la persistencia de la interfaz a pesar de las restricciones de seguridad del navegador.
- **Optimización de Consultas (Anti N+1):** Refactorización de la capa de datos para que el motor de búsqueda devuelva toda la metadata enriquecida (rutas, tipos, miniaturas) en una única consulta SQL, reduciendo la latencia de respuesta en más de un 70%.
- **Mascota Estática de Bajo Consumo:** Desactivación de animaciones infinitas de la mascota robótica para liberar ciclos de procesamiento en segundo plano, manteniendo la estética mediante sombras fijas de alto rendimiento.
- **Depuración de Filtros y Rutas:** Corrección de inconsistencias en el filtrado por materia/grado y aseguramiento del mapeo correcto de archivos desde el nuevo sistema de almacenamiento centralizado (`storage/`).
- **Bypass de Enrutador SPA para Minijuegos (Vue):** Se corrigió una discrepancia en `static/js/fullscreen.js` donde `VUE_PATHS` buscaba `'/juegos/'` (plural) en lugar de `'/juego/'` (singular). Para evitar race conditions, fugas de memoria y acumulación de timers/listeners en segundo plano, se configuró tanto la entrada como la salida de las páginas de minijuegos para forzar una navegación tradicional limpia nativa (`window.location.href`), liberando la reactividad de Vue al salir del juego.
- **Resolución de Congelamiento en Retorno SPA:** Se eliminó el wrapper `DOMContentLoaded` del bloque de script en `templates/minijuegos.html` encapsulándolo en un IIFE de ejecución inmediata. Esto soluciona el congelamiento que sufría la vista de grados al volver de un juego, ya que la navegación SPA mediante reemplazo de cuerpo (body swap) no dispara dicho evento del ciclo de vida del navegador.
- **Control de Caché de Recursos Estáticos:** Se implementó un middleware `@app.after_request` en `app.py` que fuerza cabeceras `Cache-Control: no-cache` para todas las respuestas de recursos estáticos en entornos locales/fuera de línea. Esto garantiza que las actualizaciones en scripts (`fullscreen.js`) y estilos sean aplicadas inmediatamente en el navegador del usuario sin requerir limpiezas manuales de caché.

### J. Alineación Curricular y Corrección de Errores de Minijuegos (Grados 2-5)
- **Correcciones de Grado 2**:
  - *Doble y Mitad*: Se restringió la generación en el Juego 1 para que las preguntas de mitad usen únicamente números pares, evitando respuestas decimales inapropiadas para segundo grado.
  - *Sílaba Faltante*: Se corrigió la palabra en el Juego 17 de `CA _ SA` a `CA _ A` con respuesta `SA` para formar la palabra "casa" de forma coherente.
  - *Orden Alfabético*: Se eliminó la tilde de `Árbol` a `Arbol` en el Juego 20 para evitar problemas de ordenamiento regional en español en navegadores sin soporte locale avanzado.
- **Correcciones de Grado 3**:
  - *Sistema Solar*: Se excluyó el Sol de la lista de planetas en el Juego 4 y se reescribió el enunciado a "Ordena los planetas desde el más cercano al Sol 🪐" para adecuación astronómica.
  - *Estados de la Materia*: Se renombró el Juego 8 de "Estados del Agua" a "Estados de la Materia" para dar validez científica a la clasificación de "Piedra" (Sólido) y "Leche" (Líquido).
  - *Multiplicaciones x10/x100*: Se eliminaron opciones duplicadas en el generador de distractores del Juego 15 cuando el multiplicador es 10.
- **Correcciones de Grado 4**:
  - *Fracciones Equivalentes*: Se implementó un validador cruzado dinámico en el generador del Juego 1 que garantiza que ningún distractor sea matemáticamente equivalente a la fracción original.
  - *Orden de Operaciones*: Se eliminó el exponente cuadrático ($2^2$) en el Juego 10 y se sustituyó por una expresión con operaciones básicas para alinearse con los estándares del MEN para cuarto grado.
  - *Clasificación de Triángulos*: Se modificó el generador de lados para el caso del triángulo Escaleno en el Juego 14 para asegurar que los lados generados satisfagan siempre el Teorema de la Desigualdad Triangular ($a+b>c$).
- **Correcciones de Grado 5**:
  - *División Decimal*: Se reescribió el generador en el Juego 15 para proponer divisiones con números decimales reales y distractores con decimales flotantes apropiados en lugar de divisiones de enteros con formato `.0`.
  - *Ángulos del Triángulo*: Se integró y estandarizó la inicialización del Juego 9 en el registro `inits` para asegurar su correcto reinicio y re-evaluación al reintentar el juego.

---

## 5. Detalles Técnicos Clave (Para Agentes de IA)

### Nuevas Rutas Críticas (API V2):
- `/api/v2/search`: Búsqueda híbrida con filtros avanzados.
- `/api/v2/autocomplete`: Sugerencias pedagógicas instantáneas.
- `/api/v2/related/<id>`: Navegación por el grafo de conocimiento.
- `/api/v2/recommendations/<id>`: Motor de sugerencias contextuales.
- `/api/v2/paths`: Acceso a rutas de aprendizaje curadas.

### Estructura de Carpetas V2:
- `core/`: Lógica central (database, search, pipeline, knowledge).
- `storage/`: Repositorio físico organizado de recursos y miniaturas.

---

## 6. Próximos Pasos y Escalabilidad
- **Optimización de Archivos:** Implementar generación de miniaturas para imágenes y videos en el dashboard.
- **API Rest:** Posibilidad de exponer los archivos a otras aplicaciones institucionales de la UDEC.
- **Gamificación Avanzada:** Implementar sistema de medallas y logros persistentes basados en los puntajes de los 20 niveles.


---
*Documento generado para el contexto de desarrollo y mantenimiento continuo del proyecto Gulugulu.*
### K. Optimización de Minijuegos y Migración de Activos (Mayo 2026)
- **Depuración Integral de Estabilidad:** Se realizó una auditoría completa de los 100+ minijuegos, corrigiendo errores críticos de vinculación de variables (especialmente en 2º Grado) que causaban fallos en la renderización y comportamientos erráticos.
- **Migración a Activos de Alta Calidad (GIconEngine v1.2):** Reemplazo sistemático de emojis estándar y fuentes de iconos por imágenes temáticas de alta resolución almacenadas en `static/images/minijuegos/`. Se implementó un motor de iconos con caché para reducir la sobrecarga de procesamiento en tiempo de ejecución.
- **Optimización de Rendimiento para Hardware Antiguo:**
    - **Aceleración de Hardware:** Implementación de `will-change: transform` y `transform: translateZ(0)` en fondos pesados (como el archivo `fondo.webp` de 7.8MB) para delegar el renderizado a la GPU.
    - **Aislamiento de Layout:** Uso de la propiedad CSS `contain: layout` en los lienzos de juego para limitar el alcance de los recalculados de diseño del navegador.
- **Refuerzo de la Interfaz Visual (UX Infantil):** Estandarización de modales de victoria con iconografía temática y adición de indicadores visuales claros (✅/❌) en botones de opción para mejorar la retroalimentación inmediata al estudiante.
- **Corrección de "Salto de Nivel" Prematuro:** Ajuste en la lógica de inicialización para garantizar que el estado de victoria se resetee correctamente al navegar entre juegos mediante el enrutador SPA.

---
## 7. Gulugulu Launcher & Installer (Mayo 2026)


Se desarrolló el instalador oficial para Windows, diseñado para una experiencia de usuario "Cero-Fricción" en entornos escolares rurales.

### A. Arquitectura de Distribución (USB Portable)
- **Ejecutable Único:** `Iniciar Gulugulu.exe` (Compilado con PyInstaller).
- **Payload Oculto (`.data/`):** Contiene el núcleo de la aplicación, recursos visuales y el runtime de Python.
- **Portabilidad Total:** No requiere instalación previa de dependencias en el sistema operativo del usuario.

### B. Sistema de Activación "Seal-on-First-Use"
- **Validación Manual:** El administrador define una `MASTER_KEY` pre-compartida (impresa en el manual físico).
- **Hardware Binding:** Al activar, el sistema genera una huella digital (**HWID**) basada en el serial de la BIOS y el ID del Procesador (vía `wmic`).
- **Sello de Licencia:** Se crea un archivo de licencia encriptado y oculto (`C:\ProgramData\Gulugulu\system.lic`) que vincula permanentemente el código a ese hardware.
- **Antipiratería Offline:** Bloquea automáticamente el re-uso de la misma USB/Código en diferentes computadores al detectar discrepancias en el HWID.

### C. Automatización de Red y Sistema (Automation Engine)
- **Hotspot WiFi Automático:** Lógica para configurar y activar el modo `hostednetwork` de Windows (`netsh`), permitiendo que el servidor emita su propia señal Wi-Fi sin router externo.
- **Despliegue Silencioso:** Uso de `robocopy` para la transferencia eficiente de gigabytes de contenido educativo al disco local (`C:\ProgramData\Gulugulu`).
- **Persistencia en el Inicio:** Registro automático en el **Programador de Tareas** para garantizar que el servidor inicie con privilegios máximos al encender el equipo.
- **Gestión de Privilegios:** Integración nativa con el sistema de control de cuentas de usuario (UAC) de Windows.

### D. Interfaz de Usuario (UX Premium)
- **Stack:** Desarrollado con `CustomTkinter` para lograr una estética moderna, minimalista y educativa.
- **Identidad Visual:** Integración del icono oficial, paleta de colores coherente y transiciones fluidas.
- **Multithreading:** Ejecución de procesos pesados (copia de archivos, configuración de red) en hilos secundarios para mantener la respuesta de la interfaz.
