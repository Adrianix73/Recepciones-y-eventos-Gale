package com.restobar1.restobar_rdr.repository;

import com.restobar1.restobar_rdr.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Spring genera la consulta automáticamnete por el nombre del método
    boolean existsByCategoria_Id(Long id);
}
