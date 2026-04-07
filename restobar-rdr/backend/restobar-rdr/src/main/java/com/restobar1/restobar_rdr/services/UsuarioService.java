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

    // Este metodo hashea la clave antes de guardar
    public Usuario guardar(Usuario usuario) {
        usuario.setClave(encoder.encode(usuario.getClave()));
        return usuarioRepository.save(usuario);
    }

    public void desactivar(Long id) {
        Usuario u = usuarioRepository.findById(id).orElse(null);
        if (u != null) {
            u.setFechaBaja(LocalDateTime.now());
            usuarioRepository.save(u);
        }
    }
}
