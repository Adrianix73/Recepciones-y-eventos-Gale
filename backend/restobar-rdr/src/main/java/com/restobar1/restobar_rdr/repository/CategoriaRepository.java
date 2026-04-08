package com.restobar1.restobar_rdr.repository;

import com.restobar1.restobar_rdr.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    // JpaRepository ya incluye: findAll(), finById(), save(), deleteById(), etc.
}
