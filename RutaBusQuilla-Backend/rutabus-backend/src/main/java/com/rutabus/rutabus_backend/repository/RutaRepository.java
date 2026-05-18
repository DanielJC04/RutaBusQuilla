package com.rutabus.rutabus_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rutabus.rutabus_backend.model.Ruta;

public interface RutaRepository extends JpaRepository<Ruta, Long> {
}