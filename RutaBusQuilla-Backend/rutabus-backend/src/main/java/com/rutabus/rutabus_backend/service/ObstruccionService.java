package com.rutabus.rutabus_backend.service;

import com.rutabus.rutabus_backend.model.Obstruccion;
import com.rutabus.rutabus_backend.repository.ObstruccionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ObstruccionService {

    private final ObstruccionRepository obstruccionRepository;

    public ObstruccionService(ObstruccionRepository obstruccionRepository) {
        this.obstruccionRepository = obstruccionRepository;
    }

    public Obstruccion guardar(Obstruccion obstruccion) {
        return obstruccionRepository.save(obstruccion);
    }

    public List<Obstruccion> obtenerTodas() {
        return obstruccionRepository.findAllByOrderByFechaDesc();
    }

    public Optional<Obstruccion> obtenerPorId(Long id) {
        return obstruccionRepository.findById(id);
    }

    public Obstruccion actualizar(Long id, Obstruccion datos) {
        return obstruccionRepository.findById(id).map(o -> {
            o.setDescripcion(datos.getDescripcion());
            o.setActiva(datos.isActiva());
            return obstruccionRepository.save(o);
        }).orElseThrow(() -> new RuntimeException("Obstruccion no encontrada"));
    }

    public void eliminar(Long id) {
        obstruccionRepository.deleteById(id);
    }
}
