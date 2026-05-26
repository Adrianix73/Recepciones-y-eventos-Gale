package com.restobar1.restobar_rdr.services;

import com.restobar1.restobar_rdr.entity.Categoria;
import com.restobar1.restobar_rdr.entity.Producto;
import com.restobar1.restobar_rdr.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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
    public Path obtenerRutaImagen(Long id) {
        productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Path rutaImagen = CARPETA_IMAGENES.resolve(id + ".webp");

        if (!Files.exists(rutaImagen)) {
            return null;
        }

        return rutaImagen;
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

        BufferedImage bufferedImage;

        try (InputStream inputStream = imagen.getInputStream()) {
            bufferedImage = ImageIO.read(inputStream);
        }

        if (bufferedImage == null) {
            throw new IllegalArgumentException("El archivo subido no es una imagen válida o no es compatible.");
        }

        String nombreArchivo = id + ".webp";
        Path rutaArchivo = CARPETA_IMAGENES.resolve(nombreArchivo);

        try (OutputStream outputStream = Files.newOutputStream(rutaArchivo)) {
            boolean convertido = ImageIO.write(bufferedImage, "webp", outputStream);

            if (!convertido) {
                throw new IllegalStateException("No se pudo convertir la imagen a formato WebP.");
            }
        }

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

        String contentType = imagen.getContentType();

        if (contentType == null) {
            throw new IllegalArgumentException("No se pudo identificar el tipo de archivo.");
        }

        if (!contentType.equals("image/jpeg")
                && !contentType.equals("image/png")
                && !contentType.equals("image/webp")) {
            throw new IllegalArgumentException("Solo se permiten imágenes JPG, PNG o WEBP.");
        }
    }

    private void eliminarImagenAnterior(Long id) throws IOException {
        Path rutaImagen = CARPETA_IMAGENES.resolve(id + ".webp");
        Files.deleteIfExists(rutaImagen);
    }
}