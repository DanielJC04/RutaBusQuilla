package com.rutabus.rutabus_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.rutabus.rutabus_backend.GestorDeRutas;
import com.rutabus.rutabus_backend.model.Ruta;
import com.rutabus.rutabus_backend.repository.RutaRepository;
import com.rutabus.rutabus_backend.strategy.BusquedaPorNombre;
import com.rutabus.rutabus_backend.strategy.BusquedaPorParada;
import com.rutabus.rutabus_backend.strategy.BusquedaPorUbicacion;
import com.rutabus.rutabus_backend.strategy.BusquedaStrategy;

@Service
public class RutaService {

    private final RutaRepository rutaRepository;

    public RutaService(RutaRepository rutaRepository) {
        this.rutaRepository = rutaRepository;
    }

    public List<Ruta> obtenerTodas() {
        List<Ruta> rutas = rutaRepository.findAll();
        // Singleton en accion - actualizamos el estado global del sistema
        GestorDeRutas.getInstancia().setTotalRutasActivas(rutas.size());
        return rutas;
    }

    public Optional<Ruta> obtenerPorId(Long id) {
        return rutaRepository.findById(id);
    }

    public Ruta guardar(Ruta ruta) {
        return rutaRepository.save(ruta);
    }

    public void eliminar(Long id) {
        rutaRepository.deleteById(id);
    }

    public List<Ruta> buscar(String tipo, String criterio) {
        List<Ruta> todasLasRutas = rutaRepository.findAll();
        BusquedaStrategy estrategia = seleccionarEstrategia(tipo);
        return estrategia.buscar(todasLasRutas, criterio);
    }

    private BusquedaStrategy seleccionarEstrategia(String tipo) {
        return switch (tipo) {
        case "parada"    -> new BusquedaPorParada();
        case "ubicacion" -> new BusquedaPorUbicacion();
        default          -> new BusquedaPorNombre();
    };
    }

}