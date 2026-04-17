package com.restobar1.restobar_rdr.services;

import com.restobar1.restobar_rdr.entity.Producto;
import com.restobar1.restobar_rdr.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // ── LISTAR TODOS ──────────────────────────────────────────
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    // ── OBTENER POR ID ────────────────────────────────────────
    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    // ── CREAR ─────────────────────────────────────────────────
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    // ── EDITAR ────────────────────────────────────────────────
    public Producto actualizar(Long id, Producto datos) {
        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        existente.setNombreProducto(datos.getNombreProducto());
        existente.setPrecioActual(datos.getPrecioActual());
        existente.setDescripcion(datos.getDescripcion());

        // Solo actualiza la categoría si viene en el request
        if (datos.getCategoria() != null) {
            existente.setCategoria(datos.getCategoria());
        }

        return productoRepository.save(existente);
    }

    // ── DESACTIVAR ────────────────────────────────────────────
    public void desactivar(Long id) {
        Producto p = productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        p.setFechaDesactivacion(LocalDateTime.now());
        productoRepository.save(p);
    }

    // ── ACTIVAR ───────────────────────────────────────────────
    public void activar(Long id) {
        Producto p = productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        p.setFechaDesactivacion(null);
        productoRepository.save(p);
    }
}