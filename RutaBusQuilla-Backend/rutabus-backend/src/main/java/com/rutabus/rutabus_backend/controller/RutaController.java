package com.rutabus.rutabus_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rutabus.rutabus_backend.model.Ruta;
import com.rutabus.rutabus_backend.observer.ObstruccionPublisher;
import com.rutabus.rutabus_backend.service.RutaService;

@RestController
@RequestMapping("/api/rutas")
@CrossOrigin(origins = "*")
public class RutaController {

    private final RutaService rutaService;
    private final ObstruccionPublisher obstruccionPublisher;

    public RutaController(RutaService rutaService, ObstruccionPublisher obstruccionPublisher) {
        this.rutaService = rutaService;
        this.obstruccionPublisher = obstruccionPublisher;
    }

    @GetMapping
    public List<Ruta> obtenerTodas() {
        return rutaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ruta> obtenerPorId(@PathVariable Long id) {
        return rutaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Ruta crear(@RequestBody Ruta ruta) {
        return rutaService.guardar(ruta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        rutaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public List<Ruta> buscar(@RequestParam String tipo, @RequestParam String criterio) {
        return rutaService.buscar(tipo, criterio);
    }

    @PostMapping("/obstruccion")
    public String reportarObstruccion(@RequestParam String nombreRuta,
                                       @RequestParam String descripcion) {
        obstruccionPublisher.notificarObstruccion(nombreRuta, descripcion);
        return "Obstruccion reportada en: " + nombreRuta;
    }
}