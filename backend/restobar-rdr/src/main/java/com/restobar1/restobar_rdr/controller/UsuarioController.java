package com.restobar1.restobar_rdr.controller;

import com.restobar1.restobar_rdr.entity.Usuario;
import com.restobar1.restobar_rdr.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        Usuario user = usuarioService.obtenerPorId(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario ) {
        return usuarioService.guardar(usuario);
    }

    @PutMapping("/{id}")
    public Usuario editar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return usuarioService.actualizar(id, usuario);
    }

    @PutMapping("/{id}/desactivar")
    public void desactivar(@PathVariable Long id) {
        usuarioService.desactivar(id);
    }

    @PutMapping("/{id}/activar")
    public void activar(@PathVariable Long id) {
        usuarioService.activar(id);
    }
}
