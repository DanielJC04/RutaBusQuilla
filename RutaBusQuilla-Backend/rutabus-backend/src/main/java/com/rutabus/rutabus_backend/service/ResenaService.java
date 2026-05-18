package com.rutabus.rutabus_backend.service;

import com.rutabus.rutabus_backend.model.Resena;
import com.rutabus.rutabus_backend.repository.ResenaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResenaService {

    private final ResenaRepository resenaRepository;

    public ResenaService(ResenaRepository resenaRepository) {
        this.resenaRepository = resenaRepository;
    }

    public Resena guardar(Resena resena) {
        return resenaRepository.save(resena);
    }

    public List<Resena> obtenerPorParada(Long paradaId) {
        return resenaRepository.findByParadaIdOrderByFechaDesc(paradaId);
    }
}
