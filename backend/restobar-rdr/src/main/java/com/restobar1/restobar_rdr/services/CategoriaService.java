package com.restobar1.restobar_rdr.services;

import com.restobar1.restobar_rdr.entity.Categoria;
import com.restobar1.restobar_rdr.repository.CategoriaRepository;
import com.restobar1.restobar_rdr.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository,
                            ProductoRepository productoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    public List<Categoria> listarTodos() {
        return categoriaRepository.findAll();
    }

    public Categoria guardar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria editar(Long id, Categoria categoriaActualizada) {
        Categoria categoriaExistente = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));

        categoriaExistente.setNombreCategoria(categoriaActualizada.getNombreCategoria());

        return categoriaRepository.save(categoriaExistente);
    }

    public void  eliminar(Long id) {
        boolean tieneProductos = productoRepository.existsByCategoria_Id(id);

        if (tieneProductos) {
            throw new RuntimeException("No se puede eliminar, la categoría tiene productos asignados");
        }
        categoriaRepository.deleteById(id);
    }

}
