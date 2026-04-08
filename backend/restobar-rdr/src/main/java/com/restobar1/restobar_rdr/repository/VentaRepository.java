package com.restobar1.restobar_rdr.repository;

import com.restobar1.restobar_rdr.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaRepository extends JpaRepository<Venta,Long> {
}
