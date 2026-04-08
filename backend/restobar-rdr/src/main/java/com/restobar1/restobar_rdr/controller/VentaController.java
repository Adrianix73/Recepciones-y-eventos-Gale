package com.restobar1.restobar_rdr.controller;

import com.restobar1.restobar_rdr.entity.Venta;
import com.restobar1.restobar_rdr.services.VentaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public List<Venta> listar() {
        return ventaService.listarTodos();
    }

    @PostMapping
    public Venta crear (@RequestBody Venta venta) {
        return ventaService.guardar(venta);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        ventaService.eliminar(id);
    }
}
