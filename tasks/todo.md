# Plan de Trabajo - Corrección y Mejora del Buscador de Gulugulu V2

## Estado: ✅ COMPLETADO

## Objetivos del Plan
1. Corregir fallos de precisión en el buscador (activación de sinónimos, corrección de BM25 weights en FTS5 y ajuste de tokenizador para dígitos simples).
2. Unificar el autocompletado del inicio con los datos de V2 (`learning_objects` y `search_tokens`) haciéndolo compatible con el frontend actual.
3. Habilitar el correcto funcionamiento de los filtros de categoría del lado izquierdo (Fotos, Videos, Documentos, Música).
4. Implementar previsualización visual de PDFs, videos, imágenes, etc., utilizando las miniaturas WebP generadas por el pipeline de Gulugulu V2 en vez de un icono gris genérico.

---

## Tareas por Componente

### 1. Motor de Búsqueda (`core/search/search_engine.py`)
- [x] Integrar el expansor de sinónimos `self.expander.expand(query)` en la búsqueda V2.
- [x] Ajustar la tokenización para conservar números de un solo dígito (`len(t) > 1 or t.isdigit()`).
- [x] Corregir la consulta FTS5 y sus pesos de BM25 para asignar el peso máximo al título (`title` = 100.0) y un peso razonable a la materia (`subject_name` = 20.0).
- [x] Implementar el filtrado por categoría (`category`) mediante subconsultas SQL.

### 2. Backend Flask (`app.py`)
- [x] Refactorizar la ruta `/autocomplete` para invocar a `search_engine_v2.autocomplete(query)` y retornar una lista plana de strings compatible con el frontend.
- [x] Capturar el filtro de categoría `filter` en la ruta `/search` y pasarlo en el diccionario de filtros.
- [x] Extraer la extensión de archivo del path del recurso y añadirla como `ext` en la API de búsqueda.

### 3. Frontend (`templates/results.html`)
- [x] Añadir soporte para la categoría `'document'` en `typeStyles`.
- [x] Modificar la función `renderResults` para priorizar `item.thumbnail` al mostrar la previsualización visual de la tarjeta de resultados.
- [x] Asegurar que el badge de extensión (`item.ext`) se renderice correctamente en la tarjeta.

---

## Verificación y Resultados
- [x] **Pruebas de Integración**: Creado y ejecutado el script `test_routes.py` que pasa con éxito todas las validaciones de autocompletado, búsqueda por relevancia con sinónimos y filtros de categoría.
- [x] **Relevancia del Scoring**: La búsqueda por relevancia prioriza de manera precisa los títulos de los objetos de aprendizaje (e.g. buscar "Cuadernillo" devuelve cuadernillos específicos de matemáticas y no cualquier recurso de matemáticas al azar).
- [x] **Previsualizaciones en Frontend**: Modificado el frontend para utilizar las portadas y capturas WebP generadas por el backend en lugar de mostrar siempre un archivo gris.
