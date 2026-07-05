package com.restobar1.restobar_rdr.repository;

import com.restobar1.restobar_rdr.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    // Spring genera la consulta automaticamente por el nombre del metodo
    boolean existsByCategoria_Id(Integer id);
}
