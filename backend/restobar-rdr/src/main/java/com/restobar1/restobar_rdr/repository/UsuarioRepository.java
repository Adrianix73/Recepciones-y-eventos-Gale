package com.restobar1.restobar_rdr.repository;

import com.restobar1.restobar_rdr.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Esto le dices Spring que busque por el campo "nombre"
    Usuario findByNombre(String nombre);
}
