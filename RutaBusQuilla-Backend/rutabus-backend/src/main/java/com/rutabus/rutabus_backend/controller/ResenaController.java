package com.rutabus.rutabus_backend.controller;

import com.rutabus.rutabus_backend.model.Resena;
import com.rutabus.rutabus_backend.service.ResenaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "*")
public class ResenaController {

    private final ResenaService resenaService;

    public ResenaController(ResenaService resenaService) {
        this.resenaService = resenaService;
    }

    @PostMapping
    public Resena crear(@RequestBody Resena resena) {
        return resenaService.guardar(resena);
    }

    @GetMapping("/parada/{paradaId}")
    public List<Resena> obtenerPorParada(@PathVariable Long paradaId) {
        return resenaService.obtenerPorParada(paradaId);
    }
}
