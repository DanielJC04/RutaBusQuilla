package com.rutabus.rutabus_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rutabus.rutabus_backend.GestorDeRutas;
import com.rutabus.rutabus_backend.service.RutaService;

/**
 * Patron GRASP Controller
 * Coordina los eventos del sistema sin mezclar logica de negocio.
 * Delega el trabajo al Service y al GestorDeRutas (Singleton).
 * Es el punto de entrada para consultas sobre el estado del sistema.
 */
@RestController
@RequestMapping("/api/sistema")
@CrossOrigin(origins = "*")
public class SistemaController {

    private final RutaService rutaService;

    public SistemaController(RutaService rutaService) {
        this.rutaService = rutaService;
    }

    // GET /api/sistema/estado
    @GetMapping("/estado")
    public Map<String, Object> obtenerEstado() {
        // Coordina: obtiene datos del service y del Singleton
        int totalRutas = rutaService.obtenerTodas().size();
        GestorDeRutas.getInstancia().setTotalRutasActivas(totalRutas);

        Map<String, Object> estado = new HashMap<>();
        estado.put("ciudad", GestorDeRutas.getInstancia().getCiudadActiva());
        estado.put("totalRutas", GestorDeRutas.getInstancia().getTotalRutasActivas());
        estado.put("estadoSistema", GestorDeRutas.getInstancia().getEstadoSistema());
        estado.put("sistemaActivo", true);
        return estado;
    }
}
