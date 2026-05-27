package com.restobar1.restobar_rdr.controller;

import com.restobar1.restobar_rdr.entity.Usuario;
import com.restobar1.restobar_rdr.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    //Uso el retorno ResponseEntity para enviar un objeto JSON y códigos HTTP correctos
    public ResponseEntity<?> login(@RequestBody Usuario login) {

        // 1. Busca el usuario por nombre
        Usuario user = usuarioRepository.findByNombre(login.getNombre());

        // 2. Si no existe
        if (user == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        // 3. Compara la clave ingresada con el hash guardado
        boolean ok = encoder.matches(login.getClave(), user.getClave());

        if (ok) { // Devolvemos el objeto usuario completo con estado 200 OK
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("Clave incorrecta");
        }
    }
}
