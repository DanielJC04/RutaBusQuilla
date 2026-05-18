package com.rutabus.rutabus_backend.strategy;

import java.util.List;

import com.rutabus.rutabus_backend.model.Ruta;

/**
 * Patron Strategy - Comportamiento
 * Define el contrato que deben cumplir todas las estrategias de busqueda.
 */
public interface BusquedaStrategy {
    List<Ruta> buscar(List<Ruta> rutas, String criterio);
}