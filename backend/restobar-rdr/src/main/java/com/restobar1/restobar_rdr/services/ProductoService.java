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

    public List<Producto> listarTodos() {

        return productoRepository.findAll();
    }

    public Producto guardar(Producto producto) {

        return productoRepository.save(producto);
    }

    public void desactivar(Long id) {
        Producto p = productoRepository.findById(id).orElse(null);
        if (p != null) {
            p.setFechaDesactivacion(LocalDateTime.now());
            productoRepository.save(p);
        }
    }

    public void activar(Long id) {
        Producto p = productoRepository.findById(id).orElse(null);
        if (p != null) {
            p.setFechaDesactivacion(null);
            productoRepository.save(p);
        }
    }
}