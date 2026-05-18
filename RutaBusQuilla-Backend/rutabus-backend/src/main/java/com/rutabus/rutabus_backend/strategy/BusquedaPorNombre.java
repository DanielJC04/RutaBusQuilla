package com.rutabus.rutabus_backend.strategy;

import java.util.List;
import java.util.stream.Collectors;

import com.rutabus.rutabus_backend.model.Ruta;

public class BusquedaPorNombre implements BusquedaStrategy {

    @Override
    public List<Ruta> buscar(List<Ruta> rutas, String criterio) {
        return rutas.stream()
                .filter(r -> r.getNombre().toLowerCase().contains(criterio.toLowerCase()))
                .collect(Collectors.toList());
    }
}