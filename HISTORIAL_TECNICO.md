# HISTORIAL TÉCNICO: PROYECTO GULUGULU (EXPLORADOR ESCOLAR UDEC)

Este documento detalla la evolución, arquitectura y mejoras implementadas en el proyecto **Gulugulu / Explorador Escolar**, diseñado para la Universidad de Cundinamarca (UDEC). Sirve como contexto técnico para desarrolladores y agentes de IA.

---

## 1. Visión General del Proyecto
Gulugulu es una plataforma educativa web diseñada para centralizar el acceso a material pedagógico. Permite la búsqueda inteligente de archivos, gestión de contenido por parte de docentes (Maestros) y administradores, y ofrece una sección de mini-juegos educativos para estudiantes.

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

## 4. Detalles Técnicos Clave (Para Agentes de IA)

### Rutas Críticas:
- `/`: Inicio / Buscador.
- `/admin`: Acceso administrativo.
- `/admin/dashboard`: Centro de control (Estadísticas, Archivos, Usuarios, Backups).
- `/search` y `/autocomplete`: Endpoints del motor de búsqueda.

### Estructura de Datos (SQLite):
- **Tablas:**
    - `roles`: `id`, `name` (admin, maestro).
    - `users`: `cedula`, `name`, `username`, `password` (hash), `role_id`.
    - `file_metadata`: `filename`, `uploader_name`, `upload_date`.

### Lógica de Seguridad:
- Las contraseñas se almacenan usando `pbkdf2:sha256` mediante `werkzeug.security`.
- Las sesiones controlan el acceso a rutas administrativas mediante `session.get('role')`.

---

## 5. Próximos Pasos y Escalabilidad
- **Optimización de Archivos:** Implementar generación de miniaturas para imágenes y videos en el dashboard.
- **Expansión de Juegos:** Finalizar la integración de motores de juegos para grados superiores (2º a 5º).
- **API Rest:** Posibilidad de exponer los archivos a otras aplicaciones institucionales de la UDEC.

---
*Documento generado para el contexto de desarrollo y mantenimiento continuo del proyecto Gulugulu.*
