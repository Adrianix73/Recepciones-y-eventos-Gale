package com.restobar1.restobar_rdr.services;

import com.restobar1.restobar_rdr.entity.Categoria;
import com.restobar1.restobar_rdr.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    // Spring inyecta el repository automaticamente por el constructor
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> listarTodos() {
        return categoriaRepository.findAll();
    }

    public Categoria guardar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public void  eliminar(Long id) {
        categoriaRepository.deleteById(id);
    }

}
