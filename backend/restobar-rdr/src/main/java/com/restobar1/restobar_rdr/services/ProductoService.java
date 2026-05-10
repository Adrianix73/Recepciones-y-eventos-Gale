package com.restobar1.restobar_rdr.services;

import com.restobar1.restobar_rdr.entity.Categoria;
import com.restobar1.restobar_rdr.entity.Producto;
import com.restobar1.restobar_rdr.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    // Carpeta donde se guardan las imágenes
    private static final String CARPETA_IMAGENES = "uploads/productos";

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

    // ── CREAR (CON IMAGEN) ──────────────────────────────────────
    public Producto guardar(
            String nombreProducto,
            Double precioActual,
            String descripcion,
            Long categoriaId,
            MultipartFile imagen
    ) throws IOException {

        Producto p = new Producto();
        p.setNombreProducto(nombreProducto);
        p.setPrecioActual(precioActual);
        p.setDescripcion(descripcion);

        Categoria cat = new Categoria();
        cat.setId(categoriaId);
        p.setCategoria(cat);

        // Guarda la imagen si viene
        if (imagen != null && !imagen.isEmpty()) {
            String rutaImagen = guardarArchivo(imagen);
            p.setImagen(rutaImagen);
        }

        return productoRepository.save(p);
    }

    // ── EDITAR (CON IMAGEN) ─────────────────────────────────────
    public Producto actualizar(
            Long id,
            String nombreProducto,
            Double precioActual,
            String descripcion,
            Long categoriaId,
            MultipartFile imagen
    ) throws IOException {

        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        existente.setNombreProducto(nombreProducto);
        existente.setPrecioActual(precioActual);
        existente.setDescripcion(descripcion);

        if (categoriaId != null) {
            Categoria cat = new Categoria();
            cat.setId(categoriaId);
            existente.setCategoria(cat);
        }

        // Solo reemplaza la imagen si se subió una nueva
        if (imagen != null && !imagen.isEmpty()) {
            String rutaImagen = guardarArchivo(imagen);
            existente.setImagen(rutaImagen);
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

    // ── HELPER: guarda el archivo y devuelve la ruta ──────────
    private String guardarArchivo(MultipartFile archivo) throws IOException {
        String nombreArchivo = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
        Path ruta = Paths.get(CARPETA_IMAGENES + nombreArchivo);
        Files.createDirectories(ruta.getParent());
        Files.write(ruta, archivo.getBytes());
        return "/" + CARPETA_IMAGENES + nombreArchivo;
    }

}