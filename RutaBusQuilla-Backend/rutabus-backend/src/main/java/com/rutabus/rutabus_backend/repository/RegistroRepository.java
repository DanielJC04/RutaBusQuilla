package com.rutabus.rutabus_backend.repository;

import com.rutabus.rutabus_backend.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    Optional<Registro> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
}
