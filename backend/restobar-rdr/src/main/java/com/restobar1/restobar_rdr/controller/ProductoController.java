package com.restobar1.restobar_rdr.controller;

import com.restobar1.restobar_rdr.entity.Producto;
import com.restobar1.restobar_rdr.services.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        Producto p = productoService.obtenerPorId(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }

    // ── CREAR (CON IMAGEN) ──────────────────────────────────────
    @PostMapping("/con-imagen")
    public ResponseEntity<?> crear(
            @RequestParam("nombreProducto") String nombre,
            @RequestParam("precioActual")   Double precio,
            @RequestParam("descripcion")    String descripcion,
            @RequestParam("categoriaId")    Long categoriaId,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen
    ) {
        try {
            Producto p = productoService.guardar(
                    nombre, precio, descripcion, categoriaId, imagen
            );
            return ResponseEntity.ok(p);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al guardar el producto: " + e.getMessage());
        }
    }

    // ── EDITAR (CON IMAGEN) ─────────────────────────────────────
    @PutMapping("/{id}/con-imagen")
    public ResponseEntity<?> editar(
            @PathVariable                                      Long id,
            @RequestParam("nombreProducto")                    String nombre,
            @RequestParam("precioActual")                      Double precio,
            @RequestParam("descripcion")                       String descripcion,
            @RequestParam("categoriaId")                       Long categoriaId,
            @RequestParam(value = "imagen", required = false)  MultipartFile imagen
    ) {
        try {
            Producto p = productoService.actualizar(
                    id, nombre, precio, descripcion, categoriaId, imagen
            );
            return ResponseEntity.ok(p);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al actualizar el producto: " + e.getMessage());
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
}