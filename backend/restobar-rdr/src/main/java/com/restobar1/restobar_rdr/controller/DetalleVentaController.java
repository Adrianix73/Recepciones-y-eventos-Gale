package com.restobar1.restobar_rdr.controller;

import com.restobar1.restobar_rdr.entity.DetalleVenta;
import com.restobar1.restobar_rdr.services.DetalleVentaService;
import com.restobar1.restobar_rdr.services.VentaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/detalle_ventas")
@CrossOrigin(origins = "*")
public class DetalleVentaController {

    private final DetalleVentaService detalleVentaService;

    public DetalleVentaController(DetalleVentaService detalleVentaService) {
        this.detalleVentaService = detalleVentaService;
    }

    @GetMapping
    public List<DetalleVenta> listar() {
        return detalleVentaService.listarTodos();
    }

    @PostMapping
    public DetalleVenta crear(@RequestBody DetalleVenta detalleVenta) {
        return detalleVentaService.guardar(detalleVenta);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        detalleVentaService.eliminar(id);
    }
}
