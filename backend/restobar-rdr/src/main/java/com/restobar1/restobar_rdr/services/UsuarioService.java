package com.restobar1.restobar_rdr.services;

import com.restobar1.restobar_rdr.entity.Usuario;
import com.restobar1.restobar_rdr.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    // Integración con BCrypt
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario guardar(Usuario usuario) {
    // Encripta la clave antes de guardar en la BD
        usuario.setClave(encoder.encode(usuario.getClave()));
        return usuarioRepository.save(usuario);
    }

    // Función de actualizar a un usuario
    public Usuario actualizar(Long id, Usuario datos) {
        Usuario user = usuarioRepository.findById(id).orElse(null);

        if (user == null) return null;

        //Solo actualizamos los campos editables
        user.setNombre(datos.getNombre());
        user.setApellido(datos.getApellido());
        user.setRol(datos.getRol());

        // Solo cambia la clave si se envió una nueva
        if (datos.getClave() != null && !datos.getClave().isBlank()) {
            user.setClave(encoder.encode(datos.getClave()));
        }
        return usuarioRepository.save(user);
    }
// Funciones de borrado lógico activar/desactivar
    public void desactivar(Long id) {
        Usuario user = usuarioRepository.findById(id).orElse(null);
        if (user != null) {
            user.setFechaBaja(LocalDateTime.now());
            usuarioRepository.save(user);
        }
    }

    public void activar (Long id){
        Usuario user = usuarioRepository.findById(id).orElse(null);
        if (user != null) {
             user.setFechaBaja(null);
            usuarioRepository.save(user);
        }
    }
}
