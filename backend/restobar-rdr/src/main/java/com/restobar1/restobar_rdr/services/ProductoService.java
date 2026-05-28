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
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    private static final Path CARPETA_IMAGENES = Paths.get("uploads", "productos");

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

    // ── CREAR PRODUCTO (SOLO DATOS) ───────────────────────────
    public Producto guardar(String nombreProducto,
                            Double precioActual,
                            String descripcion,
                            Long categoriaId) {

        validarDatos(nombreProducto, precioActual, categoriaId);

        Producto producto = new Producto();
        producto.setNombreProducto(nombreProducto);
        producto.setPrecioActual(precioActual);
        producto.setDescripcion(descripcion);

        Categoria categoria = new Categoria();
        categoria.setId(categoriaId);
        producto.setCategoria(categoria);

        return productoRepository.save(producto);
    }

    // ── EDITAR PRODUCTO (SOLO DATOS) ──────────────────────────
    public Producto actualizar(Long id,
                               String nombreProducto,
                               Double precioActual,
                               String descripcion,
                               Long categoriaId) {

        validarDatos(nombreProducto, precioActual, categoriaId);

        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        existente.setNombreProducto(nombreProducto);
        existente.setPrecioActual(precioActual);
        existente.setDescripcion(descripcion);

        Categoria categoria = new Categoria();
        categoria.setId(categoriaId);
        existente.setCategoria(categoria);

        return productoRepository.save(existente);
    }

    // ── SUBIR IMAGEN ──────────────────────────────────────────
    public Producto subirImagen(Long id, MultipartFile imagen) throws IOException {
        return guardarOReemplazarImagen(id, imagen);
    }

    // ── REEMPLAZAR IMAGEN ─────────────────────────────────────
    public Producto reemplazarImagen(Long id, MultipartFile imagen) throws IOException {
        return guardarOReemplazarImagen(id, imagen);
    }

    // ── OBTENER RUTA DE IMAGEN POR ID ─────────────────────────
    public Path obtenerRutaImagen(Long id) throws IOException {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (!Files.exists(CARPETA_IMAGENES)) {
            return null;
        }

        try (Stream<Path> archivos = Files.list(CARPETA_IMAGENES)) {
            return archivos
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().startsWith(producto.getId() + "."))
                    .findFirst()
                    .orElse(null);
        }
    }

    // ── DESACTIVAR ────────────────────────────────────────────
    public void desactivar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setFechaDesactivacion(LocalDateTime.now());
        productoRepository.save(producto);
    }

    // ── ACTIVAR ───────────────────────────────────────────────
    public void activar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setFechaDesactivacion(null);
        productoRepository.save(producto);
    }

    // ── HELPER PRINCIPAL DE IMAGEN ────────────────────────────
    private Producto guardarOReemplazarImagen(Long id, MultipartFile imagen) throws IOException {
        validarImagen(imagen);

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Files.createDirectories(CARPETA_IMAGENES);

        eliminarImagenAnterior(id);

        String extension = obtenerExtensionValida(imagen.getOriginalFilename());
        String nombreArchivo = id + extension;
        Path rutaArchivo = CARPETA_IMAGENES.resolve(nombreArchivo);

        Files.copy(imagen.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

        // Guardamos una referencia útil para el frontend.
        // Así luego podrás usar producto.getImagen() si quieres.
        producto.setImagen("/api/productos/" + id + "/imagen");

        return productoRepository.save(producto);
    }

    private void validarDatos(String nombreProducto, Double precioActual, Long categoriaId) {
        if (nombreProducto == null || nombreProducto.isBlank()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio.");
        }

        if (precioActual == null) {
            throw new IllegalArgumentException("El precio actual es obligatorio.");
        }

        if (categoriaId == null) {
            throw new IllegalArgumentException("La categoría es obligatoria.");
        }
    }

    private void validarImagen(MultipartFile imagen) {
        if (imagen == null || imagen.isEmpty()) {
            throw new IllegalArgumentException("Debe seleccionar una imagen.");
        }
    }

    private String obtenerExtensionValida(String nombreArchivo) {
        if (nombreArchivo == null || !nombreArchivo.contains(".")) {
            throw new IllegalArgumentException("El archivo no tiene una extensión válida.");
        }

        String extension = nombreArchivo.substring(nombreArchivo.lastIndexOf(".")).toLowerCase();

        return switch (extension) {
            case ".jpg", ".jpeg" -> ".jpg";
            case ".png" -> ".png";
            case ".webp" -> ".webp";
            case ".gif" -> ".gif";
            case ".avif" -> ".avif";
            default -> throw new IllegalArgumentException("Formato de imagen no permitido.");
        };
    }

    private void eliminarImagenAnterior(Long id) throws IOException {
        if (!Files.exists(CARPETA_IMAGENES)) {
            return;
        }

        List<Path> archivosAEliminar;

        try (Stream<Path> archivos = Files.list(CARPETA_IMAGENES)) {
            archivosAEliminar = archivos
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().startsWith(id + "."))
                    .toList();
        }

        for (Path archivo : archivosAEliminar) {
            Files.deleteIfExists(archivo);
        }
    }
}