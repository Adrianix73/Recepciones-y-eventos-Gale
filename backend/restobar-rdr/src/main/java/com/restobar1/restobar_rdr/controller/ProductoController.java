package com.restobar1.restobar_rdr.controller;

import com.restobar1.restobar_rdr.entity.Producto;
import com.restobar1.restobar_rdr.services.ProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<Producto> listar() {
        return productoService.listarTodos();
    }

    @PostMapping
    public Producto crear(@RequestBody Producto producto) {
        return productoService.guardar(producto);
    }

    @PutMapping("/{id}/desactivar")
    public void desactivar(@PathVariable Long id) {
        productoService.desactivar(id);
    }

    @PutMapping("/{id}/activar")
    public void activar (@PathVariable Long id) {
        productoService.activar(id);
    }
}
