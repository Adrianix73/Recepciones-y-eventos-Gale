package com.restobar1.restobar_rdr.controller;

import com.restobar1.restobar_rdr.entity.Producto;
import com.restobar1.restobar_rdr.services.ProductoService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // ── LISTAR ────────────────────────────────────────────────
    @GetMapping
    public List<Producto> listar() {
        return productoService.listarTodos();
    }

    // ── OBTENER POR ID ────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        Producto producto = productoService.obtenerPorId(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }

    // ── CREAR PRODUCTO (SOLO DATOS) ───────────────────────────
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> body) {
        try {
            Producto producto = productoService.guardar(
                    extraerTexto(body, "nombreProducto"),
                    extraerDouble(body, "precioActual"),
                    extraerTexto(body, "descripcion"),
                    extraerCategoriaId(body)
            );
            return ResponseEntity.ok(producto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al guardar el producto: " + e.getMessage());
        }
    }

    // ── EDITAR PRODUCTO (SOLO DATOS) ──────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id,
                                    @RequestBody Map<String, Object> body) {
        try {
            Producto producto = productoService.actualizar(
                    id,
                    extraerTexto(body, "nombreProducto"),
                    extraerDouble(body, "precioActual"),
                    extraerTexto(body, "descripcion"),
                    extraerCategoriaId(body)
            );
            return ResponseEntity.ok(producto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al actualizar el producto: " + e.getMessage());
        }
    }

    // ── SUBIR IMAGEN POR PRIMERA VEZ ──────────────────────────
    @PostMapping("/{id}/imagen")
    public ResponseEntity<?> subirImagen(@PathVariable Long id,
                                         @RequestParam("imagen") MultipartFile imagen) {
        try {
            Producto producto = productoService.subirImagen(id, imagen);
            return ResponseEntity.ok(producto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al subir la imagen: " + e.getMessage());
        }
    }

    // ── REEMPLAZAR IMAGEN ─────────────────────────────────────
    @PutMapping("/{id}/imagen")
    public ResponseEntity<?> reemplazarImagen(@PathVariable Long id,
                                              @RequestParam("imagen") MultipartFile imagen) {
        try {
            Producto producto = productoService.reemplazarImagen(id, imagen);
            return ResponseEntity.ok(producto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al reemplazar la imagen: " + e.getMessage());
        }
    }

    // ── OBTENER IMAGEN POR ID DEL PRODUCTO ────────────────────
    @GetMapping("/{id}/imagen")
    public ResponseEntity<Resource> obtenerImagen(@PathVariable Long id) {
        try {
            Path rutaImagen = productoService.obtenerRutaImagen(id);

            if (rutaImagen == null || !Files.exists(rutaImagen)) {
                return ResponseEntity.notFound().build();
            }

            Resource recurso = new UrlResource(rutaImagen.toUri());
            String contentType = Files.probeContentType(rutaImagen);

            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(recurso);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ── DESACTIVAR ────────────────────────────────────────────
    @PutMapping("/{id}/desactivar")
    public void desactivar(@PathVariable Long id) {
        productoService.desactivar(id);
    }

    // ── ACTIVAR ───────────────────────────────────────────────
    @PutMapping("/{id}/activar")
    public void activar(@PathVariable Long id) {
        productoService.activar(id);
    }

    // ── HELPERS PARA LEER EL JSON DEL FRONTEND ────────────────
    private String extraerTexto(Map<String, Object> body, String key) {
        Object value = body.get(key);
        return value == null ? null : value.toString().trim();
    }

    private Double extraerDouble(Map<String, Object> body, String key) {
        Object value = body.get(key);

        if (value == null) {
            return null;
        }

        if (value instanceof Number numero) {
            return numero.doubleValue();
        }

        return Double.valueOf(value.toString());
    }

    private Long extraerCategoriaId(Map<String, Object> body) {
        Object categoriaId = body.get("categoriaId");

        if (categoriaId instanceof Number numero) {
            return numero.longValue();
        }

        if (categoriaId != null && !categoriaId.toString().isBlank()) {
            return Long.valueOf(categoriaId.toString());
        }

        Object categoria = body.get("categoria");

        if (categoria instanceof Map<?, ?> categoriaMap) {
            Object id = categoriaMap.get("id");

            if (id instanceof Number numero) {
                return numero.longValue();
            }

            if (id != null && !id.toString().isBlank()) {
                return Long.valueOf(id.toString());
            }
        }

        return null;
    }
}