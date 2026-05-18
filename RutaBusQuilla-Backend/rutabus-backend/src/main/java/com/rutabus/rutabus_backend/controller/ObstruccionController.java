package com.rutabus.rutabus_backend.controller;

import com.rutabus.rutabus_backend.model.Obstruccion;
import com.rutabus.rutabus_backend.observer.ObstruccionPublisher;
import com.rutabus.rutabus_backend.service.ObstruccionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/obstrucciones")
@CrossOrigin(origins = "*")
public class ObstruccionController {

    private final ObstruccionService obstruccionService;
    private final ObstruccionPublisher obstruccionPublisher;

    public ObstruccionController(ObstruccionService obstruccionService, ObstruccionPublisher obstruccionPublisher) {
        this.obstruccionService = obstruccionService;
        this.obstruccionPublisher = obstruccionPublisher;
    }

    @PostMapping
    public Obstruccion crear(@RequestBody Obstruccion obstruccion) {
        obstruccionPublisher.notificarObstruccion(obstruccion.getNombreRuta(), obstruccion.getDescripcion());
        return obstruccionService.guardar(obstruccion);
    }

    @GetMapping
    public List<Obstruccion> obtenerTodas() {
        return obstruccionService.obtenerTodas();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Obstruccion> actualizar(@PathVariable Long id, @RequestBody Obstruccion datos) {
        return ResponseEntity.ok(obstruccionService.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        obstruccionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
