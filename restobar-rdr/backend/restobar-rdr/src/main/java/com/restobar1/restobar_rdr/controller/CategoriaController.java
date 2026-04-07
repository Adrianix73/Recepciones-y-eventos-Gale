package com.restobar1.restobar_rdr.controller;

import com.restobar1.restobar_rdr.entity.Categoria;
import com.restobar1.restobar_rdr.services.CategoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Maneja peticiones HTTP, devuelve JSON
@RequestMapping("/api/categorias") // URL base: /api/categorias
@CrossOrigin(origins = "*") // Permite peticiones desde cualquier origen
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    // GET /api/categorias -> devuelve todas las categorías
    @GetMapping
    public List<Categoria> listar() {
        return categoriaService.listarTodos();
    }

    // POST /api/categorias -> crea una nueva categoria
    @PostMapping
    public Categoria crear(@RequestBody Categoria categoria) {
        return categoriaService.guardar(categoria);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
    }
}
